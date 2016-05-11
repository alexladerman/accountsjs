

document.getElementById('entry_new_btn').onclick = function(e) {
    console.log('entry_new_btn.onclick')
    e.stopPropagation();
    var form = document.getElementById('entry_form');
    form.reset();

    var params = {
      action: 'last_entry_id',
      business_id: selected_business_id
    }

    $.getJSON(ws_base_url + 'entry', params, function(data) {
        var last_entry_id = data[0]['last_entry_id'];
        $('#entry_form_entry_id').val(last_entry_id + 1);
        $('#entry_form_date').val(today());
        viewInContainer(document.getElementById('entry-container'));
    });
};

document.getElementById('save_entry_btn').onclick = function(e) {
    e.stopPropagation();
    console.log('save_entry_btn.onclick')

    var form = document.getElementById('entry_form');

    var lines = serialize_table(form.querySelector('tbody'), 'input', 'name', 'value');
    lines = lines.map(function(line){
      var _line = {};
      _line.account_id = line.account_id;
      _line.description = line.description;
      _line.amount = line.total;
      return _line;
    });

    var data = {
      business_id: selected_business_id,
      entry_id: parseInt(form.querySelector('#entry_form_entry_id').value),
      entry_date: parseInt(form.querySelector('#entry_form_date').value),
      lines: lines
    }

    console.log(data);

    var url = ws_base_url + 'entry' + '?' + $.param({ action: "save" });

    $.post(url, JSON.stringify(data))
        .done(function(data) {
          console.log(data)
          if (data.entry_id)
            form.querySelector('#entry_form_entry_id').value = data.entry_id;
        });
};

document.getElementById('cancel_entry_btn').onclick = function(e) {
    e.stopPropagation();
    document.getElementById('entry_new_btn').onclick(e);
}

$('.entry-table tbody input[name="debit"], input[name="credit"]').keydown(function(e) {
  if (keyboard.DIGITS_AND_SEPARATORS.includes(e.keyCode)) {
    if (e.target.name == "credit") {
      var line = e.target.parentNode.parentNode;
      var debit = line.querySelector('[name="debit"]').value = '';
    }
    else {
      var line = e.target.parentNode.parentNode;
      var debit = line.querySelector('[name="credit"]').value = '';
    }
  }
});

$('.entry-table tbody select[name="account_select"]').change(function(e) {
  var line = e.target.parentNode.parentNode;
  line.querySelector('[name="account_id"]').value = e.target.value;
});

$('.entry-table tbody input[name="debit"], input[name="credit"]').change(function(e) {
  recalculate_line_total(e.target.parentNode.parentNode);
});

function recalculate_line_total(line) {
  var debit = line.querySelector('[name="debit"]').value || 0;
  var credit = line.querySelector('[name="credit"]').value || 0;
  var line_total = 0;
  line_total = debit-credit;
  line.querySelector('[name="total"]').value = line_total;
  recalculate_balance();
}

function recalculate_balance() {
  var balance_debit = document.querySelector('#entry_form_balance_debit');
  var balance_credit = document.querySelector('#entry_form_balance_credit');
  var lines = balance_debit.parentNode.parentNode.parentNode.parentNode.querySelector('tbody'); //entry-table tbody
  var line_totals = lines.querySelectorAll('[name="total"]');
  var grand_total = 0;
  for (var i = 0; i < line_totals.length; i++) {
    var line_total = line_totals[i].value || 0;
    grand_total += parseFloat(line_total);
  }
  if (grand_total < 0) {
    balance_debit.value = '';
    balance_credit.value = Math.abs(grand_total).toFixed(currency_radix);
  } else {
    balance_debit.value = grand_total ? grand_total.toFixed(currency_radix) : '';
    balance_credit.value = '';
  }
}

//press Enter anywhere on line or tab on last input to commit and move to next line, which is to be created if it does not exist
$('.entry-table tbody input').keyup(function (e) {
  if (e.keyCode == keyboard.ENTER) {
    entry_commit_line(e);
    var newline = e.target.parentNode.parentNode.nextElementSibling;
    if (newline != null)
      newline.firstElementChild.firstElementChild.focus();
  }
});

$('.entry-table tbody input[name="credit"]').keyup(function (e) { if (e.keyCode == keyboard.TAB) entry_commit_line(e) });
$('.entry-table tbody input').keyup(function (e) {
  // delete line: Ctrl-D instead of DELETE and BACKSPACE which can be used to edit text
  if ((e.ctrlKey && e.keyCode == keyboard.d) ){
    var line = e.target.parentNode.parentNode;
    if (!(line === line.parentNode.firstElementChild && line === line.parentNode.lastElementChild)) {
      line.remove();
      recalculate_balance();
    }
  }
});

function entry_commit_line(e) {
  var line = e.target.parentNode.parentNode;
  // add line if commiting last line with some data
  if (line === line.parentNode.lastElementChild && $('input:not([readonly])', line).filter(function(){ return this.value }).length) {
    var newline = $(line).clone(true);
    var credit = $('input[name="credit"]', newline).val();
    var debit = $('input[name="debit"]', newline).val();
    $('input[name="debit"]', newline).val(credit);
    $('input[name="credit"]', newline).val(debit);
    newline.appendTo($(line.parentNode));
    reset_input_masks_on_clone(newline);
    recalculate_line_total(newline[0]);
    recalculate_balance();
  }
}

// var substringMatcher = function(strs) {
//   return function findMatches(q, cb) {
//     var matches, substringRegex;
//
//     // an array that will be populated with substring matches
//     matches = [];
//
//     // regex used to determine if a string contains the substring `q`
//     substrRegex = new RegExp(q, 'i');
//
//     // iterate through the pool of strings and for any string that
//     // contains the substring `q`, add it to the `matches` array
//     $.each(strs, function(i, str) {
//       if (substrRegex.test(str)) {
//         matches.push(str);
//       }
//     });
//
//     cb(matches);
//   };
// };
//
// var states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
//   'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii',
//   'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
//   'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
//   'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
//   'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
//   'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
//   'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
//   'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
// ];
//
// $().typeahead({
//   hint: true,
//   highlight: true,
//   minLength: 1
// },
// {
//   name: 'states',
//   source: substringMatcher(states)
// });
