export type PaymentStatus = 
  | 'PENDING'
  | 'RECEIVED'
  | 'CONFIRMED'
  | 'OVERDUE'
  | 'REFUNDED'
  | 'RECEIVED_IN_CASH'
  | 'REFUND_REQUESTED'
  | 'CHARGEBACK_REQUESTED'
  | 'CHARGEBACK_DISPUTE'
  | 'AWAITING_CHARGEBACK_REVERSAL'
  | 'DUNNING_REQUESTED'
  | 'DUNNING_RECEIVED'
  | 'AWAITING_RISK_ANALYSIS';

export type PaymentType = 'PAYMENT' | 'SUBSCRIPTION';
export type BillingType = 'PIX' | 'CREDIT_CARD' | 'BOLETO';

export interface Customer {
  id: string;
  name: string;
  email: string;
  cpfCnpj: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  customer: string;
  billingType: BillingType;
  value: number;
  netValue: number;
  status: PaymentStatus;
  dueDate: Date;
  paymentDate?: Date;
  clientPaymentDate?: Date;
  invoiceUrl?: string;
  bankSlipUrl?: string;
  transactionReceiptUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  id: string;
  customer: string;
  billingType: BillingType;
  value: number;
  nextDueDate: Date;
  cycle: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'SEMIANNUALLY' | 'YEARLY';
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED' | 'OVERDUE' | 'CANCELED';
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WebhookEvent {
  event: string;
  payment?: Payment;
  subscription?: Subscription;
  customer?: Customer;
  timestamp: Date;
}

export interface CustomerData {
  name: string;
  email: string;
  cpfCnpj: string;
  phone: string;
}

export interface PaymentData {
  customer: string;
  billingType: string;
  value: number;
  dueDate: string;
  creditCard?: {
    holderName: string;
    number: string;
    expiryMonth: string;
    expiryYear: string;
    ccv: string;
  };
}

export interface WebhookPayload {
  event: string;
  payment: {
    id: string;
    status: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
} 