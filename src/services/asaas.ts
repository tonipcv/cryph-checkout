import { ASAAS_CONFIG } from '@/config/asaas';
import { Customer, Payment, Subscription, BillingType } from '@/types/payment';

class AsaasService {
  private baseUrl = ASAAS_CONFIG.BASE_URL;
  private apiKey = ASAAS_CONFIG.API_KEY;

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'access_token': this.apiKey,
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.errors?.[0]?.description || 'Erro na requisição');
    }

    return response.json();
  }

  // Customer Management
  async createCustomer(data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer> {
    return this.request('/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCustomer(id: string): Promise<Customer> {
    return this.request(`/customers/${id}`);
  }

  // Payment Management
  async createPayment(data: {
    customer: string;
    billingType: BillingType;
    value: number;
    dueDate: string;
    creditCard?: {
      holderName: string;
      number: string;
      expiryMonth: string;
      expiryYear: string;
      ccv: string;
    };
  }): Promise<Payment> {
    return this.request('/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPayment(id: string): Promise<Payment> {
    return this.request(`/payments/${id}`);
  }

  async getPixQrCode(paymentId: string): Promise<{ encodedImage: string; payload: string; }> {
    return this.request(`/payments/${paymentId}/pixQrCode`);
  }

  // Subscription Management
  async createSubscription(data: {
    customer: string;
    billingType: BillingType;
    value: number;
    nextDueDate: string;
    cycle: Subscription['cycle'];
    description?: string;
    creditCard?: {
      holderName: string;
      number: string;
      expiryMonth: string;
      expiryYear: string;
      ccv: string;
    };
  }): Promise<Subscription> {
    return this.request('/subscriptions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getSubscription(id: string): Promise<Subscription> {
    return this.request(`/subscriptions/${id}`);
  }

  async cancelSubscription(id: string): Promise<Subscription> {
    return this.request(`/subscriptions/${id}/cancel`, {
      method: 'POST',
    });
  }
}

export const asaasService = new AsaasService(); 