---
title: Notification Badge
description: The notification badge is a component that represents large functions and data collections will utilize notification functions. It has icon, position, and colors to choose from.
demo:
  embedded:
  - name: Showing a notification badge
    slug: example-index
  - name: Notification badge placement
    slug: example-badge-placement
---

## Code Example

Notification dots will appear onto icons to communicate pending notifications. You can choose where to place the dots depending on the symbols/icons you will use. E.g `upper-left`, `upper-right`, `lower-left`, and `lower-right`. You can also choose colors from the presets namely [`alert`, `warning`, `yield`, `complete`, `progress`, `caution`]. The notification badge is triggered by selecting the an element and executing the `notificationbadge()` function with various options to create the notification badge.

```javascript
  $('#notification-badge-1').notificationbadge({
    icon: 'phone-linear',
    color: 'warning',
    position: 'upper-right',
    attributes: [
      { name: 'id', value: 'notification-badge-1' },
      { name: 'id', value: 'notification-badge-automation-id-1' }
    ]
  });
```

## Testability

The notification badge can have custom id's/automation id's that can be used for scripting. To add them, use the option `attributes` to set an id on the generated notification badge. This can take either an object or an array of doing several id's, and you can configure the automation id name. For example:

```js
  attributes: { name: 'id', value: args => `message-id-${args.id}` }
```

Setting the id/automation id with a string value:

```js
  attributes: { name: 'data-automation-id', value: 'my-unique-id' }
```

Setting id and automation id together with a string value:

```js
  attributes: [ {name: 'id', value: 'my-unique-id' }, { name: 'data-automation-id', value: 'my-unique-id' }]
```

Providing the data, this will add an ID added to each notification badge container with `-container`, notification badge icon with `-icon`, and notification dot with `-dot`.
