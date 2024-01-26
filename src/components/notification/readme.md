---
title: Notification
description: The notification banner is a dismissible alert that sits at the top of the page. It has alert colors, an optional link, and a dismiss button.
demo:
  embedded:
  - name: Showing a notification
    slug: example-index
  - name: No link
    slug: example-no-link
---

## Code Example

The notification component is a component that inserts a banner at the top of the page for showing user-dismissible alerts and messages. Its contents will be removed when the banner is closed. You have control over the message contents including the option for a link. The message is triggered by selecting the parent content (usually `<body>`) and executing the `notification()` function with various options to create the notification banner.

```javascript
  $('body').notification({
    type: 'info',
    message: 'DTO rejected by your manager for Sept 30, 2018.',
    link: '#',
    linkText: 'Click to view',
    attributes: [
      { name: 'id', value: 'notification-id-1'},
      { name: 'data-automation-id', value: 'notification-automation-id-1' }
    ]
  });
```

## Accessibility

- TODO: We should add aria-alerts similar to the way toast works.

## Testability

The notification can have custom id's/automation id's that can be used for scripting. To add them, use the option `attributes` to set an id on the generated notification. This can take either an object or an array if doing several id's, and you can configure the automation id name. For example:

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

Providing the data, this will add an ID added to each notification icon with `-icon`, notification text with `-text`, notification link with `-link`, button notification close with `-btn-close`, notification icon close with `-icon-close` and to the root notification element appended.

## Upgrading from 3.X

- This component is comparable to the inforSlideInDialog in 3.X
