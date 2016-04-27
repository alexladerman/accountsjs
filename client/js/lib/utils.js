if (typeof String.prototype.startsWith != 'function') {
  // see below for better implementation!
  String.prototype.startsWith = function (str){
    return this.indexOf(str) == 0;
  };
}

function formatMoney(value) {
    return accounting.formatMoney(value/100); // €4.999,99
}

function round(value, radix){
        radix = radix || 1; // default round 1
        return Math.round(value / radix) * radix;
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

function view_push(expression) {
	cookie_write("view_stack", expression, 30);
}

function view_pop() {
	eval(cookie_read("view_stack"));
}

if (!cookie_read("view_stack"))
	cookie_write("view_stack", new Stack(), 30);
