use hurukun;
--  type    配置项类型 index,
--          1   blog 分类相关配置
--  key     子类型 注：把表中数据看做一个树的结构，这个字段是该条记录的 全路基；
--  content 配置项内容,
--  id   配置项id ,

drop table motto;
create table motto (
    id     int(16) unsigned not null primary key auto_increment,
    content text default '',
    author char( 16 ) default 'Guardian',
    createtime    datetime not null,
    modifytime datetime not null
);