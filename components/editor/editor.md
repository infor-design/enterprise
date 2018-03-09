---
title: Editor (Rich Text)  
description: This page describes Editor (Rich Text).
---

## Configuration Options

1. Default Rich Text Editor Example [View Example]( ../components/editor/example-index)
2. Customize Buttons [View Example]( ../components/editor/example-customize-buttons)
3. Back Color Button (Experimental - Limited Browser Support) [View Example]( ../components/editor/example-with-backcolor)
4. Clickable Links with Rich Text Editor Example [View Example]( ../components/editor/example-clickable-links)
4. Rich Text Editor with Event Checking [View Example]( ../components/editor/example-with-events)

## Code Example

### Rich Text Editor

A Rich Text Editor is implemented using a content editable element with several polyfills. To make an editor all you need to do is add a field element, a label, and a div with class="editor". You should also add aria-label for better accessibility.

To save and get the data from the content editable, you should simply save and restore the markup inside the div.


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

-   aria-multiline = true is added
-   role = text box is added
-   keyboard short cuts for all keys is added
-   add label and aria-label

## Keyboard Shortcuts

-   **Tab and Shift + Tab** – Moves into and out of the edit control and toolbar
-   **Arrow Left and Right** – Moves throw the toolbar when focused.
-   **Ctrl + B** – Toggle bold on text selection
-   **Ctrl + I** – Toggle italic on text selection
-   **Ctrl + U** – Toggle underline on text selection
-   **Ctrl + Q** – Append block quote
-   **Ctrl + 3** – Header3 on text selection
-   **Ctrl + 4** – Header4 on text selection
-   **Ctrl + L** – Toggle justify left on text selection
-   **Ctrl + E** – Toggle justify center on text selection
-   **Ctrl + R** – Toggle justify right on text selection
-   **Ctrl + H** – Insert Anchor
-   **Ctrl + Shift + I** – Insert Image
-   **Ctrl + O** – Insert ordered list
-   **Ctrl + Shift + L** – Insert unordered (bullet) list
-   **Ctrl + Shift + N** – Insert ordered (number) list
-   **Ctrl + \~ (Tilde)** – Toggle source or visual
-   **Shift + Click** – (Mac FF) Opens a link in a new window
-   **Command + Click** – (Mac Chrome) Opens a link in a new window
-   **Ctrl + Click** – (PC) Opens a link in a new window


## States and Variations

-   The action buttons support standard button states (see the Action Buttons spec sheet)
-   The text area takes the same states as the individual Text Area control
-   Control can be readonly or disabled (toolbar will disappear)

## Responsive Guidelines

-   Element should resize to parent

## Upgrading from 3.X

-   Change classes from inforRIchTextEditor to editor
-   Add the label (required)
