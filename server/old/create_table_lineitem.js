CREATE TABLE IF NOT EXISTS `lineitem` (
  `business_id` int(11) NOT NULL AUTO_INCREMENT, // or twos to make a primary key?
  `invoice_id` int(11) NOT NULL AUTO_INCREMENT, //single key
  `lineitem_id` int(11) NOT NULL AUTO_INCREMENT, //single key
  `product_id` int(11) DEFAULT NULL,
  `description` varchar(45) DEFAULT NULL,
  `qty` int(11) DEFAULT NULL,
  `unit` varchar(45) DEFAULT NULL,
  `unit_price` int(11) DEFAULT NULL,
  `discount_rate` int(11) DEFAULT NULL,
  `discount` int(11) DEFAULT NULL,
  `base` int(11) DEFAULT NULL,
  `sales_tax_rate` int(11) DEFAULT NULL,
  `sales_tax` int(11) DEFAULT NULL,
  `vat_rate` int(11) DEFAULT NULL,
  `vat` int(11) DEFAULT NULL,
  `equivalence_charge_rate` int(11) DEFAULT NULL,
  `equivalence_charge` int(11) DEFAULT NULL,
  `withholding_tax_rate` int(11) DEFAULT NULL,
  `withholding_tax` int(11) DEFAULT NULL,
  `total` int(11) DEFAULT NULL
  PRIMARY KEY (`business_id`, `invoice_id`, `lineitem_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;
