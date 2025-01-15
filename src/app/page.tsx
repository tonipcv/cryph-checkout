import { CheckoutForm } from '@/components/CheckoutForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout Seguro</h1>
          <p className="text-gray-600">Complete seus dados para finalizar o pagamento</p>
        </div>
        <CheckoutForm />
      </div>
    </div>
  );
}
