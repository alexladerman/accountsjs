DROP TABLE IF EXISTS `user`;

CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `salt` char(16) DEFAULT NULL,
  `pwd` char(64) DEFAULT NULL,
  `language` varchar(255) DEFAULT NULL,
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

INSERT INTO `user` (`user_id`,`email`, `salt`, `pwd`, `language`) VALUES
(1, 'steve@apple.com', '', 'password', 'en'), /*password*/
(2, 'woz@apple.com', '', 'password', 'en'), /*password*/
(3, 'bill@microsoft.com', '', '', 'en'),
(4, 'paul@microsoft.com', '', '', 'en'),
(5, 'mark@microsoft.com', '', '', 'en'),
(6, 'sergey@google.com', '', '', 'en'),
(7, 'larry@google.com', '', '', 'en');
