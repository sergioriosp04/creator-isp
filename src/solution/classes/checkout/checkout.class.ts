import type { Order } from '../order/order.class.js';

export class Checkout {
    processOrder(order: Order, type: "credit" | "paypal" | "cash"): void {
        order.createPayment(type);
        order.getReceipt();
    }
}