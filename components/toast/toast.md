# Toast Component [Learn More](https://soho.infor.com/index.php?p=component/toast-messages)

The Toast Component displays important messages in an area that sits above your application screen.

{{api-details}}

## Configuration Options

1. [Common Configuration](/components/toast/example-index)
1. [Demo of all Positions](/components/toast/example-positions)

## Behavior Guidelines

- This component is used to read out the error messages for validation as well

## Code Example

The Toast component is a JS-based component that lets you send a quick feedback message to the user. The message will display and timeout after 6s, showing a progress bar with an option to immediately dismiss. To show a test message, call the toast function on the body element passing in the title and message content.

```javascript

//Show a Visual Toast Message
$('body').toast({
  title: 'Application Offline',
  message: 'This is a Toast message'
});


```

## Accessibility

- The Toast Component is made accessible by making an aria live region which means the attribute `aria-live="polite"` is added. Because of this, the control can actually be used to announce/read out something to a screen reader. You can do this by passing the `audible: true` setting. Because the message is polite, it will be read after the user is done with the current actions.

## Keyboard Shortcuts

- None

## Responsive Guidelines

- Will be placed in the top corner by default.

## Upgrading from 3.X

- Replaced `inforSlideInMessage()` so rename that to `toast()`.
- Change option `messageTitle` to `title`.
- `MessageType` is not used.
- `scr-errors` is not required to be added to the DOM.
