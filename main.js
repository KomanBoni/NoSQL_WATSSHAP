const express = require('express');
const app = express();
const { PrismaClient } = require('./generated/prisma');
const prisma = new PrismaClient()

// Middleware pour parser le JSON
app.use(express.json());

// Middleware CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Servir les fichiers statiques
app.use(express.static(__dirname));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


// -------------------- ROUTES USER --------------------

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});


app.get('/users/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
  res.json(user);
});


app.post('/users', async (req, res) => {
  const { name, email, phone, avatar } = req.body;
  try {
    const user = await prisma.user.create({
      data: { name, email, phone, avatar }
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


app.put('/users/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email, phone, avatar } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, email, phone, avatar }
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


app.delete('/users/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.user.delete({ where: { id } });
    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});





// -------------------- ROUTES CHANNEL --------------------


app.get('/channels', async (req, res) => {
  const channels = await prisma.channel.findMany({
    include: { users: true }
  });
  res.json(channels);
});


app.post('/channels', async (req, res) => {
  const { name, userIds } = req.body; 
  const channel = await prisma.channel.create({
    data: {
      name,
      users: {
        connect: userIds.map(id => ({ id }))
      }
    },
    include: { users: true }
  });
  res.json(channel);
});


app.get('/channels/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const channel = await prisma.channel.findUnique({
    where: { id },
    include: { users: true }
  });
  res.json(channel);
});


app.put('/channels/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { name } = req.body;
  const updatedChannel = await prisma.channel.update({
    where: { id },
    data: { name }
  });
  res.json(updatedChannel);
});


app.delete('/channels/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  await prisma.channel.delete({ where: { id } });
  res.json({ message: 'Channel supprimé avec succès' });
});

app.get('/channels/:id/messages', async (req, res) => {
    const channelId = Number(req.params.id);
    if (Number.isNaN(channelId)) return res.status(400).json({ error: 'Invalid channel id' });

    const messages = await prisma.message.findMany({
      where: { channelId },
      orderBy: { createdAt: 'asc' }
    });
    
    res.json(messages);
});

// -------------------- ROUTES MESSAGE --------------------
app.get('/messages', async(req,res) => {
    const messages = await prisma.message
    res.json(messages)
})

app.get('/messages/:id', async(req,res) => {
    const message = await prisma.message.filter(message => message.id === req.params.id)
    res.send(message)
})
app.post('/messages', async (req, res) => {
  try {
    const { channelId, senderId, content, type } = req.body;
    if (!channelId || !senderId || !content) {
      return res.status(400).json({ error: 'channelId, senderId and content are required' });
    }

    const msg = await prisma.message.create({
      data: {
        channelId: Number(channelId),
        senderId: Number(senderId),
        content: String(content),
        type: type ?? 'text'
      },
      include: {
        sender: { select: { id: true, name: true} }
      }
    });

    res.status(201).json(msg);
  } catch (e) {
    res.status(500).json({ error: 'Failed to create message' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});