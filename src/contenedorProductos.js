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


    async agregar(producto) {
        if (Object.keys(producto).length === 0) return console.log('El objeto esta vacio')
        
        fs.access(this.archivo, (error) => {
            console.log(error)
            if (error){
                console.error('Archivo TXT NO existe');
                this.crearArchivo()
            } else {
                console.log('Archivo TXT existe');
            }
        })
        

        try {
            const data = await fs.promises.readFile(this.archivo, 'utf-8')

            let dataObjeto = null
            if (!data) {
                dataObjeto = []
            }else{
                dataObjeto = JSON.parse(data)
            }
            if(dataObjeto.length === 0){
                producto.id = 1
            }else{
                producto.id = dataObjeto[dataObjeto.length-1].id + 1
            }
            
            dataObjeto.push(producto)
            
            await fs.promises.writeFile(this.archivo, JSON.stringify(dataObjeto, null, 2))
            return producto.id
        } catch (error) {
            console.log(error)
        }
            
    }

    async getById(id) {
        const obtenerProductos = await this.getAll()
        if(obtenerProductos && obtenerProductos.length > 0) {
            const productoEncontrado = obtenerProductos.find(item => item.id === id)
            return productoEncontrado
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
    /* Elimina con el id*/
    async borrar(id) {
        const obtenerProductos = await this.getAll()
        
        if(obtenerProductos && obtenerProductos.length > 0) {
            const productoEliminado = obtenerProductos.find(item => item.id === parseInt(id))
            const productos = obtenerProductos.filter(item => item.id !== parseInt(id))
            await fs.promises.writeFile(this.archivo, JSON.stringify(productos, null, 2))
            return productoEliminado
        }else{
            return null
        }
    }
    /* Elimina */
    async deleteAll() {
        try {
            await fs.promises.writeFile(this.archivo, JSON.stringify([], null, 2))
        }catch(error){
            console.log(error)
        }
    }
    /* Actualiza */
    async updateById(producto, id) {
        const obtenerProductos = await this.getAll()

        if(obtenerProductos && obtenerProductos.length > 0) {
            producto.id = id
            obtenerProductos[id - 1] = producto
            console.log(obtenerProductos)
            await fs.promises.writeFile(this.archivo, JSON.stringify(obtenerProductos, null, 2))
            return obtenerProductos.find(item => item.id === id)
        }else{
            return null
        }
    }
}


module.exports = Contenedor
