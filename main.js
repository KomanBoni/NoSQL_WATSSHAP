const express = require('express');
const app = express();
const { PrismaClient } = require('./generated/prisma/client')
const prisma = new PrismaClient()

// Middleware pour parser le JSON
app.use(express.json());

// Servir les fichiers statiques du frontend
app.use(express.static('watsshap-frontend/dist'));


app.get('/', (req, res) => {
    res.send('Hello World');
    console.log(prisma.user.findMany());
});

app.get('/byId/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const user = await prisma.user.findUnique({
        where: {
            id: id
        }
    });
    res.send(user);
});

app.post('/user', async (req, res) => {
    const user = await prisma.user.create({
        data: {
            name: req.body.name,
            email: req.body.email
        }
    });
    res.send(user);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});