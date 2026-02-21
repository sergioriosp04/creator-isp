// ❌ PROBLEMA: Interfaz monolítica
// Todos los métodos de pago deben implementar TODOS estos métodos
// incluso si no los necesitan o no aplican para ellos

export interface Payment {
  payment(amount: number): void;
  refund(amount: number): void;
  digitalReceipt(amount: number): string;
}
