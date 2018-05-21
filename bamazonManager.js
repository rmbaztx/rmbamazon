// in bamazonManager.js
    // * List a set of menu options:
        // * View Products for Sale
        // * View Low Inventory
        // * Add to Inventory
        // * Add New Product

var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require("cli-table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
});

function readInventoryItems() {
    var table = new Table({
    head: ['ID', 'Product','Department_name','Price','Quantity']
  , colWidths: [20, 40, 40, 20, 20]
});
console.log("Selecting all items...\n");
    connection.query("SELECT * FROM products", 
    function(err, res) {
      if (err) throw err;
      for (var i = 0;i < res.length;i++) {
          // console.log(res[i].item_id,res[i].product_name);
          table.push(
            [res[i].item_id.toString(),res[i].product_name,res[i].department_name,res[i].price.toString(),res[i].stock_quantity.toString()]
          )
      }
      console.log(table.toString());
      console.log("\n");
      getChoice();
    })
}

function readLowInventory() {
    var table = new Table({
        head: ['ID', 'Product','Department_name','Price','Quantity']
      , colWidths: [20, 40, 40, 20, 20]
    });
    console.log("\n");
    console.log("Displaying all items with a low stock level\n");
    connection.query("SELECT * FROM products WHERE stock_quantity < 5",
    function(err,res) {
        if (err) throw err;
    for (var k = 0;k < res.length;k++) {
        //console.log(res[k].item_id,res[k].product_name,res[k].stock_quantity);
        table.push(
            [res[k].item_id.toString(),res[k].product_name,res[k].department_name,res[k].price.toString(),res[k].stock_quantity.toString()]
          )
      }
      console.log(table.toString());
      console.log("Completed low inventory report\n");
       getChoice();
    })
    }
    // How do I wait until the above task is complete before I getChoice?
    // Moved it up to within the callback
    
function addToInventory() {
    var table = new Table({
        head: ['ID', 'Product','Department_name','Price','Quantity']
      , colWidths: [20, 40, 40, 20, 20]
    });
        console.log("Displaying all items...\n");
        connection.query("SELECT * FROM products", 
        function(err, res) {
          if (err) throw err;
          // console.log(res.id,res.length);
          for (var i = 0;i < res.length;i++) {
              //console.log(res[i].item_id,res[i].product_name,res[i].stock_quantity);
              table.push(
                [res[i].item_id.toString(),res[i].product_name,res[i].department_name,res[i].price.toString(),res[i].stock_quantity.toString()]
              )
          }
           console.log(table.toString());
        
          inquirer.prompt ([
            {
                type: "Input",
                name: "itemID",
                message: "Which item will have its inventory changed?"
            },
            {
                type: "Input",
                name: "newQty",
                message: "What is the new quantity?"
            },
            ]).then(function(choice) {
                connection.query("UPDATE products SET ? WHERE ?",
                [
                    {
                        stock_quantity: choice.newQty
                    },
                    {
                        item_id: choice.itemID
                    }
                ],
                function(err,res) {
                    if (err) throw err;
                // console.log(query.sql);
                console.log("Quantity was updated correctly.");
                getChoice();
        })
        //inquirer was here
    })
        })
    }
        //getChoice was here
    
function addProduct() {
    inquirer.prompt ([
        {
            type: "input",
            name: "prod_name",
            message: "Product Name? \n"
        },
        {
            type:"list",
            name: "department_name",
            message: "Choose department name \n",
            choices: ["Appliances","Automotive & Tools","Books","Household Supplies","Clothing, Men's"]
        },
        {
            type:"input",
            name:"price",
            message:"Price? \n"
        },
        {
            type:"input",
            name:"quantity",
            message:"Quantity? "
        },
    ]).then(function(add_prod) {
        connection.query("INSERT INTO products SET ?",
        {
          product_name: add_prod.prod_name,
          department_name: add_prod.department_name,
          price: add_prod.price,
          stock_quantity: add_prod.quantity
        },
            function(err,res) {
                if (err) throw err;
            // console.log(query.sql);
            console.log("Product added correctly!\n");
            getChoice();
        })
    })
}

function getChoice() {
    inquirer.prompt ([
        {
        type: "list",
        name: "desiredFunction",
        message: "What do you want to do?\n",
        choices: ["View products for sale","View low inventory items","Change stock_quantity for an item","Add new product","Quit\n"]
        },
    ]).then(function(response) {
        console.log(response.desiredFunction); 
        if(response.desiredFunction === "View products for sale") {
            readInventoryItems();
        }
        else if (response.desiredFunction === "View low inventory items") {
            readLowInventory();
        }
        else if (response.desiredFunction === "Change stock_quantity for an item") {
            addToInventory();
        }
        else if (response.desiredFunction === "Add new product") {
            console.log("\n");
            addProduct();
        }
        else {
            console.log("\n");
            console.log("Goodbye\n");
            (connection.end)(function(err) {
            // The connection is terminated now
          });
        }
})
}
function start() {
    getChoice();
}
start();