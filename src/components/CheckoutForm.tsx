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
  CurrencyDollarIcon,
  CalendarIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';
import { PixModal } from './PixModal';

type PaymentMethod = 'PIX' | 'CREDIT_CARD';

interface CheckoutFormData {
  name: string;
  email: string;
  cpfCnpj: string;
  phone: string;
  amount: number;
  paymentMethod: PaymentMethod;
  cardNumber?: string;
  holderName?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvv?: string;
}

export function CheckoutForm() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PIX');
  const [isLoading, setIsLoading] = useState(false);
  const [pixData, setPixData] = useState<any>(null);
  const [isPixModalOpen, setIsPixModalOpen] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<CheckoutFormData>();

  const amount = watch('amount');

  const validateAmount = (value: number) => {
    if (paymentMethod === 'CREDIT_CARD' && value < 5) {
      return 'O valor mínimo para cartão de crédito é R$ 5,00';
    }
    if (value <= 0) {
      return 'O valor deve ser maior que zero';
    }
    return true;
  };

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, paymentMethod }),
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Erro ao processar pagamento');
      }
      
      if (paymentMethod === 'PIX') {
        setPixData(result);
        setIsPixModalOpen(true);
      } else {
        alert('Pagamento processado com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      alert(error instanceof Error ? error.message : 'Erro ao processar pagamento');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
        <div className="flex justify-center mb-8">
          <div className="bg-blue-50 p-4 rounded-full">
            <CreditCardIcon className="h-12 w-12 text-blue-600" />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg mb-6">
            <button
              type="button"
              onClick={() => setPaymentMethod('PIX')}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg transition-all ${
                paymentMethod === 'PIX'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <QrCodeIcon className="h-5 w-5" />
              PIX
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('CREDIT_CARD')}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg transition-all ${
                paymentMethod === 'CREDIT_CARD'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <CreditCardIcon className="h-5 w-5" />
              Cartão
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <UserIcon className="h-4 w-4" />
                Nome Completo
              </label>
              <input
                {...register('name', { required: true })}
                className="w-full p-3 border rounded-lg bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder-gray-500"
                placeholder="Digite seu nome"
              />
              {errors.name && <span className="text-red-500 text-xs">Campo obrigatório</span>}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <EnvelopeIcon className="h-4 w-4" />
                Email
              </label>
              <input
                type="email"
                {...register('email', { required: true })}
                className="w-full p-3 border rounded-lg bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder-gray-500"
                placeholder="seu@email.com"
              />
              {errors.email && <span className="text-red-500 text-xs">Campo obrigatório</span>}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <IdentificationIcon className="h-4 w-4" />
                CPF/CNPJ
              </label>
              <input
                {...register('cpfCnpj', { required: true })}
                className="w-full p-3 border rounded-lg bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder-gray-500"
                placeholder="000.000.000-00"
              />
              {errors.cpfCnpj && <span className="text-red-500 text-xs">Campo obrigatório</span>}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <PhoneIcon className="h-4 w-4" />
                Telefone
              </label>
              <input
                {...register('phone', { required: true })}
                className="w-full p-3 border rounded-lg bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder-gray-500"
                placeholder="(00) 00000-0000"
              />
              {errors.phone && <span className="text-red-500 text-xs">Campo obrigatório</span>}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <CurrencyDollarIcon className="h-4 w-4" />
                Valor (R$)
              </label>
              <input
                type="number"
                step="0.01"
                {...register('amount', { 
                  required: 'Valor é obrigatório',
                  min: { 
                    value: 0.01, 
                    message: 'Valor deve ser maior que zero' 
                  },
                  validate: validateAmount
                })}
                className="w-full p-3 border rounded-lg bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder-gray-500"
                placeholder="0,00"
              />
              {errors.amount && (
                <span className="text-red-500 text-xs mt-1 block">
                  {errors.amount.message}
                </span>
              )}
              {paymentMethod === 'CREDIT_CARD' && amount && amount < 5 && (
                <span className="text-amber-600 text-xs mt-1 block">
                  ⚠️ Para cartão de crédito, o valor mínimo é R$ 5,00
                </span>
              )}
            </div>

            {paymentMethod === 'CREDIT_CARD' && (
              <div className="space-y-4 border-t pt-4 mt-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <CreditCardIcon className="h-4 w-4" />
                    Número do Cartão
                  </label>
                  <input
                    {...register('cardNumber', { required: paymentMethod === 'CREDIT_CARD' })}
                    className="w-full p-3 border rounded-lg bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder-gray-500"
                    placeholder="0000 0000 0000 0000"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <UserIcon className="h-4 w-4" />
                    Nome no Cartão
                  </label>
                  <input
                    {...register('holderName', { required: paymentMethod === 'CREDIT_CARD' })}
                    className="w-full p-3 border rounded-lg bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder-gray-500"
                    placeholder="Nome impresso no cartão"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                      <CalendarIcon className="h-4 w-4" />
                      Validade
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        {...register('expiryMonth')}
                        className="w-full p-3 border rounded-lg bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder-gray-500"
                        placeholder="MM"
                        maxLength={2}
                      />
                      <input
                        {...register('expiryYear')}
                        className="w-full p-3 border rounded-lg bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder-gray-500"
                        placeholder="AAAA"
                        maxLength={4}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                      <LockClosedIcon className="h-4 w-4" />
                      CVV
                    </label>
                    <input
                      {...register('cvv')}
                      className="w-full p-3 border rounded-lg bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder-gray-500"
                      type="password"
                      maxLength={4}
                      placeholder="123"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || (paymentMethod === 'CREDIT_CARD' && amount < 5)}
            className={`w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors
              ${(isLoading || (paymentMethod === 'CREDIT_CARD' && amount < 5)) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Processando...' : `Pagar ${paymentMethod === 'PIX' ? 'com PIX' : 'com Cartão'}`}
          </button>
        </form>
      </div>

      <PixModal 
        pixData={pixData}
        isOpen={isPixModalOpen}
        onClose={() => setIsPixModalOpen(false)}
      />
    </>
  );
} 