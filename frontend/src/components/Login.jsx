import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, FormField, FormLabel, FormControl, FormMessage, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Logo from "./shared/Logo";
import { Toaster, toast } from "sonner"; // Import Sonner

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const systemDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (systemDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const onSubmit = async (credentials) => {
    try {
      setLoading(true); // ✅ Show loading state
      const response = await axios.post("http://localhost:8000/api/users/login", credentials);
  
      console.log("Login Response:", response.data); // ✅ Debugging
  
      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("userId", response.data.user._id); // ✅ Store token correctly
        toast.success("Login successful!");
  
        setLoading(false);
        navigate("/"); // ✅ Redirect to home page instead of reloading
      } else {
        toast.error("Login failed. No token received.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Login Error:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Login failed.");
      setLoading(false);
    }
  };
  
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <div className="flex justify-center"><Logo /></div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center mb-4">
          Log In
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter your email" type="email" className="dark:bg-gray-700 dark:text-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">Password</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter your password" type="password" className="dark:bg-gray-700 dark:text-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
            </Button>
          </form>
        </Form>

        {/* Don't have an account? Sign Up */}
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-4">
          Don't have an account?
          <Link to="/signup" className="text-blue-500 dark:text-blue-400 hover:underline ml-1">
            Sign Up
          </Link>
        </p>
      </div>

      {/* Sonner Toaster */}
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default Login;
