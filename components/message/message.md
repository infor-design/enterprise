---
title: Message
description: This page describes Message.
---

## Configuration Options

1. Message Examples [View Example]( ../components/message/example-index)

## Code Example

The Message component is a component that inserts a dialog in the page for showing modal type alerts and messages. Its contents will be removed when the dialog is closed. You have control over the message contents and buttons. The message is triggered by selecting the parent content (usually body) and executing the message() function with various options to create the message.

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

-   has role="alertdialog"
-   has aria-modal="true"
-   aria-labelledby points to the title element's id
-   aria-describedby points to the message text

## Keyboard Shortcuts

-   **Enter** The Enter key should serve as the default submit action or if focus is on a button will activate that button.
-   **Esc** Closes the dialog without taking any action.
-   **Tab/Shift Tab** moved through focusable items on the dialog. For a message dialog this should be buttons.

## States and Variations

-   Open
-   Closed

## Responsive Guidelines

-   Will fit to container on smaller devices

## Behavior Guidelines

-   Animates using a scale / fadein animation 90-100% over .2s

## Upgrading from 3.X

-   Very similar and compatible with newer versions of 3.X
-   dialogType option deprecated. Instead use either modal or message component
-   shortMessage option now called message because there is only one option
-   buttons works the same
