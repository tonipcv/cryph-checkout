'use client';

import { CheckCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function PaymentConfirmedPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="bg-transparent border border-white/20 rounded-3xl p-8 max-w-md w-full space-y-6 text-center">
        <div className="flex justify-center">
          <div className="bg-transparent border border-white/20 p-4 rounded-2xl">
            <CheckCircleIcon className="h-12 w-12 text-white" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-white">
            Pagamento Confirmado!
          </h1>
          <p className="text-sm font-medium text-white/60">
            Sua assinatura foi ativada com sucesso.
          </p>
        </div>

        <div className="bg-transparent border border-white/20 p-4 rounded-2xl">
          <p className="text-sm font-medium text-white/60">
            Você receberá um email com os detalhes da sua assinatura.
            Em caso de dúvidas, entre em contato com nosso suporte.
          </p>
        </div>

        <Link
          href="/"
          className="block w-full bg-transparent border border-white text-white py-4 px-6 rounded-2xl font-semibold text-sm hover:bg-white hover:text-black transition-colors"
        >
          Voltar para o Início
        </Link>
      </div>
    </div>
  );
} 