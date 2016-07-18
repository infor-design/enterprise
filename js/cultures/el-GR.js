(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module
    define('cultures/el-GR', ['jquery'], factory);
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
  Locale.addCulture('el-GR', {
    //layout/language
    language: 'el',
      englishName: 'Greek (Greece)',
    nativeName: 'Ελληνικά (Ελλάδα)',
    //layout/orientation/@characters
    direction: 'left-to-right',
    //ca-gregorian
    calendars: [{
      name: 'gregorian',
      //ca-gregorian/main/dates/calendars/gregorian/dateFormats/
      dateFormat: {'separator': '/', //Infered
                   'timeSeparator': ':',
                   'short': 'd/M/yyyy', //use four digit year
                   'medium': 'd MMM yyyy',
                   'long': 'd MMMM yyyy',
                   'full': 'EEEE, d MMMM yyyy',
                   'month': 'dd MMMM',
                   'year': 'MMMM yyyy',
                   'timestamp': 'h:mm:ss a',
                   'datetime': 'd/M/yyyy h:mm a'}, //Infered short + short gregorian/dateTimeFormats
      //ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated (2 digit)
      days: {
         wide: ['Κυριακή','Δευτέρα','Τρίτη','Τετάρτη','Πέμπτη','Παρασκευή','Σάββατο'],
         abbreviated: ['Κυ','Δε','Τρ','Τε','Πε','Πα','Σά'],
         narrow: ['Κ', 'Δ', 'Τ', 'Τ', 'Π', 'Π', 'Σ']
      },
      //ca-gregorian/main/dates/calendars/gregorian/months/format/wide
      months: {
        wide: ['Ιανουαρίου', 'Φεβρουαρίου', 'Μαρτίου', 'Απριλίου', 'Μαΐου', 'Ιουνίου', 'Ιουλίου', 'Αυγούστου', 'Σεπτεμβρίου', 'Οκτωβρίου', 'Νοεμβρίου', 'Δεκεμβρίου'],
        abbreviated: ['Ιαν', 'Φεβ', 'Μαρ', 'Απρ', 'Μαΐ', 'Ιουν', 'Ιουλ', 'Αυγ', 'Σεπ', 'Οκτ', 'Νοε', 'Δεκ']
      },
      //ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
      timeFormat: 'h:mm a',
      //ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
      dayPeriods: ['π.μ.', 'μ.μ.']
    }],
    //numbers/currencyFormats-numberSystem-latn/standard (Replace Sign http://www.currencysymbols.in ?)
    currencySign: '€', //(Replace Sign http://www.currencysymbols.in ?)
    currencyFormat: '#,##0.00 ¤',
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
      'AboutText': {id: 'AboutText', value: 'Πνευματικά δικαιώματα &copy; {0} Infor. Με επιφύλαξη κάθε νόμιμου δικαιώματος. Τα λεκτικά και σχεδιαστικά σήματα που παρατίθενται στο παρόν είναι εμπορικά και/ή κατατεθέντα σήματα της Infor και/ή των θυγατρικών της. Με επιφύλαξη κάθε νόμιμου δικαιώματος. Όλα τα υπόλοιπα εμπορικά σήματα που παρατίθενται στο παρόν ανήκουν στους αντίστοιχους ιδιοκτήτες τους'},
      'Actions': {id: 'Actions', value: 'Ενέργειες', comment: 'Tooltip text for the action button with additional in context actions'},
      'Add': {id: 'Add', value: 'Προσθήκη', comment: 'Add'},
      'AdvancedFilter': {id: 'AdvancedFilter', value: 'Δημιουργία σύνθετου φίλτρου', comment: 'In a data grid active an advanced filtering feature'},
      'Alert': {id: 'Alert', value: 'Ειδοποίηση', comment: 'Alert'},
      'AllResults': {id: 'AllResults', value: 'Όλα τα αποτελέσματα για', comment: 'Search Results Text'},
      'AligntoBottom': {id: 'AligntoBottom', value: 'Στοίχιση κάτω μέρους', comment: 'Align to Bottom tooltip'},
      'AlignCenterHorizontally': {id: 'AlignCenterHorizontally', value: 'Κέντρο οριζόντιας στοίχισης', comment: 'Align Center Horizontally tooltip'},
      'Amber': {id: 'Amber', value: 'Φαιοκίτρινο', comment: 'Color in our color pallette'},
      'Amethyst': {id: 'Amethyst', value: 'Αμέθυστος', comment: 'Color in our color pallette'},
      'Apply': {id: 'Apply', value: 'Εφαρμογή', comment: 'Text in a button to apply an action'},
      'Attach': {id: 'Attach', value: 'Επισύναψη', comment: 'Attach'},
      'Azure': {id: 'Azure', value: 'Γαλάζιο', comment: 'Color in our color pallette'},
      'Between': {id: 'Between', value: 'Μεταξύ', comment: 'Between in icons for filtering'},
      'Blockquote': {id: 'Blockquote', value: 'Αποκλεισμός προσφοράς', comment: 'insert a block quote in the editor'},
      'Bold': {id: 'Bold', value: 'Έντονη γραφή', comment: 'Make text Bold'},
      'Bookmarked': {id: 'Bookmarked', value: 'Με σελιδοδείκτη', comment: 'Bookmark filled'},
      'BookmarkThis': {id: 'BookmarkThis', value: 'Δημιουργία σελιδοδείκτη', comment: 'Bookmark outlined'},
      'Breadcrumb': {id: 'Breadcrumb', value: 'Δυναμική διαδρομή', comment: 'Text describing the Breadcrumb'},
      'BulletedList': {id: 'BulletedList', value: 'Λίστα με κουκκίδες', comment: 'Bulleted List tooltip'},
      'Calendar': {id: 'Calendar', value: 'Ημερολόγιο', comment: 'Inline Text for the title of the Calendar control'},
      'Camera': {id: 'Camera', value: 'Κάμερα', comment: 'Camera tooltip'},
      'Cancel': {id: 'Cancel', value: 'Άκυρο', comment: 'Cancel tooltip'},
      'CapsLockOn': {id: 'CapsLockOn', value: 'Κλείδωμα κεφαλαίων ενεργοποιημένο', comment: 'Caps Lock On message'},
      'Cart': {id: 'Cart', value: 'Καλάθι', comment: 'Cart tooltip'},
      'CenterText': {id: 'CenterText', value: 'Κέντρο', comment: 'An Icon Tooltip'},
      'CharactersLeft': {id: 'CharactersLeft', value: 'Χαρακτήρες αριστερά {0}', comment: 'indicator showing how many more characters you can type.'},
      'CharactersMax': {id: 'CharactersMax', value: 'Μέγιστος αριθμός χαρακτήρων των ', comment: 'indicator showing how many max characters you can type.'},
      'ChangeSelection': {id: 'ChangeSelection', value: '- Για να αλλάξετε την επιλογή, χρησιμοποιήστε τα πλήκτρα βέλους.', comment: 'Audible Text for drop down list help'},
      'Checkbox': {id: 'Checkbox', value: 'Πλαίσιο ελέγχου', comment: 'Checkbox tooltip'},
      'Checked': {id: 'Checked', value: 'Επιλεγμένο', comment: 'Checked tooltip'},
      'Clear': {id: 'Clear', value: 'Απαλοιφή', comment: 'Tooltip for a Clear Action'},
      'Clock': {id: 'Clock', value: 'Ρολόι', comment: 'Clock tooltip'},
      'Close': {id: 'Close', value: 'Κλείσιμο', comment: 'Tooltip for a Close Button Action'},
      'Copy': {id: 'Copy', value: 'Αντιγραφή', comment: 'Copy tooltip'},
      'Collapse': {id: 'Collapse', value: 'Σύμπτυξη', comment: 'Collapse / close a tree/submenu'},
      'CollapseAppTray': {id: 'CollapseAppTray', value: 'Σύμπτυξη περιοχής εφαρμογών', comment: 'Collapse App Tray tooltip'},
      'Columns': {id: 'Columns', value: 'Στήλες', comment: 'Columns tooltip'},
      'Compose': {id: 'Compose', value: 'Σύνθεση', comment: 'Compose tooltip'},
      'Completed': {id: 'Completed', value: 'Ολοκληρώθηκε', comment: 'Text For a Completed Status'},
      'Confirm': {id: 'Confirm', value: 'Επιβεβαίωση', comment: 'Confirm tooltip'},
      'Contains': {id: 'Contains', value: 'Περιέχει', comment: 'Contains in icons for filtering'},
      'Cut': {id: 'Cut', value: 'Αποκοπή', comment: 'Cut tooltip'},
      'Date': {id: 'Date', value: 'Ημερομηνία', comment: 'Describes filtering by a date data type'},
      'Delete': {id: 'Delete', value: 'Διαγραφή', comment: 'Delete Toolbar Action Tooltip'},
      'DistributeHoriz': {id: 'DistributeHoriz', value: 'Διανομή οριζοντίως', comment: 'Icon button tooltip for action that distributes elements across Horizontally'},
      'Document': {id: 'Document', value: 'Έγγραφο', comment: 'Document tooltip'},
      'Drilldown': {id: 'Drilldown', value: 'Ανάλυση', comment: 'Drill by moving page flow into a record'},
      'Drillup': {id: 'Drillup', value: 'Γενίκευση', comment: 'Opposite of Drilldown, move back up to a larger set of records'},
      'Dropdown': {id: 'Dropdown', value: 'Αναπτυσσόμενο', comment: 'Dropdown'},
      'DoesNotContain': {id: 'DoesNotContain', value: 'Δεν περιέχει', comment: 'Does Not Contain in icons for filtering'},
      'DoesNotEqual': {id: 'DoesNotEqual', value: 'Δεν ισούται με', comment: 'Does Not Equal in icons for filtering'},
      'Down': {id: 'Down', value: 'Κάτω', comment: 'Down tooltip'},
      'Download': {id: 'Download', value: 'Λήψη', comment: 'Download tooltip'},
      'Duplicate': {id: 'Duplicate', value: 'Διπλότυπο', comment: 'Duplicate tooltip'},
      'EitherSelectedOrNotSelected': {id: 'EitherSelectedOrNotSelected', value: 'Είτε επιλεγμένο είτε Μη επιλεγμένο', comment: 'Either Selected Or NotSelected in icons for filtering'},
      'EnterComments': {id: 'EnterComments', value: 'Καταχωρίστε σχόλια εδώ...', comment: 'Placeholder text for a text input (comments)'},
      'Error': {id: 'Error', value: 'Σφάλμα', comment: 'Title, Spoken Text describing fact an error has occured'},
      'EmailValidation': {id: 'EmailValidation', value: 'Μη έγκυρη διεύθυνση email', comment: 'This the rule for email validation'},
      'Emerald': {id: 'Emerald', value: 'Σμαραγδί', comment: 'Color in our color pallette'},
      'Expand': {id: 'Expand', value: 'Ανάπτυξη', comment: 'Expand open a tree/submenu'},
      'ExpandAppTray': {id: 'ExpandAppTray', value: 'Ανάπτυξη περιοχής εφαρμογών', comment: 'ExpandAppTray tooltip'},
      'ExpandCollapse': {id: 'ExpandCollapse', value: 'Ανάπτυξη / Σύμπτυξη', comment: 'Text to toggle a button in a container.'},
      'ExportAsSpreadsheet': {id: 'ExportAsSpreadsheet', value: 'Εξαγωγή ως υπολογιστικό φύλλο', comment: 'Export as Spreadsheet tooltip'},
      'Edit': {id: 'Edit', value: 'Επεξεργασία', comment: 'Edit tooltip'},
      'Equals': {id: 'Equals', value: 'Ισούται με', comment: 'Equals in icons for filtering'},
      'ExitFullView': {id: 'ExitFullView', value: 'Έξοδος από την Πλήρη προβολή', comment: 'Exit Full View tooltip'},
      'Export': {id: 'Export', value: 'Εξαγωγή ', comment: 'Export tooltip'},
      'FileUpload': {id: 'FileUpload', value: 'Αποστολή αρχείου Πατήστε το Enter για να αναζητήσετε κάποιο αρχείο', comment: 'Screen Reader instructions'},
      'Filter': {id: 'Filter', value: 'Φίλτρο', comment: 'Filter tooltip'},
      'FirstPage': {id: 'FirstPage', value: 'Πρώτη σελίδα', comment: 'First Page tooltip'},
      'Folder': {id: 'Folder', value: 'Φάκελος', comment: 'Folder tooltip'},
      'FullView': {id: 'FullView', value: 'Πλήρης προβολή', comment: 'Full View tooltip'},
      'GoForward': {id: 'GoForward', value: 'Μετακίνηση προς τα εμπρός', comment: 'Move Page / object this direction'},
      'GoBack': {id: 'GoBack', value: 'Μετακίνηση προς τα πίσω', comment: 'Move Page / object this directionp'},
      'GoDown': {id: 'GoDown', value: 'Μετακίνηση προς τα κάτω', comment: 'Move Page / object this directionp'},
      'GoUp': {id: 'GoUp', value: 'Μετακίνηση προς τα πάνω', comment: 'Move Page / object this direction'},
      'Graphite': {id: 'Graphite', value: 'Γραφίτης', comment: 'Color in our color pallette'},
      'GreaterOrEquals': {id: 'GreaterOrEquals', value: 'Μεγαλύτερο από ή ίσο με', comment: 'Greater Or Equals in icons for filtering'},
      'GreaterThan': {id: 'GreaterThan', value: 'Μεγαλύτερο από', comment: 'Greater Than in icons for filtering'},
      'Grid': {id: 'Grid', value: 'Πλέγμα', comment: 'Grid tooltip'},
      'Hours': {id: 'Hours', value: 'Ώρες', comment: 'the hour portion of a time'},
      'HeadingThree': {id: 'HeadingThree', value: 'Επικεφαλίδα τρία', comment: 'Heading Three tooltip'},
      'HeadingFour': {id: 'HeadingFour', value: 'Επικεφαλίδα τέσσερα', comment: 'Heading Four tooltip'},
      'Highest': {id: 'Highest', value: 'Ανώτατο', comment: 'Highest Four tooltip'},
      'Home': {id: 'Home', value: 'Αρχική', comment: 'Home tooltip'},
      'HtmlView': {id: 'HtmlView', value: 'Προβολή html', comment: 'Html View tooltip'},
      'Import': {id: 'Import', value: 'Εισαγωγή', comment: 'Import tooltip'},
      'Info': {id: 'Info', value: 'Πληροφορίες', comment: 'Info tooltip'},
      'InsertAnchor': {id: 'InsertAnchor', value: 'Εισαγωγή αγκύρωσης', comment: 'Insert Acnhor (link) in an editor'},
      'InsertImage': {id: 'InsertImage', value: 'Εισαγωγή εικόνας', comment: 'Insert Image in an editor'},
      'Italic': {id: 'Italic', value: 'Πλάγια γραφή', comment: 'Make Text Italic'},
      'InvalidDate': {id: 'InvalidDate', value: 'Μη έγκυρη ημερομηνία', comment: 'validation message for wrong date format (short)'},
      'Inventory': {id: 'Inventory', value: 'Αποθέματα', comment: 'Icon button tooltop for Inventory Action'},
      'IsEmpty': {id: 'IsEmpty', value: 'Είναι κενό', comment: 'Is Empty in icons for filtering'},
      'IsNotEmpty': {id: 'IsNotEmpty', value: 'Δεν είναι κενό', comment: 'Is Not Empty in icons for filtering'},
      'JustifyCenter': {id: 'JustifyCenter', value: 'Πλήρης στοίχιση στο κέντρο', comment: 'justify text to center in the editor'},
      'JustifyLeft': {id: 'JustifyLeft', value: 'Πλήρης στοίχιση αριστερά', comment: 'justify text to left in the editor'},
      'JustifyRight': {id: 'JustifyRight', value: 'Πλήρης στοίχιση δεξιά', comment: 'justify text to right in the editor'},
      'Keyword': {id: 'Keyword', value: 'Λέξη-κλειδί', comment: 'Describes filtering by a keyword search'},
      'Launch': {id: 'Launch', value: 'Εκκίνηση', comment: 'Launch'},
      'LastPage': {id: 'LastPage', value: 'Τελευταία σελίδα', comment: 'Last Page tooltip'},
      'Left': {id: 'Left', value: 'Αριστερά', comment: 'Left tooltip'},
      'LeftAlign': {id: 'LeftAlign', value: 'Στοίχιση αριστερά', comment: 'Left Align tooltip'},
      'LeftTextAlign': {id: 'LeftTextAlign', value: 'Στοίχιση κειμένου αριστερά', comment: 'Left Text Align tooltip'},
      'LessOrEquals': {id: 'LessOrEquals', value: 'Μικρότερο από ή ίσο με', comment: 'Less Or Equals in icons for filtering'},
      'LessThan': {id: 'LessThan', value: 'Μικρότερο από', comment: 'Less Than in icons for filtering'},
      'Link': {id: 'Link', value: 'Σύνδεση', comment: 'Link - as in hyperlink - icon tooltop'},
      'Load': {id: 'Load', value: 'Φόρτωση', comment: 'Load icon tooltip'},
      'Loading': {id: 'Loading', value: 'Γίνεται φόρτωση', comment: 'Text below spinning indicator to indicate loading'},
      'Locked': {id: 'Locked', value: 'Κλειδωμένο', comment: 'Locked tooltip'},
      'Lookup': {id: 'Lookup', value: 'Αναζήτηση', comment: 'Lookup - As in looking up a record or value'},
      'Lowest': {id: 'Lowest', value: 'Κατώτατο', comment: 'Lowest - As in Lowest value'},
      'Mail': {id: 'Mail', value: 'Αλληλογραφία', comment: 'Mail tooltip'},
      'MapPin': {id: 'MapPin', value: 'Καρφίτσωμα χάρτη', comment: 'Map Pin tooltip'},
      'Maximize': {id: 'Maximize', value: 'Μεγιστοποίηση', comment: 'Maximize a screen or dialog in the UI'},
      'Median': {id: 'Median', value: 'Διάμεσος', comment: 'Median in Mathematics'},
      'Medium': {id: 'Medium', value: 'Μεσαίο', comment: 'Describes a Medium sized Row Height in a grid/list'},
      'Menu': {id: 'Menu', value: 'Μενού', comment: 'Menu tooltip'},
      'MingleShare': {id: 'MingleShare', value: 'Κοινή χρήση με Ming.le', comment: 'Share the contextual object/action in the mingle system'},
      'Minutes': {id: 'Minutes', value: 'Λεπτά', comment: 'the minutes portion of a time'},
      'Minimize': {id: 'Minimize', value: 'Ελαχιστοποίηση', comment: 'Minimize tooltip'},
      'Minus': {id: 'Minus', value: 'Μείον', comment: 'Minus tooltip'},
      'More': {id: 'More', value: 'Περισσότερα...', comment: 'Text Indicating More Buttons or form content'},
      'MoreActions': {id: 'MoreActions', value: 'Περισσότερες ενέργειες', comment: 'Text on the More Actions button indictating hidden functions'},
      'MsgDirty': {id: 'MsgDirty', value: ', Τροποποιήθηκε', comment: 'for modified form fields'},
      'MultiselectWith': {id: 'MultiselectWith', value: '. Πολλαπλή επιλογή με ', comment: 'the minutes portion of a time'},
      'NewDocument': {id: 'NewDocument', value: 'Νέο έγγραφο', comment: 'New Document tooltip'},
      'Next': {id: 'Next', value: 'Επόμενο', comment: 'Next in icons tooltip'},
      'NextPage': {id: 'NextPage', value: 'Επόμενη σελίδα', comment: 'Next on Pager'},
      'NextMonth': {id: 'NextMonth', value: 'Επόμενος μήνας', comment: 'the label for the button that moves calendar to next/prev'},
      'NoResults': {id: 'NoResults', value: 'Κανένα αποτέλεσμα', comment: 'Search Results Text'},
      'Notes': {id: 'Notes', value: 'Σημειώσεις', comment: 'Notes icon tooltip'},
      'NotSelected': {id: 'NotSelected', value: 'Μη επιλεγμένο', comment: 'Not Selected in icons for filtering'},
      'NumberList': {id: 'NumberList', value: 'Λίστα αριθμών', comment: 'Number List tooltip'},
      'OpenBackClose': {id: 'OpenBackClose', value: 'Άνοιγμα / Πίσω / Κλείσιμο', comment: 'Open / Back / Close tooltip'},
      'OpenClose': {id: 'OpenClose', value: 'Άνοιγμα / Κλείσιμο', comment: 'Open / Close tooltip'},
      'OrderedList': {id: 'OrderedList', value: 'Ταξινομημένη λίστα', comment: 'Insert an Ordered list in the editor'},
      'Page': {id: 'Page', value: 'σελίδα ', comment: 'Text on the pager links'},
      'PageOf': {id: 'PageOf', value: 'Σελίδα {0} από {1}', comment: 'Pager Text Showing current and number of pages'},
      'PageOn': {id: 'PageOn', value: 'Αυτήν τη στιγμή βρίσκεστε στη σελίδα ', comment: 'Text on the pager links'},
      'Paste': {id: 'Paste', value: 'Επικόλληση', comment: 'Paste icon tooltip'},
      'PasswordValidation': {id: 'PasswordValidation', value: '<strong>Ο κωδικός πρόσβασης πρέπει:</strong><br>Να έχει τουλάχιστον 10 χαρακτήρες<br>Να έχει τουλάχιστον έναν κεφαλαίο χαρακτήρα<br>Να έχει τουλάχιστον έναν πεζό χαρακτήρα<br><strong>Να περιέχει έναν ειδικό χαρακτήρα</strong><br>Να μην περιέχει το όνομα χρήστη σας<br>Να μην είναι κωδικός πρόσβασης που έχετε χρησιμοποιήσει ήδη<br>', comment: 'Password validation requirements'},
      'PasswordConfirmValidation': {id: 'PasswordConfirmValidation', value: 'Ο κωδικός πρόσβασης πρέπει να συμφωνεί', comment: 'Password Confirm validation'},
      'Peak': {id: 'Peak', value: 'Κορύφωση', comment: 'the max or peak value in a chart'},
      'PersonalizeColumns': {id: 'PersonalizeColumns', value: 'Εξατομίκευση στηλών', comment: 'Customize Columns in a Grid'},
      'Period': {id: 'Period', value: 'Περίοδος', comment: 'the am/pm portion of a time'},
      'PressDown': {id: 'PressDown', value: 'Πιέστε Κάτω για να επιλέξτε μια ημερομηνία', comment: 'the audible label for Tooltip about how to operate the date picker'},
      'PressShiftF10': {id: 'PressShiftF10', value: 'Πιέστε Shift+F10 για να ανοίξετε το μενού περιβάλλοντος.', comment: 'the audible infor for screen readers on how to use a field with a popup menu'},
      'Previous': {id: 'Previous', value: 'Προηγούμενο', comment: 'Previous icon tooltip - moved to previous record'},
      'PreviousMonth': {id: 'PreviousMonth', value: 'Προηγούμενος μήνας', comment: 'the label for the button that moves calendar to next/prev'},
      'PreviousPage': {id: 'PreviousPage', value: 'Προηγούμενη σελίδα', comment: 'Previous Page tooltip'},
      'Print': {id: 'Print', value: 'Εκτύπωση', comment: 'Print tooltip'},
      'Range': {id: 'Range', value: 'Περιοχή', comment: 'Range for tooltip'},
      'RecordsPerPage': {id: 'RecordsPerPage', value: '{0} Εγγραφές ανά σελίδα', comment: 'Dropd own allows the user to select how many visible records {} shows select value.'},
      'Redo': {id: 'Redo', value: 'Επανάληψη', comment: 'Redo tooltip'},
      'Refresh': {id: 'Refresh', value: 'Ανανέωση', comment: 'Refresh tooltip'},
      'Required': {id: 'Required', value: 'Απαιτείται', comment: 'indicates a form field is manditory'},
      'Reset': {id: 'Reset', value: 'Επαναφορά', comment: 'Reset tooltip'},
      'Results': {id: 'Results', value: 'Αποτελέσματα', comment: 'As in showing N Results in a List'},
      'Right': {id: 'Right', value: 'Δεξιά', comment: 'Right tooltip'},
      'RightAlign': {id: 'RightAlign', value: 'Στοίχιση δεξιά', comment: 'Right Align tooltip'},
      'RightAlignText': {id: 'RightAlignText', value: 'Στοίχιση κειμένου δεξιά', comment: 'Right Align Text tooltip'},
      'Roles': {id: 'Roles', value: 'Ρόλοι', comment: 'Roles tooltip'},
      'RowHeight': {id: 'RowHeight', value: 'Ύψος γραμμής', comment: 'Describes the Height for Rows in a Data Grid'},
      'Ruby': {id: 'Ruby', value: 'Κερασί', comment: 'Color in our color pallette'},
      'Save': {id: 'Save', value: 'Αποθήκευση', comment: 'Save tooltip'},
      'SaveCurrentView': {id: 'SaveCurrentView', value: 'Αποθήκευση τρέχουσας προβολής', comment: 'Datagrids contain view sets. This menu option saves them'},
      'SavedViews': {id: 'SavedViews', value: 'Αποθηκευμένες προβολές', comment: 'Label for a list of Views'},
      'Search': {id: 'Search', value: 'Αναζήτηση', comment: 'Search tooltip'},
      'SearchFolder': {id: 'SearchFolder', value: 'Φάκελος αναζήτησης', comment: 'Search Folder tooltip'},
      'SearchList': {id: 'SearchList', value: 'Λίστα αναζήτησης', comment: 'Search List tooltip'},
      'Selected': {id: 'Selected', value: 'Επιλεγμένο', comment: 'text describing a selected object'},
      'Send': {id: 'Send', value: 'Αποστολή', comment: 'Send tooltip'},
      'SetTime': {id: 'SetTime', value: 'Ρύθμιση ώρας', comment: 'button text that inserts time when clicked'},
      'Settings': {id: 'Settings', value: 'Ρυθμίσεις', comment: 'Settings tooltip'},
      'Short': {id: 'Short', value: 'Σύντομο', comment: 'Describes a Shorted Row Height in a grid/list'},
      'Slate': {id: 'Slate', value: 'Σχιστόλιθος', comment: 'Color in our color pallette'},
      'SliderHandle': {id: 'SliderHandle', value: 'Χειρισμός για', comment: 'Description of the portion of a Slider control that is focusable and changes its value, followed in code by the name of the control'},
      'SliderMaximumHandle': {id: 'SliderMaximumHandle', value: 'Χειρισμός μέγιστου εύρους για', comment: 'Describes a maximum value handle in a Range (double slider), followed in code by the name of the control'},
      'SliderMinimumHandle': {id: 'SliderMinimumHandle', value: 'Χειρισμός ελάχιστου εύρους για', comment: 'Describes a minimum value handle in a Range (double slider), followed in code by the name of the control'},
      'SkipToMain': {id: 'SkipToMain', value: 'Μεταπήδηση στο Κύριο περιεχόμενο', comment: 'Skip link in header, jumps when clicked on to main area'},
      'StrikeThrough': {id: 'StrikeThrough', value: 'Διακριτή διαγραφή', comment: 'turn on and off strike through text in text editor (like word)'},
      'SortAtoZ': {id: 'SortAtoZ', value: 'Ταξινόμηση A έως Ω', comment: 'Sort A to Z in icons for filtering'},
      'SortZtoA': {id: 'SortZtoA', value: 'Ταξινόμηση Ω έως A', comment: 'Sort Z to A in icons for filtering'},
      'SortDown': {id: 'SortDown', value: 'Φθίνουσα ταξινόμηση', comment: 'Sort Down tooltip'},
      'SortUp': {id: 'SortUp', value: 'Αύξουσα ταξινόμηση', comment: 'Sort Up tooltip'},
      'StarFilled': {id: 'StarFilled', value: 'Star Filled', comment: 'Star Filled tooltip'},
      'StarHalf': {id: 'StarHalf', value: 'Star Half', comment: 'Star Half tooltip'},
      'StarOutlined': {id: 'StarOutlined', value: 'Star Outlined', comment: 'Star Outlined tooltip'},
      'Subscript': {id: 'Subscript', value: 'Δείκτης', comment: 'Turn on and off Subscript text in text editor (like word)'},
      'Superscript': {id: 'Superscript', value: 'Εκθέτης', comment: 'Turn on and off Superscript text in text editor (like word)'},
      'Tack': {id: 'Tack', value: 'Μαρκάρισμα', comment: 'Tack tooltip'},
      'Tall': {id: 'Tall', value: 'Ψηλό', comment: 'Describes a Taller Row Height in a grid/list'},
      'Timer': {id: 'Timer', value: 'Χρονόμετρο', comment: 'Timer tooltip'},
      'Today': {id: 'Today', value: 'Σήμερα', comment: 'refering to today on a calendar'},
      'ToggleBold': {id: 'ToggleBold', value: 'Εναλλαγή έντονης γραφής κειμένου', comment: 'turn on and off bold in text editor (like word)'},
      'ToggleH3': {id: 'ToggleH3', value: 'Εναλλαγή επικεφαλίδας 3', comment: 'turn on and off heading 3 text'},
      'ToggleH4': {id: 'ToggleH4', value: 'Εναλλαγή επικεφαλίδας 4', comment: 'turn on and off heading 4 text'},
      'ToggleItalic': {id: 'ToggleItalic', value: 'Εναλλαγή πλάγιας γραφής κειμένου', comment: 'turn on and off Italic in text editor (like word)'},
      'ToggleUnderline': {id: 'ToggleUnderline', value: 'Εναλλαγή υπογράμμισης κειμένου', comment: 'turn on and off Underline in text editor (like word)'},
      'Toolbar': {id: 'Toolbar', value: 'Γραμμή εργαλείων', comment: 'describing the toolbar component'},
      'TopAlign': {id: 'TopAlign', value: 'Στοίχιση επάνω', comment: 'Top Align tooltip'},
      'Total': {id: 'Total', value: 'Σύνολο', comment: 'Mathematic total of a calculation'},
      'TreeCollapse': {id: 'TreeCollapse', value: 'Σύμπτυξη δέντρου', comment: 'Tree Collapse tooltip'},
      'TreeExpand': {id: 'TreeExpand', value: 'Ανάπτυξη δέντρου', comment: 'Tree Expand tooltip'},
      'Turquoise': {id: 'Turquoise', value: 'Τυρκουάζ', comment: 'Color in our color pallette'},
      'Up': {id: 'Up', value: 'Πάνω', comment: 'Up tooltip'},
      'Upload': {id: 'Upload', value: 'Αποστολή', comment: 'Upload tooltip'},
      'UnavailableDate': {id: 'UnavailableDate', value: 'Μη διαθέσιμη ημερομηνία', comment: 'Unavailable Date Text'},
      'Underline': {id: 'Underline', value: 'Υπογράμμιση', comment: 'Make text Underlined'},
      'Undo': {id: 'Undo', value: 'Αναίρεση', comment: 'Undo tooltip'},
      'Unlocked': {id: 'Unlocked', value: 'Ξεκλείδωτο', comment: 'Unlocked tooltip'},
      'UnorderedList': {id: 'UnorderedList', value: 'Μη ταξινομημένη λίστα', comment: 'Insert an Unordered list in the editor'},
      'Unsupported': {id: 'Unsupported', value: 'Το περιεχόμενο αυτό δεν είναι διαθέσιμο επειδή χρησιμοποιεί λειτουργίες που δεν υποστηρίζονται στην έκδοση του τρέχοντος προγράμματος περιήγησης.', comment: 'Suggesting browser upgrade for missing features.'},
      'Url': {id: 'Url', value: 'Url', comment: 'Url tooltip'},
      'UseArrow': {id: 'UseArrow', value: '. Χρησιμοποιήστε τα πλήκτρα βέλους για πραγματοποίηση επιλογής.', comment: 'Instructional comments for screen readers'},
      'UseEnter': {id: 'UseEnter', value: '. Χρησιμοποιήστε το Enter ή το βέλος προς τα κάτω για αναζήτηση.', comment: 'Instructional comments for screen readers'},
      'User': {id: 'User', value: 'Χρήστης', comment: 'User tooltip'},
      'UserProfile': {id: 'UserProfile', value: 'Προφίλ χρήστη', comment: 'User Profile tooltip'},
      'VerticalMiddleAlign': {id: 'VerticalMiddleAlign', value: 'Μέσον κατακόρυφης στοίχισης', comment: 'Vertical Middle Align tooltip'},
      'ViewSource': {id: 'ViewSource', value: 'Προβολή πηγής', comment: 'Toggle the source view in the editor'},
      'ViewVisual': {id: 'ViewVisual', value: 'Προβολή οπτικών στοιχείων', comment: 'Toggle the visual view in the editor'}
    }
  });
}));
