CREATE TABLE IF NOT EXISTS `invoice` (
  `business_id` int(11) NOT NULL, // or twos to make a primary key?
  `invoice_id` int(11) NOT NULL AUTO_INCREMENT, //single key
  `invoice_number` varchar(45) DEFAULT NULL,
  `type` varchar(45) DEFAULT NULL,
  `order_number` varchar(45) DEFAULT NULL,
  `contract_id` int(11) DEFAULT NULL,
  `balancesheet_account_id` int(11) DEFAULT NULL,
  `profitloss_account_id` int(11) DEFAULT NULL,
  `seller_id` int(11) DEFAULT NULL,
  `seller_name` varchar(45) DEFAULT NULL,
  `seller_address` varchar(45) DEFAULT NULL,
  `seller_tax_id` varchar(45) DEFAULT NULL,
  `seller_tax_country` varchar(45) DEFAULT NULL,
  `buyer_id` int(11) DEFAULT NULL,
  `buyer_name` varchar(45) DEFAULT NULL,
  `seller_address` varchar(45) DEFAULT NULL,
  `buyer_tax_id` varchar(45) DEFAULT NULL,
  `buyer_tax_country` varchar(45) DEFAULT NULL,
  `recognized_date` date DEFAULT NULL,
  `issue_date` date DEFAULT NULL,
  `supply_date` date DEFAULT NULL,
  `delivery_address` varchar(45) DEFAULT NULL,
  `delivery_country` varchar(45) DEFAULT NULL,
  `due_date` date DEFAULT NULL
PRIMARY KEY ( `invoice_id` )
CONSTRAINT business_id_invoice_number UNIQUE (business_id,invoice_number)
)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;
