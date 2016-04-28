// $(function() {$(".input_date").mask(date_mask);} );
// $(function() {$(".input_currency").autoNumeric({aSep: '.', aDec: ',', aSign: currency_symbol, pSign: 's', mDec: currency_radix, wEmpty: 'sign'});});
var input_decimal_options = {mDec: '2', aSep: '', aDec: decimal_separator};
var input_integer_options = {mDec: '0', aSep: '', aDec: decimal_separator};

var init_input_masks = function(elem) {
    $('input.decimal', elem).autoNumeric(input_decimal_options);
    $('input.integer', elem).autoNumeric(input_integer_options);
};
var update_input_masks = function(elem) {
    $('input.decimal', elem).autoNumeric(input_decimal_options);
    $('input.integer', elem).autoNumeric(input_integer_options);
};

init_input_masks(document);
var reset_input_masks_on_clone = function(newline) {
  $('input.decimal', newline).each(function(){
    $(this).autoNumeric('destroy');
    $(this).autoNumeric('init', input_decimal_options);
  });
  $('input.integer', newline).each(function(){
    $(this).autoNumeric('destroy');
    $(this).autoNumeric('init', input_integer_options);
  });
}
