import type { Order } from '../order/order.class.js';
import { CashPayment, CreditCardPayment, PayPalPayment } from '../payment-methods/index.js';

export class Checkout {
    processOrder(order: Order, type: "credit" | "paypal" | "cash"): void {
        let payment;
        
        if (type === "credit") {
            payment = new CreditCardPayment();
        } else if (type === "paypal") {
            payment = new PayPalPayment();
        } else {
            payment = new CashPayment();
        }

        order.setPayment(payment);
        order.processPayment();
        order.getReceipt();
    }
}
