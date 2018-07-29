use heartbeat;

drop table diary;
create table diary(
    id      int( 32 ) unsigned not null primary key auto_increment,
    uid     char(16) not null,
    day datetime not null,
    modifytime datetime not null,
    content text not null
);