---
title: Signin Component
description: null
demo:
  embedded:
  - name: Main Example
    slug: example-index
  pages:
  - name: Remember Me Example
    slug: example-remember-me
  - name: Customer Designed Sign in Page
    slug: test-custom
  - name: Example with a server dropdown
    slug: test-dropdown
  - name: Example with several field
    slug: test-dropdown
  - name: Example of a forgot password page
    slug: example-forgotpassword
  - name: Example of a sent a forgotten password page
    slug: example-forgotpassword-sent
  - name: Example of a create new password page
    slug: example-password-create
---

## Code Example

Displays one or more selectable values. A user can select exactly one value at a time. Best used when all possible options should be clearly visible to a user.

```html
<div class="page-container scrollable">
  <div class="wrapper">
    <section class="signin" role="main">

        <svg class="icon icon-logo" focusable="false" aria-hidden="true" role="presentation">
          <use href="#icon-logo"></use>
        </svg>

        <h1>Application Name</h1>

        <form id="signin" data-validate-on="submit" autocomplete="off">

          <div class="field">
            <label for="username" class="required">Email</label>
            <input type="text" name="username" id="username" autocomplete="off" data-validate="required"/>
          </div>

          <div class="field">
            <label for="password" class="required">Password</label>
            <input type="password" id="password" data-validate="required" name="password"/>
          </div>

          <div class="field">
            <label for="states" class="label">Server</label>
            <select id="states" name="states" class="dropdown">
              <option value="N">NL</option>
              <option value="U">US</option>
              <option value="E">EU</option>
              <option value="c">China</option>
            </select>
          </div>

          <button id="submit" class="btn-primary" type="submit">Sign in</button>
          <a id="hyperlink" class="hyperlink" href="forgotpassword">Forgot Password?</a>

        </form>
    </section>
  </div>

</div>
```

## Implementation Tips

- Make sure each item has a unique Id
- Make sure to add an automation-id for testing that remains the same across versions.
- Signin uses a form to fire the form submit on enter.
- Turn off autocomplete for better security.
- Consider two factor authentication.
- The forgot password page is also a pattern you can use. (See examples)

## Accessibility

- Make sure all fields have id's that much the labels.

## Testability

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.

## Keyboard Shortcuts

- <kbd>Tab</kbd> Between Fields
- <kbd>Enter</kbd> To submit the form and fire the signin process.

## States and Variations

- Disabled
- Error

## Responsive Guidelines

- Will stay centered on all devices both vertically and horizontally.

## Upgrading from 3.X

- Has updated markup and layout.
