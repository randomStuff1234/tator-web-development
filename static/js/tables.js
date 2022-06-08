function setTable(data, table, headers) {
    table.innerHTML = '';

    let thead = document.createElement('thead');

    let theadRow = document.createElement('tr');
    headers.map(h => {
        let th = document.createElement('th');
        th.innerText = h.title;
        theadRow.appendChild(th);
    });

    thead.appendChild(theadRow);
    table.appendChild(thead);

    let tbody = document.createElement('tbody');
    data.map(match => {
        let tr = document.createElement('tr');
        headers.map(h => {
            let td = document.createElement('td');
            td.innerHTML = h.func(match);
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
}


$(document).ready(function() {
    $('.data-table').each(function(_, table) {
        $(table).DataTable();
    });
});