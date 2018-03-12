---
title: Wizard Component 
description: This page describes Wizard Component .
---

## Configuration Examples

1. [Common Configuration]( ../components/wizard/example-index)
2. [Disabled Tick Clicks]( ../components/wizard/example-in-page)
3. [Programmatic Tick Selection]( ../components/wizard/example-set-selected)

## Code Example

An example of a default Wizard control with no extra settings. Classes are added to indicate the current task (class = current). Classes are added to the complete tasks (class = complete). Links should always contain and inner span.

An addition wizard can be used for header navigation. This is a full page pattern so must be shown on its own page. See here for [header wizard examples.](http://usalvwsoho2:4000/controls/grid)

```html
  <div class="wizard">
    <div class="wizard-header">
      <div class="bar">
        <div class="completed-range"></div>
        <a href="#" class="tick complete">
          <span class="label">Context Apps</span>
        </a>
        <a href="#" class="tick complete">
          <span class="label">Utility Apps</span>
        </a>
        <a href="#" class="tick current">
          <span class="label">Inbound Configuration</span>
        </a>
        <a href="#" class="tick">
          <span class="label">OID Mapping</span>
        </a>
      </div>
    </div>
  </div>
```

## Keyboard Shortcuts

-   Use **Tab** to navigate forward among the Wizard's Ticks
-   Use **Shift + Tab** to navigate backwards
-   Use **Enter** or **Space** to active a link that has focus

## States and Variations

States apply to the individual steps of a wizard:

-   Available
-   Completed (Available + Completed)
-   Partially Completed (Available + Started + Not fully completed)
-   Disabled/Unavailable (Cannot be accessed until all previous steps are completed)
