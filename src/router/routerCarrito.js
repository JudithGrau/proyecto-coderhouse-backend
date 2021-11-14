const { Router } = require('express');

const router = Router();

const Contenedor = require('../contenedorCarrito')
const contenedorCarrito = new Contenedor('./src/carrito.txt')


router.get('/', async (req, res) => {
    const carritos = await contenedorCarrito.getAll()
    res.json({ msj: "hola desde carrito /", carritos })
})

router.post('/',  async (req, res) => {

    const carrito = await contenedorCarrito.agregar()

    res.json({ msj: "Post para crear un carrito", carrito })
})

router.delete('/:id', async (req, res) => {

    const id = parseInt(req.params.id)
    
    const carritos = await contenedorCarrito.getAll()

    if (isNaN(id)) {
        return res.json({ error: 'El ID no es un numero' })
    }

    if (id < 1 || id > carritos.length) {
        return res.json({ error: 'El ID esta fuera del rango' })
    }

    const carrito = await contenedorCarrito.borrar(id)

    res.json({ msj: "Delete vaciar el carrito eliminar los productos ", id, carrito })
})

router.get('/:id/productos', async (req, res) => {

    const id = parseInt(req.params.id)
    
    const carritos = await contenedorCarrito.getAll()

    if (isNaN(id)) {
        return res.json({ error: 'El ID no es un numero' })
    }

    if (id < 1 || id > carritos.length) {
        return res.json({ error: 'El ID esta fuera del rango' })
    }

    const productosCarrito = await contenedorCarrito.getProductsById(id)

    res.json({ msj: "Get traer los productos en el carrito ", id, productosCarrito })
})

router.post('/:id/productos', async (req, res) => {
    const id = parseInt(req.params.id)
    
    const carritos = await contenedorCarrito.getAll()

    if (isNaN(id)) {
        return res.json({ error: 'El ID no es un numero' })
    }

    if (id < 1 || id > carritos.length) {
        return res.json({ error: 'El ID esta fuera del rango' })
    }

    const { id: idProducto, title, description, code, price, thumbnail, stock } = req.body
    const producto = {
        id: idProducto,
        title,
        description,
        code,
        price, 
        thumbnail,
        timestamp: Date.now(), 
        stock
    }

    const productosCarrito = await contenedorCarrito.saveProduct(id, producto)

    res.json({ msj: "Post para incorporar un producto en el carrito por su ID", id, productosCarrito })
    console.log('Post /api/carrito/:id/productos')
})

router.delete('/:id/productos/:id__prod', async (req, res) => {

    const id = parseInt(req.params.id)
    const id__prod = parseInt(req.params.id__prod)
    
    const carritos = await contenedorCarrito.getAll()

    if (isNaN(id)) {
        return res.json({ error: 'El ID no es un numero' })
    }

    if (id < 1 || id > carritos.length) {
        return res.json({ error: 'El ID esta fuera del rango' })
    }

    const resultado = await contenedorCarrito.borrarProducto(id, id__prod)

    res.json({ msj: "Delete para eliminar un producto en el carrito por su ID", idCarrito: id, msj: resultado })
})

module.exports = router;