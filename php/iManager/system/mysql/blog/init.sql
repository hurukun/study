use hurukun;
--  type    配置项类型 index,
--          1   blog 分类相关配置
--  key     子类型 注：把表中数据看做一个树的结构，这个字段是该条记录的 全路基；
--  content 配置项内容,
--  id   配置项id ,

drop table blog_config;
create table blog_config (
    id     int(16) unsigned not null primary key auto_increment,
    type    int(8) unsigned not null,
    ckey     char(16) not null,
    content char(32) not null,
    CONSTRAINT uc_keywordID UNIQUE( type, ckey )
);

--  title   标题,
--  content 内容,
--  time    修改时间,
--  OS      相关平台 [ 0 => "windows"| 1 => "linux"| 2=> "mac"],
--  keyword 与 blog_conf中相对应的 cid;
--  id      id,

drop table blog_data;
create table blog_data (
    id      int(16) unsigned default null primary key auto_increment,
    title   char(64) not null,
    content text default '',
    createtime    datetime not null,
    modifytime datetime not null,
    author char( 16 ) default 'Guardian',
    classes      char(32) default null,
    keywords char(32) default null
);

drop table blog_comment;
create table blog_comment(
    content text not null,
    commenter char(16) default 'anonymous',
    contact  char(32) default null,
    bid     int(16) not null,
    id      int(16) unsigned primary key auto_increment
);