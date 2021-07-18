const { Router } = require('express')
const fs = require('fs')
const path = require('path')
const router = Router()

let mascotas = ''
filePath = path.join(__dirname, 'bd.json');
console.log(filePath);
const actualizarBD = () => {
  try {
    const datos = fs.readFileSync('./bd.json', 'utf8');
    mascotas = JSON.parse(datos);
  } catch (err) {
    console.log(`Se obtuvo un error al momento de la lectura de la BD: ${err}`);
  }
}
actualizarBD() //Me aseguro de actualizar la BD antes de seguir

// Creo esta ruta para consultar el estado general de la "BBDD"
router.get('/', (req,res) => {
  res.json(mascotas)
})

// En el metodo post solo encuentro necesario contar con un nombre
router.post('/', (req,res) => {
  const { nombre } = req.body
  if (nombre) {
    let id = mascotas[mascotas.length - 1].id + 1
    const mascotaNueva = {id, ...req.body}
    mascotas.push(mascotaNueva)
    // Actualizacion
    try {
      const datos = JSON.stringify(mascotas, null, 4);
      fs.writeFileSync('./bd.json', datos, 'utf8');
      actualizarBD()
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
  const { id } = req.params
  let terminado = false

  mascotas.forEach((element, i) => {
    if (element.id == id) {
      mascotas.splice(i, 1)
      // Actualizacion
      try {
        const datos = JSON.stringify(mascotas, null, 4);
        fs.writeFileSync('./bd.json', datos, 'utf8');
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