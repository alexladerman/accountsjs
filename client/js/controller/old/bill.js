//produces invoice with lines from billable projects
function bill(rowdata) { // customer rowdata

    var params = {
        customer_id: rowdata['id'] };

    document.getElementById("issue_invoice_btn").onclick = function(e) {
        issue_bill(params.customer_id)
    }

    $.getJSON(ws_base_url + 'projects', params, function(data) {
        var table = document.getElementById("invoice_table");
        var billable_rows = new Array();
        for (var i = 0; i < data.length; i++) {
            if (data[i]['billable_amount'] != null) {
                billable_rows.push(data[i]);
            }
        }
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
