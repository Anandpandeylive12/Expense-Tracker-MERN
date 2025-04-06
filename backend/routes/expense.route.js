import express from "express";
import { addExpense, getExpenses, updateExpense, deleteExpense } from "../controllers/expense.controller.js";
import authMiddleware from "../middleware/isAuthenticated.js"; 

const router = express.Router();


router.post("/add", authMiddleware, addExpense);


router.get("/getAllExpenses", authMiddleware, getExpenses); 


router.put("/:id", authMiddleware, updateExpense);


router.delete("/:id", authMiddleware, deleteExpense);

export default router;
