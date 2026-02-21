import type { Order } from '../order/order.class.js';

export class Checkout {
    processOrder(order: Order, type: "credit" | "paypal" | "cash"): void {
        // ✅ Checkout solo le dice a Order qué hacer,
        // no se mete en cómo se crean los pagos
        order.createPayment(type);
        order.getReceipt();
    }
}