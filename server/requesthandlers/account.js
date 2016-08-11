module.exports = function (req, res) {
  var params = url.parse(req.url, true).query;
  var token_decoded = get_token_decoded(req, res);
  console.log(token_decoded);
  var user_id = token_decoded['user_id'];
  if (user_id > 0) {
    var action = params.action;
    var query = '';
    switch (action) {
      // case 'save':
      // var data = req.body;
      // var business_id = data.business_id;
      // var lines = data.lines.map(function(line){return line});
      // (lines === data.lines) ? console.log('(lines === data.lines) true') : console.log('(lines === data.lines) false');
      // delete data.lines;
      // if (data.invoice_id) {
      //   InvoiceData.Exists(data.invoice_id, function(){
      //     lines = lines.map(function(line){line.invoice_id = data.invoice_id; line.business_id = business_id; return line});
      //     InvoiceData.Update(data, function(){
      //       InvoiceLineData.DeleteByInvoice(data.invoice_id, function(){
      //         InvoiceLineData.CreateBulk(lines, function(){
      //           InvoiceData.Read(data.invoice_id, function(record){
      //             respond_json(req, res, record);
      //           });
      //         });
      //       });
      //     });
      //   });
      // }
      // else {
      //   InvoiceData.Create(data, function(invoice_id){
      //     console.log('lines before invoice_id:');
      //     console.log(lines);
      //     lines = lines.map(function(line){line.invoice_id = invoice_id; line.business_id = business_id; return line});
      //     console.log('lines after invoice_id::');
      //     console.log(lines);
      //     InvoiceLineData.CreateBulk(lines, function()  {
      //       InvoiceData.Read(invoice_id, function(record){
      //         respond_json(req, res, record);
      //       });
      //     })
      //   });
      // }
      // return; //shuts down parallel execution path after asynchronous call
      case 'list_accounts_with_balance':
      AccountData.ListByBusinessWithBalance(params.business_id, function(results) { respond_json(req, res, results) });
      return;

      default:
      AccountData.ListByBusiness(params.business_id, function(results) { respond_json(req, res, results) });
      return;
    }
  }
}
