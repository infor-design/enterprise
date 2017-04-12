(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module
    define('cultures/tr-TR', ['jquery'], factory);
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
  Locale.addCulture('tr-TR', {
    //layout/language
    language: 'tr',
    englishName: 'Turkish (Turkey)',
    nativeName: 'Türkçe (Türkiye)',
    //layout/orientation/@characters
    direction: 'left-to-right',
    //ca-gregorian
    calendars: [{
      //ca-gregorian/main/dates/calendars/gregorian/dateFormats/
      dateFormat: {'separator': '.', //Infered
                   'timeSeparator': ':',
                   'short': 'd.MM.yyyy', //use four digit year
                   'medium': 'd MMM yyyy',
                   'long': 'd MMMM yyyy',
                   'full': 'd MMMM yyyy EEEE',
                   'month': 'd MMMM',
                   'year': 'MMMM yyyy',
                   'timestamp': 'HH:mm:ss',
                   'datetime': 'd.MM.yyyy HH:mm'}, //Infered short + short gregorian/dateTimeFormats
      //ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated (2 digit)
      days: {
         wide: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
         abbreviated: ['Pa','Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'],
         narrow: ['P', 'P', 'S', 'Ç', 'P', 'C', 'C']
      },
      //ca-gregorian/main/dates/calendars/gregorian/months/format/wide
      months: {
        wide: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
        abbreviated: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']
      },
      //ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
      timeFormat: 'HH:mm',
      //ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
      dayPeriods: ['ÖÖ', 'ÖS']
    }],
    //numbers/currencyFormats-numberSystem-latn/standard (Replace Sign http://www.currencysymbols.in ?)
    currencySign: '₤', //(Replace Sign http://www.currencysymbols.in ?)
    currencyFormat: '#,##0.00 ¤',
    //numbers/symbols-numberSystem-latn
    numbers: {
      percentSign: '%',
      percentFormat: '%#,##0',
      minusSign: '-',
      decimal: ',',
      group: '.'
    },
    //Resx - Approved By Translation Team
    messages: {
      'AboutText': {id: 'AboutText', value: 'Telif hakkı &copy; {0} Infor. Her hakkı saklıdır. Bu belgede belirtilen kelime ve tasarım işaretleri, Infor ve/veya ortak ve iştiraklerinin ticari markaları ve/veya tescilli ticari markalarıdır. Burada belirtilen diğer tüm ticari markalar ilgili sahiplerinin mülkleridir'},
      'Actions': {id: 'Actions', value: 'Eylemler', comment: 'Tooltip text for the action button with additional in context actions'},
      'Add': {id: 'Add', value: 'Ekle', comment: 'Add'},
      'AddNewTab': {id: 'AddNewTab', value: 'Yeni Sekme Ekle', comment: 'Attached to a button that adds new tabs'},
      'AdvancedFilter': {id: 'AdvancedFilter', value: 'Gelişmiş Filtre Oluştur', comment: 'In a data grid active an advanced filtering feature'},
      'Alert': {id: 'Alert', value: 'Uyarı', comment: 'Alert'},
      'All': {id: 'All', value: 'Hepsi', comment: 'All items in the context of a filter'},
      'AllResults': {id: 'AllResults', value: 'Şunun için Tüm Sonuçlar:', comment: 'Search Results Text'},
      'AligntoBottom': {id: 'AligntoBottom', value: 'Alta Hizala', comment: 'Align to Bottom tooltip'},
      'AlignCenterHorizontally': {id: 'AlignCenterHorizontally', value: 'Yatay Hizalama Orta', comment: 'Align Center Horizontally tooltip'},
      'Amber': {id: 'Amber', value: 'Kehribar', comment: 'Color in our color pallette'},
      'Amethyst': {id: 'Amethyst', value: 'Ametist', comment: 'Color in our color pallette'},
      'Apply': {id: 'Apply', value: 'Uygula', comment: 'Text in a button to apply an action'},
      'Attach': {id: 'Attach', value: 'Ekle', comment: 'Attach'},
      'Azure': {id: 'Azure', value: 'Lacivert taşı', comment: 'Color in our color pallette'},
      'BackgroundColor': {id: 'BackgroundColor', value: 'Arka plan rengi', comment: 'add or edit text background color in the editor'},
      'Between': {id: 'Between', value: 'Arasında', comment: 'Between in icons for filtering'},
      'Blockquote': {id: 'Blockquote', value: 'Alıntı kısmı', comment: 'insert a block quote in the editor'},
      'Bold': {id: 'Bold', value: 'Kalın', comment: 'Make text Bold'},
      'Bookmarked': {id: 'Bookmarked', value: 'Yer işareti eklendi', comment: 'Bookmark filled - Element is already bookmarked'},
      'BookmarkThis': {id: 'BookmarkThis', value: 'Buna yer işareti ekle', comment: 'Bookmark an element'},
      'Breadcrumb': {id: 'Breadcrumb', value: 'İçerik haritası', comment: 'Text describing the Breadcrumb'},
      'BulletedList': {id: 'BulletedList', value: 'Madde işaretli liste', comment: 'Bulleted List tooltip'},
      'Calendar': {id: 'Calendar', value: 'Takvim', comment: 'Inline Text for the title of the Calendar control'},
      'Camera': {id: 'Camera', value: 'Kamera', comment: 'Camera tooltip'},
      'Cancel': {id: 'Cancel', value: 'İptal', comment: 'Cancel tooltip'},
      'CapsLockOn': {id: 'CapsLockOn', value: 'Caps Lock Açık', comment: 'Caps Lock On message'},
      'Cart': {id: 'Cart', value: 'Alışveriş sepeti', comment: 'Cart tooltip'},
      'CenterText': {id: 'CenterText', value: 'Ortala', comment: 'An Icon Tooltip'},
      'CharactersLeft': {id: 'CharactersLeft', value: 'Kalan karakter {0}', comment: 'indicator showing how many more characters you can type.'},
      'CharactersMax': {id: 'CharactersMax', value: 'Maksimum karakter sayısı ', comment: 'indicator showing how many max characters you can type.'},
      'ChangeSelection': {id: 'ChangeSelection', value: '. Seçimi değiştirmek için ok tuşlarını kullanın.', comment: 'Audible Text for drop down list help'},
      'Checkbox': {id: 'Checkbox', value: 'Onay kutusu', comment: 'Checkbox tooltip'},
      'Checked': {id: 'Checked', value: 'İşaretli', comment: 'Checked tooltip'},
      'Clear': {id: 'Clear', value: 'Temizle', comment: 'Tooltip for a Clear Action'},
      'ClearFilter': {id: 'ClearFilter', value: 'Filtreyi Temizle', comment: 'Clear the current filter criteria'},
      'Clock': {id: 'Clock', value: 'Saat', comment: 'Clock tooltip'},
      'Close': {id: 'Close', value: 'Kapat', comment: 'Tooltip for a Close Button Action'},
      'Copy': {id: 'Copy', value: 'Kopyala', comment: 'Copy tooltip'},
      'Collapse': {id: 'Collapse', value: 'Daralt', comment: 'Collapse / close a tree/submenu'},
      'CollapseAppTray': {id: 'CollapseAppTray', value: 'Uygulama Tepsisini Daralt', comment: 'Collapse App Tray tooltip'},
      'Columns': {id: 'Columns', value: 'Sütunlar', comment: 'Columns tooltip'},
      'Component': {id: 'Component', value: 'Bileşen', comment: 'As in a UI component - building block.'},
      'Compose': {id: 'Compose', value: 'Oluştur', comment: 'Compose tooltip'},
      'Completed': {id: 'Completed', value: 'Tamamlandı', comment: 'Text For a Completed Status'},
      'Confirm': {id: 'Confirm', value: 'Onayla', comment: 'Confirm tooltip'},
      'Contains': {id: 'Contains', value: 'Şunu İçerir', comment: 'Contains in icons for filtering'},
      'CssClass': {id: 'CssClass', value: 'Css Sınıfı', comment: 'Label for entering a Css Class name'},
      'Cut': {id: 'Cut', value: 'Kes', comment: 'Cut tooltip'},
      'Date': {id: 'Date', value: 'Tarih', comment: 'Describes filtering by a date data type'},
      'Delete': {id: 'Delete', value: 'Sil', comment: 'Delete Toolbar Action Tooltip'},
      'DistributeHoriz': {id: 'DistributeHoriz', value: 'Yatay Olarak Dağıt', comment: 'Icon button tooltip for action that distributes elements across Horizontally'},
      'Document': {id: 'Document', value: 'Belge', comment: 'Document tooltip'},
      'Dirty': {id: 'Dirty', value: 'Satır değişti', comment: 'Record is dirty / modified'},
      'Drilldown': {id: 'Drilldown', value: 'Detaya git', comment: 'Drill by moving page flow into a record'},
      'Drillup': {id: 'Drillup', value: 'Detaydan Çık', comment: 'Opposite of Drilldown, move back up to a larger set of records'},
      'Dropdown': {id: 'Dropdown', value: 'Açılır', comment: 'Dropdown'},
      'DoesNotContain': {id: 'DoesNotContain', value: 'Şunu İçermez', comment: 'Does Not Contain in icons for filtering'},
      'DoesNotEndWith': {id: 'DoesNotEndWith', value: 'Şununla Bitmez', comment: 'For condition filtering'},
      'DoesNotEqual': {id: 'DoesNotEqual', value: 'Şuna Eşit Değil', comment: 'Does Not Equal in icons for filtering'},
      'DoesNotStartWith': {id: 'DoesNotStartWith', value: 'Şununla Başlamaz', comment: 'For condition filtering'},
      'Down': {id: 'Down', value: 'Aşağı', comment: 'Down tooltip'},
      'Download': {id: 'Download', value: 'İndir', comment: 'Download tooltip'},
      'Duplicate': {id: 'Duplicate', value: 'Yinelenen', comment: 'Duplicate tooltip'},
      'EitherSelectedOrNotSelected': {id: 'EitherSelectedOrNotSelected', value: 'Seçili veya Seçili Değil', comment: 'Either Selected Or NotSelected in icons for filtering'},
      'EndsWith': {id: 'EndsWith', value: 'Şununla Biter', comment: 'for condition filtering'},
      'EnterComments': {id: 'EnterComments', value: 'Buraya yorum girin...', comment: 'Placeholder text for a text input (comments)'},
      'Error': {id: 'Error', value: 'Hata', comment: 'Title, Spoken Text describing fact an error has occured'},
      'ErrorAllowedTypes': {id: 'ErrorAllowedTypes', value: 'Dosya türüne izin verilmiyor', comment: 'Error string for file-upload'},
      'ErrorMaxFileSize': {id: 'ErrorMaxFileSize', value: 'Dosya boyut sınırı aşıldı', comment: 'Error string for file-upload'},
      'ErrorMaxFilesInProcess': {id: 'ErrorMaxFilesInProcess', value: 'Maksimum izin verilen dosya sınırı aşıldı', comment: 'Error string for file-upload'},
      'EmailValidation': {id: 'EmailValidation', value: 'E-posta adresi geçerli değil', comment: 'This the rule for email validation'},
      'Emerald': {id: 'Emerald', value: 'Zümrüt', comment: 'Color in our color pallette'},
      'Expand': {id: 'Expand', value: 'Genişlet', comment: 'Expand open a tree/submenu'},
      'ExpandAppTray': {id: 'ExpandAppTray', value: 'Uygulama Tepsisini Genişlet', comment: 'ExpandAppTray tooltip'},
      'ExpandCollapse': {id: 'ExpandCollapse', value: 'Genişlet / Daralt', comment: 'Text to toggle a button in a container.'},
      'ExportAsSpreadsheet': {id: 'ExportAsSpreadsheet', value: 'Elektronik Tablo Olarak Dışarı Aktar', comment: 'Export as Spreadsheet tooltip'},
      'Edit': {id: 'Edit', value: 'Düzenle', comment: 'Edit tooltip'},
      'Equals': {id: 'Equals', value: 'Şuna Eşit', comment: 'Equals in icons for filtering'},
      'ExitFullView': {id: 'ExitFullView', value: 'Tam Görünümden Çık', comment: 'Exit Full View tooltip'},
      'Export': {id: 'Export', value: 'Dışarı Aktar', comment: 'Export tooltip'},
      'ExportToExcel': {id: 'ExportToExcel', value: 'Excel'e Aktar', comment: 'Export To Excel menu option in datagrid'},
      'Favorite': {id: 'Favorite', value: 'Sık Kullanılan', comment: 'A favorite item'},
      'FileUpload': {id: 'FileUpload', value: 'Dosya Yükleme. Bir dosyaya Gözatmak için Enter tuşuna basın', comment: 'Screen Reader instructions'},
      'Filter': {id: 'Filter', value: 'Filtrele', comment: 'Filter tooltip'},
      'FirstPage': {id: 'FirstPage', value: 'Birinci Sayfa', comment: 'First Page tooltip'},
      'Folder': {id: 'Folder', value: 'Klasör', comment: 'Folder tooltip'},
      'FullView': {id: 'FullView', value: 'Tam Görünüm', comment: 'Full View tooltip'},
      'GoForward': {id: 'GoForward', value: 'İleri Git', comment: 'Move Page / object this direction'},
      'GoBack': {id: 'GoBack', value: 'Geri Git', comment: 'Move Page / object this directionp'},
      'GoDown': {id: 'GoDown', value: 'Aşağı Git', comment: 'Move Page / object this directionp'},
      'GoUp': {id: 'GoUp', value: 'Yukarı Git', comment: 'Move Page / object this direction'},
      'Graphite': {id: 'Graphite', value: 'Grafit', comment: 'Color in our color pallette'},
      'GreaterOrEquals': {id: 'GreaterOrEquals', value: 'Şundan Daha Fazla Veya Eşit', comment: 'Greater Than Or Equals in icons for filtering'},
      'GreaterThan': {id: 'GreaterThan', value: 'Şundan Daha Fazla', comment: 'Greater Than in icons for filtering'},
      'Grid': {id: 'Grid', value: 'Kılavuz', comment: 'Grid tooltip'},
      'Hours': {id: 'Hours', value: 'Saat', comment: 'the hour portion of a time'},
      'HeadingThree': {id: 'HeadingThree', value: 'Başlık Üç', comment: 'Heading Three tooltip'},
      'HeadingFour': {id: 'HeadingFour', value: 'Başlık Dört', comment: 'Heading Four tooltip'},
      'Highest': {id: 'Highest', value: 'En Yüksek', comment: 'Highest Four tooltip'},
      'Home': {id: 'Home', value: 'Giriş', comment: 'Home tooltip'},
      'HtmlView': {id: 'HtmlView', value: 'Html Görünümü', comment: 'Html View tooltip'},
      'Image': {id: 'Image', value: 'Görüntü', comment: 'Image of something'},
      'Import': {id: 'Import', value: 'İçeri Aktar', comment: 'Import tooltip'},
      'Info': {id: 'Info', value: 'Bilgi', comment: 'Info tooltip'},
      'InProgress': {id: 'In Progress', value: 'Devam Ediyor', comment: 'Info tooltip that an action is in progress'},
      'Insert': {id: 'Insert', value: 'Ekle', comment: 'Insert Modal Dialog Button'},
      'InsertAnchor': {id: 'InsertAnchor', value: 'Bağlayıcı Ekle', comment: 'Insert Acnhor (link) in an editor'},
      'InsertImage': {id: 'InsertImage', value: 'Görüntü Ekle', comment: 'Insert Image in an editor'},
      'InsertLink': {id: 'InsertLink', value: 'Bağlantı Ekle', comment: 'Insert Link in an editor'},
      'InsertUrl': {id: 'InsertUrl', value: 'Url Ekle', comment: 'Insert a Url in an editor'},
      'Italic': {id: 'Italic', value: 'İtalik', comment: 'Make Text Italic'},
      'InvalidDate': {id: 'InvalidDate', value: 'Geçersiz Tarih', comment: 'validation message for wrong date format (short)'},
      'InvalidTime': {id: 'InvalidTime', value: 'Geçersiz Saat', comment: 'validation message for wrong time format'},
      'Inventory': {id: 'Inventory', value: 'Stok', comment: 'Icon button tooltop for Inventory Action'},
      'IsEmpty': {id: 'IsEmpty', value: 'Boş', comment: 'Is Empty in icons for filtering'},
      'IsNotEmpty': {id: 'IsNotEmpty', value: 'Boş Değil', comment: 'Is Not Empty in icons for filtering'},
      'ItemsSelected': {id: 'ItemsSelected', value: 'Seçilen öğeler', comment: 'Num of Items selected for swaplist'},
      'JustifyCenter': {id: 'JustifyCenter', value: 'Ortala', comment: 'justify text to center in the editor'},
      'JustifyLeft': {id: 'JustifyLeft', value: 'Sola Hizala', comment: 'justify text to left in the editor'},
      'JustifyRight': {id: 'JustifyRight', value: 'Sağa Hizala', comment: 'justify text to right in the editor'},
      'Keyword': {id: 'Keyword', value: 'Anahtar Sözcük', comment: 'Describes filtering by a keyword search'},
      'Launch': {id: 'Launch', value: 'Başlat', comment: 'Launch'},
      'LastPage': {id: 'LastPage', value: 'Son Sayfa', comment: 'Last Page tooltip'},
      'Left': {id: 'Left', value: 'Sol', comment: 'Left tooltip'},
      'LessOrEquals': {id: 'LessOrEquals', value: 'Şundan Daha Az Veya Eşit', comment: 'Less Than Or Equals in icons for filtering'},
      'LessThan': {id: 'LessThan', value: 'Şundan Daha Az', comment: 'Less Than in icons for filtering'},
      'Link': {id: 'Link', value: 'Bağlantı', comment: 'Link - as in hyperlink - icon tooltop'},
      'Load': {id: 'Load', value: 'Yükle', comment: 'Load icon tooltip'},
      'Loading': {id: 'Loading', value: 'Yükleniyor', comment: 'Text below spinning indicator to indicate loading'},
      'Locked': {id: 'Locked', value: 'Kilitli', comment: 'Locked tooltip'},
      'Logout': {id: 'Logout', value: 'Oturumu Kapat', comment: 'Log out of the application'},
      'Lookup': {id: 'Lookup', value: 'Arama', comment: 'Lookup - As in looking up a record or value'},
      'Lowest': {id: 'Lowest', value: 'En Düşük', comment: 'Lowest - As in Lowest value'},
      'Mail': {id: 'Mail', value: 'Posta', comment: 'Mail tooltip'},
      'MapPin': {id: 'MapPin', value: 'Sabitle', comment: 'Map Pin tooltip'},
      'Maximize': {id: 'Maximize', value: 'Ekranı Kapla', comment: 'Maximize a screen or dialog in the UI'},
      'Median': {id: 'Median', value: 'Medyan', comment: 'Median in Mathematics'},
      'Medium': {id: 'Medium', value: 'Orta', comment: 'Describes a Medium sized Row Height in a grid/list'},
      'Menu': {id: 'Menu', value: 'Menü', comment: 'Menu tooltip'},
      'MingleShare': {id: 'MingleShare', value: 'Ming.le ile Paylaş', comment: 'Share the contextual object/action in the mingle system'},
      'Minutes': {id: 'Minutes', value: 'Dakika', comment: 'the minutes portion of a time'},
      'Minimize': {id: 'Minimize', value: 'Simge Durumuna Küçült', comment: 'Minimize tooltip'},
      'Minus': {id: 'Minus', value: 'Eksi', comment: 'Minus tooltip'},
      'Mobile': {id: 'Mobile', value: 'Mobil', comment: 'Indicates a mobile device (phone tablet ect)'},
      'More': {id: 'More', value: 'Daha Fazla...', comment: 'Text Indicating More Buttons or form content'},
      'MoreActions': {id: 'MoreActions', value: 'Daha Fazla Eylem', comment: 'Text on the More Actions button indictating hidden functions'},
      'MsgDirty': {id: 'MsgDirty', value: ', Düzenlenmiş', comment: 'for modified form fields'},
      'NewDocument': {id: 'NewDocument', value: 'Yeni Belge', comment: 'New Document tooltip'},
      'NewItem': {id: 'NewItem', value: 'Yeni öğe', comment: 'New item in listbuilder'},
      'Next': {id: 'Next', value: 'Sonraki', comment: 'Next in icons tooltip'},
      'NextPage': {id: 'NextPage', value: 'Sonraki Sayfa', comment: 'Next on Pager'},
      'NextMonth': {id: 'NextMonth', value: 'Sonraki Ay', comment: 'the label for the button that moves calendar to next/prev'},
      'No': {id: 'No', value: 'Hayır', comment: 'On a dialog button'},
      'NoResults': {id: 'NoResults', value: 'Sonuç Yok', comment: 'Search Results Text'},
      'Normal': {id: 'Normal', value: 'Normal', comment: 'Normal row height'},
      'Notes': {id: 'Notes', value: 'Notlar', comment: 'Notes icon tooltip'},
      'NotSelected': {id: 'NotSelected', value: 'Seçilmedi', comment: 'Not Selected in icons for filtering'},
      'NumberList': {id: 'NumberList', value: 'Sayı Listesi', comment: 'Number List tooltip'},
      'OpenBackClose': {id: 'OpenBackClose', value: 'Aç / Geri / Kapat', comment: 'Open / Back / Close tooltip'},
      'OpenClose': {id: 'OpenClose', value: 'Aç / Kapat', comment: 'Open / Close tooltip'},
      'OrderedList': {id: 'OrderedList', value: 'Numaralı Listeyi Ekle/Kaldır', comment: 'Insert an Ordered list in the editor'},
      'Page': {id: 'Page', value: 'sayfa ', comment: 'Text on the pager links'},
      'PageOf': {id: 'PageOf', value: 'Sayfa {0} / {1}', comment: 'Pager Text Showing current and number of pages'},
      'PageOn': {id: 'PageOn', value: 'Şu anda bu sayfadasınız: ', comment: 'Text on the pager links'},
      'Paste': {id: 'Paste', value: 'Yapıştır', comment: 'Paste icon tooltip'},
      'PasswordValidation': {id: 'PasswordValidation', value: '<strong>Parola:</strong><br>En az 10 karakter uzunluğunda olmalıdır<br>En az bir büyük harf karakteri içermelidir<br>En az bir küçük harf karakteri içermelidir<br>Bir özel karakter içermelidir<br>Kullanıcı adınızı içermemelidir<br>Daha önce kullanılan bir parola olamaz<br>', comment: 'Password validation requirements'},
      'PasswordConfirmValidation': {id: 'PasswordConfirmValidation', value: 'Parola eşleşmelidir', comment: 'Password Confirm validation'},
      'Peak': {id: 'Peak', value: 'Tepe', comment: 'the max or peak value in a chart'},
      'PersonalizeColumns': {id: 'PersonalizeColumns', value: 'Sütunları Kişiselleştir', comment: 'Customize Columns in a Grid'},
      'Period': {id: 'Period', value: 'Dönem', comment: 'the am/pm portion of a time'},
      'PressDown': {id: 'PressDown', value: 'Bir tarih seçmek için Aşağı oka basın', comment: 'the audible label for Tooltip about how to operate the date picker'},
      'PressShiftF10': {id: 'PressShiftF10', value: 'İçerik menüsünü açmak için Shift+F10 tuşuna basın.', comment: 'the audible infor for screen readers on how to use a field with a popup menu'},
      'Previous': {id: 'Previous', value: 'Önceki', comment: 'Previous icon tooltip - moved to previous record'},
      'PreviousMonth': {id: 'PreviousMonth', value: 'Önceki Ay', comment: 'the label for the button that moves calendar to next/prev'},
      'PreviousPage': {id: 'PreviousPage', value: 'Önceki Sayfa', comment: 'Previous Page tooltip'},
      'Print': {id: 'Print', value: 'Yazdır', comment: 'Print tooltip'},
      'Range': {id: 'Range', value: 'Aralık', comment: 'Range for tooltip'},
      'RecordsPerPage': {id: 'RecordsPerPage', value: 'Sayfa başına {0} kayıt', comment: 'Dropd own allows the user to select how many visible records {} shows select value.'},
      'Redo': {id: 'Redo', value: 'Yinele', comment: 'Redo tooltip'},
      'Refresh': {id: 'Refresh', value: 'Yenile', comment: 'Refresh tooltip'},
      'Required': {id: 'Required', value: 'Gerekli', comment: 'indicates a form field is manditory'},
      'Reset': {id: 'Reset', value: 'Sıfırla', comment: 'Reset tooltip'},
      'ResetDefault': {id: 'ResetDefault', value: 'Varsayılana Sıfırla', comment: 'Reset Datagrid Columns, Filter and other Layout'},
      'Results': {id: 'Results', value: 'Sonuçlar', comment: 'As in showing N Results in a List'},
      'RightAlign': {id: 'RightAlign', value: 'Sağa Hizala', comment: 'Right Align tooltip'},
      'RightAlignText': {id: 'RightAlignText', value: 'Sağa Hizala', comment: 'Right Align Text tooltip'},
      'Right': {id: 'Right', value: 'Sağ', comment: 'Right'},
      'Roles': {id: 'Roles', value: 'Roller', comment: 'Roles tooltip'},
      'RowHeight': {id: 'RowHeight', value: 'Satır Yüksekliği', comment: 'Describes the Height for Rows in a Data Grid'},
      'Ruby': {id: 'Ruby', value: 'Yakut', comment: 'Color in our color pallette'},
      'RunFilter': {id: 'RunFilter', value: 'Filtreyi Çalıştır', comment: 'Execute the current filter criteria'},
      'Save': {id: 'Save', value: 'Kaydet', comment: 'Save tooltip'},
      'SaveCurrentView': {id: 'SaveCurrentView', value: 'Mevcut Görünümü Kaydet', comment: 'Datagrids contain view sets. This menu option saves them'},
      'SavedViews': {id: 'SavedViews', value: 'Kaydedilen Görünümler', comment: 'Label for a list of Views'},
      'Seconds': {id: 'Seconds', value: 'Saniye', comment: 'the seconds portion of a time'},
      'Search': {id: 'Search', value: 'Ara', comment: 'Search tooltip'},
      'SearchColumnName': {id: 'SearchColumnName', value: 'Bir sütun adı ara', comment: 'Search for a datagrid column by name'},
      'SearchFolder': {id: 'SearchFolder', value: 'Klasörde Ara', comment: 'Search Folder tooltip'},
      'SearchList': {id: 'SearchList', value: 'Listeyi Ara', comment: 'Search List tooltip'},
      'Select': {id: 'Select', value: 'Seç', comment: 'text describing a select action'},
      'Selected': {id: 'Selected', value: 'Seçilen', comment: 'text describing a selected object'},
      'Send': {id: 'Send', value: 'Gönder', comment: 'Send tooltip'},
      'SetTime': {id: 'SetTime', value: 'Zamanı Ayarla', comment: 'button text that inserts time when clicked'},
      'Settings': {id: 'Settings', value: 'Ayarlar', comment: 'Settings tooltip'},
      'Short': {id: 'Short', value: 'Kısa', comment: 'Describes a Shorted Row Height in a grid/list'},
      'ShowFilterRow': {id: 'ShowFilterRow', value: 'Filtre Satırını Göster', comment: 'Toggle a row with filer info above a list'},
      'ShowLess': {id: 'ShowLess', value: 'Daha Az Göster', comment: 'Show less form content'},
      'ShowMore': {id: 'ShowMore', value: 'Daha Fazla Göster', comment: 'Show more form content'},
      'Slate': {id: 'Slate', value: 'Arduvaz', comment: 'Color in our color pallette'},
      'SliderHandle': {id: 'SliderHandle', value: 'Şunun için tutamaç:', comment: 'Description of the portion of a Slider control that is focusable and changes its value, followed in code by the name of the control'},
      'SliderMaximumHandle': {id: 'SliderMaximumHandle', value: 'Şunun için maksimum tutamaç aralığı:', comment: 'Describes a maximum value handle in a Range (double slider), followed in code by the name of the control'},
      'SliderMinimumHandle': {id: 'SliderMinimumHandle', value: 'Şunun için minimum tutamaç aralığı:', comment: 'Describes a minimum value handle in a Range (double slider), followed in code by the name of the control'},
      'SkipToMain': {id: 'SkipToMain', value: 'Ana İçeriğe Atla', comment: 'Skip link in header, jumps when clicked on to main area'},
      'StartsWith': {id: 'StartsWith', value: 'Şununla biter', comment: 'for condition filtering'},
      'StrikeThrough': {id: 'StrikeThrough', value: 'Üstü Çizili', comment: 'turn on and off strike through text in text editor (like word)'},
      'SortAtoZ': {id: 'SortAtoZ', value: 'Artan Şekilde Sırala', comment: 'Sort A to Z in icons for filtering'},
      'SortZtoA': {id: 'SortZtoA', value: 'Azalan Şekilde Sırala', comment: 'Sort Z to A in icons for filtering'},
      'SortDown': {id: 'SortDown', value: 'Aşağı Sırala', comment: 'Sort Down tooltip'},
      'SortUp': {id: 'SortUp', value: 'Yukarı Sırala', comment: 'Sort Up tooltip'},
      'Subscript': {id: 'Subscript', value: 'Alt Simge', comment: 'Turn on and off Subscript text in text editor (like word)'},
      'Superscript': {id: 'Superscript', value: 'Üst Simge', comment: 'Turn on and off Superscript text in text editor (like word)'},
      'Tabs': {id: 'Tabs', value: 'Sekmeler...', comment: 'Used in the Tabs Control\'s more menu, preceeded by a number that describes how many tabs are in the spillover menu'},
      'Tack': {id: 'Tack', value: 'Sabitle', comment: 'Pin an object'},
      'Tall': {id: 'Tall', value: 'Uzun', comment: 'Describes a Taller Row Height in a grid/list'},
      'Target': {id: 'Target', value: 'Hedef', comment: 'Label for an input to enter a Target (Url Attribute)'},
      'TextColor': {id: 'TextColor', value: 'Metin rengi', comment: 'add or edit text color in the editor'},

      'Timer': {id: 'Timer', value: 'Zamanlayıcı', comment: 'Timer tooltip'},
      'Today': {id: 'Today', value: 'Bugün', comment: 'refering to today on a calendar'},
      'ToggleBold': {id: 'ToggleBold', value: 'Kalın Metni Değiştir', comment: 'turn on and off bold in text editor (like word)'},
      'ToggleH3': {id: 'ToggleH3', value: 'Başlık 3'ü Değiştir', comment: 'turn on and off heading 3 text'},
      'ToggleH4': {id: 'ToggleH4', value: 'Başlık 4'ü Değiştir', comment: 'turn on and off heading 4 text'},
      'ToggleItalic': {id: 'ToggleItalic', value: 'İtalik Metni Değiştir', comment: 'turn on and off Italic in text editor (like word)'},
      'ToggleUnderline': {id: 'ToggleUnderline', value: 'Altı Çizili Metni Değiştir', comment: 'turn on and off Underline in text editor (like word)'},
      'Toolbar': {id: 'Toolbar', value: 'Araç Çubuğu', comment: 'describing the toolbar component'},
      'TopAlign': {id: 'TopAlign', value: 'Üste Hizala', comment: 'Top Align tooltip'},
      'Total': {id: 'Total', value: 'Toplam', comment: 'Mathematic total of a calculation'},
      'Totals': {id: 'Totals', value: 'Toplam', comment: 'Mathematic total of a calculation (plural)'},
      'TreeCollapse': {id: 'TreeCollapse', value: 'Ağacı Daralt', comment: 'Tree Collapse tooltip'},
      'TreeExpand': {id: 'TreeExpand', value: 'Ağacı Genişlet', comment: 'Tree Expand tooltip'},
      'Turquoise': {id: 'Turquoise', value: 'Turkuaz', comment: 'Color in our color pallette'},
      'Up': {id: 'Up', value: 'Yukarı', comment: 'Up tooltip'},
      'Upload': {id: 'Upload', value: 'Karşıya Yükle', comment: 'Upload tooltip'},
      'UnavailableDate': {id: 'UnavailableDate', value: 'Uygun Olmayan Tarih', comment: 'Unavailable Date Text'},
      'Underline': {id: 'Underline', value: 'Altı Çizili', comment: 'Make text Underlined'},
      'Undo': {id: 'Undo', value: 'Geri Al', comment: 'Undo tooltip'},
      'Unlocked': {id: 'Unlocked', value: 'Kilidi Açık', comment: 'Unlocked tooltip'},
      'UnorderedList': {id: 'UnorderedList', value: 'Madde İşaretli Listeyi Ekle/Kaldır', comment: 'Insert an Unordered list in the editor'},
      'Unsupported': {id: 'Unsupported', value: 'Bu içerik mevcut değil, çünkü geçerli tarayıcı sürümünüzde desteklenmeyen özellikler kullanıyor.', comment: 'Suggesting browser upgrade for missing features.'},
      'Url': {id: 'Url', value: 'Url', comment: 'Url tooltip'},
      'UseArrow': {id: 'UseArrow', value: '. Seçmek için ok tuşlarını kullanın.', comment: 'Instructional comments for screen readers'},
      'UseEnter': {id: 'UseEnter', value: '. Arama yapmak için enter tuşunu veya aşağı oku kullanın.', comment: 'Instructional comments for screen readers'},
      'User': {id: 'User', value: 'Kullanıcı', comment: 'User tooltip'},
      'UserProfile': {id: 'UserProfile', value: 'Kullanıcı Profili', comment: 'User Profile tooltip'},
      'VerticalMiddleAlign': {id: 'VerticalMiddleAlign', value: 'Dikey Hizalama Orta', comment: 'Vertical Align tooltip'},
      'ViewSource': {id: 'ViewSource', value: 'Kaynağı Görüntüle', comment: 'Toggle the source view in the editor'},
      'ViewVisual': {id: 'ViewVisual', value: 'Görseli Görüntüle', comment: 'Toggle the visual view in the editor'},
      'Yes': {id: 'Yes', value: 'Evet', comment: 'On a dialog button'}
    },

    /**
     * Turkish-specific rules for changing a string to uppercase
     * @param {string} str - starting text string
     * @returns {string}
     */
    toUpperCase: function(str) {
      return str.replace(/ğ/g, 'Ğ')
        .replace(/ü/g, 'Ü')
        .replace(/ş/g, 'Ş')
        .replace(/ı/g, 'I')
        .replace(/i/g, 'İ')
        .replace(/ö/g, 'Ö')
        .replace(/ç/g, 'Ç')
        .toUpperCase();
    },

    /**
     * Turkish-specific rules for changing a string to lowercase
     * @param {string} str - starting text string
     * @returns {string}
     */
    toLowerCase: function(str) {
      return str.replace(/Ğ/g, 'ğ')
        .replace(/Ü/g, 'ü')
        .replace(/Ş/g, 'ş')
        .replace(/I/g, 'ı')
        .replace(/İ/g, 'i')
        .replace(/Ö/g, 'ö')
        .replace(/Ç/g, 'ç')
        .toLowerCase();
    }

  });
}));
