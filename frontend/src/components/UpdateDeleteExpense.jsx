import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteExpense, updateExpense } from "../redux/expenseSlice";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const UpdateDeleteExpense = ({ expenses }) => {
  const dispatch = useDispatch();
  const [selectedExpenses, setSelectedExpenses] = useState([]);

  const handleSelectExpense = (id) => {
    setSelectedExpenses((prev) =>
      prev.includes(id) ? prev.filter((expenseId) => expenseId !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    selectedExpenses.forEach((id) => dispatch(deleteExpense(id)));
    setSelectedExpenses([]);
  };

  return (
    <section className="max-w-5xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white text-center mb-4">
        Expense List
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-300 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700">
              <th className="border border-gray-300 px-4 py-2">Select</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Amount</th>
              <th className="border border-gray-300 px-4 py-2">Category</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id} className="text-center">
                <td className="border border-gray-300 px-4 py-2">
                  <Checkbox
                    checked={selectedExpenses.includes(expense.id)}
                    onCheckedChange={() => handleSelectExpense(expense.id)}
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">{expense.name}</td>
                <td className="border border-gray-300 px-4 py-2">${expense.amount}</td>
                <td className="border border-gray-300 px-4 py-2">{expense.category}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <Button className="mr-2" onClick={() => dispatch(updateExpense(expense))}>
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedExpenses.length > 0 && (
        <div className="mt-4 flex justify-end">
          <Button onClick={handleDeleteSelected} className="bg-red-600 hover:bg-red-700">
            Delete Selected
          </Button>
        </div>
      )}
    </section>
  );
};

export default UpdateDeleteExpense;
