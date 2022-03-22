import React, { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";

// Style
import "./App.css";
import "antd/dist/antd.css";
import theme from "../src/theme/Theme";
import { ThemeProvider } from "@mui/material/styles";

// Components
import Main from "./layout/Main";
import Loading from "./components/loading/Loading";

// REDUX
import { Provider } from "react-redux";
import store from "./store/store";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

// Mockup
// import { worker } from "./mock/browser";
// worker.start();

let persistor = persistStore(store);

const App = () => {
  return (
    <Suspense
      fallback={
        <>
          <Loading />
        </>
      }
    >
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <ThemeProvider theme={theme}>
            <BrowserRouter>
              <Main />
            </BrowserRouter>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </Suspense>
  );
};

export default App;
