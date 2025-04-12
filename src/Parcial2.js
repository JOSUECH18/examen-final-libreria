// src/Parcial2.js
const readline = require('readline-sync');
const chalk = require('chalk');
const fs = require('fs');

let catalogo = [];

// Cargar catálogo si existe
if (fs.existsSync('catalogo.json')) {
  const data = fs.readFileSync('catalogo.json');
  catalogo = JSON.parse(data);
}

function guardarCatalogo() {
  fs.writeFileSync('catalogo.json', JSON.stringify(catalogo, null, 2));
}

function agregarLibro() {
  console.log(chalk.yellow('\n Vamos a agregar un nuevo libro al catalogo.'));
  const titulo = readline.question(' Ingresa el titulo del libro: ');
  const autor = readline.question(' Ingresa el nombre del autor: ');
  const precio = parseFloat(readline.question(' Ingresa el precio (ej: 19.99): '));
  const anio = parseInt(readline.question(' Ingresa el ano de publicacion: '));

  if (!titulo || !autor || isNaN(precio) || precio <= 0 || isNaN(anio)) {
    console.log(chalk.red(' Los datos ingresados no son validos. Por favor, intenta nuevamente.'));
    return;
  }

  catalogo.push({ titulo, autor, precio, anio });
  guardarCatalogo();
  console.log(chalk.green('\n ¡Libro agregado correctamente al catalogo!'));
}

function mostrarCatalogo() {
  if (catalogo.length === 0) {
    console.log(chalk.red('\n No hay libros en el catalogo.'));
    return;
  }
  console.log(chalk.blue('\n Catalogo de libros:'));
  catalogo.forEach((libro, i) => {
    console.log(`\n${i + 1}. Título: ${libro.titulo}\n   Autor: ${libro.autor}\n   Precio: $${libro.precio.toFixed(2)}\n   Año: ${libro.anio}`);
  });
}

function buscarLibro() {
  const titulo = readline.question('\n Escribe el titulo del libro que deseas buscar: ');
  const libro = catalogo.find(l => l.titulo.toLowerCase() === titulo.toLowerCase());

  if (libro) {
    console.log(chalk.green('\n Libro encontrado:'));
    console.log(`Título: ${libro.titulo}`);
    console.log(`Autor: ${libro.autor}`);
    console.log(`Precio: $${libro.precio.toFixed(2)}`);
    console.log(`Año: ${libro.anio}`);
  } else {
    console.log(chalk.red(' No se encontro un libro con ese titulo.'));
  }
}

function eliminarLibro() {
  const titulo = readline.question('\n Ingresa el titulo del libro que deseas eliminar: ');
  const index = catalogo.findIndex(l => l.titulo.toLowerCase() === titulo.toLowerCase());

  if (index !== -1) {
    catalogo.splice(index, 1);
    guardarCatalogo();
    console.log(chalk.green('\n Libro eliminado correctamente del catálogo.'));
  } else {
    console.log(chalk.red(' No se encontro un libro con ese titulo.'));
  }
}

function verEstadisticas() {
  if (catalogo.length === 0) {
    console.log(chalk.red('\n📭 No hay libros para analizar.'));
    return;
  }
  const total = catalogo.length;
  const promedio = catalogo.reduce((acc, l) => acc + l.precio, 0) / total;
  const antiguo = catalogo.reduce((a, b) => (a.anio < b.anio ? a : b));
  const caro = catalogo.reduce((a, b) => (a.precio > b.precio ? a : b));

  console.log(chalk.cyan('\n Estadísticas del catalogo:'));
  console.log(` Total de libros: ${total}`);
  console.log(` Precio promedio: $${promedio.toFixed(2)}`);
  console.log(` Libro mas antiguo: ${antiguo.titulo} (${antiguo.anio})`);
  console.log(` Libro mas caro: ${caro.titulo} ($${caro.precio.toFixed(2)})`);
}

function ordenarLibros() {
  console.log('\n ¿Cómo deseas ordenar los libros?');
  console.log('1. Por precio (ascendente)');
  console.log('2. Por precio (descendente)');
  console.log('3. Por año de publicación');

  const opcion = readline.questionInt('Selecciona una opcion (1-3): ');
  let ordenado;

  switch (opcion) {
    case 1:
      ordenado = [...catalogo].sort((a, b) => a.precio - b.precio);
      break;
    case 2:
      ordenado = [...catalogo].sort((a, b) => b.precio - a.precio);
      break;
    case 3:
      ordenado = [...catalogo].sort((a, b) => a.anio - b.anio);
      break;
    default:
      console.log(chalk.red(' Opción invalida.'));
      return;
  }

  console.log(chalk.blue('\n Catalogo ordenado:'));
  ordenado.forEach((libro, i) => {
    console.log(`\n${i + 1}. Título: ${libro.titulo}\n   Autor: ${libro.autor}\n   Precio: $${libro.precio.toFixed(2)}\n   Año: ${libro.anio}`);
  });
}

function editarLibro() {
  const titulo = readline.question('\n Ingresa el titulo del libro que deseas editar: ');
  const libro = catalogo.find(l => l.titulo.toLowerCase() === titulo.toLowerCase());

  if (!libro) {
    console.log(chalk.red(' No se encontró un libro con ese titulo.'));
    return;
  }

  console.log(chalk.yellow('\n Deja en blanco si no deseas cambiar ese dato.'));
  const nuevoTitulo = readline.question(` Nuevo titulo (${libro.titulo}): `);
  const nuevoAutor = readline.question(` Nuevo autor (${libro.autor}): `);
  const nuevoPrecio = readline.question(` Nuevo precio (${libro.precio}): `);
  const nuevoAnio = readline.question(` Nuevo año (${libro.anio}): `);

  if (nuevoTitulo) libro.titulo = nuevoTitulo;
  if (nuevoAutor) libro.autor = nuevoAutor;
  if (nuevoPrecio && !isNaN(parseFloat(nuevoPrecio))) libro.precio = parseFloat(nuevoPrecio);
  if (nuevoAnio && !isNaN(parseInt(nuevoAnio))) libro.anio = parseInt(nuevoAnio);

  guardarCatalogo();
  console.log(chalk.green('\n Libro actualizado con exito.'));
}

function filtrarPorAutor() {
  const autor = readline.question('\n Ingresa el nombre del autor para filtrar sus libros: ');
  const filtrados = catalogo.filter(l => l.autor.toLowerCase().includes(autor.toLowerCase()));

  if (filtrados.length === 0) {
    console.log(chalk.red(' No se encontraron libros de ese autor.'));
    return;
  }

  console.log(chalk.blue(`\n Libros de ${autor}:`));
  filtrados.forEach((libro, i) => {
    console.log(`\n${i + 1}. Título: ${libro.titulo}\n   Precio: $${libro.precio.toFixed(2)}\n   Año: ${libro.anio}`);
  });
}

let opcion;
do {
  console.log(chalk.magenta('\n Bienvenido al sistema de gestión de libros de "El Rincon del Saber"'));
  console.log('1. Agregar un nuevo libro');
  console.log('2. Mostrar el catálogo completo');
  console.log('3. Buscar un libro por título');
  console.log('4. Eliminar un libro del catalogo');
  console.log('5. Ver estadísticas del inventario');
  console.log('6. Ordenar libros');
  console.log('7. Editar un libro existente');
  console.log('8. Filtrar libros por autor');
  console.log('9. Salir del sistema');

  opcion = readline.questionInt('Selecciona una opcion (1-9): ');

  switch (opcion) {
    case 1:
      agregarLibro();
      break;
    case 2:
      mostrarCatalogo();
      break;
    case 3:
      buscarLibro();
      break;
    case 4:
      eliminarLibro();
      break;
    case 5:
      verEstadisticas();
      break;
    case 6:
      ordenarLibros();
      break;
    case 7:
      editarLibro();
      break;
    case 8:
      filtrarPorAutor();
      break;
    case 9:
      console.log(chalk.green('\n Gracias por usar el sistema. ¡Hasta pronto!'));
      break;
    default:
      console.log(chalk.red(' Opcion invalida. Intenta nuevamente.'));
  }
} while (opcion !== 9);
