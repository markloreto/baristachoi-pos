// Settings Datasource
var dataSettings = "data/settings.php?";
var settingsDs = new kendo.data.DataSource({
    batch: true,
    pageSize: 50,
    serverFiltering: true,
    transport: {
        read:  {
            url: dataSettings + "type=read",
            dataType: "json",
            type: "post"
        },
        update: {
            url: dataSettings + "type=update",
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
            id: "setting_id",
            fields: {
                setting_name: { type: "string", validation: {required: true}},
                setting_value: { type: "string", validation: {required: true}}
            }
        },
        total: function(response){
            return response.total;
        }
    }
});

var settings = new Array()

settingsDs.read().then(function() {
    var view = settingsDs.view();

    $.each(view, function (i, v) {
        settings[v.setting_name] = v.setting_value;
    })

    settings["fullscreen"] = false
});


// Payments
var dataPayments = "data/payments.php?";

var paymentsModel = kendo.data.Model.define({
    id: "payment_id",
    fields: {
        payment_order_id: {type: "number"},
        payment_note: {type: "string"},
        payment_date: {type: "date", editable: false, defaultValue: new Date()},
        payment_type: {type: "string", defaultValue: "Cash"},
        payment_amount: {
            type: "number", validation: {required: true}
        }
    }
});

var paymentsBlank = new kendo.data.DataSource({
    schema: {
        model: paymentsModel
    },
    change: function(e) {
        //update date eveytime we add a new payments
        if(e.action == "add"){
            try{
                var data = this.data();
                if(!data[e.index].payment_id){
                    e.items[e.index].payment_id = 1000+data.length
                }
            }catch(e){}
        }
    }
})

var paymentsDs = new kendo.data.DataSource({
    /*filter: [
        { field: "payment_order_id", operator: "eq", value: 233 }
    ],*/
    sort: { field: "payment_id", dir: "desc" },
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
    pageSize: 220,
    serverSorting: true,
    sync: function(e) {

    },
    schema: {
        data: function(response) {
            return response.data; // twitter's response is { "results": [ /* results */ ] }
        },
        model: paymentsModel
    }
});

// Fees
var dataFees = "data/fees.php?";

var feesModel = kendo.data.Model.define({
    id: "fee_id",
    fields: {
        fee_order_id: { type: "number" },
        fee_name: { type: "string", validation: {required: true} },
        fee_amount: { type: "number", validation: {required: true, paymentamountvalidation: function (input) {
            if ((input.is("[name='fee_amount']") && input.val() == "0")) {
                input.attr("data-feeamountvalidation-msg", "Please Enter Amount");
                return false
            }

            return true;
        }} }
    }
});

var feesBlank = new kendo.data.DataSource({
    schema: {
        model: feesModel
    },
    change: function(e) {
        //update date eveytime we add a new payments
        if(e.action == "add"){
            try{
                var data = this.data();
                if(!data[e.index].fee_id){
                    e.items[e.index].fee_id = 1000+data.length
                }
            }catch(e){}
        }
    }
})

var feesDs = new kendo.data.DataSource({
    sort: { field: "fee_id", dir: "desc" },
    transport: {
        read:  {
            url: dataFees + "type=read",
            dataType: "json",
            type: "post",
        },
        update: {
            url: dataFees + "type=update",
            dataType: "json",
            type: "post",
        },
        destroy: {
            url: dataFees + "type=destroy",
            dataType: "json",
            type: "post",
        },
        create: {
            url: dataFees + "type=create",
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
    pageSize: 24,
    serverPaging: true,
    serverFiltering: true,
    serverSorting: true,
    sync: function(e) {

    },
    schema: {
        data: function(response) {
            return response.data; // twitter's response is { "results": [ /* results */ ] }
        },
        model: feesModel,
        total: function(response){
            return response.total;
        }
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
    filter: [
        { field: "order_date", operator: "eq", value: new Date(Date.now()) }
    ],
    sort: { field: "order_id", dir: "desc" },
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
    pageSize: 12,
    serverPaging: true,
    serverFiltering: true,
    serverSorting: true,
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
                order_delivery: { type: "number" },
                order_notes: { type: "string"},
                order_status: { type: "string"},
                order_net: { type: "number"},
                order_cashier: { type: "number"},
            }
        },
        total: function(response){
            return response.total;
        }
    }
});

// Users Datasource
var dataUsers = "data/users.php?";
var userDs = new kendo.data.DataSource({
    sort: { field: "user_id", dir: "desc" },
    batch: true,
    pageSize: 8,
    serverPaging: true,
    serverFiltering: true,
    serverSorting: true,
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
                user_barangay: { type: "string", validation: {required: true}},
                user_points: { type: "number", defaultValue: 0}
            }
        },
        total: function(response){
            return response.total;
        }
    },
    change: function(e) {
        try {
            if(e.action == "add") {
                e.items[e.index].user_group = 1
            }
        } catch (e) {}
    }
});

// Groups Datasource
var dataGroups = "data/groups.php?";
var groupDs = new kendo.data.DataSource({
    batch: true,
    pageSize: 24,
    /*serverPaging: true,
    serverFiltering: true,*/
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

// Admins Datasource
var dataAdmins = "data/admins.php?";
var adminsDs = new kendo.data.DataSource({
    batch: true,
    pageSize: 32,
    serverPaging: true,
    serverFiltering: true,
    serverSorting: true,
    transport: {
        read:  {
            url: dataAdmins + "type=read",
            dataType: "json",
            type: "post"
        },
        update: {
            url: dataAdmins + "type=update",
            dataType: "json",
            type: "post"
        },
        destroy: {
            url: dataAdmins + "type=destroy",
            dataType: "json",
            type: "post"
        },
        create: {
            url: dataAdmins + "type=create",
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
            id: "admin_id",
            fields: {
                admin_name: { type: "string", validation: {required: true}},
                admin_password: { type: "string", validation: {required: true}},
                admin_role: { type: "string", validation: {required: true}},
                admin_photo: { type: "string", defaultValue: "images/nophoto.jpg", validation: {required: true}}
            }
        },
        total: function(response){
            return response.total;
        }
    },
    change: function(e) {
        try {
            if(e.action == "add") {
                e.items[e.index].admin_role = "Cashier"
            }
        } catch (e) {}
    }
});
adminsDs.read();

// Warranties Datasource
var dataWarraties = "data/warranties.php?";
var warrantiesDs = new kendo.data.DataSource({
    sort: { field: "warranty_id", dir: "desc" },
    batch: true,
    pageSize: 12,
    serverPaging: true,
    serverFiltering: true,
    serverSorting: true,
    transport: {
        read:  {
            url: dataWarraties + "type=read",
            dataType: "json",
            type: "post"
        },
        update: {
            url: dataWarraties + "type=update",
            dataType: "json",
            type: "post"
        },
        destroy: {
            url: dataWarraties + "type=destroy",
            dataType: "json",
            type: "post"
        },
        create: {
            url: dataWarraties + "type=create",
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
            id: "warranty_id",
            fields: {
                warranty_serial: { type: "string", validation: {required: true}},
                warranty_user_id: { type: "number", validation: {required: true}},
                warranty_date_start: { type: "date", validation: {required: true}},
                warranty_latlong: { type: "string"},
                warranty_photo: { type: "string", defaultValue: "images/noimageproduct.jpg"},
                warranty_machine_type: { type: "string", validation: {required: true}},
                warranty_machine_location: { type: "string", validation: {required: true}},
                warranty_status: { type: "string", defaultValue: "Maintained", validation: {required: true}},
                warranty_maintenance_date: { type: "date", defaultValue: "", validation: {required: true}},
            }
        },
        total: function(response){
            return response.total;
        }
    },
    error: function(e){
        notification.show({
            subject: "Error!",
            message: "The Serial # was already registered",
            icon: "warning circle",
            color: "red"
        }, "message");

        setTimeout(function () {
            var grid = $("#warrantiesGrid").data("kendoGrid");
            grid.editRow($("#warrantiesGrid .k-grid-content table tbody tr:first"));
        },1000)
    },
    change: function(e) {
        //update date eveytime we add a new payments
        if(e.action == "add"){
            try{
                e.items[e.index].warranty_maintenance_date = addDays(new Date(), parseInt(settings["Warranty Maintenance"]));
            }catch(e){}
        }
    }
});

// Campaigns Datasource
var dataCampaigns = "data/campaigns.php?";
var campaignDs = new kendo.data.DataSource({
    sort: { field: "campaign_id", dir: "desc" },
    batch: true,
    pageSize: 5,
    serverPaging: true,
    serverFiltering: true,
    serverSorting: true,
    transport: {
        read:  {
            url: dataCampaigns + "type=read",
            dataType: "json",
            type: "post"
        },
        update: {
            url: dataCampaigns + "type=update",
            dataType: "json",
            type: "post"
        },
        destroy: {
            url: dataCampaigns + "type=destroy",
            dataType: "json",
            type: "post"
        },
        create: {
            url: dataCampaigns + "type=create",
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
            id: "campaign_id",
            fields: {
                campaign_subject: { type: "string", validation: {required: true}},
                campaign_start: { type: "date", validation: {required: true}},
                campaign_end: { type: "date", validation: {required: true}}
            }
        },
        total: function(response){
            return response.total;
        }
    }
});

var campaignUsersModel = kendo.data.Model.define({
    id: "campaign_user_id",
    fields: {
        campaign_user_foreign_id: { type: "number", validation: {required: true}},
        campaign_user_user_id: { type: "number", validation: {required: true}},
        campaign_user_join_date: { type: "date", validation: {required: true}}
    }
});

var dataCampaignUsers = "data/campaignUsers.php?";
var campaignUsersDs = new kendo.data.DataSource({
    sort: { field: "campaign_user_id", dir: "desc" },
    batch: true,
    serverFiltering: true,
    serverSorting: true,
    transport: {
        read:  {
            url: dataCampaignUsers + "type=read",
            dataType: "json",
            type: "post"
        },
        update: {
            url: dataCampaignUsers + "type=update",
            dataType: "json",
            type: "post"
        },
        destroy: {
            url: dataCampaignUsers + "type=destroy",
            dataType: "json",
            type: "post"
        },
        create: {
            url: dataCampaignUsers + "type=create",
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
        model: campaignUsersModel,
        total: function(response){
            return response.total;
        }
    }
});

// reminders Datasource
var dataReminders = "data/reminders.php?";
var remindersDs = new kendo.data.DataSource({
    sort: { field: "reminder_id", dir: "desc" },
    batch: true,
    pageSize: 5,
    serverPaging: true,
    serverFiltering: true,
    serverSorting: true,
    transport: {
        read:  {
            url: dataReminders + "type=read",
            dataType: "json",
            type: "post"
        },
        update: {
            url: dataReminders + "type=update",
            dataType: "json",
            type: "post"
        },
        destroy: {
            url: dataReminders + "type=destroy",
            dataType: "json",
            type: "post"
        },
        create: {
            url: dataReminders + "type=create",
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
            id: "reminder_id",
            fields: {
                reminder_for: { type: "number", validation: {required: true}},
                reminder_subject: { type: "string", validation: {required: true}},
                reminder_status: {type: "string", defaultValue: "Pending"},
                reminder_start: {type: "date", validation: {required: true}},
                reminder_end: {type: "date", defaultValue: ""}
            }
        },
        total: function(response){
            return response.total;
        }
    },
    change: function(e) {
        //update date eveytime we add a new payments
        if(e.action == "add"){
            try{
                var data = this.data();
                if(clientValueTmp != ""){
                    //e.items[e.index].reminder_for = clientValueTmp
                }
            }catch(e){}
        }
    }
});

// Product Categories Datasource
var dataProductCategories = "data/productCategories.php?";
var productCategoriesDs = new kendo.data.DataSource({
    batch: true,
    pageSize: 24,
    /*serverPaging: true,
    serverFiltering: true,*/
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
    sort: { field: "product_rating", dir: "desc" },
    pageSize: 12,
    serverFiltering: true,
    serverSorting: true,
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
                },
                product_points: {
                    type: "number",
                    defaultValue: 0
                },
                product_redeem_points: {
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

// Expenses Datasource
var dataExpenses = "data/expenses.php?";
var expensesDs = new kendo.data.DataSource({
    sort: { field: "expense_id", dir: "desc" },
    filter: [
        { field: "expense_date", operator: "eq", value: new Date(Date.now()) }
    ],
    batch: true,
    pageSize: 12,
    serverPaging: true,
    serverFiltering: true,
    serverSorting: true,
    transport: {
        read:  {
            url: dataExpenses + "type=read",
            dataType: "json",
            type: "post"
        },
        update: {
            url: dataExpenses + "type=update",
            dataType: "json",
            type: "post"
        },
        destroy: {
            url: dataExpenses + "type=destroy",
            dataType: "json",
            type: "post"
        },
        create: {
            url: dataExpenses + "type=create",
            dataType: "json",
            type: "post"
        },
        parameterMap: function(data) {
            return kendo.stringify(data);
        }
    },
    error: function(e){
        console.log(e.status)
    },
    sync: function(e){
        cashOnHand()
    },
    schema: {
        data: function(response) {
            return response.data; // twitter's response is { "results": [ /* results */ ] }
        },
        model: {
            id: "expense_id",
            fields: {
                expense_date: { type: "date"},
                expense_received_by: { type: "string", validation: {required: true}},
                expense_description: {type: "string", validation: {required: true}},
                expense_login_user: {type: "number", editable: false, defaultValue: 1},
                expense_amount: {type: "number", validation: {required: true}}
            }
        },
        total: function(response){
            return response.total;
        }
    },
    change: function(e) {
        //update date eveytime we add a new payments
        try{
            e.items[e.index].expense_login_user = loginId
        }catch(e){}
    }
});

// Logs Datasource
var dataLogs = "data/logs.php?";
var logsDs = new kendo.data.DataSource({
    sort: { field: "log_id", dir: "desc" },
    filter: [
        { field: "log_date", operator: "eq", value: new Date(Date.now()) }
    ],
    batch: true,
    pageSize: 12,
    serverPaging: true,
    serverFiltering: true,
    serverSorting: true,
    transport: {
        read:  {
            url: dataLogs + "type=read",
            dataType: "json",
            type: "post"
        },
        update: {
            url: dataLogs + "type=update",
            dataType: "json",
            type: "post"
        },
        destroy: {
            url: dataLogs + "type=destroy",
            dataType: "json",
            type: "post"
        },
        create: {
            url: dataLogs + "type=create",
            dataType: "json",
            type: "post"
        },
        parameterMap: function(data) {
            return kendo.stringify(data);
        }
    },
    error: function(e){
        console.log(e.status)
    },
    schema: {
        data: function(response) {
            return response.data; // twitter's response is { "results": [ /* results */ ] }
        },
        model: {
            id: "log_id",
            fields: {
                log_date: { type: "date", editable: false, defaultValue: new Date()},
                log_flag: { type: "string", defaultValue: "Unread", validation: {required: true}},
                log_message: {type: "string", validation: {required: true}},
                log_json: {type: "string", defaultValue: ""},
                log_type: {type: "string", validation: {required: true}}
            }
        },
        total: function(response){
            return response.total;
        }
    },
    change: function(e) {
        //update date eveytime we add a new payments
        if(e.action == "add"){
            try{
                var data = this.data();
                e.items[e.index].log_type = logType;
                e.items[e.index].log_json = JSON.stringify(logJson);
                e.items[e.index].log_date = new Date()

                logType = ""
                logJson = ""
            }catch(e){}
        }
    }
});


var mediazDs = new kendo.data.DataSource({
    data: [],
    pageSize: 14
});