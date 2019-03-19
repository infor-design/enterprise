# Use Standards

Coding style is extremely personal and everyone has their own preferred style. However, this document is an attempt to land on team standards we decided on for using in the SoHo component project.

The latest version we use ESLint standards forked from [Air Bnb base standards](https://www.npmjs.com/package/eslint-config-airbnb-base) with some exceptions noted in the
eslintrc.js

## :wrench: Tools

### ESLint

See the many ESLint [editor integrations](https://eslint.org/docs/user-guide/integrations).

### Sass Linter

This repo contains a `.stylelintrc file.` You can find plugins for your [code editors here](https://stylelint.io/user-guide/complementary-tools/).

### Html Linter

This repo contains a `.htlmhintrc` which enforces some limited html rules.

- [Atom](https://atom.io/packages/linter-htmlhint)
- VS Code - Cant find?

### Editor Config

Also in this repo is an .editorconfig file which should go in the root of your project.
It will help enforce some of our standards by changing text editor options to be in sync across different editors.
See [here](http://editorconfig.org/) for more info.

## Accessibility

Some practical guidelines that MUST be followed to ensure accessibility.

- Always Provide multimedia fallback e.g "alt" attributes
- Add Landmark Roles

    ```html
    <header role="banner"><!--A region of the page that is site focused. Typically your global page header.-->
    <nav role="navigation"><!--Contains navigational links.-->
    <main role="main"><!--Focal content of document. Use only once.-->
    <article role="article"><!--Represents an independent item of content. Use only once on outermost element of this type.-->
    <aside role="complementary"><!--Supporting section related to the main content even when separated.-->
    <footer role="contentinfo"><!--Contains information about the document (meta info, copyright, company info, etc).-->
    <form role="search"> <!--Add a search role to your primary search form.-->
    ```

- Add Language Attribute
    ```html
    <html lang="en">
    ```
- For Document Outline always use semantic headings and structure
- Links should have a focus state, underline, and appropriate text.
- Images need an appropriate alt tag
    - Use the alt attribute for any image that is used as content. Alt text describes the function of an image, and is rarely a detailed description of the image itself.
    - Make sure the description of the image is useful. For example, if the image is your logo your alt should be your company name and not "logo".
    - Images that are links should describe where they go. For example, a logo that is a link to your home page should have alt="home page".
    - Don’t begin alt text with "photo of.." or "picture of.."; assistive technologies already do this.
    - Use an empty alt attribute `alt=""` for any image that is decorative or not necessary for understanding the content of the page (i.e. the information in a graph is explained in text below it).
    - Using a image file several times in a website doesn’t mean that the alt attribute has to be the same in each img tag. Because alt attribute change with context.
- Use unobtrusive Javascript (never use inline scripting).
- Tab order of the form follows a logical pattern.
- Media (Audio and Video) should provide text alternatives for deaf or hard of hearing - Provide text transcripts Synchronized subtitles for videos
- Test color contrast using <https://michelf.ca/projects/sim-daltonism/>

## Accessibility Testing Tools

- Your Keyboard! Make sure everything can be accessed via the keyboard and has a visual focus state.
- Install and Check your page with
    - <http://wave.webaim.org/toolbar/>
    - <http://squizlabs.github.io/HTML_CodeSniffer/>
- Install and Test with
    - <http://www.nvaccess.org/download/>
    - <http://www.freedomscientific.com/jaws-hq.asp>
    - Voice Over
- Install and test high contrast styles with
    - <http://squizlabs.github.io/HTML_CodeSniffer/> and
    - <http://www.niquelao.net/wcag_contrast_checker/> and
    - <https://michelf.ca/projects/sim-daltonism/>
    or
    - <http://colorfilter.wickline.org/>
- In any version of Internet Explorer, open Tools - Internet Options. Then in the first tab, General, click on the Accessibility button in he lower right.
    - In the Accessibility dialog that appears, check the checkbox to Ignore Colors specified in web pages, and OK changes
    - Now test your error handling to see if it relies on the color red alone
    - Red text, red borderlines, etc. turn black like everything else
    - CSS background images are also removedto test the possibility of over-reliance on background images
- Other tools:
    - <http://www.tenon.io/>
    - <http://quailjs.org/>

## Deprecations

In some cases, the IDS team will choose to [deprecate](https://developer.mozilla.org/en-US/docs/MDN/Contribute/Guidelines/Conventions_definitions#Deprecated_and_obsolete) certain component API methods or properties in favor of others, eventually opting to mark these items "obsolete" and completely remove them.

Our team has adopted a policy where we will not completely remove these deprecated items until at least 6 minor releases have passed.  We have also recently begun to ship a deprecation utility that we use internally to warn users of these deprecated items in the browser.  We've also generally adopted the documentation guidelines for these deprecated items as outlined [in this article](https://css-tricks.com/approaches-to-deprecating-code-in-javascript/).

Additionally, when running our build system with a `--verbose` flag, we provide a compile-time utility that picks up any `@deprecated` [JSDoc tags](http://usejsdoc.org/tags-deprecated.html) and will display them in the console.

When contributing changes to IDS Enterprise, if replacing existing code becomes necessary, consider implementing `deprecatedMethod()` if possible to enable these warnings.

As an example, see this deprecation from our Slider component:

```js
/**
 * @deprecated in v4.2.0. Please use `setValue()` instead.
 * @param {number} lowVal the value for the lower slider handle.
 * @param {number} [highVal] the value for the upper slider handle, if applicable.
 * @returns {array} the newly set values
 */
refresh(lowVal, highVal) {
  return deprecateMethod(this.setValue, this.refresh).apply(this, [lowVal, highVal]);
}
```

In some cases it may not possible to use the wrapper.  For these cases, it's better to use the `warnAboutDeprecation()` method, which is simply for logging the deprecation instead of calling the new code directly. If possible, you should still call your new code immediately after this logging method.

As an example, see this deprecation from our Searchfield component:

```js
/**
 * Detects whether or not the Searchfield has focus.
 * @deprecated in v4.8.0.  Please use the `isFocused` property instead.
 * @returns {boolean} whether or not the Searchfield has focus.
 */
hasFocus() {
  warnAboutDeprecation('isFocused', 'hasFocus');
  return this.isFocused;
}
```

It should also be noted that if changes made are only for methods or properties marked `@private`, it's not necessary to announce deprecation to the browser or build system.  However, it's still a good idea to document these changes with an `@deprecated` note.
