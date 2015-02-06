-- **************************
-- Soho XI Controls Sample Db
-- File name: ddl.sql
-- Purpose: bootstrap schema
-- Target Db: Postgresql
-- **************************

-- clean-up
-- 1. privileges/user
REVOKE ALL PRIVILEGES ON TABLE countries FROM sampledatauser;
REVOKE ALL PRIVILEGES ON TABLE items FROM sampledatauser;
DROP ROLE sampledatauser;

-- 2. objects
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS countries;
DROP FUNCTION getcountrynameval(integer);
DROP TYPE nameval;

-- build-up
-- 1. objects
CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  comment TEXT NOT NULL,
  price numeric(7,4) NOT NULL,
  amount integer NOT NULL,
  created timestamp NOT NULL,
  instock boolean NOT NULL,
  countryid integer NOT NULL
);

CREATE TABLE countries (
  id SERIAL PRIMARY KEY,
  name varchar(100) NOT NULL,
  value varchar(30) NOT NULL
);

CREATE TYPE nameval AS (
  name  varchar(100),
  val   varchar(30)
);

CREATE FUNCTION getCountryNameVal(integer) RETURNS nameval AS $$
  SELECT    name,
      value
  FROM    countries
  WHERE   id = $1;
$$ LANGUAGE SQL;

-- 2. user/privileges
CREATE ROLE sampledatauser WITH LOGIN;
ALTER ROLE sampledatauser WITH PASSWORD 'soho';

GRANT SELECT ON items TO sampledatauser;
GRANT INSERT ON items TO sampledatauser;
GRANT UPDATE ON items TO sampledatauser;
GRANT DELETE ON items TO sampledatauser;

GRANT SELECT ON countries TO sampledatauser;
GRANT INSERT ON countries TO sampledatauser;
GRANT UPDATE ON countries TO sampledatauser;
GRANT DELETE ON countries TO sampledatauser;

GRANT USAGE, SELECT ON SEQUENCE items_id_seq TO sampledatauser;
GRANT USAGE, SELECT ON SEQUENCE countries_id_seq TO sampledatauser;
