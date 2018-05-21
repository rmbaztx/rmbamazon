// table test
// just a file to try and print items in a table

var inquirer = require("inquirer");
var mysql=require("mysql");
// var table=require("table"); // or, try "easy-table?"
var Table = require("easy-table");
var data = [];

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
});

function readInventoryItems() {
    console.log("Selecting all items...\n");
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      console.log(res.id,res.length);
      for (var i = 0;i < res.length;i++) {
          console.log(res[i].item_id,res[i].product_name);
      }
    })
}
 
data = [
    ['0A', '0B', '0C'],
    ['1A', '1B', '1C'],
    ['2A', '2B', '2C']
];

var t = new Table
 
data.forEach(function(product) {
  t.cell('Product Id', product.id)
  t.cell('Description', product.desc)
  t.cell('Price, USD', product.price, Table.number(2))
  t.newRow()
})
 
console.log(t.toString())
