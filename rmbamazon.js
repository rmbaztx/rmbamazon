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




