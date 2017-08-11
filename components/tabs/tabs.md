# Tabs Component [Learn More](https://soho.infor.com/index.php?p=component/tabs)

## Configuration Options

1. [Common Configuration]( ../components/tabs/example-index)
2. [Tabs With Counts]( ../components/tabs/example-counts)
3. [Dismissible Tabs]( ../components/tabs/example-dismissible-tabs)
4. [Dropdown Tabs]( ../components/tabs/example-dropdown-tabs)
5. [`updateCount()` Demo]( ../components/tabs/example-update-count-api)
6. [`changeTabOnHashChange` Setting with Callback Demo]( ../components/tabs/example-url-hash-change)

{{api-details}}

## Code Examples

### Tabs - Default Settings

The Tabs Control provides a clickable, touchable interface for accessing content that is separated between several panels. We've constructed the SoHo Xi Tabs Control with responsive design in mind, doing our best to keep the HTML markup needed very simple. The simplest way to create a Tabs Control is to create markup containing:

- A Main container `<div>` tag with a unique ID attribute and a "tab-container" CSS class.
- Inside of that, a `<ul>` tag with a "tab-list" CSS class. Each `<li>` inside the `<ul>` tag should contain an `<a>` tag with a very specific HREF attribute.
- Adjacent to the `<div>` tag, a second `<div>` tag with a "tab-panel-container" CSS class.
- Inside the `<div class="tab-panel-container">`, a series of `<div>` tags should exist that matches the number of list items in the `<ul>`. Each one should have an ID that corresponds to one of the anchor tags in the `<ul>`.

```html

  <div id="tabs-normal" class="tab-container">
    <ul class="tab-list">
      <li><a href="#tabs-normal-contracts">Contracts</a></li>
      <li><a href="#tabs-normal-opportunities">Opportunites</a></li>
      <li><a href="#tabs-normal-attachments">Attachments</a></li>
      <li><a href="#tabs-normal-contacts">Contacts</a></li>
      <li><a href="#tabs-normal-notes">Notes</a></li>
    </ul>
  </div>
  <div class="tab-panel-container">
    <div id="tabs-normal-contracts">
      <h3>Contracts</h3>
      <p>Facilitate cultivate monetize, seize e-services peer-to-peer content integrateAJAX-enabled user-centric strategize. Mindshare; repurpose integrate global addelivery leading-edge frictionless, harness real-time plug-and-play standards-compliant 24/7 enterprise strategize robust infomediaries: functionalities back-end. Killer disintermediate web-enabled ubiquitous empower relationships, solutions, metrics architectures.<p>
    </div>
    <div id="tabs-normal-opportunities">
      <h3>Opportunities</h3>
      <p>Bricks-and-clicks? Evolve ubiquitous matrix B2B 24/365 vertical 24/365 platforms standards-compliant global leverage dynamic 24/365 intuitive ROI seamless rss-capable. Cutting-edge grow morph web services leverage; ROI, unleash reinvent innovative podcasts citizen-media networking.<p>
    </div>
    <div id="tabs-normal-attachments">
      <h3>Attachments</h3>
      <p>Frictionless webservices, killer open-source innovate, best-of-breed, whiteboard interactive back-end optimize capture dynamic front-end. Initiatives ubiquitous 24/7 enhance channels B2B drive frictionless web-readiness generate recontextualize widgets applications. Sexy sticky matrix, user-centred, rich user-centric: peer-to-peer podcasting networking addelivery optimize streamline integrated proactive: granular morph.<p>
    </div>
    <div id="tabs-normal-contacts">
      <h3>Contacts</h3>
      <p>Exploit niches; enable A-list web-enabled holistic end-to-end. Exploit experiences value-added tagclouds, open-source cross-platform e-tailers, user-contributed, implement! Convergence, solutions front-end, "synergize markets initiatives integrateAJAX-enabled platforms; wireless, supply-chains reinvent, mindshare, synergies implement, drive evolve!" Post incentivize; rich-clientAPIs customized revolutionize 24/365 killer incentivize integrate intuitive utilize!<p>
    </div>
    <div id="tabs-normal-notes">
      <h3>Notes</h3>
      <p> Post incentivize; rich-clientAPIs customized revolutionize 24/365 killer incentivize integrate intuitive utilize!<p>
    </div>
  </div>


```

### Tabs - Counts Example

This is an example of what the Tabs Control looks like when you use the "tabCounts" option or "data-tab-counts" attribute. Additionally, in this example there are separator elements that break the tabs apart into visually-distinct groups.

```html

  <div id="tabs-counts" class="tab-container" data-tab-counts="true">
    <ul class="tab-list">
      <li><a href="#tabs-counts-pending">Pending</a></li>
      <li class="separator"></li>
      <li><a href="#tabs-counts-unreleased">Unreleased</a></li>
      <li><a href="#tabs-counts-notConfirmed">Not Confirmed</a></li>
      <li class="separator"></li>
      <li><a href="#tabs-counts-requests">Requests</a></li>
      <li><a href="#tabs-counts-purchaseOrders">Purchase Orders</a></li>
      <li><a href="#tabs-counts-receipts">Receipts</a></li>
      <li><a href="#tabs-counts-invoices">Invoices</a></li>
    </ul>
  </div>
  <div class="tab-panel-container">
    <div id="tabs-counts-pending">
      <h3>Pending</h3>
      <p>Facilitate cultivate monetize, seize e-services peer-to-peer content integrateAJAX-enabled user-centric strategize. Mindshare; repurpose integrate global addelivery leading-edge frictionless, harness real-time plug-and-play standards-compliant 24/7 enterprise strategize robust infomediaries: functionalities back-end. Killer disintermediate web-enabled ubiquitous empower relationships, solutions, metrics architectures.<p>
    </div>
    <div id="tabs-counts-unreleased">
      <h3>Unreleased</h3>
      <p>Bricks-and-clicks? Evolve ubiquitous matrix B2B 24/365 vertical 24/365 platforms standards-compliant global leverage dynamic 24/365 intuitive ROI seamless rss-capable. Cutting-edge grow morph web services leverage; ROI, unleash reinvent innovative podcasts citizen-media networking.<p>
    </div>
    <div id="tabs-counts-notConfirmed">
      <h3>Not Confirmed</h3>
      <p>Frictionless webservices, killer open-source innovate, best-of-breed, whiteboard interactive back-end optimize capture dynamic front-end. Initiatives ubiquitous 24/7 enhance channels B2B drive frictionless web-readiness generate recontextualize widgets applications. Sexy sticky matrix, user-centred, rich user-centric: peer-to-peer podcasting networking addelivery optimize streamline integrated proactive: granular morph.<p>
    </div>
    <div id="tabs-counts-requests">
      <h3>Requests</h3>
      <p>Exploit niches; enable A-list web-enabled holistic end-to-end. Exploit experiences value-added tagclouds, open-source cross-platform e-tailers, user-contributed, implement! Convergence, solutions front-end, "synergize markets initiatives integrateAJAX-enabled platforms; wireless, supply-chains reinvent, mindshare, synergies implement, drive evolve!" Post incentivize; rich-clientAPIs customized revolutionize 24/365 killer incentivize integrate intuitive utilize!<p>
    </div>
    <div id="tabs-counts-purchaseOrders">
      <h3>Purchase Orders</h3>
      <p>Facilitate cultivate monetize, seize e-services peer-to-peer content integrateAJAX-enabled user-centric strategize. Mindshare; repurpose integrate global addelivery leading-edge frictionless, harness real-time plug-and-play standards-compliant 24/7 enterprise strategize robust infomediaries: functionalities back-end. Killer disintermediate web-enabled ubiquitous empower relationships, solutions, metrics architectures.<p>
    </div>
    <div id="tabs-counts-receipts">
      <h3>Receipts</h3>
      <p>Bricks-and-clicks? Evolve ubiquitous matrix B2B 24/365 vertical 24/365 platforms standards-compliant global leverage dynamic 24/365 intuitive ROI seamless rss-capable. Cutting-edge grow morph web services leverage; ROI, unleash reinvent innovative podcasts citizen-media networking.<p>
    </div>
    <div id="tabs-counts-invoices">
      <h3>Invoices</h3>
      <p>Frictionless webservices, killer open-source innovate, best-of-breed, whiteboard interactive back-end optimize capture dynamic front-end. Initiatives ubiquitous 24/7 enhance channels B2B drive frictionless web-readiness generate recontextualize widgets applications. Sexy sticky matrix, user-centred, rich user-centric: peer-to-peer podcasting networking addelivery optimize streamline integrated proactive: granular morph.<p>
    </div>
  </div>


```

### Tabs - Dismissible Example

It's possible to create Tabs and Panels that are dismissible. Dismissible Tabs/Panels will be removed from the Tabs Control when their close button is clicked/tapped.

```html

      <ul class="tab-list">
        <li><a href="#firefox">Firefox</a></li>
        <li><a href="#chrome">Chrome</a></li>
        <li class="dismissible"><a href="#ie">Internet Explorer</a></li>
        <li class="dismissible"><a href="#opera">Opera</a></li>
        <li class="dismissible"><a href="#safari">Safari</a></li>
      </ul>


```

### Tabs - Dropdown Example

It's possible to create a Tab that contains a Dropdown menu. In the case of a Dropdown Tab, the top-level "Tab" does not correspond to a Tab panel, but all of its children (any of the "dropdown" options) will be linked to a panel. When the Tabs Control's responsive design takes over and pushes a dropdown tab into the "More..." menu, the children of the Dropdown tab will be pushed into a submenu.

```html

    <ul class="tab-list">
        <li><a href="#information">Information</a></li>
        <li class="has-popupmenu">
          <a href="#">Paper</a>
          <ul>
            <li><a href="#paper-cash">Cash</a></li>
            <li><a href="#paper-plates">Plates</a></li>
            <li><a href="#paper-bags">Bags</a></li>
          </ul>
        </li>
        <li class="has-popupmenu">
          <a href="#">Plastic</a>
          <ul>
            <li><a href="#plastic-creditcards">Credit Cards</a></li>
            <li><a href="#plastic-plates">Plates</a></li>
            <li><a href="#plastic-bags">Bags</a></li>
          </ul>
        </li>
    </ul>


```

## Keyboard Shortcuts

### **Down Arrow/Right Arrow**

-   When focus is on the Tab, a press of down/right will move focus to the next logical Tab.
-   When focus reaches the last Tab, further key presses will wrap to the first Tab in the order.
-   In cases where responsive design collapses tabs into the "More..." menu:
  -   Pressing down/right on the last available tab will cause the More Button to be selected, and cause its menu to open, focusing on the first available option
  -   Subsequent down/right presses will navigate through the menu options
  -   On the last menu option, pressing down/right will close the menu and focus the first Tab in the order

### **Up Arrow/Left Arrow** is generally the reverse of Down/Right arrows

-   When focus reaches the first tab, further key presses will either:
  -   Wrap to the last available Tab in the order
  -   Select the "More..." button if responsive design causes the tabs to collapse. This will open the menu and focus the last option in the menu
-   If the "More..." button is open and the top option is focused, pressing up/left will close the menu and focus the last available tab in the order

### **Enter/Space**

-   Causes the currently focused Tab or "More..." menu option to be selected, causing its corresponding panel to become visible.

### **Tab**

-   When focus is on a Tab, a TAB keystroke will move focus in the following manner:
  -   If interactive glyphs or menus are present in the Accordion Header / Tab, focus will move to each of these glyphs or menus in order.
  -   When the corresponding Tab panel is expanded (its aria-expanded state is 'true'), then focus moves to the first focusable element in the panel.

### **Shift+Tab**

Shift + Tab works similarly to the strategy for the Tab key, but moves focus backwards instead of forwards.

**NOTE:** For tabs to work correctly on mac you need to go to apple \>\> keyboard shortcuts, then click the checkbox at the bottom of the page at the bottom that says full keyboard access - all controls. This way the system can tab into any elements (this is a mac setting).

If using Safari on a Mac, you also need to go into Safari \>\> Preferences... then click the checkbox near the top that says Press Tab to Highlight Each Option on a webpage. This allows hyperlinks to be focusable by default (without having to press Option + Tab).

### ** Alt+backspace / Alt+Delete**

-  If the tab is dismissible that tab will be closed. We use the alt combination because backspace can be used to go back a page.

## States and Variations

The Tabs Control itself can be either completely active, or completely disabled.

Each Individual Tab has the following states:

- Normal
- Hover
- Focused
- Selected (Active)
- Disabled

### Alternate Style

In-Page/Horizontal tabs can be placed on a white background.  In these cases, the `.tab-container` element should be given a CSS class of `.alternate` to allow its faded edges to match the background.

### Types of Tabsets

Soho currently supports four major types of Tabs.

- **In-Page (Horizontal) Tabs** - This is the default type of tabset that will exist inside of pages/forms, and has a minimal style.  These will be used for switching between groups of content or form components that are related, but not necessarily important to show all at once.
- [**Header Tabs**]( ../components/tabs-header) - This tabset is inside of [Header Components]( ../components/header) to define a tab list that will appear to sit adjacently to a Page Container.  These will generally be used for Contextual Navigation of a major feature in your application.
- [**Vertical Tabs**]( ../components/tabs-vertical) - This tabset serves a similar purpose to Header Tabs, but instead displays the tab list vertically on the left edge of the tab content.
- [**Module Tabs**]( ../components/tabs-module) - Module Tabs are another similar construct that are styled in a way that suits them for top-level application navigation.  Module Tabs are built to contain a toolbar.
