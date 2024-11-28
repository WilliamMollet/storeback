const User = require('../models/User');
const bcrypt = require('bcrypt');

// Get all users
exports.getAllUsers = async (req, res) => {
    const users = await User.find();
    res.json(users);
};

// Get user by ID
exports.getUserById = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
};

exports.updateUser = async (req, res) => {
    try {
        // Vérifie si le mot de passe a été fourni dans la requête
        if (req.body.password) {
            // Hacher le mot de passe avant de l'enregistrer
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        // Mise à jour de l'utilisateur
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

        // Vérifie si l'utilisateur a été trouvé
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Renvoie l'utilisateur mis à jour
        res.json(updatedUser);

    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
};
