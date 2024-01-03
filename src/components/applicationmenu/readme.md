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
  - name: Resizable Application Menu
    slug: example-resizable-menu
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
  </nav>
```

In another place (usually the header toolbar) you should have a button with the `application-menu-trigger` class that is linked view the `triggers` option connected to the application menu.

```javascript
<div class="toolbar">
  <div class="title">
    <button class="btn-icon application-menu-trigger" type="button">
      <span class="audible">Show navigation</span>
      <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
        <use href="#icon-menu"></use>
      </svg>
    </button>

    <h1>
      <span>App Menu Example</span>
    </h1>

  </div>

  <div class="buttonset">
  </div
</div>
```

It is also possible to include a logo for customer branding in the app menu this can be included at the bottom.

```html
  <div class="branding">
    <svg class="icon" viewBox="0 0 34 34" focusable="false" aria-hidden="true" role="presentation">
      <use href="#customer-logo"></use>
    </svg>
  </div>
</nav>
```

You can do resizing via activating the `resizable` settings. It will wrapped the application menu to a parent `resize-app-menu-container` class, and the page container/s including the tab panel container to a `resize-page-container` class to have a proper structure for flex. You can also use to save the last position of the application menu using `savePosition` settings.

```javascript
<nav id="application-menu" class="application-menu is-personalizable" data-options='{ "filterable": true, "dismissOnClickMobile": true, "resizable": true, "savePosition": true}'>

    <div class="flex-wrapper">
      <div class="application-menu-header expandable-area-header">
        <img src="{{basepath}}/images/11.jpg" class="icon avatar" alt="Photo of Richard Fairbanks"/>
        <button type="button" class="btn application-menu-switcher-trigger expandable-area-trigger" id="trigger-btn">
          <span>Employee</span>
          <svg class="icon icon-closed" focusable="false" aria-hidden="true" role="presentation">
            <use href="#icon-caret-down"></use>
          </svg>
          <svg class="icon icon-opened" focusable="false" aria-hidden="true" role="presentation">
            <use href="#icon-caret-up"></use>
          </svg>
        </button>
        <div class="expandable-area">
          <div class="expandable-pane application-menu-switcher-panel">
            <div class="content">
              <div class="accordion panel inverse">
                <div class="accordion-header">
                  <a href="#"><span>Manager</span></a>
                </div>
                <div class="accordion-header is-selected">
                  <a href="#"><span>Recruiter</span></a>
                </div>
                <div class="accordion-header">
                  <a href="#"><span>Admin</span></a>
                </div>
                <div class="accordion-header">
                  <a href="#"><span>Example Role Thats Really Really Long So Long that it flows down, its just really long, way too long?</span></a>
                </div>
                <div class="accordion-header">
                  <a href="#"><span>Example Role</span></a>
                </div>
                <div class="accordion-header">
                  <a href="#"><span>Example Role</span></a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <span class="name-xl">Richard <br /> Fairbanks</span>
        <div class="application-menu-toolbar">
          <div class="flex-toolbar">
            <div class="toolbar-section buttonset center-text">
              <button class="btn-icon" title="Download My Profile">
                <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
                  <use href="#icon-download"></use>
                </svg>
                <span class="audible">Download</span>
              </button>
              <button class="btn-icon" title="Print My Profile">
                <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
                  <use href="#icon-print"></use>
                </svg>
                <span class="audible">Print</span>
              </button>
              <button class="btn-icon" title="Show Purchasing Info">
                <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
                  <use href="#icon-purchasing"></use>
                </svg>
                <span class="audible">Purchasing</span>
              </button>
              <button class="btn-icon" title="Show Notification Info">
                <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
                  <use href="#icon-notification"></use>
                </svg>
                <span class="audible">Notification</span>
              </button>
              <button class="btn-icon" title="Show Inventory Info">
                <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
                  <use href="#icon-inventory"></use>
                </svg>
                <span class="audible">Inventory</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="application-menu-content">
      <div class="searchfield-wrapper">
        <label class="audible" for="application-menu-searchfield">Search</label>
        <input id="application-menu-searchfield" class="searchfield" data-options='{ "clearable": true }' placeholder="Look up menu items"/>
      </div>

      <div class="accordion panel inverse" data-options="{'allowOnePane': false, 'expanderDisplay': 'plusminus'}" >
        <div class="accordion-header">
          <a href="#"><span>Home</span></a>
        </div>
        <div class="accordion-header">
          <a href="#"><span>Profile</span></a>
        </div>
        <div class="accordion-header">
          <a href="#"><span>Pay</span></a>
        </div>
        <div class="accordion-header">
          <a href="#"><span>Benefits</span></a>
        </div>
        <div class="accordion-header">
          <a href="#"><span>Time Off</span></a>
        </div>
        <div class="accordion-header">
          <a href="#"><span>Growth</span></a>
        </div>
        <div class="accordion-header">
          <a href="#"><span>Engagements</span></a>
        </div>
        <div class="accordion-header">
          <a href="#"><span>First Level Menu Item for Resizable Application Menu</span></a>
        </div>
        <div class="accordion-pane">
          <div class="accordion-header">
            <a href="#"><span>Second Level Menu Item for Resizable Application Menu</span></a>
          </div>
          <div class="accordion-pane">
            <div class="accordion-header">
              <a href="#"><span>Third Level Menu Item for Resizable Application Menu</span></a>
            </div>
            <div class="accordion-pane">
              <div class="accordion-header">
                <a href="#"><span>Fourth Level Menu Item for Resizable Application Menu</span></a>
              </div>
              <div class="accordion-pane">
                <div class="accordion-header">
                  <a href="#"><span>Fifth Level Menu Item for Resizable Application Menu</span></a>
                </div>
                <div class="accordion-pane">
                  <div class="accordion-header is-expanded">
                    <a href="#"><span>Sixth Level Menu Item for Resizable Application Menu</span></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="accordion-header">
            <a href="#"><span>Second Level Menu Item for Resizable Application Menu</span></a>
          </div>
          <div class="accordion-pane">
            <div class="accordion-header">
              <a href="#"><span>Third Level Menu Item for Resizable Application Menu</span></a>
            </div>
            <div class="accordion-pane">
              <div class="accordion-header">
                <a href="#"><span>Fourth Level Menu Item for Resizable Application Menu</span></a>
              </div>
              <div class="accordion-pane">
                <div class="accordion-header">
                  <a href="#"><span>Fifth Level Menu Item for Resizable Application Menu</span></a>
                </div>
                <div class="accordion-pane">
                  <div class="accordion-header is-expanded">
                    <a href="#"><span>Sixth Level Menu Item for Resizable Application Menu</span></a>
                  </div>
                </div>
                <div class="accordion-header">
                  <a href="#"><span>Fifth Level Menu Item for Resizable Application Menu</span></a>
                </div>
              </div>
              <div class="accordion-header">
                <a href="#"><span>Fourth Level Menu Item for Resizable Application Menu</span></a>
              </div>
            </div>
            <div class="accordion-header">
              <a href="#"><span>Third Level Menu Item for Resizable Application Menu</span></a>
            </div>
          </div>
          <div class="accordion-header">
            <a href="#"><span>Second Level Menu Item for Resizable Application Menu</span></a>
          </div>
        </div>
        <div class="accordion-header">
          <a href="#"><span>The Next Level One Menu Item for Resizable Application Menu</span></a>
        </div>
        <div class="accordion-pane">
          <div class="accordion-header">
            <a href="#"><span>Second Level Menu Item for Resizable Application Menu</span></a>
          </div>
        </div>
        <div class="accordion-header">
          <a href="#"><span>Proxy</span></a>
        </div>
      </div>
    </div>

    <div class="application-menu-footer">
      <div class="application-menu-toolbar">
        <div class="flex-toolbar">
          <div class="toolbar-section buttonset">
            <button class="btn" type="button" title="Show Settings">
              <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
                <use href="#icon-settings"></use>
              </svg>
              <span>Settings</span>
            </button>
            <button class="btn-icon" type="button" title="Proxy as user">
              <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
                <use href="#icon-employee-directory"></use>
              </svg>
              <span class="audible">Proxy as user</span>
            </button>
            <button class="btn-icon" type="button" title="About this App">
              <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
                <use href="#icon-info-linear"></use>
              </svg>
              <span class="audible">About this App</span>
            </button>
            <button class="btn-icon" type="button" title="Log Out">
              <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
                <use href="#icon-logout"></use>
              </svg>
              <span class="audible">Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>

  </nav>

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

For Application Menus that contain a Searchfield, defer to the [Searchfield component's testability guidelines](https://design.infor.com/components/components/search-field/#testability) for the required elements inside the Searchfield wrapper.

For Application Menus that contain user information, personalized role switching, etc., ensure the following:

- All Buttons follow the [Button component's testability guidelines](https://design.infor.com/code/ids-enterprise/latest/button#testability).
- All Toolbars are implemented using the Flex Toolbar component, and follow the [Flex Toolbar component's testability guidelines](https://design.infor.com/components/components/toolbar-flex/#testability).

## Keyboard Shortcuts

In IDS Enterprise Controls, the following keyboard shortcuts are implemented in the Application Menu

- When pressing <kbd>Enter</kbd> while focused on an Application Menu Trigger, the Application Menu will be toggled open/closed.
- When pressing <kbd>Escape</kbd> while the Application Menu is opened, the Application Menu will close and (if applicable) the Trigger Button that originally caused the Application Menu to open will be re-focused.
- Pressing <kbd>F10</kbd> will toggle the menu open or closed, depending on the current state.

In all other cases, the Application Menu uses a IDS Enterprise [Accordion Control](../accordion/readme.md) internally, and will utilize its keyboard shortcuts when focus lies inside of the menu.

## States and Variations

Different components of the menu have different requirements.

- The App menu can have a filter
- The App menu can have a role switcher
- The App menu can have high level toolbar functions
- The menu "box" should behave like other overlays or panels in responsive mode
- The hierarchical structure should support the same states as a standard tree (specifically, open and closed).
- The individual objects (links) in the menu should support the same states (hover, focus, selected) as the context menu.
