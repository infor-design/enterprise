# Accessibility Documentation

This document describes the process for achieving a high degree of accessibility. IDS plays a role in achieving accessibility standards compliance, such as [Section 508](https://www.section508.gov/) or [WCAG 2.1](https://www.w3.org/TR/WCAG21/) however, it is the responsibility of the using teams IDS to verify accessibility within their application.

## Things IDS is Responsible For

- We add [aria attributes](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA) within the component code where appropriate.
- We add [Axe e2e tests](https://github.com/dequelabs/axe-core) to ensure the attributes are valid.
- We provide a compliant series of color schemes (High Contrast theme is WCAG AAA)
- We provide [audio labels](https://webaim.org/techniques/css/invisiblecontent/) where possible within the component code. This is done with the `audible` class for example:

```javascript
<button class="btn">
  <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
    <use href="#icon-home"></use>
  </svg>
  <span class="audible">Home</span>
</button>

- We make svg elements non focusable udio labels](https://webaim.org/techniques/css/invisiblecontent/) where appropriate within the component code. This is done with adding `focusable="false" aria-hidden="true" role="presentation"`.

```javascript
<svg class="icon" focusable="false" aria-hidden="true" role="presentation">
  <use href="#icon-home"></use>
</svg>
```

## Things Applications are Responsible For

- Testing your application towards the [WCAG 2.1 spec](https://www.w3.org/WAI/WCAG21/quickref)
- Providing accessible language and content to be used within our patterns and components
- Appropriate usage of the components in a way that ensures all of our accessibility measures are correctly working, for example matching labels to inputs with the `for` attribute.
- Testing their application for issues.
- Getting [VPAT documents](https://www.itic.org/policy/accessibility/vpat) for the application if applicable.

## Supported Screen Readers

All screen readers read the accessibility DOM, so there may be minor differences in how things work, however, we use a combination of the following screen readers to test:

- [Jaws 2019](https://support.freedomscientific.com/downloads/jaws/JAWSWhatsNew) or 2018 - On Firefox or Chrome
- [NVDA](https://www.nvaccess.org/) - On Firefox or Chrome (For “free” option)
- [Voice Over](https://help.apple.com/voiceover/mac/10.14/) - On Safari (For Mac Option)
- [Voice Over](https://www.apple.com/accessibility/iphone/vision/) - On Safari (For IOS Option)
- [Talkback](https://support.google.com/accessibility/android/answer/6283677?hl=en) - On Chrome (For Android Option)
- [Chrome Vox](https://chrome.google.com/webstore/detail/chromevox/kgejglhpjiefppelpmljglcjbhoiplfn?hl=en) - A convenient screen reader for testing on mac

Screen readers need only be tested in one browser as recommended above.

## Other Tools for Verifying Accessibility

- [Axe Chrome Dev Tools Plugin](https://chrome.google.com/webstore/detail/axe/lhdoppojpmngadmnindnejefpokejbdd?hl=en-US) - A tool that adds a tab in Chrome Dev tools for testing for accessibility problems. This tool gives a visual version of the [Axe e2e tests](https://github.com/infor-design/enterprise/blob/master/test/components/dropdown/dropdown.e2e-spec.js#L64).
- [HTML Code Sniffer](https://squizlabs.github.io/HTML_CodeSniffer/‎) - A tool that adds a bookmark to test a page for accessibility problems.
- [Visbug](https://chrome.google.com/webstore/detail/visbug/cdockenadnadldjbbgcallicgledbeoc?hl=en‎) - A tool that lets you inspect aria attributes and test contrast along with other useful development and page inspection tools.

## Other Accessibility Tools

- [Zoomtext](https://www.zoomtext.com/) - A magnification tool for low vision users.
- [Dragon For Windows](www.nuance.com/‎) - A speech dictation tool for people with disabilities or those that want dictation.

## Great Resources on Accessibility

- [ARIA Design Patterns](https://w3c.github.io/aria-practices/examples/) - Examples to model different components after.

## List of Open Known Accessibility Issues

This issues are tagged with 'Accessibility:' in the issue title. The complete list [can be found here](https://github.com/infor-design/enterprise/issues?q=Accessibility+is%3Aopen). If you find a new accessibility issue please raise it with 'Accessibility:' in the issue title using the [issue template](https://github.com/infor-design/enterprise/issues/new/choose).
