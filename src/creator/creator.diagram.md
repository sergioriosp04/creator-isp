# Creator (GRASP) - Diagramas

Para **Creator**, el diagrama más claro suele ser el de **secuencia**, porque muestra explícitamente **quién crea el objeto**.

## 1) Problema (sin aplicar Creator)

### Diagrama de secuencia

```mermaid
sequenceDiagram
    participant U as UsuarioController
    participant I as ItemCarrito
    participant C as Carrito

    U->>I: new ItemCarrito(producto, cantidad) ❌
    U->>C: agregarItem(item)
```

## 2) Solución (aplicando Creator)

### Diagrama de secuencia

```mermaid
sequenceDiagram
    participant U as UsuarioController
    participant C as Carrito
    participant I as ItemCarrito

    U->>C: agregarCarrito(producto, cantidad)
    C->>I: new ItemCarrito(producto, cantidad) ✅
    C->>C: agregarItem(item)
```

## Idea clave para explicarlo fácil

En Creator, la pregunta central es: **¿quién debería crear `ItemCarrito`?**

- Si una clase **contiene** o **administra** esos objetos, normalmente esa clase debe crearlos.
- Aquí, `Carrito` contiene `ItemCarrito`, por eso `Carrito` es el creador natural.
