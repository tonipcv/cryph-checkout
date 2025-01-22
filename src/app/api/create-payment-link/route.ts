import { NextResponse } from 'next/server';
import { ASAAS_CONFIG } from '@/config/asaas';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, cpfCnpj, phone, paymentMethod } = body;

    console.log('Dados recebidos:', { name, email, cpfCnpj, phone, paymentMethod });

    // 1. Criar cliente no banco local
    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        cpfCnpj,
        phone,
      },
    });

    console.log('Cliente criado no banco local:', customer);

    // 2. Criar cliente no Asaas
    const customerData = {
      name,
      email,
      cpfCnpj: cpfCnpj.replace(/\D/g, ''),
      phone: phone.replace(/\D/g, ''),
      notificationDisabled: false
    };

    console.log('Tentando criar cliente no Asaas:', {
      url: `${ASAAS_CONFIG.BASE_URL}/customers`,
      data: customerData
    });

    const customerResponse = await fetch(`${ASAAS_CONFIG.BASE_URL}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_CONFIG.API_KEY
      },
      body: JSON.stringify(customerData),
    });

    if (!customerResponse.ok) {
      const errorText = await customerResponse.text();
      console.error('Erro ao criar cliente no Asaas:', {
        status: customerResponse.status,
        statusText: customerResponse.statusText,
        body: errorText,
        headers: Object.fromEntries(customerResponse.headers.entries())
      });
      throw new Error(`Erro ao criar cliente no Asaas: ${errorText}`);
    }

    const asaasCustomer = await customerResponse.json();
    console.log('Cliente criado no Asaas:', asaasCustomer);

    // 3. Criar pagamento
    const paymentData = {
      customer: asaasCustomer.id,
      billingType: paymentMethod,
      value: 10.00,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: "Assinatura Anual CRYPH",
      externalReference: customer.id,
      remoteIp: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
    };

    console.log('Tentando criar pagamento:', {
      url: `${ASAAS_CONFIG.BASE_URL}/payments`,
      data: paymentData
    });

    const paymentResponse = await fetch(`${ASAAS_CONFIG.BASE_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_CONFIG.API_KEY
      },
      body: JSON.stringify(paymentData),
    });

    if (!paymentResponse.ok) {
      const errorText = await paymentResponse.text();
      console.error('Erro ao criar pagamento:', {
        status: paymentResponse.status,
        statusText: paymentResponse.statusText,
        body: errorText,
        headers: Object.fromEntries(paymentResponse.headers.entries())
      });
      throw new Error(`Erro ao criar pagamento: ${errorText}`);
    }

    const payment = await paymentResponse.json();
    console.log('Pagamento criado:', payment);

    // 4. Se for PIX, gerar QR Code
    if (paymentMethod === 'PIX') {
      console.log('Gerando QR Code PIX:', {
        url: `${ASAAS_CONFIG.BASE_URL}/payments/${payment.id}/pixQrCode`
      });

      const pixResponse = await fetch(`${ASAAS_CONFIG.BASE_URL}/payments/${payment.id}/pixQrCode`, {
        headers: {
          'access_token': ASAAS_CONFIG.API_KEY
        },
      });

      if (!pixResponse.ok) {
        const errorText = await pixResponse.text();
        console.error('Erro ao gerar QR Code:', {
          status: pixResponse.status,
          statusText: pixResponse.statusText,
          body: errorText,
          headers: Object.fromEntries(pixResponse.headers.entries())
        });
        throw new Error(`Erro ao gerar QR Code: ${errorText}`);
      }

      const pixData = await pixResponse.json();
      console.log('QR Code gerado:', pixData);

      // 5. Criar registro do pagamento no banco local
      await prisma.payment.create({
        data: {
          customerId: customer.id,
          amount: 10.00,
          paymentMethod,
          status: 'PENDING',
          asaasId: payment.id,
          pixCode: pixData.payload,
          pixQrCode: pixData.encodedImage,
          expiresAt: new Date(payment.dueDate)
        },
      });

      return NextResponse.json({
        success: true,
        pixData: {
          encodedImage: pixData.encodedImage,
          payload: pixData.payload
        }
      });
    } else if (paymentMethod === 'CREDIT_CARD') {
      // 5. Criar registro do pagamento no banco local
      await prisma.payment.create({
        data: {
          customerId: customer.id,
          amount: 10.00,
          paymentMethod,
          status: 'PENDING',
          asaasId: payment.id,
          expiresAt: new Date(payment.dueDate)
        },
      });

      return NextResponse.json({
        success: true,
        paymentId: payment.id,
        customerId: asaasCustomer.id
      });
    } else {
      // 5. Criar registro do pagamento no banco local
      await prisma.payment.create({
        data: {
          customerId: customer.id,
          amount: 10.00,
          paymentMethod,
          status: 'PENDING',
          asaasId: payment.id,
          expiresAt: new Date(payment.dueDate)
        },
      });

      return NextResponse.json({
        success: true,
        bankSlipUrl: payment.bankSlipUrl,
        invoiceUrl: payment.invoiceUrl,
        dueDate: payment.dueDate
      });
    }
  } catch (error) {
    console.error('Erro detalhado:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro ao processar pagamento' 
    }, { status: 500 });
  }
} 