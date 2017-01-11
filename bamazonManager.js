var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Suicytwo2",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  runSearch();
});

var runSearch = function() {
  inquirer.prompt({
    name: "action",
    type: "list",
    message: "What would you like to do?",
    choices: ["View Products for Sale", "View Low Inventory",
      "Add to Inventory", "Add New Product"]
  }).then(function(answer) {

    switch (answer.action) {
      case "View Products for Sale":
        displayItems();
        break;

      case "View Low Inventory":
        viewLowInventory();
        break;

      case "Add to Inventory":
        addToInventory();
        break;

      case "Add New Product":
        addNewProduct();
        break;
    }
  });
};

var displayItems = function(){
	connection.query("Select * FROM products", [], function(err,res){
		var productArray = res;
		console.log("-----------------------------------");
		for (var i = 0; i < productArray.length ; i++){
			console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price + " | " + res[i].stock_quantity);
		}
		console.log("-----------------------------------");
	});
}

var viewLowInventory = function(){
	connection.query("Select * FROM products WHERE stock_quantity < 5", [], function(err,res){
		var productArray = res;
		console.log("-----------------------------------");
		for (var i = 0; i < productArray.length ; i++){
			console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price + " | " + res[i].stock_quantity);
		}
		console.log("-----------------------------------");
	});
}

var addToInventory = function(){
	displayItems();
	inquirer.prompt([
		{
			name: "item",
			type: "input",
			message: "Enter the ID of the product you would like to update.",
			validate: function(value){
				if (isNaN(value) === false) {
					return true;
				}
				console.log("Please enter a number.");
				return false;
			}
		},
		{
			name: "quantity",
			type: "input",
			message: "How many would you like to add?",
			validate: function(value){
				if (isNaN(value) === false) {
					return true;
				}
				console.log("Please enter a number.");
				return false;
			}
		}
	]).then(function(answer) {
		connection.query("Select * FROM products WHERE item_id=?", [answer.item], function(err,res){
		var productsArray = res;
		console.log("-----------------------------------");
		var newQuantity = productsArray[0].stock_quantity + parseInt(answer.quantity);
		connection.query("UPDATE products SET ? WHERE ?",
			[{
				stock_quantity: newQuantity
			},
			{
				item_id: answer.item
			}],
			function(err, res) {
				console.log("Inventory updated successfully!");
				console.log("New quantity: " + newQuantity);
			});
		console.log("-----------------------------------");
	});
	})
}

var addNewProduct = function(){
	inquirer.prompt([{
		name: "item",
		type: "input",
		message: "What is the item you would like to add?"
	}, {
		name: "dept",
		type: "input",
		message: "What department does it belong to?"
	}, {
		name: "price",
		type: "input",
		message: "What is the price of the item?",
		validate: function(value) {
			if (isNaN(value) === false) {
				return true;
			}
			return false;
		}
	}, {
		name: "qty",
		type: "input",
		message: "What is the quantity of the item?",
		validate: function(value) {
			if (isNaN(value) === false) {
				return true;
			}
			return false;
		}
	}]).then(function(answer) {
		connection.query("INSERT INTO products SET ?", {
			product_name: answer.item,
			department_name: answer.dept,
			price: answer.price,
			stock_quantity: answer.qty
			}, function(err, res) {
				console.log("Your item was added successfully!");
		});
	});
}