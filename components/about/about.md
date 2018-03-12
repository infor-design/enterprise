---
title: About
description: This page describes About.
---

## Configuration Options

1. Default About Example [View Example]( ../components/about/example-index)
2. Close Event Demo [View Example]( ../components/about/test-close-event)

## Code Example

This example shows how to invoke the about dialog on demand, passing in some content, version info and the product name and product line.

```javascript
$('body').about({
  appName: 'My App Name',
  productName: 'My Product line',
  version: 'ver. 1.0.0',
  content: '<p>Fashionable application for fashionable customers.</p>'
});


```

## Accessibility

-   [Modal](../components/modal) guidelines apply as this is essentially a specific modal dialog.

## Code Tips

The about component example by default adds the current year's copyright, and useful browser info. This should be useful info for support situations. Don't make your contents of the modal too overloaded with info. Also About dialogs do not need to be overly prominent in your application (for example as a splash screen). The typical placement is in a top level actions button menu item.

## Keyboard Shortcuts

-   **Esc:** If pressed while open will close the about component and return focus to the triggering element

## Upgrading from 3.X

-   Replace .inforAboutDialog() with .about()
-   Many of the names of the settings (fx productName -> appName) to have changed map them to the new settings.
