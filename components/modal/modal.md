---
title: Modal
description: This page describes Modal.
demo:
  pages:
  - name: Modal Example
    slug: example-index
  - name: Modal Event Handlers
    slug: example-events
  - name: Supplying Full Modal content
    slug: example-full-content
  - name: Validation (enabling buttons) Example
    slug: example-validation
---

## Code Example

### Input Dialog

To create an Input Dialog, use the modal plugin. To provide content for the modal dialog you can either append it directly in the page and access it by ID, or pass it as a string to the modal plugin. This example demonstrates both ways. You can also invoke the modal in a few ways: by linking it to a button or trigger action, or immediately on demand.

When the modal is invoked, it animates and centers itself in the page using the content provided. It will expand to the content no bigger than the page plus some padding.

Even if the user clicks outside of the dialog on the application which invoked the dialog, focus remains in the dialog.

The modal will animate from 90% to 100% and at the same time fades in.

```html
   <button class="btn" type="button" data-modal="modal-1">Add Context</button>
    <div class="modal" id="modal-1">
      <div class="modal-content">

        <div class="modal-header">
          <h1 class="modal-title" >Add Context</h1>
        </div>

        <div class="modal-body">
          <div class="field">
            <label for="context-type">Type</label>
            <select class="dropdown" id="context-type" name="type">
              <option value="1">Context #1</option>
              <option value="2">Context #2</option>
              <option value="3">Context #3</option>
              <option value="4">Context #4</option>
              <option value="5">Context #5</option>
            </select>
          </div>
          <div class="field">
            <label for="context-name" class="required">Name</label>
            <input id="context-name"  aria-required="true" data-validate="required" name="context-name" type="text">
          </div>
          <div class="field">
           <label for="context-desc" class="required">Page Title</label>
           <textarea id="context-desc" aria-required="true" data-validate="required" name="context-desc"></textarea>
          </div>

          <div class="modal-buttonset">
            <button type="button" class="btn-modal" style="width:50%">Cancel</button>
            <button type="button" class="btn-modal-primary" style="width:50%">Submit</button>
          </div>
        </div>
      </div>
    </div>

    <button class="btn" type="button" id="btn-add-comment">Add Comment</button>

```

## Accessibility

-   Ensure that `aria-labeled` by is used to point the dialog to the title of the page, this way you can get away with focusing the first field
-   Use `aria-hidden` and `display: none;` when the dialog is not visible
-   The user should not be able to tab out of the dialog back into the page
-   `aria-modal` can be added but this is a forward thinking approach, since `aria-modal` isn't actually supported by browsers yet
-   When the dialog is closed, focus should return to the element in the application which had focus before the dialog was invoked. This is usually the control which opened the dialog
-   When a modal dialog opens, focus goes to the first focusable item in the dialog. Determining the first focusable item must take into account elements which receive focus by default (form fields and links) as well as items which may have a `tabindex` attribute with a positive value. If there is no focusable item in the dialog, focus is placed on the dialog container element

## Keyboard Shortcuts

-   <kbd>Enter</kbd> will execute the primary button action
-   <kbd>Esc</kbd> will close the dialog, effectively cancelling the action
-   <kbd>Tab</kbd> As the user presses tab to move within items in the dialog, pressing tab with focus on the last focusable item in the dialog will move focus back to the first focusable item in the dialog. Focus must be held within the dialog until it is cancelled or submitted
-   <kbd>Shift + Tab</kbd> Likewise, if the user is shift-tabbing through elements in the dialog, pressing it with focus on the first focusable item in the dialog will move focus to the last item in the dialog

## Responsive Guidelines

-   Modal will resize to fit the visible area with some padding.

## Upgrading from 3.X

-   This control was added version 3.5. However the `infor` prefix is now removed in 4.0.
-   `inforMessageDialog` initialization is no longer supported. You need to use either the modal plugin or the message plugin. The message plugin is for small alert application type errors and the modal is for custom content
-   The markup for creating a modal by hand in the page has changed structurally to support the new UI
