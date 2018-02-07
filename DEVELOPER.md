<a name="developer-guide"></a>
## Developer Guide

#### Coding a new Component Checklist
 - See if it can be done with only css.
 - Add _*.scss file to sass/controls folder similar to current examples
 - Add new entry for new file in _controls.scss
 - Add any variables in _config.scss
 - Add a view like current examples to views/controls
 - Add link to view to index.html page
 - if js is needed copy the template.js in the js/controls folder.
 - modify the gruntfie.js to add the new script
 - add initializer code to initialize.js (should be able to boot strap the page)
 - code control
 - write unit tests
 - make sure all tests pass
 - run grunt to test jshint for the new control
 - verify html is valid: https://addons.mozilla.org/en-US/firefox/addon/html-validator/
 - verify no automated accessibility errors http://squizlabs.github.io/HTML_CodeSniffer/
 - test your page with voice over https://www.apple.com/voiceover/info/guide/
 - test your page with Jaws (download http://www.freedomscientific.com/Downloads/ProductDemos) http://www.washington.edu/itconnect/learn/accessible/atc/quickstarts/jaws-2/
 - commit and pull request
 - close jira and quote the Jira number on the commit message
 - document on the cms site
 -
<a name="qa-documentation"></a>
## QA Documentation

Test Page:
http://usalvlhlpool1.infor.com/4.4.0-rc/components
(Note that each control can be accessed on its own url `http://usalvlhlpool1.infor.com/4.4.0-rc/components/<name>` for example:
http://usalvlhlpool1.infor.com/4.4.0-rc/components/slider)

Jira: For Reporting Issues..
http://jira.infor.com/browse/SOHO

RoadMap:
https://docs.google.com/spreadsheets/d/1nxSEfNoKtQ9i3R7hgokj8VTdAJ95J8SXfhJ7IrtrOf0/edit?pli=1#gid=345637423

Requirements:
https://docs.google.com/spreadsheets/d/1Z9mmUZJlAqkCLy8vyie3AjRKUR4SVKuHGyFiQiGm98A/edit?pli=1#gid=989468169

Useful Links:
http://accessibility.psu.edu/protocol
http://www.paciellogroup.com/blog/2010/04/html5-and-the-myth-of-wai-aria-redundance/

### Things to Test

The controls should be tested in several ways:

 - Browser Testing - IE11, Edge, Firefox, Safari, Chrome, IOS  (Phone and Tablet), Android (Phone and Tablet), Windows Touch (Surface)
 - Touch Device Support Testing
 - Accessibility Testing according to [WCAG Accessibility Standards](http://www.w3.org/TR/WCAG20/)
 - Developer Testing - Can the Controls be easily coded from the documentation, developer Web Driver.IO tests ect.
 - Testing against requirements

### Related Testing Tools

- Tester can grab latest code from http://git.infor.com/projects/SOHO/repos/controls/browse  (Generally One Month Cycles for versions/QA).
- tester would go through every Html page example opening it in:  IE11, Edge Firefox, Safari, Chrome, IOS  (Phone and Tablet), Android (Phone and Tablet), Windows Touch (Surface)
- Cross check designs with https://docs.google.com/spreadsheets/d/1Z9mmUZJlAqkCLy8vyie3AjRKUR4SVKuHGyFiQiGm98A/edit?pli=1#gid=989468169
or eventually the SoHo XI site pages
- Tests for Accessibility

    1. Run Wave Toolbar https://chrome.google.com/webstore/detail/wave-evaluation-tool/jbbplnpkjmmeebjpijfedlgcdilocofh/related and https://addons.mozilla.org/en-US/firefox/addon/wave-toolbar/
    2. Run Squizz – Html Sniffer http://squizlabs.github.io/HTML_CodeSniffer/
    3. Test for Keyboard against http://access.aol.com/dhtml-style-guide-working-group/
    4. Test with screen readers (voice over, nvda and jaws), If only one Jaws is most critical
     [Jaws](http://www.freedomscientific.com/Products/Blindness/JAWS) can be downloaded and used for 40 minutes before a reboot. It runs on windows and works best on newer IE browsers. This is the primary screen reader to learn and test.
     Secondary Screen readers are [Voice over](https://www.apple.com/voiceover/info/guide/) for use on IOS and Mac and [NVDA](http://www.nvaccess.org/) for use in windows Firefox.
- Any issues or inconsistencies would be reported to http://jira.infor.com/browse/HFC
- Create Selenium (Javascript based) scripts or similar tests (see tests folder in git project)
- Help contribute to questions on Jira and make test examples to test different scenarios like the current test examples.
