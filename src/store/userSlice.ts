// store/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "next-auth";

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<User> | null>) => {
      if (action.payload === null) {
        state.user = null; // Clear user state
      } else if (state.user) {
        state.user = { ...state.user, ...action.payload }; // Merge updates
      } else {
        state.user = action.payload as User; // Initial set if user is null
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, setLoading, setError, logout } = userSlice.actions;
export default userSlice.reducer;
