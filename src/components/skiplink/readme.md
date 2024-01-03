---
title: Skiplink Component
description: null
demo:
  embedded:
  - name: Main Example
    slug: example-index
---

The SkipLink Component is a CSS-Only component and has no Javascript API. It's used by simply placing the markup in the page. When the skip link is focused from the browser URL using <kbd>Tab</kbd>, it will activate allowing you to jump to a different section. In the embedded example you may not be able to easily tab in so try opening the example in a new window and tabbing in from the url bar.

For more info on skip links see <a href="https://webaim.org/techniques/skipnav/" target="_blank">this article</a>.

## Code Example

Add this at the top of the page, making the `href` point to the `id` of the content area you would like to focus, which would be considered the main content of the page.

```html
<a class="skip-link" href="#maincontent">Skip to Main Content</a>

<!--At a logic place in the page skipping repetitive header content-->
<div id="maincontent" role="main">
</div>
```

## Accessibility

Skip links are an accessibility feature. Adding one to your page will aid users that use screen readers to navigate over familiar content, like navigation, at the top of the page to main page content.

## Keyboard Shortcuts

- When you <kbd>Tab</kbd> from the browser bar into the page the skip link will appear on and be focused
- <kbd>Enter</kbd> will follow the link to the `id` of the content area you specify
