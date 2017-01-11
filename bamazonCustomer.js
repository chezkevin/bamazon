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
  displayItems();
  runSearch();
});

var displayItems = function(){
	connection.query("Select item_id,product_name,price FROM products", [], function(err,res){
		var productArray = res;
		console.log("-----------------------------------");
		for (var i = 0; i < productArray.length ; i++){
			console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price);
		}
		console.log("-----------------------------------");
	});
}

var runSearch = function(){
	inquirer.prompt([
		{
			name: "action",
			type: "input",
			message: "Enter the ID of the product you would like to buy.",
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
			message: "How many would you like to buy?",
			validate: function(value){
				if (isNaN(value) === false) {
					return true;
				}
				console.log("Please enter a number.");
				return false;
			}
		}
	]).then(function(answer) {
		checkOut(answer.action,answer.quantity);
	})
}

var checkOut = function(itemId,quantity){
	connection.query("Select * FROM products WHERE item_id=?", [itemId], function(err,res){
		var productsArray = res;
		console.log("-----------------------------------");
		var newQuantity = productsArray[0].stock_quantity - quantity;
		if (newQuantity >= 0){
			connection.query("UPDATE products SET ? WHERE ?",
				[{
					stock_quantity: newQuantity
				},
				{
					item_id: itemId
				}],
				function(err, res) {
					console.log("Purchase placed successfully!");
					var totalCost = quantity*productsArray[0].price;
					console.log("Your total cost: " + totalCost);
				});
		}
		else {
			console.log("Insufficient Quantity! Please edit your order.");
			runSearch();
		}
		console.log("-----------------------------------");
	});
}