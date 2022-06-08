/**
 * @description Creates a table from an element, headers, and data. You can add in event listeners if you like! Fully customizable
 * @param {Element} table Table Element
 * @param {Array} headers Header: {title: 'String', getData: (rowData) => {how to get content to place into <td></td>}, listeners: (OPTIONAL) [{type: 'listener type', action: (rowData) => {what to do on listener}}]
 * @param {Array} data Each item is a row, structure it how you like. getData(data[n]) and action(data[n]) use this
 * @param {Object} options OPTIONAL
 * 
 * @example
 * ```js
 * let table = document.querySelector('table');
 * 
 * let data = [
 *    { foo: 'bar', greeting: 'hello world!' },
 *    { foo: 'not bar', greeting: 'goodbye world!' },
 * ]
 * 
 * let headers = [
 *      {
 *          title: 'Foo',
 *          getData: (row) => {
 *              return row.foo;
 *          },
 *          listeners: [ // event listeners for that td
 *              {
 *                  type: 'click', // listener type
 *                  action: ({event, row, td}) => {
 *                      // Action to run
 *                  }
 *              }
 *          ]
 *      },
 *      {
 *          title: 'Greeting',
 *          getData: (row) => {
 *              return row.greeting;
 *          }
 *      }
 * ]
 * 
 * setTable(table, headers, data); // sets the table with data
 * ```
 * 
 * @example
 * ```js
 *  // Here are your options (OPTIONAL)
 *  
 *  let options = {
 *      appendTest: (row) => {  }, // Return true/false whether or not you want to append the row (default to true)
 *      trListeners: [ // event listeners for that row
 *          {
 *              type: 'click',
 *              action: ({event, data, tr}) => {  }
 *          }
 *      ],
 *      dataTable: false, // Turns into jquery datatable (default to false)
 *      trAttributes: [
 *          attribute: 'contenteditable', // attribute to add
 *          value: (row) => {  } // Return value
 *      ]
 *  }
 * 
 *  setTable(table, headers, data, options);
 * ```
 * 
 * 
 */
function setTable(table, headers, data, options) {
    if (!data) return;
    let appendTest = null,
        trListeners = null,
        trAttributes = null,
        dataTable = null,
        colGroup = null;

    if (options) {
        if (options.appendTest) appendTest = options.appendTest;
        if (options.trListeners) trListeners = options.trListeners;
        if (options.trAttributes) trAttributes = options.trAttributes;
        if (options.dataTable) dataTable = options.dataTable;
        if (options.colGroup) colGroup = options.colGroup;
    }

    table.innerHTML = ''; // Clears the table

    let thead = document.createElement('thead'); // Creates headers div
    let tfoot = document.createElement('tfoot'); // Creates footers div

    let theadRow = document.createElement('tr'); // Creates headers row
    let tfootRow = document.createElement('tr'); // Creates footers row

    let footers = false; // boolean value to test if you want footers

    headers.forEach(h => { // loops through headers
        if (!h) return;
        let th = document.createElement('th'); // Creates header element

        if (typeof h.title == 'string') th.innerHTML = h.title;
        else th.appendChild(h.title);

        let tf = document.createElement('th'); // Creates header element for footer
        if (h.footer) { // if you want footers, use this!
            footers = true; // sets footers to true for later to prevent errors

            if (typeof h.title == 'string') tf.innerHTML = h.title;
            else tf.appendChild(h.title);

            tfootRow.appendChild(tf); // appends footer element into footer row
        }
        theadRow.appendChild(th); // appends header to header row
    });

    thead.appendChild(theadRow); // appends header row to header div
    table.appendChild(thead); // appends header div to table
    if (footers) tfoot.appendChild(tfootRow); // footer row to footer div

    let rowPos = 0;

    let tbody = document.createElement('tbody'); // initiates data body
    data.forEach(d => { // loops through data
        if (!d) return;
        d._rowPos = rowPos;
        try {
            if (appendTest) { // Do you want to have this row?
                if (!appendTest(d)) return;
            }
        } catch (err) {}
        let tr = document.createElement('tr'); // creates new row

        let colPos = 0;

        headers.map(h => { // loops through headers
            if (!h) return;
            let td = document.createElement('td'); // creates data element

            let _data = h.getData ? h.getData(d) : '-!@#$%^&*()';
            // console.log(_data);
            if (_data == '-!@#$%^&*()') td.innerHTML = d[h.title];
            else if (typeof _data == 'object' && _data) td.appendChild(_data); // calls header.getData() function to get content for this cell, if it doesn't exist, destructure the object
            else td.innerHTML = _data;

            if (h.listeners) h.listeners.forEach(l => { // if you want listeners for this column, sets them (can be several)
                td.addEventListener(l.type, (event) => l.action({ event, data: d, td })); // creates listener from listener.type ('click','mouseover','touchstart',etc.) and action() which passes in data from this row
            });

            td.dataset.colPos = colPos;
            td.dataset.header = h.title;

            // Sets td attributes
            if (h.attributes) h.attributes.forEach(att => {
                td.setAttribute(att.attribute, att.value);
            });

            if (colGroup) {
                let colGCol = colGroup.find(c => c.index == colPos);
                if (colGCol) {
                    colGCol.classes.forEach(c => {
                        td.classList.add(c);
                    });
                }
            }

            tr.appendChild(td); // appends data to row

            colPos++;
        });
        if (trListeners) trListeners.forEach(l => { // if you want listeners for the row itself, sets them (can be several)
            tr.addEventListener(l.type, (event) => l.action({ event, data: d, tr })) // creates listener from listener.type ('click','mouseover','touchstart',etc.) and action() which passes in data from this row
        });
        tr.dataset.rowPos = rowPos; // ads rowPos to tr

        // Adds tr attributes
        if (trAttributes) trAttributes.forEach(att => {
            tr.setAttribute(att.attribute, att.value(d));
        });

        tbody.appendChild(tr); // appends row to data body
        rowPos++;
    });
    table.appendChild(tbody); // appends data body to table
    if (footers) table.appendChild(tfoot); // appends footers to table

    // Makes dataTable
    if (dataTable) {
        $('#' + table.id).each(function(_, table) {
            $(table).DataTable();
        });
    }
}

/**
 * 
 * @param {Element} table 
 * @param {Array} headers 
 * @returns {Array} Array of objects containing that data
 * 
 * @example
 * ```js
 *  let table = document.querySelector('table'); // This table must be built by setTable() above
 * 
 *  let headers = [
 *      {
 *          title: 'Header Title', // must match headers from setTable()
 *          getData: (td) => {  } // use cell to get data
 *      },
 *      {
 *          title: 'Header 2nd Title', // must match headers from setTable()
 *          getData: (td) => {  } // use cell to get data
 *      }
 *  ]
 * 
 * ```
 */
function tableToObject(table, headers) {

    let data = [];
    try {
        table.querySelectorAll('tbody tr').forEach(tr => {
            let output = {};
            headers.forEach(h => {
                let td = tr.querySelector(`td[data-header="${h.title}"]`);

                let variableName = h.variableName ? h.variableName : h.title;

                output[variableName] = h.getData(td);
            });
            data.push(output);
        });
        return data;
    } catch (err) {
        return []
    }
}