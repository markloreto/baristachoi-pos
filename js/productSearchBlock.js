$(document).ready(function() {

    productsDs.fetch(function(){
        $("#productlistView").kendoListView({
            dataSource: productsDs,
            autoBind: false,
            template: kendo.template($("#productTemplate").html()),
            dataBound: function() {
                setTimeout(function(){
                    $('.dimmer.productItem').dimmer({
                        on: 'hover'
                    })
                },100);
            }
        });

        $("#productListPager").kendoPager({
            dataSource: productsDs,
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
        autoBind: true,
        height:500,
        highlightFirst: true,
        template: kendo.template($("#productSearchTpl").html()),
        dataSource: productsDs,
        change: function(e) {
            var current = this.select();
            var data = this.dataItem(current);

            var item = {product_id: data.product_id, product_name: data.product_name, product_image: data.product_image, product_price: data.product_price, product_stock: data.product_stock, product_unit_name: data.product_unit_name};
            addToCart(item);
            setTimeout(function () {
                productsDs.filter({ field: "product_id", operator: "neq", value: 0 })
            },400)

        }
    });


});