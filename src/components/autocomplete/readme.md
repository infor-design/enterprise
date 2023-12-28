---
title: Autocomplete
description: null
demo:
  embedded:
  - name: Default Autocomplete
    slug: example-index
  pages:
  - name: Ajax Autocomplete
    slug: example-ajax
  - name: Autocomplete Contains Search
    slug: example-contains
  - name: Autocomplete Keyword Search
    slug: example-keyword
  - name: Autocomplete Disable Search/Filter
    slug: example-no-filtering
  - name: Autocomplete List Templates
    slug: example-templates
test:
  pages:
  - name: Test Turkish Keyboard Works
    slug: test-turkish-filters
  - name: Test Xss is prevented
    slug: test-xss-security
---

## Code Example

This example shows how to invoke the autocomplete and its starting markup. Remember to add `autocomplete="off"` as some browsers have their own autocomplete functionality that interferes.

```html
<div class="field">
  <label for="autocomplete-default">States</label>
  <input type="text" autocomplete="off" class='autocomplete' id="autocomplete-default">
</div>

<script>
  $('#autocomplete-default').autocomplete();
</script>
```

Its also possible to use ajax to populate the auto complete when the user types. To do this use the `source` callback function. For example:

```js
 $('#autocomplete-default').autocomplete({
    source: function autocompleteAjaxSource(term, response, args) {
      $.getJSON('//localhost:4000/api/states?term=', function(data) {
        response(term, data);
      });
    },
    sourceArguments: {
      'cheese': 'cheddar',
      'strength': 'sharp'
    }
  });
```

The `sourceArguments` can be used as a flexible object that can be passed into the source method, and augmented with parameters specific to the implementation.

The data returned should be an array with a specific data structure containing `id`, `value` and `label`. For example:

```js
{ value: 'AL', label: 'Alabama', id: ‘AL’}
```

## Keyboard Shortcuts

- <kbd>Arrow Down</kbd> When closed will display the list of choices, if open will move down to the next item in the last. At the bottom it should wrap around to the top again.
- <kbd>Arrow Up</kbd> If open will move down to the previous item in the last. At the top it should wrap around to the top again.
- <kbd>Enter</kbd> selects the highlighted choice
- <kbd>Any Letter</kbd> After a typehead delay all of these choices should be shown. The focus should stay in the field for additional typing. NOTE: Only valid alpha numeric characters will open the list.
- <kbd>Escape</kbd> Closes the drop down list and restores the last value (if any)
- <kbd>Tab</kbd> Goes to the next tabbable item. If the list is open the currently highlighted one will be selected

## Testability

The autocomplete can have custom id's/automation id's that can be used for scripting. To add them use the option `attributes` to set an id on the autocomplete. This can take either an object or an array if doing several id's, and you can configure the automation id name. For example:

```js
  attributes: { name: 'id', value: args => `autocomplete-id-${args.id}` }
```

Setting the id/automation id with a string value:

```js
  attributes: { name: 'data-automation-id', value: 'my-unique-id' }
```

Setting the id/automation id with a string value:

```js
  attributes: [{ name: 'id', value: 'my-unique-id' }, { name: 'data-automation-id', value: 'my-unique-id' }]
```

If setting the id/automation id with a function, the id will be a running total of open autocomplete.