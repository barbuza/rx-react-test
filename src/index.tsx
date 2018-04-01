import * as React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { Provider } from "react-redux";
import { setStylesTarget } from "typestyle";

import { App } from "./components/App";
import { store } from "./store";

const stylesTarget = document.getElementById("typestyle");
if (stylesTarget) {
  setStylesTarget(stylesTarget);
}

// tslint:disable-next-line:no-var-requires
const debug = require("debug")("rx:index");

if (module.hot) {
  debug("render app");
}

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root"),
);

if (module.hot) {
  module.hot.dispose(() => {
    debug("unmount app");
    unmountComponentAtNode(document.getElementById("root")!);
  });
}
