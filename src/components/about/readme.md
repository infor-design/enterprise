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

You can add custom id's/automation id's to the about dialog that can be used for scripting using the `attributes` setting. This setting takes either an object or an array for setting multiple values such as an automation-id or other attributes. For example:

```js
  attributes: { name: 'id', value: args => `message-id-${args.id}` }
```

Setting the id/automation id with a string value:

```js
  attributes: { name: 'data-automation-id', value: 'my-unique-id' }
```

Setting the id/automation id with a string value:

```js
  attributes: [{ name: 'id', value: 'my-unique-id' }, { name: 'data-automation-id', value: 'my-unique-id' }]
```

If you set the attributes on the about dialog, you will get an ID added to the root of the dialog. Also the close button will get an id with `-btn-close` appended after the id provided.

## Keyboard Shortcuts

- <kbd>Esc</kbd>: If pressed while open will close the about component and return focus to the triggering element

## Upgrading from 3.X

- Replace `.inforAboutDialog()` with `.about()`
- Many of the names of the settings (e.g. `productName` to `appName`) to have changed so must be updated to the new settings.
