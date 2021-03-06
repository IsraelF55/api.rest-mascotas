const { Router } = require('express')
const fs = require('fs')
const path = require('path')
const router = Router()

let mascotas = ''
filePath = path.join(__dirname, 'bd.json');

// Funcion para lectura de bd.json
const actualizarBD = () => {
  try {
    const datos = fs.readFileSync(filePath, 'utf8');
    mascotas = JSON.parse(datos);
  } catch (err) {
    console.log(`Se obtuvo un error al momento de la lectura de la BD: ${err}`);
  }
}

// Creo esta ruta para consultar el estado general de la "BBDD"
router.get('/', (req,res) => {
  actualizarBD()
  res.json(mascotas)
})

// En el metodo post solo encuentro necesario contar con un nombre
router.post('/', (req,res) => {
  actualizarBD()
  const { nombre } = req.body
  if (nombre) {
    let id = mascotas[mascotas.length - 1].id + 1
    const mascotaNueva = {id, ...req.body}
    mascotas.push(mascotaNueva)
    // Actualizacion
    try {
      const datos = JSON.stringify(mascotas, null, 4);
      fs.writeFileSync(filePath, datos, 'utf8');
      res.send('Guardado')
    } catch (err) {
      console.log(`Se obtuvo un error al momento de la escritura: ${err}`);
    }
    // Si no tiene nombre se pasa a mandar error
  } else {
    res.json(500).send('El nombre es un campo obligatorio')
  }
})

// Ruta para la eliminacion por id
router.delete('/:id', (req,res) => {
  actualizarBD()
  const { id } = req.params
  let terminado = false

  mascotas.forEach((element, i) => {
    if (element.id == id) {
      mascotas.splice(i, 1)
      // Actualizacion
      try {
        const datos = JSON.stringify(mascotas, null, 4);
        fs.writeFileSync(filePath, datos, 'utf8');
        terminado = true
        actualizarBD()
        res.send('Eliminado')
      } catch (err) {
        console.log(`Se obtuvo un error al momento de la escritura: ${err}`);
        res.send('No encontre ese id, comprueba nuevamente')
      }
    }
  });
  if (!terminado) res.status(500).send('No encontre ese id, comprueba nuevamente')
})

module.exports = router