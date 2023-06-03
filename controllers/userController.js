const { ObjectId } = require('mongodb');
// const User = require('../models/user');

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const User = req.models.User;
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching users',
    });
  }
};

// Get a single user by ID
exports.getUser = async (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }

  try {
    const User = req.models.User;
    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the user',
    });
  }
};

// Update a user by ID
exports.updateUser = async (req, res) => {
  const User = req.models.User;
  const id = req.params.id;
  const updates = req.body;

  if (!ObjectId.isValid(id)) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }

  try {
    const user = await User.findByIdAndUpdate(id, updates, { new: true });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the user',
    });
  }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
  const User = req.models.User;
  const id = req.params.id;


  if (!ObjectId.isValid(id)) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }

  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the user',
    });
  }
};
