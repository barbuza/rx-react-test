import * as React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { Provider } from "react-redux";

import { App } from "./app";
import { store } from "./store";

// tslint:disable-next-line:no-var-requires
const debug = require("debug")("rx:index");

debug("render app");
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
