interface payment {
  payment(amount: number): void;
  refund(amount: number): void;
  digitalReceipt(amount: number): string;
}

class CreditCardPayment implements payment {
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

class PayPalPayment implements payment {
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

class CashPayment implements payment {
  payment(amount: number): void {
    console.log(`Payment of ${amount} made using cash.`);
  }
  refund(amount: number): void {
    console.log(`not applicable for cash payment.`);
  }
  digitalReceipt(amount: number): string {
    return `not applicable for cash payment.`;
  }
}