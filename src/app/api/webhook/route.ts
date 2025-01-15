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
    
    const { payment } = body;

    console.log('Webhook headers:', Object.fromEntries(request.headers.entries()));
    console.log('Webhook body:', body);

    // Encontrar e atualizar o pagamento
    const updatedPayment = await prisma.payment.update({
      where: { asaasId: payment.id },
      data: {
        status: payment.status,
        webhookData: JSON.parse(JSON.stringify(body)),
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