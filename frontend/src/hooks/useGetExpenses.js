// hooks/useGetExpenses.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchExpenses } from "../redux/expenseSlice";

const useGetExpenses = (userId, category) => {
  const dispatch = useDispatch();
  const { expenses, status, error } = useSelector((state) => state.expenses);

  useEffect(() => {
    if (userId) {
      dispatch(fetchExpenses(userId));
    }
  }, [userId, dispatch]); // ✅ include `dispatch` to fix ESLint warning

  const filtered = category
    ? expenses.filter((expense) => expense.category === category)
    : expenses;

  return {
    expenses: filtered,
    loading: status === "loading",
    error,
  };
};

export default useGetExpenses;
