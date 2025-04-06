import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

import { setUser } from "./redux/authSlice";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";

const appRouter = createBrowserRouter([
 
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/",
    element: <Home />,
  },
]);

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1])); // decode JWT payload
        dispatch(setUser(decoded));
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, [dispatch]);

  return (
    <div>
      <RouterProvider router={appRouter} />
      <Toaster />
    </div>
  );
}

export default App;
