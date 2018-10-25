---
title: List Filter
description: null
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

## Testability

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.
