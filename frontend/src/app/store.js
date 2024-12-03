import { configureStore } from "@reduxjs/toolkit";
import { chatsSlice, messagesSlice } from "./features/chats/chatsSlice";
import { lmsSlice, chosenModelSlice } from "./features/lms/lmsSlice";
import { DEV } from "./config";

export default configureStore({
  reducer: {
    [chatsSlice.reducerPath]: chatsSlice.reducer,
    [messagesSlice.reducerPath]: messagesSlice.reducer,
    [lmsSlice.reducerPath]: lmsSlice.reducer,
    [chosenModelSlice.name]: chosenModelSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(chatsSlice.middleware)
      .concat(messagesSlice.middleware)
      .concat(lmsSlice.middleware),
  devTools: DEV,
});
