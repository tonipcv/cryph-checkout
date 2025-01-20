/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ASAAS_CONFIG } from '@/config/asaas';
import type { WebhookPayload } from '@/types/payment';

export async function POST(request: Request) {
  try {
    const signature = request.headers.get('asaas-signature');
    if (!signature || signature !== ASAAS_CONFIG.WEBHOOK_TOKEN) {
      console.log('Invalid webhook signature:', signature);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const body = await request.json() as WebhookPayload;
    console.log('Webhook received:', body);
    
    const { event, payment } = body;

    // Buscar o pagamento pelo asaasId
    const existingPayment = await prisma.payment.findUnique({
      where: { asaasId: payment.id },
      include: { customer: true }
    });

    if (!existingPayment) {
      console.error(`Payment not found with asaasId: ${payment.id}`);
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    // Atualizar o status do pagamento
    const updatedPayment = await prisma.payment.update({
      where: { id: existingPayment.id },
      data: {
        status: payment.status,
        webhookData: JSON.parse(JSON.stringify(body)),
        updatedAt: new Date(),
      },
      include: { customer: true }
    });

    console.log(`Payment ${payment.id} status updated to ${payment.status}`);

    // Se o pagamento foi confirmado, atualizar o status da assinatura
    if (payment.status === 'CONFIRMED' || payment.status === 'RECEIVED') {
      const customer = await prisma.customer.findUnique({
        where: { id: updatedPayment.customerId }
      });

      if (customer) {
        // TODO: Atualizar status da assinatura
        console.log('Customer found:', customer.email);
      }
    }

    return NextResponse.json({ 
      success: true, 
      paymentId: updatedPayment.id, 
      status: payment.status,
      customerEmail: existingPayment.customer.email
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 