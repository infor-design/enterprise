/* eslint-disable no-underscore-dangle */
import { Environment as env } from './environment';
import { Formatters } from '../components/datagrid/datagrid.formatters';

/* eslint-disable import/prefer-default-export */
const excel = {};

/**
 * Remove Hidden Columns and Non Exportable Columns.
 * @private
 * @param {string} customDs An optional customized version of the data to use.
 * @param {string} self The grid api to use (if customDs is not used)
 * @returns {object} an table element cleaned extra stuff
 */
excel.cleanExtra = function (customDs, self) {
  const clean = function (table) {
    const removeNode = (node) => {
      if (node.parentNode) {
        node.parentNode.removeChild(node);
      }
    };
    const nonExportables = [];
    const rows = [].slice.call(table[0].querySelectorAll('tr'));

    rows.forEach((row) => {
      if (row.classList.contains('is-hidden') || row.classList.contains('datagrid-expandable-row')) {
        removeNode(row);
        return;
      }

      const elements = [].slice.call(row.querySelectorAll('th, td, div, span'));
      elements.forEach((el) => {
        if (el.classList.contains('is-hidden')) {
          removeNode(el);
          return;
        }

        // THEAD
        const attrExportable = el.getAttribute('data-exportable');
        if (attrExportable && attrExportable === 'no') {
          const index = parseInt(el.id.slice(-1), 10);
          nonExportables.push(index + 1);
          removeNode(el);
          return;
        }

        // TBODY
        const attrAriaColindex = el.getAttribute('aria-colindex');
        if (el.tagName.toLowerCase() === 'td' && attrAriaColindex) {
          if (nonExportables.indexOf(parseInt(attrAriaColindex, 10)) !== -1) {
            removeNode(el);
            return;
          }
        }

        const innerElements = [].slice.call(el.querySelectorAll('.is-hidden, .datagrid-expand-btn, .is-draggable-target, .handle, .sort-indicator, .datagrid-filter-wrapper'));
        innerElements.forEach(innerEl => removeNode(innerEl));

        while (el.attributes.length > 0) {
          el.removeAttribute(el.attributes[0].name);
        }

        // White Hat Security Violation. Remove Excel formulas
        // Excel Formulas Start with =SOMETHING
        const text = el.textContent;
        if (text.substr(0, 1) === '=' && text.substr(1, 1) !== '') {
          el.textContent = `'${text}'`;
        }
      });
    });

    return table;
  };

  let table = [];
  if (!self && customDs) {
    table = excel.datasetToHtml(customDs);
  } else {
    const dataset = self.settings.groupable ? self.originalDataset : self.settings.dataset;
    table = excel.appendRows(dataset, self.table[0].cloneNode(true), self);
  }

  // Create the header row
  if (!customDs && !table[0].querySelector('thead')) {
    const tbody = table[0].querySelector('tbody');
    const header = table[0].createTHead();
    const row = header.insertRow(0);
    const allHeaderNodes = self.headerNodes();

    for (let i = 0; i < allHeaderNodes.length; i++) {
      const headerNode = allHeaderNodes[i];
      const cell = row.insertCell(i);
      cell.innerHTML = headerNode.querySelector('.datagrid-header-text').textContent.trim();
      cell.setAttribute('class', headerNode.classList);
      cell.setAttribute('id', headerNode.getAttribute('id'));
      if (headerNode.getAttribute('data-exportable')) {
        cell.setAttribute('data-exportable', headerNode.getAttribute('data-exportable'));
      }
    }
    tbody.parentNode.insertBefore(header, tbody);
  }

  table = clean(table);

  // Exporting data with trailing negative signs moved in front
  if (self && self.settings.exportConvertNegative) {
    const cells = [].slice.call(table[0].querySelectorAll('td'));
    cells.forEach((td) => {
      td.textContent = td.textContent.replace(/^(.+)(-$)/, '$2$1');
    });
  }
  return table;
};

/**
 * Save file to download `.xls or .csv`.
 * @private
 * @param {string} content The content for the file in the download.
 * @param {string} fileName The desired export filename in the download.
 * @param {boolean} isUtf16 If true, will encode as Utf-16le.
 * @returns {void}
 */
excel.save = function (content, fileName, isUtf16) {
  const ext = (fileName.match(/\.([^.]*?)(?=\?|#|$)/) || [])[1];
  const isTypeExcel = typeof ext === 'string' && /\b(xlsx|xls)\b/g.test(ext);
  let blob = new Blob([content], {
    type: 'application/csv;charset=utf-8;'
  });

  // ref: https://stackoverflow.com/a/43099608
  if (isUtf16 && !isTypeExcel) {
    const byteArray = [255, 254];
    for (let i = 0; i < content.length; ++i) {
      const charCode = content.charCodeAt(i);
      byteArray.push(charCode & 0xff); // eslint-disable-line
      byteArray.push(charCode / 256 >>> 0); // eslint-disable-line
    }
    blob = new Blob([new Uint8Array(byteArray)], {
      type: 'text/plain;charset=UTF-16LE;'
    });
  }

  if (env.browser.name === 'ie' || env.browser.name === 'edge') {
    if (window.navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, fileName);
    }
  } else if (window.URL.createObjectURL) { // createObjectURL api allows downloading larger files
    if (isTypeExcel) {
      blob = new Blob([content], {
        type: 'application/vnd.ms-excel;charset=utf-8;'
      });
    }
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);
  } else {
    const link = document.createElement('a');
    link.href = this.base64(content);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

/**
* Convert a dataset to a html table for conversion to excel.
* @private
* @param {string} dataset The array of objects to convert
* @returns {string} an html table as a string
*/
excel.datasetToHtml = function (dataset) {
  let tableHtml = '<tbody>';
  for (let i = 0, l = dataset.length; i < l; i++) {
    tableHtml += '<tr>';
    Object.keys(dataset[i]).forEach((key, index) => { //eslint-disable-line
      if (dataset[i] && Object.prototype.hasOwnProperty.call(dataset[i], key)) {
        tableHtml += `<td>${dataset[i][key]}</td>`;
      }
    });
    tableHtml += '</tr>';
  }

  tableHtml += '</tbody>';
  return $('<table></table>').append(tableHtml);
};

/**
* Convert a dataset to a html table for conversion to excel.
* @private
* @param {array} dataset The array of objects to convert.
* @param {object} table The table object.
* @param {object} self The grid API.
* @returns {object} The table with rows appended.
*/
excel.appendRows = function (dataset, table, self) {
  const isjQuery = obj => (obj && (obj instanceof jQuery || obj.constructor.prototype.jquery));
  const tableJq = isjQuery(table) ? table : $(table);
  table = tableJq[0];

  let tableHtml = '';
  const body = table.querySelector('tbody');
  body.innerHTML = '';
  const appendRow = function (d, i) {
    if (!d._isFilteredOut) {
      const rowHtml = self.rowHtml(d, i, i, false, false, i, true);
      const tr = document.createElement('tr');
      tr.innerHTML = rowHtml.left + rowHtml.center + rowHtml.right;
      tableHtml += tr.outerHTML;

      // Add tree rows
      if (d.children) {
        for (let j = 0, l = d.children.length; j < l; j++) {
          appendRow(d.children[j], j);
        }
      }
    }
  };

  dataset.forEach((d, i) => {
    appendRow(d, i);
  });

  body.insertAdjacentHTML('beforeend', tableHtml);
  return tableJq;
};

/**
 * Convert a excel string to base64 format for download.
 * @private
 * @param {string} s The string containing the document.
 * @returns {string} The excel doc as a base64 string.
 */
excel.base64 = function (s) {
  if (window.btoa) {
    return `data:application/vnd.ms-excel;base64,${window.btoa(unescape(encodeURIComponent(s)))}`;
  }
  return `data:application/vnd.ms-excel;,${unescape(encodeURIComponent(s))}`;
};

/**
 * Copy pasted data into the dataset to facilitate copy from excel.
 * @param {object} pastedData The paste data from the paste event.
 * @param {[type]} rowCount The number of rows.
 * @param {[type]} colIndex The column index we started on.
 * @param {[type]} dataSet The dataset.
 * @param {[type]} self The datagrid API.
 * @returns {void}
 */
excel.copyToDataSet = function (pastedData, rowCount, colIndex, dataSet, self) {
  const validateFields = function (values, settings, rowData, idx) {
    for (let j = 0, l = values.length; j < l; j++) {
      const col = settings.columns[idx];

      if (col.formatter !== Formatters.Readonly) {
        if (col.editor.name === 'input') {
          if (col.filterType === 'integer' || col.filterType === 'decimal' || col.filterType === 'number') {
            // Number Values

            // Validates if input is number. If true, will overwrite the data in cell otherwise nothing will happen.
            if (!isNaN(values[j].trim())) {
              rowData[col.field] = values[j];
            }
          } else {
            // String Values
            // Just overwrite the data in the cell
            rowData[col.field] = values[j];
          }
        } else if (col.editor.name === 'input') {
          // Validates if input is date. If true, will overwrite the data in cell otherwise nothing will happen.
          if (!isNaN(Date.parse(values[j]))) {
            rowData[col.field] = new Date(values[j]);
          }
        }
      }

      idx++;
    }
  };

  const pastedDataLen = pastedData.length;
  const columnsLen = self.settings.columns.length;

  for (let i = 0; i < pastedDataLen; i++) {
    const rawVal = pastedData[i].split('\t');
    const startColIndex = colIndex;

    if (rowCount < dataSet.length) {
      const currentRowData = dataSet[rowCount];
      validateFields(rawVal, self.settings, currentRowData, startColIndex);
    } else {
      const newRowData = {};
      for (let k = 0; k < columnsLen; k++) {
        newRowData[self.settings.columns[k].field] = '';
      }
      validateFields(rawVal, self.settings, newRowData, startColIndex);
      dataSet.push(newRowData);
    }
    rowCount++;
  }

  self.renderRows();
  self.syncSelectedUI();
  self.pagerRefresh('bottom');
};

/**
 * Export the grid contents to xls format. This may give a warning when opening the file.
 * exportToCsv may be prefered.
 * @param {string} fileName The desired export filename in the download.
 * @param {string} worksheetName A name to give the excel worksheet tab.
 * @param {string} customDs An optional customized version of the data to use.
 * @param {object} self The grid api if customDS is not used
 * @returns {void}
 */
excel.exportToExcel = function (fileName, worksheetName, customDs, self) {
  const template = '' +
    '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">' +
      '<head>' +
        '<!--[if gte mso 9]>' +
          '<xml>' +
            '<x:ExcelWorkbook>' +
              '<x:ExcelWorksheets>' +
                '<x:ExcelWorksheet>' +
                  '<x:Name>{worksheet}</x:Name>' +
                  '<x:WorksheetOptions>' +
                    '<x:Panes></x:Panes>' +
                    '<x:DisplayGridlines></x:DisplayGridlines>' +
                  '</x:WorksheetOptions>' +
                '</x:ExcelWorksheet>' +
              '</x:ExcelWorksheets>' +
            '</x:ExcelWorkbook>' +
          '</xml>' +
        '<![endif]-->' +
        '<meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>' +
      '</head>' +
      '<body>' +
        '<table border="1px solid #999999">{table}</table>' +
      '</body>' +
    '</html>';

  const formatExcel = function (s, c) {
    return s.replace(/{(\w+)}/g, (m, p) => c[p]);
  };

  const table = excel.cleanExtra(customDs, self);
  const ctx = { worksheet: (worksheetName || 'Worksheet'), table: table[0].innerHTML };

  fileName = `${fileName || self.element[0].id || 'Export'}.xls`;
  excel.save(formatExcel(template, ctx), fileName);
};

/**
 * Export the grid contents to csv
 * @param {string} fileName The desired export filename in the download.
 * @param {string} customDs An optional customized version of the data to use.
 * @param {string|object} sep (optional) If user's machine is configured for a locale with alternate default seperator.
 * The char double quote `"` is not allowed to be use as seperator char
 * Can use as custom string `sep=;` or `;` will add to first line and use `;` as seperator
 * @param {boolean} [sep.firstLine=true] if false will not added to first line `sep=<separator.char>`
 * @param {string} [sep.char=','] custom separator char
 * @param {boolean} [sep.flexChar=true] if false `char` will not be auto change to `\t` tab in case utf-16 encode for csv file
 * @param {boolean} [sep.flexUtf8=true] if false `utf-8` will not be auto change to `utf-16le` in case utf-16 encode for csv file
 * @param {string} self The grid api to use (if customDs is not used)
 * @returns {void}
 */
excel.exportToCsv = function (fileName, customDs, sep = 'sep=,', self) {
  const isObject = v => (v && typeof v === 'object' && v.constructor === Object);
  const isFalse = v => /^(false|0+|null)$/gi.test(v);

  // Set Separator
  const separator = { firstLine: true, char: ',', flexChar: true, flexUtf8: true };
  if (sep !== 'sep=,' && !isFalse(sep)) {
    const setChar = char => (char !== '"' ? char : separator.char);
    if (isObject(sep)) {
      separator.firstLine = !isFalse(sep.firstLine);
      separator.flexChar = !isFalse(sep.flexChar);
      separator.flexUtf8 = !isFalse(sep.flexUtf8);
      if (typeof sep.char === 'string' && sep.char.length === 1 && !isFalse(sep.char)) {
        separator.char = setChar(sep.char);
      }
    } else if (typeof sep === 'string') {
      if (sep.length === 1 && !isFalse(sep)) {
        separator.char = setChar(sep);
      } else if (/^sep=.$/.test(sep)) {
        const char = sep.replace('sep=', '');
        separator.char = !isFalse(char) ? setChar(char) : separator.char;
      }
    }
  }

  const formatCsv = function (table, isUtf16) {
    // utf16: use tab `\t` to separate columns in order be displayed properly on excel
    const separatorChar = isUtf16 && separator.flexChar ? '\t' : separator.char;
    const csv = [];
    const rows = [].slice.call(table[0].querySelectorAll('tr'));
    rows.forEach((row) => {
      const rowContent = [];
      const cols = [].slice.call(row.querySelectorAll('td, th'));
      cols.forEach(col => rowContent.push(col.textContent.replace(/\r?\n|\r/g, '').replace(/"/g, '""').trim()));
      csv.push(rowContent.join(`"${separatorChar}"`));
    });
    if (separator.firstLine &&
        ((separator.flexUtf8 && !isUtf16) ||
         (!separator.flexUtf8 && separator.char !== ','))) {
      csv.unshift([`sep=${separator.char}`]);
    }
    return `${!separator.flexUtf8 ? '\uFEFF' : ''}"${csv.join('"\n"')}"`;
  };

  const table = excel.cleanExtra(customDs, self);
  // ref: https://stackoverflow.com/a/2551031
  const isUtf16 = !(/^[\u0000-\u007f]*$/.test(table[0].textContent)) && separator.flexUtf8; // eslint-disable-line
  const data = formatCsv(table, isUtf16);

  fileName = `${fileName || self.element[0].id || 'Export'}.csv`;
  excel.save(data, fileName, isUtf16);
};

export { excel };

/* eslint-enable import/prefer-default-export */
