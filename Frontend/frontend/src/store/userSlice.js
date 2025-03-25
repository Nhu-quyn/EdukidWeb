import { createSlice } from "@reduxjs/toolkit";

// Lấy dữ liệu user từ localStorage (nếu có)
const storedUser = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: storedUser || null,
  isLoggedIn: !!storedUser, // Chuyển đổi thành true nếu có user
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
      localStorage.setItem("user", JSON.stringify(action.payload)); // Lưu vào localStorage
    },
    clearUser: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      localStorage.removeItem("user"); // Xóa khỏi localStorage khi đăng xuất
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
