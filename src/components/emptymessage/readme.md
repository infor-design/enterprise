---
title: Empty Message
description: null
demo:
  embedded:
  - name: Simple Empty Message
    slug: example-index
  pages:
  - name: All Types of Empty Messages in a Card/Widget
    slug: example-widgets
---

## Code Example

### Invoking as a JS Component

Use an empty message when no data is present in a list or container and there is no other context to provide the user information about what to do. On smaller breakpoints, the empty message will be centered in the container.

```javascript
$('.empty-message').emptymessage({
  title: 'No Data Available',
  icon: 'icon-empty-search-data',
  attributes: [
    { name: 'id', value: 'empty-message-automation-1' },
    { name: 'data-automation-id', value: 'automation-id-emptymessage-1' }
  ]
});
```

### Invoking with Html/Css in a Card/Widget

You can invoke an empty message manually by adding it in a widget container. This is shown in the <a href="https://design.infor.com/code/ids-enterprise/latest/demo/emptymessage/example-widgets?font=source-sans" target="_blank">example page for widgets</a>. The following structure and classes may be used.

```html
<div class="card-content">
  <div class="card-empty-icon">
    <svg class="icon-empty-state" focusable="false" aria-hidden="true" role="presentation">
      <use href="#icon-empty-new-project"></use>
    </svg>
  </div>
  <div class="card-empty-title">
    Add a New Project
  </div>
  <div class="card-empty-info">
    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do siusmod temp.
  </div>
  <div class="card-empty-actions">
    <button type="button" class="btn-primary">
      <span>Start</span>
    </button>
  </div>
</div>
```

## Available Icons

The following icons are available:

- icon-empty-error-loading - Shows an icon with broken gears indicating a process problem
- icon-empty-generic - Shows an question mark for a generic issue
- icon-empty-new-project - Shows a folder with an add button for suggestion to add something new
- icon-empty-no-alerts - For indicating no new alerts
- icon-empty-no-analytics - For indicating no new analytics
- icon-empty-no-budget - Shows a piggy bank icon with a question mark indicating no budgets or money assigned
- icon-empty-no-data - Shows a database icon with a question mark indicating a situation of no data found
- icon-empty-no-events - Shows a calendar icon with a question mark indicating a situation of no events or dates found
- icon-empty-no-notes - Shows a notepad icon with a question mark indicating a situation of no notes or comments
- icon-empty-no-orders - Shows a file folder icon with a question mark indicating a situation of no orders or some similar missing object
- icon-empty-no-tasks - Shows a checklist icon with a question mark indicating a situation of no tasks or some similar missing object
- icon-empty-no-users - Shows a users icon with a question mark indicating a situation of no users
- icon-empty-search-data - Shows a database icon with a search icon suggestion to search for something

## Accessibility

- Do not use an icon alone, there should be text as well for screen reader users.

## Testability

The emptymessage can have custom id's/automation id's that can be used for scripting. To add them use the option `attributes` to set an id on the generated message. This can take either an object or an array if doing several id's, and you can configure the automation id name. For example:

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

These attributes will be attached to the emptymessage root and in button components. The button will also get the same id and will append `-btn` in the id value.

Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.

## Keyboard Shortcuts

- None - But screen readers can navigate the text.

## Upgrading from 3.X

- This is a new concept
