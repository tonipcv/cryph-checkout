export interface MembershipStatus {
  isActive: boolean;
  expiresAt?: Date;
  plan: string;
  subscriptionId?: string;
}

export interface MembershipService {
  updateMemberStatus(userId: string, paymentInfo: {
    status: 'active' | 'inactive' | 'expired';
    paymentId?: string;
    subscriptionId?: string;
    expiresAt?: Date;
    plan: string;
  }): Promise<void>;
  
  getMembershipStatus(userId: string): Promise<MembershipStatus>;
  
  suspendMembership(userId: string): Promise<void>;
  
  reactivateMembership(userId: string): Promise<void>;
} 