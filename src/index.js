import React from "react";
import ReactDOM from "react-dom";
import "mapbox-gl/dist/mapbox-gl.css";
import App from "./App";
import "./sass/index.scss";
import '@fortawesome/fontawesome-free/css/all.min.css';
import * as serviceWorker from "./serviceWorker";
ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
