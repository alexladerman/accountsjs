var substring_matcher = function(strs) {
  return function findMatches(q, callback) {
    var matches, substringRegex;
    matches = [];
    substrRegex = new RegExp(q, 'i');
    $.each(strs, function(i, str) {
      if (substrRegex.test(str)) {
        matches.push(str);
      }
    });
    callback(matches);
  };
};

var account_select_matcher = function(accounts) {
  return function findMatches(q, callback) {
    var matches, substringRegex;
    matches = [];
    substrRegex = new RegExp(q, 'i');
    $.each(accounts, function(i, account) {
      if (substrRegex.test(account.account + ' ' + account.name)) {
        matches.push(account);
      }
    });
    callback(matches);
  };
}

account_typeahead_options = {
  hint: true,
  highlight: true,
  minLength: 1
}
account_typeahead_dataset = function() { return {
  display: function(account) {return account.account + ' ' + account.name},
  name: 'selected_business_postable_accounts',
  source: account_select_matcher(selected_business_postable_accounts),
  templates: {
    notFound: function (context) {
      console.log('notFound');
      return '<div class="tt-suggestion"><a href=#>New...</a></div>';
      // return 'New...';
    }
  }
}}

account_typeahead_new = function() { return {
  name: 'new',
  source: function (query, callback) { callback(['add new item'])}
}}

var on_account_typeahead_change = function(e, selected_account) {
  var line = e.target.parentNode.parentNode;
  line.querySelector('[name="account_id"]').value = selected_account.account_id;
}

var reset_typeahead_on_clone = function(newline) {
  $('input[name="account_select"]', newline).each(function(){
    $(this).typeahead('destroy');
    $(this).typeahead(account_typeahead_options, account_typeahead_dataset());
    $(this).bind('typeahead:autocomplete typeahead:select', on_account_typeahead_change);
  });
}

$('.typeahead').bind('typeahead:autocomplete typeahead:select',  function(e, chosen_item) {
  e.target.parentNode.querySelector('[name="sibling_hidden_field_to_capture_item_id"]').value = chosen_item.item_id;
})
