import React, { useState, useEffect } from 'react';
import Modal from '../../../components/common/Modal';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import { formatCurrency } from '../../../utils/formatters';
import { HiCash, HiCreditCard, HiDeviceMobile, HiBan as HiBank } from 'react-icons/hi';

const PaymentModal = ({ isOpen, onClose, cart, onPaymentSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paidAmount, setPaidAmount] = useState('');
  const [changeAmount, setChangeAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentMethods = [
    { value: 'cash', label: 'Cash', icon: HiCash },
    { value: 'card', label: 'Card', icon: HiCreditCard },
    { value: 'e-wallet', label: 'E-Wallet', icon: HiDeviceMobile },
    { value: 'bank-transfer', label: 'Bank', icon: HiBank },
  ];

  useEffect(() => {
    if (isOpen) {
      setPaidAmount('');
      setChangeAmount(0);
      setPaymentMethod('cash');
    }
  }, [isOpen]);

  useEffect(() => {
    const paid = parseFloat(paidAmount) || 0;
    const change = paid - cart.total;
    setChangeAmount(change > 0 ? change : 0);
  }, [paidAmount, cart.total]);

  const handleQuickAmount = (amount) => {
    setPaidAmount(amount.toString());
  };

  const handlePayment = async () => {
    const paid = parseFloat(paidAmount) || 0;

    if (paymentMethod === 'cash' && paid < cart.total) {
      alert('Paid amount is less than total');
      return;
    }

    setIsProcessing(true);

    try {
      await onPaymentSuccess({
        payment_method: paymentMethod,
        paid_amount: paymentMethod === 'cash' ? paid : cart.total,
        change_amount: paymentMethod === 'cash' ? changeAmount : 0,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const quickAmounts = [
    cart.total,
    Math.ceil(cart.total / 10000) * 10000,
    Math.ceil(cart.total / 50000) * 50000,
    Math.ceil(cart.total / 100000) * 100000,
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Payment"
      size="md"
    >
      <div className="space-y-6">
        {/* Total Amount */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <p className="text-sm text-primary-800 mb-1">Total Amount</p>
          <p className="text-3xl font-bold text-primary-900">
            {formatCurrency(cart.total)}
          </p>
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Payment Method
          </label>
          <div className="grid grid-cols-2 gap-3">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              const isSelected = paymentMethod === method.value;
              
              return (
                <button
                  key={method.value}
                  onClick={() => setPaymentMethod(method.value)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <Icon className="h-6 w-6 mx-auto mb-2" />
                  <p className="text-sm font-medium">{method.label}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cash Payment Details */}
        {paymentMethod === 'cash' && (
          <div className="space-y-4">
            {/* Quick Amount Buttons */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Amount
              </label>
              <div className="grid grid-cols-4 gap-2">
                {quickAmounts.map((amount, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAmount(amount)}
                    className="px-3 py-2 text-xs font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    {formatCurrency(amount)}
                  </button>
                ))}
              </div>
            </div>

            {/* Paid Amount */}
            <div>
              <Input
                label="Paid Amount"
                type="number"
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
                placeholder="Enter amount"
                required
              />
            </div>

            {/* Change */}
            {changeAmount > 0 && (
              <div className="bg-success-50 border border-success-200 rounded-lg p-4">
                <p className="text-sm text-success-800 mb-1">Change</p>
                <p className="text-2xl font-bold text-success-900">
                  {formatCurrency(changeAmount)}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Non-Cash Payment Info */}
        {paymentMethod !== 'cash' && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              {paymentMethod === 'card' && 'Please proceed with card payment'}
              {paymentMethod === 'e-wallet' && 'Scan QR code or enter phone number'}
              {paymentMethod === 'bank-transfer' && 'Transfer to bank account'}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onClose}
            fullWidth
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handlePayment}
            fullWidth
            loading={isProcessing}
            disabled={paymentMethod === 'cash' && (!paidAmount || parseFloat(paidAmount) < cart.total)}
          >
            Complete Payment
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PaymentModal;