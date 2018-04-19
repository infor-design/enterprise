---
title: Editor (Rich Text)
description: This page describes Editor (Rich Text).
demo:
  pages:
  - name: Default Rich Text Editor Example
    slug: example-index
  - name: Customize Buttons
    slug: example-customize-buttons
  - name: Back Color Button (Experimental - Limited Browser Support)
    slug: example-with-backcolor
  - name: Clickable Links with Rich Text Editor Example
    slug: example-clickable-links
  - name: Rich Text Editor with Event Checking
    slug: example-with-events
---

A Rich Text Editor is implemented using a `contenteditable` element with several polyfills. To make an editor all you need to do is add a `field` class to an element, a `label` class, and a `<div>` with the class `editor`. You should also add `aria-label` for better accessibility.

The editor can be `readonly` or `disabled` and the toolbar will disappear appropriately.

To save and get the data from the `contenteditable` element, you should simply save and restore the markup inside the `<div>`.

```html
<div class="field">
  <span class="label">Comments</span>
  <div class="editor" role="textbox" aria-multiline="true" aria-label="Comments - Type To Replace Existing Content">
    <p>Embrace <a href="http://en.wikipedia.org/wiki/e-commerce">e-commerce action-items</a>, reintermediate, ecologies paradigms wireless share life-hacks create innovative harness. Evolve solutions rich-clientAPIs synergies harness relationships virtual vertical facilitate end-to-end, wireless, evolve synergistic synergies.</p>
    <p>Cross-platform, evolve, ROI scale cultivate eyeballs addelivery, e-services content cross-platform leverage extensible viral incentivize integrateAJAX-enabled sticky evolve magnetic cultivate leverage; cutting-edge. Innovate, end-to-end podcasting, whiteboard streamline e-business social; compelling, "cross-media exploit infomediaries innovative integrate integrateAJAX-enabled." Killer interactive reinvent, cultivate widgets leverage morph.</p>
  </div>
</div>
```

## Accessibility

-   Use `aria-multiline="true"`
-   Use `role="textbox`
-   Keyboard shortcuts for all keys are used
-   Add `label` and `aria-label`

## Keyboard Shortcuts

-   <kbd>Tab</kbd> and <kbd>Shift + Tab</kbd> – Moves into and out of the edit control and toolbar
-   <kbd>Left</kbd> and <kbd>Right</kbd> arrow – Moves throw the toolbar when focused
-   <kbd>Ctrl + B</kbd> – Toggle bold on text selection
-   <kbd>Ctrl + I</kbd> – Toggle italic on text selection
-   <kbd>Ctrl + U</kbd> – Toggle underline on text selection
-   <kbd>Ctrl + Q</kbd> – Append block quote
-   <kbd>Ctrl + 3</kbd> – Header 3 on text selection
-   <kbd>Ctrl + 4</kbd> – Header 4 on text selection
-   <kbd>Ctrl + L</kbd> – Toggle justify left on text selection
-   <kbd>Ctrl + E</kbd> – Toggle justify center on text selection
-   <kbd>Ctrl + R</kbd> – Toggle justify right on text selection
-   <kbd>Ctrl + H</kbd> – Insert Anchor
-   <kbd>Ctrl + Shift + I</kbd> – Insert Image
-   <kbd>Ctrl + O</kbd> – Insert ordered list
-   <kbd>Ctrl + Shift + L</kbd> – Insert unordered (bullet) list
-   <kbd>Ctrl + Shift + N</kbd> – Insert ordered (number) list
-   <kbd>Ctrl + ~ (Tilde)</kbd> – Toggle source or visual
-   <kbd>Shift + Click</kbd> – (Mac Firefox) Opens a link in a new window
-   <kbd>Command + Click</kbd> – (Mac Chrome) Opens a link in a new window
-   <kbd>Ctrl + Click</kbd> – (PC) Opens a link in a new window

## Responsive Guidelines

-   Element should resize to parent

## Upgrading from 3.X

-   Change classes from `inforRIchTextEditor` to `editor`
-   Add the `label` class (required)
