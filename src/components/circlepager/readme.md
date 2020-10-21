---
title: Circle Pager
description: null
demo:
  embedded:
  - name: Default Circle Pager Example
    slug: example-index
  pages:
  - name: Circle Pager on a Form
    slug: example-form
  - name: Circle Pager on a Tab Example
    slug: example-tabs
---
## Code Example

Use the below example markup to create a circle pager, then call `$(elem).circlepager()` to invoke. The structure of the circle pager is `<div class="circlepager">` followed by a `slide` container with one slider per "page". The page content goes inside a `slide-content` element. Make sure to have css to configure your slide content. The slides should be the same width and height.

```html
<div class="circlepager example1">
  <div class="slides">

    <div class="slide">
      <div class="slide-content">
        <p>
          <a href="#" id="hyperlink-1" class="hyperlink">Nikon 24-85mm f/2.8-4.0D IF Auto Focus Zoom</a><br/>
        $750.00
        </p>
      </div>
    </div>

    <div class="slide">
      <div class="slide-content">
        <p>
          <a href="#" id="hyperlink-2" class="hyperlink">Nikon 24-85mm f/2.8-4.0D IF Auto Focus Zoom</a><br/>
        $750.00
        </p>
      </div>
    </div>

    <div class="slide">
      <div class="slide-content">
        <p>
          <a href="#" id="hyperlink-3" class="hyperlink">Nikon 24-85mm f/2.8-4.0D IF Auto Focus Zoom</a><br/>
        $750.00
        </p>
      </div>
    </div>

  </div>
</div>
```

## Accessibility

- <a href="https://www.w3.org/WAI/tutorials/carousels/" target="_blank">Carousel</a> guidelines apply.
- Do not auto-move the carousel elements.
- User can <kbd>Tab</kbd> to the circles and activate with <kbd>Enter</kbd>.

## Testability

The circlepager can have custom id's/automation id's that can be used for scripting. To add them use the option `attributes` to set an id on the generated circlepager. This can take either an object or an array if doing several id's, and you can configure the automation id name. For example:

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

These attributes will be attached to the circlepager component root and in control buttons. The control buttons will add `-control` text and the index to get it's unique value. e.g. `automation-id-circlepager-1-control-1`.

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.

## Keyboard Shortcuts

- <kbd>Tab</kbd> to move through the pages
- <kbd>Enter</kbd> to activate a page

## Upgrading from 3.X

- Replaces `.inforCarousel()` in a more limited fashion
