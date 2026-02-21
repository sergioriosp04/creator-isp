class Producto {
    constructor(public nombre: string, public precio: number) {}
}

class ItemCarrito {
    constructor(public producto: Producto, public cantidad: number) {

    }  
}

class Carrito {
    private items: ItemCarrito[] = [];
    public agregarItem(item: ItemCarrito): void {
        this.items.push(item);
    }
}



class UsuarioController {
    public agregarAlCarrito( carrito: Carrito,  producto: Producto, cantidad: number):void {
        // UsuarioController no tiene ninguna relación con ItemCarrito
        // No lo contiene, no lo agrega, no es su dueño.
        // Pero igual lo está creando.
        const item = new ItemCarrito(producto, cantidad); // Esto no debería ser responsabilidad de UsuarioController
        carrito.agregarItem(item);
    }
}