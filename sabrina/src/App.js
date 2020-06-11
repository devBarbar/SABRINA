import React from "react";
import Form from "./containers/Form/";
import logo from "./logo.svg";
import {
  transitions,
  positions,
  types,
  Provider as AlertProvider,
} from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import "./App.css";
import Result from "./containers/Result";

const options = {
  position: positions.MIDDLE,
  transition: transitions.SCALE,
  type: types.INFO,
  timeout: 3000,
};
function App() {
  return (
    <AlertProvider template={AlertTemplate} {...options}>
      <div className='App container'>
        <Form></Form>
      </div>
    </AlertProvider>
  );
}

export default App;
