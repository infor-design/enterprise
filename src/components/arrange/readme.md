---
title: Arrange
description: null
demo:
  embedded:
  - name: Main Example
    slug: example-index
---

## Code Example

The arrange util is an internally used plugin thats used on components like the swaplist and datagrid row reorder. It is included and documented as it could be reused in certain situations.

```javascript
element.arrange({
    placeholder: '<tr class="datagrid-reorder-placeholder"><td colspan="'+ this.visibleColumns().length +'"></td></tr>',
    handle: '.reorder-icon'
})
.on('beforearrange.datagrid', function(e, status) {
    if (self.isSafari) {
    status.start.css({'display': 'inline-block'});
    }
})
.on('arrangeupdate.datagrid', function(e, status) {
    if (self.isSafari) {
    status.end.css({'display': ''});
    }
    // Move the elem in the data set
    self.settings.dataset.splice(status.endIndex, 0, self.settings.dataset.splice(status.startIndex, 1)[0]);
    // Fire an event
    self.element.trigger('rowreorder', [status]);
});
```

## Accessibility

- Not implemented. This is not the most accessible functionality. Ideally you would provide a alternate method for doing the action. For example for the grid we would add an "order" column where the user can edit the order by typing not just dragging.

## Keyboard Shortcuts

- Not implemented.
