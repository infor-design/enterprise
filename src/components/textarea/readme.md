---
title: Textarea Component
description: null
demo:
  embedded:
  - name: Main Examples
    slug: example-index
---

## Behavior Guidelines

- Textareas can either have a fixed height, in which case a vertical scrollbar appears when the content exceeds the available space, or the height can expand to accommodate the amount of text.
- Textareas should always have a minimum height of 3 text lines.

## Code Example

A Textarea is a standard css / html element. To implement a Textarea, you can insert a standard `<textarea>` element with the class `textarea`. Also be sure to create a meaningful label which is linked to the input.

You can optionally add the class `resizable` to the input to allow it to be resized.

You can optionally set a placeholder for inline text such as `type your comments here` etc.

You can optionally set a `maxlength` attribute which is the maximum number of characters that can be used. If you do this, a count will be shown below the input to assist the user.

You can optionally add `attributes`, for example id's or for configuring automation id name.

Textarea can support:

- Dirty Indicator
- Error validation
- Required Validation
- Disabled/Enabled

```html
<div class="field">
  <label for="description">Notes (resizable)</label>
  <textarea id="description" class="resizable" name="description" placeholder="Type your notes here..."></textarea>
</div>
```

```html
<div class="field">
  <label for="description-max">Notes (maxlength)</label>
  <textarea id="description-max" class="textarea" maxlength="90" name="description-max" >Line One</textarea>
</div>
```

## Implementation Tips

- Printing is supported now. To do this we need a second shadow element in the page which is shown in the print media query.

## Accessibility

- Make sure the label matches and is meaningful
- Add aria-required if required

## States and Variations

The supported states are identical to the Text Input Field.

## Responsive Guidelines

- Width is default 450px but will reduce to fit parent container

## Testability

The textarea can have custom id's/automation id's that can be used for scripting. To add them use the option `attributes` to set an id on the generated textarea. This can take either an object or an array if doing several id's, and you can configure the automation id name. For example:

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

These attributes will be attached to the textarea component root.

## Upgrading from 3.X

- Change class inforLabel to label
- Change class inforTextArea to textarea
- Note the new syntax for required.
- Be sure to wrap inside of a field div
- Instead of class required on the input you should add this class to the label, and add aria-required and data-validate
