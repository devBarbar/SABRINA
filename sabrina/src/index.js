import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Helmet } from "react-helmet";
import { ThemeProvider } from "styled-components";
const theme = {
  blue: " #2980B9",
  gray: " #EEE",
  darken_gray: "#6f6f6f",
};
ReactDOM.render(
  <React.StrictMode>
    <Helmet>
      <base href='%PUBLIC_URL%/' />
      <script
        src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/103389/classie.js'
        type='text/javascript'
      />
      <script
        src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/103389/selectFx.js'
        type='text/javascript'
      />
    </Helmet>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
