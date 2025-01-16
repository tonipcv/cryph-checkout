'use client';

import { useState } from 'react';

interface CreditCardFormProps {
  paymentId: string;
  customerId: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

interface CreditCardData {
  holderName: string;
  number: string;
  expiryMonth: string;
  expiryYear: string;
  ccv: string;
  installments: number;
}

export function CreditCardForm({ paymentId, customerId, onSuccess, onError }: CreditCardFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreditCardData>({
    holderName: '',
    number: '',
    expiryMonth: '',
    expiryYear: '',
    ccv: '',
    installments: 1
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/process-credit-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId,
          customerId,
          creditCard: {
            holderName: formData.holderName,
            number: formData.number.replace(/\D/g, ''),
            expiryMonth: formData.expiryMonth,
            expiryYear: formData.expiryYear,
            ccv: formData.ccv,
          },
          installments: formData.installments
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Erro ao processar cartão');
      }

      onSuccess();
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Erro ao processar cartão');
    } finally {
      setIsLoading(false);
    }
  };

  const installmentOptions = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-['Helvetica']">
      <div>
        <label className="block text-sm font-normal text-gray-400 mb-1">
          Nome no Cartão
        </label>
        <input
          type="text"
          name="holderName"
          value={formData.holderName}
          onChange={handleChange}
          className="w-full p-3 border border-[#333333] rounded-lg bg-[#222222] text-white focus:ring-1 focus:ring-[#3B82F6] focus:border-[#3B82F6] outline-none placeholder-gray-500"
          placeholder="Nome como está no cartão"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-normal text-gray-400 mb-1">
          Número do Cartão
        </label>
        <input
          type="text"
          name="number"
          value={formData.number}
          onChange={handleChange}
          className="w-full p-3 border border-[#333333] rounded-lg bg-[#222222] text-white focus:ring-1 focus:ring-[#F5B014] focus:border-[#F5B014] outline-none placeholder-gray-500"
          placeholder="0000 0000 0000 0000"
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-normal text-gray-400 mb-1">
            Mês
          </label>
          <input
            type="text"
            name="expiryMonth"
            value={formData.expiryMonth}
            onChange={handleChange}
            className="w-full p-3 border border-[#333333] rounded-lg bg-[#222222] text-white focus:ring-1 focus:ring-[#F5B014] focus:border-[#F5B014] outline-none placeholder-gray-500"
            placeholder="MM"
            maxLength={2}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-normal text-gray-400 mb-1">
            Ano
          </label>
          <input
            type="text"
            name="expiryYear"
            value={formData.expiryYear}
            onChange={handleChange}
            className="w-full p-3 border border-[#333333] rounded-lg bg-[#222222] text-white focus:ring-1 focus:ring-[#F5B014] focus:border-[#F5B014] outline-none placeholder-gray-500"
            placeholder="AA"
            maxLength={2}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-normal text-gray-400 mb-1">
            CCV
          </label>
          <input
            type="text"
            name="ccv"
            value={formData.ccv}
            onChange={handleChange}
            className="w-full p-3 border border-[#333333] rounded-lg bg-[#222222] text-white focus:ring-1 focus:ring-[#F5B014] focus:border-[#F5B014] outline-none placeholder-gray-500"
            placeholder="000"
            maxLength={4}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-normal text-gray-400 mb-1">
          Parcelas
        </label>
        <select
          name="installments"
          value={formData.installments}
          onChange={handleChange}
          className="w-full p-3 border border-[#333333] rounded-lg bg-[#222222] text-white focus:ring-1 focus:ring-[#F5B014] focus:border-[#F5B014] outline-none placeholder-gray-500"
          required
        >
          {installmentOptions.map(number => (
            <option key={number} value={number}>
              {number}x de R$ {(10 / number).toFixed(2)}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full bg-[#3B82F6] text-white py-4 px-6 rounded-lg font-normal text-sm hover:bg-[#2563EB] transition-colors
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isLoading ? 'Processando...' : 'Finalizar Pagamento'}
      </button>
    </form>
  );
} 