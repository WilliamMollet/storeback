const Product = require('../models/Product');

// Get all products
exports.getAllProducts = async (req, res) => {
    const products = await Product.find().populate('owner', 'username email');
    res.json(products);
};

// Get product by ID
exports.getProductById = async (req, res) => {
    const product = await Product.findById(req.params.id).populate('owner', 'username email');
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
};

// Create product
exports.createProduct = async (req, res) => {
    try {
        const product = new Product({ ...req.body, owner: req.user.id });
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Update product
exports.updateProduct = async (req, res) => {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) return res.status(404).json({ error: 'Product not found' });
    res.json(updatedProduct);
};

// Delete product
exports.deleteProduct = async (req, res) => {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
};

// Search products with dynamic filters
exports.searchProducts = async (req, res) => {
    try {
        const { category, minPrice, maxPrice, name, owner } = req.query;

        // Initialize an empty filter object
        const filter = {};

        // Add filters based on the parameters provided
        if (category) filter.category = category;
        if (name) filter.name = new RegExp(name, 'i'); // Case-insensitive search

        if (owner) {
            // Find the user based on username or email
            const user = await User.findOne({
                $or: [{ username: owner }, { email: owner }]
            });

            if (user) {
                filter.owner = user._id; // Add the user ID to the filter
            } else {
                return res.status(404).json({ error: 'Owner not found' });
            }
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice); // Minimum price
            if (maxPrice) filter.price.$lte = Number(maxPrice); // Maximum price
        }

        // Perform the search
        const products = await Product.find(filter).populate('owner', 'username email');
        res.json(products);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
