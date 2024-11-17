// Requisitos del ejercicio: Generador de Facturas

// 1. Crear un formulario que permita añadir productos a una tabla.
//    - El formulario debe incluir:
//      * Un campo de texto para el nombre del producto.
//      * Un campo numérico para la cantidad (mínimo 1).
//      * Un campo numérico para el precio (mínimo 0.01).
//      * Un botón "Añadir Producto".
//    - Si algún campo está vacío, mostrar un mensaje de error durante 2 segundos.

// Botón añadir producto
$("#add-product").on("click", function () {
  // Obtengo el nombre
  let nomPr = $("#product-name").val();
  // Cantidad
  let canti = parseInt($("#product-quantity").val());

  if (isNaN(canti) || canti <= 0) {
    alert(
      "La cantidad tiene que ser positiva, no puede ser 0 o menor que este, además debe ser númerico!"
    );
    return;
  }
  // Precio
  let precio = parseFloat($("#product-price").val());

  if (isNaN(precio) || precio <= 0) {
    alert(
      "El precio tiene que ser positivo, no puede ser 0 o menor que este, además debe ser númerico!"
    );
    return;
  }

  let total = parseFloat(canti * precio);

  insertarProducto(nomPr, canti, precio, total);
  actualizarTotal(total, true);
});

// 2. Cada producto añadido debe agregarse como una fila en la tabla con las siguientes columnas:
//    - Nombre del producto.
//    - Cantidad.
//    - Precio unitario (€).
//    - Subtotal (€) calculado como cantidad × precio.
//    - Un botón "Eliminar" que permita eliminar esa fila.

function insertarProducto(nomPr, canti, precio, total) {
  // Obtengo la tabla, el <tbody>
  $("#invoice-table").prepend(
    `<tr draggable="true">
            <td class="nom">${nomPr} </td>
            <td class="canti">${canti} </td>
            <td class="precio">${precio} </td>
            <td class="total">${total} </td>
            <td> <button class="borrarPr">Eliminar</button> </td>
            </tr>`
  );

  // Vacio los inputs para nuevos productos, pero por ahora no lo hago para debuguear facilmente.

  // 4. Aplicar un estilo especial (fondo naranja) a las filas cuyo subtotal sea mayor a 50 €.

  if (total > 50) {
    // Solo aplicar a la fila recién añadida
    $("#invoice-table").find("tr").first().addClass("orange-bg");
    /* Otra forma de arreglarlo:
        
        // Añadir fila a la tabla
  let newRow = $(row);
  $("#invoice-table").prepend(newRow);

  // Aplicar clase naranja solo si el total es mayor a 50
  if (total > 50) {
    newRow.addClass("orange-bg");
  }*/
  }
}

// Funcionalidad del botón eliminar

$("table").on("click", ".borrarPr", function () {
  // Selecciono el antecesor
  let prSelec = $(this).closest("tr");

  // Obtengo del producto el td con la clase total, que contiene el precio total
  let precioTotal = prSelec.find(".total").text();

  // Lo parseo
  let precioTParse = parseFloat(precioTotal);

  // Elimino el tr
  prSelec.remove();

  // False para que borre
  actualizarTotal(precioTParse, false);
});

// 3. Calcular dinámicamente los totales de la factura:
//    - Subtotal (la suma de todos los subtotales de las filas).
//    - IVA (21% del subtotal).
//    - Total con IVA incluido.
//    - Los valores deben actualizarse cada vez que se añada o elimine una fila.

function actualizarTotal(precioTP, bool) {
  // Obtengo el Subtotal actual
  let subtotal = parseFloat($("#subtotal").text());

  // Obtengo el iva actual
  let ivaAct = parseFloat($("#iva").text());

  if (bool) {
    // Añado precio del producto al subtotal
    $("#subtotal").text(subtotal + precioTP);

    // Calculo el IVA del nuevo producto
    let precioIva = precioTP * 1.21;

    // Diferencia entre precio con IVA e IVA para obtener IVA :)
    let ivaCalculado = precioIva - precioTP;

    // Indico en el <span>
    $("#iva").text((ivaAct + ivaCalculado).toFixed(2));
  } else {
    // Quito precio del producto al subtotal
    $("#subtotal").text(subtotal - precioTP);

    // Calculo el IVA del nuevo producto
    let precioIva = precioTP * 1.21;

    // Diferencia entre precio con IVA e IVA para obtener IVA :)
    let ivaCalculado = precioIva - precioTP;

    // Indico en el <span>
    $("#iva").text((ivaAct - ivaCalculado).toFixed(2));
  }

  // Calculo el total, sumando el subtotal y el IVA
  $("#total").text(
    (parseFloat($("#subtotal").text()) + parseFloat($("#iva").text())).toFixed(
      2
    )
  );
}

// 5. Implementar la funcionalidad de drag & drop para reorganizar las filas de la tabla:
//    - Las filas deben poder arrastrarse y soltarse para cambiar su orden.
//    - El cálculo de los totales no debe verse afectado por el reordenamiento.

// Drag & Drop usando dataTransfer
let draggedRowIndex = null; // Variable para almacenar el índice de la fila arrastrada

// Inicio arrastre
// Del <tbody> obtengo todos los elementos <tr> e inicio el drag
$("#invoice-table").on("dragstart", "tr", function (e) {
  draggedRowIndex = $(this).index(); // Guardo indice de la fila arrastrada
  e.originalEvent.dataTransfer.setData("text/plain", draggedRowIndex); // Transfiero el indice
});

// Fin del arrastre
$("#invoice-table").on("dragend", "tr", function () {
  draggedRowIndex = null; // Limpia la referencia del índice (Reseteo)
});

// Permitir soltar
$("#invoice-table").on("dragover", "tr", function (e) {
  e.preventDefault(); // Necesario para permitir el drop
});

// Soltar la fila
$("#invoice-table").on("drop", "tr", function (e) {
  e.preventDefault();
  const draggedIndex = e.originalEvent.dataTransfer.getData("text/plain"); // Obtengo el indice de la fila arrastrada
  const $draggedRow = $("#invoice-table").children().eq(draggedIndex); // Fila arrastrada
  const $targetRow = $(this); // Fila objetivo donde se suelta

  // Evita soltar en la misma fila
  if ($draggedRow[0] === $targetRow[0]) return;

  // Inserta la fila arrastrada antes o después según la posición
  if (draggedRowIndex < $targetRow.index()) {
    $targetRow.after($draggedRow);
  } else {
    $targetRow.before($draggedRow);
  }
});

/* 

Otra forma de hacerlo -->

*/

// // Drag & Drop simplificado
// let draggedRow = null; // Variable para la fila que se arrastra

// // Evento al iniciar el arrastre
// $("#invoice-table").on("dragstart", "tr", function () {
//   draggedRow = $(this); // Guarda la referencia de la fila que se arrastra
//   $(this).css("opacity", "0.5"); // Reduce la opacidad como indicación visual
// });

// // Evento al terminar el arrastre
// $("#invoice-table").on("dragend", "tr", function () {
//   $(this).css("opacity", "1"); // Restaura la opacidad original
//   draggedRow = null; // Limpia la referencia de la fila
// });

// // Evento cuando se pasa por encima de otra fila
// $("#invoice-table").on("dragover", "tr", function (e) {
//   e.preventDefault(); // Habilita el área de drop
// });

// // Evento al soltar la fila
// $("#invoice-table").on("drop", "tr", function () {
//   if (draggedRow) {
//     $(this).after(draggedRow); // Inserta la fila arrastrada después de la fila objetivo
//   }
// });

// 6. Mostrar información del navegador y del sistema en tiempo real:
//    - Mostrar la fecha y hora actual en un área separada. Debe actualizarse automáticamente cada segundo.
//    - Mostrar un mensaje indicando si el navegador es Chrome, Firefox o desconocido.
function mostrarInfoNavegador() {
  // Actualiza la hora y fecha
  function actualizarFechaYHora() {
    const fecha = new Date();
    const hora = fecha.toLocaleTimeString(); // Hora en formato HH:MM:SS
    const fechaCompleta = fecha.toLocaleDateString(); // Fecha en formato DD/MM/YYYY

    $("#current-time").text(`Fecha: ${fechaCompleta} | Hora: ${hora}`);
  }

  // Detectar el navegador
  function detectarNavegador() {
    const userAgent = navigator.userAgent;

    let navegador = "Desconocido";
    if (userAgent.includes("Chrome")) {
      navegador = "Chrome";
    } else if (userAgent.includes("Firefox")) {
      navegador = "Firefox";
    }

    $("#browser-info").text(`Navegador: ${navegador}`);
  }

  // Llamada inicial
  actualizarFechaYHora();
  detectarNavegador();

  // Actualizar la fecha y hora cada segundo
  setInterval(actualizarFechaYHora, 1000);
}

// Llamar a la función
mostrarInfoNavegador();
