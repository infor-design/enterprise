# The Sohoxi Theme

Was created by modifying the default theme from [documentationjs](https://github.com/documentationjs).
The default theme consists of underscore templates and a few assets: a [highlight.js](https://highlightjs.org/)
theme and [basscss](http://www.basscss.com/) as a basic CSS framework.

The modified theme just uses the js and underscore templates and its own css. It was bundled
from version 5.3.5 of documentationjs but was "modified" by taking the lib folder as described on https://github.com/documentationjs/documentation/issues/849

The contents are the following:

* `index._`, the main template that defines the document structure of the api part of our code
* `section._`, a partial used to render each chunk of documentation

To test run the template generator run this command.

```
documentation build components/about/about.js --format html --theme docs/theme --o docs/api/about.html --shallow
```

Other Theme Examples:
https://github.com/documentationjs/documentation/tree/master/src/default_theme https://github.com/mapbox/mapbox-gl-js/blob/master/docs/pages/api.js

## Entire build procedure

- in package.json we have a command entered to run the docs on all files `npm run documentation`
- when running grunt watch it runs the command `./build/generate-documentation.js "accordion"` which runs the docs on one file
-

## Tips for Converting docs

- See about.js and accordion.js for more complete examples in the code
- If using jsdoc format docs, make sure to add `* @private ` to the method. Unless is going to be useful to outside teams.

## Trouble Shooting

```
Error: spawn pandoc ENOENT
```

Try install pandoc with `brew install pandoc`.
