---
title: Drag Behavior
description: null
demo:
  embedded:
  - name: Basic Drag Examples
    slug: example-index
---

## Code Example

The drag component is used internally in all components but its API my be useful for other situations. This basic example makes an element draggable and wont allow it to be dragged out of its direct parent.

```javascript
$(draggableThing).drag({containment: 'parent'});
```

## Accessibility

Dragging is NOT accessible. Try to provide alternate keyboard friendly ways to do the equivalent functionality.

## Keyboard Shortcuts

None.

## Upgrading from 3.X

The 3.X project had two drag components. This replaces both.
