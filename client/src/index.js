import ReactDOM from "react-dom/client";
import { BrowserRouter} from "react-router-dom";

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";
import { store, persistor } from "./store/store.js";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import {Toaster} from "react-hot-toast";
import App from "App.js";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <Toaster/>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
