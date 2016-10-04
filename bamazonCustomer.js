var mysql = require("mysql");

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

connection.query("select * from products", function (err, res){
	for (var i = 0; i<res.length; i++){
		console.log("ItemID: " + res[i].ItemID + " | " + "PN: " + res[i].ProductName + " | " + "DN: " + res[i].DepartmentName + " | " + "Price: $" + res[i].Price + " | ");
	}
})