import { CheckoutForm } from '@/components/CheckoutForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#0A0A0A] rounded-lg">
          <CheckoutForm />
        </div>
      </div>
    </main>
  );
}
