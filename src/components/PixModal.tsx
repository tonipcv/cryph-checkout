'use client';

import Image from 'next/image';

interface PixModalProps {
  pixData: {
    encodedImage?: string;
    payload?: string;
    expirationDate?: string;
    success?: boolean;
    error?: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

export function PixModal({ pixData, isOpen, onClose }: PixModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-4">Pagamento PIX</h3>
          
          {!pixData.success && pixData.error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
              <p>{pixData.error}</p>
              <p className="text-sm mt-2">Por favor, tente novamente em alguns instantes.</p>
            </div>
          )}

          {pixData.encodedImage && (
            <div className="mb-6 relative w-[200px] h-[200px] mx-auto">
              <Image 
                src={`data:image/png;base64,${pixData.encodedImage}`}
                alt="QR Code PIX"
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
          )}

          {pixData.payload && (
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Código PIX:</p>
              <div className="relative">
                <input
                  type="text"
                  value={pixData.payload}
                  readOnly
                  className="w-full p-3 bg-gray-50 border rounded text-sm text-gray-900"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(pixData.payload!)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                >
                  Copiar
                </button>
              </div>
            </div>
          )}

          {pixData.expirationDate && (
            <p className="text-sm text-gray-600 mb-4">
              Válido até: {new Date(pixData.expirationDate).toLocaleString()}
            </p>
          )}

          <button
            onClick={onClose}
            className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
} 