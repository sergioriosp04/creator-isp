import type { Order } from '../order/order.class.js';
import { CashPayment, CreditCardPayment, PayPalPayment } from '../payment-methods/index.js';

// ❌ PROBLEMA CREATOR: Checkout crea el Payment
// Esto viola Creator Pattern porque Checkout:
// - NO contiene el pago
// - NO tiene relación directa con Payment
// - NO es el dueño natural del pago
export class Checkout {
    processOrder(order: Order, type: "credit" | "paypal" | "cash"): void {
        // ❌ Checkout está creando objetos con los que no tiene relación
        // Esta responsabilidad debería ser de Order
        let payment;
        
        if (type === "credit") {
            payment = new CreditCardPayment();
        } else if (type === "paypal") {
            payment = new PayPalPayment();
        } else {
            payment = new CashPayment();
        }

        // ❌ Order depende de que alguien más cree su pago
        order.setPayment(payment);
        order.processPayment();
        order.getReceipt();
    }
}
