$(document).ready(function() {
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
                return response.data; // twitter's response is { "results": [ /* results */ ] }
            }
        }
    });
    productsDs2.fetch(function(){
        $("#productlistView").kendoListView({
            dataSource: productsDs2,
            template: kendo.template($("#productTemplate").html()),
            dataBound: function() {
                setTimeout(function(){
                    $('.dimmer').dimmer({
                        on: 'hover'
                    })
                },100);
            }
        });

        $("#productListPager").kendoPager({
            dataSource: productsDs2,
            buttonCount: 3,
            pageSizes: [9, 12, 15, 18, 21, 24],
            info: false,
            messages: {
                itemsPerPage: "items"
            }
        });


    });

    $("#productSearch").css({width: "100%"}).kendoComboBox({
        placeholder: "Search for Product",
        dataTextField: "product_name",
        dataValueField: "product_id",
        filter: "contains",
        autoBind: false,
        height:500,
        template: kendo.template($("#productSearchTpl").html()),
        dataSource: productsDs,
        change: function(e) {
            var current = this.select();
            var data = this.dataItem(current);
            console.log(data)

            var item = {product_id: data.product_id, product_name: data.product_name, product_image: data.product_image, product_price: data.product_price, product_stock: data.product_stock, product_unit_name: data.product_unit_name};
            console.log(item);
            cartItems[cartItems.length] = item;
            console.log(cartItems);
        }
    });


});