# File Upload  [Learn More](#)

## Configuration Options

1. Default File Upload Example [View Example]( ../components/fileupload/example-index)
2. Advanced File Upload Example [View Example]( ../components/fileupload-advanced/example-index)
3. Limit File Types [View Example]( ../components/fileupload-advanced/example-limit-types)

{{api-details}}

## Code Example

The file upload control is based on a standard html input with type = "file". When the control initializer runs the file input gets enhanced styling with a icon button and acts similar to other input fields. File upload can be disabled, you can serialize the normal file input element as normal with the form element.

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

## Implementation Tips

-   This is done by making the File Upload element go offscreen since it cannot be styled. The element works by having the label element wrap it so that clicking functions on the label activates the file input element. This can pose issues for testing tools or certain layouts.

## Accessibility

-   Make sure the input has a matching label which describes what you are uploading

## Keyboard Shortcuts

-   **Spacebar or Enter keys** open the dialog for selection
-   **TAB** causes the input to get focus
-   **Shift+Tab** reverses the direction of the tab order. Once in the input, a Shift+Tab will take the user to the previous focusable element in the tab order

## States and Variations

-   Disabled
-   Hover on buttons
-   Press on buttons
-   Focus

## Responsive Guidelines

-   Uses form guidelines

## Upgrading from 3.X

-   Replace any calls to inforFileField() with .fileupload()
-   Replace class inforLabel with label
-   Replace class inforFileField with fileupload
-   Mkae sure the label wraps the input element
