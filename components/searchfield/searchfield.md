---
title: Searchfield  
description: This page describes Searchfield.
---

## Important Notes

Described below is the general API that is present in all searchfields.  There is a specific component wrapper for searchfield components that reside inside of [Toolbars]( ../components/toolbar/) entitled [Toolbar Searchfield]( ../components/toolbar-searchfield).  These components are very different from regular searchfields and have an expanded API.

## Configuration Options

1. [Common Configuration]( ../components/searchfield/example-index.html)
2. [Context Search Style]( ../components/searchfield/example-context-search-style.html)
3. [Different Template]( ../components/searchfield/example-different-template.html)
4. [Searchfield + Go Button]( ../components/searchfield/example-go-button.html)
5. [`clearable` Setting Demonstration]( ../components/searchfield/example-clearable.html)
6. [No "All Results For `x`" Link]( ../components/searchfield/example-no-all-results-link.html)
7. [Categories (Compact Size)]( ../components/searchfield/example-categories-short.html)
8. [Categories (Full Size)]( ../components/searchfield/example-categories-full.html)
8. [Header Search Field (Compact)]( ../components/header/example-searchfield-expanded)
9. [Header Search Field (Large)]( ../components/header/example-searchfield-large)

## Code Example

```html

<div class="field">
  <label for="searchfield">Search</label>
  <input id="searchfield" name="searchfield" class="searchfield" data-options= "{'clearable': 'true'}" placeholder="Type a search term"/>
</div>


```

## Implementation Tips

- Defining the `source` setting on Searchfield will cause it to invoke an [Autocomplete]( ../components/autocomplete).  The source is not directly handled by the Searchfield component, and is passed directly into this new Autocomplete instance.

## Accessibility

## Keyboard Shortcuts

- *Tab* Will tab into the search field in a forward direction.
- *Shift Tab* Will tab out of the search field in a backward direction.
- *Alt + Delete* (Mac) Will clear the contents of the field.
- *Ctrl + Backspace* (PC) Will clear the contents of the field.
- *Up / Down Arrow* When on a toolbar up and down will move to the next/previous object on the toolbar.
This is done because the normal keys of left and right will navigate through the toolbar
- *Left / Right Arrow* When on a toolbar left and right will navigate through the next/previous object on the toolbar. When a list is open it will navigate up and down a list.
- *Enter* Should submit the search / form. You will need to handle this in your code.

## States and Variations
