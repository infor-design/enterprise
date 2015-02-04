# Soho Control Test API

Instructions are provided for installing, configuring and extending the Soho Control XI test API. This essentially consist of a Postgresql database fronted by Node.js modules and Express.js.

## Postgresql Installation

Go to [Postgresql.org](http://www.postgresql.org/download/), pull down the binary for your platform and follow the installation instructions.

## pgAdmin III

* Launch the bundled admin panel and create a database called "soho."
* From the pgAdmin toolbar open a SQL Query window.
* Open the file explorer, pointing it to /sql/ddl.sql. Execute by clicking the pgScript toolbar icon. This script creates objects and permissions. If you see "does not exist errors," its OK.
* Open the file explorer, pointing it to /sql/dml.sql. Execute by clicking the pgScript toolbar icon. This script creates rows of data.
* Using the treeview, navigate to the public schema and open one of the tables to confirm data exists.

## Node.js Modules

Navigate to /src. You will find 2 modules:

* controllers/sample-data-controller.js. This contains sql interfaces to the soho schema.
* routers/rest-router.js. This exposes RESTful Express routes.

## Extending the API

If you need to extend the API, keep the following in mind:

* Continue to use the controller-router pattern.
* Update ddl.sql and dml.sql accordingly with particular focus on permissions as it can be very frustrating tweaking operations on objects.

Yo, knock yourself out!
