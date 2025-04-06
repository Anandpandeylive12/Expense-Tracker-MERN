import React, { useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import CreateExpense from "./CreateExpense";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import UpdateDeleteExpense from "./UpdateDeleteExpense";
import useGetExpenses from "./hooks/useGetExpenses";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedExpenses, setSelectedExpenses] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const { expenses, loading, error } = useGetExpenses(user?._id, selectedCategory);

  const handleCheckboxChange = (id) => {
    setSelectedExpenses((prev) =>
      prev.includes(id) ? prev.filter((expenseId) => expenseId !== id) : [...prev, id]
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold text-red-500">User not authenticated</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      <header className="text-center py-16 px-6 flex-grow flex flex-col justify-center items-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          Manage Your Expenses, Effortlessly
        </h1>
        <p className="mt-4 text-lg text-gray-600 text-center max-w-2xl">
          Track your spending, set budgets, and take control of your financial future.
        </p>
      </header>

      <section className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 text-center">Quick Add Expense</h2>
        <CreateExpense />
      </section>

      <section className="max-w-4xl mx-auto p-4">
        <label htmlFor="category" className="text-lg font-semibold">
          Filter by Category:
        </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="ml-2 p-2 border rounded-md"
        >
          <option value="">All</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Shopping">Shopping</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Other">Other</option>
        </select>
      </section>

      <section className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-xl mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 text-center">Expense List</h2>

        {loading && <p className="text-center text-gray-500">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        <Table className="mt-6">
          <TableHeader>
            <TableRow>
              <TableHead>Select</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan="5" className="text-center text-gray-500">
                  No expenses found
                </TableCell>
              </TableRow>
            ) : (
              expenses.map((expense) => (
                <TableRow key={expense._id}>
                  <TableCell>
                    <Checkbox onCheckedChange={() => handleCheckboxChange(expense._id)} />
                  </TableCell>
                  <TableCell>{expense.title}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>${expense.amount}</TableCell>
                  <TableCell>
                    <UpdateDeleteExpense expense={expense} selectedExpenses={selectedExpenses} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </section>
    </div>
  );
};

export default Home;
