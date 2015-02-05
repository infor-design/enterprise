-- **************************
-- Soho XI Controls Sample Db
-- File name: ddl.sql
-- Purpose: bootstrap schema
-- Target Db: Postgresql
-- **************************

-- clean-up
-- 1. privileges/user
REVOKE ALL PRIVILEGES ON TABLE dropdown FROM sampledatauser;
REVOKE ALL PRIVILEGES ON TABLE datagrid FROM sampledatauser;
DROP ROLE sampledatauser;

-- 2. objects
DROP TABLE IF EXISTS "datagrid";
DROP TABLE IF EXISTS "dropdown";
DROP AGGREGATE IF EXISTS array_agg_multi(anyarray);
DROP FUNCTION getcountrynameval(integer);
DROP TYPE nameval;

-- build-up
-- 1. objects
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
  value varchar(30) NOT NULL
);

CREATE AGGREGATE array_agg_multi (anyarray)  (
    SFUNC     = array_cat
   ,STYPE     = anyarray
   ,INITCOND  = '{}'
);

CREATE TYPE nameval AS (
	name	varchar(100),
	val		varchar(30)
);
CREATE FUNCTION getCountryNameVal(integer) RETURNS nameval AS $$
	SELECT 		name,
			value
	FROM 		dropdown
	WHERE		id = $1;
$$ LANGUAGE SQL;

-- 2. user/privileges
CREATE ROLE sampledatauser WITH LOGIN;
ALTER ROLE sampledatauser WITH PASSWORD 'soho';

GRANT SELECT ON datagrid TO sampledatauser;
GRANT INSERT ON datagrid TO sampledatauser;
GRANT UPDATE ON datagrid TO sampledatauser;
GRANT DELETE ON datagrid TO sampledatauser;

GRANT SELECT ON dropdown TO sampledatauser;
GRANT INSERT ON dropdown TO sampledatauser;
GRANT UPDATE ON dropdown TO sampledatauser;
GRANT DELETE ON dropdown TO sampledatauser;

--GRANT SELECT ON ALL TABLES IN SCHEMA public TO sampledatauser;
--GRANT INSERT ON ALL TABLES IN SCHEMA public TO sampledatauser;
--GRANT UPDATE ON ALL TABLES IN SCHEMA public TO sampledatauser;
--GRANT DELETE ON ALL TABLES IN SCHEMA public TO sampledatauser;

GRANT USAGE, SELECT ON SEQUENCE datagrid_id_seq TO sampledatauser;
GRANT USAGE, SELECT ON SEQUENCE dropdown_id_seq TO sampledatauser;
