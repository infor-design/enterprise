import { Environment as env } from '../utils/environment';
import { Formatters } from '../datagrid/datagrid.formatters';
import { Editors } from '../datagrid/datagrid.editors';

/* eslint-disable import/prefer-default-export */
const excel = {};

/**
* Export the grid contents to csv
* @param {string} fileName The desired export filename in the download.
* @param {string} customDs An optional customized version of the data to use.
* @param {string} self The grid api to use (if customDs is not used)
*/
excel.exportToCsv = function (fileName, customDs, self) {
  const name = fileName || self.element.attr('id') || 'Export';
  fileName = `${name}.csv`;

  let csvData = null;
  const cleanExtra = function (table) {
    $('tr, th, td, div, span', table).each(function () {
      const el = this;
      const elm = $(this);

      if (elm.is('.is-hidden, .datagrid-expandable-row')) {
        elm.remove();
        return;
      }

      $('.is-hidden, .is-draggable-target, .handle, .sort-indicator, .datagrid-filter-wrapper', el).remove();
      while (el.attributes.length > 0) {
        el.removeAttribute(el.attributes[0].name);
      }

      // White Hat Security Violation. Remove Excel formulas
      // Excel Formulas Start with =SOMETHING
      const text = elm.text();
      if (text.substr(0, 1) === '=' && text.substr(1, 1) !== '') {
        elm.text(`'${text}`);
      }
    });
    return table;
  };
  const appendRows = function (dataset, table) {
    let tableHtml;
    const body = table.find('tbody').empty();

    for (let i = 0; i < dataset.length; i++) {
      if (!dataset[i].isFiltered) {
        tableHtml += self.rowHtml(dataset[i], i, i);
      }
    }

    body.append(tableHtml);
    return table;
  };
  const base64 = function (s) {
    if (window.btoa) {
      return `data:application/csv;base64,${window.btoa(unescape(encodeURIComponent(s)))}`;
    }
    return `data:application/csv;,${unescape(encodeURIComponent(s))}`;
  };
  const formatCsv = function (table) {
    const csv = [];
    const rows = table.find('tr');
    let row;
    let cols;
    let content;

    // CHECK EXPORTABLE
    const nonExportables = [];
    $.each($('th', self.headerRow).not('.is-hidden'), (index, item) => {
      if ($(item)[0].getAttribute('data-exportable') && $(item)[0].getAttribute('data-exportable') === 'no') {
        nonExportables.push(index);
      }
    });

    for (let i = 0, l = rows.length; i < l; i++) {
      row = [];
      cols = $(rows[i]).find('td, th');
      for (let i2 = 0; i2 < cols.length; i2++) {
        if (nonExportables.indexOf(i2) <= -1) {
          content = cols[i2].innerText.replace(/"/g, '""');

          // Exporting data with trailing negative signs moved in front
          if (self.settings.exportConvertNegative) {
            content = content.replace(/^(.+)(-$)/, '$2$1');
          }
          row.push(content);
        }
      }
      csv.push(row.join('","'));
    }
    return `"${csv.join('"\n"')}"`;
  };
  let table = self.table.clone();

  table = appendRows(customDs || self.settings.dataset, table);
  if (!table.find('thead').length) {
    self.headerRow.clone().insertBefore(table.find('tbody'));
  }

  table = cleanExtra(table);
  csvData = formatCsv(table);

  if (env.browser.name === 'ie' || env.browser.name === 'edge') {
    if (window.navigator.msSaveBlob) {
      const blob = new Blob([csvData], {
        type: 'application/csv;charset=utf-8;'
      });
      navigator.msSaveBlob(blob, fileName);
    }
  } else if (window.URL.createObjectURL) { // createObjectURL api allows downloading larger files
    const blob = new Blob([csvData], {
      type: 'application/csv;charset=utf-8;'
    });
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
    link.href = base64(csvData);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

/**
* Export the grid contents to xls format. This may give a warning when opening the file.
* exportToCsv may be prefered.
* @param {string} fileName The desired export filename in the download.
* @param {string} worksheetName A name to give the excel worksheet tab.
* @param {string} customDs An optional customized version of the data to use.
* @param {object} self The grid api if customDS is not used
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

  const cleanExtra = function (table) {
    const nonExportables = [];
    $('tr, th, td, div, span', table).each(function () {
      const el = this;
      const elm = $(this);

      if (elm.is('.is-hidden, .datagrid-expandable-row')) {
        elm.remove();
        return;
      }

      // THEAD
      if (el.getAttribute('data-exportable') && el.getAttribute('data-exportable') === 'no') {
        const id = parseInt(el.getAttribute('id').substr(el.getAttribute('id').length - 1), 10) - 1;
        nonExportables.push(id);
        elm.remove();
        return;
      }

      // TBODY
      if (el.cellIndex) {
        if (nonExportables.length > 0 && nonExportables.indexOf(el.cellIndex) !== -1) {
          elm.remove();
          return;
        }
      }

      $('.is-hidden, .is-draggable-target, .handle, .sort-indicator, .datagrid-filter-wrapper', el).remove();
      while (el.attributes.length > 0) {
        el.removeAttribute(el.attributes[0].name);
      }

      // White Hat Security Violation. Remove Excel formulas
      // Excel Formulas Start with =SOMETHING
      const text = elm.text();
      if (text.substr(0, 1) === '=' && text.substr(1, 1) !== '') {
        elm.text(`'${text}'`);
      }
    });
    return table;
  };

  const base64 = function (s) {
    if (window.btoa) {
      return `data:application/vnd.ms-excel;base64,${window.btoa(unescape(encodeURIComponent(s)))}`;
    }
    return `data:application/vnd.ms-excel;,${unescape(encodeURIComponent(s))}`;
  };

  const format = function (s, c) {
    return s.replace(/{(\w+)}/g, (m, p) => c[p]);
  };

  const appendRows = function (dataset, table) {
    let tableHtml = '';
    const body = table.find('tbody').empty();

    for (let i = 0; i < dataset.length; i++) {
      if (!dataset[i].isFiltered) {
        tableHtml += self.rowHtml(dataset[i], i, i);
      }
    }

    body.append(tableHtml);
    return table;
  };

  let table = self.table.clone();
  table = appendRows(customDs || self.settings.dataset, table);

  if (!table.find('thead').length) {
    self.headerRow.clone().insertBefore(table.find('tbody'));
  }

  table = cleanExtra(table);

  // Exporting data with trailing negative signs moved in front
  if (self.settings.exportConvertNegative) {
    table.find('td').each(function () {
      const td = $(this);
      const content = td.text();

      td.text(content.replace(/^(.+)(-$)/, '$2$1'));
    });
  }

  const ctx = { worksheet: (worksheetName || 'Worksheet'), table: table.html() };

  fileName = `${fileName ||
    self.element.closest('.datagrid-container').attr('id') ||
    'datagrid'}.xls`;

  if (env.browser.name === 'ie' || env.browser.name === 'edge') {
    if (window.navigator.msSaveBlob) {
      const blob = new Blob([format(template, ctx)], {
        type: 'application/csv;charset=utf-8;'
      });
      navigator.msSaveBlob(blob, fileName);
    }
  } else if (window.URL.createObjectURL) { // createObjectURL api allows downloading larger files
    const blob = new Blob([format(template, ctx)], {
      type: 'application/vnd.ms-excel;charset=utf-8;'
    });
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
    link.href = base64(format(template, ctx));
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

excel.copyToDataSet = function (pastedData, rowCount, colIndex, dataSet, self) {
  const validateFields = function(values, settings, rowData, idx) {
    for (let j = 0; j < values.length; j++) {
      if (settings.columns[idx].formatter !== Formatters.Readonly) {
        if (settings.columns[idx].editor === Editors.Input) {
          if (settings.columns[idx].filterType === 'integer' 
          || settings.columns[idx].filterType === 'decimal' 
          || settings.columns[idx].filterType === 'number') {
            if (!isNaN(values[j].trim())) {
              rowData[settings.columns[idx].field] = values[j];
            }
          } else {
            rowData[settings.columns[idx].field] = values[j];
          }
        } else if (settings.columns[idx].editor === Editors.Date) {
          if (!isNaN(Date.parse(values[j]))) {
            rowData[settings.columns[idx].field] = new Date(values[j]);
          }
        }
      }

      idx++;
    }
  };

  for (let i = 0; i < pastedData.length; i++) {
    const rawVal = pastedData[i].split('\t');
    let startColIndex = colIndex;

    if (rowCount < dataSet.length) {
      const currentRowData = dataSet[rowCount];
      validateFields(rawVal, self.settings, currentRowData, startColIndex);
      self.updateRow(rowCount, currentRowData);
    } else {
      const newRowData = {};
      for (let k = 0; k < self.settings.columns.length; k++) {
        newRowData[self.settings.columns[k].field] = '';
      }
      validateFields(rawVal, self.settings, newRowData, startColIndex);
      self.addRow(newRowData, 'bottom');
    }
    rowCount++;
  }
};

export { excel };

/* eslint-enable import/prefer-default-export */
