import { createRoot } from "react-dom/client"

import store from "./app/store"
import { Provider } from "react-redux"
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ChatUI from "./ChatUI.jsx"
import "./index.css"

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/:uuid?" element={<ChatUI />}/>
      </Routes>
    </BrowserRouter>
  </Provider>
)
