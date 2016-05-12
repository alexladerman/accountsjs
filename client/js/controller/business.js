function get_businesses(callback) {
    $.getJSON(ws_base_url + "business", function(data) {
        replace_business_dropdown(data);
        if (!selected_business_id && data.length > 0) { //init
            selected_business_id =  data[0]['id'];
            selected_business_name = data[0]['name'];
            select_business(null);
        }
        if (callback)
          callback();
    });
}

//renders table from JSON array
function replace_business_dropdown(data) {

    var dropdown = document.getElementById('business_dropdown');

    while (dropdown.hasChildNodes()) {
        dropdown.removeChild(dropdown.lastChild);
    }

    if (data.length == 0) {
      viewInContainer(document.getElementById('businesses-container'));
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
            viewInContainer(document.getElementById('businesses-container'));
        };
        var text = document.createTextNode('Add business');
        a.appendChild(text);
        li.appendChild(a);
        dropdown.appendChild(li);
    }
}

function replace_entry_form_account_select(data) {

    var select = document.getElementById('entry_form_account_select');

    while (select.hasChildNodes()) {
        select.removeChild(select.lastChild);
    }

    if (data.length > 0) {
      for (i in data) {
          var row = data[i];
          var option = document.createElement('option');
          option.setAttribute('value', row['account_id']);
          var text = document.createTextNode(row['account'] + ' ' + row['name'].substring(0,80));
          option.appendChild(text);
          select.appendChild(option);
      }
    }
}

function select_business(e) {
    if (e) {
        selected_business_id = parseInt(this.attributes.business_id.value);
        selected_business_name = this.attributes.business_name.value;
    }

    $.getJSON(ws_base_url + "account", { business_id: selected_business_id }, function(data) {
      selected_business_accounts = data;
      selected_business_postable_accounts = filter_postable_accounts(selected_business_accounts);

      // replace_entry_form_account_select(selected_business_postable_accounts);

      var account_select = $('#entry_form input[name="account_select"]');
      account_select.typeahead(account_typeahead_options, account_typeahead_dataset());
      account_select.bind('typeahead:autocomplete typeahead:select', on_account_typeahead_change);

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
    });
}

//inserts new business
// document.getElementById('new_business_form').validator();
document.getElementById('save_new_business_btn').onclick = function(e) {
    var url = ws_base_url + 'business';

    var params = { action: "new" };
    $.extend(params, $('#new_business_form').serializeJSON());

    $.getJSON(url, params, function(data) {
        get_businesses(function(){
          viewInContainer(view_stack.pop)
        });
    });
};

function filter_postable_accounts(accounts) {
    console.log("get_postable_accounts");
    var len = accounts.length;
    var leaves = [];
    for (var i = 0; i < len-1 ; i++) {
        current_node = accounts[i];
        next_node = accounts[i+1];
        if (!next_node["account"].startsWith(current_node["account"].toString())) {
          leaves.push(accounts[i]);
        }
    }
    return leaves;
}
