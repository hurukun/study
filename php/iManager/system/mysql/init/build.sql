use heartbeat;

drop table account;
create table account(
    uid     char(16) not null primary key,
    uname  char( 32 ) not null default 'Klause',
    account char( 32 ) default '',
    passwd char(32) not null,
    gender boolean not null,
    auth char(64) 
);