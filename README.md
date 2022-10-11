# Nicho's React-App Template

This is a template for creating client-side rendered React applications, like one would
using `create-react-app`. It is intended to be used with VSCode. 

This template's key features are:

- It uses typescript
- It comes with emotion and the css prop for jsx out of the box
- It uses yarn with PnP and zero-installs for its packages
- It comes with an eslint and prettier configuration
- By default it adds an MIT license to your project. If you want to use a different license,
  you'll have to change it manually.

Note: I mainly made this package for myself. PRs are welcome, but I will not be guaranteeing support,
and this project will always be subject to my personal opinions, simply for convieniece's sake.
You can feel free to fork it if you have your own direction to take it in!


# Usage

Once you have created a repository from this template, you will need to initialize it. To do this, use [tmplr](https://www.npmjs.com/package/tmplr):

```
npx tmplr
```

Then, just run yarn once to initialize the repository

```
yarn
```

Finally, as soon as you open a `.ts` or `.tsx` file, VSCode will give you a prompt to ask whether it
should use the typescript version this project defines - make sure to click allow, and everything
will work properly!


# Scripts

After your project is set up, you can use the following scripts:

| Command      | Description                                                     |
|--------------|-----------------------------------------------------------------|
| `yarn start` | Start your project in debug mode                                |
| `yarn build` | Compile an optimized build of your project that can be deployed |

You can also use `yarn lint`, `yarn lint:fix`, and `yarn format`, but you shouldn't need any of them,
because both eslint and prettier are already integrated into your editor configuration.