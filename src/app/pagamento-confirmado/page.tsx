'use client';

import { CheckCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function PaymentConfirmedPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4 font-['Helvetica']">
      <div className="bg-[#0A0A0A] border border-[#222222] rounded-lg p-8 max-w-md w-full space-y-6 text-center">
        <div className="flex justify-center">
          <div className="bg-[#0A0A0A] border border-[#222222] p-4 rounded-lg">
            <CheckCircleIcon className="h-12 w-12 text-[#B8F536]" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-normal text-white">
            Pagamento Confirmado!
          </h1>
          <p className="text-sm text-gray-400">
            Sua assinatura foi ativada com sucesso.
          </p>
        </div>

        <div className="bg-[#0A0A0A] border border-[#222222] p-4 rounded-lg">
          <p className="text-sm text-gray-400">
            Você receberá um email com os detalhes da sua assinatura.
            Em caso de dúvidas, entre em contato com nosso suporte.
          </p>
        </div>

        <Link
          href="/"
          className="block w-full bg-[#B8F536] text-black py-4 px-6 rounded-lg font-medium text-sm hover:bg-[#a5dc31] transition-colors"
        >
          Voltar para o Início
        </Link>
      </div>
    </div>
  );
} 