import React from "react";
import Index from "./pages/Index";
import Image from "./pages/Image";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Tags from "./pages/Tags";
import Usuarios from "./pages/Usuarios";

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
        <Route path="/tags/:id">
          <Tags />
        </Route>
        <Route path="/users/:id">
          <Usuarios />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
