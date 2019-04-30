var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Baddog28!",
    database: "Bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    afterConnection();
});


function afterConnection() {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to search",
        choices: [
            "View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product",
            "exit"
        ]
    })
        .then(function (answer) {
            switch (answer.action) {
                case "View Products for Sale":
                    viewProducts();
                    break;

                case "View Low Inventory":
                    viewLow();
                    break;

                case "Add to Inventory":
                    addInventory();
                    break;

                case "Add New Product":
                    addProduct();
                    break;

                case "exit":
                    connection.end();
                    break;
            }
        });
}

function viewProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log(res);
        afterConnection()
    });
}

function viewLow() {
    var query = "SELECT product_name, department_name, price, stock_quantity FROM products WHERE stock_quantity < 10";
    connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log("Product: " + res[i].product_name + " || Department: " + res[i].department_name + " || Price: " + res[i].price + " || Stock:  " + res[i].stock_quantity);
        }
        // if (err) throw err;
        // console.log(res);
        afterConnection();
    });
}
function addInventory() {
    inquirer.prompt([
        {
            name: "product_name",
            type: "input",
            message: "What is the name of the product you would like to add more inventory of",
        },
        {
            name: "stock_quantity",
            type: "input",
            message: "How many items would you like to add",
        }
    ]).then (function (location) {
        connection.query(`UPDATE products SET stock_quantity = stock_quantity + "${location.stock_quantity}" WHERE product_name = "${location.product_name}"`,
          function(err, res) {
            console.log("products updated!\n");
            afterConnection()
        }); 
    })    
}

function addProduct() {
    inquirer.prompt([
        {
            name: "product_name",
            type: "input",
            message: "What is the name of the product you would like to add",
        },
        {
            name: "department_name",
            type: "input",
            message: "What is the name of the department you would like to add it to",
        },
        {
            name: "price",
            type: "input",
            message: "What is the price of product would you like to add",
        },
        {
            name: "stock_quantity",
            type: "input",
            message: "What is the quantity of the product you would you like to add",
        }
    ])
    .then(function (location) {
        connection.query(
            "INSERT INTO products SET ?",
            {
                product_name: location.product_name,
                department_name: location.department_name,
                price: location.price,
                stock_quantity: location.stock_quantity
            },
            function (err) {
                if (err) throw err;
                console.log("Your Item was created successfully!");
                afterConnection()
            }
    )})
}    
