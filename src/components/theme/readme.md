---
title: Theme Component
description: Lightweight wrapper for theme information, which contains the colors that are used on the theme.
---

## Code Example

The Theme component is used to import the color information for themes from the ids-identity tokens. It serves as a way to list the available themes and the colors for those themes and is used in several places rather than to hard code the colors. One use case thats possible is to use the information for a theme or personalization dropdown. For an example of a [theme and color dropdown](https://design.infor.com/code/ids-enterprise/latest/demo/components/personalize/example-color-theme-api?theme=new) see the personalize component. The theme api is also attached to the Soho object this example shows a couple of its useful functions.

```javascript
Soho.theme.currentTheme // Shows the currently set theme (still set by the personalize API for backwards compatibility)
Soho.theme.themes() // Lists the available themes.
Soho.theme.themeColors() // Lists the color palette for the current theme
Soho.theme.personalizationColors() // Lists the colors recommended for some default personalization options along with names and translations for the current theme .
```
