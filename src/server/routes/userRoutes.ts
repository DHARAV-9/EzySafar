import express from 'express';
import User from '../models/User';

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  try {
    console.log('📥 Received data at /register:', req.body);
    const { firstName, lastName, email, phone, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ firstName, lastName, email, phone, password });
    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      userId: newUser._id,
      user: {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email
      }
    });
  } catch (error: any) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Login existing user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Authentication failed' });

    res.status(200).json({
      message: 'Login successful',
      userId: user._id,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/search-history', async (req, res) => {
  try {
    const { userId, pickupLocation, dropoffLocation, selectedRide, fareAmount } = req.body;

    if (!userId) return res.status(400).json({ message: 'User ID is required' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.searchHistory.push({ pickupLocation, dropoffLocation, selectedRide, fareAmount });
    await user.save();

    res.status(201).json({ message: 'Search history saved successfully', searchHistory: user.searchHistory });
  } catch (error) {
    console.error('Error saving search history:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
