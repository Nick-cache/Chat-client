import { configureStore } from "@reduxjs/toolkit";
import { chatsSlice } from "./features/chats/chatsSlice";
import { lmsSlice, chosenModelSlice } from "./features/lms/lmsSlice";

export default configureStore({
  reducer: {
    [chatsSlice.reducerPath]: chatsSlice.reducer,
    [lmsSlice.reducerPath]: lmsSlice.reducer,
    [chosenModelSlice.name]: chosenModelSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(chatsSlice.middleware)
      .concat(lmsSlice.middleware),
  devTools: true,
});
