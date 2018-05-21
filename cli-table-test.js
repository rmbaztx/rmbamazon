// table test
// just a file to try and print items in a table

var inquirer = require("inquirer");
var mysql=require("mysql");
// var table=require("table"); // or, try "easy-table?"
var Table = require("cli-table");
// var data = [];

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
});

// instantiate
var table = new Table({
    head: ['ID', 'Product','Department_name','Price','Quantity']
  , colWidths: [20, 40, 40, 20, 20]
});

function readInventoryItems() {
    console.log("Selecting all items...\n");
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      // console.log(res.id,res.length);
      for (var i = 0;i < res.length;i++) {
          // console.log(res[i].item_id,res[i].product_name);
          table.push(
              [res[i].item_id.toString(),res[i].product_name,res[i].department_name,res[i].price.toString(),res[i].stock_quantity.toString()]
          )
      }
      console.log(table.toString());
    })
}
 



 
// table is an Array, so you can `push`, `unshift`, `splice` and friends
// table.push(
//     ['First', 'Second value', 'Third', 'Fourth','Fifth']
//   , ['First', 'Second value', 'Third', 'Fourth','Fifth']
// );
// console.log(table[0]);
function start() {
   readInventoryItems();  
}
start() ;
 
