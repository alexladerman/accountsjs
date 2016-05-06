var date_mask = "9999-99-99"
var currency_radix = 2;
var currency_symbol = '€';
var decimal_radix = 2;
var decimal_separator = '.';

accounting.settings = {
    currency: {
        symbol : currency_symbol,   // default currency symbol is '$'
        format: "%v", // controls output: %s = symbol, %v = value/number (can be object: see below)
        decimal : decimal_separator,  // decimal point separator
        thousand: ",",  // thousands separator
        precision : currency_radix,   // decimal places
        grouping : 3		// digit grouping (not implemented yet)
    },
    number: {
        precision : 0,  // default precision on numbers is 0
        thousand: ",",
        decimal : decimal_separator,
        grouping : 3		// digit grouping (not implemented yet)
    }
}
