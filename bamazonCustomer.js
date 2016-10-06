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
	if (err){
		throw err;
	}

	console.log("connected as id", connection.threadId);
});


function initialItems(){
	
	connection.query("select * from products", function (err, res){
		for (var i = 0; i<res.length; i++){
			console.log("ItemID: " + res[i].ItemID + " | " + "PN: " + res[i].ProductName + " | " + "DN: " + res[i].DepartmentName + " | " + "Price: $" + res[i].Price + " | ");
		}

		idSearch();

	})



var idSearch = function(){
	inquirer.prompt([{
			name: "ItemID",
			message: "Type the id of the item you'd llke to purchase.",
			type: 'list',
			choices: ['1','2','3','4','5','6','7','8','9','10']
		},{
			name: "Quanity",
			message: "How many will you buy?"
		
		}])
}

}
initialItems();