import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '@shared/store/store';

type UserState = {
  isAuth: boolean;
};

const initState: UserState = {
  isAuth: false,
};

export const userSlice = createSlice({
  name: 'userSlice',
  initialState: initState,
  reducers: {
    setUserIsAuth(state, action: PayloadAction<boolean>) {
      if(!action.payload) localStorage.removeItem('token');
      state.isAuth = action.payload;
    },
  },
});

export const { setUserIsAuth } = userSlice.actions;

export default userSlice.reducer;

export const selectUserIsAuth = (state: RootState) => state.userReducer.isAuth;
