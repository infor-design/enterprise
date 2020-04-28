---
title: About
description: null
demo:
  embedded:
  - name: Default About Example
    slug: example-index
---

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

- `aria-describedby` The component auto renders an `aria-describedby` attribute which is necessary for setting the static text that is to be announced for the dialog static content.

## Code Tips

The about component example by default adds the current year's copyright, and useful browser info. This should be useful info for support situations. Don't make your contents of the modal too overloaded with info. Also About dialogs do not need to be overly prominent in your application (for example as a splash screen). The typical placement is in a top level actions button menu item.

## Testability

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.

## Keyboard Shortcuts

- <kbd>Esc</kbd>: If pressed while open will close the about component and return focus to the triggering element

## Upgrading from 3.X

- Replace `.inforAboutDialog()` with `.about()`
- Many of the names of the settings (e.g. `productName` to `appName`) to have changed so must be updated to the new settings.
