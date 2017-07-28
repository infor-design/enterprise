# the soho xi theme

This is the default theme for sos api docs. Uses no special code or frameworks.
Just generates a partial thats injected in the page.

The contents are the following:

* `index._`, the main template that defines the document structure
* `section._`, a partial used to render each chunk of documentation

Example Command:

`sudo documentation build components/about/about.js --format html --theme docs/theme --o docs/api/about.html`
