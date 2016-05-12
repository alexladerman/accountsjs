function get_entries(callback) {
  $.getJSON(ws_base_url + "entry", { business_id: selected_business_id }, function(data) {
    var table = document.getElementById("entries_table");
    replace_table(dictionary.entries_table, table, data, true, function () {}, null , selected_customer_id);
    callback();
  });
}

document.getElementById('accounting_navbar_link').onclick = function(e) {
  e.stopPropagation();
  get_entries(function() {
    viewInContainer(document.getElementById('entries-container'))
  });
};
