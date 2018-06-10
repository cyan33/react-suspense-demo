import React, { Timeout, Fragment } from "react";
import ReactDOM from "react-dom";
import { createCache, createResource } from "simple-cache-provider";

const cache = createCache();
const textResouce = createResource((text, ms = 2000) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(text);
    }, ms);
  });
}, ([text, ms]) => text);

const AsyncText = ({ text, ms }) => {
  try {
    textResouce.read(cache, [text, ms]);
    console.log("%cResolves", "background: #222; color: #bada55");
    return <div>{text}</div>;
  } catch (promise) {
    console.log("%cSuspend", "background: blue; color: white");
    throw promise;
  }
};

function Fallback({ delayMs, placeholder, children }) {
  return (
    <Timeout ms={delayMs}>
      {didExpire => (didExpire ? placeholder : children)}
    </Timeout>
  );
}

function App() {
  return (
    <Fragment>
      <div>Suspense demo</div>
      <Fallback delayMs={1000} placeholder={<div>Loading...</div>}>
        <div>Sync Content</div>
        <AsyncText text="Async content has been loaded" />
      </Fallback>
    </Fragment>
  );
}

const root = ReactDOM.unstable_createRoot(document.getElementById("root"));
root.render(<App />);
