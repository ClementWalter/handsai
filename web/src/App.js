import "styles/globalStyles.css";
import "tailwindcss/dist/base.css";

import React from "react";

import SaaSProductLandingPage from "demos/SaaSProductLandingPage.js";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/">
          <SaaSProductLandingPage />
        </Route>
      </Switch>
    </Router>
  );
}
