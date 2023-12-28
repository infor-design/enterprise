---
title: Error Page
description: A generic static error page
demo:
  embedded:
  - name: Static Error Page
    slug: example-index
---

## Code Example

This example shows how to render a page in an IDS application that shows an unknown error. Ideally its best to avoid these types of errors in your application but when an unexpected error occurs you can use the styling of this page or the component and render a static page with. Some general guidelines:

1. Explain the problem in non technical terms
2. Show the relevant error codes for reference and support
3. Let the user know its not their fault
4. If possible suggest links to get the user back on track
5. Consider adding support or contact options

To render an error page you need the class `error-page` added to the body. Then add the structure as noted below with the elements `error-page-context`, `error-page-content`. Also add an empty message icon in `error-page-icon` see the [empty message component](./emptymessage) for icon options.

Also include a `error-page-title` and additional `error-page-info` information.

```javascript
$('body').about({
<body class="no-scroll error-page">
  <div class="page-container" role="main">
    <div class="row">
      <div class="twelve columns">

        <div class="error-page-context">
          <div class="error-page-content">

            <div class="error-page-icon">
              <svg class="icon-empty-state" focusable="false" aria-hidden="true" role="presentation">
                <use href="#icon-empty-error-loading"></use>
              </svg>
            </div>

            <div class="error-page-title">
              Access Denied
            </div>

            <div class="error-page-info">
              You have gone to a link that has been moved or you are unauthorized to see. (Code 401).
            </div>

            <div class="error-page-button">
              <button type="button" class="btn btn-primary">
                <span>Return Home</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>
</body>
```

## Accessibility

- All the page should be readable and contain the information the screen reader users need.

## Keyboard Shortcuts

- Not Applicable as this is a static page

## Upgrading from 3.X

- This is new for 4.x
