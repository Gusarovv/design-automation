// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { IGuildInfo } from '@shared/interface/guild-info.interface';
// import { IProfileUser, IUserDiscordInfo } from '@shared/interface/user-info.interface';
// import { RootState } from '@shared/store/store';

// interface UserState {
//    user: IUserDiscordInfo | null;
//    userProfile: IProfileUser | null;
//    guilds: IGuildInfo[] | null;
//    needRefetchGuilds: boolean;
//    cookieShow: 'question' | 'accept' | 'disabled';
// }

// const initState: UserState = {
//    user: null,
//    userProfile: null,
//    guilds: null,
//    needRefetchGuilds: false,
//    cookieShow: null,
// };

// export const userSlice = createSlice({
//    name: 'userSlice',
//    initialState: initState,
//    reducers: {
//       setUser(state, action: PayloadAction<IUserDiscordInfo>) {
//          state.user = action.payload;
//       },
//       setUserProfile(state, action: PayloadAction<IProfileUser>) {
//          state.userProfile = action.payload;
//       },
//       setUserProfilePremDC(state, action: PayloadAction<{ infoImageURL?: string; infoEmbedColor?: number }>) {
//          if (action.payload.infoImageURL && state.userProfile?.prem)
//             state.userProfile.prem.infoImageURL = action.payload.infoImageURL;
//          if ((action.payload.infoEmbedColor || Number(action.payload.infoEmbedColor) === 0) && state.userProfile?.prem)
//             state.userProfile.prem.infoEmbedColor = action.payload.infoEmbedColor;
//       },
//       decrementUserProfileLeft(state) {
//          if (state.userProfile?.prem?.guildLeft) {
//             state.userProfile.prem.guildLeft = state.userProfile.prem.guildLeft - 1;
//          }
//       },
//       setGuilds(state, action: PayloadAction<IGuildInfo[]>) {
//          state.guilds = action.payload;
//       },
//       setNeedRefetchGuilds(state, action: PayloadAction<boolean>) {
//          state.needRefetchGuilds = action.payload;
//       },
//       setCookieShow(state, action: PayloadAction<'question' | 'accept' | 'disabled'>) {
//          state.cookieShow = action.payload;
//       },
//    },
// });

// export const {
//    setUser,
//    setUserProfile,
//    setUserProfilePremDC,
//    setGuilds,
//    setCookieShow,
//    setNeedRefetchGuilds,
//    decrementUserProfileLeft,
// } = userSlice.actions;

// export default userSlice.reducer;

// export const selectUser = (state: RootState) => state.userReducer.user;
// export const selectUserProfile = (state: RootState) => state.userReducer.userProfile;
// export const selectNeedRefetchGuilds = (state: RootState) => state.userReducer.needRefetchGuilds;
