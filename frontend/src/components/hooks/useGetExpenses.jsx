import { useEffect, useState } from "react";
import axios from "axios";

const useGetExpenses = (category = "") => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token"); // ✅ Get JWT token
      const userId = localStorage.getItem("userId"); // ✅ Get userId

      if (!token || !userId) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        let url = `http://localhost:8000/api/expense/getAllExpenses?userId=${userId}`;
        if (category) {
          url += `&category=${category}`; // ✅ Apply category filter
        }

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Send token in headers
          },
        });

        console.log("Fetched Expenses:", response.data); // ✅ Debugging line
        setExpenses(response.data);
      } catch (err) {
        console.error("Error fetching expenses:", err);
        setError(err.response?.data?.message || "Failed to fetch expenses");
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [category]); // ✅ Refetch when category changes

  return { expenses, loading, error };
};

export default useGetExpenses;
