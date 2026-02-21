# Principios de Diseño Aplicados – Exposición Práctica

## Equipo 2 – Creator (GRASP) + ISP (Interface Segregation Principle)

---

## 🎯 Objetivo del Taller

Analizar, ejemplificar y aplicar principios de diseño de software en un contexto práctico, evidenciando cómo su correcta aplicación transforma un modelo de clases y su código asociado, mejorando:

* Mantenibilidad
* Extensibilidad
* Cohesión
* Bajo acoplamiento
* Calidad estructural del diseño

Este trabajo se enfoca en demostrar decisiones de diseño fundamentadas mediante la evaluación de beneficios.

---

## 🧩 Dominio Elegido

**Sistema de Gestión de Pedidos **

El sistema permite:

* Crear pedidos
* Agregar productos a un pedido
* Procesar pagos
* Notificar estados del pago

---

## 🚨 Problema Inicial

El diseño original presenta los siguientes problemas estructurales:

* Creación dispersa de objetos (entidades creadas desde múltiples puntos del sistema).
* Interfaces con múltiples métodos no utilizados por todas las implementaciones.
* Clases forzadas a implementar comportamientos irrelevantes.
* Alto acoplamiento entre cliente y clases concretas.

### Smells identificados:

* Métodos no usados.
* Implementaciones forzadas.
* Violaciones del principio de responsabilidad.
* Dependencias innecesarias.
* Creación fuera del contexto de agregación.

---

## 📌 Principios Aplicados

### Creator (GRASP)

Se asignó la responsabilidad de creación a la clase que:

* Contiene o agrega el objeto.
* Posee la información necesaria para inicializarlo.
* Controla su ciclo de vida.
* Lo utiliza de manera intensiva.

**Impacto esperado:**

* Reducción de acoplamiento.
* Encapsulamiento del ciclo de vida.
* Mayor coherencia del modelo de dominio.
* Centralización de reglas de negocio.

---

### ISP (Interface Segregation Principle)

Se dividieron interfaces grandes en contratos específicos y cohesionados, evitando que las clases dependan de métodos que no utilizan.

**Impacto esperado:**

* Interfaces pequeñas y específicas.
* Mayor cohesión.
* Menor impacto ante cambios.
* Eliminación de implementaciones forzadas.

---

## Modelo Antes de la Refactorización

Características:

* Interfaces con múltiples responsabilidades.
* Clases implementando métodos irrelevantes.
* Creación de entidades desde código cliente.
* Violaciones de bajo acoplamiento.

Consecuencias:

* Fragilidad ante cambios.
* Baja mantenibilidad.
* Difícil extensión del sistema.
* Incremento del riesgo de errores.

---

## Modelo Después de la Refactorización

Cambios realizados:

* La clase agregadora asume la responsabilidad de creación (Creator).
* División de interfaces grandes en contratos más pequeños (ISP).
* Eliminación de métodos no utilizados.

Resultados:

* Mejor cohesión.
* Menor acoplamiento.
* Código más expresivo.
* Mayor claridad en responsabilidades.

---

## Consideraciones después de refactorización

* Incremento en número de interfaces.
* Mayor granularidad del diseño.
* Posible sobre-ingeniería si se aplica sin criterio.
* Necesidad de mayor disciplina en modelado inicial.

La aplicación de estos principios mejora la calidad estructural, pero exige mayor análisis previo y comprensión del dominio.

---

## 🧠 Preguntas Críticas Abordadas

* ¿Quién debe crear a quién y por qué?
* ¿Cómo afecta la creación al acoplamiento?
* ¿Cuándo una interfaz está “gorda”?
* ¿Dividir interfaces siempre mejora el diseño?
* ¿Factories pueden violar ISP?
* ¿Qué smells aparecen cuando se ignoran estos principios?

---

## 📁 Estructura del Repositorio

* `/src/creator/creator.problem.ts` → Código antes de aplicar los principios.
* `/src/creator/creator.solution.ts` → Código después de la refactorización.
* `/src/interface-segregation/interface-segregation.problem.ts` → Código antes de aplicar los principios.
* `/src/interface-segregation/interface-segregation.solution.ts` → Código después de la refactorización.
* `README.md` → Documento descriptivo del trabajo.

---

## 🏁 Conclusión

La aplicación conjunta de **Creator (GRASP)** e **ISP** demuestra cómo decisiones estructurales bien fundamentadas transforman un diseño frágil en un modelo coherente, extensible y sostenible.

El objetivo no es aplicar principios por dogma, sino comprender cuándo, por qué y a qué costo hacerlo.
