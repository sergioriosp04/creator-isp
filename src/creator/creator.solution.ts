class Producto {
  constructor(
    public nombre: string,
    public precio: number,
  ) {}
}

class ItemCarrito {
  constructor(
    public producto: Producto,
    public cantidad: number,
  ) {}
}

class Carrito {
  private items: ItemCarrito[] = [];
  public agregarItem(item: ItemCarrito): void {
    this.items.push(item);
  }
  // Carrito es quien crea ItemCarrito porque:
  // 1. Carrito CONTIENE a ItemCarrito (relación parte-todo)
  // 2. Carrito AGREGA los ítems a su lista
  // 3. Carrito tiene TODOS los datos necesarios para crearlo
  agregarCarrito(producto: Producto, cantidad: number): void {
    const item = new ItemCarrito(producto, cantidad);
    this.agregarItem(item);
  }
}

// UsuarioController solo le dice al Carrito que agregue un producto,

class UsuarioController {
  public agregarAlCarrito(
    carrito: Carrito,
    producto: Producto,
    cantidad: number,
  ): void {
    carrito.agregarCarrito(producto, cantidad);
  }
}
