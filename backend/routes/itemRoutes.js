
const express = require('express');
const Item = require('../models/itemModel');
const cart = require('../models/cartmodel');

const router = express.Router();


router.post('/', async (req, res) => {
  const { name, rate , img } = req.body;
  try {
    const newItem = new Item({ name, rate, qty :1 , img });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

router.post('/add-to-cart', async (req, res) => {
  const { name, rate, qty, UserId , img } = req.body;
  console.log("Request body:", req.body);
  if (!UserId) {
    return res.status(400).json({
      message: 'UserId is required'
    });
  }

  try {
  
    let existingItem = await cart.findOne({ name, UserId });

    if (existingItem) {
      // If the item exists, update its quantity
      existingItem.qty += qty;
      await existingItem.save(); // Save the updated item
    } else {
      // If the item does not exist, create a new one
      const newItem = new cart({ name, rate, qty, UserId , img });
      await newItem.save();
      existingItem = newItem;
    }

    res.status(200).json({
      message: 'Item added to cart',
      data: existingItem
    });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({
      message: 'Failed to add item to cart',
      error: error.message
    });
  }
});

// router.post('/sub-to-cart', (req, res) => {
//   const { name , qty , UserId } = req.body; 
//   const item = cart.find(item => item.name === name);
//   if (item) {
//     item.qty -= qty; 
//     if(item.qty <= 0){
//       const index = cart.indexOf(item);
//       cart.splice(index , 1);
//     }
//   } 
//   res.status(200).json(cart);
// });
router.post('/sub-to-cart', async (req, res) => {
  const { name, qty, UserId  } = req.body; 
  console.log("Request body:", req.body);

  if (!UserId) {
    return res.status(400).json({ message: "UserId is required" });
  }

  try {
    const existingItem = await cart.findOne({ name, UserId });
    console.log("Existing Item:", existingItem);
    if (existingItem) {
      existingItem.qty -= qty;
      
      if (existingItem.qty <= 0) {
        await cart.deleteOne({ _id: existingItem._id }); 
      } else {
        await existingItem.save(); 
      }
      res.status(200).json({ message: 'Item quantity updated', item: existingItem });
    } else {
      res.status(404).json({ message: 'Item not found in cart' });
    }
  } catch (error) {
    console.error("Error updating item quantity in cart:", error);
    res.status(500).json({ message: 'Error updating item in cart', error });
  }
});


router.get('/cart', async (req, res) => {
  const UserId = req.query.UserId;
  if(!UserId){
    return res.status(400).json({ message: "UserId is required" });
  }

  try {
    const cartItems = await cart.find({UserId}).populate('UserId', 'name email'); 
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart items', error });
  }
});
