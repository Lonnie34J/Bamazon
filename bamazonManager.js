var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "Hoaasdntp44$",
	database: "bamazon"
});

connection.connect(function (err){
	if (err){throw err;}
	startManager();

	//console.log("connected as id", connection.threadId);
});

var startManager = function () {
	inquirer.prompt({
		name: "manage",
		type: "list",
		message: "Choose your manager action.",
		choices: ["View products for sale.", "View low inventory.", "Add to inventory.", "Add new product.", "Leave Bamazon manager."]
	}).then(function(answer) {
		switch(answer.manage) {
			case 'View products for sale.':
				viewProducts();
			break;

			case 'View low inventory.':
				lowInventory();
			break;

			case 'Add to inventory.':
				addInventory();
			break;

			case 'Add new product.':
				addProduct();
			break;

			case 'Leave Bamazon manager.':
				quitApp();
			break;
		}
	})
};

var viewProducts = function () {
	connection.query("select * from products", function (err, res){
		for (var i = 0; i<res.length; i++){
			console.log("ItemID: " + res[i].ItemID + " | " + "PN: " + res[i].ProductName + " | " + "DN: " + res[i].DepartmentName + " | " + "Price: $" + res[i].Price + " | " + "Stock: " + res[i].StockQuanity);
		}
		startManager();
	})
};

var lowInventory = function () {
	var query = "SELECT * FROM products WHERE StockQuanity < 5";
	connection.query(query, function (err, res) {
		if (err) {throw err;}

		for (var i = 0; i<res.length; i++) {
			console.log("Product: " + res[i].ProductName + "|" + "Stock: " + res[i].StockQuanity);
		}
		startManager();
	})
}

var addInventory = function () {
	inquirer.prompt([{
		name: "ItemID",
		message: "Select the itemID you want to icrease the inventory of.",
		type: "list",
		choices: ['1','2','3','4','5','6','7','8','9','10'],
		filter: function(str){
			return Number(str);
		}
		
		},{
			name: "increase",
			message: "How much will you increase it by?",
			type: "input",
			filter: function(str){
				return Number(str);
			}
		
	}]).then(function(answer){
		var queryID = "SELECT * FROM products WHERE ?"
		connection.query(queryID, {ItemID: answer.ItemID}, function (err, res) {
			if (err){throw err;}
			for (var i = 0; i<res.length; i++){
				console.log("ProductName: " + res[i].ProductName + " | " + "StockQuanity: " + res[i].StockQuanity);
			
				var newStock = res[i].StockQuanity + answer.increase;
					//console.log(newStock);

				connection.query("UPDATE products SET ? WHERE ?", [{StockQuanity: newStock}, {ItemID: answer.ItemID}], function(err, res) {
					if (err) {throw err;}
					console.log("ItemID: " + answer.ItemID + " inventory has been increased.");

					addMoreInventory();
				}); 
				
			};
		});
	});
};

var addMoreInventory = function() {
	inquirer.prompt({
		name: "Continue",
		message: "Do you want to add more inventory (y/n)?"
	}).then(function(answer){
		answer.Continue.toLowerCase();
		if (answer.Continue === 'y') {
			addInventory();
		}
		else if (answer.Continue === 'n') {
			startManager();
		}
		else{
			console.log("Error! enter y to add more stock or enter n to return to manager menu.");
			addMoreInventory();
		}
	});
};

var addProduct = function() {
	inquirer.prompt([{
		name: "ProductName",
		message: "Enter a prouct name."
	},{
		name: "DepartmentName",
		message: "What department will it be sold in?"
	},{
		name: "Price",
		message: "How much will it cost?",
		filter: function(str){
			return Number(str);
		}
	},{
		name: "StockQuanity",
		message: "How many units should we order?",
		filter: function(str){
			return Number(str);
		}
	
	}]).then(function(answer){
		var newProduct = {
			ProductName: answer.ProductName,
			DepartmentName: answer.DepartmentName,
			Price: answer.Price,
			StockQuanity: answer.StockQuanity
		}; 
		//console.log(newProduct);
		connection.query('INSERT INTO Products SET ?', newProduct, function(err, res){
			if (err){throw err;}
			console.log("Item added.");
			addMoreProducts();
		})
	})
};

var addMoreProducts = function(){
	inquirer.prompt({
		name: "addMore",
		message: "Would you like to add another product to the store (y/n)?"
	}).then(function(answer){
		answer.addMore.toLowerCase();
		if(answer.addMore === 'y'){
			addProduct();
		}
		else if(answer.addMore === 'n'){
			startManager();
		}
		else{
			console.log("Input error! Type y to enter more products or n to return to main menu.");
			addMoreProducts();
		}
	});
};

var quitApp = function(){
	inquirer.prompt({
		name: "Quit",
		message: "Leave Bamazon manager (y/n)?"
	}).then(function(answer){
		answer.Quit.toLowerCase();
		if(answer.Quit === 'y'){
			console.log("Smell ya later!");
			connection.end(function(err){
				if(err){throw err;}
			})
		}else{
			startManager();
		};
	});
};