(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module
    define('cultures/en-US', ['jquery'], factory);
    factory();
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function () {

  if (!Locale) {
    return;
  }

  //Get Latest from http://www.unicode.org/Public/cldr/25/
  Locale.addCulture('en-US', {
    //layout/language
    language: 'en',
    englishName: 'English (United States)',
    nativeName: 'English (United States)',
    //layout/orientation/@characters
    direction: 'left-to-right',
    //ca-gregorian
    calendars: [{
      name: 'gregorian',
      //ca-gregorian/main/dates/calendars/gregorian/dateFormats/
      dateFormat: {'seperator': '/', //Infered
                   'short': 'M/d/yyyy', //use four digit year
                   'medium': 'MMM d, yyyy',
                   'long': 'MMMM d, yyyy',
                   'full': 'EEEE, MMMM d, y',
                   'datetime': 'M/d/yyyy h:mm a'}, //Infered short + short gregorian/dateTimeFormats
      //ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated (2 digit)
      days: {
         wide: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
         abbreviated: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
      },
      //ca-gregorian/main/dates/calendars/gregorian/months/format/wide
      months: {
        wide: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        abbreviated: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      //ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
      timeFormat: 'h:mm a',
      //ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
      dayPeriods: ['AM', 'PM']
    }],
    //numbers/currencyFormats-numberSystem-latn/standard (Replace Sign http://www.currencysymbols.in ?)
    currencySign: '$', //(Replace Sign http://www.currencysymbols.in ?)
    currencyFormat: '¤#,##0.00',
    //numbers/symbols-numberSystem-latn
    numbers: {
      percentSign: '%',
      minusSign: '-',
      decimal: '.',
      group: ','
    },
    //Resx - Approved By Translation Team
    messages: {
      'Actions': {id: 'Actions', value: 'Actions', comment: 'Tooltip text for the action button with additional in context actions'},
      'AllResults': {id: 'AllResults', value: 'All Results For', comment: 'Search Results Text'},
      'Amber': {id: 'Amber', value: 'Amber', comment: 'Color in our color pallette'},
      'Amethyst': {id: 'Amethyst', value: 'Amethyst', comment: 'Color in our color pallette'},
      'Azure': {id: 'Azure', value: 'Azure', comment: 'Color in our color pallette'},
      'AboutText': {id: 'AboutText', value: 'Copyright &copy; {0} Infor. All rights reserved. The word and design marks set forth herein are trademarks and/or registered trademarks of Infor and/or its affiliates and subsidiaries. All rights reserved. All other trademarks listed herein are the property of their respective owners'},
      'Blockquote': {id: 'Blockquote', value: 'Block quote', comment: 'insert a block quote in the editor'},
      'Calendar': {id: 'Calendar', value: 'Calendar', comment: 'Inline Text for the title of the Calendar control'},
      'ChangeSelection': {id: 'ChangeSelection', value: '. To change the selection use the arrow keys.', comment: 'Audible Text for drop down list help'},
      'Clear': {id: 'Clear', value: 'Clear', comment: 'Hint for a Clear Action'},
      'Close': {id: 'Close', value: 'Close', comment: 'Hint for a Close Button Action'},
      'Completed': {id: 'Completed', value: 'Completed', comment: 'Text For a Completed Status'},
      'Drilldown': {id: 'Drilldown', value: 'Drill down', comment: 'Drill by moving page flow into a record'},
      'EnterComments': {id: 'EnterComments', value: 'Enter comments here...', comment: 'Placeholder text for a text input (comments)'},
      'Error': {id: 'Error', value: 'Error', comment: 'Title, Spoken Text describing fact an error has occured'},
      'Emerald': {id: 'Emerald', value: 'Emerald', comment: 'Color in our color pallette'},
      'Graphite': {id: 'Graphite', value: 'Graphite', comment: 'Color in our color pallette'},
      'Hours': {id: 'Hours', value: 'Hours', comment: 'the hour portion of a time'},
      'InsertAnchor': {id: 'InsertAnchor', value: 'Insert Anchor', comment: 'Insert Acnhor (link) in an editor'},
      'InsertImage': {id: 'InsertImage', value: 'Invalid Image', comment: 'Insert Image in an editor'},
      'InvalidDate': {id: 'InvalidDate', value: 'Invalid Date', comment: 'validation message for wrong date format (short)'},
      'JustifyCenter': {id: 'JustifyCenter', value: 'Justify Center', comment: 'justify text to center in the editor'},
      'JustifyLeft': {id: 'JustifyLeft', value: 'Justify Left', comment: 'justify text to left in the editor'},
      'JustifyRight': {id: 'JustifyRight', value: 'Justify Right', comment: 'justify text to right in the editor'},
      'Loading': {id: 'Loading', value: 'Loading', comment: 'Text below spinning indicator to indicate loading'},
      'Minutes': {id: 'Minutes', value: 'Minutes', comment: 'the minutes portion of a time'},
      'More': {id: 'More', value: 'More...', comment: 'Text Indicating More Buttons or form content'},
      'MoreActions': {id: 'MoreActions', value: 'More Actions', comment: 'Text on the More Actions button indictating hidden functions'},
      'MultiselectWith': {id: 'MultiselectWith', value: '. Multiselect with ', comment: 'the minutes portion of a time'},
      'NextMonth': {id: 'NextMonth', value: 'Next Month', comment: 'the label for the button that moves calendar to next/prev'},
      'NoResults': {id: 'NoResults', value: 'No Results', comment: 'Search Results Text'},
      'OrderedList': {id: 'OrderedList', value: 'Ordered List', comment: 'Insert an Ordered list in the editor'},
      'Peak': {id: 'Peak', value: 'Peak', comment: 'the max or peak value in a chart'},
      'Period': {id: 'Period', value: 'Period', comment: 'the am/pm portion of a time'},
      'PressDown': {id: 'PressDown', value: 'Press Down to select a date', comment: 'the audible label for hint about how to operate the date picker'},
      'PreviousMonth': {id: 'PreviousMonth', value: 'Previous Month', comment: 'the label for the button that moves calendar to next/prev'},
      'Required': {id: 'Required', value: 'Required', comment: 'indicates a form field is manditory'},
      'Ruby': {id: 'Ruby', value: 'Ruby', comment: 'Color in our color pallette'},
      'Selected': {id: 'Selected', value: 'Selected', comment: 'text describing a selected object'},
      'SetTime': {id: 'SetTime', value: 'Set Time', comment: 'button text that inserts time when clicked'},
      'Slate': {id: 'Slate', value: 'Slate', comment: 'Color in our color pallette'},
      'SliderHandle': {id: 'SliderHandle', value: 'Handle for', comment: 'Description of the portion of a Slider control that is focusable and changes its value, followed in code by the name of the control'},
      'SliderMaximumHandle': {id: 'SliderMaximumHandle', value: 'Maximum range handle for', comment: 'Describes a maximum value handle in a Range (double slider), followed in code by the name of the control'},
      'SliderMinimumHandle': {id: 'SliderMinimumHandle', value: 'Minimum range handle for', comment: 'Describes a minimum value handle in a Range (double slider), followed in code by the name of the control'},
      'StrikeThrough': {id: 'StrikeThrough', value: 'Strike Through', comment: 'turn on and off strike through text in text editor (like word)'},
      'Subscript': {id: 'Subscript', value: 'Subscript', comment: 'turn on and off Subscript text in text editor (like word)'},
      'Superscript': {id: 'Superscript', value: 'Superscript', comment: 'turn on and off Superscript text in text editor (like word)'},
      'Today': {id: 'Today', value: 'Today', comment: 'refering to today on a calendar'},
      'ToggleBold': {id: 'ToggleBold', value: 'Toggle Bold Text', comment: 'turn on and off bold in text editor (like word)'},
      'ToggleH3': {id: 'ToggleH3', value: 'Toggle Heading 3', comment: 'turn on and off heading 3 text'},
      'ToggleH4': {id: 'ToggleH4', value: 'Toggle Heading 4', comment: 'turn on and off heading 4 text'},
      'ToggleItalic': {id: 'ToggleItalic', value: 'Toggle Italic Text', comment: 'turn on and off Italic in text editor (like word)'},
      'ToggleUnderline': {id: 'ToggleUnderline', value: 'Toggle Underline Text', comment: 'turn on and off Underline in text editor (like word)'},
      'Toolbar': {id: 'Toolbar', value: 'Toolbar', comment: 'describing the toolbar component'},
      'Total': {id: 'Total', value: 'Total', comment: 'mathematic total of a calculation'},
      'Turquoise': {id: 'Turquoise', value: 'Turquoise', comment: 'Color in our color pallette'},
      'UnorderedList': {id: 'UnorderedList', value: 'Unordered List', comment: 'Insert an Unordered list in the editor'},
      'Unsupported': {id: 'Unsupported', value: 'This content is not available because it uses features not supported in your current browser version.', comment: 'Suggesting browser upgrade for missing features.'},
      'UseArrow': {id: 'UseArrow', value: '. Use arrow keys to select.', comment: 'Instructional comments for screen readers'},
      'ViewSource': {id: 'ViewSource', value: 'View Source', comment: 'Toggle the source view in the editor'},
      'ViewVisual': {id: 'ViewVisual', value: 'View Visual', comment: 'Toggle the visual view in the editor'}
    }
  });
}));
