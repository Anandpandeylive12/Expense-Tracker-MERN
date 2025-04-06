import { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster, toast } from "sonner";

// ✅ Validation Schema
const expenseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  amount: z.preprocess((val) => Number(val), z.number().positive("Amount must be positive")),
  category: z.string().min(3, "Category is required"),
  date: z.string(),
});

const categories = ["Food", "Transport", "Entertainment", "Bills", "Shopping", "Health"];

const CreateExpense = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(expenseSchema),
  });

  // ✅ Check if user is logged in
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    setIsLoggedIn(!!storedToken); // Set true if token exists
  }, []);

  const onSubmit = async (data) => {
    const token = localStorage.getItem("authToken"); // ✅ Retrieve token

    if (!token) {
      toast.error("You must be logged in to add an expense.");
      return;
    }

    try {
      console.log("Sending Token:", token); // ✅ Debugging: Check token before request

      const response = await axios.post("http://localhost:8000/api/expense/add", data, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true, // If you're using cookies
      });

      console.log("Response:", response.data);
      toast.success("Expense added successfully!");
      reset();
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to add expense:", error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="p-6">
      <Toaster position="top-right" />

      {isLoggedIn ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add New Expense
        </Button>
      ) : (
        <p className="text-red-500">You must be logged in to add expenses.</p>
      )}

      <Transition show={isOpen}>
        <Dialog onClose={() => setIsOpen(false)} className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-black/30 fixed inset-0" />

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-sm w-full mx-auto relative z-50">
            <Dialog.Title className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Add Expense
            </Dialog.Title>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-3">
              <div>
                <label className="block text-gray-700 dark:text-gray-300">Title</label>
                <Input {...register("title")} placeholder="Enter expense title" className="dark:bg-gray-700 dark:text-white" />
                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300">Amount</label>
                <Input type="number" {...register("amount")} placeholder="Enter amount" className="dark:bg-gray-700 dark:text-white" />
                {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300">Category</label>
                <Select onValueChange={(value) => setValue("category", value)}>
                  <SelectTrigger className="w-full dark:bg-gray-700 dark:text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-700 dark:text-white">
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300">Date</label>
                <Input type="date" {...register("date")} className="dark:bg-gray-700 dark:text-white" />
              </div>

              <div className="flex justify-between mt-4">
                <Button type="button" onClick={() => setIsOpen(false)} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded">
                  Cancel
                </Button>
                <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                  Add Expense
                </Button>
              </div>
            </form>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default CreateExpense;