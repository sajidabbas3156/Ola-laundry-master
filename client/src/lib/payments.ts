// Bahrain Payment Methods Integration

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'benefit_pay' | 'apple_pay' | 'benefit_gateway' | 'card';
  icon: string;
  description: string;
  available: boolean;
}

// Bahrain-specific payment methods
export const bahrainPaymentMethods: PaymentMethod[] = [
  {
    id: 'benefit_pay',
    name: 'Benefit Pay',
    type: 'benefit_pay',
    icon: '💳',
    description: 'National payment system of Bahrain',
    available: true
  },
  {
    id: 'apple_pay',
    name: 'Apple Pay',
    type: 'apple_pay', 
    icon: '🍎',
    description: 'Pay with Face ID, Touch ID, or passcode',
    available: true
  },
  {
    id: 'benefit_gateway',
    name: 'Benefit Gateway',
    type: 'benefit_gateway',
    icon: '🏦',
    description: 'Secure online banking payment',
    available: true
  },
  {
    id: 'card',
    name: 'Credit/Debit Card',
    type: 'card',
    icon: '💰',
    description: 'Visa, Mastercard, and local cards',
    available: true
  }
];

// Benefit Pay integration
export const initiateBenefitPay = async (amount: number, currency: string = 'BHD') => {
  try {
    // In a real implementation, this would integrate with Benefit Pay API
    const paymentData = {
      amount,
      currency,
      merchantId: process.env.VITE_BENEFIT_MERCHANT_ID,
      transactionRef: `LP-${Date.now()}`,
      returnUrl: `${window.location.origin}/payment-success`,
      cancelUrl: `${window.location.origin}/payment-cancel`
    };

    // Simulate Benefit Pay redirect flow
    console.log('Initiating Benefit Pay payment:', paymentData);
    
    // For demo purposes, simulate successful payment after 2 seconds
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          transactionId: `BP-${Math.random().toString(36).substr(2, 9)}`,
          amount: amount,
          currency: currency,
          status: 'completed'
        });
      }, 2000);
    });
  } catch (error) {
    console.error('Benefit Pay error:', error);
    throw new Error('Payment failed. Please try again.');
  }
};

// Apple Pay integration
export const initiateApplePay = async (amount: number, currency: string = 'BHD') => {
  try {
    // Check if Apple Pay is available
    if (!window.ApplePaySession || !ApplePaySession.canMakePayments()) {
      throw new Error('Apple Pay is not available on this device');
    }

    const paymentRequest = {
      countryCode: 'BH',
      currencyCode: currency,
      supportedNetworks: ['visa', 'masterCard', 'amex'],
      merchantCapabilities: ['supports3DS'],
      total: {
        label: 'LaundryPro Bahrain',
        amount: amount.toFixed(3), // BHD uses 3 decimal places
        type: 'final'
      }
    };

    // For demo purposes, simulate Apple Pay flow
    console.log('Initiating Apple Pay payment:', paymentRequest);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          transactionId: `AP-${Math.random().toString(36).substr(2, 9)}`,
          amount: amount,
          currency: currency,
          status: 'completed'
        });
      }, 1500);
    });
  } catch (error) {
    console.error('Apple Pay error:', error);
    throw new Error('Apple Pay failed. Please try another payment method.');
  }
};

// Benefit Gateway integration
export const initiateBenefitGateway = async (amount: number, currency: string = 'BHD') => {
  try {
    const paymentData = {
      amount,
      currency,
      merchantId: process.env.VITE_BENEFIT_GATEWAY_MERCHANT_ID,
      transactionRef: `LPG-${Date.now()}`,
      customerInfo: {
        name: 'Customer',
        email: 'customer@example.com'
      }
    };

    // Simulate Benefit Gateway API call
    console.log('Initiating Benefit Gateway payment:', paymentData);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          transactionId: `BG-${Math.random().toString(36).substr(2, 9)}`,
          amount: amount,
          currency: currency,
          status: 'completed'
        });
      }, 3000);
    });
  } catch (error) {
    console.error('Benefit Gateway error:', error);
    throw new Error('Payment gateway error. Please try again.');
  }
};

// Main payment processor
export const processPayment = async (
  paymentMethodId: string, 
  amount: number, 
  currency: string = 'BHD'
) => {
  const method = bahrainPaymentMethods.find(m => m.id === paymentMethodId);
  
  if (!method || !method.available) {
    throw new Error('Payment method not available');
  }

  switch (method.type) {
    case 'benefit_pay':
      return await initiateBenefitPay(amount, currency);
    case 'apple_pay':
      return await initiateApplePay(amount, currency);
    case 'benefit_gateway':
      return await initiateBenefitGateway(amount, currency);
    case 'card':
      // Fallback to Stripe for international cards
      throw new Error('Card payments require Stripe integration');
    default:
      throw new Error('Unsupported payment method');
  }
};

// Currency formatting for Bahrain (BHD)
export const formatBahrainiCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ar-BH', {
    style: 'currency',
    currency: 'BHD',
    minimumFractionDigits: 3,
    maximumFractionDigits: 3
  }).format(amount);
};

// Utility to detect if user is in Bahrain (simplified)
export const isInBahrain = (): boolean => {
  // In a real app, use geolocation or IP detection
  return true; // Default to Bahrain for this demo
};