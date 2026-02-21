# Sistema de Pagos - Aplicando SOLID y GRASP

## 📋 Descripción

Sistema de procesamiento de órdenes y pagos que implementa los principios SOLID (Interface Segregation Principle) y GRASP (Creator Pattern) para lograr un código más mantenible, escalable y con responsabilidades bien definidas.

## 🎯 Principios Aplicados

### 1. **Interface Segregation Principle (ISP) - SOLID**

**Definición:** Los clientes no deberían verse obligados a depender de interfaces que no utilizan.

**Problema Original:**
- Una interfaz monolítica `payment` con métodos `payment()`, `refund()` y `digitalReceipt()`
- `CashPayment` implementaba métodos que no aplicaban (refund y digitalReceipt)
- Violación del ISP al forzar implementaciones vacías o con mensajes "not applicable"

**Solución Implementada:**
```typescript
// Interfaces segregadas por capacidad
interface Payment          // Método básico de pago
interface Refundable       // Capacidad de reembolso
interface Receiptable      // Recibo digital
interface FisicalReceiptable // Recibo físico
```

**Beneficios:**
- ✅ Cada clase implementa solo las interfaces que realmente necesita
- ✅ Mayor flexibilidad para agregar nuevos métodos de pago
- ✅ Código más limpio sin implementaciones vacías

### 2. **Creator Pattern - GRASP**

**Definición:** Asignar la responsabilidad de crear objetos a la clase que tiene la información necesaria y es el contenedor natural.

**Problema Original:**
```typescript
// UsuarioController creaba ItemCarrito sin tener relación directa
const item = new ItemCarrito(producto, cantidad);
carrito.agregarItem(item);
```

**Solución Implementada:**
```typescript
// Order crea Payment porque:
// 1. Order CONTIENE el pago
// 2. Order tiene TODOS los datos necesarios (amount)
// 3. Order es el dueño natural del proceso de pago
createPayment(type: "credit" | "paypal" | "cash"): void {
    if (type === "credit") {
        this.payment = new CreditCardPayment();
    } else if (type === "paypal") {
        this.payment = new PayPalPayment();
    } else {
        this.payment = new CashPayment();
    }
    this.payment.payment(this.amount);
}
```

**Beneficios:**
- ✅ Responsabilidades claramente definidas
- ✅ Bajo acoplamiento entre componentes
- ✅ Alta cohesión en cada clase

## 🏗️ Estructura del Proyecto

```
src/solution/
├── interfaces/                    # Definición de contratos
│   ├── index.ts                  # Exportaciones centralizadas
│   └── payment.inerface.ts       # Interfaces segregadas de pago
├── classes/                      # Implementaciones concretas
│   ├── index.ts                  # Exportaciones centralizadas
│   ├── payment-methods/          # Métodos de pago concretos
│   │   ├── index.ts             # Exportaciones de métodos de pago
│   │   ├── cash-payment.ts      # Pago en efectivo (solo Payment)
│   │   ├── credit-card-payment.ts # Tarjeta de crédito (Payment + Refundable + Receiptable)
│   │   └── paypal-payment.ts    # PayPal (Payment + Refundable + Receiptable)
│   ├── order/                    # Gestión de órdenes
│   │   └── order.class.ts       # Clase Order (Creator)
│   └── checkout/                 # Proceso de checkout
│       └── checkout.class.ts    # Orquestador del proceso
└── README.md                     # Documentación
```

## 📐 Convenciones de Nombres

### Archivos
- **Interfaces:** `*.interface.ts` - Define contratos
- **Clases:** `*.class.ts` - Implementaciones concretas
- **Índices:** `index.ts` - Exportaciones centralizadas (barrel pattern)

### Directorios
- **kebab-case:** `payment-methods/`, `interface-segregation/`
- **Agrupación por funcionalidad:** Cada carpeta agrupa componentes relacionados

### Código
- **PascalCase:** Clases e Interfaces (`CreditCardPayment`, `Payment`, `Order`)
- **camelCase:** Métodos y propiedades (`createPayment`, `processOrder`, `amount`)
- **Descriptivo:** Nombres que indican claramente su propósito

## 🔧 Componentes del Sistema

### 1. **Interfaces** (`interfaces/payment.inerface.ts`)

#### `Payment`
```typescript
interface Payment {
  payment(amount: number): void;
}
```
- **Responsabilidad:** Contrato base para realizar pagos
- **Implementan:** Todos los métodos de pago

#### `Refundable`
```typescript
interface Refundable {
  refund(amount: number): void;
}
```
- **Responsabilidad:** Capacidad de procesar reembolsos
- **Implementan:** `CreditCardPayment`, `PayPalPayment`

#### `Receiptable`
```typescript
interface Receiptable {
  digitalReceipt(amount: number): string;
}
```
- **Responsabilidad:** Generación de recibos digitales
- **Implementan:** `CreditCardPayment`, `PayPalPayment`

#### `FisicalReceiptable`
```typescript
interface FisicalReceiptable {
  fisicalReceipt(amount: number): string;
}
```
- **Responsabilidad:** Generación de recibos físicos
- **Implementan:** `CashPayment` (podría implementarse en el futuro)

### 2. **Métodos de Pago** (`classes/payment-methods/`)

#### `CashPayment`
```typescript
class CashPayment implements Payment
```
- **Implementa:** Solo `Payment` (ISP aplicado)
- **Característica:** Pago simple sin reembolsos ni recibos digitales

#### `CreditCardPayment`
```typescript
class CreditCardPayment implements Payment, Refundable, Receiptable
```
- **Implementa:** Todas las capacidades
- **Características:** Pago + Reembolso + Recibo digital

#### `PayPalPayment`
```typescript
class PayPalPayment implements Payment, Refundable, Receiptable
```
- **Implementa:** Todas las capacidades
- **Características:** Pago + Reembolso + Recibo digital

### 3. **Order** (`classes/order/order.class.ts`)

**Responsabilidades:**
- ✅ **Creator:** Crear instancias de métodos de pago (tiene la información necesaria)
- ✅ Gestionar el monto de la orden
- ✅ Coordinar el proceso de pago
- ✅ Gestionar reembolsos cuando aplique
- ✅ Generar recibos según el método de pago

**Métodos clave:**
```typescript
createPayment(type: "credit" | "paypal" | "cash"): void
  // Crea y ejecuta el pago apropiado

refundPayment(): void
  // Procesa reembolso si el método lo soporta

getReceipt(): void
  // Genera recibo digital o físico según el método
```

### 4. **Checkout** (`classes/checkout/checkout.class.ts`)

**Responsabilidades:**
- ✅ Orquestar el proceso de checkout
- ✅ Delegar responsabilidades a Order (bajo acoplamiento)
- ❌ NO crear métodos de pago directamente (respeta Creator Pattern)

**Método principal:**
```typescript
processOrder(order: Order, type: "credit" | "paypal" | "cash"): void
  // Proceso completo: pago + recibo
```

## 🔄 Flujo de Funcionamiento

```
1. Checkout.processOrder()
   │
   ├─> 2. Order.createPayment()
   │      │
   │      ├─> Crea instancia de Payment (CreditCard/PayPal/Cash)
   │      └─> Ejecuta payment()
   │
   └─> 3. Order.getReceipt()
          │
          └─> Genera recibo según capacidades del método de pago
```

## 💡 Decisiones de Diseño

### ¿Por qué Order crea Payment?
1. **Contención:** Order contiene el objeto Payment
2. **Información completa:** Order tiene el monto necesario
3. **Dueño natural:** Order gestiona todo el ciclo de vida del pago

### ¿Por qué interfaces segregadas?
1. **Flexibilidad:** Nuevos métodos de pago solo implementan lo necesario
2. **Claridad:** Cada interfaz tiene un propósito único
3. **Mantenibilidad:** Cambios en una capacidad no afectan las demás

### ¿Por qué verificación en runtime (`"refund" in this.payment`)?
- TypeScript no soporta type guards automáticos para interfaces
- Permite verificar capacidades dinámicamente
- Alternativa: usar clases abstractas o type guards personalizados

## 🚀 Uso del Sistema

```typescript
import { Order } from './classes/order/order.class.js';
import { Checkout } from './classes/checkout/checkout.class.js';

// Crear orden
const order = new Order(100);

// Procesar con checkout
const checkout = new Checkout();
checkout.processOrder(order, "credit");

// Reembolso (si aplica)
order.refundPayment();
```

## 📊 Comparación: Antes vs Después

| Aspecto | Problema | Solución |
|---------|----------|----------|
| **Interfaces** | Monolítica con métodos no utilizados | Segregadas por capacidad |
| **CashPayment** | Implementa métodos vacíos | Solo implementa Payment |
| **Creación de objetos** | Controller crea objetos sin relación | Order crea Payment (Creator) |
| **Acoplamiento** | Alto entre componentes | Bajo, cada clase tiene su responsabilidad |
| **Extensibilidad** | Difícil agregar nuevos métodos | Fácil, solo implementar interfaces necesarias |

## 🎓 Principios Demostrados

- ✅ **Interface Segregation Principle (ISP)**
- ✅ **Creator Pattern (GRASP)**
- ✅ **Single Responsibility Principle (SRP)** - Cada clase tiene una responsabilidad clara
- ✅ **Open/Closed Principle (OCP)** - Abierto para extensión (nuevos pagos), cerrado para modificación
- ✅ **Low Coupling** - Componentes independientes
- ✅ **High Cohesion** - Funcionalidades relacionadas juntas

## 📝 Notas Adicionales

- El sistema usa **TypeScript** con tipos estrictos
- Rutas de importación con extensión `.js` (compatibilidad ES Modules)
- Patrón **Barrel** con archivos `index.ts` para exportaciones limpias
- Comentarios explicativos en puntos clave del código
