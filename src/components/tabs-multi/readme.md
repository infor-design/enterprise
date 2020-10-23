---
title: Tabs-multi
description: null
demo:
  embedded:
  - name: Default tabs-multi example
    slug: example-index
  pages:
  - name: test masthead
    slug: test-masthead
  - name: test side by side
    slug: test-side-by-side
---

## Behavior Guidelines

The Multi-Tabs component creates a system that wraps individual [Tabs Components](./tabs).

## Code Examples

```html

  <section id="multitabs" class="multitabs-container side-by-side">
    <div class="multitabs-section">
        <!-- Insert First Tab Component Here -->
    </div>
    <div class="multitabs-section">
        <!-- Insert Second Tab Component Here -->
    </div>
  </section>

```

## Testability

The same rules for custom attributes and automation id's for the [Tabs Component API]('./tabs') apply to each individual Tabs Component within this component.  

The Multi-Tabs `add()` API method's `options` setting is functionally similar to the one on the Tabs API, and can contain the `attributes` property needed for adding automation ids and other custom attributes.

Please also refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.

## Keyboard Shortcuts

There aren't any keystrokes specific to the Multi-tabs component.  See the [Tabs Component](./tabs) documentation for information about keystrokes.
