import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: ["Food", "Transport", "Shopping", "Entertainment", "Other"], 
    },
    done: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      
    },
  },
  { timestamps: true } 
);

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;
