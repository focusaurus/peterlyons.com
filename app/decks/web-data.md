# Data, Data, Everywhere

## How data powers the web

### Session #3 of Skillshare course: Web Programming Concepts for Non-Programmers

---

## Pieces of the Web

- HTML/CSS markup
- Images
- Code
- Data

---

## Where can we store our data?

- Bare filesystem, data embedded in HTML
- Bare filesystem, data in raw data files
  - Comma Separated Values (CSV)
  - eXtensible Markup Language (XML)
  - JavaScript Object Notation (JSON)
- Database (Relational, NoSQL)
- Cloud Storage
- The Browser (HTML5 Local Storage)

---

## What's a filesystem?

- Organization system for data files based on a nested tree structure (hierarchy)

---

## Bare filesystem, data embedded in HTML

- Simple HTML files served directly by a web server
- No application server, no database server

---

## Example

### Random College Biology Department Course Syllabi

```
courses/2011/fall/BIO-101.html
courses/2011/fall/BIO-120.html
courses/2011/fall/BIO-210.html
courses/2011/fall/BIO-319.html
courses/2011/spring/BIO-102.html
courses/2011/spring/BIO-220.html
courses/2012/fall/BIO-101.html
courses/2012/fall/BIO-150.html
courses/2012/spring/BIO-102.html
courses/2012/spring/BIO-314.html
```
---

## HTML + Data notes

- techncally simple, reliable, & cheap to create
- only presents data in one way. No queries or different views.
- hard to maintain over time as data grows
- hard to make bulk changes

---

## Bare filesystem, data in separate files

```
courses.html
courses.csv
```

```csv
year,semester,code,professor,day,time,description
2011,fall,BIO-101,Jones,MWF,2:00,How Life Works
2011,fall,BIO-120,Baker,TTh,11:00,Single-Cell Organisms
2011,fall,BIO-210,Schnider,MWF,10:00,Mitosis
2011,fall,BIO-319,Yun,MTh,9:00,The Golgi Apparatus
2011,spring,BIO-102,Jones,MWF,2:00,How Life Works
2011,spring,BIO-220,Schnider,MWF,10:00,Protein
2012,fall,BIO-101,Jones,MWF,2:00,How Life Works
2012,fall,BIO-150,Yun,MThF,12:00,Pathogens
2012,spring,BIO-102,Baker,TTh,3:30,Stem Cells
2012,spring/BIO-314,Merriman,MWF,6:00,Advanced Labratory Technique
```

---

## Simple data files

- Easier to change just the data or just the HTML presentation
- less duplication of HTML
- easier to add basic filters, queries, sorting

---

## Comma Separated Values (CSV) Format

- Analogous to a spreadsheet
- one set of columns, many rows, same set of fields each row
- works well for many data sets
- cannot support complex nested structures and relationships

---

## XML Format

- Wanted one standardized format used by many programs
- tired of each program having its own unique data file format
- very portable and compatible across programming languages, OSes
- wanted to be both computer-readable and human-readable
- Extremely widespread use

---

## Sample XML data

Similar to HTML but very strict syntax and semantic elements and attributes

```xml
<course>
  <code>BIO-101</code>
  <semester>fall</semester>
  <year>2011</year>
  <professor>Jones</professor>
  <day>MWF</day>
  <time>2:00</time>
  <description>How Life Works</description>
</course>
```
---

## JavaScript Object Notation (JSON) Format

- XML became increasingly complex and cumbersome
- JSON took a simpler and more pragmatic approach
- Friendly for JavaScript developers
- Now in very widespread use, especially in APIs and web applications
- simple data types and structures

---

## Sample JSON Data

```json
{
  "code": "BIO-101",
  "day": "MWF",
  "description": "How Life Works",
  "professor": "Jones",
  "semester": "fall",
  "time": "2:00",
  "year": 2011
}
```
---

## Relational Databases

- Database: Repository of a single set of related data
- Schema: defines how the data is structured
- A set of tables comprised of rows and fields

---

## Relational Database Data Types

- Rows & Columns
- Data types for columns: text, numbers, dates, boolean, sequences, etc
- Constraints: Primary Key, Foreign Key, Uniqueness
- indexes
- stored procedures

---

## ACID Transactions

- Atomicity (all or nothing)
- Conistency (data is always valid and within constraints)
- Isolation (Transactions don't interfere with each other)
- Durability (data is always safe)

---

## Popular Relation Databases

- MySQL
- PostgreSQL
- Oracle
- MS SQL Server
- IBM DB2
- Sybase
- MS Access

---

## Structured Query Language (SQL)

- Usually pronounced "Sequel" or "S Q L"
- core set of official standards portable across RBDMSes
- Many DBs have proprietary extensions or variations
- Data Definition Language (create, drop, alter, etc)
- Data Manipulation Language (select, update, insert, delete, etc)
- Data Control Language (grant, revoke)
- Transaction Control Language (commit, rollback, etc)

---

## Example SQL Query

```sql
SELECT isbn, title, price, price * 0.06 AS sales_tax
FROM Book
WHERE price > 100.00
ORDER BY title;
```
---

## 3-Tier Web Application Architecture

Browser ↔ Web Server ↔ Application Server ↔ Database Server

---

## Example: PHP App Queries MySQL DB and generates HTML

```php
<?php
  // Connects to your Database
  mysql_connect("your.hostaddress.com", "username", "password") or die(mysql_error());
  mysql_select_db("Database_Name") or die(mysql_error());
  $data = mysql_query("SELECT * FROM friends WHERE pet='Cat'")
  or die(mysql_error());
  Print "<table border cellpadding=3>";
  while($info = mysql_fetch_array( $data ))
  {
  Print "<tr>";
  Print "<th>Name:</th> <td>".$info['name'] . "</td> ";
  Print "<th>Color:</th> <td>".$info['fav_color'] . "</td> ";
  Print "<th>Food:</th> <td>".$info['fav_food'] . "</td> ";
  Print "<th>Pet:</th> <td>".$info['pet'] . " </td></tr>";
  }
  Print "</table>";
?>
```
---

## Example: Ruby on Rails using ActiveRecord data to generate HTML

```erb
    <h1>Listing Books</h1>

    <table>
      <tr>
        <th>Title</th>
        <th>Summary</th>
        <th></th>
        <th></th>
        <th></th>
      </tr>

    <% @books.each do |book| %>
      <tr>
        <td><%= book.title %></td>
        <td><%= book.content %></td>
        <td><%= link_to \'Show\', book %></td>
        <td><%= link_to \'Edit\', edit_book_path(book) %></td>
        <td><%= link_to \'Remove\', book, :confirm => \'Are you sure?\', :method => :delete %></td>
      </tr>
    <% end %>
    </table>

    <br />

    <%= link_to \'New book\', new_book_path %>
```
---

## NoSQL Attributes

- Schemaless
- Distributed (shared, elastic, expandable)
- BASE instead of ACID
- MapReduce, BigTable, Dynamo, CAP Theorem

---

## NoSQL Databases

[Survey of Distributed Databases](http://dbpedias.com/wiki/NoSQL:Survey_of_Distributed_Databases#Overview_2)

---

## BASE

- Basically Available
- Soft state
- Eventually consistent

---

## CAP Theorem

- Consistency
- Availability
- Partition Tolerance
- (Pick only 2!)

---

## Map Reduce

- Map: map([2, 7, 13, 24], double) yields [4, 14, 26, 48]
- Reduce: sum, average, min, max

---

## Exercise: Sharding and MapReduce

![SQL to NoSQL](http://web.archive.org/web/20130304223152/http://dbpedias.com/w/images/9/90/MongoDB.JPG)

---

## Cloud Storage

- Amazon S3 (filesystem)
- Amazon RDS (SQL DB)
- Amazon SimpleDB (Key/Value DB)
- Microsoft SQL Azure

---

## HTML5 LocalStorage

- Small area of storage on a single web browser
- Addresses some of the pervisions of Cookies
- A SQL-type database was proposed but has since been canceled

---

## Application Programming Interfaces (APIs)

- Provide a means by which a third party program can interact with a service
- Exploding in popularity of late
- Examples: OAuth, Facebook Connect, Google Maps, Flickr, Twitter clients

---

## API Plumbing

- HTTP is becoming the universal transport protocol
- messages formatted with URL Encoding, XML, or JSON
- AJAX: Asynchronous JavaScript and XML
  - JSON often used instead of XML but AJAX name predates JSON
- Provides independence from programming language

---

## References

- [Wikipedia: File system](http://en.wikipedia.org/wiki/File_system)
- [CSV vs. XML vs. JSON](http://javamazon.com/2011/11/04/csv-vs-xml-vs-json/)
- [JSON: The Fat-free Alternative to XML](http://www.json.org/xml.html)
- [Wikipedia: The Relational Model](http://en.wikipedia.org/wiki/Relational_model)
- [SQL: DDL, DML, DCL](http://www.orafaq.com/faq/what_are_the_difference_between_ddl_dml_and_dcl_commands)
- [ACID transactions](http://en.wikipedia.org/wiki/ACID)
- [SQL Examples](http://www.itl.nist.gov/div897/ctg/dm/sql_examples.htm)

---

## References…

- [Wikipedia: SQL](http://en.wikipedia.org/wiki/SQL)
- [SQL Queries in PHP](http://php.about.com/od/phpwithmysql/ss/mysql_php_3.htm)
- [Wikipedia: Multitier architecture](http://en.wikipedia.org/wiki/Multitier_architecture)
- [http://nosql-database.org/](http://nosql-database.org/)
- [Survey of Distributed Databases](http://dbpedias.com/wiki/NoSQL:Survey_of_Distributed_Databases)
- [State of NqSQL in 2012](http://practicalcloudcomputing.com/post/16109041412/the-state-of-nosql-in-2012)
- [HTML5 Local Storage](http://diveintohtml5.info/storage.html)
- [Wikipedia: AJAX](http://en.wikipedia.org/wiki/Ajax_(programming))

---

## The End

[peterlyons.com](/)
