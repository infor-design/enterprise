---
title: Wizard Component
description: Displays feedback about a current process. A user can view a depiction of their current status within a process, and may optionally navigate between points. Best for displaying progress relative to the start and finish of a user workflow.
demo:
  embedded:
  - name: Common Configuration
    slug: example-index
  pages:
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
        <a href="#" id="context-apps" class="tick complete">
          <span class="label">Context Apps</span>
        </a>
        <a href="#" id="utility-apps" class="tick complete">
          <span class="label">Utility Apps</span>
        </a>
        <a href="#" id="inbound-config" class="tick current">
          <span class="label">Inbound Configuration</span>
        </a>
        <a href="#" id="oid-mapping" class="tick">
          <span class="label">OID Mapping</span>
        </a>
      </div>
    </div>
  </div>
```

## Testability

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.

## Keyboard Shortcuts

- <kbd>Tab</kbd> to navigate forward among the wizard's ticks
- Use <kbd>Shift + Tab</kbd> to navigate backwards
- Use <kbd>Enter</kbd> or <kbd>Space</kbd> to active a link that has focus

## States and Variations

States apply to the individual steps of a wizard:

- Available
- Completed (Available + Completed)
- Partially Completed (Available + Started + Not fully completed)
- Disabled/Unavailable (Cannot be accessed until all previous steps are completed)
