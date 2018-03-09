---
title: Hyperlinks  
description: This page describes Hyperlinks.
---

## Configuration Options

1. Default Hyperlink Example [View Example]( ../components/hyperlinks/example-index)

## Behavior Guidelines

-   The link shows a color change underneath on hover and a border around on focus.

## Code Example

### Hyperlinks

A Hyperlink uses a standard anchor tag element and styles it with pure css. No JS is needed for this component. Use the normal attributes and events of a standard anchor tag (click, focus ect). Note that the disabled attribute is NOT valid html so should be avoided, however it's included for backwards compatibility and some use cases. Normally a disabled link would be a label/text. There is alternate classes for visited links and Back/Forward Links.

```html

<a class="hyperlink" href="#">More Information Hyperlink</a>


```

## Accessibility

-   Dont use the word link in the link as it is repetitive
-   Dont use all caps in links
-   Dont use ascii characters in links
-   Dont use the url as the text in a link
-   Keep link text concise
-   Keep the number of links on a page to a restricted number
-   You may use audible links if needed
-   Links are underlined in the accessibility theme
-   Avoid [idioms](https://en.wikipedia.org/wiki/Idiom)
-   Be consistent for example user Forward Back or Next Previous

## Keyboard Shortcuts

-   **Tab** moves focus to the Link. A second tab moves focus to the next focusable item.
-   **Space or Enter** executes the link.
-   **Shift + F10** is used to bring up an associated popup menu

## States and Variations

-   hover
-   press
-   visited
-   caret

## Upgrading from 3.X

-   Replace class="inforHyperlink" with "hyperlink"
