const { Router } = require('express');
const multer = require('multer')

const Contenedor = require('../contenedorProductos')
const contenedorProductos = new Contenedor('./src/productos.txt')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage })

const router = Router();

const administrador = false

router.get('/', async (req, res) => {
    const productos = await contenedorProductos.getAll()
    res.json(productos)
})

router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    const productos = await contenedorProductos.getAll()

    if (isNaN(id)) {
        return res.json({ error: 'El ID no es un numero' })
    }

    if (id < 1 || id > productos.length) {
        console.log('upss')
        return res.json({ error: 'El ID esta fuera del rango' })
    }

    const producto = await contenedorProductos.getById(id)

    res.json(producto)
})

router.post('/', upload.single('thumbnail'), async (req, res, next) => {
    
        const file = req.file
        let thumbnail = null
        
        if(file){
            const { filename } = req.file
            thumbnail = "http://localhost:8080/uploads/" + filename
        }else if (req.body.thumbnail) {
            thumbnail = req.body.thumbnail
        }else{
            const error = new Error('Please upload a file')
            error.httpStatusCode = 400
            return next(error)
        }
    
        const { title, description, code, price, stock } = req.body
        const productoNuevo = {
            title,
            description,
            code,
            price, 
            thumbnail,
            timestamp: Date.now(), 
            stock
        }
        const id = await contenedorProductos.agregar(productoNuevo)
        res.send({ producto: productoNuevo, id })
    
})

router.put('/:id', async (req, res) => {
    if (administrador) {
        const { id } = req.params
        const { title, description, code, price, stock, thumbnail } = req.body
        const productos = await contenedorProductos.getAll()
    
        if (isNaN(id)) {
            return res.json({ error: 'El ID no es un numero' })
        }
    
        if (id < 1 || id > productos.length) {
            return res.json({ error: 'El ID esta fuera del rango' })
        }
    
        const producto = { title, description, code, price, stock, thumbnail }
        const productoActualizado = await contenedorProductos.updateById(producto, id)
    
        res.json({ productoActualizado, id })
    }else{
        res.json({ error : -1, descripcion: `ruta '${req.url}' método ${req.method} no autorizada`})
    }
})

router.delete('/:id', async (req, res) => {
    if (administrador) {
        const id = parseInt(req.params.id)
    
        const productos = await contenedorProductos.getAll()
    
        if (id < 1 || id > productos.length) {
            return res.json({ error: 'El ID esta fuera del rango' })
        }
    
        const producto = await contenedorProductos.borrar(id)
    
        res.json(producto)
    
    }else{
        res.json({ error : -1, descripcion: `ruta '${req.originalUrl}' método ${req.method} no autorizada`})
    }
})

module.exports = router;