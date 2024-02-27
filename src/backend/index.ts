import { Server } from 'azle';
import express, { NextFunction, Request, Response } from 'express';

type product = {
    id: number;
    producto: string;
    precio: string;
    material: string;
    color: string;
}

let products: product[] = [{
    id: 1,
    producto: 'silla',
    precio: '2500',
    material: 'madera',
    color: 'cafe claro'
}]

function logger(req: Request, res: Response, next: NextFunction) {
    console.log("producto registrado");
    next();
}

export default Server(() => {
    const app = express();

    app.use(express.json());

    app.use(logger);

    //GET
    app.get('/products', (req, res) => {
        res.json(products);
    });

    //POST
    app.post("/products/:id", (req, res) => {
        const id = parseInt(req.params.id);
        const product = req.body;
        const productoExistente = products.find((product) => product.id === id);
        console.log("Aqui")
        if (productoExistente) {
            res.status(404).send("El producto ya esta registrado");
            return;
        }
        products.push({ ...product, id });
    
        res.send("OK");
    });

    //PUT
    app.put("/products/:id", (req, res) =>{
        const id = parseInt(req.params.id);
        const product = products.find((products) => products.id === id);

        if (!product) {
            res.status(404).send("Error de registro");
            return;
        }

        const updateproduct = { ...product, ...req.body };

        products = products.map((b) => b.id === updateproduct.id ? updateproduct : b);

        res.send("ok");

    })

    //DELETE
    app.delete("/products/:id", (req, res) =>{
        const id = parseInt(req.params.id);
        products = products.filter((product) => product.id !== id);
        res.send("ok")
    });

    return app.listen();
});