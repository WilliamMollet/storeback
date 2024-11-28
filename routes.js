const express = require('express');
const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const productController = require('./controllers/productController');
const authMiddleware = require('./middleware/authMiddleware');

const router = express.Router();

// Auth routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// User routes
router.get('/users', authMiddleware, userController.getAllUsers);
router.get('/users/:id', authMiddleware, userController.getUserById);
router.put('/users/:id', authMiddleware, userController.updateUser);
router.delete('/users/:id', authMiddleware, userController.deleteUser);

// Product routes
router.get('/products', authMiddleware, productController.getAllProducts);
router.get('/products/single/:id', authMiddleware, productController.getProductById);
router.get('/products/search', authMiddleware, productController.searchProducts);
router.post('/products', authMiddleware, productController.createProduct);
router.put('/products/:id', authMiddleware, productController.updateProduct);
router.delete('/products/:id', authMiddleware, productController.deleteProduct);


module.exports = router;
