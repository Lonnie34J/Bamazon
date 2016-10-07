//sets the npm packages to variables

var mysql = require("mysql");
var inquirer = require("inquirer");
var cart = [];
var totalCart = 0;

//Sets up connect to mysql database
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "Hoaasdntp44$",
	database: "bamazon"
});

//links the js file to the database and if there is an error it'll tell me what it is
connection.connect(function (err){
	if (err){
		throw err;
	}

	//console.log("connected as id", connection.threadId);
});

//this is the function that wraps up all the code I want to run for the bamazon storefront app

	//this uery will pull all data from the database and then loop through the results to log specified data
	connection.query("select * from products", function (err, res){
		for (var i = 0; i<res.length; i++){
			console.log("ItemID: " + res[i].ItemID + " | " + "PN: " + res[i].ProductName + " | " + "DN: " + res[i].DepartmentName + " | " + "Price: $" + res[i].Price + " | ");
		}
		//invokes the shop function after the query has been made 
		shop();

	})



//allows the user to select what items they'd like to purchase and how many
var shop = function(){
	inquirer.prompt([{
			name: "ItemID",
			message: "Type the id of the item you'd like to purchase.",
			type: 'list',
			choices: ['1','2','3','4','5','6','7','8','9','10'],
			//filter function makes it so that the string value of users input(or in this case choice) will return a number value
			filter: function(str){
				return Number(str);
			}
		},{
			name: "Quanity",
			message: "How many will you buy?",
			type: 'input',
			filter: function(str){
				return Number(str);
			}
		//promise function that will handle the transaction 
		}]).then(function(answer){
			var query = "Select * From products Where ?" //takes the users input from first question and matches the selected id to info from database then los results
            connection.query(query, {ItemID: answer.ItemID}, function(err, res){
				for (var i = 0; i<res.length;i++){
				console.log("Product: " + res[i].ProductName + ' | ' + "Department: " + res[i].DepartmentName + ' | ' + "Price: " +"$"+ res[i].Price);
				console.log("----------------------------------------------------------------");
				//conditional statements: 1. determines if the user selected quanity is greater than the stock in the database 
				if (answer.Quanity>res[i].StockQuanity){
				console.log("Insufcient Quanity!");
				} 
                else{
				
                var stockTotal = res[i].StockQuanity - answer.Quanity; //2. subtracts user quanity from database quanity
				//console.log(stockTotal);
				var totalCost = res[i].Price * answer.Quanity; //3. multiplies the price by how many of item user enters
				//console.log(totalCost);
										
				cart.push(totalCost);
				console.log(cart);

				for (var j = 0; j < cart.length; j++){
				    totalCart+=cart[j];
				}
				console.log(totalCart);

				connection.query("UPDATE products SET ? WHERE ?", [{StockQuanity: stockTotal}, {ItemID: answer.ItemID}], function(err, res){
				    if (err){throw err}
				    console.log("Your Total is: " +"$"+ totalCost);
				    //invokes the restart function once initial transaction is completed
				    restart();
				    })
				}
            }

        })
    })
}
//this function will prompt the user if they'd wish to continue. If not the app will end
	var restart = function() {
		inquirer.prompt({
			name: "Continue" ,
			message: "Keep shopping (y/n)?",
		}).then(function(answer){
			answer.Continue.toLowerCase(); 
			if (answer.Continue === 'y'){
				shop();
			} else if(answer.Continue === 'n'){
				console.log("Thanks for shopping!");
				connection.end(function(err){
					if(err){throw err}
				})
			}else{
				console.log("Input error!");
				restart();
			}
		})
	}
