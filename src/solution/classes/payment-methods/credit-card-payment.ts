import type { Payment, Refundable, Receiptable } from '../../interfaces/payment.inerface.js';

export class CreditCardPayment implements Payment, Refundable, Receiptable {
  payment(amount: number): void {
    console.log(`Payment of ${amount} made using credit card.`);
  }
  refund(amount: number): void {
    console.log(`Refund of ${amount} processed for credit card.`);
  }
  digitalReceipt(amount: number): string {
    return `Receipt for credit card payment of ${amount} generated.`;
  }
}
