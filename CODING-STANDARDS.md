# Why Standards?

Coding style is extremely personal and everyone has their own preferred style. However, this document is an attempt to land on team standards we decided on for using in the SoHo component project.

The latest version we use ESLint standards forked from Air Bnb base standards https://www.npmjs.com/package/eslint-config-airbnb-base with some exceptions noted in the
eslintrc.js

# <i class="icon-wrench"></i> Tools

## VS Code Linter

The big advantage of using SublimeLinter is that your code can be linted as you type (before saving your changes) and any errors are highlighted immediately, which is considerably easier than saving the file, switching to a terminal, running a linter, reading through a list of errors, then switching back to Sublime Text to locate the errors!

For Sublime users Install SublimeLinter and SublimeLinter-jsHint with Package Control and restart Sublime. Then right click in a js file and set SublimeLinter - Lint Mode - Background

For more info see:

http://sublimelinter.readthedocs.org/en/latest/installation.html

Apparently other tools like Eclipse and Webstorm do this well too ( Contributions Please...).

## Atom linter

Just like Sublime, the Atom editor has a linter plugin. For JSHint and ESLint there are https://github.com/AtomLinter/linter-eslint

For now the jsHint linter is in place but may be removed https://atom.io/packages/linter-jshint


## Sass Linter

This repo contains a .scss-lint.yml. This also works well with Atom and VS Code linters

https://atom.io/packages/linter-scss-lint
https://marketplace.visualstudio.com/items?itemName=adamwalzer.scss-lint

## Html Linter

This repo contains a .htlmhintrc which enforces some limited html rules.

https://atom.io/packages/linter-htmlhint
VS Code - Cant find?

## Editor Config

Also in this repo is an .editorconfig file which should go in the root of your project. It will help enforce some of our standards by changing text editor options to be in sync across different editors. For more info see http://editorconfig.org/

#Accessibility

Some practical guidelines that MUST be followed to ensure accessibility.

 -  Always Provide multimedia fallback e.g "alt" attributes
 -  Add Landmark Roles
```html
<header role="banner"><!--A region of the page that is site focused. Typically your global page header.-->
<nav role="navigation"><!--Contains navigational links.-->
<main role="main"><!--Focal content of document. Use only once.-->
<article role="article"><!--Represents an independent item of content. Use only once on outermost element of this type.-->
<aside role="complementary"><!--Supporting section related to the main content even when separated.-->
<footer role="contentinfo"><!--Contains information about the document (meta info, copyright, company info, etc).-->
<form role="search"> <!--Add a search role to your primary search form.-->
```
 -  Add Language Attribute
```html
<html lang="en">
```
 - For Document Outline always use semantic headings and structure
 - Links should have a focus state, underline, and appropriate text.
 - Images need an appropriate alt tag
   - Use the alt attribute for any image that is used as content. alt text describes the function of an image, and is rarely a detailed description of the image itself (unless, for example, the page is actually about a specific picture).
   - Make sure the description of the image is useful. For example, if the image is your logo your alt should be your company name and not “logo”.
   - Images that are links should describe where they go. For example, a logo that is a link to your home page should have alt="home page".
   - Don’t begin alt text with “photo of..” or “picture of..”; assistive technologies already do this. Redundancy and repetition are almost as bad as not enough information.
   - Use an empty alt attribute for any image that is decorative or not necessary for understanding the content of the page (alt=""). If, for example, the information in a graph is explained in text below it, there’s no need to duplicate that in alt text.
   - Using a image file several times in a website doesn’t mean that the alt attribute has to be the same in each img tag. Because alt attribute change with context. For example, as seen above, a logo that is a link to your home page should have alt="home page" and the same logo, used somewhere else as decoration, should have alt="".
 - Use unobtrusive Javascript (never use inline scripting).
 - Tab order of the form follows a logical pattern.
 - Media (Audio and Video) should provide text alternatives for deaf or hard of hearing - Provide text transcripts Synchronized subtitles for videos
 - Test color contrast using https://michelf.ca/projects/sim-daltonism/

## Accessibility Testing Tools
-  Your Keyboard! Make sure everything can be accessed via the keyboard and has a visual focus state.
-  Install and Check your page with http://wave.webaim.org/toolbar/ and http://squizlabs.github.io/HTML_CodeSniffer/
-  Install and Test with http://www.nvaccess.org/download/ or http://www.freedomscientific.com/jaws-hq.asp or Voice Over
- Install and test high contrast styles with http://squizlabs.github.io/HTML_CodeSniffer/ and http://www.niquelao.net/wcag_contrast_checker/ and https://michelf.ca/projects/sim-daltonism/ or http://colorfilter.wickline.org/
- In any version of Internet Explorer, open Tools - Internet Options. Then in the first tab, General, click on the Accessibility button in he lower right.
In the Accessibility dialog that appears, check the checkbox to Ignore Colors specified in web pages, and OK changes. Now test your error handling to see if it relies on the color red alone. Red text, red borderlines, etc. all turn black like everything else, and for that matter CSS background images are also removed from the page, which makes that an excellent test of over-reliance on background images, too.
- Other tools: http://www.tenon.io/ and http://quailjs.org/
