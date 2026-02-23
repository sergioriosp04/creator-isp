import type { Payment } from '../../interfaces/payment.interface.js';

export class CashPayment implements Payment {
  payment(amount: number): void {
    console.log(`Payment of ${amount} made using cash.`);
  }

  refund(amount: number): void {
    console.log('Refunds are not applicable for cash payments.');
  }

  digitalReceipt(amount: number): string {
    return 'Digital receipts are not applicable for cash payments.';
  }
}
