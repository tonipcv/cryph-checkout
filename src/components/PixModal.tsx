/* eslint-disable @next/next/no-img-element */
'use client';

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { QrCodeIcon } from '@heroicons/react/24/outline'

interface PixModalProps {
  isOpen: boolean;
  onClose: () => void;
  pixData: {
    encodedImage: string;
    payload: string;
  } | null;
}

export function PixModal({ isOpen, onClose, pixData }: PixModalProps) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4"
              enterTo="opacity-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-4"
            >
              <Dialog.Panel className="relative transform rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all w-full max-w-md">
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f5f5f5]">
                    <QrCodeIcon className="h-8 w-8 text-[#333333]" />
                  </div>
                  <div className="mt-3 text-center">
                    <Dialog.Title as="h3" className="text-lg font-normal text-[#333333]">
                      Pagamento via PIX
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-[#666666]">
                        Escaneie o QR Code abaixo com o app do seu banco
                      </p>
                    </div>
                  </div>
                </div>

                {pixData && (
                  <div className="mt-4 space-y-4">
                    <div className="flex justify-center">
                      <img
                        src={`data:image/png;base64,${pixData.encodedImage}`}
                        alt="QR Code PIX"
                        className="w-48 h-48"
                      />
                    </div>
                    
                    <div className="bg-[#fafafa] p-4 rounded-lg">
                      <p className="text-xs text-[#666666] mb-2">Código PIX (clique para copiar)</p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(pixData.payload);
                          alert('Código PIX copiado!');
                        }}
                        className="w-full text-xs text-[#333333] bg-white p-3 rounded border border-[#eeeeee] hover:bg-[#f5f5f5] transition-colors break-all"
                      >
                        {pixData.payload}
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-5">
                  <button
                    type="button"
                    className="w-full rounded-lg bg-[#333333] px-4 py-3 text-sm font-normal text-white hover:bg-[#444444] transition-colors"
                    onClick={onClose}
                  >
                    Fechar
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
} 