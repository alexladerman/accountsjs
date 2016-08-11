var htmlmenu = '';

function traverse_menu(node, i, elements, len) {
  var nextNode, traversed, count = 0;
  var li = document.createElement('li');
  li.appendChild(document.createTextNode(node.key));
  while (i < len) {
    nextNode = elements[i];
    traversed = traverse_menu(nextNode, i+1, elements, len);
    i = traversed.index;
    if (nextNode.key.startsWith(node.key)) {
      return {index: i, li: li};
    }
    // console.log(i)
    i++;
  }
  return {index: i, li: li};
}


menu = [
{key: ''},
{key: 'Billing'},
{key: 'Billing/New invoice'},
{key: 'Billing/New quote'},
{key: 'Billing/New recurring invoice'},
{key: 'Billing/Batch Invoicing'},
{key: 'Billing/Outstanding invoices'},
{key: 'Billing/Direct debit'},
{key: 'Billing/Payments'},
{key: 'Customers'},
{key: 'Customers/New customer'},
{key: 'Customers/New invoice'},
{key: 'Customers/New job'},
{key: 'Customers/Ledger cards'},
{key: 'Customers/Debtors'},
{key: 'Customers/Customer templates'},
{key: 'Customers/Activity'},
{key: 'Suppliers'},
{key: 'Suppliers/New supplier'},
{key: 'Suppliers/Ledger cards'},
{key: 'Suppliers/Creditors'},
{key: 'Suppliers/Supplier templates'},
{key: 'Suppliers/Activity'},
{key: 'Workers'},
{key: 'Workers/Payroll'},
{key: 'Workers/Assign jobs'},
{key: 'Workers/Assign customers'},
{key: 'Workers/Assign suppliers'},
{key: 'Workers/Activity'},
{key: 'Jobs'},
{key: 'Jobs/New job'},
{key: 'Jobs/Add expenses'},
{key: 'Jobs/Add time'},
{key: 'Jobs/Add products'},
{key: 'Jobs/Add service'},
{key: 'Jobs/New invoice'},
{key: 'Jobs/Activity'},
{key: 'Products'},
{key: 'Products/New product'},
{key: 'Products/Product templates'},
{key: 'Services'},
{key: 'Services/New service'},
{key: 'Services/Service templates'},
{key: 'Accounting'},
{key: 'Accounting/New entry'},
{key: 'Accounting/General journal'},
{key: 'Accounting/General ledger'},
{key: 'Accounting/Balance sheet'},
{key: 'Accounting/Profit and loss'},
{key: 'Accounting/Cashflow'},
{key: 'Accounting/Owners equity'},
{key: 'Accounting/Debtors'},
{key: 'Accounting/Creditors'},
{key: 'Taxes'},
{key: 'Taxes/VAT (303-390)'},
{key: 'Taxes/VAT Sales and purchases (340)'},
{key: 'Taxes/VAT EU transactions (349)'},
{key: 'Taxes/Witholding Tax Work (111-190)'},
{key: 'Taxes/Witholding Tax Rent (115-180)'},
{key: 'Taxes/Income Tax (Self employed) (130)'},
{key: 'Taxes/Corporation Tax (202-200)'},
{key: 'Taxes/Above threshold (347)'},
{key: 'Taxes/Annual Accounts (XBRL)'},
];

(function(){
    console.log("\nprint menu\n");
    var traversed = traverse_menu(menu[0], 0+1, menu, menu.length);
    console.log(traversed.li);
})();
