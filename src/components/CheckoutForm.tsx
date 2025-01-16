/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  CreditCardIcon,
  QrCodeIcon,
  UserIcon,
  EnvelopeIcon,
  IdentificationIcon,
  PhoneIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { PixModal } from './PixModal';
import { CreditCardForm } from './CreditCardForm';

type PaymentMethod = 'CREDIT_CARD' | 'PIX' | 'BOLETO';

interface CheckoutFormData {
  name: string;
  email: string;
  cpfCnpj: string;
  phone: string;
}

const SUBSCRIPTION_PRICE = 10;

const formatCPFCNPJ = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 11) {
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4');
  }
  return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, '$1.$2.$3/$4-$5');
};

const formatPhone = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  return numbers.replace(/(\d{2})(\d{5})(\d{4})/g, '($1) $2-$3');
};

export function CheckoutForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CREDIT_CARD');
  const [pixData, setPixData] = useState<any>(null);
  const [isPixModalOpen, setIsPixModalOpen] = useState(false);
  const [showCreditCardForm, setShowCreditCardForm] = useState(false);
  const [creditCardData, setCreditCardData] = useState<any>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormData>();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'cpfCnpj') {
      e.target.value = formatCPFCNPJ(value);
    } else if (name === 'phone') {
      e.target.value = formatPhone(value);
    }
  };

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/create-payment-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          ...data,
          cpfCnpj: data.cpfCnpj.replace(/\D/g, ''),
          phone: data.phone.replace(/\D/g, ''),
          paymentMethod 
        }),
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Erro ao processar pagamento');
      }
      
      if (paymentMethod === 'PIX') {
        setPixData(result.pixData);
        setIsPixModalOpen(true);
      } else if (paymentMethod === 'CREDIT_CARD') {
        setCreditCardData({
          paymentId: result.paymentId,
          customerId: result.customerId
        });
        setShowCreditCardForm(true);
      } else {
        // Redirecionar para a página de pagamento pendente com os dados do boleto
        const params = new URLSearchParams({
          bankSlipUrl: result.bankSlipUrl || '',
          invoiceUrl: result.invoiceUrl || '',
          dueDate: result.dueDate || ''
        });
        window.location.href = `/pagamento-pendente?${params.toString()}`;
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      alert(error instanceof Error ? error.message : 'Erro ao processar pagamento');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreditCardSuccess = () => {
    window.location.href = '/pagamento-confirmado';
  };

  const handleCreditCardError = (error: string) => {
    alert(error);
  };

  if (showCreditCardForm && creditCardData) {
    return (
      <div className="p-6 font-['Helvetica']">
        <div className="text-center mb-6">
          <h2 className="text-lg font-normal text-white mb-2">Dados do Cartão</h2>
          <p className="text-sm text-gray-400">
            Preencha os dados do seu cartão para finalizar o pagamento
          </p>
        </div>

        <CreditCardForm
          paymentId={creditCardData.paymentId}
          customerId={creditCardData.customerId}
          onSuccess={handleCreditCardSuccess}
          onError={handleCreditCardError}
        />
      </div>
    );
  }

  return (
    <>
      <div className="p-6 font-['Helvetica']">
        <div className="flex justify-center mb-8">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-8 invert brightness-0"
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <div className="grid grid-cols-3 gap-4 p-4 bg-[#222222] rounded-lg">
              <button
                type="button"
                onClick={() => setPaymentMethod('CREDIT_CARD')}
                className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg transition-all ${
                  paymentMethod === 'CREDIT_CARD'
                    ? 'bg-[#3B82F6] text-white'
                    : 'bg-[#333333] text-gray-400 hover:bg-[#444444]'
                }`}
              >
                <CreditCardIcon className="h-5 w-5" />
                <span className="text-xs font-medium">Cartão</span>
                <span className="text-[10px] font-normal">até 12x</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('PIX')}
                className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg transition-all ${
                  paymentMethod === 'PIX'
                    ? 'bg-[#3B82F6] text-white'
                    : 'bg-[#333333] text-gray-400 hover:bg-[#444444]'
                }`}
              >
                <QrCodeIcon className="h-5 w-5" />
                <span className="text-xs font-medium">PIX</span>
                <span className="text-[10px] font-normal">à vista</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('BOLETO')}
                className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg transition-all ${
                  paymentMethod === 'BOLETO'
                    ? 'bg-[#3B82F6] text-white'
                    : 'bg-[#333333] text-gray-400 hover:bg-[#444444]'
                }`}
              >
                <DocumentTextIcon className="h-5 w-5" />
                <span className="text-xs font-medium">Boleto</span>
                <span className="text-[10px] font-normal">5 dias</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-normal text-gray-400 mb-1">
                <UserIcon className="h-4 w-4" />
                Nome Completo
              </label>
              <input
                {...register('name', { required: true })}
                className="w-full p-3 border border-[#333333] rounded-lg bg-[#222222] text-white focus:ring-1 focus:ring-[#3B82F6] focus:border-[#3B82F6] outline-none placeholder-gray-500"
                placeholder="Digite seu nome"
              />
              {errors.name && <span className="text-[#3B82F6] text-xs">Campo obrigatório</span>}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-normal text-gray-400 mb-1">
                <EnvelopeIcon className="h-4 w-4" />
                Email
              </label>
              <input
                type="email"
                {...register('email', { required: true })}
                className="w-full p-3 border border-[#333333] rounded-lg bg-[#222222] text-white focus:ring-1 focus:ring-[#3B82F6] focus:border-[#3B82F6] outline-none placeholder-gray-500"
                placeholder="seu@email.com"
              />
              {errors.email && <span className="text-[#3B82F6] text-xs">Campo obrigatório</span>}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-normal text-gray-400 mb-1">
                <IdentificationIcon className="h-4 w-4" />
                CPF/CNPJ
              </label>
              <input
                {...register('cpfCnpj', { required: true })}
                onChange={handleInputChange}
                className="w-full p-3 border border-[#333333] rounded-lg bg-[#222222] text-white focus:ring-1 focus:ring-[#3B82F6] focus:border-[#3B82F6] outline-none placeholder-gray-500"
                placeholder="000.000.000-00"
                maxLength={18}
              />
              {errors.cpfCnpj && <span className="text-[#3B82F6] text-xs">Campo obrigatório</span>}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-normal text-gray-400 mb-1">
                <PhoneIcon className="h-4 w-4" />
                Telefone
              </label>
              <input
                {...register('phone', { required: true })}
                onChange={handleInputChange}
                className="w-full p-3 border border-[#333333] rounded-lg bg-[#222222] text-white focus:ring-1 focus:ring-[#3B82F6] focus:border-[#3B82F6] outline-none placeholder-gray-500"
                placeholder="(00) 00000-0000"
                maxLength={15}
              />
              {errors.phone && <span className="text-[#3B82F6] text-xs">Campo obrigatório</span>}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-[#3B82F6] text-white py-4 px-6 rounded-lg font-medium text-sm hover:bg-[#2563EB] transition-colors
              ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Processando...' : 'Continuar para o Pagamento'}
          </button>
        </form>
      </div>

      <PixModal
        isOpen={isPixModalOpen}
        onClose={() => setIsPixModalOpen(false)}
        pixData={pixData}
      />
    </>
  );
} 