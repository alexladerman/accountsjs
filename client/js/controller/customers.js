function get_customers(callback) {
  $.getJSON(ws_base_url + "person", { business_id: selected_business_id }, function(data) {
    var table = document.getElementById("customers_table");
    replace_table(dictionary.customers_table, table, data, true, function () {}, null , selected_customer_id);
    callback();
  });
}

document.getElementById('customer_new_btn').onclick = function(e) {
  e.stopPropagation();
  viewInContainer(document.getElementById('customer-container'));
};

//clicked on customer table row. row is clicked DOMElement, rowdata is corresponding row for JSON array
function business_row_onclick(row, rowdata) {
  return function() {
    var trs = row.parentNode.childNodes;
    for (var i = 0; i < trs.length; i++) {
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
