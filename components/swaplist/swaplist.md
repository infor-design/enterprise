# Swaplist Component [Learn More](https://soho.infor.com/index.php?p=component/swaplist)

{{api-details}}

## Configuration options

1. [Main Swaplist Example](/components/swaplist/example-index.html)
2. [Swaplist with Selected Items](/components/swaplist/example-selected.html)

## Behavior Guidelines

- The swap list supports touch devices.

## Code Example

The swap list uses the underlying [listview component](https://soho.infor.com/index.php?p=component/basic-list). Like the listview a list template is needed. This template can either by dynamic or static. In the example below a template with a basic list value and support for drag and drop and disabled is shown in *id="swaplist-tmpl"* section.

The markup sturcture of the component itself is made up of a parent container that has an available and selected div section. Each of these has a title, buttons for moving and a div in which the list template will be generated.

Initialize the component by calling .swaplist() on the element and passing a Json Array for the available, selected sides and reference to the template. (Not the the template can also be passed here as a string instead of being in the DOM.

```html

  <script id="swaplist-tmpl" type="text/html">
      <ul data-swap-handle=".handle">
        {{#dataset}}
        {{#text}}
          <li
          {{#value}}
            data-value="{{value}}"
          {{/value}}
          {{#selected}}
            selected="selected"
          {{/selected}}
          {{#disabled}}
            class="is-disabled"
          {{/disabled}}
          >
            <span class="handle" focusable="false" aria-hidden="true" role="presentation">&#8286;</span>
            <div class="swaplist-item-content">
              <p>{{text}}</p>
            </div>
          </li>
        {{/text}}
        {{/dataset}}
      </ul>
  </script>

  <div class="row">
    <div class="columns six">

      <div class="swaplist" data-init="false" id="example-swaplist-1">
        <div class="card available">
          <div class="card-header">
            <h2 class="card-title">Available</h2>
            <div class="buttons">
              <button class="btn btn-moveto-selected" type="button">
                <span class="audible">Select</span>
                <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
                  <use xlink:href="#icon-right-arrow"></use>
                </svg>
              </button>
            </div>
          </div>
          <div class="card-content">
            <div class="listview"></div>
          </div>
        </div>
        <div class="card selected">
          <div class="card-header">
            <h2 class="card-title">Selected</h2>
            <div class="buttons">
              <button class="btn btn-moveto-left" type="button">
                <span class="audible">Move to left</span>
                <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
                  <use xlink:href="#icon-left-arrow"></use>
                </svg>
              </button>
            </div>
          </div>
          <div class="card-content">
            <div class="listview"></div>
          </div>
        </div>
      </div>

    </div>
  </div>

<script>

  // Initialize all SoHo Xi Controls and set the locale
  $(function () {

   var available = [], selected = [];

    available.push({id: 1, value: 'opt-1', text: 'Option A'});
    available.push({id: 2, value: 'opt-2', text: 'Option B'});
    available.push({id: 3, value: 'opt-3', text: 'Option C'});
    available.push({id: 4, value: 'opt-4', text: 'Option D'});
    available.push({id: 5, value: 'opt-5', text: 'Option E', disabled: true});
    available.push({id: 6, value: 'opt-6', text: 'Option F'});
    available.push({id: 7, value: 'opt-7', text: 'Option G'});
    available.push({id: 8, value: 'opt-8', text: 'Option H'});
    available.push({id: 9, value: 'opt-9', text: 'Option I'});

    selected.push({id: 10, value: 'opt-10', text: 'Option J'});
    selected.push({id: 11, value: 'opt-11', text: 'Option K'});

    $('#example-swaplist-1').swaplist({available: available, selected: selected, template: $('#swaplist-tmpl').html()});

  });
</script>


```

## Accessibility

- This component is keyboard accessible but not entirely tested for WAI-ARIA and Screen reader support.

## Keyboard Shortcuts

- **Tab** Tabs in and out of the list boxes and the between the buttons on the Toolbars and the adjacent objects.
- **Arrow up / Down** - Moves up and down the currently focused list
- **Enter/Space** - Toggles selection if a list item is focused
- **CTRL+M** - Moves the currently selected items in one list to the next list. If in the middle list focus will be on the toolbar and you can choose which ones to go to.

## States and Variations

The individual components (list boxes, move/reorganize controls) take the following stakes:

- Hover
- Focus
- Disabled (when nothing is selected to move)
- There is an edge case where the entire swap list will be disabled.

## Responsive Guidelines

-   The swap list will be 50/50 size of the parent. On smaller break points the two lists (or 3) will stack to 100%

## Upgrading from 3.X

-   Replace .inforSwapList() with .swaplist() in the js
-   The available and selected options are the same
-   You must now pass markup as a template and place the markup in the DOM
