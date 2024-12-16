import SmsUser from "../../../models/schema/SmsUser";

export const registerUser = async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
  
    try {
      const existingUser = await SmsUser.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered.' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new SmsUser({ email, password: hashedPassword });
  
      await newUser.save();
      res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };


  export const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
  
    try {
      const user = await SmsUser.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password.' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid email or password.' });
      }
  
      res.status(200).json({ message: 'Login successful.', user });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };

  export const getAllUsers = async (req, res) => {
    try {
      const users = await SmsUser.find().select('-password'); // Exclude passwords
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };