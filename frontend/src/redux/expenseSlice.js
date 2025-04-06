// redux/expenseSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8000/api/expenses";

export const fetchExpenses = createAsyncThunk("expenses/fetchExpenses", async (userId) => {
  const res = await axios.get(`${API_URL}?userId=${userId}`);
  return res.data;
});

const expenseSlice = createSlice({
  name: "expenses",
  initialState: {
    expenses: [],
    status: "idle",
    error: null,
  },
  reducers: {
    addExpense: (state, action) => {
      state.expenses.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.expenses = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addExpense } = expenseSlice.actions;
export default expenseSlice.reducer;
