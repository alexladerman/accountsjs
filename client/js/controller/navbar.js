document.getElementById('customers_navbar_link').onclick = function(e) {
  e.stopPropagation();
  get_customers(function () { viewInContainer(document.getElementById('customers-container')) });
};

document.getElementById('accounting_navbar_link').onclick = function(e) {
  e.stopPropagation();
  get_entries(function() {
    viewInContainer(document.getElementById('entries-container'));
  });
};
