(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module
    define('cultures/th-TH', ['jquery'], factory);
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
  Locale.addCulture('th-TH', {
    //layout/language
    language: 'th',
    englishName: 'Thai (Thailand)',
    nativeName: 'ไทย (ไทย)',
    //layout/orientation/@characters
    direction: 'left-to-right',
    //ca-gregorian
    calendars: [{
      //ca-gregorian/main/dates/calendars/gregorian/dateFormats/
      dateFormat: {'separator': '/', //Infered
                   'timeSeparator': ':',
                   'short': 'd/M/yyyy', //use four digit year
                   'medium': 'd MMM yyyy',
                   'long': 'd MMMM yyyy',
                   'full': 'EEEEที่ d MMMM G yyyy',
                   'month': 'dd MMMM',
                   'year': 'MMMM yyyy',
                   'timestamp': 'HH:mm:ss',
                   'datetime': 'd/M/yyyy HH:mm'}, //Infered short + short gregorian/dateTimeFormats
      //ca-gregorian/main/dates/calendars/gregorian/days/format/short or abbreviated (2 digit)
      days: {
        wide: ['วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'],
        abbreviated: ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'],
        narrow: ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']
      },
      //ca-gregorian/main/dates/calendars/gregorian/months/format/wide
      months: {
        wide: ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'],
        abbreviated: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
      },
      //ca-gregorian/main/dates/calendars/gregorian/timeFormats/short
      timeFormat: 'HH:mm',
      //ca-gregorian/main/dates/calendars/gregorian/dayPeriods/wide
      dayPeriods: ['ก่อนเที่ยง', 'หลังเที่ยง']
    }],
    //numbers/currencyFormats-numberSystem-latn/standard (Replace Sign http://www.currencysymbols.in ?)
    currencySign: 'kr', //(Replace Sign http://www.currencysymbols.in ?)
    currencyFormat: '¤#,##0.00',
    //numbers/symbols-numberSystem-latn
    numbers: {
      percentSign: '%',
      percentFormat: '#,##0 %',
      minusSign: '-',
      decimal: '.',
      group: ','
    },
    //Resx - Approved By Translation Team
    messages: {
      'AboutText': {id: 'AboutText', value: 'ลิขสิทธิ์ &copy; {0} Infor. ขอสงวนลิขสิทธิ์ คำและเครื่องหมายการออกแบบที่ระบุในที่นี้เป็นเครื่องหมายการค้า และ/หรือเครื่องหมายการค้าจดทะเบียนของ Infor และ/หรือบริษัทในเครือและบริษัทสาขา ขอสงวนลิขสิทธิ์ สำหรับเครื่องหมายการค้าอื่นที่ระบุไว้ที่นี้ทั้งหมดถือเป็นทรัพย์สินของเจ้าของที่เกี่ยวข้อง'},
      'Actions': {id: 'Actions', value: 'การดำเนินการ', comment: 'Tooltip text for the action button with additional in context actions'},
      'Add': {id: 'Add', value: 'เพิ่ม', comment: 'Add'},
      'AdvancedFilter': {id: 'AdvancedFilter', value: 'สร้างตัวกรองขั้นสูง', comment: 'In a data grid active an advanced filtering feature'},
      'Alert': {id: 'Alert', value: 'การแจ้งเตือน', comment: 'Alert'},
      'AllResults': {id: 'AllResults', value: 'ผลลัพธ์ทั้งหมดสำหรับ', comment: 'Search Results Text'},
      'AligntoBottom': {id: 'AligntoBottom', value: 'จัดชิดด้านล่าง', comment: 'Align to Bottom tooltip'},
      'AlignCenterHorizontally': {id: 'AlignCenterHorizontally', value: 'จัดแนวตรงกลางแนวนอน', comment: 'Align Center Horizontally tooltip'},
      'Amber': {id: 'Amber', value: 'สีเหลืองอำพัน', comment: 'Color in our color pallette'},
      'Amethyst': {id: 'Amethyst', value: 'สีม่วง', comment: 'Color in our color pallette'},
      'Apply': {id: 'Apply', value: 'ใช้', comment: 'Text in a button to apply an action'},
      'Attach': {id: 'Attach', value: 'แนบ', comment: 'Attach'},
      'Azure': {id: 'Azure', value: 'สีฟ้า', comment: 'Color in our color pallette'},
      'Between': {id: 'Between', value: 'ระหว่าง', comment: 'Between in icons for filtering'},
      'Blockquote': {id: 'Blockquote', value: 'บล็อกการเสนอราคา', comment: 'insert a block quote in the editor'},
      'Bold': {id: 'Bold', value: 'ตัวหนา', comment: 'Make text Bold'},
      'Bookmarked': {id: 'Bookmarked', value: 'บุ๊คมาร์ค', comment: 'Bookmark filled'},
      'BookmarkThis': {id: 'BookmarkThis', value: 'บุ๊คมาร์คหน้านี้', comment: 'Bookmark outlined'},
      'Breadcrumb': {id: 'Breadcrumb', value: 'แสดงเส้นทาง', comment: 'Text describing the Breadcrumb'},
      'BulletedList': {id: 'BulletedList', value: 'รายการสัญลักษณ์หัวข้อย่อย', comment: 'Bulleted List tooltip'},
      'Calendar': {id: 'Calendar', value: 'ปฏิทิน', comment: 'Inline Text for the title of the Calendar control'},
      'Camera': {id: 'Camera', value: 'กล้อง', comment: 'Camera tooltip'},
      'Cancel': {id: 'Cancel', value: 'ยกเลิก', comment: 'Cancel tooltip'},
      'CapsLockOn': {id: 'CapsLockOn', value: 'เปิด Caps Lock', comment: 'Caps Lock On message'},
      'Cart': {id: 'Cart', value: 'รถเข็น', comment: 'Cart tooltip'},
      'CenterText': {id: 'CenterText', value: 'ตรงกลาง', comment: 'An Icon Tooltip'},
      'CharactersLeft': {id: 'CharactersLeft', value: 'ตัวอักษรที่เหลือ {0}', comment: 'indicator showing how many more characters you can type.'},
      'CharactersMax': {id: 'CharactersMax', value: 'จำนวนตัวอักษรมากสุดของ ', comment: 'indicator showing how many max characters you can type.'},
      'ChangeSelection': {id: 'ChangeSelection', value: 'เปลี่ยนการเลือกโดยการใช้ปุ่มลูกศร', comment: 'Audible Text for drop down list help'},
      'Checkbox': {id: 'Checkbox', value: 'กล่องกาเครื่องหมาย', comment: 'Checkbox tooltip'},
      'Checked': {id: 'Checked', value: 'ตรวจสอบแล้ว', comment: 'Checked tooltip'},
      'Clear': {id: 'Clear', value: 'ล้าง', comment: 'Tooltip for a Clear Action'},
      'Clock': {id: 'Clock', value: 'นาฬิกา', comment: 'Clock tooltip'},
      'Close': {id: 'Close', value: 'ปิด', comment: 'Tooltip for a Close Button Action'},
      'Copy': {id: 'Copy', value: 'คัดลอก', comment: 'Copy tooltip'},
      'Collapse': {id: 'Collapse', value: 'ยุบ', comment: 'Collapse / close a tree/submenu'},
      'CollapseAppTray': {id: 'CollapseAppTray', value: 'ยุบถาดแอป', comment: 'Collapse App Tray tooltip'},
      'Columns': {id: 'Columns', value: 'คอลัมน์', comment: 'Columns tooltip'},
      'Compose': {id: 'Compose', value: 'เขียน', comment: 'Compose tooltip'},
      'Completed': {id: 'Completed', value: 'เสร็จสิ้นแล้ว', comment: 'Text For a Completed Status'},
      'Confirm': {id: 'Confirm', value: 'ยืนยัน', comment: 'Confirm tooltip'},
      'Contains': {id: 'Contains', value: 'ประกอบด้วย', comment: 'Contains in icons for filtering'},
      'Cut': {id: 'Cut', value: 'ตัด', comment: 'Cut tooltip'},
      'Date': {id: 'Date', value: 'วันที่', comment: 'Describes filtering by a date data type'},
      'Delete': {id: 'Delete', value: 'ลบ', comment: 'Delete Toolbar Action Tooltip'},
      'DistributeHoriz': {id: 'DistributeHoriz', value: 'กระจายแนวนอน', comment: 'Icon button tooltip for action that distributes elements across Horizontally'},
      'Document': {id: 'Document', value: 'เอกสาร', comment: 'Document tooltip'},
      'Drilldown': {id: 'Drilldown', value: 'ดูรายละเอียดแนวลึก', comment: 'Drill by moving page flow into a record'},
      'Drillup': {id: 'Drillup', value: 'ดูข้อมูลสรุป', comment: 'Opposite of Drilldown, move back up to a larger set of records'},
      'Dropdown': {id: 'Dropdown', value: 'แบบหล่นลง', comment: 'Dropdown'},
      'DoesNotContain': {id: 'DoesNotContain', value: 'ไม่มี', comment: 'Does Not Contain in icons for filtering'},
      'DoesNotEqual': {id: 'DoesNotEqual', value: 'ไม่เท่ากับ', comment: 'Does Not Equal in icons for filtering'},
      'Down': {id: 'Down', value: 'ลง', comment: 'Down tooltip'},
      'Download': {id: 'Download', value: 'ดาวน์โหลด', comment: 'Download tooltip'},
      'Duplicate': {id: 'Duplicate', value: 'ทำซ้ำ', comment: 'Duplicate tooltip'},
      'EitherSelectedOrNotSelected': {id: 'EitherSelectedOrNotSelected', value: 'เลือกหรือไม่เลือกอย่างใดอย่างหนึ่ง', comment: 'Either Selected Or NotSelected in icons for filtering'},
      'EnterComments': {id: 'EnterComments', value: 'ป้อนความเห็นที่นี่...', comment: 'Placeholder text for a text input (comments)'},
      'Error': {id: 'Error', value: 'ข้อผิดพลาด', comment: 'Title, Spoken Text describing fact an error has occured'},
      'EmailValidation': {id: 'EmailValidation', value: 'อีเมลแอดเดรสไม่ถูกต้อง', comment: 'This the rule for email validation'},
      'Emerald': {id: 'Emerald', value: 'สีเขียวมรกต', comment: 'Color in our color pallette'},
      'Expand': {id: 'Expand', value: 'ขยาย', comment: 'Expand open a tree/submenu'},
      'ExpandAppTray': {id: 'ExpandAppTray', value: 'ขยายถาดแอป', comment: 'ExpandAppTray tooltip'},
      'ExpandCollapse': {id: 'ExpandCollapse', value: 'ขยาย / ยุบ', comment: 'Text to toggle a button in a container.'},
      'ExportAsSpreadsheet': {id: 'ExportAsSpreadsheet', value: 'ส่งออกเป็นสเปรดชีต', comment: 'Export as Spreadsheet tooltip'},
      'Edit': {id: 'Edit', value: 'แก้ไข', comment: 'Edit tooltip'},
      'Equals': {id: 'Equals', value: 'เท่ากับ', comment: 'Equals in icons for filtering'},
      'ExitFullView': {id: 'ExitFullView', value: 'ออกจากหน้าจอเต็ม', comment: 'Exit Full View tooltip'},
      'Export': {id: 'Export', value: 'ส่งออก', comment: 'Export tooltip'},
      'FileUpload': {id: 'FileUpload', value: 'ไฟล์อัพโหลด กด Enter เพื่อเรียกดูไฟล์', comment: 'Screen Reader instructions'},
      'Filter': {id: 'Filter', value: 'ตัวกรอง', comment: 'Filter tooltip'},
      'FirstPage': {id: 'FirstPage', value: 'หน้าแรก', comment: 'First Page tooltip'},
      'Folder': {id: 'Folder', value: 'โฟลเดอร์', comment: 'Folder tooltip'},
      'FullView': {id: 'FullView', value: 'หน้าจอเต็ม', comment: 'Full View tooltip'},
      'GoForward': {id: 'GoForward', value: 'ไปข้างหน้า', comment: 'Move Page / object this direction'},
      'GoBack': {id: 'GoBack', value: 'ไปข้างหลัง', comment: 'Move Page / object this directionp'},
      'GoDown': {id: 'GoDown', value: 'ไปด้านล่าง', comment: 'Move Page / object this directionp'},
      'GoUp': {id: 'GoUp', value: 'ไปด้านบน', comment: 'Move Page / object this direction'},
      'Graphite': {id: 'Graphite', value: 'แกรไฟต์', comment: 'Color in our color pallette'},
      'GreaterOrEquals': {id: 'GreaterOrEquals', value: 'มากกว่าหรือเท่ากับ', comment: 'Greater Or Equals in icons for filtering'},
      'GreaterThan': {id: 'GreaterThan', value: 'มากกว่า', comment: 'Greater Than in icons for filtering'},
      'Grid': {id: 'Grid', value: 'เส้นตาราง', comment: 'Grid tooltip'},
      'Hours': {id: 'Hours', value: 'ชั่วโมง', comment: 'the hour portion of a time'},
      'HeadingThree': {id: 'HeadingThree', value: 'หัวเรื่องสาม', comment: 'Heading Three tooltip'},
      'HeadingFour': {id: 'HeadingFour', value: 'หัวเรื่องสี่', comment: 'Heading Four tooltip'},
      'Highest': {id: 'Highest', value: 'สูงสุด', comment: 'Highest Four tooltip'},
      'Home': {id: 'Home', value: 'หน้าแรก', comment: 'Home tooltip'},
      'HtmlView': {id: 'HtmlView', value: 'มุมมอง Html', comment: 'Html View tooltip'},
      'Import': {id: 'Import', value: 'นำเข้า', comment: 'Import tooltip'},
      'Info': {id: 'Info', value: 'ข้อมูล', comment: 'Info tooltip'},
      'InsertAnchor': {id: 'InsertAnchor', value: 'แทรกจุดยึด', comment: 'Insert Acnhor (link) in an editor'},
      'InsertImage': {id: 'InsertImage', value: 'แทรกรูปภาพ', comment: 'Insert Image in an editor'},
      'Italic': {id: 'Italic', value: 'ตัวเอียง', comment: 'Make Text Italic'},
      'InvalidDate': {id: 'InvalidDate', value: 'วันที่ไม่ถูกต้อง', comment: 'validation message for wrong date format (short)'},
      'Inventory': {id: 'Inventory', value: 'สินค้าคงคลัง', comment: 'Icon button tooltop for Inventory Action'},
      'IsEmpty': {id: 'IsEmpty', value: 'ที่ว่าง', comment: 'Is Empty in icons for filtering'},
      'IsNotEmpty': {id: 'IsNotEmpty', value: 'ที่ไม่ว่าง', comment: 'Is Not Empty in icons for filtering'},
      'JustifyCenter': {id: 'JustifyCenter', value: 'จัดให้อยู่ตรงกลาง', comment: 'justify text to center in the editor'},
      'JustifyLeft': {id: 'JustifyLeft', value: 'จัดให้อยู่ด้านซ้าย', comment: 'justify text to left in the editor'},
      'JustifyRight': {id: 'JustifyRight', value: 'จัดให้อยู่ด้านขวา', comment: 'justify text to right in the editor'},
      'Keyword': {id: 'Keyword', value: 'คำสำคัญ', comment: 'Describes filtering by a keyword search'},
      'Launch': {id: 'Launch', value: 'เปิดใช้', comment: 'Launch'},
      'LastPage': {id: 'LastPage', value: 'หน้าสุดท้าย', comment: 'Last Page tooltip'},
      'Left': {id: 'Left', value: 'ซ้าย', comment: 'Left tooltip'},
      'LeftAlign': {id: 'LeftAlign', value: 'จัดแนวชิดซ้าย', comment: 'Left Align tooltip'},
      'LeftTextAlign': {id: 'LeftTextAlign', value: 'จัดข้อความชิดซ้าย', comment: 'Left Text Align tooltip'},
      'LessOrEquals': {id: 'LessOrEquals', value: 'น้อยกว่าหรือเท่ากับ', comment: 'Less Or Equals in icons for filtering'},
      'LessThan': {id: 'LessThan', value: 'น้อยกว่า', comment: 'Less Than in icons for filtering'},
      'Link': {id: 'Link', value: 'ลิงค์', comment: 'Link - as in hyperlink - icon tooltop'},
      'Load': {id: 'Load', value: 'โหลด', comment: 'Load icon tooltip'},
      'Loading': {id: 'Loading', value: 'กำลังโหลด', comment: 'Text below spinning indicator to indicate loading'},
      'Locked': {id: 'Locked', value: 'ถูกล็อค', comment: 'Locked tooltip'},
      'Lookup': {id: 'Lookup', value: 'ค้นหา', comment: 'Lookup - As in looking up a record or value'},
      'Lowest': {id: 'Lowest', value: 'ต่ำที่สุด', comment: 'Lowest - As in Lowest value'},
      'Mail': {id: 'Mail', value: 'เมล', comment: 'Mail tooltip'},
      'MapPin': {id: 'MapPin', value: 'ปักหมุดแผนที่', comment: 'Map Pin tooltip'},
      'Maximize': {id: 'Maximize', value: 'ขยายใหญ่สุด', comment: 'Maximize a screen or dialog in the UI'},
      'Median': {id: 'Median', value: 'ตรงกลาง', comment: 'Median in Mathematics'},
      'Medium': {id: 'Medium', value: 'กลาง', comment: 'Describes a Medium sized Row Height in a grid/list'},
      'Menu': {id: 'Menu', value: 'เมนู', comment: 'Menu tooltip'},
      'MingleShare': {id: 'MingleShare', value: 'แบ่งปันกับ Ming.le', comment: 'Share the contextual object/action in the mingle system'},
      'Minutes': {id: 'Minutes', value: 'นาที', comment: 'the minutes portion of a time'},
      'Minimize': {id: 'Minimize', value: 'ย่อเล็กสุด', comment: 'Minimize tooltip'},
      'Minus': {id: 'Minus', value: 'ลบ', comment: 'Minus tooltip'},
      'More': {id: 'More', value: 'เพิ่มเติม...', comment: 'Text Indicating More Buttons or form content'},
      'MoreActions': {id: 'MoreActions', value: 'การดำเนินการเพิ่มเติม', comment: 'Text on the More Actions button indictating hidden functions'},
      'MsgDirty': {id: 'MsgDirty', value: 'แก้ไขแล้ว', comment: 'for modified form fields'},
      'MultiselectWith': {id: 'MultiselectWith', value: 'เลือกหลายรายการพร้อมด้วย ', comment: 'the minutes portion of a time'},
      'NewDocument': {id: 'NewDocument', value: 'เอกสารใหม่', comment: 'New Document tooltip'},
      'Next': {id: 'Next', value: 'ถัดไป', comment: 'Next in icons tooltip'},
      'NextPage': {id: 'NextPage', value: 'หน้าถัดไป', comment: 'Next on Pager'},
      'NextMonth': {id: 'NextMonth', value: 'เดือนหน้า', comment: 'the label for the button that moves calendar to next/prev'},
      'NoResults': {id: 'NoResults', value: 'ไม่พบผลลัพธ์', comment: 'Search Results Text'},
      'Notes': {id: 'Notes', value: 'หมายเหตุ', comment: 'Notes icon tooltip'},
      'NotSelected': {id: 'NotSelected', value: 'ไม่ได้เลือกไว้', comment: 'Not Selected in icons for filtering'},
      'NumberList': {id: 'NumberList', value: 'รายการตัวเลข', comment: 'Number List tooltip'},
      'OpenBackClose': {id: 'OpenBackClose', value: 'เปิด / ย้อนกลับ / ปิด', comment: 'Open / Back / Close tooltip'},
      'OpenClose': {id: 'OpenClose', value: 'เปิด / ปิด', comment: 'Open / Close tooltip'},
      'OrderedList': {id: 'OrderedList', value: 'รายการที่สั่งซื้อไว้', comment: 'Insert an Ordered list in the editor'},
      'Page': {id: 'Page', value: 'หน้า ', comment: 'Text on the pager links'},
      'PageOf': {id: 'PageOf', value: 'หน้า {0} จาก {1}', comment: 'Pager Text Showing current and number of pages'},
      'PageOn': {id: 'PageOn', value: 'ขณะนี้คุณอยู่บนเพจ ', comment: 'Text on the pager links'},
      'Paste': {id: 'Paste', value: 'วาง', comment: 'Paste icon tooltip'},
      'PasswordValidation': {id: 'PasswordValidation', value: '<strong>รหัสผ่านต้อง:</strong><br>มีความยาวตัวอักษรอย่างน้อย 10 ตัว<br>มีอักษรพิมพ์ใหญ่อย่างน้อยหนึ่งตัว<br>มีอักษรพิมพ์เล็กอย่างน้อยหนึ่งตัว<br><strong>ประกอบด้วยอักขระพิเศษหนึ่งตัว</strong><br>ไม่มีชื่อผู้ใช้ของคุณ<br>ไม่สามารถใช้รหัสผ่านที่เคยใช้งานก่อนหน้า<br>', comment: 'Password validation requirements'},
      'PasswordConfirmValidation': {id: 'PasswordConfirmValidation', value: 'รหัสผ่านต้องตรงกัน', comment: 'Password Confirm validation'},
      'Peak': {id: 'Peak', value: 'สูงสุด', comment: 'the max or peak value in a chart'},
      'PersonalizeColumns': {id: 'PersonalizeColumns', value: 'ปรับแต่งคอลัมน์', comment: 'Customize Columns in a Grid'},
      'Period': {id: 'Period', value: 'งวด', comment: 'the am/pm portion of a time'},
      'PressDown': {id: 'PressDown', value: 'กด Down เพื่อเลือกวันที่', comment: 'the audible label for Tooltip about how to operate the date picker'},
      'PressShiftF10': {id: 'PressShiftF10', value: 'กด Shift+F10 เพื่อเปิดเมนูเนื้อหา', comment: 'the audible infor for screen readers on how to use a field with a popup menu'},
      'Previous': {id: 'Previous', value: 'ก่อนหน้า', comment: 'Previous icon tooltip - moved to previous record'},
      'PreviousMonth': {id: 'PreviousMonth', value: 'เดือนก่อนหน้า', comment: 'the label for the button that moves calendar to next/prev'},
      'PreviousPage': {id: 'PreviousPage', value: 'หน้าก่อนหน้า', comment: 'Previous Page tooltip'},
      'Print': {id: 'Print', value: 'พิมพ์', comment: 'Print tooltip'},
      'Range': {id: 'Range', value: 'ขอบเขต', comment: 'Range for tooltip'},
      'RecordsPerPage': {id: 'RecordsPerPage', value: '{0} บันทึกต่อหน้า', comment: 'Dropd own allows the user to select how many visible records {} shows select value.'},
      'Redo': {id: 'Redo', value: 'ทำซ้ำ', comment: 'Redo tooltip'},
      'Refresh': {id: 'Refresh', value: 'รีเฟรช', comment: 'Refresh tooltip'},
      'Required': {id: 'Required', value: 'จำเป็น', comment: 'indicates a form field is manditory'},
      'Reset': {id: 'Reset', value: 'รีเซ็ต', comment: 'Reset tooltip'},
      'Results': {id: 'Results', value: 'ผลลัพธ์', comment: 'As in showing N Results in a List'},
      'Right': {id: 'Right', value: 'ขวา', comment: 'Right tooltip'},
      'RightAlign': {id: 'RightAlign', value: 'จัดแนวชิดขวา', comment: 'Right Align tooltip'},
      'RightAlignText': {id: 'RightAlignText', value: 'จัดข้อความชิดขวา', comment: 'Right Align Text tooltip'},
      'Roles': {id: 'Roles', value: 'บทบาท', comment: 'Roles tooltip'},
      'RowHeight': {id: 'RowHeight', value: 'ความสูงแถว', comment: 'Describes the Height for Rows in a Data Grid'},
      'Ruby': {id: 'Ruby', value: 'ทับทิม', comment: 'Color in our color pallette'},
      'Save': {id: 'Save', value: 'บันทึก', comment: 'Save tooltip'},
      'SaveCurrentView': {id: 'SaveCurrentView', value: 'บันทึกมุมมองปัจจุบัน', comment: 'Datagrids contain view sets. This menu option saves them'},
      'SavedViews': {id: 'SavedViews', value: 'มุมมองที่บันทึกไว้', comment: 'Label for a list of Views'},
      'Search': {id: 'Search', value: 'ค้นหา', comment: 'Search tooltip'},
      'SearchFolder': {id: 'SearchFolder', value: 'ค้นหาโฟลเดอร์', comment: 'Search Folder tooltip'},
      'SearchList': {id: 'SearchList', value: 'ค้นหารายการ', comment: 'Search List tooltip'},
      'Selected': {id: 'Selected', value: 'เลือกแล้ว', comment: 'text describing a selected object'},
      'Send': {id: 'Send', value: 'ส่ง', comment: 'Send tooltip'},
      'SetTime': {id: 'SetTime', value: 'ตั้งเวลา', comment: 'button text that inserts time when clicked'},
      'Settings': {id: 'Settings', value: 'การตั้งค่า', comment: 'Settings tooltip'},
      'Short': {id: 'Short', value: 'สั้น', comment: 'Describes a Shorted Row Height in a grid/list'},
      'Slate': {id: 'Slate', value: 'กระดานชนวน', comment: 'Color in our color pallette'},
      'SliderHandle': {id: 'SliderHandle', value: 'จัดการสำหรับ', comment: 'Description of the portion of a Slider control that is focusable and changes its value, followed in code by the name of the control'},
      'SliderMaximumHandle': {id: 'SliderMaximumHandle', value: 'ช่วงสูงสุดในการจัดการสำหรับ', comment: 'Describes a maximum value handle in a Range (double slider), followed in code by the name of the control'},
      'SliderMinimumHandle': {id: 'SliderMinimumHandle', value: 'ช่วงต่ำสุดในการจัดการสำหรับ', comment: 'Describes a minimum value handle in a Range (double slider), followed in code by the name of the control'},
      'SkipToMain': {id: 'SkipToMain', value: 'ข้ามไปยังเนื้อหาหลัก', comment: 'Skip link in header, jumps when clicked on to main area'},
      'StrikeThrough': {id: 'StrikeThrough', value: 'ขีดทับ', comment: 'turn on and off strike through text in text editor (like word)'},
      'SortAtoZ': {id: 'SortAtoZ', value: 'เรียงจาก A ไป Z', comment: 'Sort A to Z in icons for filtering'},
      'SortZtoA': {id: 'SortZtoA', value: 'เรียงจาก Z ไป A', comment: 'Sort Z to A in icons for filtering'},
      'SortDown': {id: 'SortDown', value: 'เรียงลง', comment: 'Sort Down tooltip'},
      'SortUp': {id: 'SortUp', value: 'เรียงขึ้น', comment: 'Sort Up tooltip'},
      'StarFilled': {id: 'StarFilled', value: 'Star Filled', comment: 'Star Filled tooltip'},
      'StarHalf': {id: 'StarHalf', value: 'Star Half', comment: 'Star Half tooltip'},
      'StarOutlined': {id: 'StarOutlined', value: 'Star Outlined', comment: 'Star Outlined tooltip'},
      'Subscript': {id: 'Subscript', value: 'ตัวห้อย', comment: 'Turn on and off Subscript text in text editor (like word)'},
      'Superscript': {id: 'Superscript', value: 'ตัวยก', comment: 'Turn on and off Superscript text in text editor (like word)'},
      'Tack': {id: 'Tack', value: 'แท็ก', comment: 'Tack tooltip'},
      'Tall': {id: 'Tall', value: 'สูง', comment: 'Describes a Taller Row Height in a grid/list'},
      'Timer': {id: 'Timer', value: 'ตัวจับเวลา', comment: 'Timer tooltip'},
      'Today': {id: 'Today', value: 'วันนี้', comment: 'refering to today on a calendar'},
      'ToggleBold': {id: 'ToggleBold', value: 'สลับตัวหนา', comment: 'turn on and off bold in text editor (like word)'},
      'ToggleH3': {id: 'ToggleH3', value: 'สลับหัวเรื่อง 3', comment: 'turn on and off heading 3 text'},
      'ToggleH4': {id: 'ToggleH4', value: 'สลับหัวเรื่อง 4', comment: 'turn on and off heading 4 text'},
      'ToggleItalic': {id: 'ToggleItalic', value: 'สลับอักษรตัวเอียง', comment: 'turn on and off Italic in text editor (like word)'},
      'ToggleUnderline': {id: 'ToggleUnderline', value: 'สลับอักษรที่ขีดเส้นใต้', comment: 'turn on and off Underline in text editor (like word)'},
      'Toolbar': {id: 'Toolbar', value: 'แถบเครื่องมือ', comment: 'describing the toolbar component'},
      'TopAlign': {id: 'TopAlign', value: 'จัดชิดด้านบน', comment: 'Top Align tooltip'},
      'Total': {id: 'Total', value: 'ทั้งหมด', comment: 'Mathematic total of a calculation'},
      'TreeCollapse': {id: 'TreeCollapse', value: 'ยุบทรี', comment: 'Tree Collapse tooltip'},
      'TreeExpand': {id: 'TreeExpand', value: 'ขยายทรี', comment: 'Tree Expand tooltip'},
      'Turquoise': {id: 'Turquoise', value: 'สีฟ้าน้ำทะเล', comment: 'Color in our color pallette'},
      'Up': {id: 'Up', value: 'ขึ้น', comment: 'Up tooltip'},
      'Upload': {id: 'Upload', value: 'อัพโหลด', comment: 'Upload tooltip'},
      'UnavailableDate': {id: 'UnavailableDate', value: 'วันที่ไม่พร้อมใช้งาน', comment: 'Unavailable Date Text'},
      'Underline': {id: 'Underline', value: 'ขีดเส้นใต้', comment: 'Make text Underlined'},
      'Undo': {id: 'Undo', value: 'เลิกทำ', comment: 'Undo tooltip'},
      'Unlocked': {id: 'Unlocked', value: 'ถูกปลดล็อค', comment: 'Unlocked tooltip'},
      'UnorderedList': {id: 'UnorderedList', value: 'รายการที่ไม่ได้สั่งซื้อไว้', comment: 'Insert an Unordered list in the editor'},
      'Unsupported': {id: 'Unsupported', value: 'เนื้อหานี้ไม่พร้อมใช้งาน เนื่องจากเนื้อหาใช้คุณลักษณะที่ไม่ได้รับการรับรองในเวอร์ชันเบราว์เซอร์ปัจจุบันของคุณ', comment: 'Suggesting browser upgrade for missing features.'},
      'Url': {id: 'Url', value: 'Url', comment: 'Url tooltip'},
      'UseArrow': {id: 'UseArrow', value: '. ใช้ปุ่มลูกศรเพื่อเลือก', comment: 'Instructional comments for screen readers'},
      'UseEnter': {id: 'UseEnter', value: '. ใช้ enter หรือลูกศรลงเพื่อค้นหา', comment: 'Instructional comments for screen readers'},
      'User': {id: 'User', value: 'ผู้ใช้', comment: 'User tooltip'},
      'UserProfile': {id: 'UserProfile', value: 'โปรไฟล์ผู้ใช้', comment: 'User Profile tooltip'},
      'VerticalMiddleAlign': {id: 'VerticalMiddleAlign', value: 'จัดแนวตรงกลางแนวตั้ง', comment: 'Vertical Middle Align tooltip'},
      'ViewSource': {id: 'ViewSource', value: 'ดูทรัพยากร', comment: 'Toggle the source view in the editor'},
      'ViewVisual': {id: 'ViewVisual', value: 'ดูภาพ', comment: 'Toggle the visual view in the editor'}
    }
  });
}));
