TODO

- Naming Unit vs Functional Integration
- Tools
- Who does what.
- Separation of Code
- Supporting Cindy
- Prioritizing Initial 7
  - Button
  - Dropdown
  - Multiselect
  - Listview
  -
- Prioritizing Important 7

Dave

- screen shots
- unit vs functional test placements
- protractor recipies

## Unit Testing

In computer programming, unit testing is a software testing method by which individual units of source code, sets of one or more computer program modules together with associated control data, usage ...

## Functional Testing

Functional testing is a software testing process used within software development in which software is tested to ensure that it conforms with all requirements.

## Integration Testing

Integration testing is the phase in software testing in which individual software modules are combined and tested as a group

  - Clicking on elements, looking on the page, accessibility
  - Screen Shots

## End to End Tests (e2e)

Test whether the flow of an application is performing as designed from start to finish.

Targeting
  - By ID
  - By Property (aria properties)
      element(by.css('div[aria-controls=dropdown-list]'))

## Regression testing

Regression testing is a type of software testing which verifies that software which was previously developed and tested still performs the same way after it was changed or interfaced with other software.

## Running and Debugging Tests

Run just the api spec, for debugging with Chrome. For debugging use statements in the unit tests, and open Chrome DevTools
 `KARMA_SPECS='components/dropdown/unit/dropdown-api.spec.js' npm run test:es6:local:unit` // Only runs API spec

Run several spec tests with a Glob, for debugging with Chrome.
 `KARMA_SPECS='components/dropdown/unit/dropdown*.spec.js' npm run test:es6:local:unit` // Glob example

Run several just an api test, headless.
 `env KARMA_SPECS='components/locale/unit/locale-api.spec.js' npm run ci:test:es6:local:unit`

## Debugging a Test
1. Put a debugger; statement at a place in the code.
2. Run the test with `env KARMA_SPECS='components/locale/unit/locale-api.spec.js' npm run test:es6:local:unit`
3. open chrome tools
4. refresh the page and the debugger will pop up

## Watching a Test

You may when building a test out want to watch it. You can leave the test running and as you change the file.
The test will rerun.

1. Run the targeted request test with a command like `env KARMA_SPECS='components/locale/unit/locale-api.spec.js' npm run test:es6:local:unit`
3. Your test(s) will run.
4. Keep the page open and console running
5. Update your test and save
6. Tests will run again.. Repeat..

## Checking Coverage

1. Run the test with `env KARMA_SPECS='components/locale/unit/locale-api.spec.js' npm run test:es6:local:unit`
2. While the browser is open. Go to `cd coverage`
3. Start a simple web server `python -m SimpleHTTPServer`
4. Open up a browser and go to http://localhost:8000/ and browse in to the page

## Test Recipies

- Click something and get result
- Open a test page and find a value (id or aria)
- Open a dropdown list and menu button
- Select a menu button menu item etc..
- Themes
- RTL

## Testing Resources
https://www.npmjs.com/browse/keyword/karma-adapter
https://medium.com/powtoon-engineering/a-complete-guide-to-testing-javascript-in-2017-a217b4cd5a2a

https://codecraft.tv/courses/angular/unit-testing/jasmine-and-karma/
https://github.com/dwyl/learn-istanbul

https://developers.google.com/web/updates/2017/06/headless-karma-mocha-chai
https://medium.com/@praveenjanakarajan/jasmine-or-mocha-66942388b196
https://medium.com/@jamesjefferyuk/javascript-what-are-pure-functions-4d4d5392d49c

https://github.com/vuejs/vue/tree/dev/test/unit
https://github.com/vuejs/vue/blob/dev/test/unit/karma.base.config.js#L32
