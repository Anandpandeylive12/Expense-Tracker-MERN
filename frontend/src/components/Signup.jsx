import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner"; // Import toast
import { Form, FormField, FormLabel, FormControl, FormMessage, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Logo from "./shared/Logo";
import { Toaster } from "@/components/ui/sonner";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const systemDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", systemDarkMode);
  }, []);

  const onSubmit = async (values) => {
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8000/api/users/register", values, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Signup Success:", response.data);

      // Show success toast
      toast.success("Signup successful! Redirecting to login...");

      // Redirect to login after 1.5 seconds
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      console.error("Signup Error:", error);

      // Show error toast
      toast.error(error.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <Toaster richColors position="top-center" /> {/* Toast container */}

      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <div className="flex justify-center"><Logo /></div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center mb-4">
          Sign Up
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter your name" className="dark:bg-gray-700 dark:text-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
              {loading ? "Signing up..." : "Sign Up"}
            </Button>
          </form>
        </Form>

        {/* Already have an account? Login */}
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-4">
          Already have an account?
          <Link to="/login" className="text-blue-500 dark:text-blue-400 hover:underline ml-1">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
