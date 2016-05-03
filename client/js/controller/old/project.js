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


//produces projects table
function get_projects(customer_id) {
    $.getJSON(ws_base_url + "projects?customer_id=" + customer_id, function(data) {
        document.getElementById('input_new_project_customer_id').value = customer_id;
        var table = document.getElementById("detail_table");
        replace_table(table, data, false, null, [ 'start_stop_btn' ], null);
    });
}
