import type { Payment } from '../../interfaces/index.js';

export class CashPayment implements Payment {
  payment(amount: number): void {
    console.log(`Payment of ${amount} made using cash.`);
  }
}
