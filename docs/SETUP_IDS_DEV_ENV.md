# Setting Up Dev Env To Contribute to IDS

## Pre-requisites

### Node.js & NPM

![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2012.16.3-green.svg);

All of our build tools run in [Node.JS](https://nodejs.org/en/), which ships with NPM for package management. We are currently all using Node 12. Our installation script will test for this when running `npm install`.

You'll also need all the requirements [node-gyp](https://github.com/nodejs/node-gyp#installation) suggests installing for your operating system. We suggest a node version manager like [nvm](https://github.com/nvm-sh/nvm) or [nvm windows](https://github.com/coreybutler/nvm-windows)

### Git

Our project uses [Git](https://git-scm.com/) for version control.  Any pull requests made to IDS Enterprise will need to be done in a new branch cut from our latest `main` branch.  See the [Git Workflow documentation](./GIT-WORKFLOW.md) for more information.

## Setting Up a Local Repo

If using windows the default for linebreaks is CRLF. This project uses LF. In order to configure this for windows you can run the following command before cloning.

```sh
git config core.autocrlf false
```

Use the following to clone our repo and install dependencies:

```sh
git clone https://github.com/infor-design/enterprise.git
cd enterprise
npm i
```

Optional: We use [`nvm`](https://github.com/creationix/nvm) in development so the team is consistently on the same version of Node. If you want to use the version we've set for development, run `nvm use` from within the project folder.

#### Basic commands

- `npm start` : builds the IDS library and runs the demo server.  After running this, open a browser to [`localhost:4000`](http://localhost:4000).
- `npm run documentation` : builds a local copy of the documentation for the IDS components based on the source code in this package.  You can also view [the most current stable release's documentation](https://design.infor.com/code/ids-enterprise/latest).
- `npm run test` : runs [eslint](https://eslint.org/), and IDS's functional and e2e test suites.  Before running this command, make sure to [read our testing documentation](./TESTING.md).

See the `scripts` object in [package.json](../package.json) for a full list of commands.

#### Debugging the Demo Application

Debugging the Demo App can be done in the usual manner for Node applications, with the `--inspect` or `--inspect-brk` flags:

- Add a break point in the demo app code
- Run `node --inspect-brk app/server.js --verbose` to start the app in debug mode
- Open chrome and navigate to `chrome://inspect` and press run target
- Open the page in question and the debugger should popup up

It's also possible to start the demoapp with flags that control certain options, such as locale, color scheme, etc.  Unless these flags are individually overriden via URL query parameters, they will take effect on all pages until the demoapp is restarted.

For example, if you wanted to test overall changes to the demoapp in the Spanish locale with an alternate color scheme, you could start the demoapp with the following flags:

```sh
node app/server.js --verbose --locale=es-ES --colors=#941e1e
```

Appending these same parameters to the URL is a way to temporarily test them against a single page:

```html
http://localhost:4000/components/mask/test-number-mask-gauntlet?locale=es-ES&colors=#941e1e
```

## Auto-running environment when opening in VSCode

If you would like to conveniently auto-run the demo and web server when opening VSCode via VSCode's terminal when the repo folder is opened, this can be done by:

- Creating a file in `${root}/.vscode/tasks.json` and inputting the following:

```js
{
    "version": "2.0.0",
    "tasks": [
      {
        "label": "IDS Enterprise: Demo Server",
        "type": "shell",
        "command": "npm run start",
        "windows": {
          "command": "npm run start"
        },
        "presentation": {
          "reveal": "always",
          "panel": "new"
        },
        "runOptions": { "runOn": "folderOpen" }
      },
      {
        "label": "IDS Enterprise: Dev Server",
        "type": "shell",
        "command": "npm run watch",
        "windows": {
          "command": "npm run watch"
        },
        "presentation": {
          "reveal": "always",
          "panel": "new"
        },
        "runOptions": { "runOn": "folderOpen" }
      }
    ]
  }
```

- `Command + Shift + P` (Mac) => Type "Tasks: Allow Automatic Tasks in Folder" and Click the option to allow auto running tasks

- Restarting VSCode and/or re-opening the repo folder at `/enterprise` would then auto-run the dev server and demo application for you until the window is closed (note: if you have an instance running in the background/via another terminal this would fail).

## Editor Plugins

This project uses `eslint` and `editorconfig`. You may want to add lint plugins to your editor to help comply with our coding standards:

_For Atom:_

- [ESLint](https://github.com/AtomLinter/linter-eslint)
- [EditorConfig](https://github.com/sindresorhus/atom-editorconfig#readme)

_For VSCode:_

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [EditorConfig](https://github.com/editorconfig/editorconfig-vscode)

Additionally, check out our [Coding Standards documentation](./CODING-STANDARDS.md) for the code standards that will be enforced by these plugins.