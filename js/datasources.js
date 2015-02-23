var dataOrders = "data/orders.php?"
var ordersDs = new kendo.data.DataSource({
    transport: {
        read:  {
            url: dataOrders + "type=read",
            dataType: "json",
            type: "post",
        },
        update: {
            url: dataOrders + "type=update",
            dataType: "json",
            type: "post",
        },
        destroy: {
            url: dataOrders + "type=destroy",
            dataType: "json",
            type: "post",
        },
        create: {
            url: dataOrders + "type=create",
            dataType: "json",
            type: "post",
        },
        parameterMap: function(data) {
            return kendo.stringify(data);
        }
    },
    error: function(e){
        console.log(e)
    },
    batch: true,
    pageSize: 20,
    schema: {
        data: function(response) {
            console.log(response.data)
            return response.data; // twitter's response is { "results": [ /* results */ ] }
        },
        model: {
            id: "order_id",
            fields: {
                order_total: { type: "number" },
                order_date: { type: "date" },
                order_user_id: { type: "number" },
                order_delivery: { type: "boolean" },
                order_notes: { type: "string"},
                order_status: { type: "string"},
                order_method: { type: "string"},
                order_net: { type: "string"},
                order_cashier: { type: "number"},
            }
        }
    }
});

// Users Datasource
var userDs = new kendo.data.DataSource({
    pageSize: 6,
    serverFiltering: true,
    transport: {
        read: {
            url: "data/users.php",
            dataType: "json",
            type: "post",
        },
        parameterMap: function(data) {
            return kendo.stringify(data);
        }
    },
    schema: {
        data: function(response) {
            return response.data; // twitter's response is { "results": [ /* results */ ] }
        },
        model: {
            id: "user_id",
        }
    }
});


// Products with filtering
var productsDs = new kendo.data.DataSource({
    pageSize: 6,
    serverFiltering: true,
    transport: {
        read: {
            url: "data/products.php",
            dataType: "json",
            type: "post",
        },
        parameterMap: function(data) {
            return kendo.stringify(data);
        }
    },
    schema: {
        data: function(response) {
            return response.data;
        },
        model: {
            id: "product_id",
            fields: {
                product_id: {
                    type: "number",
                },
                product_price: {
                    type: "number",
                },
                product_stock: {
                    type: "number",
                },
            }
        }
    }
});

// Products without filtering
var productsDs2 = new kendo.data.DataSource({
    pageSize: 12,

    transport: {
        read: {
            url: "data/products.php",
            dataType: "json",
            type: "post",
        },
        parameterMap: function(data) {
            return kendo.stringify(data);
        }
    },
    schema: {
        data: function(response) {
            return response.data;
        },
        model: {
            id: "product_id",
            fields: {
                product_id: {
                    type: "number",
                },
                product_price: {
                    type: "number",
                },
                product_stock: {
                    type: "number",
                },
            }
        }
    }
});