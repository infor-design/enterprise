---
title: Contextual Action Panel
description: null
demo:
  embedded:
  - name: Default CAP Example
    slug: example-index
  pages:
  - name: CAP using jQuery Object for Content
    slug: example-jquery
  - name: CAP using Inline Markup for Content
    slug: example-markup
  - name: CAP example triggering on adjacent content
    slug: example-trigger
  - name: Destroy Test
    slug: test-destroy
  - name: Launching From a Menu
    slug: test-from-menu
  - name: IFrame for Contents
    slug: test-iframe
  - name: Open on Grid Rows
    slug: test-trigger-immediate
  - name: Search Field / Keyboard Test
    slug: test-searchfield
test:
  pages:
    - name: Toolbar Alignment Test
      slug: test-alignment
---

## Code Example

This example shows how to invoke a contextual action panel and pass in the content for the body. The `buttons` option lets you customize the contextual action panel's toolbar and functions. For best cleanup of memory its recommended to either add an id to the modalSettings option(`modalSettings.id`) or within the content property, the main div should have an ID `<div id="panel-1" style="display: none;">`. If not a unique one will be assigned and you should cleanup and destroy the CAP when done in that case because the component is not able to track open CAPs and reuse the same objects.

It will still work without if but you may need to call CAP destroy or destroyAll to further clean memory up.

```javascript
$('body').contextualactionpanel({
  title: 'Expenses: $50,000.00',
  content: $('#panel-2'),
  trigger: 'immediate',
  modalSettings: {
    trigger: 'immediate',
    id: 'cap-2',
    buttons: [
    {
      text: 'Close',
      cssClass: 'btn',
      icon: '#icon-close',
      click: function() {
        var api = $(this).data('modal');
        api.close();
      }
    }
  ]
  }
});
```

## Keyboard Shortcuts

The contextual action panel inherits the following keystrokes from other controls:

- <kbd>Escape</kbd> closes the contextual action panel
- When focused on elements inside the toolbar at the top of the contextual action panel, all [toolbar](./toolbar) keystrokes take effect
- <kbd>Tab</kbd> should never tab off of the contextual action panel

## Responsive Guidelines

The contextual action panel responds similarly to a [modal](./modal), in that it will resize and center itself horizontally and vertically in the browser window, never fitting beyond 80% width and height of the window

## Upgrading from 3.X

- Did not exist in 3.X, but any complex modals should be changed to use this.

## Testability

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.
