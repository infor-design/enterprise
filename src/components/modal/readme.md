---
title: Modal
description: null
demo:
  embedded:
  - name: Modal Example
    slug: example-index
  pages:
  - name: Before Open Callback
    slug: example-before-open
  - name: Canceling the Close Event
    slug: example-cancel-close
  - name: Adding a Close Button
    slug: example-close-btn
  - name: Supplying Full Modal Content
    slug: example-full-content
  - name: Validation (enabling buttons) Example
    slug: example-validation
---

## Code Example

### Modal Dialog

To provide content for the modal dialog you can either append it directly in the page and access it by ID, or pass it as a string to the modal plugin. This example demonstrates both ways. You can invoke the modal by either by linking it to a trigger button or link or immediately.

When the modal is invoked, it animates and centers itself in the page using the content provided. It will expand to the content no bigger than the page plus some padding. This includes mobile devices.

If the user clicks outside of the dialog on the application which invoked the dialog, focus remains in the dialog.

```html
   <button id="modal" class="btn" type="button" data-modal="modal-1">Add Context</button>
    <div class="modal" id="modal-1">
      <div class="modal-content">

        <div class="modal-header">
          <h1 class="modal-title" >Add Context</h1>
        </div>

        <div class="modal-body">
          <div class="field">
            <label for="context-name" class="required">Name</label>
            <input id="context-name"  aria-required="true" data-validate="required" name="context-name" type="text">
          </div>
          <div class="field">
           <label for="context-desc" class="required">Page Title</label>
           <textarea id="context-desc" aria-required="true" data-validate="required" name="context-desc"></textarea>
          </div>

          <div class="modal-buttonset">
            <button type="button" id="cancel" class="btn-modal" style="width:50%">Cancel</button>
            <button type="button" id="submit" class="btn-modal-primary" style="width:50%">Submit</button>
          </div>
        </div>
      </div>
    </div>

    <button class="btn" type="button" id="btn-add-comment">Add Comment</button>
```

### Veto / Cancel closing the modal

In some cases you may want to cancel closing the modal. This can be done with the `beforeclose` event by returning false from it. Modals cannot not work asynchronously to return results. To get around this you can either do an action in the button clicks or on the close events of a dialog.

```javascript
$('body').modal({
  title: 'Enter Problem',
  content: $('#modal-add-context'),
  buttons: [{
    text: 'Cancel'
  }, {
    text: 'Save'
  }]
});

$('.modal').on('beforeclose', function () {
    $('body').toast({ title: 'Example Only', message: 'This Dialog May not be closed.'});
    return false;
});
```

## Accessibility

- Ensure that `aria-labeled` by is used to point the dialog to the title of the page, this way you can get away with focusing the first field
- Use `aria-hidden` and `display: none;` when the dialog is not visible
- The user should not be able to tab out of the dialog back into the page
- `aria-modal` can be added but this is a forward thinking approach, since `aria-modal` isn't actually supported by browsers yet
- When the dialog is closed, focus should return to the element in the application which had focus before the dialog was invoked. This is usually the control which opened the dialog
- When a modal dialog opens, focus goes to the first focusable item in the dialog. Determining the first focusable item must take into account elements which receive focus by default (form fields and links) as well as items which may have a `tabindex` attribute with a positive value. If there is no focusable item in the dialog, focus is placed on the dialog container element

## Testability

The modal can have custom id's/automation id's that can be used for scripting. To add them use the option `attributes` to set an id on the modal. This can take either an object or an array if doing several id's, and you can configure the automation id name. For example:

```js
  attributes: { name: 'id', value: args => `toast-id-${args.id}` }
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

For the modal, `attributes` can be set either on the root settings or in each button element. For the button elements you can also use the `id` as before or the new attributes setting to set an id or automation id on the button.

If you set the attributes on the root message, you will get an ID added to the root of the message dialog. Also the message area will get an id with `-message` appended after the id given. And the h1 area will get an id with `-title` appended after the id given. And finally the close button (if used) with get `btn-close` appended.

Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.

## Keyboard Shortcuts

- <kbd>Enter</kbd> will execute the primary button action
- <kbd>Esc</kbd> will close the dialog, effectively cancelling the action
- <kbd>Tab</kbd> As the user presses tab to move within items in the dialog, pressing tab with focus on the last focusable item in the dialog will move focus back to the first focusable item in the dialog. Focus must be held within the dialog until it is cancelled or submitted
- <kbd>Shift + Tab</kbd> Likewise, if the user is shift-tabbing through elements in the dialog, pressing it with focus on the first focusable item in the dialog will move focus to the last item in the dialog

## Responsive Guidelines

- Modal will resize to fit the visible area with some left and right padding.

## Upgrading from 3.X

- This control was added version 3.5. However the `infor` prefix is now removed in 4.0.
- `inforMessageDialog` initialization is no longer supported. You need to use either the modal plugin or the message plugin. The message plugin is for small alert application type errors and the modal is for custom content
- The markup for creating a modal by hand in the page has changed structurally to support the new UI
