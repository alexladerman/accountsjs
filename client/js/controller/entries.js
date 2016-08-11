function get_entries(callback) {
  $.getJSON(ws_base_url + "entry", { business_id: selected_business_id }, function(data) {
    var table = document.getElementById("entries_table");
    var row_onclick = function (e) {
      var data = JSON.parse($(e.target).closest('tr')[0].getAttribute('data-source'));
      console.log('in entries clicked on entry: ' + data.entry_id);
      load_entry_form(data.entry_id);
    }
    replace_table(dictionary.entries_table, table, data, true, row_onclick, null , selected_customer_id);
    callback();
  });
}

document.getElementById('entries_new_entry_btn').onclick = function(e) {
    e.stopPropagation();

    reset_entry_form();

    var params = {
      action: 'last_entry_id',
      business_id: selected_business_id
    }

    $.getJSON(ws_base_url + 'entry', params, function(data) {
        var last_entry_id = data[0]['last_entry_id'];
        $('#entry_form_entry_id').val(last_entry_id + 1);
        $('#entry_form_date').val(today());
        viewInContainer(document.getElementById('entry-container'));
    });
};

document.getElementById('entries_accounts_btn').onclick = function(e) {
  e.stopPropagation();
  get_accounts(function() {
    viewInContainer(document.getElementById('accounts-container'));
  });
};
