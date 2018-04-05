---
title: Enterprise Components for Infor Design System
---

![IDS Enterprise Logo](https://ids-com.s3.amazonaws.com/images/enterprise-lib.original.png#logo-float-right)

## Getting Started

To install the enterprise components into your project using NPM, run the following:

```sh
npm config set @infor:registry=http://npm.infor.com:4873
npm install --save @infor/sohoxi
```

The files can be found in `/node_modules/@infor/sohoxi/dist`.

To install the code for development using `git`, run:

```sh
git clone http://git.infor.com/scm/soho/controls.git
```

After you `cd` into the repo, you need to install, build, and serve:

```sh
npm install
npx grunt
node server
```

## Recent Changes

Visit the [release notes](./changelog.html) for this release.
