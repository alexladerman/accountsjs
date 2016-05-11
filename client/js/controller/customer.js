document.getElementById('sale_new_btn').onclick = function(e) {
    console.log('sale_new_btn.onclick')
    e.stopPropagation();
    var form = document.getElementById('sale_form');
    form.reset();
    var url = ws_base_url + 'invoice';

    var params = {
      action: 'last_serial_number',
      business_id: selected_business_id
    }

    $.getJSON(url, params, function(data) {
        var last_serial_number = data[0]['last_serial_number'];
        $('#sale_form_number').val(last_serial_number + 1);
        $('#sale_form_date').val(today());
        viewInContainer(document.getElementById('sale-container'));
    });
};
