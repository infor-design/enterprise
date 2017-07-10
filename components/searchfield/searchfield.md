# Searchfield  [Learn More](https://soho.infor.com/index.php?p=component/search-box)

## Important Notes

Described below is the general API that is present in all searchfields.  There is a specific component wrapper for searchfield components that reside inside of [Toolbars]( ../components/toolbar/) entitled [Toolbar Searchfield]( ../components/toolbar-searchfield).  These components are very different from regular searchfields and have an expanded API.

{{api-details}}

## Configuration Options

1. [Common Configuration]( ../components/searchfield/example-index.html)
2. [Context Search Style]( ../components/searchfield/example-context-search-style.html)
3. [Different Template]( ../components/searchfield/example-different-template.html)
4. [Searchfield + Go Button]( ../components/searchfield/example-go-button.html)
5. [`clearable` Setting Demonstration]( ../components/searchfield/example-clearable.html)
6. [No "All Results For `x`" Link]( ../components/searchfield/example-no-all-results-link.html)
7. [Categories (Compact Size)]( ../components/searchfield/example-categories-short.html)
8. [Categories (Full Size)]( ../components/searchfield/example-categories-full.html)

## Code Example

```html

  <input class="searchfield" placeholder="Search..."/>


```

## Implementation Tips

- Defining the `source` setting on Searchfield will cause it to invoke an [Autocomplete]( ../components/autocomplete).  The source is not directly handled by the Searchfield component, and is passed directly into this new Autocomplete instance.

## Accessibility

## Keyboard Shortcuts

## States and Variations
