---
title: List Filter
description: This page describes List Filter.
demo:
  pages:
  - name: Multiselect Filter Types
    slug: test-filter-types
---

## Code Example

This is a component behavior used on [listview]( ./listview), [dropdown]( ./dropdown) and [multiselect]( ./multiselect) components. However, its API may be useful in applications for filtering elements.

```javascript
// Make a List filter object
this.listfilter = new ListFilter({
  filterMode: 'contains'
});

// Return the reselts based on a term
var term = 'search for me';
results = this.listfilter.filter(list, term);

```
