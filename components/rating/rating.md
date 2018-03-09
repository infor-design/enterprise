---
title: Rating  
description: This page describes Rating.
---

## Configuration Options

1. Rating Example [View Example]( ../components/rating/example-index)

## Code Example

The Rating component can be used to either display a rating or allow the end user to select a rating. Half start ratings can be displayed but not set. You can implement the Rating control by using the below markup consisting of a block element (div) with class="rating", then any number of inputs followed by labels for the stars. The label element should contain an svg image with the star. An audible label should also be added for accessibility.

```html

<div class="rating">
  <input type="radio" class="is-filled" name="rating-id1" id="one-star-id1">
  <label for="one-star-id1">
    <svg class="icon" focusable="false" aria-hidden="true">
      <use xlink:href="#icon-star-filled"/>
    </svg>
    <span class="audible">1 out of 5 Stars</span>
  </label>

  <input type="radio" class="is-filled" name="rating-id1" id="two-star-id1">
  <label for="two-star-id1">
    <svg class="icon" focusable="false" aria-hidden="true">
      <use xlink:href="#icon-star-filled"/>
    </svg>
    <span class="audible">2 out of 5 Stars</span>
  </label>

  <input type="radio" class="is-filled" name="rating-id1" id="three-star-id1">
  <label for="three-star-id1">
    <svg class="icon" focusable="false" aria-hidden="true">
      <use xlink:href="#icon-star-filled"/>
    </svg>
    <span class="audible">3 out of 5 Stars</span>
  </label>

  <input type="radio" class="is-half" checked name="rating-id1" id="four-star-id1">
  <label for="four-star-id1">
    <svg class="icon" focusable="false" aria-hidden="true">
      <use xlink:href="#icon-star-half"/>
    </svg>
    <span class="audible">4 out of 5 Stars</span>
  </label>

  <input type="radio" name="rating-id1" id="five-star-id1">
  <label for="five-star-id1">
    <svg class="icon" focusable="false" aria-hidden="true">
      <use xlink:href="#icon-star-filled"/>
    </svg>
    <span class="audible">5 out of 5 Stars</span>
  </label>
</div>


```

## Implementation Tips

-   Rating uses svg elements for the stars
-   Functions using a radio button

## Accessibility

-   Should work like a radio button
-   aubible labels are added for giving the star information

## Keyboard Shortcuts

-   **Tab key** will enter the rating group
-   **Down/Right** decreases the rating
-   **Up/Left** increases the rating
-   **Space bar** is a toggle selected/unselected
-   **Control + Arrow** moves through the options without updating content or selecting the rating

## States and Variations

-   focus
-   selected
-   half star

## Responsive Guidelines

-   Smaller than mobile size
-   May have size variations

## Upgrading from 3.X

-   Did not exist
