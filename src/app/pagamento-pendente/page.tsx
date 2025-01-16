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
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-[#111111] border border-[#222222] rounded-lg p-8 max-w-md w-full space-y-6 text-center">
        <div className="flex justify-center">
          <div className="bg-[#222222] p-4 rounded-full">
            <ClockIcon className="h-12 w-12 text-[#3B82F6]" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-normal text-white">
            Pagamento Pendente
          </h1>
          <p className="text-sm text-gray-400">
            Seu boleto foi gerado com sucesso.
          </p>
        </div>

        <div className="bg-[#222222] p-4 rounded-lg space-y-2">
          <p className="text-sm text-gray-400">
            Vencimento: <span className="font-semibold text-white">{formattedDueDate}</span>
          </p>
          <p className="text-xs text-gray-400">
            Após o pagamento, pode levar até 2 dias úteis para a confirmação.
          </p>
        </div>

        <div className="space-y-3">
          {bankSlipUrl && (
            <a
              href={bankSlipUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-[#3B82F6] text-white py-4 px-6 rounded-lg font-normal text-sm hover:bg-[#2563EB] transition-colors"
            >
              Baixar Boleto
            </a>
          )}
          
          {invoiceUrl && (
            <a
              href={invoiceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-[#222222] text-gray-400 py-4 px-6 rounded-lg font-normal text-sm border border-[#333333] hover:bg-[#333333] transition-colors"
            >
              Visualizar Fatura
            </a>
          )}
        </div>

        <Link
          href="/"
          className="block w-full bg-[#111111] text-gray-400 py-4 px-6 rounded-lg font-normal text-sm hover:bg-[#222222] transition-colors"
        >
          Voltar para o Início
        </Link>
      </div>
    </div>
  );
} 