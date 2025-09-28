'use client';

import { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';
import PaymentForm from './PaymentForm';
import { api } from '../lib/api';

export default function TicketPurchaseModal({
  ticket,
  isOpen,
  onClose,
  onSuccess
}) {
  const [quantity, setQuantity] = useState(1);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { showNotification } = useNotification();

  if (!isOpen || !ticket) return null;

  const handleQuantityChange = (newQuantity) => {
    const maxQuantity = Math.min(ticket.quantityAvailable, 10); // Max 10 tickets per purchase
    const clampedQuantity = Math.max(1, Math.min(newQuantity, maxQuantity));
    setQuantity(clampedQuantity);
  };

  const totalAmount = ticket.price * quantity;

  const handlePurchaseClick = () => {
    if (quantity > ticket.quantityAvailable) {
      showNotification(`Only ${ticket.quantityAvailable} tickets available`, 'error');
      return;
    }
    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = async (paymentData) => {
    setLoading(true);
    try {
      // Create the ticket purchase record
      const purchaseData = {
        userId: user.id,
        userEmail: user.email,
        eventId: ticket.eventId,
        eventName: ticket.eventName,
        ticketId: ticket.id,
        ticketName: ticket.name,
        quantity: quantity,
        amount: totalAmount,
        currency: ticket.currency || 'INR',
        paymentMethod: paymentData.paymentMethod,
        transactionId: `TICKET_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        notes: `Purchase of ${quantity} ticket(s) for ${ticket.eventName}`
      };

      const response = await api.payments.create(purchaseData);

      if (response.ok) {
        const result = await response.json();
        showNotification(`Successfully purchased ${quantity} ticket(s)!`, 'success');

        // Update payment status to COMPLETED (simulate successful payment)
        await api.payments.updateStatus(result.id, 'COMPLETED');

        onSuccess && onSuccess(result);
        onClose();
      } else {
        const errorData = await response.json();
        showNotification(`Purchase failed: ${errorData.message}`, 'error');
      }
    } catch (error) {
      showNotification('Purchase failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowPaymentForm(false);
    setQuantity(1);
    onClose();
  };

  if (showPaymentForm) {
    return (
      <PaymentForm
        userId={user?.id}
        eventId={ticket.eventId}
        ticketId={ticket.id}
        amount={totalAmount}
        onSuccess={handlePaymentSuccess}
        onCancel={() => setShowPaymentForm(false)}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Purchase Ticket</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Event & Ticket Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">{ticket.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{ticket.eventName}</p>
            {ticket.description && (
              <p className="text-xs text-gray-500">{ticket.description}</p>
            )}
          </div>

          {/* Quantity Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                −
              </button>
              <input
                type="number"
                min="1"
                max={Math.min(ticket.quantityAvailable, 10)}
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                className="w-20 text-center px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= Math.min(ticket.quantityAvailable, 10)}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Available: {ticket.quantityAvailable} tickets
            </p>
          </div>

          {/* Price Breakdown */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Price per ticket:</span>
              <span className="text-sm font-medium">₹{ticket.price?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Quantity:</span>
              <span className="text-sm font-medium">{quantity}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total:</span>
              <span className="text-lg font-bold text-gray-900">₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Purchase Button */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handlePurchaseClick}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>Purchase Tickets</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

