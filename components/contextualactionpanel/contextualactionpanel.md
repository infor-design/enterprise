
# Contextual Action Panel  [Learn More](#)

## Configuration Options

1. Default CAP Example [View Example]( ../components/contextualactionpanel/example-index)
2. CAP using jquery Object for Content [View Example]( ../components/contextualactionpanel/example-jquery)
3. CAP using Inline Markup for Content [View Example]( ../components/contextualactionpanel/example-markup)
3. CAP example triggering on adjacent content [View Example]( ../components/contextualactionpanel/example-trigger)
4. Toolbar Alignment Test [View Test]( /component/scontextualactionpanel/test-alignment)
5. Destroy Test [View Test]( ../components/contextualactionpanel/test-destroy)
6. Launching From a Menu [View Test]( ../components/contextualactionpanel/test-from-menu)
7. IFrame for Contents [View Test]( ../components/contextualactionpanel/test-iframe)
8. Open on Grid Rows [View Test]( ../components/contextualactionpanel/test-trigger-immediate)
9. Search Field / Keyboard Test [View Test]( ../components/contextualactionpanel/test-searchfield)

{{api-details}}

## Code Example

This example shows how to invoke a Contextual Action Panel (CAP) and pass in the content for the CAP body. The buttons option lets you customize the CAP's toolbar and functions.

```javascript

$('body').contextualactionpanel({
  id: 'contextual-action-modal-id',
  title: 'Expenses: $50,000.00',
  content: '<markup>',
  trigger: 'immediate',
  buttons: [
    {
      type: 'input',
      text: 'Keyword',
      id: 'filter',
      name: 'filter',
      cssClass: 'searchfield'
    }, {
      text: 'Close',
      cssClass: 'btn',
      icon: '#icon-close'
    }
  ]
});


```

## Keyboard Shortcuts

The Contextual Action Panel inherits the following keystrokes from other controls:

-   **Escape** closes the Contextual Action Panel the same way it would close an [Input Dialog](https://soho.infor.com/index.php?p=component/input-dialog).
-   When focused on elements inside the Toolbar at the top of the Contextual Action Panel, all [Toolbar](https://soho.infor.com/index.php?p=component/toolbar) keystrokes take effect.
- **Tab** - should never tab off the Dialog

## States and Variations

-   Hidden
-   Visible

## Responsive Guidelines

The Contextual Action Panel responds similarly to an [Input Dialog](https://soho.infor.com/index.php?p=component/input-dialog), in that it will resize and center itself horizontally and vertically in the browser window, never fitting beyond 80% width and height of the window.

## Upgrading from 3.X

-   Did not exist in 3.X, but any complex Modals should be changed to use this.
