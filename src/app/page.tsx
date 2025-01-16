import { CheckoutForm } from '@/components/CheckoutForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#111111] border border-[#222222] rounded-lg shadow-xl">
          <CheckoutForm />
        </div>
      </div>
    </main>
  );
}
