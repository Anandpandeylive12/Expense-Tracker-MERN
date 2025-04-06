import User from "../models/user.model.js";  
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All Fields are required", success: false });
    }

    
    const existingUser = await User.findOne({ email }); 
    if (existingUser) {
      return res.status(400).json({ message: "User already exists", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });

    res.status(201).json({
      message: "User Created successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    
    res.status(200).json({ message: "Fetched all users" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All Fields are required", success: false });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "Incorrect Email or Password", success: false });
    }

    const isPasswordMatched = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordMatched) {
      return res.status(400).json({ message: "Incorrect Email or Password", success: false });
    }

    const token = jwt.sign({ userId: existingUser._id }, process.env.SECRET_KEY, { expiresIn: "7d" });

    return res
      .cookie("token", token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "strict", withCredentials: true })
      .json({
        message: `Welcome back ${existingUser.name}`,
        user: {
          _id: existingUser._id,
          name: existingUser.name,
          email: existingUser.email,
        },
        token,
        success: true,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export const logout = async (req, res) => {
  try {
    res.cookie("token", "", { maxAge: 0, httpOnly: true, sameSite: "strict" });
    return res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
