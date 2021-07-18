const express = require('express')
const morgan = require('morgan')
const app = express()

// configuraciones
app.set('PORT', process.env.PORT || 3000)
app.set('json spaces', 2)

// middlewares
app.use(morgan('dev'))
app.use(express.json())

// routes
app.use('/api/mascotas', require('./routes/mascotas'))

// server
app.listen(app.get('PORT'), () => {
  console.log(`Servidor corriendo en puerto ${app.get('PORT')}`);
})