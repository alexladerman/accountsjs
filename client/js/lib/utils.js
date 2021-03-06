if (typeof String.prototype.startsWith != 'function') {
  // see below for better implementation!
  String.prototype.startsWith = function (str){
    return this.indexOf(str) == 0;
  };
}

function intToMoney(value) {
    return (value/(Math.pow(10,currency_radix))).toFixed(currency_radix); // to decimal for display
}

function moneyToInt(value) {
    return parseInt(value*(Math.pow(10,currency_radix))); // to integer for storage in db
}

function intToDecimal(value) {
    return (value/(Math.pow(10,currency_radix))).toFixed(decimal_radix); // to decimal for display
}

function decimalToInt(value) {
    return parseInt(value*(Math.pow(10,currency_radix))); // to integer for storage in db
}

function round(value, radix){
        radix = radix || 1; // default round 1
        return Math.round(value / radix) * radix;
}

function dateFormat(date) {
  return date.substring(0,date.indexOf('T'));
}

function today() {
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth() + 1; //January is 0!
	var yyyy = today.getFullYear();
	if (dd < 10)
		dd ='0' + dd;
	if (mm < 10)
		mm ='0' + mm;
	return yyyy + '-' + mm + '-' + dd;
}


function Stack()
{
 this.stac=new Array();
 this.pop=function(){
  return this.stac.pop();
 }
 this.push=function(item){
  this.stac.push(item);
 }
}

// function view_push(expression) {
// 	cookie_write("view_stack", expression, 30);
// }
//
// function view_pop() {
// 	eval(cookie_read("view_stack"));
// }
//
// if (!cookie_read("view_stack"))
// 	cookie_write("view_stack", new Stack(), 30);

var serialize_table = function (tr_container, element_selector, fieldname_selector, value_selector){
  var rows = [];
  var trs = tr_container.children;
  for (var i = 0; i < trs.length; i++) {
      var elements = trs[i].querySelectorAll(element_selector);
      var row = {};
      for (var j = 0; j < elements.length; j++) {
        var fieldname = elements[j][fieldname_selector];
        var value = elements[j][value_selector];
        if ($(elements[j]).hasClass('integer'))
          value = parseFloat(value) || 0;
        else if ($(elements[j]).hasClass('decimal'))
          value = decimalToInt(parseFloat(value) || 0);
        else if ($(elements[j]).hasClass('currency'))
          value = moneyToInt(parseFloat(value) || 0);
        else
          value = value || "";
        row[fieldname || make_random_id()] = value;
      }
      if (!isFalsyObject(row))
        rows.push(row);
  }
  return rows;
}

var deserialize_row = function (data, line, element_selector, fieldname_selector, value_selector){
      var elements = line.querySelectorAll(element_selector);
      for (var j = 0; j < elements.length; j++) {
        var fieldname = elements[j][fieldname_selector];
        var value = elements[j][value_selector];
        if ($(elements[j]).hasClass('integer')) {
          var val = parseInt(data[fieldname]) || 0;
          val = parseInt(val) ? val : '';
          $(elements[j]).val(val);
        }
        else if ($(elements[j]).hasClass('decimal')) {
          var val = intToDecimal(parseInt(data[fieldname]) || 0);
          val = parseFloat(val) ? val : '';
          $(elements[j]).val(val);
        }
        else if ($(elements[j]).hasClass('currency')) {
          var val = intToMoney(parseInt(data[fieldname]) || 0);
          val = parseFloat(val) ? val : '';
          $(elements[j]).val(val);
        }
        else if ($(elements[j]).hasClass('typeahead'))
          $(elements[j]).typeahead('val', data[fieldname] || "");
        else
          $(elements[j]).val(data[fieldname] || "");
      }
}

var isFalsyObject = function(object) {
  var keys = Object.keys(object);
  for (var i = 0; i < keys.length; i++) {
    if (object[keys[i]])
      return false;
  }
  return true;
}

function make_random_id()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
