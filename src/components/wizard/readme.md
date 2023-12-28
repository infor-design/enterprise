---
title: Wizard Component
description: Displays feedback about a current process. A user can view a depiction of their current status within a process, and may optionally navigate between points. Best for displaying progress relative to the start and finish of a user workflow.
demo:
  embedded:
  - name: Common Configuration
    slug: example-index
  pages:
  - name: Disabled Tick Clicks
    slug: test-in-page
  - name: Programmatic Tick Selection
    slug: test-set-selected
---

## Code Example

Below is an example of a default wizard control with no extra settings. Classes are added to indicate the current task with `class="current"`. Classes are added to the complete tasks using `class="complete"`. Links should always contain an inner span. It's also possible to make an in-page wizard where the links aren't actionable. To do this, just remove the link and keep the span.

In addition, a wizard can be used for header navigation. This is a full page pattern and must be shown on its own page. Take a look at the [header wizard examples](./grid) for more details.

Actionable Wizard Example:

```html
<div class="wizard">
  <div class="wizard-header">
    <div class="bar">
      <div class="completed-range"></div>
      <a id="context-apps" href="#" class="tick complete">
        <span class="label">Context Apps</span>
      </a>
      <a id="util-apps" href="#" class="tick complete">
        <span class="label">Utility Apps</span>
      </a>
      <a id="inbound-config" href="#" class="tick current">
        <span class="label">Inbound Configuration</span>
      </a>
      <a id="oid-mapping" href="#" class="tick">
        <span class="label">OID Mapping</span>
      </a>
    </div>
  </div>
</div>
```

Non Actionable Wizard Example:

```html
<div class="wizard">
  <div class="wizard-header">
    <div class="bar">
      <div class="completed-range"></div>
      <div class="tick complete">
        <span class="label">System Name</span>
      </div>
      <div class="tick current">
        <span class="label">Connection Protocol</span>
      </div>
      <div class="tick">
        <span class="label">Information</span>
      </div>
      <div class="tick">
        <span class="label">Summary</span>
      </div>
    </div>
  </div>
</div>
```

## Testability

You can add custom id's/automation id's to the wizard component in the markup inline on the anchor tags. For this reason there is no `attributes` setting like some other components.

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
