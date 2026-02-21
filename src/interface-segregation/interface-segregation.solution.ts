interface Payment {
  payment(amount: number): void;
}

interface Refundable {
  refund(amount: number): void;
}

interface Receiptable {
  digitalReceipt(amount: number): string;
}

class CreditCardPayment implements Payment, Refundable, Receiptable {
  payment(amount: number): void {
    console.log(`Payment of ${amount} made using credit card.`);
  }
  refund(amount: number): void {
    console.log(`Refund of ${amount} processed for credit card.`);
  }
  digitalReceipt(amount: number): string {
    return `Receipt for credit card payment of ${amount} generated.`;
  }
}

class PayPalPayment implements Payment, Refundable, Receiptable {
  payment(amount: number): void {
    console.log(`Payment of ${amount} made using PayPal.`);
  }
  refund(amount: number): void {
    console.log(`Refund of ${amount} processed for PayPal.`);
  }
  digitalReceipt(amount: number): string {
    return `Receipt for PayPal payment of ${amount} generated.`;
  }
}

class CashPayment implements Payment {
  payment(amount: number): void {
    console.log(`Payment of ${amount} made using cash.`);
  }
}