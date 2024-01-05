---
title: Counts
description: null
demo:
  embedded:
  - name: Counts - Actionable
    slug: example-index
  - name: Counts - Not Actionable
    slug: example-not-actionable
  - name: Counts - In a Widget
    slug: example-widget-count
---

## Code Example - Large Form counts

To display a row of counts on a form use the provided `object-count` series of classes. Object counts can be in hyperlinks so that they are actionable. But if they are not actionable just exclude the link and it will still work. You can also move the label above or below the count. Here is an example of actionable counts.

```html

<div class="row l-center">
  <div class="one-fifth column one-half-mobile">
    <a class="hyperlink object-count hide-focus" href="#">
      <span class="xl-text">7</span>
      <span>Active <br/> Opportunities</span>
    </a>
  </div>

  <div class="one-fifth column one-half-mobile">
    <a class="hyperlink object-count hide-focus" href="#">
      <span class="xl-text">2</span>
      <span>Open <br/> Incidents</span>
    </a>
  </div>

  <div class="one-fifth column one-half-mobile">
    <a class="hyperlink object-count hide-focus" href="#">
      <span class="xl-text">4</span>
      <span>Escalated <br/> Incidents</span>
    </a>
  </div>

  <div class="one-fifth column one-half-mobile">
    <a class="hyperlink object-count hide-focus" href="#">
      <span class="xl-text">7</span>
      <span>Open <br/> Projects</span>
    </a>
  </div>

  <div class="one-fifth column one-half-mobile">
    <a class="hyperlink object-count hide-focus" href="#">
      <span class="xl-text">7</span>
      <span>Active <br/> Contacts</span>
    </a>
  </div>

</div>
```

## Code Example - Personalizing Counts

If you want the counts to appear attached to the header area and you use personalization you can use the personalize API to change the colors of the links and counts. There is a working example in the [personalize component section]( ./personalize).

## Code Example - Widget Counts

Counts also have a style for use within a widget. Also called instance Counts from the original use case. These are simple CSS/HTML components with a `count` and `title` element. You can use any of the colors in the [palette]( ./colors).

```html
<div class="instance-count ">
  <span class="count emerald07">40</span>
  <span class="title">Active Goals</span>
</div>
```

## Accessibility

- Be careful to select a color that passes <a href="http://webaim.org/resources/contrastchecker/" target="_blank">WCAG AA or AAA contrast</a> between the background and text color.
- Screen readers can access the information via a virtual keyboard since these are not focusable.
- Make sure to augment the labels with `audible` only spans to add additional context if needed.
