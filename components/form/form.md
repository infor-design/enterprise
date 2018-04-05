
# Form Functionality and Form Layout  [Learn More](#)

## General Information

The forms plugins are a set of form related small utils and functionality contained in `forms.js`. This page outlines the functionality contained in that plugin and shows some from related examples for layout from other areas.

## Configuration Options

1. Form Inputs in the Responsive Grid [View Example]( ../components/form/example-inputs)
2. Form Inputs in the Responsive Simplified Grid [View Example]( ../components/form/example-inputs-simple)
3. Dirty Fields [View Example](#)
4. Form Layouts [View Example]( ../components/form/example-forms)
5. Form Labels [View Example]( ../components/form/example-labels)

## Form Layout Classes

Note: For text/typography specific classes see the classes section on the [typography page]( ../components/typography)

The following classes can be used for form labels:

* `label` - Used for styling spans like labels or form labels.
* `data-description` - Used for stying data in a label when used next to an input.
* `data` - Used for stying data in a label without an input.

The following classes can be used for form and label alignment.

* `form-responsive` -  Makes all the fields inside go to width 100% so that the fields will align in a responsive grid. You have the option to use fixed field sizes (default) or responsive forms. This class forces a responsive form. [See Example]( ../components/form/example-inputs)
* `field-flex` -  Makes all the labels and fields inside go into a side by side layout. Yet still work responsively. This can be used for labels input description situations or to force some labels to sit together , similar to compound fields [See Example]( ../components/form/example-labels)
* `label-left` - Used to put a label and data label to the left of each other rather than on top. This may be used on some forms but not with editable inputs. [See Example]( ../components/form/example-labels)
* `compound-field` - Used to put several fields next to each other in a row. This may be used for related fields like phone + extension [See Example]( ../components/form/example-forms)
