import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Toaster } from "react-hot-toast";
import "antd/dist/antd.css";
import { store } from "./redux/store";
import { Provider } from "react-redux";

ReactDOM.render(
  <>
    <Provider store={store}>
      <Toaster />
      <App />
    </Provider>
  </>,
  document.getElementById("root")
);
