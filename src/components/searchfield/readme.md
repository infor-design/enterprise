---
title: Searchfield
description: Displays an editable field. A user can enter and then search for an alphanumeric value within the system. Best used for targeted, keyword-based searches for specific objects.
demo:
  embedded:
  - name: Common Configuration
    slug: example-index
  pages:
  - name: Category with a Go Button
    slug: example-categories-and-go-button
  - name: Categories (Full Size)
    slug: example-categories-full
  - name: Categories (Compact Size)
    slug: example-categories-short
  - name: Different Template
    slug: example-different-template
  - name: Searchfield + Go Button
    slug: example-go-button
  - name: No "All Results For `x`" Link
    slug: example-no-all-results-link
---

There is a specific component wrapper for searchfield components that reside inside of [toolbars](./toolbar/) entitled [toolbar searchfield](./toolbar-searchfield). These components are very different from regular searchfields and have an expanded API.

Defining the `source` setting on Searchfield will cause it to invoke an [autocomplete](./autocomplete). The source is not directly handled by the searchfield component and is passed directly into this new autocomplete instance.

## Code Example

```html
<div class="field">
  <label for="searchfield">Search</label>
  <input id="searchfield" name="searchfield" class="searchfield" data-options= "{'clearable': 'true'}" placeholder="Type a search term"/>
</div>
```

## Keyboard Shortcuts

- <kbd>Tab</kbd> will tab into the search field in a forward direction
- <kbd>Shift + Tab</kbd> will tab out of the search field in a backward direction
- <kbd>Alt + Delete</kbd> (Mac) will clear the contents of the field
- <kbd>Ctrl + Backspace</kbd> (PC) will clear the contents of the field
- <kbd>Up</kbd> or <kbd>Down</kbd> arrows, when on a toolbar, will move to the next/previous object on the toolbar. This is done because the normal keys of <kbd>Left</kbd> and <kbd>Right</kbd> will navigate through the toolbar
- <kbd>Left</kbd> or <kbd>Right Arrow</kbd> when on a toolbar will navigate through the next/previous object on the toolbar. When a list is open it will navigate up and down a list.
- <kbd>Enter</kbd> should submit the search. You will need to handle this in your code

## Testability

The searchfield can have custom id's/automation id's that can be used for scripting. To add them use the option `attributes` to set an id on the searchfield. This can take either an object or an array if doing several id's, and you can configure the automation id name. For example:

```js
  attributes: { name: 'id', value: args => `searchfield-id-${args.id}` }
```

Setting the id/automation id with a string value:

```js
  attributes: { name: 'data-automation-id', value: 'my-unique-id' }
```

Setting the id/automation id with a string value:

```js
  attributes: [{ name: 'id', value: 'my-unique-id' }, { name: 'data-automation-id', value: 'my-unique-id' }]
```

The close button will get an id with `-btn-close` appended after the id given.

If setting the id/automation id with a function, the id will be a running total of open searchfield.
