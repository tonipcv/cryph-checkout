import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Tenta fazer uma query simples
    const count = await prisma.customer.count();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful',
      customerCount: count 
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Database connection failed' 
    }, { status: 500 });
  }
} 