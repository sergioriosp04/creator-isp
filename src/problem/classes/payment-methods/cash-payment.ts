import type { Payment } from '../../interfaces/payment.interface.js';

// ❌ PROBLEMA ISP: CashPayment se ve obligado a implementar métodos que no usa
// Violación del Interface Segregation Principle
export class CashPayment implements Payment {
  payment(amount: number): void {
    console.log(`Payment of ${amount} made using cash.`);
  }

  // ❌ CashPayment no debería tener que implementar esto
  refund(amount: number): void {
    console.log('Refunds are not applicable for cash payments.');
  }

  // ❌ CashPayment no debería tener que implementar esto
  digitalReceipt(amount: number): string {
    return 'Digital receipts are not applicable for cash payments.';
  }
}
