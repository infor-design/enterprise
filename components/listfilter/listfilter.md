
# List Filter  [Learn More](#)

## Configuration Options

1. Multiselect Filter Types [View Example]( ../components/multiselect/test-filter-types)

{{api-details}}

## Code Example

This is a component behavior used on [listview]( ../components/listview), [dropdown]( ../components/dropdown) and [multiselect]( ../components/multiselect) other components. However, its API may be useful in applications for filtering elements.

```javascript

// Make a List filter object
this.listfilter = new ListFilter({
  filterMode: 'contains'
});

// Return the reselts based on a term
var term = 'search for me';
results = this.listfilter.filter(list, term);

```
