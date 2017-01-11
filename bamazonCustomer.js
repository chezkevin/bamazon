var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
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
				});
		}
		else {
			console.log("Insufficient Quantity! Please edit your order.");
			runSearch();
		}
		console.log("-----------------------------------");
	});
}

// * A query which returns all data for songs sung by a specific artist
// function findByArtist(){
// 	inquirer.prompt([
// 		{
// 			name: "artistname",
// 			type: "input",
// 			message: "Please enter an artist name."
// 		}
// 	]).then(function(answer) {
// 		connection.query("Select * FROM top5000 WHERE artist=?", [answer.artistname], function(err,res){
// 			var songArray = res;
// 			console.log("-----------------------------------");
// 			console.log("Artist: " + answer.artistname);
// 			for (var i = 0; i < songArray.length ; i++){
// 				console.log("\nSong title: " + songArray[i].song);
// 				console.log("Song rank (USA): " + songArray[i].raw_usa);
// 			}
// 			console.log("-----------------------------------");
// 		});
// 	});
// }

// //findByArtist();

// // * A query which returns all artists who appear within the top 5000 more than once
// function findArtistsWithMultipleSongs(){
// 	connection.query("Select artist FROM top5000 GROUP BY artist HAVING ( COUNT(*) > 1 )", [], function(err,res){
// 		var artistArray = res;
// 		console.log(res);
// 		console.log("-----------------------------------");
// 		for (var i = 0; i < artistArray.length ; i++){
// 			console.log("Artist: " + res[i].artist);
// 			console.log("-----------------------------------");
// 		}
// 	});
// }

// //findArtistsWithMultipleSongs();

// // * A query which returns all data contained within a specific range
// function findSongsByRange(){
// 	inquirer.prompt([
// 		{
// 			name: "lower",
// 			type: "input",
// 			message: "Please enter a lower range."
// 		},
// 		{
// 			name: "upper",
// 			type: "input",
// 			message: "Please enter an upper range."
// 		}
// 	]).then(function(answer) {
// 		connection.query("Select * FROM top5000 WHERE position BETWEEN ? AND ?", [answer.lower,answer.upper], function(err,res){
// 			var songArray = res;
// 			console.log("-----------------------------------");
// 			//console.log("Artist: " + artist);
// 			for (var i = 0; i < songArray.length ; i++){
// 				console.log("Song title: " + songArray[i].song);
// 				console.log("Song rank (USA): " + songArray[i].raw_usa);
// 			console.log("-----------------------------------");
// 			}
// 		});
// 	});
// }

// //findSongsByRange(2,3);

// // * A query which searches for a specific song in the top 5000 and returns the data for it
// function findSongByTitle(){
// 	inquirer.prompt([
// 		{
// 			name: "title",
// 			type: "input",
// 			message: "Please enter a song title."
// 		}
// 	]).then(function(answer) {
// 		connection.query("Select * FROM top5000 WHERE song=?", [answer.title], function(err,res){
// 			if (err) throw err;
				
// 			var songData = res;

// 			if (songData.length === 0){
// 				console.log("This song was not found in the top 5000:");
// 				console.log(answer.title);	
// 			}
// 			else{
// 				console.log("-----------------------------------");
// 				for (var i = 0; i < songData.length ; i++){
// 					console.log("Song title: " + songData[i].song);
// 					console.log("Song artist: " + songData[i].artist);
// 					console.log("Song rank (USA): " + songData[i].raw_usa);
// 				}
// 				console.log("-----------------------------------");
// 			}
// 		});
// 	});
// }

// //findSongByTitle("Whenever, Wherever");