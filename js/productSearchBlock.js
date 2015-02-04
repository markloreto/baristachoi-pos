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
                return response.data; // twitter's response is { "results": [ /* results */ ] }
            }
        }
    });

    var productsDs2 = new kendo.data.DataSource({
        pageSize: 9,

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
            template: kendo.template($("#productTemplate").html())
        });
        setTimeout(function(){
            $('.dimmer').dimmer({
                on: 'hover'
            })
        },1000);

        $("#pager").kendoPager({
            dataSource: productsDs2,
            buttonCount: 2,
            pageSizes: [9, 12, 15, 18, 21, 24],
            info: false,
            messages: {
                itemsPerPage: "items"
            },
            change: function() {
                $('.dimmer').dimmer({
                    on: 'hover'
                })
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
        dataSource: productsDs
    });


});