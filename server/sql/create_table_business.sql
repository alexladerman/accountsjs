DROP TABLE `business`;

CREATE TABLE `business` (
  `business_id` int(11) NOT NULL AUTO_INCREMENT,
  `ref` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`business_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

INSERT INTO `accounts`.`business` (`business_id`, `ref`, `name`, `status`) VALUES
(1, 1, 'Apple Inc.', 'active'),
(2, 2, 'Microsoft Corporation', 'active'),
(3, 3, 'Google Inc.', 'active');


