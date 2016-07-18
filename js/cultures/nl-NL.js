(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module
    define('cultures/nl-NL', ['jquery'], factory);
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
  Locale.addCulture('nl-NL', {
    //layout/language
    language: 'nl',
    englishName: 'Dutch (Netherlands)',
    nativeName: 'Nederlands (Nederland)',
    //layout/orientation/@characters
    direction: 'left-to-right',
    //ca-gregorian
    calendars: [{
      name: 'gregorian',
      //ca-gregorian/main/dates/calendars/gregorian/dateFormats/
      dateFormat: {'separator': '-', //Infered
                   'timeSeparator': ':',
                   'short': 'dd-MM-yyyy', //use four digit year
                   'medium': 'd MMM yyyy',
                   'long': 'd MMMM yyyy',
                   'full': 'EEEE d MMMM yyyy',
                   'month': 'dd MMMM',
                   'year': 'MMMM yyyy',
                   'timestamp': 'HH:mm:ss',
                   'datetime': 'M/d/yyyy HH:mm'}, //Infered short + short gregorian/dateTimeFormats
      //ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated (2 digit)
      days: {
         wide: ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'],
         abbreviated: ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'],
         narrow: ['Z', 'M', 'D', 'W', 'D', 'V', 'Z']
      },
      //ca-gregorian/main/dates/calendars/gregorian/months/format/wide
      months: {
        wide: ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'],
        abbreviated: ['jan', 'feb', 'mrt', 'apr', 'mei', 'jul', 'Jul', 'aug', 'sep', 'okt', 'nov', 'dec']
      },
      //ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
      timeFormat: 'HH:mm',
      //ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
      dayPeriods: ['AM', 'PM']
    }],
    //numbers/currencyFormats-numberSystem-latn/standard (Replace Sign http://www.currencysymbols.in ?)
    currencySign: '€', //(Replace Sign http://www.currencysymbols.in ?)
    currencyFormat: '¤ #,##0.00',
    //numbers/symbols-numberSystem-latn
    numbers: {
      percentSign: '%',
      percentFormat: '#,##0 %',
      minusSign: '-',
      decimal: ',',
      group: '.'
    },
    //Resx - Approved By Translation Team
    messages: {
      'AboutText': {id: 'AboutText', value: 'Copyright &copy; {0} Infor. Alle rechten voorbehouden. De woord- en merktekens die in dit document worden gebruikt zijn handelsmerken en/of geregistreerde handelsmerken van Infor en/of haar vestigingen en gelieerde bedrijven. Alle rechten voorbehouden. Alle overige handelsmerken in dit document zijn eigendom van de respectievelijke eigenaren.'},
      'Actions': {id: 'Actions', value: 'Acties', comment: 'Tooltip text for the action button with additional in context actions'},
      'Add': {id: 'Add', value: 'Toevoegen', comment: 'Add'},
      'AddNewTab': {id: 'AddNewTab', value: 'Nieuw tabblad toevoegen', comment: 'Attached to a button that adds new tabs'},
      'AdvancedFilter': {id: 'AdvancedFilter', value: 'Geavanceerd filter aanmaken', comment: 'In a data grid active an advanced filtering feature'},
      'Alert': {id: 'Alert', value: 'Alarmering', comment: 'Alert'},
      'AllResults': {id: 'AllResults', value: 'Alle resultaten voor', comment: 'Search Results Text'},
      'AligntoBottom': {id: 'AligntoBottom', value: 'Onder uitlijnen', comment: 'Align to Bottom tooltip'},
      'AlignCenterHorizontally': {id: 'AlignCenterHorizontally', value: 'Horizontaal centreren', comment: 'Align Center Horizontally tooltip'},
      'Amber': {id: 'Amber', value: 'Amber', comment: 'Color in our color pallette'},
      'Amethyst': {id: 'Amethyst', value: 'Ametist', comment: 'Color in our color pallette'},
      'Apply': {id: 'Apply', value: 'Toepassen', comment: 'Text in a button to apply an action'},
      'Attach': {id: 'Attach', value: 'Koppelen', comment: 'Attach'},
      'Azure': {id: 'Azure', value: 'Azuur', comment: 'Color in our color pallette'},
      'Between': {id: 'Between', value: 'Tussen', comment: 'Between in icons for filtering'},
      'Blockquote': {id: 'Blockquote', value: 'Blokcitaat', comment: 'insert a block quote in the editor'},
      'Bold': {id: 'Bold', value: 'Vet', comment: 'Make text Bold'},
      'Bookmarked': {id: 'Bookmarked', value: 'Als favoriet opgeslagen', comment: 'Bookmark filled - Element is already bookmarked'},
      'BookmarkThis': {id: 'BookmarkThis', value: 'Als favoriet opslaan', comment: 'Bookmark outlined'},
      'Breadcrumb': {id: 'Breadcrumb', value: 'Broodkruimel', comment: 'Text describing the Breadcrumb'},
      'BulletedList': {id: 'BulletedList', value: 'Opsommingslijst', comment: 'Bulleted List tooltip'},
      'Calendar': {id: 'Calendar', value: 'Kalender', comment: 'Inline Text for the title of the Calendar control'},
      'Camera': {id: 'Camera', value: 'Camera', comment: 'Camera tooltip'},
      'Cancel': {id: 'Cancel', value: 'Annuleren', comment: 'Cancel tooltip'},
      'CapsLockOn': {id: 'CapsLockOn', value: 'Caps Lock-toets is ingeschakeld', comment: 'Caps Lock On message'},
      'Cart': {id: 'Cart', value: 'Mandje', comment: 'Cart tooltip'},
      'CenterText': {id: 'CenterText', value: 'Centreren', comment: 'An Icon Tooltip'},
      'CharactersLeft': {id: 'CharactersLeft', value: 'Resterende tekens {0}', comment: 'indicator showing how many more characters you can type.'},
      'CharactersMax': {id: 'CharactersMax', value: 'Maximum aantal invoertekens ', comment: 'indicator showing how many max characters you can type.'},
      'ChangeSelection': {id: 'ChangeSelection', value: '. Gebruik de pijltjestoetsen om de selectie te wijzigen.', comment: 'Audible Text for drop down list help'},
      'Checkbox': {id: 'Checkbox', value: 'Selectievakje', comment: 'Checkbox tooltip'},
      'Checked': {id: 'Checked', value: 'Ingeschakeld', comment: 'Checked tooltip'},
      'Clear': {id: 'Clear', value: 'Wissen', comment: 'Tooltip for a Clear Action'},
      'Clock': {id: 'Clock', value: 'Klok', comment: 'Clock tooltip'},
      'Close': {id: 'Close', value: 'Sluiten', comment: 'Tooltip for a Close Button Action'},
      'Copy': {id: 'Copy', value: 'Kopiëren', comment: 'Copy tooltip'},
      'Collapse': {id: 'Collapse', value: 'Invouwen', comment: 'Collapse / close a tree/submenu'},
      'CollapseAppTray': {id: 'CollapseAppTray', value: 'Toepassingsbalk invouwen', comment: 'Collapse App Tray tooltip'},
      'Columns': {id: 'Columns', value: 'Kolommen', comment: 'Columns tooltip'},
      'Component': {id: 'Component', value: 'Component', comment: 'As in a UI component - building block.'},
      'Compose': {id: 'Compose', value: 'Samenstellen', comment: 'Compose tooltip'},
      'Completed': {id: 'Completed', value: 'Voltooid', comment: 'Text For a Completed Status'},
      'Confirm': {id: 'Confirm', value: 'Bevestigen', comment: 'Confirm tooltip'},
      'Contains': {id: 'Contains', value: 'Bevat', comment: 'Contains in icons for filtering'},
      'Cut': {id: 'Cut', value: 'Knippen', comment: 'Cut tooltip'},
      'Date': {id: 'Date', value: 'Datum', comment: 'Describes filtering by a date data type'},
      'Delete': {id: 'Delete', value: 'Verwijderen', comment: 'Delete Toolbar Action Tooltip'},
      'DistributeHoriz': {id: 'DistributeHoriz', value: 'Horizontaal verdelen', comment: 'Icon button tooltip for action that distributes elements across Horizontally'},
      'Document': {id: 'Document', value: 'Document', comment: 'Document tooltip'},
      'Dirty': {id: 'Dirty', value: 'Rij is gewijzigd', comment: 'Record is dirty / modified'},
      'Drilldown': {id: 'Drilldown', value: 'Drill down', comment: 'Drill by moving page flow into a record'},
      'Drillup': {id: 'Drillup', value: 'Drill up', comment: 'Opposite of Drilldown, move back up to a larger set of records'},
      'Dropdown': {id: 'Dropdown', value: 'Keuzelijst', comment: 'Dropdown'},
      'DoesNotContain': {id: 'DoesNotContain', value: 'Bevat niet', comment: 'Does Not Contain in icons for filtering'},
      'DoesNotEqual': {id: 'DoesNotEqual', value: 'Is niet gelijk aan', comment: 'Does Not Equal in icons for filtering'},
      'Down': {id: 'Down', value: 'Omlaag', comment: 'Down tooltip'},
      'Download': {id: 'Download', value: 'Downloaden', comment: 'Download tooltip'},
      'Duplicate': {id: 'Duplicate', value: 'Kopiëren', comment: 'Duplicate tooltip'},
      'EitherSelectedOrNotSelected': {id: 'EitherSelectedOrNotSelected', value: 'Ingeschakeld of Uitgeschakeld', comment: 'Either Selected Or NotSelected in icons for filtering'},
      'EnterComments': {id: 'EnterComments', value: 'Voer hier opmerkingen in...', comment: 'Placeholder text for a text input (comments)'},
      'Error': {id: 'Error', value: 'Fout', comment: 'Title, Spoken Text describing fact an error has occured'},
      'ErrorAllowedTypes': {id: 'ErrorAllowedTypes', value: 'Bestandstype is niet toegestaan', comment: 'Error string for file-upload'},
      'ErrorMaxFileSize': {id: 'ErrorMaxFileSize', value: 'Limiet bestandsgrootte overschreden', comment: 'Error string for file-upload'},
      'ErrorMaxFilesInProcess': {id: 'ErrorMaxFilesInProcess', value: 'Toegestane limiet maximum aantal bestanden overschreden', comment: 'Error string for file-upload'},
      'EmailValidation': {id: 'EmailValidation', value: 'E-mailadres niet geldig', comment: 'This the rule for email validation'},
      'Emerald': {id: 'Emerald', value: 'Smaragd', comment: 'Color in our color pallette'},
      'Expand': {id: 'Expand', value: 'Uitvouwen', comment: 'Expand open a tree/submenu'},
      'Expand1x': {id: 'Expand1x', value: 'Expand Times One', comment: 'Expands one time - on the app tray'},
      'ExpandAppTray': {id: 'ExpandAppTray', value: 'Toepassingsbalk uitvouwen', comment: 'ExpandAppTray tooltip'},
      'ExpandCollapse': {id: 'ExpandCollapse', value: 'Uitvouwen / invouwen', comment: 'Text to toggle a button in a container.'},
      'ExportAsSpreadsheet': {id: 'ExportAsSpreadsheet', value: 'Als rekenblad exporteren', comment: 'Export as Spreadsheet tooltip'},
      'Edit': {id: 'Edit', value: 'Bewerken', comment: 'Edit tooltip'},
      'Equals': {id: 'Equals', value: 'Is gelijk aan', comment: 'Equals in icons for filtering'},
      'ExitFullView': {id: 'ExitFullView', value: 'Volledige weergave beëindigen', comment: 'Exit Full View tooltip'},
      'Export': {id: 'Export', value: 'Exporteren', comment: 'Export tooltip'},
      'ExportToExcel': {id: 'ExportToExcel', value: 'Naar Excel exporteren', comment: 'Export To Excel menu option in datagrid'},
      'Favorite': {id: 'Favorite', value: 'Favoriet', comment: 'A favorite item'},
      'FileUpload': {id: 'FileUpload', value: 'Bestand uploaden. Druk op Enter om naar een bestand te bladeren.', comment: 'Screen Reader instructions'},
      'Filter': {id: 'Filter', value: 'Filter', comment: 'Filter tooltip'},
      'FirstPage': {id: 'FirstPage', value: 'Eerste pagina', comment: 'First Page tooltip'},
      'Folder': {id: 'Folder', value: 'Map', comment: 'Folder tooltip'},
      'FullView': {id: 'FullView', value: 'Volledige weergave', comment: 'Full View tooltip'},
      'GoForward': {id: 'GoForward', value: 'Vooruit', comment: 'Move Page / object this direction'},
      'GoBack': {id: 'GoBack', value: 'Terug', comment: 'Move Page / object this directionp'},
      'GoDown': {id: 'GoDown', value: 'Omlaag', comment: 'Move Page / object this directionp'},
      'GoUp': {id: 'GoUp', value: 'Omhoog', comment: 'Move Page / object this direction'},
      'Graphite': {id: 'Graphite', value: 'Grafiet', comment: 'Color in our color pallette'},
      'GreaterOrEquals': {id: 'GreaterOrEquals', value: 'Groter dan of gelijk aan', comment: 'Greater Or Equals in icons for filtering'},
      'GreaterThan': {id: 'GreaterThan', value: 'Groter dan', comment: 'Greater Than in icons for filtering'},
      'Grid': {id: 'Grid', value: 'Raster', comment: 'Grid tooltip'},
      'Hours': {id: 'Hours', value: 'Uren', comment: 'the hour portion of a time'},
      'HeadingThree': {id: 'HeadingThree', value: 'Kop drie', comment: 'Heading Three tooltip'},
      'HeadingFour': {id: 'HeadingFour', value: 'Kop vier', comment: 'Heading Four tooltip'},
      'Highest': {id: 'Highest', value: 'Hoogste', comment: 'Highest Four tooltip'},
      'Home': {id: 'Home', value: 'Thuis', comment: 'Home tooltip'},
      'HtmlView': {id: 'HtmlView', value: 'HTML-weergave', comment: 'Html View tooltip'},
      'Image': {id: 'Image', value: 'Beeld', comment: 'Image of something'},
      'Import': {id: 'Import', value: 'Importeren', comment: 'Import tooltip'},
      'Info': {id: 'Info', value: 'Info', comment: 'Info tooltip'},
      'InProgress': {id: 'In Progress', value: 'In uitvoering', comment: 'Info tooltip that an action is in progress'},
      'InsertAnchor': {id: 'InsertAnchor', value: 'Anker invoegen', comment: 'Insert Acnhor (link) in an editor'},
      'InsertImage': {id: 'InsertImage', value: 'Afbeelding invoegen', comment: 'Insert Image in an editor'},
      'Italic': {id: 'Italic', value: 'Cursief', comment: 'Make Text Italic'},
      'InvalidDate': {id: 'InvalidDate', value: 'Ongeldige datum', comment: 'validation message for wrong date format (short)'},
      'InvalidTime': {id: 'InvalidTime', value: 'Ongeldige tijd', comment: 'validation message for wrong time format'},
      'Inventory': {id: 'Inventory', value: 'Voorraad', comment: 'Icon button tooltop for Inventory Action'},
      'IsEmpty': {id: 'IsEmpty', value: 'Is leeg', comment: 'Is Empty in icons for filtering'},
      'IsNotEmpty': {id: 'IsNotEmpty', value: 'Is niet leeg', comment: 'Is Not Empty in icons for filtering'},
      'ItemsSelected': {id: 'ItemsSelected', value: 'Artikelen geselecteerd', comment: 'Num of Items selected for swaplist'},
      'JustifyCenter': {id: 'JustifyCenter', value: 'Centreren', comment: 'justify text to center in the editor'},
      'JustifyLeft': {id: 'JustifyLeft', value: 'Links uitlijnen', comment: 'justify text to left in the editor'},
      'JustifyRight': {id: 'JustifyRight', value: 'Rechts uitlijnen', comment: 'justify text to right in the editor'},
      'Keyword': {id: 'Keyword', value: 'Trefwoord', comment: 'Describes filtering by a keyword search'},
      'Launch': {id: 'Launch', value: 'Starten', comment: 'Launch'},
      'LastPage': {id: 'LastPage', value: 'Laatste pagina', comment: 'Last Page tooltip'},
      'Left': {id: 'Left', value: 'Links', comment: 'Left tooltip'},
      'LessOrEquals': {id: 'LessOrEquals', value: 'Kleiner dan of gelijk aan', comment: 'Less Or Equals in icons for filtering'},
      'LessThan': {id: 'LessThan', value: 'Kleiner dan', comment: 'Less Than in icons for filtering'},
      'Link': {id: 'Link', value: 'Koppelen', comment: 'Link - as in hyperlink - icon tooltop'},
      'Load': {id: 'Load', value: 'Laden', comment: 'Load icon tooltip'},
      'Loading': {id: 'Loading', value: 'Laden', comment: 'Text below spinning indicator to indicate loading'},
      'Locked': {id: 'Locked', value: 'Geblokkeerd', comment: 'Locked tooltip'},
      'Logout': {id: 'Logout', value: 'Afmelden', comment: 'Log out of the application'},
      'Lookup': {id: 'Lookup', value: 'Zoeken', comment: 'Lookup - As in looking up a record or value'},
      'Lowest': {id: 'Lowest', value: 'Laagste', comment: 'Lowest - As in Lowest value'},
      'Mail': {id: 'Mail', value: 'Post', comment: 'Mail tooltip'},
      'MapPin': {id: 'MapPin', value: 'Vastpinnen', comment: 'Map Pin tooltip'},
      'Maximize': {id: 'Maximize', value: 'Maximaliseren', comment: 'Maximize a screen or dialog in the UI'},
      'Median': {id: 'Median', value: 'Mediaan', comment: 'Median in Mathematics'},
      'Medium': {id: 'Medium', value: 'Gemiddeld', comment: 'Describes a Medium sized Row Height in a grid/list'},
      'Menu': {id: 'Menu', value: 'Menu', comment: 'Menu tooltip'},
      'MingleShare': {id: 'MingleShare', value: 'Delen met Ming.le', comment: 'Share the contextual object/action in the mingle system'},
      'Minutes': {id: 'Minutes', value: 'Minuten', comment: 'the minutes portion of a time'},
      'Minimize': {id: 'Minimize', value: 'Minimaliseren', comment: 'Minimize tooltip'},
      'Minus': {id: 'Minus', value: 'Minus', comment: 'Minus tooltip'},
      'Mobile': {id: 'Mobile', value: 'Mobiel', comment: 'Indicates a mobile device (phone tablet ect)'},
      'More': {id: 'More', value: 'Meer...', comment: 'Text Indicating More Buttons or form content'},
      'MoreActions': {id: 'MoreActions', value: 'Meer acties', comment: 'Text on the More Actions button indictating hidden functions'},
      'MsgDirty': {id: 'MsgDirty', value: ', gewijzigd', comment: 'for modified form fields'},
      'NewDocument': {id: 'NewDocument', value: 'Nieuw document', comment: 'New Document tooltip'},
      'Next': {id: 'Next', value: 'Volgende', comment: 'Next in icons tooltip'},
      'NextPage': {id: 'NextPage', value: 'Volgende pagina', comment: 'Next on Pager'},
      'NextMonth': {id: 'NextMonth', value: 'Volgende maand', comment: 'the label for the button that moves calendar to next/prev'},
      'NoResults': {id: 'NoResults', value: 'Geen resultaten', comment: 'Search Results Text'},
      'Normal': {id: 'Normal', value: 'Normaal', comment: 'Normal row height'},
      'Notes': {id: 'Notes', value: 'Notities', comment: 'Notes icon tooltip'},
      'NotSelected': {id: 'NotSelected', value: 'Niet geselecteerd', comment: 'Not Selected in icons for filtering'},
      'NumberList': {id: 'NumberList', value: 'Nummerlijst', comment: 'Number List tooltip'},
      'OpenBackClose': {id: 'OpenBackClose', value: 'Openen / Terug / Sluiten', comment: 'Open / Back / Close tooltip'},
      'OpenClose': {id: 'OpenClose', value: 'Openen / Sluiten', comment: 'Open / Close tooltip'},
      'OrderedList': {id: 'OrderedList', value: 'Opsommingslijst invoeren/verwijderen', comment: 'Insert an Ordered list in the editor'},
      'Page': {id: 'Page', value: 'pagina ', comment: 'Text on the pager links'},
      'PageOf': {id: 'PageOf', value: 'Pagina {0} van {1}', comment: 'Pager Text Showing current and number of pages'},
      'PageOn': {id: 'PageOn', value: 'U bent nu op pagina ', comment: 'Text on the pager links'},
      'Paste': {id: 'Paste', value: 'Plakken', comment: 'Paste icon tooltip'},
      'PasswordValidation': {id: 'PasswordValidation', value: '<strong>Wachtwoord moet aan de volgende criteria voldoen:</strong><br>Ten minste 10 tekens lang zijn<br>Ten minste één hoofdletter bevatten<br>Ten minste één kleine letter bevatten<br>Eén speciaal teken bevatten<br>Mag niet uw gebruikersnaam bevatten<br>Mag geen eerder gebruikt wachtwoord zijn<br>', comment: 'Password validation requirements'},
      'PasswordConfirmValidation': {id: 'PasswordConfirmValidation', value: 'Wachtwoord moet overeenkomen', comment: 'Password Confirm validation'},
      'Peak': {id: 'Peak', value: 'Maximum', comment: 'the max or peak value in a chart'},
      'PersonalizeColumns': {id: 'PersonalizeColumns', value: 'Kolommen personaliseren', comment: 'Customize Columns in a Grid'},
      'Period': {id: 'Period', value: 'Periode', comment: 'the am/pm portion of a time'},
      'PressDown': {id: 'PressDown', value: 'Druk op Pijltje omlaag-toets om een datum te selecteren', comment: 'the audible label for Tooltip about how to operate the date picker'},
      'PressShiftF10': {id: 'PressShiftF10', value: 'Druk op Shift+F10 om het contextmenu te openen.', comment: 'the audible infor for screen readers on how to use a field with a popup menu'},
      'Previous': {id: 'Previous', value: 'Vorige', comment: 'Previous icon tooltip - moved to previous record'},
      'PreviousMonth': {id: 'PreviousMonth', value: 'Vorige maand', comment: 'the label for the button that moves calendar to next/prev'},
      'PreviousPage': {id: 'PreviousPage', value: 'Vorige pagina', comment: 'Previous Page tooltip'},
      'Print': {id: 'Print', value: 'Afdrukken', comment: 'Print tooltip'},
      'Range': {id: 'Range', value: 'Bereik', comment: 'Range for tooltip'},
      'RecordsPerPage': {id: 'RecordsPerPage', value: '{0} records per pagina', comment: 'Dropd own allows the user to select how many visible records {} shows select value.'},
      'Redo': {id: 'Redo', value: 'Opnieuw uitvoeren', comment: 'Redo tooltip'},
      'Refresh': {id: 'Refresh', value: 'Vernieuwen', comment: 'Refresh tooltip'},
      'Required': {id: 'Required', value: 'Vereist', comment: 'indicates a form field is manditory'},
      'Reset': {id: 'Reset', value: 'Herstellen', comment: 'Reset tooltip'},
      'Results': {id: 'Results', value: 'Resultaten', comment: 'As in showing N Results in a List'},
      'RightAlign': {id: 'RightAlign', value: 'Rechts uitlijnen', comment: 'Right Align tooltip'},
      'RightAlignText': {id: 'RightAlignText', value: 'Rechts uitlijnen', comment: 'Right Align Text tooltip'},
      'Right': {id: 'Right', value: 'Rechts', comment: 'Right'},
      'Roles': {id: 'Roles', value: 'Rollen', comment: 'Roles tooltip'},
      'RowHeight': {id: 'RowHeight', value: 'Rijhoogte', comment: 'Describes the Height for Rows in a Data Grid'},
      'Ruby': {id: 'Ruby', value: 'Robijn', comment: 'Color in our color pallette'},
      'Save': {id: 'Save', value: 'Opslaan', comment: 'Save tooltip'},
      'SaveCurrentView': {id: 'SaveCurrentView', value: 'Huidige weergave opslaan', comment: 'Datagrids contain view sets. This menu option saves them'},
      'SavedViews': {id: 'SavedViews', value: 'Opgeslagen weergaven', comment: 'Label for a list of Views'},
      'Search': {id: 'Search', value: 'Zoeken', comment: 'Search tooltip'},
      'SearchColumnName': {id: 'SearchColumnName', value: 'Naar een kolomnaam zoeken', comment: 'Search for a datagrid column by name'},
      'SearchFolder': {id: 'SearchFolder', value: 'Map doorzoeken', comment: 'Search Folder tooltip'},
      'SearchList': {id: 'SearchList', value: 'Lijst doorzoeken', comment: 'Search List tooltip'},
      'Select': {id: 'Select', value: 'Selecteren', comment: 'text describing a select action'},
      'Selected': {id: 'Selected', value: 'Geselecteerd', comment: 'text describing a selected object'},
      'Send': {id: 'Send', value: 'Verzenden', comment: 'Send tooltip'},
      'SetTime': {id: 'SetTime', value: 'Tijd instellen', comment: 'button text that inserts time when clicked'},
      'Settings': {id: 'Settings', value: 'Instellingen', comment: 'Settings tooltip'},
      'Short': {id: 'Short', value: 'Verkort', comment: 'Describes a Shorted Row Height in a grid/list'},
      'ShowLess': {id: 'ShowLess', value: 'Minder weergeven', comment: 'Show less form content'},
      'ShowMore': {id: 'ShowMore', value: 'Meer weergeven', comment: 'Show more form content'},
      'Slate': {id: 'Slate', value: 'Leisteen', comment: 'Color in our color pallette'},
      'SliderHandle': {id: 'SliderHandle', value: 'Greep voor', comment: 'Description of the portion of a Slider control that is focusable and changes its value, followed in code by the name of the control'},
      'SliderMaximumHandle': {id: 'SliderMaximumHandle', value: 'Greep maximumbereik voor', comment: 'Describes a maximum value handle in a Range (double slider), followed in code by the name of the control'},
      'SliderMinimumHandle': {id: 'SliderMinimumHandle', value: 'Greep minimumbereik voor', comment: 'Describes a minimum value handle in a Range (double slider), followed in code by the name of the control'},
      'SkipToMain': {id: 'SkipToMain', value: 'Direct door naar hoofdinhoud', comment: 'Skip link in header, jumps when clicked on to main area'},
      'StrikeThrough': {id: 'StrikeThrough', value: 'Doorhalen', comment: 'turn on and off strike through text in text editor (like word)'},
      'SortAtoZ': {id: 'SortAtoZ', value: 'Oplopend sorteren', comment: 'Sort A to Z in icons for filtering'},
      'SortZtoA': {id: 'SortZtoA', value: 'Aflopend sorteren', comment: 'Sort Z to A in icons for filtering'},
      'SortDown': {id: 'SortDown', value: 'Omlaag sorteren', comment: 'Sort Down tooltip'},
      'SortUp': {id: 'SortUp', value: 'Omhoog sorteren', comment: 'Sort Up tooltip'},
      'Subscript': {id: 'Subscript', value: 'Onderschrift', comment: 'Turn on and off Subscript text in text editor (like word)'},
      'Superscript': {id: 'Superscript', value: 'Bovenschrift', comment: 'Turn on and off Superscript text in text editor (like word)'},
      'Tabs': {id: 'Tabs', value: 'Tabbladen...', comment: 'Used in the Tabs Control\'s more menu, preceeded by a number that describes how many tabs are in the spillover menu'},
      'Tack': {id: 'Tack', value: 'Vastpinnen', comment: 'Pin an object'},
      'Tall': {id: 'Tall', value: 'Hoogte', comment: 'Describes a Taller Row Height in a grid/list'},
      'Timer': {id: 'Timer', value: 'Timer', comment: 'Timer tooltip'},
      'Today': {id: 'Today', value: 'Vandaag', comment: 'refering to today on a calendar'},
      'ToggleBold': {id: 'ToggleBold', value: 'Vet aan/uit', comment: 'turn on and off bold in text editor (like word)'},
      'ToggleH3': {id: 'ToggleH3', value: 'Kop 3 wel/niet weergeven', comment: 'turn on and off heading 3 text'},
      'ToggleH4': {id: 'ToggleH4', value: 'Kop 4 wel/niet weergeven', comment: 'turn on and off heading 4 text'},
      'ToggleItalic': {id: 'ToggleItalic', value: 'Cursief aan/uit', comment: 'turn on and off Italic in text editor (like word)'},
      'ToggleUnderline': {id: 'ToggleUnderline', value: 'Onderstrepen aan/uit', comment: 'turn on and off Underline in text editor (like word)'},
      'Toolbar': {id: 'Toolbar', value: 'Werkbalk', comment: 'describing the toolbar component'},
      'TopAlign': {id: 'TopAlign', value: 'Boven uitlijnen', comment: 'Top Align tooltip'},
      'Total': {id: 'Total', value: 'Totaal', comment: 'Mathematic total of a calculation'},
      'TreeCollapse': {id: 'TreeCollapse', value: 'Structuur invouwen', comment: 'Tree Collapse tooltip'},
      'TreeExpand': {id: 'TreeExpand', value: 'Structuur uitvouwen', comment: 'Tree Expand tooltip'},
      'Turquoise': {id: 'Turquoise', value: 'Turkoise', comment: 'Color in our color pallette'},
      'Up': {id: 'Up', value: 'Omhoog', comment: 'Up tooltip'},
      'Upload': {id: 'Upload', value: 'Uploaden', comment: 'Upload tooltip'},
      'UnavailableDate': {id: 'UnavailableDate', value: 'Niet-beschikbare datum', comment: 'Unavailable Date Text'},
      'Underline': {id: 'Underline', value: 'Onderstrepen', comment: 'Make text Underlined'},
      'Undo': {id: 'Undo', value: 'Ongedaan maken', comment: 'Undo tooltip'},
      'Unlocked': {id: 'Unlocked', value: 'Gedeblokkeerd', comment: 'Unlocked tooltip'},
      'UnorderedList': {id: 'UnorderedList', value: 'Opsommingslijst invoeren/verwijderen', comment: 'Insert an Unordered list in the editor'},
      'Unsupported': {id: 'Unsupported', value: 'Deze inhoud is niet beschikbaar, omdat hiervoor gebruik wordt gemaakt van functies die niet in uw huidige browserversie worden ondersteund.', comment: 'Suggesting browser upgrade for missing features.'},
      'Url': {id: 'Url', value: 'URL', comment: 'Url tooltip'},
      'UseArrow': {id: 'UseArrow', value: '. Gebruik pijltjestoetsen om te selecteren.', comment: 'Instructional comments for screen readers'},
      'UseEnter': {id: 'UseEnter', value: '. Gebruik de toetsen Enter of Pijltje omlaag om te zoeken.', comment: 'Instructional comments for screen readers'},
      'User': {id: 'User', value: 'Gebruiker', comment: 'User tooltip'},
      'UserProfile': {id: 'UserProfile', value: 'Gebruikersprofiel', comment: 'User Profile tooltip'},
      'VerticalMiddleAlign': {id: 'VerticalMiddleAlign', value: 'Verticaal in het midden uitlijnen', comment: 'Vertical Align tooltip'},
      'ViewSource': {id: 'ViewSource', value: 'Bron weergeven', comment: 'Toggle the source view in the editor'},
      'ViewVisual': {id: 'ViewVisual', value: 'Visuele weergave', comment: 'Toggle the visual view in the editor'}
    }
  });
}));
