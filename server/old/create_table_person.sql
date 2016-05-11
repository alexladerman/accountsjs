DROP TABLE IF EXISTS `person`;

CREATE TABLE IF NOT EXISTS `person` (
  `business_id` int(11) NOT NULL,
  `person_id` int(11) NOT NULL AUTO_INCREMENT,
  `ref` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `tax_id` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `telephone` varchar(255) DEFAULT NULL,
  `passport` varchar(255) DEFAULT NULL,
  `date_birth` date DEFAULT NULL,
  `nationality` varchar(255) DEFAULT NULL,
  `language` varchar(255) DEFAULT NULL,
  `tax_country` varchar(255) DEFAULT NULL,
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`business_id`, `person_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

INSERT INTO `person` (`business_id`,`person_id`, `ref`, `name`, `tax_id`, `address`, `email`, `telephone`, `passport`, `date_birth`, `nationality`, `language`, `tax_country`) VALUES
(1, 1,'1', 'Steve Jobs', '111111111', '2066 Crist Dr. in Los Altos, California, United States', 'steve@apple.com', '+1 12345678', '', '0000-00-00', '', '', ''),
(1, 2,'2', 'Steve Wozniak', '11112222', '2066 Crist Dr. in Los Altos, California, United States', 'woz@apple.com', '+1 12345678', '', '0000-00-00', '', '', ''),
(2, 1,'1', 'Bill Gates', '33331111', '115 California St. NE, Albuquerque, New Mexico, United States', 'bill@microsoft.com', '+1 12345678', '', '0000-00-00', '', '', ''),
(2, 2,'2', 'Paul Allen', '33332222', '115 California St. NE, Albuquerque, New Mexico, United States', 'paul@microsoft.com', '+1 12345678', '', '0000-00-00', '', '', ''),
(2, 3,'3', 'Marc McDonald', '33333333', '115 California St. NE, Albuquerque, New Mexico, United States', 'mark@microsoft.com', '+1 12345678', '', '0000-00-00', '', '', ''),
(3, 1,'1', 'Sergey Brin', '22221111', 'Santa Margarita Ave., Menlo Park, California, United States', 'sergey@google.com', '+1 12345678', '', '0000-00-00', '', '', ''),
(3, 2,'2', 'Larry Page', '22222222', 'Santa Margarita Ave., Menlo Park, California, United States', 'larry@google.com', '+1 12345678', '', '0000-00-00', '', '', '');
