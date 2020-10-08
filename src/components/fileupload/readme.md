---
title: File Upload
description: A form element that allows users to choose a file they want to upload. A user can prompt a system menu to select one or more file to upload. Best for allowing users to select files from a local system to be uploaded to a server or application.
demo:
  embedded:
  - name: Default File Upload Example
    slug: example-index
  pages:
  - name: Advanced File Upload Example
    slug: example-index
  - name: Limit File Types
    slug: example-limit-types
---

The file upload control is based on the standard HTML `<input type="file">`. When the control initializer runs, the file input gets enhanced styling with a icon button and acts similar to other input fields. The file input element can be serialized as normal form element. File upload can also take the `disabled` attribute.

```html
<div class="field">
  <label class="fileupload">
      <span class="audible">Upload a File</span>
      <input type="file" name="file-input" />
  </label>
</div>

<div class="field">
  <label class="fileupload">
      <span class="audible">Upload a File</span>
      <input type="file"  name="file-name-disabled" disabled/>
  </label>
</div>
```

The custom-styled file upload is built by making the standard file upload element hidden since it cannot be styled. The component works by having the `<label>` wrap the input so that clicking  on the label activates the file input. This can pose issues for testing tools or certain layouts.

## Accessibility

- Make sure the input has a matching label which describes what you are uploading

## Testability

- Please refer to the [Application Testability Checklist](https://design.infor.com/resources/application-testability-checklist) for further details.

## Keyboard Shortcuts

- <kbd>Spacebar</kbd> or <kbd>Enter</kbd> opens the dialog for selection
- <kbd>Tab</kbd> causes the input to get focus
- <kbd>Shift + Tab</kbd> reverses the direction of the tab order. Once in the input, a <kbd>Shift + Tab</kbd> will take the user to the previous focusable element in the tab order

## Upgrading from 3.X

- Replace any calls to `inforFileField()` with `.fileupload()`
- Replace class `inforLabel` with `label`
- Replace class `inforFileField` with `fileupload`
- Make sure the `<label>` wraps the `<input>` element
