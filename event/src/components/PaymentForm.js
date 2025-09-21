'use client';

import { useState, useEffect } from 'react';

export default function PaymentForm({ userId, eventId, ticketId, amount, onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: ''
  });

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const paymentData = {
        amount: amount,
        currency: 'USD',
        paymentMethod: paymentMethod,
        userId: userId,
        eventId: eventId,
        ticketId: ticketId,
        quantity: 1,
        transactionId: `TXN_${Date.now()}`,
        notes: `Payment for ticket ${ticketId}`
      };

      // First create the payment record
      const createResponse = await fetch('http://localhost:8080/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(paymentData),
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        throw new Error(errorData.message || 'Failed to create payment record');
      }

      const payment = await createResponse.json();

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time

      // Update payment status to COMPLETED
      const updateResponse = await fetch(`http://localhost:8080/api/payments/${payment.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ status: 'COMPLETED' }),
      });

      if (updateResponse.ok) {
        if (onSuccess) {
          onSuccess(payment);
        }
      } else {
        throw new Error('Payment processing failed');
      }
    } catch (err) {
      setError(err.message || 'Payment processing failed');
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      setCardDetails(prev => ({
        ...prev,
        cardNumber: formatted
      }));
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white shadow-sm rounded-lg border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Payment Details</h2>
          <p className="text-sm text-gray-600 mt-1">
            Complete your payment of ${amount?.toFixed(2)}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {/* Payment Method Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Payment Method
            </label>
            <div className="space-y-2">
              {[
                { value: 'CREDIT_CARD', label: 'Credit Card', icon: '💳' },
                { value: 'DEBIT_CARD', label: 'Debit Card', icon: '💳' },
                { value: 'PAYPAL', label: 'PayPal', icon: '🅿️' },
                { value: 'BANK_TRANSFER', label: 'Bank Transfer', icon: '🏦' }
              ].map((method) => (
                <label key={method.value} className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.value}
                    checked={paymentMethod === method.value}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <span className="text-sm">{method.icon} {method.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Card Details */}
          {(paymentMethod === 'CREDIT_CARD' || paymentMethod === 'DEBIT_CARD') && (
            <div className="space-y-4 border-t pt-4">
              <div>
                <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-2">
                  Cardholder Name *
                </label>
                <input
                  type="text"
                  id="cardholderName"
                  name="cardholderName"
                  required
                  value={cardDetails.cardholderName}
                  onChange={handleCardChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number *
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  required
                  value={cardDetails.cardNumber}
                  onChange={handleCardNumberChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="expiryMonth" className="block text-sm font-medium text-gray-700 mb-2">
                    Month *
                  </label>
                  <select
                    id="expiryMonth"
                    name="expiryMonth"
                    required
                    value={cardDetails.expiryMonth}
                    onChange={handleCardChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">MM</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                      <option key={month} value={month.toString().padStart(2, '0')}>
                        {month.toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="expiryYear" className="block text-sm font-medium text-gray-700 mb-2">
                    Year *
                  </label>
                  <select
                    id="expiryYear"
                    name="expiryYear"
                    required
                    value={cardDetails.expiryYear}
                    onChange={handleCardChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">YYYY</option>
                    {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-2">
                    CVV *
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    required
                    value={cardDetails.cvv}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 4) {
                        setCardDetails(prev => ({ ...prev, cvv: value }));
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="123"
                    maxLength="4"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Payment Summary */}
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Total Amount:</span>
              <span className="text-lg font-bold text-gray-900">${amount?.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>Pay ${amount?.toFixed(2)}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
