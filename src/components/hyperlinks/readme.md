---
title: Hyperlinks
description: null
demo:
  embedded:
  - name: Default Hyperlink Example
    slug: example-index
---

## Code Example

A hyperlink uses a standard anchor tag element and styles it with CSS. No JS is needed for this component. Use the normal attributes and events of a standard anchor tag (click, focus, etc.). Note that the disabled attribute is NOT valid HTML so should be avoided, however it's included for backwards compatibility and some use cases. Normally a disabled link would be a label or text. There is alternate classes for visited links and Back/Forward Links.

```html
<a id="hyperlink" class="hyperlink" href="#">More Information Hyperlink</a>
```

## Accessibility

- Don't use the word "link" in the link as it is repetitive and doesn't describe what is being linked to
- Don't use all capital letters in link text
- Don't use ascii characters in links
- Don't use the URL as the text in a link
- Keep link text concise
- You may use audible links if needed
- Avoid <a href="https://en.wikipedia.org/wiki/Idiom" target="_blank">idioms</a>
- Be consistent; for example, use "Forward" and "Back" or "Next" and "Previous", but don't mix "Forward" and "Next"

## Keyboard Shortcuts

- <kbd>Tab</kbd> moves focus to the Link. A second tab moves focus to the next focusable item
- <kbd>Space</kbd> or <kbd>Enter</kbd> executes the link
- <kbd>Shift + F10</kbd> is used to bring up an associated popup menu

## Upgrading from 3.X

- Replace `class="inforHyperlink"` with `hyperlink`
