---
title: Tree Component
description: null
demo:
  embedded:
  - name: Common Configuration
    slug: example-index
  pages:
  - name: Add Node
    slug: test-add-node
  - name: Ajax
    slug: example-ajax
  - name: Badges
    slug: example-badges
  - name: Context Menu
    slug: example-context-menu
  - name: Custom Folders
    slug: example-custom-folders
  - name: Disable nodes
    slug: example-disable
  - name: Enable nodes
    slug: example-enable
  - name: Select By Id
    slug: test-select-by-id
  - name: Select Multiple
    slug: example-select-multiple
  - name: Sortable
    slug: example-sortable
  - name: Preserve and Restore Tree
    slug: test-preserve-restore
  - name: Using Plus and Minus for Folders
    slug: example-plus-minus-folders
---

## Testability

You can add custom id's/automation id's to the tree that can be used for scripting using the `attributes` data attribute. This data attribute can be either an object or an array for setting multiple values such as an automation-id or other attributes. For example:

Setting the id/automation id with a string value or function. The function will give you the data as a parameter for making things more dynamic.

```html
<li><a id="about-us" href="#" data-automation-attributes="{'attributes': [{'name': 'data-automation-id', 'value': 'tree-multiselect-exp1-about-us'}]}">About Us</a></li>
```

```js
var data = [{
 "text": "Node One",
 "extra": "test 1",
 "attributes": [{
   "name": "data-automation-id",
   "value": "tree-ajax-exp1-node1"
 }]
}, {
 "text": "Node Two",
 "open": false,
 "children": [],
 "extra": "test 2",
 "attributes": [{
   "name": "data-automation-id",
   "value": "tree-ajax-exp1-node2"
 }]
}];
$('#json-tree').tree({dataset: data});
```

Providing the data this will add an ID added to each link with `-tree-link`, link-text with `-tree-link-text`, icon with `-tree-icon`, expand target icon with `-tree-icon-expand-target` and checkbox with `-tree-checkbox` appended after it.

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for general information.
