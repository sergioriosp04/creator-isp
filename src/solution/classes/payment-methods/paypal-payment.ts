import type { Payment, Refundable, Receiptable } from '../../interfaces/payment.inerface.js';

export class PayPalPayment implements Payment, Refundable, Receiptable {
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
