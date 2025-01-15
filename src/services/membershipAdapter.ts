import { MembershipService, MembershipStatus } from '@/types/membership';

// Este é um exemplo de adaptador. Você deve implementar a lógica real
// de acordo com seu sistema de membership existente
export class MembershipAdapter implements MembershipService {
  private apiUrl: string;

  constructor() {
    // Configure a URL da sua API de membership
    this.apiUrl = process.env.MEMBERSHIP_API_URL || 'http://localhost:3001/api';
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.apiUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        // Adicione aqui qualquer header necessário para autenticação
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Membership API error: ${response.statusText}`);
    }

    return response.json();
  }

  async updateMemberStatus(userId: string, paymentInfo: {
    status: 'active' | 'inactive' | 'expired';
    paymentId?: string;
    subscriptionId?: string;
    expiresAt?: Date;
    plan: string;
  }): Promise<void> {
    await this.request('/membership/status', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        ...paymentInfo,
      }),
    });
  }

  async getMembershipStatus(userId: string): Promise<MembershipStatus> {
    return this.request(`/membership/${userId}/status`);
  }

  async suspendMembership(userId: string): Promise<void> {
    await this.request(`/membership/${userId}/suspend`, {
      method: 'POST',
    });
  }

  async reactivateMembership(userId: string): Promise<void> {
    await this.request(`/membership/${userId}/reactivate`, {
      method: 'POST',
    });
  }
}

// Exporta uma instância única do adaptador
export const membershipAdapter = new MembershipAdapter(); 