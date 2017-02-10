# Hyperlinks

AKA: Links, Anchor

Hyperlinks can be used throughout the application to link to another object, module, or external URL.

Live Example

http://107.170.15.202:4000/controls/hyperlinks

## Usage Guidlines

Use Hyperlinks when:

You want to link to related information from within a form or module
Additional considerations:

A Hyperlink indicates that the user is moving to a different record or page.
Do not use Hyperlinks on field labels, as this creates accessibility issues.

## UI Specs

[Spec PSD Doc Here]

## Markup

    <a class="hyperlink" href="#">More Information</a><br>

## CSS

http://git.infor.com/projects/SOHO/repos/controls/browse/sass/controls/_hyperlinks.scss

## Dependencies

Typography, Colors

## States

**disabled** – In HTML technically disabled is invalid, this shouldnt be used but for strange use cases a styling has been added. Because its not valid you should also set tabindex = -1. Can be added by adding the attribute "disabled".

**hover** – Hover will show the underline

**active/press** – Avoid toggling the focus circle on press.

**visited** - Can be added via add class "show-visited".

## Themes

**grey**

**dark**

**high contrast**

## Events

**click** – a click event would fire when the button is clicked, this is a browser standard event

## Keyboard

**Tab** Moves focus to the Link. A second tab moves focus to the next focusable item..

**Space or Enter** - executes the link

**Shift + F10** is used to bring up an associated popup menu

For More Info See:
http://access.aol.com/dhtml-style-guide-working-group/#button

## Behaviors

**Too Many States** – Avoid toggling the focus circle on press.

**Padding** – Use a border for underline state not text-decoration to allow for more padding

**Printable** – Print just the text in black with the underline showing.

## Mobile

**Touch** - When a button is touched some schools say you should normalize the 300ms touch delay for percieved performance. However, this my cause issues with accessibility as a pinch over the button would be treated as a click.

## Animations

 - The link shows a border underneath on hover with a ease animation

## Accessibility

- Dont use the word link in the link as it is repetitive
- Dont use all caps in links
- Dont use ascii characters in links
- Dont use the url as the text in a link
- Keep link text concise
- Keep the number of links on a page to a restricted number
- You may use audible links if needed
- Links are underlined in the accessibility theme
- Avoid Idoims

## Implementations

- Soho XI Core
http://git.infor.com/projects/SOHO/repos/controls/browse/sass/controls/_hyperlinks.scss

## Upgrading from Soho 3.x

- Replace class="inforHyperlink" with "hyperlink"

## Documentation Structure

Structure....

Dropdown
  Documentation
      Test Cases
      Generated - Description, API, Methods, Overview
      Other Docs
      Code Snippets

  Examples

    Example 1
    Example 2
    Example 3
    Use Case 1

  Unit Tests
