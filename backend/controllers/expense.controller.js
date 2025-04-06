import mongoose from "mongoose";
import Expense from "../models/expense.model.js";


export const addExpense = async (req, res) => {
  console.log("🔹 User in request:", req.user); 
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: No user found in request" });
  }

  const { title, amount, category, date } = req.body;

  if (!title || !amount || !category || !date) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
  
    const newExpense = new Expense({
      title,
      amount,
      category,
      date,
      user: req.user._id, 
    });

    await newExpense.save();
    res.status(201).json({ message: "Expense added successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
export const getExpenses = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const { category } = req.query; 
    const filter = { user: req.user._id }; 

    if (category) {
      filter.category = category;
    }

    const expenses = await Expense.find(filter).sort({ date: -1 });

    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid expense ID" });
    }

    const expense = await Expense.findOne({ _id: id, user: req.user._id });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found or unauthorized" });
    }

    // Update the expense with the provided data
    const updatedExpense = await Expense.findByIdAndUpdate(id, req.body, { new: true });

    res.status(200).json({
      message: "Expense updated successfully",
      updatedExpense,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid expense ID" });
    }

    const expense = await Expense.findOne({ _id: id, user: req.user._id });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found or unauthorized" });
    }

    await Expense.findByIdAndDelete(id);

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
