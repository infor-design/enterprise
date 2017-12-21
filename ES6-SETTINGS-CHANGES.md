# Changes to Options/Settings during ES6 Conversions

Various changes are being made to the way Soho components internally handle settings during the ES6 conversion:

## Usage of the term 'settings' versus the term 'options'

We used to interchangeably use the terms `settings` and `options` throughout the code.  We've determined that we're going to normalize the usage `settings` throughout.  All component prototypes currently store a copy of settings internally as `this.settings`, so we've normalized this term as the correct usage.

## Moving where propagation/storage of settings is occurring

Handling of settings is being moved from any jQuery-specific component wrappers, to internal parts of their vanilla-JS constructors and `updated()` methods.  Additionally, `updated()` methods are being modified to take an argument that repopulates settings, rather than at the jQuery-level code paths for updating versus building component instances.  What this means is that the jQuery-component wrappers are becoming "dumber", and simply passing these settings into the vanilla-JS components to be handled at a lower level.

Additionally, the jQuery component wrappers no longer care whether `settings` arguments are an Object, or a function that eventually returns an Object.  These functions used to be analyzed and run at the jQuery level.  This is now happening inside the vanilla-JS component.

## Always take into account settings defined at the HTML level

Finally, some components used to, internally, manage the propagation of settings that were defined on their base elements via a `data-options` property.  Many of our components did not do this internally, and would rely on an Application Developer to be using Soho's `initialize.js` to handle this task.

It's become apparent over time that it's not safe for us to count on teams implementing our initializer, for various reasons.  This means that these specific teams may never have had the capability to grab settings from HTML elements before.

There's now a function in `/components/utils/utils.js` called `mergeSettings()`, which replaces our usage of `$.extend()` for handling the building of settings objects.  This method can optionally take an HTMLElement or jQuery-wrapped collection of elements as a first argument.  If the argument's provided, the element will be checked for a `data-options` attribute, eventually parsed by `parseOptions()` if it's found.

# Outstanding issues that may need to be dealt with later

Some of these issues we're not quite sure how to handle.

## Conversion of Settings functions to Objects via jQuery constructors

Some components were previously handling the conversion of a `settings` function (not Object) into an Object before the settings were ever passed to the vanilla-JS constructor.  For the sake of consistency, we've started removing this functionality in favor of using `utils.mergeSettings()`, which will handle settings functions while also taking into account the proper order of precedence of using settings:

```
Defaults < Incoming Javascript-based Settings < Incoming HTML-based Settings (data-options)
```

This is a list of components that were manually handling converting of a 'settings' argument from a function to an Object inside of the jQuery constructors:

- Slider

Additionally, these components also had an `arguments` parameter in their jQuery constructors, which may have been passing additional context (we're not sure if anyone was actually using this functionality because it was sparsely integrated):

-
