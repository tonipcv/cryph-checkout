'use client';

import { CheckCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function PaymentConfirmedPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-[#111111] border border-[#222222] rounded-lg p-8 max-w-md w-full space-y-6 text-center">
        <div className="flex justify-center">
          <div className="bg-[#222222] p-4 rounded-full">
            <CheckCircleIcon className="h-12 w-12 text-[#22c55e]" />
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

        <div className="bg-[#222222] p-4 rounded-lg">
          <p className="text-sm text-gray-400">
            Você receberá um email com os detalhes da sua assinatura.
            Em caso de dúvidas, entre em contato com nosso suporte.
          </p>
        </div>

        <Link
          href="/"
          className="block w-full bg-[#3B82F6] text-white py-4 px-6 rounded-lg font-normal text-sm hover:bg-[#2563EB] transition-colors"
        >
          Voltar para o Início
        </Link>
      </div>
    </div>
  );
} 