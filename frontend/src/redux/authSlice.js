// redux/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  user: null,
  loading: false,
  error: null,
};

// Login
export const loginUser = createAsyncThunk("auth/loginUser", async (userData, { rejectWithValue }) => {
  try {
    const res = await axios.post("http://localhost:8000/api/users/login", userData, {
      withCredentials: true,
    });
    localStorage.setItem("authToken", res.data.token);
    return res.data.user; // assuming res.data has { user, token }
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Login failed");
  }
});

// Logout
export const logoutUser = createAsyncThunk("auth/logoutUser", async (_, { rejectWithValue }) => {
  try {
    await axios.post("http://localhost:8000/api/users/logout", {}, { withCredentials: true });
    localStorage.removeItem("authToken");
    return null;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Logout failed");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
