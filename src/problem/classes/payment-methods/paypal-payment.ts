import type { Payment } from '../../interfaces/payment.interface.js';

// ✅ PayPalPayment implementa todos los métodos correctamente
export class PayPalPayment implements Payment {
  payment(amount: number): void {
    console.log(`Payment of ${amount} made using PayPal.`);
  }

  refund(amount: number): void {
    console.log(`Refund of ${amount} processed for PayPal.`);
  }

  digitalReceipt(amount: number): string {
    return `Receipt for PayPal payment of ${amount} generated.`;
  }
}
