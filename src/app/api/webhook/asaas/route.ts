/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ASAAS_CONFIG } from '@/config/asaas';

export async function POST(request: Request) {
  try {
    const signature = request.headers.get('asaas-signature');
    if (!signature || signature !== ASAAS_CONFIG.WEBHOOK_TOKEN) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const body = await request.json();
    const { event, payment } = body;

    // Encontrar e atualizar o pagamento
    const updatedPayment = await prisma.payment.update({
      where: { asaasId: payment.id },
      data: {
        status: payment.status,
        webhookData: body, // Salvar payload completo do webhook
        updatedAt: new Date(),
      },
    });

    console.log(`Payment ${payment.id} status updated to ${payment.status}`);

    return NextResponse.json({ 
      success: true, 
      paymentId: updatedPayment.id, 
      status: payment.status 
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 