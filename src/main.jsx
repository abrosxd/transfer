import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./main.css";

import { BrowserRouter as Router } from "react-router-dom";
import { Settings } from "./utils/Settings.jsx";

const Root = () => {
  return (
    <Settings>
      <Router>
        <App />
      </Router>
    </Settings>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);
