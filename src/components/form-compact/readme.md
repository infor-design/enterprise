---
title: Form (Compact)
description: null
demo:
  embedded:
  - name: Default Form Compact Example
    slug: example-index
  pages:
  - name: List-Detail Example
    slug: example-list-detail
  - name: Column Sizes Example
    slug: example-column-sizes
---

Form Compact is a style for forms that are field-heavy.

## Code Example

The form style can be used on its own, like the example below.

```html
<form class="form-compact">
  <div class="row">
    <div class="twelve columns form-section-header">
      Section One
    </div>
  </div>

  <div class="row">
    <div class="six columns">
      <label for="field-01">Field 01</label>
      <input id="field-01" value="Equipment Inc."/>
    </div>
    <div class="six columns">
      <label for="field-02">Field 02</label>
      <input id="field-02"/>
    </div>
  </div>

  <div class="row">
    <div class="six columns">
      <label for="field-03">Field 03</label>
      <input id="field-03" value="Equipment Inc." readonly/>
    </div>
    <div class="six columns">
      <label for="field-04">Field 04</label>
      <input id="field-04"/>
    </div>
  </div>

  <div class="row">
    <div class="twelve columns form-section-header">
      Section Two
    </div>
  </div>

  <div class="row">
    <div class="six columns">
      <label for="field-05">Field 05</label>
      <input id="field-03"/>
    </div>
    <div class="six columns">
      <label for="field-06">Field 06</label>
      <input id="field-06" value="Equipment Inc."/>
    </div>
  </div>
</form>
```

Additionally, a main/detail format can be applied:

```html
<div id="maincontent" class="form-compact-container banner-detail" role="main">
  <section class="banner">
    <div class="thumbnail">
      <img alt="Placeholder Image" src="{{basepath}}images/placeholder-200x200.png"/>
    </div>
    <div class="summary-form">
      <div class="row">
        <div class="twelve columns">
          <div class="field">
            <span class="label">Shipping to</span>
            <span class="data">4209 Industrial Avenue <br>Los Angeles, California 90001 USA</span>
          </div>

          <div class="field">
            <span class="label">Shipping Method</span>
            <span class="data">Freight</span>
          </div>

          <div class="field">
            <span class="label">Estimated Delivery</span>
            <span class="data">June 21, 2015 <i>(4 days)</i></span>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="detail">


    <form class="form-compact">
<!-- Form Compact goes here -->
    </form>

  </section>
</div>
```
