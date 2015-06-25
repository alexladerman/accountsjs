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

//signin
document.getElementById('signin_button').onclick = function(e) {
    e.stopPropagation();

    var url = ws_base_url + 'signin';

    var params = {
        email: document.getElementById('signin_email').value,
        password: document.getElementById('signin_password').value
    };

    $.post(ws_base_url + "signin", params)
        .done(function(data) {
            if (data["access_token"]) {
                ACCESS_TOKEN = data["access_token"];
                var access_token_decoded = jwt_decode(ACCESS_TOKEN);

                $.ajaxSetup( {
                    crossDomain: true,
                    dataType: 'jsonp',
                    headers:
                    {
                        accept: '*',
                        authorization: 'Bearer ' + ACCESS_TOKEN
                    }
                });

                user_id = access_token_decoded["user_id"];
                user_email = access_token_decoded["email"];

                $('#navbar_user_link').text(user_email);
                $('#signin_container').toggleClass("hidden");

                get_businesses();
            }
            else if (data["error"]) {
                if (data["error"] == 'unauthorized') {
                    $('#signin_error').text('The email and password you entered don\'t match.').show();
                    $('#signin_recover_password').show();
                } else {
                    $('#signin_error').text(data['error']).show();
                    $('#signin_recover_password').show();
                }
            } else
                $('#signin_error').text("Unknown error").show();
        })
        .fail(function() {
            $('#signin_error').text("Connection error").show();
        })
};

document.getElementById('signin_recover_password').onclick = function(e) {
    e.stopPropagation();

    var params = {
        email: document.getElementById('signin_email').value,
    };

    $.post(ws_base_url + 'recover_password', params)
        .done(function(data) {
            if (data['error']) {
                    $('#signin_error').text(data['error']).show();
            } else {
                $('#signin_recover_password').text('Password sent');
            }
        })
        .fail(function() {
            $('#signin_error').text("Connection error").show();
        })
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
function replace_business_dropdown(data) {

    var dropdown = document.getElementById('business_dropdown');

    while (dropdown.hasChildNodes()) {
        dropdown.removeChild(dropdown.lastChild);
    }

    if (data.length == 0) {
        $('#businesses_container').show();
        document.getElementById('new_business_btn').click();
    } else {
        for (i in data) {
            var rowdata = data[i];
            var li = document.createElement('li');
            var a = document.createElement('a');
            a.setAttribute('href', '#');
            a.setAttribute('business_id', rowdata['id']);
            a.setAttribute('business_name', rowdata['name']);
            var text = document.createTextNode(rowdata['name']);
            a.appendChild(text);
            a.onclick = select_business;
            li.appendChild(a);
            dropdown.appendChild(li);
        }
        var li = document.createElement('li');
        li.className = 'divider';
        dropdown.appendChild(li);

        var li = document.createElement('li');
        var a = document.createElement('a');
        a.setAttribute('href', '#');
        a.onclick = function(e) {
            e.stopPropagation();
            $('#businesses_container').show();
            document.getElementById('new_business_btn').click();
        };
        var text = document.createTextNode('Add business');
        a.appendChild(text);
        li.appendChild(a);
        dropdown.appendChild(li);
    }
}

function select_business(e) {
    if (e) {
        selected_business_id = parseInt(this.attributes.business_id.value);
        selected_business_name = this.attributes.business_name.value;
    }
    var t = document.getElementById('selected_business');
    while (t.hasChildNodes()) {
        t.removeChild(t.lastChild);
    }
    t.appendChild(document.createTextNode(selected_business_name));
    var span = document.createElement('span');
    span.className = 'caret';
    t.appendChild(span);
    $('#selected_business_dropdown').show();
    $('#navbar_links').show();
    $('#button_bar').show();
}

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

    if (extra_fields != null) {
        for (var i = 0; i < extra_fields.length; i++) {
            console.log('append_table_field:' + extra_fields[i]);
            var th = document.createElement('div');
            th.className = 'td';
            thr.appendChild(th);
            th.innerHTML = (dictionary.hasOwnProperty(extra_fields[i])) ? dictionary[extra_fields[i]] : extra_fields[i];
        }
    }

    var thrWrapper = document.createElement('div');
    thrWrapper.className = 'thrWrapper';
    table.appendChild(thrWrapper);
    thrWrapper.appendChild(thr);

    var spacerRow = thr.cloneNode(!0);
    spacerRow.className = 'tr spacerRow';
    table.appendChild(spacerRow);

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
                        td.className += " text-right mono";
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

//clicked on customer table row. row is clicked DOMElement, rowdata is corresponding row for JSON array
function business_row_onclick(row, rowdata) {
    return function() {
        var trs = row.parentNode.childNodes;
        for (var i = 0; i < trs.length; i++) {
            console.log(trs[i]);
            trs[i].className = trs[i].className.replace(" success", "");
        }
        row.className += " success";
        selected_customer_id = rowdata['id'];
        var detail_panel = document.getElementById("detail_panel");
        detail_panel.className = detail_panel.className.replace("hidden", "");
        var detail_new_panel = document.getElementById("detail_new_panel");
        detail_new_panel.className = detail_new_panel.className.replace("hidden", "");
        get_projects(rowdata['id']); // customer rowdata
    };
}

//produces invoice with lines from billable projects
function bill(rowdata) { // customer rowdata

    var params = {
        customer_id: rowdata['id'] };

    document.getElementById("issue_invoice_btn").onclick = function(e) {
        issue_bill(params.customer_id)
    }

    $.getJSON(ws_base_url + 'projects', params, function(data) {
        var table = document.getElementById("invoice_table");
        console.log(data);
        var billable_rows = new Array();
        for (var i = 0; i < data.length; i++) {
            if (data[i]['billable_amount'] != null) {
                billable_rows.push(data[i]);
            }
        }
        console.log(billable_rows);
        replace_table(table, billable_rows, false /* not show periods */, null, null, null);

        var tbody = table.getElementsByTagName('tbody')[0];
        var last_td;
        var row = document.createElement('tr');
        for (field in billable_rows[0]) {
            if (dictionary.hasOwnProperty(field)) {
                var td = document.createElement('td');
                row.appendChild(td);
                last_td = td;
            }
        }
        tbody.appendChild(row);
        td.innerHTML = '<strong>' + rowdata['billable_amount'] + '</strong>';
        var total_label = get_previous_sibling(td);
        total_label.className = 'text-right';
        total_label.innerHTML = '<strong>' + 'Total:' + '</strong>';
        $('#invoice_modal').modal('show');
    });
}

//closes modal. sets periods as billed.
function issue_bill(customer_id) {
    var params = {
    action: 'bill',
    customer_id: customer_id };
    $.getJSON(ws_base_url + 'periods', params, function(data) {
        get_customers(function() {
            $('#invoice_modal').modal('hide');
            get_projects(selected_customer_id);
        });
    });
}

//work has started
function project_start(rowdata) { // project rowdata
    var url = ws_base_url + 'periods?' + 'project_id=' + encodeURIComponent(rowdata['id']) + '&action=start';
    console.log(url);
    $.getJSON(url, function(data) {
        get_projects(rowdata['customer_id']);
    });
}

//work has stop
function project_stop(rowdata) { // project rowdata
    var url = ws_base_url + 'periods?' + 'project_id=' + encodeURIComponent(rowdata['id']) + '&action=stop';
    console.log(url);
    $.getJSON(url, function(data) {
        get_customers(function() {
            get_projects(rowdata['customer_id']);
        });
    });
}

//produces customers table
function get_customers(callback) {
    $.getJSON(ws_base_url + "customers", function(data) {
        var table = document.getElementById("master_table");
        replace_table(table, data, true, customer_row_onclick, [ 'bill' ], selected_customer_id);
        callback();
    });
}

function get_businesses(callback) {
    $.getJSON(ws_base_url + "businesses", function(data) {
        replace_business_dropdown(data);
        if (!selected_business_id && data.length > 0) { //init
            selected_business_id =  data[0]['id'];
            selected_business_name = data[0]['name'];
            select_business(null);
        }
    });
}

function get_persons(callback) {
    $.getJSON(ws_base_url + "persons", function(data) {
        var table = document.getElementById("persons_table");
        replace_scrolling_div_table(table, data, true, function () {}, null , selected_customer_id);
        callback();
    });
}

document.getElementById('customers_navbar_link').onclick = function(e) {
    e.stopPropagation();
    get_persons(function () { $('#persons_container').show() });
};


//produces projects table
function get_projects(customer_id) {
    $.getJSON(ws_base_url + "projects?customer_id=" + customer_id, function(data) {
        document.getElementById('input_new_project_customer_id').value = customer_id;
        var table = document.getElementById("detail_table");
        replace_table(table, data, false, null, [ 'start_stop_btn' ], null);
    });
}

//inserts new business
// document.getElementById('new_business_form').validator();
document.getElementById('new_business_btn').onclick = function(e) {
    e.stopPropagation();
    $('#new_business_panel').toggle(100);
    $('#new_business_btn_icon').toggleClass('glyphicon-plus').toggleClass('glyphicon-minus');
    document.getElementById('new_business_form').reset();
};

document.getElementById('save_new_business_btn').onclick = function(e) {
    var url = ws_base_url + 'businesses';

    var params = { action: "new" };
    $.extend(params, $('#new_business_form').serializeJSON());

    document.getElementById('new_business_btn').onclick(e);

    console.log(url);
    $.getJSON(url, params, function(data) {
        get_businesses();
    });
};
document.getElementById('cancel_new_business_btn').onclick = document.getElementById('new_business_btn').onclick;

//inserts new customer
document.getElementById('new_customer_btn').onclick = function(e) {
    var url = ws_base_url + 'customers';

    var params = {
    action: 'new',
    customer_name: document.getElementById('input_new_customer_name').value,
    customer_email: document.getElementById('input_new_customer_email').value,
    customer_hourly_rate: document.getElementById('input_new_customer_hourly_rate').value };

    document.getElementById('new_customer_form').reset();
    console.log(url);
    $.getJSON(url, params, function(data) {
        get_customers();
    });
};


//inserts new project
document.getElementById('new_project_btn').onclick = function(e) {
    var url = ws_base_url + 'projects';

    var params = {
    action: 'new',
    project_name: document.getElementById('input_new_project_name').value,
    customer_id: document.getElementById('input_new_project_customer_id').value };

    document.getElementById('new_project_form').reset();
    console.log(url);
    $.getJSON(url, params, function(data) {
        get_projects(params['customer_id']);
    });
};

function repopulate_form(form_id, json) {
    $.each(json, function(name, val){
        var $el = $('[name="'+name+'"]'),
            type = $el.attr('type');

        switch(type){
            case 'checkbox':
                $el.attr('checked', 'checked');
                break;
            case 'radio':
                $el.filter('[value="'+val+'"]').attr('checked', 'checked');
                break;
            default:
                $el.val(val);
        }
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

//get_customers(); //draw customer table on load
