document.getElementById('accounting_navbar_link').onclick = function(e) {
  e.stopPropagation();
  viewInContainer(document.getElementById('entries-container'))
};
