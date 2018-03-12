---
title: Skiplink Component 
description: This page describes Skiplink Component .
---

## API Details

The SkipLink Component is a CSS-Only component, and has no Javascript API. Its used by simply placing the markup in the page. When the skip link is focused from the browser url tab it will activate allowing you to jump to a different section.

For more info on skip links see https://webaim.org/techniques/skipnav/

## Configuration Details

1. Main Example [View Example](../components/skiplink/example-index)

## Code Example

Add this at the top of the page, make the href point to the id of the content area you would like to focus that would be considered the meat of the page.

```html
<a class="skip-link" href="#maincontent">Skip to Main Content</a>

```

## Accessibility

Skip links are an accessibility feature. Adding one to your page will aid users that use screen readers to navigate over familiar content at the top of the page (header area) to familiar content.

## Keyboard Shortcuts

- *Tab* From the browser bar into the page and the skip link will appear on focus.
- *Enter* Will follow the link to the id of the content area you specify.

## Upgrading from 3.X

- This is a new pattern for 4.X
