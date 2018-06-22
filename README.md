# react-suspense-demo

React Suspense is just around the corner and will possibly be released at the end of the year (2018). Right now it's still being tested and experimented inside of Facebook.

But that doesn't mean you cannot play with it now.

## Link Your Own Project With a Forked React

The pull request of suspense has already been merged into the React repo, but the reason you cannot use it today is because React uses a set of feature flags to control which are available to public. To use suspense in your repo, you have to turn that feature flag on.

First, clone a react repo to your computer. In your local React repo, open `shared/ReactFeatureFlags.js`, and change the suspense feature flag to `true`:

```js
// Suspense
export const enableSuspense = true;
```

and you also need to build the `react` and `react-dom` packages again to make it available to use. In the root directory of React, run:

```
yarn build core,dom
```

Inside `packages/react` and `packages/react-dom`, run the following command twice. The [`yarn link`](https://yarnpkg.com/lang/en/docs/cli/link/) command allows you to use local copy of packages in your project instead of pulling from npm registry.

```
yarn link
```

and in your own project repo, run:

```
yarn link react
yarn link react-dom
```

Voila! Now your project is using your own React copy.

## Suspense

Suspense is a generic and graceful way in React to handle async data fetching, I/O and related things, which is powered by the Fiber architecture.

For more details on how to better understand this feature and usage, read [this](https://medium.com/@thomasyim94/a-bit-more-about-react-suspense-2e05cc4e9ef8).

Andrew's [talk](https://www.youtube.com/watch?v=z-6JC0_cOns) on React suspense.

## Caveats

* The `Timeout` component suspends the whole component tree, not only those wrapped inside.
