# The Sohoxi Theme

This is the default theme for [documentationjs](https://github.com/documentationjs):
it consists of underscore templates and a few assets: a [highlight.js](https://highlightjs.org/)
theme and [basscss](http://www.basscss.com/) as a basic CSS framework.

This was bundled in version 5.3.5 of documentationjs but was "modified" by taking the lib folder
from https://github.com/documentationjs/documentation/issues/849

And changing it a bit.

The contents are the following:

* `index._`, the main template that defines the document structure of the api part of our code
* `section._`, a partial used to render each chunk of documentation
* `assets/*`, any assets, including CSS & JS

To run the docs for this code base on a file use the command

```
documentation build components/about/about.js --format html --theme docs/theme --o docs/api/about.html --shallow
```

If the theme needs modification refer to the example theme on https://github.com/documentationjs/documentation/tree/master/src/default_theme to construct this we modified the files in the theme folder accordingly. Also another example of a theme https://github.com/mapbox/mapbox-gl-js/blob/master/docs/pages/api.js


## Trouble Shooting

```
Error: spawn pandoc ENOENT
```

Try install pandoc with `brew install pandoc`.
