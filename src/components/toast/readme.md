---
title: Toast Component
description: Toasts are used to display confirmations of success, failure, or other statuses of system processes related to a user’s workflow. If a user submits a form, a toast will confirm the successful or unsuccessful completion of that submission. Toasts are dismissible via the “close” icon or the escape key. If not dismissed, the toast will hide after a configurable amount of time.
demo:
  embedded:
  - name: Default Configuration
    slug: example-index
  pages:
  - name: Showing Toast in all Positions
    slug: test-positions
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

You can add custom id's/automation id's to the toast that can be used for scripting using the `attributes` setting. This setting takes either an object or an array for setting multiple values such as an automation-id or other attributes. For example:

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

## Upgrading from 3.X

- Replaced `inforSlideInMessage()` so rename that to `toast()`.
- Change option `messageTitle` to `title`.
- `MessageType` is not used.
- `scr-errors` is not required to be added to the DOM.
