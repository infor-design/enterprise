# Contributing to Web Documentation

Documentation from within this project is deployed to [design.infor.com](https://design.infor.com) whenever a new release is published. Please follow these best practices to keep documentation consistent.

## Linking

- From a component readme and linking to another component's documentation, use a relative link like `[Read about buttons](./button)`. Using a relative link like this will maintain the current version the website visitor has selected.
- The design system website automatically sets `target="_blank"` for any code documentation link which contains `/demo/` in it. It's not necessary for you to add this within the documentation itself.
- Paths for demo links use the same URL structure as on the local development app.
    - For example, to create a link to a components page, take the URI from the dev app such as `/components/tabs/example-index` and from a component readme page, create a relative link like `[see example / demo](./demo/components/tabs/example-index)`.
