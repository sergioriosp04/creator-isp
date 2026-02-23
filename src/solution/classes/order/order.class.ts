import type { FisicalReceiptable, Payment, Receiptable, Refundable } from '../../interfaces/payment.inerface.js';
import { CashPayment, CreditCardPayment, PayPalPayment } from '../payment-methods/index.js';

export class Order {
    private payment!: Payment;
    private amount: number;

    constructor(amount: number) {
        this.amount = amount;
    }

    createPayment(type: "credit" | "paypal" | "cash"): void {
        if (type === "credit") {
            this.payment = new CreditCardPayment();
        } else if (type === "paypal") {
            this.payment = new PayPalPayment();
        } else {
            this.payment = new CashPayment();
        }

        this.payment.payment(this.amount);
    }

    refundPayment(): void {
        if ("refund" in this.payment) {
            (this.payment as Refundable).refund(this.amount);
        } else {
            console.log("This payment method does not support refunds.");
        }
    }

    getReceipt(): void {
        if ("digitalReceipt" in this.payment) {
            console.log((this.payment as Receiptable).digitalReceipt(this.amount));
        } else if ("fisicalReceipt" in this.payment) {
            console.log((this.payment as FisicalReceiptable).fisicalReceipt(this.amount));
        }
    }
}