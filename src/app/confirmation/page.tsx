"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ConfirmationPage() {
  const params = useSearchParams();
  const email = params.get("email") || "";
  const address = params.get("address") || "";
  const card = params.get("card") || "";

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Order Confirmation</h1>
      <div className="bg-white rounded shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-2">Thank you for your order!</h2>
        <div className="mb-4">
          <strong>Email:</strong> {email}
        </div>
        <div className="mb-4">
          <strong>Shipping Address:</strong> {address}
        </div>
        <div className="mb-4">
          <strong>Card (last 4 digits):</strong> {card.slice(-4)}
        </div>
      </div>
      <Link href="/" className="text-blue-600 underline">Back to Products</Link>
    </main>
  );
}
