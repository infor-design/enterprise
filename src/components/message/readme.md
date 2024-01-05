---
title: Message
description: null
demo:
  embedded:
  - name: Message Examples
    slug: example-index
---

## Code Example

The message component is a component that inserts a dialog in the page for showing modal type alerts and messages. Its contents will be removed when the dialog is closed. You have control over the message contents and buttons. The message is triggered by selecting the parent content (usually `<body>`) and executing the `message()` function with various options to create the message.

A message animates using a scale and fade in animation of 90-100% over `.2s`.

```javascript
$('body').message({
    title: 'Application Error',
    isError: true,
    message: 'This application has experienced a system error due. Please restart the application in order to proceed.',
    buttons: [{
        text: 'Restart Now',
        click: function() {
            $(this).data('modal').close();
        },
        isDefault: true
    }]
});
```

## Accessibility

- Includes `role="alertdialog"` and `aria-modal="true"`
- `aria-labelledby` points to the `title` element's ID
- `aria-describedby` points to the message text

## Testability

You can add custom id's/automation id's to the message that can be used for scripting using the `attributes` setting. This setting takes either an object or an array for setting multiple values such as an automation-id or other attributes. For example:

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

If setting the id/automation id with a function, the id will be a running total of open modals/messages.

For the message this can be set either on the root settings or in each button element. For the button elements you can also use the `id` as before or the attributes setting to set an id or automation id on the button.

If you set the attributes on the root message, you will get an ID added to the root of the message dialog. Also the message area will get an id with `-message` appended after the id given. And the main modal div will get an id `-modal` appended after the id given. And finally the h1 area will get an id with `-title` appended after the id given.

## Keyboard Shortcuts

- <kbd>Enter</kbd> should serve as the default submit action or if focus is on a button will activate that button
- <kbd>Esc</kbd> closes the dialog without taking any action
- <kbd>Tab</kbd> or <kbd>Shift Tab</kbd> move through focusable items on the dialog. For a message dialog this should be buttons

## Responsive Guidelines

- Will fit to container on smaller devices

## Upgrading from 3.X

- Very similar and compatible with newer versions of 3.X
- `dialogType` option deprecated. Instead use either modal or message component
- `shortMessage` option now called `message` because there is only one option
- buttons works the same
