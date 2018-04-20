---
title: Wizard Component
description: This page describes Wizard Component .
demo:
  pages:
  - name: Common Configuration
    slug: example-index
  - name: Disabled Tick Clicks
    slug: example-in-page
  - name: Programmatic Tick Selection
    slug: example-set-selected
---

## Code Example

Below is an example of a default wizard control with no extra settings. Classes are added to indicate the current task with `class="current"`. Classes are added to the complete tasks using `class="complete"`. Links should always contain and inner span.

In addition, a wizard can be used for header navigation. This is a full page pattern so must be shown on its own page. See here for [header wizard examples.](./grid)

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

- <kbd>Tab</kbd> to navigate forward among the wizard's ticks
- Use <kbd>Shift + Tab</kbd> to navigate backwards
- Use <kbd>Enter</kbd> or <kbd>Space</kbd> to active a link that has focus

## States and Variations

States apply to the individual steps of a wizard:

-   Available
-   Completed (Available + Completed)
-   Partially Completed (Available + Started + Not fully completed)
-   Disabled/Unavailable (Cannot be accessed until all previous steps are completed)
