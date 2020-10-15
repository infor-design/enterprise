---
title: Contextual Action Panel
description: The Contextual Action Panel (CAP) is used for displaying entire workflows in a Modal-style setting.
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
  - name: Workspaces Pattern (See Below)
    slug: example-workspaces
  - name: Destroy Test
    slug: test-destroy
  - name: Disable a button on a CAP Toolbar
    slug: test-disable-button
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

### Interacting with the Internal Toolbar

If configured with the `useFlexToolbar: true;` setting, it's possible to get access to the Contextual Action Panel's inner [Flex Toolbar API]('./toolbar-flex'). This will allow for any toolbar-wide operations, as well as interacting with each individual item directly:

```js
// Access the toolbar API on the CAP
const capAPI = $('body').data('contextualactionpanel');
const flexToolbarAPI = capAPI.toolbarAPI;

// Disable the close button using its `FlexToolbarItem` API
flexToolbarAPI.items[0].disabled = true;
```

## Workspaces Concept

Workspaces are another term for a Contextual Action Panel that contains complex more complex workflows. The most
common use case for Workspace can be seen in a Infor Homepage where a Workspace can be triggered from a Widget. Workspaces can be used to show and collect many data points where users can perform multiple actions without the need
to launch the full application. Some of the workflow examples are editing and submitting data, and viewing additional
information on a particular data point. The option to launch the full application should be provided within the
Workspace which would take users to the specific workflow in the application. The example above shows a simple
workspace concept. This concept works best on XL-M breakpoints or Desktop and Tablet devices. The toolbar used in
Workspace demonstrates a left-aligned terminal action (usually Cancel), a center-aligned Title with optional action
 (Launch Application), and a right-aligned confirmation action (usually Submit).

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

You can add custom id's/automation id's to the contextual action panel dialog that can be used for scripting using the `modalSettings.attributes` setting. This setting takes either an object or an array for setting multiple values such as an automation-id or other attributes. For example:

```js
  modalSettings.attributes: { name: 'id', value: args => `message-id-${args.id}` }
```

Setting the id/automation id with a string value:

```js
  modalSettings.attributes: { name: 'data-automation-id', value: 'my-unique-id' }
```

Setting the id/automation id with a string value:

```js
  modalSettings.attributes: [{ name: 'id', value: 'my-unique-id' }, { name: 'data-automation-id', value: 'my-unique-id' }]
```

If you set the attributes on the contextual action panel, you will get an ID added to the root of the dialog. Also the close button will get an id with `-btn-close` appended after the id provided. Note that if you provide buttons on the toolbar you can manually set the id/automation id on the button markup for these.

Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.
