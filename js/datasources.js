// Payments
var dataPayments = "data/payments.php?";

var paymentsModel = kendo.data.Model.define({
    id: "payment_id",
    fields: {
        payment_order_id: { type: "number" },
        payment_note: { type: "string" },
        payment_date: { type: "date", editable: false},
        payment_type: { type: "string", defaultValue: "Cash" },
        payment_amount: { type: "number", validation: {required: true, paymentamountvalidation: function (input) {
            if ((input.is("[name='payment_amount']") && input.val() == "0")) {
                input.attr("data-paymentamountvalidation-msg", "Please Enter Amount");
                return false
            }

            return true;
        }} }
    }
});

var paymentsBlank = new kendo.data.DataSource({
    data: [],
    schema: {
        model: paymentsModel
    },
    pageSize: 4,
    change: function(e) {
        //update date eveytime we add a new payments
        if(e.action == "add"){
            e.items[e.index].payment_date = new Date();
        }
    }
})

var paymentsDs = new kendo.data.DataSource({
    filter: [
        { field: "payment_order_id", operator: "eq", value: 233 }
    ],
    transport: {
        read:  {
            url: dataPayments + "type=read",
            dataType: "json",
            type: "post",
        },
        update: {
            url: dataPayments + "type=update",
            dataType: "json",
            type: "post",
        },
        destroy: {
            url: dataPayments + "type=destroy",
            dataType: "json",
            type: "post",
        },
        create: {
            url: dataPayments + "type=create",
            dataType: "json",
            type: "post",
        },
        parameterMap: function(data) {
            return kendo.stringify(data);
        }
    },
    error: function(e){
        console.log(e.status)
    },
    batch: true,
    pageSize: 4,
    sync: function(e) {

    },
    schema: {
        data: function(response) {
            return response.data; // twitter's response is { "results": [ /* results */ ] }
        },
        model: paymentsModel
    }
});

// Items
var dataItems = "data/items.php?"
var itemsDs = new kendo.data.DataSource({
    transport: {
        read:  {
            url: dataItems + "type=read",
            dataType: "json",
            type: "post",
        },
        update: {
            url: dataItems + "type=update",
            dataType: "json",
            type: "post",
        },
        destroy: {
            url: dataItems + "type=destroy",
            dataType: "json",
            type: "post",
        },
        create: {
            url: dataItems + "type=create",
            dataType: "json",
            type: "post",
        },
        parameterMap: function(data) {
            return kendo.stringify(data);
        }
    },
    error: function(e){
        console.log(e.status)
    },
    batch: true,
    pageSize: 20,
    sync: function(e) {

    },
    schema: {
        data: function(response) {
            return response.data; // twitter's response is { "results": [ /* results */ ] }
        },
        model: {
            id: "item_id",
            fields: {
                item_order_id: { type: "number" },
                item_product_id: { type: "number" },
                item_qty: { type: "number" },
            }
        }
    }
});

// Orders
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
        console.log(e.status)
    },
    batch: true,
    pageSize: 20,
    sync: function(e) {

    },
    schema: {
        data: function(response) {
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
                order_net: { type: "string"},
                order_cashier: { type: "number"},
            }
        }
    }
});

// Users Datasource
var dataUsers = "data/users.php?";
var userDs = new kendo.data.DataSource({
    batch: true,
    pageSize: 8,
    serverPaging: true,
    serverFiltering: true,
    transport: {
        read:  {
            url: dataUsers + "type=read",
            dataType: "json",
            type: "post"
        },
        update: {
            url: dataUsers + "type=update",
            dataType: "json",
            type: "post"
        },
        destroy: {
            url: dataUsers + "type=destroy",
            dataType: "json",
            type: "post"
        },
        create: {
            url: dataUsers + "type=create",
            dataType: "json",
            type: "post"
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
            fields: {
                user_name: { type: "string", validation: {required: true}},
                user_address: { type: "string", validation: {required: true}},
                user_contact: { type: "string", validation: {required: true}},
                user_group: { type: "number"},
                user_status: { type: "string"},
                user_date: { type: "date", validation: {required: true}},
                user_photo: { type: "string"},
                user_barangay: { type: "string", validation: {required: true}}
            }
        },
        total: function(response){
            return response.total;
        }
    }
});

// Groups Datasource
var dataGroups = "data/groups.php?";
var groupDs = new kendo.data.DataSource({
    batch: true,
    pageSize: 5,
    serverPaging: true,
    serverFiltering: true,
    transport: {
        read:  {
            url: dataGroups + "type=read",
            dataType: "json",
            type: "post"
        },
        update: {
            url: dataGroups + "type=update",
            dataType: "json",
            type: "post"
        },
        destroy: {
            url: dataGroups + "type=destroy",
            dataType: "json",
            type: "post"
        },
        create: {
            url: dataGroups + "type=create",
            dataType: "json",
            type: "post"
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
            id: "group_id",
            fields: {
                group_name: { type: "string", validation: {required: true}}
            }
        },
        total: function(response){
            return response.total;
        }
    }
});
groupDs.read();

// Product Categories Datasource
var dataProductCategories = "data/productCategories.php?";
var productCategoriesDs = new kendo.data.DataSource({
    batch: true,
    pageSize: 5,
    serverPaging: true,
    serverFiltering: true,
    transport: {
        read:  {
            url: dataProductCategories + "type=read",
            dataType: "json",
            type: "post"
        },
        update: {
            url: dataProductCategories + "type=update",
            dataType: "json",
            type: "post"
        },
        destroy: {
            url: dataProductCategories + "type=destroy",
            dataType: "json",
            type: "post"
        },
        create: {
            url: dataProductCategories + "type=create",
            dataType: "json",
            type: "post"
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
            id: "category_id",
            fields: {
                category_name: { type: "string", validation: {required: true}},
            }
        },
        total: function(response){
            return response.total;
        }
    }
});

productCategoriesDs.read();


// Products with filtering
var dataProducts = "data/products.php?";
var productsDs = new kendo.data.DataSource({
    pageSize: 12,
    serverFiltering: true,
    batch: true,
    transport: {
        read:  {
            url: dataProducts + "type=read",
            dataType: "json",
            type: "post"
        },
        update: {
            url: dataProducts + "type=update",
            dataType: "json",
            type: "post"
        },
        destroy: {
            url: dataProducts + "type=destroy",
            dataType: "json",
            type: "post"
        },
        create: {
            url: dataProducts + "type=create",
            dataType: "json",
            type: "post"
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
                product_name: {
                    type: "string"
                },
                product_description: {
                    type: "string"
                },
                product_image: {
                    type: "string"
                },
                product_price: {
                    type: "number"
                },
                product_cost: {
                    type: "number"
                },
                product_stock: {
                    type: "number"
                },
                product_category: {
                    type: "number"
                },
                product_rating: {
                    type: "number",
                    defaultValue: 0
                }
            }
        },
        total: function(response){
            return response.total;
        }
    }
});


var mediazDs = new kendo.data.DataSource({
    data: [],
    pageSize: 14
});