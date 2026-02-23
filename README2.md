# Comparación: implementación sin ISP/Creator vs implementación con ISP/Creator

## Dominio elegido
El dominio es **e-commerce**, específicamente el flujo de **checkout y procesamiento de pagos** para una orden (`Order`) con métodos como tarjeta, PayPal y efectivo.

## Descripción del problema inicial
En `src/problem` se muestran dos problemas principales:

1. **Sin Creator (GRASP):**
	 - `Checkout` crea directamente los objetos de pago (`CreditCardPayment`, `PayPalPayment`, `CashPayment`).
	 - `Order` recibe el pago desde afuera con `setPayment(...)`, aunque `Order` es quien contiene ese estado y lo usa para procesar/reembolsar/emitir comprobante.
	 - Resultado: alta dependencia de `Checkout` con clases concretas y menor cohesión en `Order`.

2. **Sin ISP (Interface Segregation Principle):**
	 - La interfaz `Payment` obliga a todos los métodos a implementar `payment`, `refund` y `digitalReceipt`.
	 - `CashPayment` implementa comportamientos “vacíos” o no aplicables (por ejemplo, mensajes de que no aplica reembolso/comprobante digital), lo que evidencia una interfaz demasiado grande para algunos clientes.

## Principios aplicados
- **ISP (Interface Segregation Principle):**
	Se separa la interfaz en contratos pequeños y específicos: `Payment`, `Refundable`, `Receiptable` y `FisicalReceiptable`.

- **Creator (GRASP):**
	`Order` asume la creación del método de pago con `createPayment(...)`, porque tiene la información necesaria (`amount`) y es quien posee la relación directa con el pago.

## Justificación breve de decisiones de diseño
- **Mayor mantenibilidad:** cada clase implementa solo lo que necesita; se evita código forzado por una interfaz monolítica.
- **Mejor cohesión:** `Order` concentra el comportamiento de su propio ciclo de pago (crear, pagar, reembolsar, comprobante).
- **Menor acoplamiento en `Checkout`:** `Checkout` deja de conocer detalles de construcción de pagos y delega en `Order`.
- **Evolución más simple:** agregar un nuevo método de pago o nueva capacidad (por ejemplo, comprobante físico) requiere menos cambios transversales y reduce riesgo de romper implementaciones existentes.

## Diagramas de clases

### `src/problem`
![alt text](image-1.png)

### `src/solution`
![alt text](image.png)
