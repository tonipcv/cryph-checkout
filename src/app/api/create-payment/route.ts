import { NextResponse } from 'next/server';
import { ASAAS_CONFIG } from '@/config/asaas';
import { prisma } from '@/lib/prisma';
import type { CustomerData, PaymentData } from '@/types/payment';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { paymentMethod, amount, name, email, cpfCnpj, phone, ...cardData } = body;

    // Criar cliente no banco local
    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        cpfCnpj,
        phone,
      },
    });

    // Criar cliente no Asaas
    const asaasCustomer = await createAsaasCustomer({ name, email, cpfCnpj, phone });

    // Dados do pagamento
    const paymentData = {
      customer: asaasCustomer.id,
      billingType: paymentMethod,
      value: amount,
      dueDate: new Date(Date.now() + ASAAS_CONFIG.PAYMENT_DEADLINE_HOURS * 60 * 60 * 1000).toISOString().split('T')[0],
      ...(paymentMethod === 'CREDIT_CARD' && {
        creditCard: {
          holderName: cardData.holderName,
          number: cardData.cardNumber,
          expiryMonth: cardData.expiryMonth,
          expiryYear: cardData.expiryYear,
          ccv: cardData.cvv,
        },
      }),
    };

    // Criar pagamento no Asaas
    const asaasPayment = await createAsaasPayment(paymentData);

    // Criar pagamento no banco local
    const payment = await prisma.payment.create({
      data: {
        customerId: customer.id,
        amount: parseFloat(amount),
        paymentMethod,
        status: 'PENDING',
        asaasId: asaasPayment.id,
        expiresAt: new Date(Date.now() + ASAAS_CONFIG.PAYMENT_DEADLINE_HOURS * 60 * 60 * 1000),
      },
    });

    // Se for PIX, buscar dados do QR Code
    if (paymentMethod === 'PIX') {
      try {
        await new Promise(resolve => setTimeout(resolve, ASAAS_CONFIG.RETRY_DELAY_MS));
        const pixData = await getPixQrCode(asaasPayment.id);

        // Atualizar pagamento com dados do PIX
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            pixCode: pixData.payload,
            pixQrCode: pixData.encodedImage,
          },
        });

        return NextResponse.json({
          success: true,
          ...asaasPayment,
          ...pixData,
        });
      } catch (pixError) {
        console.error('Erro ao gerar PIX:', pixError);
        return NextResponse.json({
          success: false,
          error: 'Erro ao gerar QR Code PIX',
          payment: asaasPayment,
        });
      }
    }

    return NextResponse.json({ success: true, ...asaasPayment });
  } catch (error) {
    console.error('Erro ao processar pagamento:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro ao processar pagamento' 
    }, { status: 500 });
  }
}

// Funções auxiliares
async function createAsaasCustomer(customerData: CustomerData) {
  console.log('Criando cliente no Asaas:', {
    url: `${ASAAS_CONFIG.BASE_URL}/customers`,
    customerData
  });

  const response = await fetch(`${ASAAS_CONFIG.BASE_URL}/customers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ASAAS_CONFIG.API_KEY}`
    },
    body: JSON.stringify({
      name: customerData.name,
      email: customerData.email,
      cpfCnpj: customerData.cpfCnpj.replace(/\D/g, ''),
      phone: customerData.phone.replace(/\D/g, ''),
      notificationDisabled: true
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Erro na resposta do Asaas:', {
      status: response.status,
      statusText: response.statusText,
      body: errorText,
      headers: Object.fromEntries(response.headers.entries())
    });
    throw new Error(`Erro ao criar cliente: ${response.statusText || 'Unauthorized'}`);
  }

  const customer = await response.json();
  
  if (customer.errors) {
    console.error('Erros retornados pelo Asaas:', customer.errors);
    throw new Error(customer.errors[0].description || 'Erro ao criar cliente');
  }

  return customer;
}

async function createAsaasPayment(paymentData: PaymentData) {
  console.log('Criando pagamento no Asaas:', {
    url: `${ASAAS_CONFIG.BASE_URL}/payments`,
    paymentData
  });

  const response = await fetch(`${ASAAS_CONFIG.BASE_URL}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ASAAS_CONFIG.API_KEY}`
    },
    body: JSON.stringify(paymentData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Erro na resposta do Asaas:', {
      status: response.status,
      statusText: response.statusText,
      body: errorText,
      headers: Object.fromEntries(response.headers.entries())
    });
    throw new Error(`Erro ao criar pagamento: ${response.statusText || 'Unauthorized'}`);
  }

  const payment = await response.json();

  if (payment.errors) {
    console.error('Erros retornados pelo Asaas:', payment.errors);
    throw new Error(payment.errors[0].description || 'Erro ao criar pagamento');
  }

  return payment;
}

async function getPixQrCode(paymentId: string) {
  console.log('Gerando QR Code PIX:', {
    url: `${ASAAS_CONFIG.BASE_URL}/payments/${paymentId}/pixQrCode`
  });

  const response = await fetch(`${ASAAS_CONFIG.BASE_URL}/payments/${paymentId}/pixQrCode`, {
    headers: {
      'Authorization': `Bearer ${ASAAS_CONFIG.API_KEY}`
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Erro na resposta do Asaas:', {
      status: response.status,
      statusText: response.statusText,
      body: errorText,
      headers: Object.fromEntries(response.headers.entries())
    });
    throw new Error(`Erro ao gerar QR Code: ${response.statusText || 'Unauthorized'}`);
  }

  const data = await response.json();

  if (data.errors) {
    console.error('Erros retornados pelo Asaas:', data.errors);
    throw new Error(data.errors[0].description || 'Erro ao gerar QR Code PIX');
  }

  return data;
} 