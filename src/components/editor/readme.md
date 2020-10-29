---
title: Editor (Rich Text)
description: null
demo:
  embedded:
  - name: Default Rich Text Editor Example
    slug: example-index
  pages:
  - name: Customize Buttons
    slug: example-customize-buttons
  - name: Back Color Button (Experimental - Limited Browser Support)
    slug: example-with-backcolor
  - name: Clickable Links with Rich Text Editor Example
    slug: example-clickable-links
  - name: Rich Text Editor with Event Checking
    slug: example-with-events
  - name: Rich Text Editor with Dirty Tracking
    slug: example-dirty-tracking
---

A Rich Text Editor is implemented using a `contenteditable` element with several polyfills. To make an editor all you need to do is add a `field` class to an element, a `label` class, and a `<div>` with the class `editor`. You should also add `aria-label` for better accessibility.

The editor can be `readonly` or `disabled` and the toolbar will disappear appropriately.

To save and get the data from the `contenteditable` element, you should simply save and restore the markup inside the `<div>`.

```html
<div class="field">
  <span class="label">Comments</span>
  <div id="editor" class="editor" role="textbox" aria-multiline="true" aria-label="Comments - Type To Replace Existing Content">
    <p>Embrace <a href="http://en.wikipedia.org/wiki/e-commerce">e-commerce action-items</a>, reintermediate, ecologies paradigms wireless share life-hacks create innovative harness. Evolve solutions rich-clientAPIs synergies harness relationships virtual vertical facilitate end-to-end, wireless, evolve synergistic synergies.</p>
    <p>Cross-platform, evolve, ROI scale cultivate eyeballs addelivery, e-services content cross-platform leverage extensible viral incentivize integrateAJAX-enabled sticky evolve magnetic cultivate leverage; cutting-edge. Innovate, end-to-end podcasting, whiteboard streamline e-business social; compelling, "cross-media exploit infomediaries innovative integrate integrateAJAX-enabled." Killer interactive reinvent, cultivate widgets leverage morph.</p>
  </div>
</div>
```

## Accessibility

- Use `aria-multiline="true"`
- Use `role="textbox`
- Keyboard shortcuts for all keys are used
- Add `label` and `aria-label`

## Testability

You can add custom id's/automation id's to the rich text editor that can be used for scripting using the `attributes` data attribute. This data attribute can be either an object or an array for setting multiple values such as an automation-id or other attributes. For example:

Setting the id/automation id with a string value or function. The function will give you the data as a parameter for making things more dynamic.

```js
{
  attributes: [
    { name: 'id', value: 'example1' },
    { name: 'data-automation-id', value: 'automation-id-example1' }
  ]
}
```

Providing the data this will add an ID added to each button with `-editor-toolbar-button-{index}`, fontpicker options with `-editor-fontpicker-option-{index}`, colors in color-picker with `-editor-toolbar-colorpicker-{btnIndex}-{colorIndex}`, modal input with `-editor-modal-input{inputIndex}`, modal dropdown options with -`editor-modal-option-{itemIndex}` and modal button with `-editor-modal-button{btnIndex}` appended after it.

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for general information.

## Keyboard Shortcuts

- <kbd>Tab</kbd> and <kbd>Shift + Tab</kbd> – Moves into and out of the edit control and toolbar
- <kbd>Left</kbd> and <kbd>Right</kbd> arrow – Moves throw the toolbar when focused
- <kbd>Ctrl + B</kbd> – Toggle bold on text selection
- <kbd>Ctrl + I</kbd> – Toggle italic on text selection
- <kbd>Ctrl + U</kbd> – Toggle underline on text selection
- <kbd>Ctrl + Q</kbd> – Append block quote
- <kbd>Ctrl + 3</kbd> – Header 3 on text selection
- <kbd>Ctrl + 4</kbd> – Header 4 on text selection
- <kbd>Ctrl + L</kbd> – Toggle justify left on text selection
- <kbd>Ctrl + E</kbd> – Toggle justify center on text selection
- <kbd>Ctrl + R</kbd> – Toggle justify right on text selection
- <kbd>Ctrl + H</kbd> – Insert Anchor
- <kbd>Ctrl + Shift + I</kbd> – Insert Image
- <kbd>Ctrl + O</kbd> – Insert ordered list
- <kbd>Ctrl + Shift + L</kbd> – Insert unordered (bullet) list
- <kbd>Ctrl + Shift + N</kbd> – Insert ordered (number) list
- <kbd>Ctrl + ~ (Tilde)</kbd> – Toggle source or visual
- <kbd>Shift + Click</kbd> – (Mac Firefox) Opens a link in a new window
- <kbd>Command + Click</kbd> – (Mac Chrome) Opens a link in a new window
- <kbd>Ctrl + Click</kbd> – (PC) Opens a link in a new window

## Responsive Guidelines

- Element should resize to parent

## Upgrading from 3.X

- Change classes from `inforRIchTextEditor` to `editor`
- Add the `label` class (required)
