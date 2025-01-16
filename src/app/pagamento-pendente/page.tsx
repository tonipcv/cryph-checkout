'use client';

import { ClockIcon } from '@heroicons/react/24/outline';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function PaymentPendingPage() {
  const searchParams = useSearchParams();
  const bankSlipUrl = searchParams.get('bankSlipUrl');
  const invoiceUrl = searchParams.get('invoiceUrl');
  const dueDate = searchParams.get('dueDate');

  const formattedDueDate = dueDate ? new Date(dueDate).toLocaleDateString('pt-BR') : '';

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="bg-transparent border border-white/20 rounded-3xl p-8 max-w-md w-full space-y-6 text-center">
        <div className="flex justify-center">
          <div className="bg-transparent border border-white/20 p-4 rounded-2xl">
            <ClockIcon className="h-12 w-12 text-white" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-white">
            Pagamento Pendente
          </h1>
          <p className="text-sm font-medium text-white/60">
            Seu boleto foi gerado com sucesso.
          </p>
        </div>

        <div className="bg-transparent border border-white/20 p-4 rounded-2xl space-y-2">
          <p className="text-sm font-medium text-white/60">
            Vencimento: <span className="font-semibold text-white">{formattedDueDate}</span>
          </p>
          <p className="text-xs font-medium text-white/60">
            Após o pagamento, pode levar até 2 dias úteis para a confirmação.
          </p>
        </div>

        <div className="space-y-3">
          {bankSlipUrl && (
            <a
              href={bankSlipUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-transparent border border-white text-white py-4 px-6 rounded-2xl font-semibold text-sm hover:bg-white hover:text-black transition-colors"
            >
              Baixar Boleto
            </a>
          )}
          
          {invoiceUrl && (
            <a
              href={invoiceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-transparent border border-white/20 text-white/60 py-4 px-6 rounded-2xl font-medium text-sm hover:border-white hover:text-white transition-colors"
            >
              Visualizar Fatura
            </a>
          )}
        </div>

        <Link
          href="/"
          className="block w-full bg-transparent border border-white/20 text-white/60 py-4 px-6 rounded-2xl font-medium text-sm hover:border-white hover:text-white transition-colors"
        >
          Voltar para o Início
        </Link>
      </div>
    </div>
  );
} 