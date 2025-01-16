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
      <div className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold text-white mb-2">Dados do Cartão</h2>
          <p className="text-sm font-medium text-white/60">
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
      <div className="p-6">
        <div className="flex justify-center mb-8">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-8 invert brightness-0"
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Nome Completo
              </label>
              <input
                {...register('name', { required: true })}
                className="w-full p-3 border border-white/20 rounded-2xl bg-transparent text-white focus:ring-1 focus:ring-white focus:border-white outline-none placeholder-gray-500 transition-colors font-medium"
                placeholder="Digite seu nome"
              />
              {errors.name && <span className="text-white text-xs font-medium">Campo obrigatório</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Email
              </label>
              <input
                type="email"
                {...register('email', { required: true })}
                className="w-full p-3 border border-white/20 rounded-2xl bg-transparent text-white focus:ring-1 focus:ring-white focus:border-white outline-none placeholder-gray-500 transition-colors font-medium"
                placeholder="seu@email.com"
              />
              {errors.email && <span className="text-white text-xs font-medium">Campo obrigatório</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                CPF/CNPJ
              </label>
              <input
                {...register('cpfCnpj', { required: true })}
                onChange={handleInputChange}
                className="w-full p-3 border border-white/20 rounded-2xl bg-transparent text-white focus:ring-1 focus:ring-white focus:border-white outline-none placeholder-gray-500 transition-colors font-medium"
                placeholder="000.000.000-00"
                maxLength={18}
              />
              {errors.cpfCnpj && <span className="text-white text-xs font-medium">Campo obrigatório</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Telefone
              </label>
              <input
                {...register('phone', { required: true })}
                onChange={handleInputChange}
                className="w-full p-3 border border-white/20 rounded-2xl bg-transparent text-white focus:ring-1 focus:ring-white focus:border-white outline-none placeholder-gray-500 transition-colors font-medium"
                placeholder="(00) 00000-0000"
                maxLength={15}
              />
              {errors.phone && <span className="text-white text-xs font-medium">Campo obrigatório</span>}
            </div>
          </div>

          <div className="pt-4">
            <p className="text-sm font-medium text-white/60 text-center mb-2">
              Escolha como você quer pagar
            </p>
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('CREDIT_CARD')}
                className={`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border transition-all ${
                  paymentMethod === 'CREDIT_CARD'
                    ? 'border-white text-white'
                    : 'border-white/20 text-white/60 hover:border-white hover:text-white'
                }`}
              >
                <CreditCardIcon className="h-5 w-5" />
                <span className="text-xs font-semibold">Cartão</span>
                <span className="text-[10px] font-medium opacity-60">até 12x</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('PIX')}
                className={`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border transition-all ${
                  paymentMethod === 'PIX'
                    ? 'border-white text-white'
                    : 'border-white/20 text-white/60 hover:border-white hover:text-white'
                }`}
              >
                <QrCodeIcon className="h-5 w-5" />
                <span className="text-xs font-semibold">PIX</span>
                <span className="text-[10px] font-medium opacity-60">à vista</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('BOLETO')}
                className={`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border transition-all ${
                  paymentMethod === 'BOLETO'
                    ? 'border-white text-white'
                    : 'border-white/20 text-white/60 hover:border-white hover:text-white'
                }`}
              >
                <DocumentTextIcon className="h-5 w-5" />
                <span className="text-xs font-semibold">Boleto</span>
                <span className="text-[10px] font-medium opacity-60">5 dias</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-transparent border border-white text-white py-4 px-6 rounded-2xl font-semibold text-sm hover:bg-white hover:text-black transition-colors
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