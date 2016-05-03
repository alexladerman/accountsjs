module.exports = function (req, res) {
  var params = url.parse(req.url, true).query;
  var token_decoded = get_token_decoded(req, res);
  console.log(token_decoded);
  if (token_decoded) {
    var user_id = token_decoded['user_id'];
    if (user_id > 0) {
      console.log(params);
      var action = params.action;
      var query = '';
      switch (action) {
        case 'new':
          var query = 'INSERT INTO `invoice` (`business_id`, `invoice_id`, `prefix`, `serial_number`, `type`, `order_number`, `contract_id`, `balancesheet_account_id`, `profitloss_account_id`, `seller_id`, `seller_name`, `seller_address`, `seller_tax_id`, `seller_tax_country`, `buyer_id`, `buyer_name`, `buyer_address`, `buyer_tax_id`, `buyer_tax_country`, `recognized_date`, `issue_date`, `supply_date`, `delivery_address`, `delivery_country`, `due_date`) VALUES';
          query += '(';
          query += mysql.escape(params.business_id) + ',';
          query += mysql.escape(params.invoice_id) + ',';
          query += mysql.escape(params.prefix) + ',';
          query += mysql.escape(params.serial_number) + ',';
          query += mysql.escape(params.type) + ',';
          query += mysql.escape(params.order_number) + ',';
          query += mysql.escape(params.contract_id) + ',';
          query += mysql.escape(params.balancesheet_account_id) + ',';
          query += mysql.escape(params.profitloss_account_id) + ',';
          query += mysql.escape(params.seller_id) + ',';
          query += mysql.escape(params.seller_name) + ',';
          query += mysql.escape(params.seller_address) + ',';
          query += mysql.escape(params.seller_tax_id) + ',';
          query += mysql.escape(params.seller_tax_country) + ',';
          query += mysql.escape(params.buyer_id) + ',';
          query += mysql.escape(params.buyer_name) + ',';
          query += mysql.escape(params.buyer_address) + ',';
          query += mysql.escape(params.buyer_tax_id) + ',';
          query += mysql.escape(params.buyer_tax_country) + ',';
          query += mysql.escape(params.recognized_date) + ',';
          query += mysql.escape(params.issue_date) + ',';
          query += mysql.escape(params.supply_date) + ',';
          query += mysql.escape(params.delivery_address) + ',';
          query += mysql.escape(params.delivery_country) + ',';
          query += mysql.escape(params.due_date);
          query += ')';
          console.log(query);
          break;
        case 'last_serial_number':
          var query = 'SELECT max(ifnull(serial_number, 0)) as last_serial_number FROM invoice ?';
          var params = url.parse(req.url, true).query;
          var business_id = params.business_id;
          // if hasPermission(user_id, business_id) {}
          //var prefix = params.prefix;
          var whereclause = (business_id > 0) ? 'WHERE business_id = ' + mysql.escape(business_id) : '';
          //whereclause += ' AND prefix = ' + mysql.escape(prefix);
          query = query.replace('?', whereclause);
          break;
        default:
          var query = 'SELECT customer.id, customer.name, customer.email, FORMAT(customer.hourly_rate, 2) AS hourly_rate, TIME_FORMAT(SEC_TO_TIME(sum_periods), \'%H:%i:%s\') AS billable_time, FORMAT(sum_periods * customer.hourly_rate / 3600, 2) AS billable_amount FROM customer LEFT JOIN (SELECT customer.id AS customer_id, sum(TIMESTAMPDIFF(SECOND, period.start, period.stop)) AS sum_periods FROM customer JOIN project ON customer.id = project.customer_id JOIN period ON period.project_id = project.id WHERE period.billed = 0 ? GROUP BY customer.id) AS total ON customer.id = total.customer_id';
          var customer_id = url.parse(req.url, true).query.customer_id;
          var whereclause = (customer_id > 0) ? 'AND customer_id = ' + mysql.escape(customer_id) : '';
          query = query.replace('?', whereclause);
      }
      execute_json_query(query, req, res);
    }
  } else {
    console.log('respond_unauthorized');
    // respond_unauthorized(req, res);
    respond_json(req, res, {error: "respnauthorized"});
  }
}
