const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../db/model/users');


const { v4: uuidv4 } = require('uuid');
const secretKey = uuidv4();
console.log(secretKey); // Output: a randomly generated UUID

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Users({ firstName, lastName, email, phoneNumber, password: hashedPassword, role });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: '1h' });
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

