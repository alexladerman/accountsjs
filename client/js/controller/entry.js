

document.getElementById('entry_new_btn').onclick = function(e) {
    console.log('entry_new_btn.onclick')
    e.stopPropagation();

    reset_entry_form();

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

function reset_entry_form(){
  var form = document.getElementById('entry_form');
  form.reset();

  var tbody = form.querySelector('#entry_form_table tbody');
  while (tbody.children.length > 1) {
      tbody.removeChild(tbody.lastChild);
  }
  reset_input_masks(tbody.lastChild);
  account_typeahead_reset($(tbody.lastChild));
}

function load_entry_form(entry_id) {

  var form = document.getElementById('entry_form');
  var tbody = form.querySelector('#entry_form_table tbody');

  var line = tbody.querySelector('tr');

  var params = {
    action: 'get',
    business_id: selected_business_id,
    entry_id: entry_id
  }

  $.getJSON(ws_base_url + 'entry', params, function(data) {
      console.log('loaded entry');
      console.log(data);
      $('#entry_form_entry_id').val(data[0].entry_id);
      $('#entry_form_date').val(dateFormat(data[0].entry_date));


      //populate the table with loaded data
      var i = 0;
      do {
        var line_data = data[i];
        line_data.account_select = line_data.account;
        line.setAttribute('data-source', JSON.stringify(line_data));
        deserialize_row(line_data, line, 'input', 'name', 'value');
        var newline = $(line).clone(true);
        newline.appendTo($(line.parentNode));
        reset_input_masks(newline);
        account_typeahead_reset(line);
        account_typeahead_reset(newline);
        recalculate_line_total(line[0]);
        recalculate_line_total(newline[0]);
        recalculate_balance();
        line = newline;
        i++;
      } while (i < data.length)

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
$('.entry-table tbody input:not([name="account_select"])').keyup(function (e) {
  if (e.keyCode == keyboard.ENTER) {
    entry_commit_line(e);
    var newline = e.target.parentNode.parentNode.nextElementSibling;
    if (newline != null)
      newline.querySelector('input:not([readonly]').focus();
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
    reset_input_masks(newline);
    account_typeahead_reset(line);
    account_typeahead_reset(newline);
    recalculate_line_total(newline[0]);
    recalculate_balance();
  }
}
