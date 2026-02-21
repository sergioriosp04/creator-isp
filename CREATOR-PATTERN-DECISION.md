# ¿Cómo Decidir Quién Crea Qué? - Patrón Creator (GRASP)

## 🤔 La Gran Pregunta

**¿Por qué Order debería crear Payment y no Checkout?**

Esta es una pregunta fundamental en diseño de software. La respuesta está en los **criterios del patrón Creator de GRASP**.

## 📋 Criterios del Patrón Creator

El patrón Creator dice que debes asignar la responsabilidad de crear un objeto a la clase que cumple **UNO O MÁS** de estos criterios:

### 1. **CONTIENE o AGREGA el objeto** (Más importante)
   - La clase mantiene una referencia al objeto
   - El objeto es parte de la clase
   - Relación de composición o agregación

### 2. **REGISTRA el objeto**
   - La clase lleva un registro del objeto
   - Base de datos, lista, colección, etc.

### 3. **USA DE CERCA el objeto** 
   - La clase hace uso intensivo del objeto
   - Muchas interacciones directas

### 4. **TIENE LOS DATOS necesarios para crear el objeto**
   - La clase posee toda la información requerida
   - No necesita pedir datos a otros

## 🔍 Análisis: ¿Checkout o Order?

Vamos a aplicar los criterios a nuestro caso específico:

### Pregunta: ¿Quién debería crear `Payment`?

| Criterio | ✅ Order | ❌ Checkout | Ganador |
|----------|---------|-------------|---------|
| **1. ¿Contiene Payment?** | ✅ SÍ - Order tiene `private payment: Payment` | ❌ NO - Checkout solo lo pasa de ida | **Order** |
| **2. ¿Registra Payment?** | ✅ SÍ - Mantiene la referencia | ❌ NO - No guarda nada | **Order** |
| **3. ¿Usa de cerca Payment?** | ✅ SÍ - Llama `payment()`, `refund()`, `getReceipt()` | ❌ NO - Solo lo pasa a Order | **Order** |
| **4. ¿Tiene los datos?** | ✅ SÍ - Tiene `amount` (dato esencial) | ⚠️ PARCIAL - Solo tiene `type` | **Order** |

### 📊 Resultado: **Order gana 4-0** (o 4-0.5)

## 💡 Explicación Detallada

### ¿Por qué Order DEBERÍA crear Payment?

#### 1. **Order CONTIENE Payment** (Criterio más fuerte)

```typescript
// ✅ CORRECTO - Order contiene Payment
class Order {
    private payment: Payment;  // ← Payment ES PARTE de Order
    private amount: number;
    
    createPayment(type: string): void {
        this.payment = new CreditCardPayment();  // Order crea lo que contiene
    }
}
```

**Analogía del mundo real:**
- Un **coche** contiene un **motor** → El coche crea/ensambla su motor
- Una **casa** contiene **habitaciones** → La casa define sus habitaciones
- Una **orden** contiene un **pago** → La orden crea su pago

#### 2. **Order USA DE CERCA Payment**

```typescript
class Order {
    createPayment(type: string): void {
        this.payment = new CreditCardPayment();
        this.payment.payment(this.amount);  // ← Order usa payment
    }
    
    refundPayment(): void {
        this.payment.refund(this.amount);   // ← Order usa payment
    }
    
    getReceipt(): void {
        this.payment.digitalReceipt(this.amount);  // ← Order usa payment
    }
}
```

**Order interactúa directamente con Payment en múltiples métodos.**

#### 3. **Order TIENE LOS DATOS necesarios**

```typescript
class Order {
    private amount: number;  // ← Dato esencial para Payment
    
    createPayment(type: string): void {
        // Order tiene TODA la información necesaria
        this.payment = new CreditCardPayment();
        this.payment.payment(this.amount);  // Usa su propio dato
    }
}
```

**Order conoce el monto**, que es información crítica para cualquier pago.

### ¿Por qué Checkout NO DEBERÍA crear Payment?

#### 1. **Checkout NO CONTIENE Payment**

```typescript
// ❌ INCORRECTO - Checkout no contiene Payment
class Checkout {
    // No hay ningún atributo Payment aquí
    
    processOrder(order: Order, type: string): void {
        let payment = new CreditCardPayment();  // ← Crea algo que no le pertenece
        order.setPayment(payment);  // ← Se lo pasa a otro
    }
}
```

**Checkout solo actúa como intermediario.** Crea algo y lo pasa inmediatamente.

#### 2. **Checkout NO USA Payment**

```typescript
class Checkout {
    processOrder(order: Order, type: string): void {
        let payment = new CreditCardPayment();
        order.setPayment(payment);
        order.processPayment();  // ← Order usa payment, NO Checkout
        order.getReceipt();      // ← Order usa payment, NO Checkout
    }
}
```

**Checkout nunca interactúa directamente con Payment.** Solo lo crea y lo entrega.

#### 3. **Checkout NO TIENE todos los datos**

```typescript
class Checkout {
    processOrder(order: Order, type: string): void {
        // Checkout tiene 'type' pero NO tiene 'amount'
        let payment = new CreditCardPayment();
        // ¿Con qué monto? Checkout no lo sabe
    }
}
```

**Checkout solo conoce el TIPO de pago**, pero no el MONTO ni otros detalles.

## 🎯 Regla de Oro del Creator Pattern

> **"Quien lo usa, quien lo contiene, quien tiene los datos, ese lo crea"**

### Aplicado a nuestro caso:

```
Payment es usado por → Order
Payment es contenido en → Order  
Payment necesita datos de → Order
∴ Payment debe ser creado por → Order
```

## 🌍 Ejemplos del Mundo Real

### Ejemplo 1: Restaurante

**¿Quién crea el "Plato de comida"?**

| Opción | Criterios | ¿Debería crearlo? |
|--------|-----------|-------------------|
| **Cliente** | No lo contiene, no lo cocina, solo lo consume | ❌ NO |
| **Mesero** | No lo contiene, solo lo transporta | ❌ NO |
| **Cocina** | Lo contiene, tiene ingredientes, lo prepara, lo usa | ✅ SÍ |

### Ejemplo 2: Tienda Online

**¿Quién crea el "Item del carrito"?**

| Opción | Criterios | ¿Debería crearlo? |
|--------|-----------|-------------------|
| **UsuarioController** | No lo contiene, solo coordina | ❌ NO |
| **Carrito** | Lo contiene (`items[]`), lo gestiona, tiene la lista | ✅ SÍ |

```typescript
// ❌ INCORRECTO
class UsuarioController {
    agregarAlCarrito(carrito: Carrito, producto: Producto, cantidad: number) {
        const item = new ItemCarrito(producto, cantidad);  // ← No le pertenece
        carrito.agregarItem(item);
    }
}

// ✅ CORRECTO
class Carrito {
    private items: ItemCarrito[] = [];  // ← Contiene items
    
    agregarItem(producto: Producto, cantidad: number) {
        const item = new ItemCarrito(producto, cantidad);  // ← Crea lo que contiene
        this.items.push(item);
    }
}
```

### Ejemplo 3: Sistema de Empleados

**¿Quién crea el "Salario"?**

| Opción | Criterios | ¿Debería crearlo? |
|--------|-----------|-------------------|
| **Departamento** | No lo contiene, solo agrupa empleados | ❌ NO |
| **Empresa** | Gestiona todo, pero muy general | ⚠️ PUEDE |
| **Empleado** | Lo contiene (`salario`), lo usa (recibir, calcular), tiene datos (horas, base) | ✅ SÍ |

## 📐 Flujo de Decisión

```
┌─────────────────────────────────────┐
│ ¿Necesito crear un objeto A?        │
└────────────┬────────────────────────┘
             │
             ▼
    ┌────────────────────┐
    │ ¿Quién CONTIENE A? │ ────► Si alguien lo contiene ──► ✅ ESE lo crea
    └────────────────────┘
             │
             ▼ Nadie lo contiene claramente
    ┌────────────────────┐
    │ ¿Quién USA más A?  │ ────► Si alguien lo usa mucho ──► ✅ ESE lo crea
    └────────────────────┘
             │
             ▼ Varios lo usan igual
    ┌─────────────────────────┐
    │ ¿Quién tiene los DATOS? │ ────► El que tiene datos completos ──► ✅ ESE lo crea
    └─────────────────────────┘
             │
             ▼ Aún no claro
    ┌───────────────────────────┐
    │ ¿Quién lo REGISTRA?       │ ────► El que mantiene registro ──► ✅ ESE lo crea
    └───────────────────────────┘
```

## 🔄 Volviendo a Nuestro Caso

### Pregunta Original: ¿Por qué Checkout no puede tener la info del pago?

**Respuesta Corta:** 
Sí PUEDE tenerla técnicamente, pero **NO DEBERÍA** porque viola el principio de responsabilidad única y acoplamiento.

**Respuesta Larga:**

#### Opción A: Checkout crea Payment (INCORRECTO)

```typescript
class Checkout {
    processOrder(order: Order, type: string): void {
        // ❌ Problemas:
        // 1. Checkout debe conocer TODOS los tipos de Payment
        // 2. Si agregamos BitcoinPayment, modificamos Checkout
        // 3. Checkout tiene lógica que no es su responsabilidad
        // 4. Alto acoplamiento
        
        let payment;
        if (type === "credit") payment = new CreditCardPayment();
        else if (type === "paypal") payment = new PayPalPayment();
        else payment = new CashPayment();
        
        order.setPayment(payment);
    }
}
```

**Problemas:**
- 🔴 Checkout conoce detalles de Payment (alto acoplamiento)
- 🔴 Cambios en Payment afectan a Checkout
- 🔴 Checkout hace trabajo que no le corresponde
- 🔴 Más difícil de testear

#### Opción B: Order crea Payment (CORRECTO)

```typescript
class Order {
    private payment: Payment;
    private amount: number;
    
    createPayment(type: string): void {
        // ✅ Beneficios:
        // 1. Order encapsula la lógica de creación
        // 2. Checkout no conoce los detalles
        // 3. Bajo acoplamiento
        // 4. Responsabilidad clara
        
        if (type === "credit") {
            this.payment = new CreditCardPayment();
        } else if (type === "paypal") {
            this.payment = new PayPalPayment();
        } else {
            this.payment = new CashPayment();
        }
        
        this.payment.payment(this.amount);
    }
}

class Checkout {
    processOrder(order: Order, type: string): void {
        // ✅ Checkout solo coordina, no crea
        order.createPayment(type);
        order.getReceipt();
    }
}
```

**Beneficios:**
- ✅ Bajo acoplamiento en Checkout
- ✅ Order tiene toda la responsabilidad de su pago
- ✅ Fácil de extender (nuevo Payment no afecta Checkout)
- ✅ Más fácil de testear

## 📊 Comparación de Diseños

| Aspecto | Checkout crea Payment | Order crea Payment |
|---------|----------------------|-------------------|
| **Acoplamiento** | Alto (conoce todos los Payments) | Bajo (solo conoce Order) |
| **Cohesión** | Baja (hace cosas no relacionadas) | Alta (gestiona su propio estado) |
| **SRP** | ❌ Viola (múltiples razones para cambiar) | ✅ Cumple |
| **OCP** | ❌ Viola (hay que modificar para extender) | ✅ Cumple (más fácil) |
| **Encapsulación** | ❌ Pobre (Order expone setter) | ✅ Buena (Order se autogestiona) |
| **Testabilidad** | Más complejo | Más simple |

## 🎓 Resumen Ejecutivo

### ¿Cómo decido quién crea qué?

1. **Pregúntate:** ¿Quién CONTIENE el objeto?
2. **Pregúntate:** ¿Quién USA el objeto frecuentemente?
3. **Pregúntate:** ¿Quién TIENE los datos para crearlo?
4. **Pregúntate:** ¿Quién REGISTRA o mantiene el objeto?

**La clase que responda SÍ a más preguntas, esa debe crearlo.**

### En nuestro caso:

```
Payment:
✅ Contenido por → Order
✅ Usado por → Order  
✅ Necesita datos de → Order
❌ Solo coordinado por → Checkout

∴ Order debe crear Payment
```

## 💡 Regla Mental Rápida

> **"Si lo creas y lo pasas inmediatamente, probablemente NO deberías crearlo."**

```typescript
// ❌ Señal de alarma
class Checkout {
    processOrder() {
        let payment = new Payment();  // Crea
        order.setPayment(payment);    // Pasa inmediatamente
        // ↑ Si haces esto, probablemente la responsabilidad está mal
    }
}

// ✅ Mejor diseño
class Order {
    createPayment() {
        this.payment = new Payment();  // Crea y mantiene
        // ↑ Lo crea porque lo va a usar y contener
    }
}
```

## 🔗 Relación con Otros Principios

### Single Responsibility Principle (SRP)
- **Checkout:** Responsable de coordinar el proceso de checkout
- **Order:** Responsable de gestionar la orden y su pago

Si Checkout crea Payment, tendría dos responsabilidades.

### Tell, Don't Ask
- **Checkout le DICE a Order:** "Crea tu pago con este tipo"
- **NO:** "Aquí está tu pago (te lo pregunto/inyecto)"

### Low Coupling
- Order crear su propio Payment reduce dependencias
- Checkout no necesita conocer detalles de Payment

## 🎯 Conclusión

**¿Por qué Order y no Checkout?**

Porque Order:
1. ✅ **Contiene** Payment (criterio más fuerte)
2. ✅ **Usa** Payment extensivamente
3. ✅ **Tiene los datos** necesarios (amount)
4. ✅ **Es el dueño natural** del ciclo de vida del pago

**Checkout solo coordina, Order gestiona.**

---

**Principio de diseño:**
> "Asigna responsabilidades a quien tenga la relación más estrecha con los objetos involucrados."
