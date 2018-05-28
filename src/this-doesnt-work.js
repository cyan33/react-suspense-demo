import React, { Timeout, Fragment, Component } from 'react';
import ReactDOM from 'react-dom';
import {createCache, createResource} from 'simple-cache-provider';

const cache = createCache();
const textResouce = createResource((text) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(text);
    }, 4000);
  });
});

const AsyncText = ({ text }) => {
  try {
    textResouce.read(cache, text);
    console.log('%cResolves', 'background: #222; color: #bada55');
    return <div>{text}</div>;
  } catch (promise) {
    console.log('%cSuspend', 'background: blue; color: white');
    throw promise;
  }
};

function Fallback({delayMs, placeholder, children}) {
  return (
    <Timeout ms={delayMs}>
      {didExpire => {
        console.log('didExpire: ', didExpire);
        return (didExpire ? placeholder : children);
      }}
    </Timeout>
  )
};

class App extends Component {
  state = { shouldRender: false };

  componentDidMount() {
    ReactDOM.unstable_deferredUpdates(() => {
      this.setState({ shouldRender: true });
    });
  }

  render() {
    const {shouldRender} = this.state;
    return shouldRender ? (
      <Fragment>
        <div>Suspense demo</div>
        <Fallback delayMs={2000} placeholder={<div>Loading...</div>}>
          <div>Sync</div>
          <AsyncText text="Async content has been loaded" />
        </Fallback>
      </Fragment>
    ) : null;
  }
}

// Expected behavior inside <Fallback />:
// 1. Empty content
// 2. <div>Loading...</div>
// 3. <div>Sync</div>
//    <div>Async content has been loaded</div>

ReactDOM.render(<App />, document.getElementById('root'));