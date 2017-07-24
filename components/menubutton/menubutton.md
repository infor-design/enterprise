# MenuButton Component [Learn More](#)

## Configuration Options

1. Simple Menu Button [View Example]( ../components/menubutton/example-menubutton)
2. Menu Button Events [View Example]( ../components/menubutton/example-events)
3. Submenus [View Example]( ../components/menubutton/example-submenu.htm)
4. Submenu With Icons [View Example]( ../components/menubutton/example-submenu-icons.htm)
5. RTL [View Example]( ../components/menubutton/example-submenu-icons-rtl.html?locale=ar-SA)

## Code Example

The menu button component is comprised of the [popupmenu]( ../components/popupmenu) and [button]( ../components/popupmenu) components.

Once the proper markup is in place calling `$(elem).button()` will correctly initialize a menu button.
If the arrow is missing in the markup it will be added.

The popupmenu markup follows as per the [popupmenu]( ../components/popupmenu) , menu details.

```html

<button class="btn-menu">
  <span>Normal Menu</span>
  <svg role="presentation" aria-hidden="true" focusable="false" class="icon icon-dropdown">
    <use xlink:href="#icon-dropdown"></use>
  </svg>
</button>
<ul class="popupmenu">
  <li><a href="#">Menu Option #1</a></li>
  <li><a href="#">Menu Option #2</a></li>
  <li><a href="#">Menu Option #3</a></li>
</ul>


```

## Accessibility

See [popupmenu]( ../components/popupmenu) details.

## Keyboard Shortcuts

See [popupmenu]( ../components/popupmenu) details.
