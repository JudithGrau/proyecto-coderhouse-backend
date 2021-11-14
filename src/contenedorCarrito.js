const fs = require('fs')

class Contenedor {
    constructor(archivo = null){
        this.archivo = archivo
    }

    async crearArchivo(){
        try {
            await fs.promises.writeFile(this.archivo, JSON.stringify([]))
        } catch (error) {
            console.log(error)
        }
    }

    async agregar() {

        fs.access(this.archivo, (error) => {
            console.log(error)
            if (error){
                this.crearArchivo()
            } else {
                console.log('Archivo TXT existe');
            }
        })

        try {

            const data = await fs.promises.readFile(this.archivo, 'utf-8')
            
            let dataCarrito = null
            if (!data) {
                dataCarrito = []
            }else{
                dataCarrito = JSON.parse(data)
            }
            
            if(dataCarrito.length > 0){
                dataCarrito.push({
                    id: dataCarrito.length + 1,
                    timestamp: Date.now(),
                    productos: []
                })
            }else{
                dataCarrito.push({
                    id: 1,
                    timestamp: Date.now(),
                    productos: []
                })
            }
            
            await fs.promises.writeFile(this.archivo, JSON.stringify(dataCarrito, null, 2))
            return dataCarrito
        } catch (error) {
            console.log(error)
        }
        
    }

    async getById(id) {
        const obtenerCarritos = await this.getAll()
        if(obtenerCarritos && obtenerCarritos.length > 0) {
            const carritoEncontrado = obtenerCarritos.find(item => item.id === id)
            return carritoEncontrado
        }else{
            return null
        }
    }

    async getAll() {   
        try {
            const data = await fs.promises.readFile(this.archivo, 'utf-8')

            if (!data) {
                return null
            }else{
                return JSON.parse(data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    /* Elimina */
    async borrar(id) {
        try {
            const obtenerCarritos = await this.getAll()

            if(obtenerCarritos && obtenerCarritos.length > 0) {
                const carritoEliminado = obtenerCarritos.find(item => item.id === parseInt(id))
                const carritos = obtenerCarritos.filter(item => item.id !== parseInt(id))
                await fs.promises.writeFile(this.archivo, JSON.stringify(carritos, null, 2))
                return carritoEliminado
            }else{
                return null
            }
        } catch (error) {
            console.log(error)
        }
    }

    /* Lista por id */
    async getProductsById(id){
        const obtenerCarrito = await this.getById(id)
        return obtenerCarrito.productos
    }

    /* Agrega un producto */
    async saveProduct(id, product){
        const obtenerCarritos = await this.getAll()

        const indexProduct = obtenerCarritos[id - 1].productos.findIndex(item => item.id === product.id)
        if(indexProduct !== -1){
            obtenerCarritos[id - 1].productos[indexProduct].cantidad++
        }else{
            product.cantidad = 1
            obtenerCarritos[id - 1].productos.push(product)
        }

        await fs.promises.writeFile(this.archivo, JSON.stringify(obtenerCarritos, null, 2))

        return obtenerCarritos[id - 1].productos
    }

    async borrarProducto(idCarrito, idProducto) {
        const obtenerCarritos = await this.getAll()

        const carrito = obtenerCarritos.find(item => item.id === idCarrito)

        const productosFiltrados = carrito.productos.filter( item => item.id !== idProducto)

        obtenerCarritos[idCarrito - 1].productos = [...productosFiltrados]

        await fs.promises.writeFile(this.archivo, JSON.stringify(obtenerCarritos, null, 2))

        return 'eliminado'
    }
}

module.exports = Contenedor;
