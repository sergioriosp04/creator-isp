import type { Payment } from '../../interfaces/payment.interface.js';

export class Order {
    private payment?: Payment;
    private amount: number;

    constructor(amount: number) {
        this.amount = amount;
    }

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
