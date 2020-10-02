---
title: Toast Component
description: Displays a given data set in a visual way. Best for showing feedback about a system process that is not related to the current view.
demo:
  embedded:
  - name: Default Configuration
    slug: example-index
  pages:
  - name: Showing Toast in all Positions
    slug: example-positions
---

## Behavior Guidelines

This component is used to read out the error messages for validation as well.

## Code Example

The toast component is a JS-based component that lets you send a quick feedback message to the user. The message will display and timeout after 6s, showing a progress bar with an option to immediately dismiss. To show a test message, call the toast function on the body element passing in the title and message content.

```javascript
$('body').toast({
  title: 'Application Offline',
  message: 'This is a Toast message'
});
```

## Accessibility

The toast component is made accessible by making an aria live region which means the attribute `aria-live="polite"` is added. Because of this, the control can actually be used to announce/read out something to a screen reader. You can do this by passing the `audible: true` setting. Because the message is polite, it will be read after the user is done with the current actions.

## Responsive Guidelines

- Will be placed in the top right corner by default.

## Testability

The toast can have custom id's/automation id's that can be used for scripting. To add them use the option `attributes` to set an id on the generated toast message. This can take either an object or an array if doing several id's, and you can configure the automation id name. For example:

Setting the id/automation id with a function, the toastIndex will be a running total of open toasts:

```js
  attributes: { name: 'id', value: args => `toast-id-${args.toastIndex}` }
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

Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.

## Upgrading from 3.X

- Replaced `inforSlideInMessage()` so rename that to `toast()`.
- Change option `messageTitle` to `title`.
- `MessageType` is not used.
- `scr-errors` is not required to be added to the DOM.
