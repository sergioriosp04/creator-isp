import { Checkout } from './solution/classes/checkout/checkout.class.js';
import { Order } from './solution/classes/order/order.class.js';

const order = new Order(150);
const checkout = new Checkout();

checkout.processOrder(order, "credit");
order.refundPayment();

const cashOrder = new Order(50);
checkout.processOrder(cashOrder, "cash");
cashOrder.refundPayment();