const express = require('express');
const { body, validationResult } = require('express-validator');
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all sales
router.get('/', auth, (req, res) => {
  try {
    const sales = Sale.findAll();
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single sale
router.get('/:id', auth, (req, res) => {
  try {
    const sale = Sale.findById(req.params.id);
    
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create sale (cash memo)
router.post('/', auth, [
  body('customerPhone').notEmpty().trim(),
  body('items').isArray({ min: 1 }),
  body('items.*.productId').notEmpty(),
  body('items.*.quantity').isInt({ min: 1 }),
  body('discount').optional().isFloat({ min: 0 })
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { customerPhone, items, discount = 0 } = req.body;

    // Validate products and calculate totals
    let subtotal = 0;
    const saleItems = [];

    for (const item of items) {
      // Convert _id to id if needed (frontend sends _id, database uses id)
      const productId = item.productId;
      const product = Product.findById(productId);
      
      if (!product) {
        return res.status(404).json({ message: `Product ${productId} not found` });
      }

      const quantityToSell = parseInt(item.quantity);
      if (product.quantity < quantityToSell) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.quantity}` 
        });
      }

      const itemSubtotal = product.price * quantityToSell;
      subtotal += itemSubtotal;

      saleItems.push({
        productId: product.id, // Use numeric id for database
        productName: product.name,
        quantity: quantityToSell,
        price: product.price,
        subtotal: itemSubtotal
      });

      // Deduct quantity from inventory - use numeric id
      const newQuantity = product.quantity - quantityToSell;
      Product.updateQuantity(product.id, newQuantity);
    }

    const total = Math.max(0, subtotal - parseFloat(discount));

    const sale = Sale.create({
      customerPhone,
      items: saleItems,
      subtotal,
      discount: parseFloat(discount),
      total,
      soldBy: req.user.id
    });

    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
