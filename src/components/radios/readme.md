---
title: Radio Buttons
description: Displays one or more selectable values. A user can select exactly one value at a time. Best used when all possible options should be clearly visible to a user.
demo:
  embedded:
  - name: Radio Button Example
    slug: example-index
  pages:
  - name: Horizontal Radio Button Example
    slug: example-horizontal
  - name: Dirty Flag
    slug: test-dirty
  - name: Validation
    slug: test-validation
---

## Code Example

Displays one or more selectable values. A user can select exactly one value at a time. Best used when all possible options should be clearly visible to a user.

```html
<fieldset class="radio-group">
  <legend>Select delivery method</legend>
  <input type="radio" class="radio" name="options" id="option1" data-automation-id="option1-automation" value="option1" />
  <label for="option1" class="radio-label">Option one</label>
  <br/>
  <input type="radio" class="radio" name="options" id="option2" data-automation-id="option2-automation" value="option1" checked="true" />
  <label for="option2"  class="radio-label">Option two</label>
  <br/>
  <input type="radio" class="radio" name="options" id="option3" data-automation-id="option3-automation" value="option3" />
  <label for="option3" class="radio-label">Option three</label>
  <br/>
  <input type="radio" class="radio" name="options" id="option4" data-automation-id="option4-automation" value="delivery" disabled="true" />
  <label for="option4" class="radio-label">Option four</label>
</fieldset>
```

## Testability

You can add custom id's/automation id's to the radio component in the input markup inline. For this reason there is no `attributes` setting like some other components.

Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details on automation id's.

## Implementation Tips

- Radio button is a css only component so anything you find on the web about radios can be used.

## Accessibility

- Should work like a standard html radio button
- Make sure you have a label that matches the id of your input.

## Keyboard Shortcuts

- <kbd>Tab</kbd> Will enter the radio group
- <kbd>Shit + Tab</kbd> Will exit the radio group
- <kbd>Down/Right</kbd> Changes the select to the next/previous element.
- <kbd>Up/Left</kbd> Changes the select to the next/previous element.
- <kbd>Space bar</kbd> Can work to select with limitations.

## States and Variations

- Enabled
- Disabled
- Checked
- Error
- Dirty

## Responsive Guidelines

- Smaller than mobile size so should fit in the responsive grid except for exceptionally long text which will wrap.

## Upgrading from 3.X

- Has updated markup and validation has changes.
