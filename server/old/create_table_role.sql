DROP TABLE IF EXISTS `role`;

CREATE TABLE IF NOT EXISTS `role` (
  `role_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `business_id` int(11) NOT NULL,
  `role` varchar(255) DEFAULT 'default',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`role_id`),
  UNIQUE KEY (`user_id`, `business_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

INSERT INTO `role` (`role_id`, `user_id`,`business_id`, `role`) VALUES
(1, 1, 1, 'admin'), 
(2, 2, 1, 'default'),
(3, 3, 2, 'admin'),
(4, 4, 2, 'default'),
(5, 5, 2, 'default'),
(6, 6, 3, 'admin'),
(7, 7, 3, 'default');
