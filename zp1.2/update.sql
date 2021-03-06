CREATE TABLE IF NOT EXISTS `xiami_banner` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `title` varchar(200) NOT NULL COMMENT '标题',
  `img` varchar(100) NOT NULL COMMENT '图片',
  `url` varchar(100) NOT NULL COMMENT '地址',
  `sid` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '排序',
  PRIMARY KEY (`id`),
  KEY `img` (`img`),
  KEY `url` (`url`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='首页banner管理'