import * as React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { Provider } from "react-redux";

import { App } from "./app";
import { store } from "./store";

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root"),
);

if (module.hot) {
  module.hot.dispose(() => {
    unmountComponentAtNode(document.getElementById("root")!);
  });
}
