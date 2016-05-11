
var ws_base_url = 'http://localhost:1337/'; //url of node.js web server, relative to user browser
var ACCESS_TOKEN = '';
var user_id = 0;
var user_email = '';
var view_stack = []; //toggle elementID visible in leader-main-container
var current_view = null;

var selected_customer_id = 0;
var selected_business_id = 0;
var selected_business_name = 'Add business';
var selected_business_accounts = [{business_id: null, account_id: null, account: null, name: null}];
var selected_business_postable_accounts = [{business_id: null, account_id: null, account: null, name: null}];

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
            row.className += " pointer";
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
    if (obj.__count__ !== undefined) // Old FF
        return obj.__count__;

    if (Object.keys) // ES5
        return Object.keys(obj).length;

    // Everything else:
    var c = 0, p;
    for (p in obj) {
        if (obj.hasOwnProperty(p)) {
            c += 1;
        }
    }
    return c;
}

function viewInContainer(element) {
  if (current_view.id != view_stack[length - 1])
      view_stack.push(current_view.id);
  var jQelement = $('#' + element.id);
  jQelement.siblings().hide();
  jQelement.show();
  current_view = element;
}
