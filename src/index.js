import React, { Timeout, Fragment } from "react";
import ReactDOM from "react-dom";
import { createCache, createResource } from "simple-cache-provider";

const cache = createCache();
const textResouce = createResource((text, ms = 4000) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(text);
    }, ms);
  });
}, ([text, ms]) => text);

const AsyncText = ({ text, ms }) => {
  try {
    // reading from resource should happen inside Placeholder
    // so that Timeout could catch the thrown promise from here
    // if the result hasn't been cached
    textResouce.read(cache, [text, ms]);
    console.log("%cResolves", "background: #222; color: #bada55");
    return <div>{text}</div>;
  } catch (promise) {
    // normally you don't need to catch the promise yourself
    // in the component, we catch and throw it again just because
    // putting a console.log here helps us better understand the process
    console.log("%cSuspend", "background: blue; color: white");
    throw promise;
  }
};

function Placeholder({ delayMs, fallback, children }) {
  return (
    <Timeout ms={delayMs}>
      {didExpire => {
        console.log('didExpire: ', didExpire);
        return didExpire ? fallback : children;
      }}
    </Timeout>
  );
}

function App() {
  return (
    <Fragment>
      <div>Suspense demo</div>
      <Placeholder delayMs={1000} fallback={<div>Loading...</div>}>
        <div>Sync Content</div>
        <AsyncText text="Async content has been loaded" />
      </Placeholder>
    </Fragment>
  );
}

const root = ReactDOM.unstable_createRoot(document.getElementById("root"));
root.render(<App />);
