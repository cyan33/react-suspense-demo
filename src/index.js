import React, { Timeout, Fragment, Component } from 'react';
import ReactDOM from 'react-dom';
import {createCache, createResource} from 'simple-cache-provider';

const cache = createCache();
const textResouce = createResource(([text, ms = 0]) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(text);
    }, ms);
  });
}, ([text, ms]) => text);

const AsyncText = ({ text, ms }) => {
  try {
    console.log('Fetching');
    textResouce.read(cache, [text, ms]);
    console.log('Resolves');
    return <span>{text}</span>;
  } catch (promise) {
    console.log('Suspend');
    throw promise;
  }
}

const Fallback = ({ timeout, children, placeholder }) => {
  console.log('Fallback');
  return (
    <Timeout ms={timeout}>
      {didExpire => {
        console.log('didExpire:', didExpire);
        return didExpire ? placeholder : children;
      }}
    </Timeout>
  )
}

class App extends Component {
  render() {
    console.log('App renders')
    return (
      <Fragment>
        <div>App</div>
        <Fallback timeout={1000} placeholder={<div>Loading...</div>}>
          <div>Sync</div>
          <AsyncText ms={3000} text="Hello world" />
        </Fallback>
      </Fragment>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
