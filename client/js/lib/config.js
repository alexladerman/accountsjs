var date_mask = "99/99/9999"
var currency_radix = 2;
var currency_symbol = '€';
var decimal_separator = '.';

accounting.settings = {
    currency: {
        symbol : currency_symbol,   // default currency symbol is '$'
        format: "%v", // controls output: %s = symbol, %v = value/number (can be object: see below)
        decimal : ".",  // decimal point separator
        thousand: ",",  // thousands separator
        precision : currency_radix   // decimal places
    },
    number: {
        precision : 0,  // default precision on numbers is 0
        thousand: ",",
        decimal : "."
    }
}
