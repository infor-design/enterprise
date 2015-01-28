-- **************************
-- Soho XI Controls Sample Db
-- File name: ddl.sql
-- Purpose: bootstrap schema
-- Target Db: Postgresql
-- **************************

DROP TABLE IF EXISTS "datagrid";
DROP TABLE IF EXISTS "dropdown";

CREATE TABLE "datagrid" (
  id SERIAL PRIMARY KEY,
  comment TEXT NOT NULL,
  fractional_amount numeric(7,4) NOT NULL,
  integer_amount integer NOT NULL,
  create_date timestamp NOT NULL,
  some_bool boolean NOT NULL,
  dropdown_id integer NOT NULL
);

CREATE TABLE "dropdown" (
  id SERIAL PRIMARY KEY,
  name varchar(100) NOT NULL,
  value integer NOT NULL
);