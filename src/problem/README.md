# Sistema de Pagos - PROBLEMAS DE DISEÑO ❌

## 📋 Descripción

Esta carpeta contiene una implementación con **problemas de diseño** que viola principios fundamentales de SOLID y GRASP. Se presenta como ejemplo de **anti-patrones** para contrastar con la solución correcta en `src/solution/`.

## ⚠️ Problemas Identificados

### 1. ❌ **Violación de Interface Segregation Principle (ISP)**

**Problema:** Interfaz monolítica que obliga a todas las clases a implementar métodos que no necesitan.

```typescript
// ❌ Interfaz monolítica
interface Payment {
  payment(amount: number): void;
  refund(amount: number): void;           // ¡No todos necesitan esto!
  digitalReceipt(amount: number): string; // ¡No todos necesitan esto!
}
```

**Consecuencias:**

#### CashPayment forzado a implementar métodos irrelevantes:
```typescript
class CashPayment implements Payment {
  payment(amount: number): void {
    console.log(`Payment of ${amount} made using cash.`);
  }

  // ❌ Implementación forzada - no tiene sentido para efectivo
  refund(amount: number): void {
    console.log('Refunds are not applicable for cash payments.');
  }

  // ❌ Implementación forzada - no tiene sentido para efectivo
  digitalReceipt(amount: number): string {
    return 'Digital receipts are not applicable for cash payments.';
  }
}
```

**Problemas derivados:**
- 🔴 **Código muerto:** Métodos que nunca deberían ser llamados
- 🔴 **Confusión:** ¿Qué métodos son realmente válidos?
- 🔴 **Mantenimiento:** Más código innecesario que mantener
- 🔴 **Extensibilidad limitada:** Nuevos métodos de pago heredan restricciones innecesarias

### 2. ❌ **Violación de Creator Pattern (GRASP)**

**Problema:** La responsabilidad de crear objetos Payment está en la clase equivocada.

#### Checkout crea Payment (INCORRECTO):
```typescript
class Checkout {
    processOrder(order: Order, type: "credit" | "paypal" | "cash"): void {
        // ❌ Checkout NO debería crear Payment porque:
        // - NO contiene Payment
        // - NO tiene relación directa con Payment
        // - NO es el dueño natural
        let payment;
        
        if (type === "credit") {
            payment = new CreditCardPayment();
        } else if (type === "paypal") {
            payment = new PayPalPayment();
        } else {
            payment = new CashPayment();
        }

        order.setPayment(payment); // ❌ Inyección externa
        order.processPayment();
    }
}
```

#### Order recibe Payment en lugar de crearlo (INCORRECTO):
```typescript
class Order {
    private payment?: Payment;

    // ❌ Order DEBERÍA crear su propio pago, no recibirlo
    setPayment(payment: Payment): void {
        this.payment = payment;
    }

    processPayment(): void {
        if (!this.payment) {
            throw new Error('Payment method not set'); // ❌ Estado inconsistente
        }
        this.payment.payment(this.amount);
    }
}
```

**Problemas derivados:**
- 🔴 **Alto acoplamiento:** Checkout conoce todos los tipos de Payment
- 🔴 **Responsabilidad mal ubicada:** Checkout tiene lógica que no le corresponde
- 🔴 **Estado inconsistente:** Order puede existir sin Payment
- 🔴 **Difícil de testear:** Más dependencias que mockear
- 🔴 **Violación de Tell, Don't Ask:** Order debe pedir su pago a otros

## 🏗️ Estructura del Problema

```
src/problem/
├── interfaces/
│   ├── index.ts
│   └── payment.interface.ts       # ❌ Interfaz monolítica
├── classes/
│   ├── index.ts
│   ├── payment-methods/
│   │   ├── index.ts
│   │   ├── cash-payment.ts        # ❌ Implementa métodos innecesarios
│   │   ├── credit-card-payment.ts # ✅ Usa todos los métodos
│   │   └── paypal-payment.ts      # ✅ Usa todos los métodos
│   ├── order/
│   │   └── order.class.ts         # ❌ NO crea su pago
│   └── checkout/
│       └── checkout.class.ts      # ❌ Crea pagos que no le pertenecen
└── README.md                       # Este archivo
```

## 🔍 Análisis Detallado de los Problemas

### Problema 1: Interface Segregation Principle (ISP)

#### ¿Qué dice ISP?
> "Los clientes no deberían verse obligados a depender de interfaces que no utilizan."

#### ¿Cómo se viola en este código?

| Método de Pago | `payment()` | `refund()` | `digitalReceipt()` |
|----------------|-------------|------------|-------------------|
| CreditCard     | ✅ Necesita | ✅ Necesita | ✅ Necesita       |
| PayPal         | ✅ Necesita | ✅ Necesita | ✅ Necesita       |
| Cash           | ✅ Necesita | ❌ NO necesita | ❌ NO necesita  |

**Resultado:** `CashPayment` se ve forzado a implementar `refund()` y `digitalReceipt()` aunque no los necesita.

#### ¿Por qué es un problema?

1. **Implementaciones falsas:**
   ```typescript
   refund(amount: number): void {
     console.log('Refunds are not applicable for cash payments.');
   }
   ```
   - Este método nunca debería existir en `CashPayment`
   - Si alguien lo llama, no falla pero tampoco hace nada útil
   - Genera confusión: ¿es un error llamarlo o no?

2. **Violación del Liskov Substitution Principle:**
   - Si sustituimos `CreditCardPayment` por `CashPayment`, el comportamiento cambia inesperadamente
   - No todos los `Payment` son realmente intercambiables

3. **Dificultad para agregar nuevos métodos:**
   - Si queremos agregar `monthlyStatement()` a `CreditCardPayment`, ¿debemos agregarlo a la interfaz `Payment`?
   - Si sí, todos los pagos deben implementarlo (incluso si no aplica)
   - Si no, ¿cómo accedemos a esa funcionalidad?

### Problema 2: Creator Pattern (GRASP)

#### ¿Qué dice Creator Pattern?
> "Asignar la responsabilidad de crear objetos a la clase que cumple uno o más de estos criterios:
> 1. Contiene o agrega el objeto
> 2. Registra el objeto
> 3. Usa de cerca el objeto
> 4. Tiene los datos necesarios para crear el objeto"

#### ¿Cómo se viola en este código?

**Análisis de responsabilidades:**

| Criterio | Checkout | Order |
|----------|----------|-------|
| Contiene Payment | ❌ No | ✅ Sí |
| Registra Payment | ❌ No | ✅ Sí |
| Usa de cerca Payment | ❌ Solo pasa | ✅ Sí |
| Tiene datos para crearlo | ❌ No (solo el tipo) | ✅ Sí (amount) |

**Conclusión:** Order debería crear Payment, NO Checkout.

#### ¿Por qué es un problema?

1. **Alto acoplamiento en Checkout:**
   ```typescript
   import { CashPayment, CreditCardPayment, PayPalPayment } from '../payment-methods/index.js';
   ```
   - Checkout debe conocer TODOS los tipos de Payment
   - Si agregamos `BitcoinPayment`, debemos modificar Checkout
   - Violación del Open/Closed Principle

2. **Responsabilidad mal ubicada:**
   - Checkout tiene lógica de negocio que no le corresponde
   - Si cambia la forma de crear Payments, debemos modificar Checkout
   - Checkout debería solo orquestar, no crear

3. **Estado inconsistente en Order:**
   ```typescript
   if (!this.payment) {
       throw new Error('Payment method not set');
   }
   ```
   - Order puede existir sin Payment (estado inválido)
   - Necesita validaciones defensivas en todos los métodos
   - Mayor probabilidad de errores en runtime

4. **Difícil de testear:**
   - Para testear Checkout necesitamos mockear todos los Payment
   - Para testear Order necesitamos crear Payment manualmente
   - Más dependencias = más complejidad en tests

## 📊 Impacto de los Problemas

### Métricas de Calidad

| Métrica | Problema | Solución | Impacto |
|---------|----------|----------|---------|
| **Acoplamiento** | Alto | Bajo | 🔴 Crítico |
| **Cohesión** | Baja | Alta | 🔴 Crítico |
| **Mantenibilidad** | Difícil | Fácil | 🟡 Moderado |
| **Extensibilidad** | Limitada | Alta | 🔴 Crítico |
| **Testabilidad** | Compleja | Simple | 🟡 Moderado |
| **Claridad** | Confusa | Clara | 🟢 Menor |

### Escenarios de Cambio

#### Escenario 1: Agregar nuevo método de pago (Bitcoin)

**En el problema:**
1. ❌ Crear `BitcoinPayment` implementando TODOS los métodos (aunque no los necesite)
2. ❌ Modificar `Checkout` para agregar el caso `bitcoin`
3. ❌ Si Bitcoin no soporta refunds, implementar método vacío

**Archivos a modificar:** 3 archivos

#### Escenario 2: Agregar capacidad de `monthlyStatement()`

**En el problema:**
1. ❌ ¿Agregar a la interfaz `Payment`? (obliga a TODOS)
2. ❌ ¿Crear nueva interfaz? (pero entonces Payment no es completo)
3. ❌ ¿Type casting? (pierde seguridad de tipos)

**Problemas:** No hay solución limpia

#### Escenario 3: Cambiar lógica de creación de Payments

**En el problema:**
1. ❌ Modificar `Checkout` (que no debería conocer esa lógica)
2. ❌ Riesgo de romper el proceso de checkout

## 🎯 ¿Cómo se resuelve?

Ver la implementación correcta en **[src/solution/](../solution/README.md)** que aplica:

✅ **Interface Segregation Principle:** Interfaces pequeñas y específicas
✅ **Creator Pattern:** Order crea sus propios Payments
✅ **Single Responsibility:** Cada clase tiene una responsabilidad clara
✅ **Open/Closed:** Extensible sin modificar código existente

## 🚀 Ejemplo de Uso del Problema

```typescript
import { Order } from './classes/order/order.class.js';
import { Checkout } from './classes/checkout/checkout.class.js';

// Crear orden
const order = new Order(100);

// ❌ Checkout crea el pago (responsabilidad mal ubicada)
const checkout = new Checkout();
checkout.processOrder(order, "cash");

// ❌ Si intentamos reembolsar efectivo, ejecuta método sin sentido
order.refundPayment(); // "Refunds are not applicable for cash payments."
```

## 📝 Conclusión

Este código demuestra cómo la violación de principios de diseño genera:
- 🔴 Código acoplado y difícil de mantener
- 🔴 Implementaciones falsas y confusas
- 🔴 Responsabilidades mal ubicadas
- 🔴 Dificultad para extender funcionalidad
- 🔴 Estado inconsistente en objetos

**Comparar con [src/solution/](../solution/README.md) para ver la implementación correcta.**
