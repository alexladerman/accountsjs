function get_ledger(account_id, callback) {
  $.getJSON(ws_base_url + "entry", { action: 'list_by_account', business_id: selected_business_id, account_id: account_id }, function(data) {
    var ledger_container = document.querySelector('#ledger-container');
    var data_source = {};
    if (data.length > 0)
      data_source = {account_id: data[0].account_id, account: data[0].account, name: data[0].account_name };
    else {
      data_source = selected_business_postable_accounts.find(function(el) { return el.account_id == account_id });
    }
    ledger_container.setAttribute('data-source', JSON.stringify(data_source));
    var table = ledger_container.querySelector("#ledger_table");
    $(ledger_container.querySelector('#ledger_title')).text(('Account ' + data_source.account + ' ' + data_source.name));

    var row_onclick = function (e) {
      var data = JSON.parse($(e.target).closest('tr')[0].getAttribute('data-source'));
      console.log('in ledger clicked on entry: ' + data.entry_id);
      load_entry_form(data.entry_id);
    }
    replace_table(dictionary.ledger_table, table, data, true, row_onclick, null , selected_customer_id);
    callback();
  });
}

document.getElementById('ledger_next').onclick = function(e) {
    e.stopPropagation();
    var account = JSON.parse(document.querySelector('#ledger-container').getAttribute('data-source'));
    var index = selected_business_postable_accounts.findIndex(function(el) { return el.account_id == account.account_id });
    var next;
    do {
      index++;
      account = selected_business_postable_accounts[index];
      if (account.debit || account.credit) {
        next = account;
        break;
      }
    } while (index < selected_business_postable_accounts.length)
    if (next)
      get_ledger(next.account_id);
};

document.getElementById('ledger_previous').onclick = function(e) {
    e.stopPropagation();
    var account = JSON.parse(document.querySelector('#ledger-container').getAttribute('data-source'));
    var index = selected_business_postable_accounts.findIndex(function(el) { return el.account_id == account.account_id });
    var next;
    do {
      index--;
      account = selected_business_postable_accounts[index];
      if (account.debit || account.credit) {
        next = account;
        break;
      }
    } while (index > 0)
    if (next)
      get_ledger(next.account_id);
};

document.getElementById('ledger_new_entry_btn').onclick = function(e) {
    e.stopPropagation();

    reset_entry_form();
    var form = document.getElementById('entry_form');
    var tbody = form.querySelector('#entry_form_table tbody');
    var line = tbody.querySelector('tr');

    var params = {
      action: 'last_entry_id',
      business_id: selected_business_id
    }

    $.getJSON(ws_base_url + 'entry', params, function(data) {
        var last_entry_id = data[0]['last_entry_id'];
        $('#entry_form_entry_id').val(last_entry_id + 1);
        $('#entry_form_date').val(today());

        //populate the table with loaded data
        var account = JSON.parse(document.querySelector('#ledger-container').getAttribute('data-source'));
        var line_data = {};
        line_data.account_select = account.account;
        line.setAttribute('data-source', JSON.stringify(line_data));
        account_typeahead_reset(line);
        reset_input_masks(line);
        deserialize_row(line_data, line, 'input', 'name', 'value');
        recalculate_line_total(line);
        recalculate_balance();

        viewInContainer(document.getElementById('entry-container'));
    });
};
