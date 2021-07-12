import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isNullOrUndefined } from "util";

export type UserType = {
  email: string;
  uid: string;
};

export type UserDataType = {
  username: string;
  email: string;
  role: string;
  age: string;
  userId: string;
  tasks?: string[];
};

export type taskType = {
  userId: string;
  taskKey: string;
  task: string;
};

export interface CounterState {
  user: UserType | undefined;
  userData: UserDataType | undefined;
  editTask: taskType | undefined;
}

const initialState: CounterState = {
  user: undefined,
  userData: undefined,
  editTask: undefined,
};

export const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserType | undefined>) => {
      state.user = action.payload;
    },
    setUserData: (state, action: PayloadAction<UserDataType | undefined>) => {
      state.userData = action.payload;
    },
    setEditTask: (state, action: PayloadAction<taskType | undefined>) => {
      state.editTask = action.payload;
    },
  },
});

export const { setUser, setUserData, setEditTask } = UserSlice.actions;

export default UserSlice.reducer;
