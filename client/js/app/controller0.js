var ws_base_url = 'http://localhost:1337/'; //url of node.js web server, relative to user browser
var ACCESS_TOKEN = '';
var user_id = 0;
var user_email = '';

var selected_customer_id = 0;
var selected_business_id = 0;
var selected_business_name = 'Add business';

accounting.settings = {
    currency: {
        symbol : "€",   // default currency symbol is '$'
        format: "%v", // controls output: %s = symbol, %v = value/number (can be object: see below)
        decimal : ".",  // decimal point separator
        thousand: ",",  // thousands separator
        precision : 2   // decimal places
    },
    number: {
        precision : 0,  // default precision on numbers is 0
        thousand: ",",
        decimal : "."
    }
}

function formatMoney(value) {
    return accounting.formatMoney(value/100); // €4.999,99
}

//printable column headers
var dictionary = {
    id: {text:  'ID', type: 'text'},
    Account: {text:  'Account', type: 'text'},
    name: {text:  'Name', type: 'text'},
    tax_id: {text:  'Tax ID', type: 'text'},
    email: {text:  'Email', type: 'text'},
    address: {text:  'Address', type: 'text'},
    hourly_rate: {text:  'Hourly Rate', type: 'text'},
    billable_time: {text:  'Time Spent', type: 'text'},
    billable_amount: {text:  'Amount Due', type: 'text'},
    bill: {text:  '', type: 'text'},
    start_stop_btn: {text:  '', type: 'text'},
    project_id: {text:  'Project ID', type: 'text'},
    start: {text:  'Start', type: 'text'},
    stop: {text:  'Stop', type: 'text'},
    billed: {text:  'Billed', type: 'text'},
    role: {text:  'Role', type: 'text'},
    Balance: {text:  'Balance', type: 'currency'},
    TurnoverYTD: {text:  'TurnoverYTD', type: 'currency'}
};




//utility
function get_param(return_this, url) {
    return_this = return_this.replace(/\?/ig, "").replace(/=/ig, ""); // Globally replace illegal chars.
    /* var url = window.location.href; */// Get the URL from browser
    var parameters = url.substring(url.indexOf("?") + 1).split("&"); // Split by "param=value".
    var params = []; // Array to store individual values.
    for (var i = 0; i < parameters.length; i++)
        if (parameters[i].search(return_this + "=") != -1)
            return parameters[i].substring(parameters[i].indexOf("=") + 1).split("+");
    return "Parameter not found";
}
//utility
function get_previous_sibling(element) {
    var p = element;
    do
        p = p.previousSibling;
    while (p && p.nodeType != 1);
    return p;
}


            // <li class="dropdown">
            //    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Business 1<span class="caret"></span></a>
            //    <ul class="dropdown-menu" role="menu">
            //       <li><a href="#">Business 1</a></li>
            //       <li><a href="#">Business 2</a></li>
            //       <li><a href="#">Business 3</a></li>
            //       <li class="divider"></li>
            //       <li><a href="#">Add business</a></li>
            //    </ul>
            // </li>


//renders table from JSON array


function replace_table(table, data, row_clickable, row_onclick, extra_fields, selected_id) {
    table.className = "table";
    if (row_clickable)
        table.className += " table-hover";

    while (table.hasChildNodes()) {
        table.removeChild(table.lastChild);
    }
    var thead = document.createElement('thead');
    table.appendChild(thead);
    thdata = data[0];
    var thr = document.createElement('tr');
    for (field in thdata) {
        if (dictionary.hasOwnProperty(field)) {
            var th = document.createElement('th');
            th.appendChild(document.createTextNode(dictionary[field].text));
            switch (dictionary[field].type) {
                    case 'currency':
                        th.className += " text-right";
                        break;
                }
            thr.appendChild(th);
        }
    }
    thead.appendChild(thr);
    if (extra_fields != null) {
        for (var i = 0; i < extra_fields.length; i++) {
            console.log('append_table_field:' + extra_fields[i]);
            var th = document.createElement('th');
            thr.appendChild(th);
            th.innerHTML = (dictionary.hasOwnProperty(extra_fields[i])) ? dictionary[extra_fields[i]] : extra_fields[i];
        }
    }

    var tbody = document.createElement('tbody');
    table.appendChild(tbody);
    for (key in data) {
        var rowdata = data[key];
        var row = document.createElement('tr');
        if (rowdata['id'] == selected_id)
            row.className += " active";
        if (row_clickable)
            row.className += " special";
        for (field in rowdata) {
            if (dictionary.hasOwnProperty(field)) {
                var td = document.createElement('td');
                var text;
                switch (dictionary[field].type) {
                    case 'currency':
                        text = document.createTextNode(formatMoney(rowdata[field]));
                        td.className += " text-right";
                        break;
                    default:
                        text = document.createTextNode(rowdata[field]);
                }
                td.appendChild(text);
                row.appendChild(td);
            }
        }
        tbody.appendChild(row);
        if (extra_fields != null) {
            for (var i = 0; i < extra_fields.length; i++) {
                var td = document.createElement('td');
                row.appendChild(td);
                append_extra_field(td, extra_fields[i], rowdata);
            }
        }
        if (row_clickable)
            row.onclick = row_onclick(row, rowdata);
    }
}

function replace_scrolling_div_table(table, data, row_clickable, row_onclick, extra_fields, selected_id) {

    table.className = 'table';
    if (row_clickable)
        table.className += ' table-hover';

    while (table.hasChildNodes()) {
        table.removeChild(table.lastChild);
    }

    thdata = data[0];

    var availWidth = screen.availWidth;
    var numColumns = count_keys(thdata);

    var columnWidth = (availWidth/2)/numColumns;

    var thr = document.createElement('div');
    thr.className = 'tr thead';
    for (field in thdata) {
        if (dictionary.hasOwnProperty(field)) {
            var th = document.createElement('div');
            th.style.width = columnWidth + "px";
            th.className = 'td';
            th.appendChild(document.createTextNode(dictionary[field].text));
            switch (dictionary[field].type) {
                    case 'currency':
                        th.className += " text-right";
                        break;
                }
            thr.appendChild(th);
        }
    }
    table.appendChild(thr);

    if (extra_fields != null) {
        for (var i = 0; i < extra_fields.length; i++) {
            console.log('append_table_field:' + extra_fields[i]);
            var th = document.createElement('div');
            th.className = 'td';
            thr.appendChild(th);
            th.innerHTML = (dictionary.hasOwnProperty(extra_fields[i])) ? dictionary[extra_fields[i]] : extra_fields[i];
        }
    }

    for (key in data) {
        var trdata = data[key];
        var tr = document.createElement('div');
        tr.className = 'tr';
        if (trdata['id'] == selected_id)
            tr.className += " active";
        if (row_clickable)
            tr.className += " special";
        for (field in trdata) {
            if (dictionary.hasOwnProperty(field)) {
                var td = document.createElement('div');
                td.style.width = columnWidth + "px";
                td.className = 'td';
                var text;
                switch (dictionary[field].type) {
                    case 'currency':
                        text = document.createTextNode(formatMoney(trdata[field]));
                        td.className += " text-right";
                        break;
                    default:
                        text = document.createTextNode(trdata[field]);
                }
                td.appendChild(text);
                tr.appendChild(td);
            }
        }
        table.appendChild(tr);
        if (extra_fields != null) {
            for (var i = 0; i < extra_fields.length; i++) {
                var td = document.createElement('div');
                td.className = 'td';
                tr.appendChild(td);
                append_extra_field(td, extra_fields[i], trdata);
            }
        }
        if (row_clickable)
            tr.onclick = row_onclick(tr, trdata);
    }
}

//adds an extra column to a table as it is being rendered, to add action buttons to a row
function append_extra_field(parent_element, field, rowdata) {
    switch (field) {
        case ('bill'):
            if (rowdata['billable_amount'] != null) {
                parent_element.setAttribute('style', 'text-align: right');
                var child = document.createElement('button');
                child.setAttribute('type', 'button');
                child.innerHTML = 'bill';
                child.className = "btn btn-primary";
                child.onclick = function(e) {
                    e.stopPropagation();
                    bill(rowdata);
                };
                parent_element.appendChild(child);
            }
            break;
        case ('start_stop_btn'):
            parent_element.setAttribute('style', 'text-align: right');
            var child = document.createElement('button');
            child.setAttribute('type', 'button');
            if (rowdata['running_period_id'] != null) {
                child.innerHTML = 'stop';
                child.className = "btn btn-danger";
                child.onclick = function(e) {
                    project_stop(rowdata);
                    e.stopPropagation();
                };
            } else {
                child.innerHTML = 'start';
                child.className = "btn btn-primary";
                child.onclick = function(e) {
                    project_start(rowdata);
                    e.stopPropagation();
                };
            }
            parent_element.appendChild(child);
            break;
    }
}


function get_persons(callback) {
    $.getJSON(ws_base_url + "persons", function(data) {
        var table = document.getElementById("persons_table");
        replace_scrolling_div_table(table, data, true, function () {}, null , selected_customer_id);
        callback();
    });
}

function count_keys(obj) {

    if (obj.__count__ !== undefined) { // Old FF
        return obj.__count__;
    }

    if (Object.keys) { // ES5
        return Object.keys(obj).length;
    }

    // Everything else:

    var c = 0, p;
    for (p in obj) {
        if (obj.hasOwnProperty(p)) {
            c += 1;
        }
    }

    return c;

}
