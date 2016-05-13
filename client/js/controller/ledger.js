function get_ledger(account_id, callback) {
  $.getJSON(ws_base_url + "entry", { action: 'list_by_account', business_id: selected_business_id, account_id: account_id }, function(data) {
    var table = document.getElementById("ledger_table");
    var row_onclick = function (e) {
      var data = JSON.parse($(e.target).closest('tr')[0].getAttribute('data-source'));
      console.log('in ledger clicked on entry: ' + data.entry_id);
      load_entry_form(data.entry_id);
    }
    replace_table(dictionary.ledger_table, table, data, true, row_onclick, null , selected_customer_id);
    callback();
  });
}
