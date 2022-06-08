const myTable = document.querySelector('table');

const myData = [
    { title: 'A', body: '1' },
    { title: 'B', body: '2' },
    { title: 'C', body: '3' },
    { title: 'D', body: '4' },
    { title: 'E', body: '5' },
    { title: 'F', body: '6' }
]


const myHeaders = [{
        title: 'Title',
        getData: (row) => {
            let el = document.createElement('div');
            el.innerText = row.title + row._rowPos;
            el.classList.add('text-danger');

            el.setAttribute('contenteditable', 'true');
            return el;
        },
        listeners: [{
            type: 'click',
            action: test
        }]
    }, {
        title: 'Body',
        getData: (row) => {
            return row.body;
        }
    },
    {
        title: 'Calculate',
        getData: (row) => {
            return row.body * 6;
        }
    }
]




setTable(myTable, myHeaders, myData);

const toObjHeaders = [{
    title: 'Title',
    getData: (td) => {
        let div = td.querySelector('div');
        return div.innerText;
    }
}, {
    title: 'Body',
    getData: (td) => {
        return td.innerText;
    }
}, {
    title: 'Calculate',
    getData: (td) => {
        return td.innerText;
    }
}]

function test() {

    const myObj = tableToObject(myTable, toObjHeaders);

    console.log(myObj);
}