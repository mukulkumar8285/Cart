// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// const bodyParser = require('body-parser');
const itemRoutes = require('./routes/itemRoutes');
const router = require('./routes/UserRouter');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb+srv://mukulved07:sXXCXdeb5le04Zh2@cluster0.qxkhg.mongodb.net/Mean').then(() => {
  console.log('MongoDB connected');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Routes
app.use('/api/items', itemRoutes);
app.use('/auth', router);
app.use("/" , (req , res)=>{
  res.json({
    message:"working"
  })
   })


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
