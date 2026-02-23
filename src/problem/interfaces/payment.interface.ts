export interface Payment {
  payment(amount: number): void;
  refund(amount: number): void;
  digitalReceipt(amount: number): string;
}
