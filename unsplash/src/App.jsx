import React from "react";
import Index from "./pages/Index";
import Image from "./pages/Image";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <Index />
        </Route>
        <Route path="/image/:id">
          <Image />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
