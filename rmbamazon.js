// rmbamazon for week 6 homework
// install required npm's: 
//      npm init
//      npm install inquirer
//      npm install mysql
//      npm install table to "display table?"

// create a database, "bamazon," in mySQl
// create a table, "products" with columns:
    // * item_id (unique id for each product)
    // * product_name (Name of product)
    // * department_name
    // * price (cost to customer)
    // * stock_quantity (how much of the product is available in stores)

// in bamazon node app,
    // display all items available for sale, incl. id, name, price
    // ask for id they want to buy
    // ask for quantity they want to buy
    // check stock and either
        // display "insufficient quantity" or
        // update quantity in sql database to reflect reduction
        // after update is complete, display the user's total cost of their purchase

// in bamazonManager.js
    // * List a set of menu options:
        // * View Products for Sale
        // * View Low Inventory
        // * Add to Inventory
        // * Add New Product
    //functions:
        // view all items in stock, id, name, price, quantity
        // view all items with quantity < 5
        // add more of any item currently in inventory
        // add a completely new product to inventory

var inquirer = require("inquirer");
var mysql=require("mysql");
// var table=require("table");
var Table = require("cli-table");

// instantiate
var table = new Table({
    head: ['ID', 'Product','Department_name','Price','Quantity']
  , colWidths: [20, 40, 40, 20, 20]
});

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
});
function askToContinue() {
    inquirer.prompt([
    {
      type: "confirm",
      name: "userInput",
      message: "Do you want to continue?",
      default: true
    },
]).then(function(response) {
    if (response.userInput === true) {
        for (var j=0;j<10;j++) {
            console.log("\n");   
        }
        start(); 
    }
    else {
        console.log("Goodbye\n");
        (connection.end)(function(err) {
            // The connection is terminated now
          });
    }
})
}
function getUserBid() {
    inquirer.prompt([
    {
      type: "input",
      name: "desiredItem",
      message: "Which item do you want to purchase?",
    },
    {
        type: "input",
        name: "desiredQty",
        message: "How many do you wish to purchase?"  
    },
]).then(function(response) {
    // find item in database and check available stock
    var usersItem = parseInt(response.desiredItem);
    var usersQty = parseInt(response.desiredQty);
    console.log("user selected item: " + usersItem + " and quantity: " + usersQty + "\n"); // OK here
    connection.query("SELECT * FROM products WHERE ?",
    {
        item_id: usersItem
    },
     function(err, dbres) {
        if (err) throw err;
        // Log key results of the SELECT statement
        console.log("desired item = " + usersItem + "; desired qty = " + usersQty + "; item: " + dbres[0].item_id + "; available = " + dbres[0].stock_quantity + "\n");
        // Check if user's requested quantity is > or = on-hand
        if (usersQty > dbres[0].stock_quantity) {
            console.log("Insufficient Quantity!\n");
            askToContinue();
        }
        else {
            var newQty = dbres[0].stock_quantity -= usersQty;
            console.log("New qty = " + newQty);
            var totalOrder = (dbres[0].price * usersQty);
            console.log("Total order amount: " + totalOrder);
            updateQuantity(usersItem,newQty,totalOrder);
        }
      })       
    })
}

function readInventoryItems() {
    var table = new Table({
        head: ['ID', 'Product','Department_name','Price','Quantity']
      , colWidths: [20, 40, 40, 20, 20]
    });
    console.log("Displaying all items available for purchase\n"); 
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      // try adding an if statement here to "wait for" database read to complete?
      if (res) {
      for (var i = 0;i < res.length;i++) {
          // console.log(res[i].item_id,res[i].product_name,res[i].department_name, " $",res[i].price);
          table.push(
            [res[i].item_id.toString(),res[i].product_name,res[i].department_name,res[i].price.toString(),res[i].stock_quantity.toString()]
          )
      }
    }
      console.log(table.toString());
       getUserBid();
    })
   
}
function updateQuantity(desiredItem,newQty,totalOrder) {
    console.log("About to change quantity of Item " + desiredItem + " to " + newQty + "\n");  // I get to here . . . too soon!?!?   
    connection.query("UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: newQty
            },
            {
                item_id: desiredItem
            }
        ],
        function(err,res) {
            if (err) throw err;
            console.log("Quantity change successful \n");
            console.log("Your total price for this order is $" + totalOrder + "\n");
            askToContinue();
        })
}
// 
function start() {
    readInventoryItems();
}
    start();

