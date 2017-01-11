CREATE DATABASE bamazon;

use bamazon;

CREATE TABLE products (
  item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INTEGER(11) NOT NULL,
  PRIMARY KEY (item_id)
);

INSERT into products(product_name,department_name,price,stock_quantity)
	VALUES("Boyon Portable Touch Control LED Desk Lamp","Lamps & Shades",13.50,59),
		  ("A Christmas Story 20 inch leg lamp","Lamps & Shades",42.53,21);

INSERT into products(product_name,department_name,price,stock_quantity)
	VALUES("Spigen Ultra Hybrid iPhone 6S Case","Cell Phones & Accessories",11.99,11862),
          ("iPhone SE Case Snugg","Cell Phones & Accessories",9.99,953),
          ("Galaxy S5 Case, Tekcoo [TM]", "Cell Phones & Accessories",6.95,746),
          ("Samsung Galaxy S5 Case S View Flip Cover Folio", "Cell Phones & Accessories",7.19,8646),
          ("Gengar-EX Box","Toys & Games",19.02,324),
          ("Pokemon Wave Slasher Theme Deck","Toys & Games",13.50,75),
          ("Catan 5th Edition","Toys & Games",34.49,307),
          ("The Life and Times of the Thunderbolt Kid: A Memoir","Books",10.02,3789);
          
SELECT * FROM products;