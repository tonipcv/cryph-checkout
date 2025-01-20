'use client';

import { useState } from 'react';
import ReactCreditCards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';

interface CreditCardFormProps {
  paymentId: string;
  customerId: string;
  email: string;
  cpfCnpj: string;
  phone: string;
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
  focused?: "name" | "number" | "expiry" | "cvc";
}

export function CreditCardForm({ paymentId, customerId, email, cpfCnpj, phone, onSuccess, onError }: CreditCardFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreditCardData>({
    holderName: '',
    number: '',
    expiryMonth: '',
    expiryYear: '',
    ccv: '',
    installments: 1,
    focused: undefined
  });

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const name = e.target.name;
    let focusedField: "name" | "number" | "expiry" | "cvc" | undefined;
    
    switch (name) {
      case 'holderName':
        focusedField = 'name';
        break;
      case 'number':
        focusedField = 'number';
        break;
      case 'expiryMonth':
      case 'expiryYear':
        focusedField = 'expiry';
        break;
      case 'ccv':
        focusedField = 'cvc';
        break;
      default:
        focusedField = undefined;
    }

    setFormData(prev => ({
      ...prev,
      focused: focusedField
    }));
  };

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
          email,
          cpfCnpj,
          phone,
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
    <div className="space-y-8 font-['Helvetica']">
      <div className="flex justify-center">
        <ReactCreditCards
          number={formData.number}
          name={formData.holderName}
          expiry={`${formData.expiryMonth}${formData.expiryYear}`}
          cvc={formData.ccv}
          focused={formData.focused}
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-normal text-white mb-1">
            Nome no Cartão
          </label>
          <input
            type="text"
            name="holderName"
            value={formData.holderName}
            onChange={handleChange}
            onFocus={handleInputFocus}
            className="w-full p-3 border border-white/20 rounded-2xl bg-transparent text-white focus:ring-1 focus:ring-white focus:border-white outline-none placeholder-gray-500 transition-colors"
            placeholder="Nome como está no cartão"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-normal text-white mb-1">
            Número do Cartão
          </label>
          <input
            type="text"
            name="number"
            value={formData.number}
            onChange={handleChange}
            onFocus={handleInputFocus}
            className="w-full p-3 border border-white/20 rounded-2xl bg-transparent text-white focus:ring-1 focus:ring-white focus:border-white outline-none placeholder-gray-500 transition-colors"
            placeholder="0000 0000 0000 0000"
            maxLength={19}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-normal text-white mb-1">
              Mês
            </label>
            <input
              type="text"
              name="expiryMonth"
              value={formData.expiryMonth}
              onChange={handleChange}
              onFocus={handleInputFocus}
              className="w-full p-3 border border-white/20 rounded-2xl bg-transparent text-white focus:ring-1 focus:ring-white focus:border-white outline-none placeholder-gray-500 transition-colors"
              placeholder="MM"
              maxLength={2}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-normal text-white mb-1">
              Ano
            </label>
            <input
              type="text"
              name="expiryYear"
              value={formData.expiryYear}
              onChange={handleChange}
              onFocus={handleInputFocus}
              className="w-full p-3 border border-white/20 rounded-2xl bg-transparent text-white focus:ring-1 focus:ring-white focus:border-white outline-none placeholder-gray-500 transition-colors"
              placeholder="AA"
              maxLength={2}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-normal text-white mb-1">
            CVV
          </label>
          <input
            type="text"
            name="ccv"
            value={formData.ccv}
            onChange={handleChange}
            onFocus={handleInputFocus}
            className="w-full p-3 border border-white/20 rounded-2xl bg-transparent text-white focus:ring-1 focus:ring-white focus:border-white outline-none placeholder-gray-500 transition-colors"
            placeholder="123"
            maxLength={4}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-normal text-white mb-1">
            Parcelas
          </label>
          <select
            name="installments"
            value={formData.installments}
            onChange={handleChange}
            className="w-full p-3 border border-white/20 rounded-2xl bg-transparent text-white focus:ring-1 focus:ring-white focus:border-white outline-none placeholder-gray-500 transition-colors"
            required
          >
            {installmentOptions.map(number => (
              <option key={number} value={number} className="bg-[#0A0A0A] text-white">
                {number}x de R$ {(10 / number).toFixed(2)}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-transparent border border-white text-white py-4 px-6 rounded-2xl font-medium text-sm hover:bg-white hover:text-black transition-colors
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Processando...' : 'Finalizar Pagamento'}
        </button>
      </form>
    </div>
  );
} 