import type { Payment } from '../../interfaces/payment.interface.js';

// ❌ PROBLEMA CREATOR: Order NO crea el pago
// El pago se le inyecta desde afuera, violando el Creator Pattern
export class Order {
    private payment?: Payment;
    private amount: number;

    constructor(amount: number) {
        this.amount = amount;
    }

    // ❌ Order recibe el pago desde afuera en lugar de crearlo
    // Esto viola Creator Pattern porque Order:
    // - CONTIENE el pago
    // - Tiene toda la información necesaria (amount)
    // - Es el dueño natural del pago
    // Pero NO lo crea
    setPayment(payment: Payment): void {
        this.payment = payment;
    }

    processPayment(): void {
        if (!this.payment) {
            throw new Error('Payment method not set');
        }
        this.payment.payment(this.amount);
    }

    refundPayment(): void {
        if (!this.payment) {
            throw new Error('Payment method not set');
        }
        this.payment.refund(this.amount);
    }

    getReceipt(): void {
        if (!this.payment) {
            throw new Error('Payment method not set');
        }
        console.log(this.payment.digitalReceipt(this.amount));
    }
}
