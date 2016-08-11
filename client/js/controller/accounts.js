function get_accounts(callback) {
  $.getJSON(ws_base_url + "account", { action: 'list_accounts_with_balance', business_id: selected_business_id }, function(data) {
    selected_business_accounts = data;
    summarize(data);
    selected_business_postable_accounts = filter_postable_accounts(selected_business_accounts);
    render_accounts();
    callback();
  });
}

function render_accounts() {
  toggle_accounts_show_all_btn = document.querySelector('#toggle_accounts_show_all_btn');
  var data;
  if (toggle_accounts_show_all_btn.value == 'all')
    data = selected_business_accounts;
  else
    data = selected_business_postable_accounts;
  var row_onclick = function (e) {
    e.stopPropagation();
    var data = JSON.parse($(e.target).closest('tr')[0].getAttribute('data-source'));
    console.log('clicked account_id: ' + data.account_id);
    get_ledger(data.account_id, function() {
      viewInContainer(document.getElementById('ledger-container'));
    });
  }
  var table = document.getElementById("accounts_table");
  replace_table(dictionary.accounts_table, table, data, true, row_onclick, null , selected_customer_id);
}

document.getElementById('toggle_accounts_show_all_btn').onclick = function(e) {
  if (e.target.value == 'all') {
    e.target.value = '';
    $(e.target).text('Show All');
  }
  else {
    e.target.value = 'all';
    $(e.target).text('Show Posting');
  }
  render_accounts();
}

function sort(elements) {
    elements.sort(function (a, b) {
//      console.log("sorting" + a.voucherNumber);
        if (a.accountNumber.toString() > b.accountNumber.toString())
          return 1;
        if (a.accountNumber.toString() < b.accountNumber.toString())
          return -1;
        // a must be equal to b
        return 0;
    });

}

function summarize(elements) {
    console.log("\nsummarize\n");
    var len = elements.length;
    var node, traversed;
    for (var i = 0; i < len; i++) {
        node = elements[i];
        if (node["account"].toString().length == 1) {
            traversed = traverse(node, i+1, elements, len);
            i = traversed[1];
        }
    }
}

function traverse(node, i, elements, len) {
    console.log("\ntraverse \n");
    var nextNode, traversed, nodeAcct, nextNodeAcct;
    nodeAcct = node["account"].toString();
    var sumSiblings = node["balance"];
    while (i < len) {
        nextNode = elements[i];
        if (nextNode) {
            nextNodeAcct = nextNode["account"].toString();
            if (nextNodeAcct.length > nodeAcct.length ) { //if is a childNode
                 traversed = traverse(nextNode, i+1, elements, len);
                 sumSiblings += traversed[0]-node["balance"];
                 node["balance"] = traversed[0];
                 i = traversed[1];
            }
            else if (nextNodeAcct.length == nodeAcct.length) {
                 node = nextNode;
                 nodeAcct = nextNodeAcct;
                 sumSiblings += node["balance"]
                 ++i;
            }
            else
                return [sumSiblings, i];
        }
    }
    return [sumSiblings, i];
}
