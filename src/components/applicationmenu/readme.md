---
title: Application Menu
description: A left side application menu combined with an optional trigger
demo:
  embedded:
  - name: Default About Example
    slug: example-index
  pages:
  - name: Filterable Application Menu
    slug: example-filterable
  - name: Shows the Application Menu Always open on larger breakpoints
    slug: example-open-on-large
  - name: Application Menu Can Change to Personalization Color
    slug: example-personalized
  - name: Application Menu With toolbars
    slug: example-personalized-roles
  - name: Application Menu Can Change have a role switcher
    slug: example-personalized-role-switcher
---


## Code Example

This example shows a nav element for the menu that flies out. This should be top level in the top level page container so it can slide out the whole page height.

```javascript
  <nav id="application-menu" class="application-menu is-personalizable">

    <div class="accordion panel inverse" data-options="{'allowOnePane': true}" >

      <div class="accordion-header is-selected">
        <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
          <use href="#icon-home"></use>
        </svg>
        <a href="#"><span>Item One</span></a>
      </div>

      <div class="accordion-header">
        <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
          <use href="#icon-tools"></use>
        </svg>
        <a href="#"><span>Item Two</span></a>
      </div>

      <div class="accordion-header">
        <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
          <use href="#icon-columns"></use>
        </svg>
        <a href="#"><span>Item Three</span></a>
      </div>

      <div class="accordion-header">
        <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
          <use href="#icon-cascade"></use>
        </svg>
        <a href="#"><span>Item Four</span></a>
      </div>

      <div class="accordion-header">
        <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
          <use href="#icon-insert-image"></use>
        </svg>
        <a href="#"><span>Item Five</span></a>
      </div>

      <div class="accordion-header">
        <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
          <use href="#icon-ledger"></use>
        </svg>
        <a href="#"><span>Item Six</span></a>
      </div>

    </div>

    <div class="branding">
      <svg class="icon" viewBox="0 0 34 34" focusable="false" aria-hidden="true" role="presentation">
        <use href="#icon-logo"></use>
      </svg>
    </div>
  </nav>
```

In another place (usually the header toolbar) you should have a button with the `application-menu-trigger` class that is linked view the `triggers` option connected to the application menu.

```javascript
<div class="toolbar">
  <div class="title">
    <button class="btn-icon application-menu-trigger" type="button">
      <span class="audible">Show navigation</span>
      <span class="icon app-header">
        <span class="one"></span>
        <span class="two"></span>
        <span class="three"></span>
      </span>
    </button>

    <h1>
      <span>App Menu Example</span>
    </h1>

  </div>

  <div class="buttonset">
  </div
</div>
```

## Behavior Guidelines

Users can display an Application Menu using a hamburger icon `application-menu-trigger` thats usually on a header. Or (less usual) the application menu can always display.

Within the menu itself:

- Users can open and close individual categories.
- Categories can contain multiple levels of hierarchy (although teams are strongly encouraged to limit to 3 levels).
- Multiple categories can be open at one time.
- Scrolling within the menu is supported when necessary.

## Responsive Guidelines

The menu should respond responsively as follows:

- When there is sufficient screen real estate (desktop/laptop devices) the menu is docked on the left side of the content area, with the current screen content displayed in the remaining space.
- On mobile displays, or any time the screen real estate is restricted, the menu must be manually opened and then overlays the current content. Once the user makes a selection from the menu, the system closes the menu.

## Testability

When setting up the application menu for automated testing, ensure that the inner accordion component's links and expander buttons are labelled with id's and automation id's per the [Accordion component's testability guidelines](https://design.infor.com/code/ids-enterprise/latest/accordion#testability).  The same rules apply for Role Switcher accordions.

For Application Menus that contain a Searchfield, defer to the [Searchfield component's testability guidelines](https://design.infor.com/code/ids-enterprise/latest/searchfield#testability) for the required elements inside the Searchfield wrapper.

For Application Menus that contain user information, personalized role switching, etc., ensure the following:
- All Buttons follow the [Button component's testability guidelines](https://design.infor.com/code/ids-enterprise/latest/button#testability).
- All Toolbars are implemented using the Flex Toolbar component, and follow the [Flex Toolbar component's testability guidelines](https://design.infor.com/code/ids-enterprise/latest/toolbar-flex#testability).

In general, please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.

## Keyboard Shortcuts

In IDS Enterprise Controls, the following keyboard shortcuts are implemented in the Application Menu

- When pressing <kbd>Enter</kbd> while focused on an Application Menu Trigger, the Application Menu will be toggled open/closed.
- When pressing <kbd>Escape</kbd> while the Application Menu is opened, the Application Menu will close and (if applicable) the Trigger Button that originally caused the Application Menu to open will be re-focused.
- Pressing <kbd>F10</kbd> will toggle the menu open or closed, depending on the current state.

In all other cases, the Application Menu uses a IDS Enterprise [Accordion Control](./accordion) internally, and will utilize its keyboard shortcuts when focus lies inside of the menu.

## States and Variations

Different components of the menu have different requirements.

- The App menu can have a filter
- The App menu can have a role switcher
- The App menu can have high level toolbar functions
- The menu "box" should behave like other overlays or panels in responsive mode
- The hierarchical structure should support the same states as a standard tree (specifically, open and closed).
- The individual objects (links) in the menu should support the same states (hover, focus, selected) as the context menu.
