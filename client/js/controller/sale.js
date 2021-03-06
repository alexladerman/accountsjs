document.getElementById('save_sale_btn').onclick = function(e) {
    e.stopPropagation();
    console.log('save_sale_btn.onclick')

    var form = document.getElementById('sale_form');

    var data = {
      business_id: selected_business_id,
      invoice_id: parseInt(form.querySelector('#sale_form_invoice_id').value),
      buyer_id: parseInt(form.querySelector('#sale_form_customer_id').value),
      buyer_name: form.querySelector('#sale_form_customer_name').value,
      buyer_address: form.querySelector('#sale_form_customer_address').value,
      buyer_tax_id: form.querySelector('#sale_form_customer_tax_id').value,
      // bfh country selector seems to overwrite input ids, disable fields for now
      // customer_tax_country: form.querySelector('#sale_form_customer_tax_country').value,
      // supply_tax_country: form.querySelector('#sale_form_supply_tax_country').value,
      recognized_date: form.querySelector('#sale_form_date').value,
      prefix: form.querySelector('#sale_form_prefix').value,
      serial_number: parseInt(form.querySelector('#sale_form_number').value),
      lines: serialize_table(form.querySelector('tbody'), 'input', 'name', 'value'),
    }

    console.log(data);

    var url = ws_base_url + 'invoice' + '?' + $.param({ action: "save" });

    $.post(url, JSON.stringify(data))
        .done(function(data) {
          console.log(data)
          if (data.invoice_id)
            form.querySelector('#sale_form_invoice_id').value = data.invoice_id;
        });
};

document.getElementById('cancel_sale_btn').onclick = function(e) {
    e.stopPropagation();
    document.getElementById('sale_new_btn').onclick(e);
}

$('.sale-table tbody input:not([readonly])').change(function(e) {
  var line = e.target.parentNode.parentNode;
  var qty = line.querySelector('[name="qty"]').value || 0;
  var price = line.querySelector('[name="price"]').value || 0;
  var discount = line.querySelector('[name="discount"]').value || 0;
  var line_total = 0;
  line_total = (qty*price).toFixed(currency_radix);
  line_total = line_total-(line_total/100*discount).toFixed(currency_radix);
  line.querySelector('[name="total"]').value = line_total.toFixed(currency_radix);
  recalculate_sale_grand_total();
});

function recalculate_sale_grand_total() {
  var sale_grand_total = document.querySelector('#sale_form_grand_total');
  var lines = sale_grand_total.parentNode.parentNode.parentNode.parentNode.querySelector('tbody'); //sale-table tbody
  var line_totals = lines.querySelectorAll('[name="total"]');
  var grand_total = 0;
  for (var i = 0; i < line_totals.length; i++) {
    var line_total = line_totals[i].value || 0;
    grand_total += parseFloat(line_total);
  }
  lines.parentNode.querySelector('#sale_form_grand_total').value = grand_total.toFixed(currency_radix);
}

//press Enter anywhere on line or tab on last input to commit and move to next line, which is to be created if it does not exist
$('.sale-table tbody input').keyup(function (e) {
  if (e.keyCode == keyboard.ENTER) {
    sale_commit_line(e);
    var newline = e.target.parentNode.parentNode.nextElementSibling;
    if (newline != null)
      newline.firstElementChild.firstElementChild.focus();
  }
});

$('.sale-table tbody input[name="total"]').keyup(function (e) { if (e.keyCode == keyboard.TAB) sale_commit_line(e) });
$('.sale-table tbody input').keyup(function (e) {
  // delete line: Ctrl-D instead of DELETE and BACKSPACE which can be used to edit text
  if ((e.ctrlKey && e.keyCode == keyboard.d) ){
    var line = e.target.parentNode.parentNode;
    if (!(line === line.parentNode.firstElementChild && line === line.parentNode.lastElementChild)) {
      line.remove();
      recalculate_sale_grand_total();
    }
  }
});

function sale_commit_line(e) {
  var line = e.target.parentNode.parentNode;
  // add line if commiting last line with some data
  if (line === line.parentNode.lastElementChild && $('input:not([readonly])', line).filter(function(){ return this.value }).length) {
    var newline = $(line).clone(true).find(":input").val("").end();
    newline.appendTo($(line.parentNode));
    reset_input_masks(newline);
  }
}
