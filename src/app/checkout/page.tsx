"use client";
import { useCart } from '../CartProvider';
import { useState } from 'react';
import Link from 'next/link';

export default function CheckoutPage() {
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [card, setCard] = useState('');
  const { clearCart } = useCart();

  // Only allow numbers in credit card field
  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setCard(value);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate backend event
    await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'checkout_success', email, address, card }),
    });
    clearCart();
    // Redirect to confirmation page with order details
    window.location.href = `/confirmation?email=${encodeURIComponent(email)}&address=${encodeURIComponent(address)}&card=${encodeURIComponent(card)}`;
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <form onSubmit={handleCheckout} className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Email Address</h2>
          <div className="mb-2">
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="border p-2 rounded w-full mb-2"
              autoComplete="email"
            />
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Shipping Address</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
            <input
              type="text"
              required
              placeholder="Full name"
              className="border p-2 rounded w-full"
              autoComplete="name"
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
            <input
              type="text"
              required
              placeholder="Street address"
              className="border p-2 rounded w-full"
              autoComplete="street-address"
            />
            <input
              type="text"
              required
              placeholder="City"
              className="border p-2 rounded w-full"
              autoComplete="address-level2"
            />
            <input
              type="text"
              required
              placeholder="State/Province"
              className="border p-2 rounded w-full"
              autoComplete="address-level1"
            />
            <input
              type="text"
              required
              placeholder="Postal code"
              className="border p-2 rounded w-full"
              autoComplete="postal-code"
            />
            <input
              type="text"
              required
              placeholder="Country"
              className="border p-2 rounded w-full"
              autoComplete="country"
            />
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Card number</h2>
          <input
            type="text"
            required
            placeholder="Credit card number"
            value={card}
            onChange={handleCardChange}
            className="border p-2 rounded w-full"
            maxLength={16}
            autoComplete="cc-number"
            inputMode="numeric"
          />
        </div>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Complete Order</button>
      </form>
      <div className="mt-8">
        <Link href="/" className="text-blue-600 underline">Back to Products</Link>
      </div>
    </main>
  );
}
