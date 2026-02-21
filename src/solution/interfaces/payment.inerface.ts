export interface Payment {
  payment(amount: number): void;
}

export interface Refundable {
  refund(amount: number): void;
}

export interface Receiptable {
  digitalReceipt(amount: number): string;
}

export interface FisicalReceiptable {
  fisicalReceipt(amount: number): string;
}