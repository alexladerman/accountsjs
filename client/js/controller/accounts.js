function get_accounts(callback) {
  $.getJSON(ws_base_url + "account", { action: 'list_accounts_with_balance', business_id: selected_business_id }, function(data) {
    var table = document.getElementById("accounts_table");
    data = filter_postable_accounts(data);
    var row_onclick = function (e) {
      e.stopPropagation();
      var data = JSON.parse($(e.target).closest('tr')[0].getAttribute('data-source'));
      console.log('clicked account_id: ' + data.account_id);
      get_ledger(data.account_id, function() {
        viewInContainer(document.getElementById('ledger-container'));
      });
    }
    replace_table(dictionary.accounts_table, table, data, true, row_onclick, null , selected_customer_id);
    callback();
  });
}
