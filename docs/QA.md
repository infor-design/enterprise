https://www.w3.org/TR/2019/NOTE-wai-aria-practices-1.1-20190207/examples/

# QA Documentation

**TODO:** This documentation is VERY out of date and needs fixing.

## Important Links

### Demo app

- [Bleeding Edge](http://master-enterprise.demo.design.infor.com/components)
- [Latest Stable](http://490-enterprise.demo.design.infor.com/components)

### Infor resources

- [IDS Enterprise on Github](https://github.com/infor-design/enterprise/issues) for reporting issues
- [IDS Roadmap](https://docs.google.com/spreadsheets/d/1nxSEfNoKtQ9i3R7hgokj8VTdAJ95J8SXfhJ7IrtrOf0/edit?pli=1#gid=345637423) (NOTE: needs updating)
- [Requirements Documentation](https://docs.google.com/spreadsheets/d/1Z9mmUZJlAqkCLy8vyie3AjRKUR4SVKuHGyFiQiGm98A/edit?pli=1#gid=989468169) (NOTE: needs updating)

### Useful resources for testing

- [Penn State Accessibility/Usability Guidelines](http://accessibility.psu.edu/protocol)
- [The Myth of WAI-ARIA Redundance](https://developer.paciellogroup.com/blog/2010/04/html5-and-the-myth-of-wai-aria-redundance)

## Things to Test

The components should be tested in several ways:

- Browser Testing - IE11, Edge, Firefox, Safari, Chrome, IOS  (Phone and Tablet), Android (Phone and Tablet), Windows Touch (Surface)
- Touch Device Support Testing
- Accessibility Testing according to [WCAG Accessibility Standards](http://www.w3.org/TR/WCAG20/)
- Developer Testing - Can the Components be easily coded from the documentation, developer Web Driver.IO tests ect.
- Testing against requirements

## Related Testing Tools

- Tester can grab latest code from github (Generally One Month Cycles for versions/QA).
- tester would go through every Html page example opening it in:  IE11, Edge Firefox, Safari, Chrome, IOS  (Phone and Tablet), Android (Phone and Tablet), Windows Touch (Surface)
- Cross check designs with <https://docs.google.com/spreadsheets/d/1Z9mmUZJlAqkCLy8vyie3AjRKUR4SVKuHGyFiQiGm98A/edit?pli=1#gid=989468169>
- Tests for Accessibility
    1. Run Wave Toolbar <https://chrome.google.com/webstore/detail/wave-evaluation-tool/jbbplnpkjmmeebjpijfedlgcdilocofh/related> and <https://addons.mozilla.org/en-US/firefox/addon/wave-toolbar/>
    1. Run Squizz – Html Sniffer <http://squizlabs.github.io/HTML_CodeSniffer/>
    1. Test for Keyboard against <http://access.aol.com/dhtml-style-guide-working-group/>
    1. Test with screen readers (voice over, nvda and jaws), If only one Jaws is most critical
     [Jaws](http://www.freedomscientific.com/Products/Blindness/JAWS) can be downloaded and used for 40 minutes before a reboot. It runs on windows and works best on newer IE browsers. This is the primary screen reader to learn and test.
     Secondary Screen readers are [Voice over](https://www.apple.com/voiceover/info/guide/) for use on IOS and Mac and [NVDA](http://www.nvaccess.org/) for use in windows Firefox.
- Any issues or inconsistencies would be reported to <https://github.com/infor-design/enterprise/issues>
- Create Selenium (Javascript based) scripts or similar tests (see tests folder in git project)
- Help contribute to questions on Jira and make test examples to test different scenarios like the current test examples.
