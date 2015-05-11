function loadProducts(){
    if(productsListViewLoaded == false){
        productsListViewLoaded = true;

        clearProductFilters()

        var productsView = $("#productsListViewMain").kendoListView({
            dataSource: productsDs,
            template: kendo.template($("#productsTpl").html()),
            editTemplate: kendo.template($("#productsEditTpl").html()),
            dataBound: function() {
                $('.special.card.cardProductItem .image').dimmer({
                    on: 'hover'
                });

                $('.cardProductItem .ui.rating').rating("disable")

            },
            edit: function(e){

                productNameTmp = e.model.product_name
                productDescTmp = e.model.product_description
                productImageTmp = e.model.product_image
                productStockTmp = e.model.product_stock
                productUnitNameTmp = e.model.product_unit_name
                productPriceTmp = e.model.product_price
                productCostTmp = e.model.product_cost
                productCategoryTmp = e.model.product_category
                productRatingTmp = e.model.product_rating
                productPointsTmp = e.model.product_points
                productRedeemPointsTmp = e.model.product_redeem_points;

                if($(".prodProdImg").attr("src") == ""){
                    $(".prodProdImg").attr("src", "images/noimageproduct.jpg")
                }

                $('.cardProductItemEdit .ui.rating').rating({
                    onRate: function(value){
                        $(this).prev().val(value)
                        $(this).prev().change()
                    }
                })

                $('.special.card.cardProductItemEdit .image').dimmer({
                    on: 'hover'
                });

                $('.special.card.cardProductItemEdit .prodImageEdit').click(function () {
                    openMedia("Product Photos", "data/productPics.php", "products", $(this).parents(".cardProductItemEdit").find("input[name='product_image']"))
                })

                $('.special.card.cardProductItemEdit .dropdown').dropdown({
                    // you can use any ui transition
                    transition: 'drop'
                });

                $("input[name='product_category']").kendoDropDownList({
                    dataSource: productCategoriesDs,
                    valuePrimitive: true,
                    dataTextField: "category_name",
                    dataValueField: "category_id",
                });

                $("input[name='product_price'], input[name='product_cost']").kendoNumericTextBox({
                    format: "c",
                    decimals: 2,
                    spinners: false
                });

                $("input[name='product_points'], input[name='product_redeem_points']").kendoNumericTextBox({
                    decimals: 2,
                    spinners: false
                });
            },
            save: function (e) {
                $('.special.card.cardProductItem .image').dimmer({
                    on: 'hover'
                });

                if(e.model.id == "null"){
                    logsDs.add({log_type: "Added New Product", log_flag: "Unread", log_message: e.model.product_name, log_date: new Date(), log_json: ""})
                    logsDs.sync()
                }
                else{
                    var logMessage = ""
                    if(productNameTmp != e.model.product_name){logMessage += "Product Name " + "From: "+productNameTmp+" To: "+ e.model.product_name+"\n"}
                    if(productDescTmp != e.model.product_description){logMessage += "Product Description " + "From: "+productDescTmp+" To: "+ e.model.product_description+"\n"}
                    if(productImageTmp != e.model.product_image){logMessage += "Photo " + "From: "+productImageTmp+" To: "+ e.model.product_image+"\n"}
                    if(productStockTmp != e.model.product_stock){logMessage += "Stock " + "From: "+productStockTmp+" To: "+ e.model.product_stock+"\n"}
                    if(productUnitNameTmp != e.model.product_unit_name){logMessage += "Unit Name " + "From: "+productUnitNameTmp+" To: "+ e.model.product_unit_name+"\n"}
                    if(productPriceTmp != e.model.product_price){logMessage += "Price " + "From: "+productPriceTmp+" To: "+ e.model.product_price+"\n"}
                    if(productCostTmp != e.model.product_cost){logMessage += "Cost" + "Product Name " + "From: "+productCostTmp+" To: "+ e.model.product_cost+"\n"}
                    if(productCategoryTmp != e.model.product_category){logMessage += "Category " + "From: "+getCategoryName(productCategoryTmp)+" To: "+ getCategoryName(e.model.product_category)+"\n"}
                    if(productRatingTmp != e.model.product_rating){logMessage += "Product Rating " + "From: "+productRatingTmp+" To: "+ e.model.product_rating+"\n"}
                    if(productPointsTmp != e.model.product_points){logMessage += "Product Points " + "From: "+productPointsTmp+" To: "+ e.model.product_points+"\n"}
                    if(productRedeemPointsTmp != e.model.product_points) {logMessage += "Product Redeem Points " + "From: "+productRedeemPointsTmp+" To: "+ e.model.product_points+"\n"}

                    logsDs.add({log_type: "Updated Product", log_flag: "Unread", log_message: logMessage, log_date: new Date(), log_json: ""})
                    logsDs.sync()
                }

                productsDs.filter([])

            },
            cancel: function () {
                setTimeout(function () {
                    $('.special.card.cardProductItem .image').dimmer({
                        on: 'hover'
                    });

                    $('.cardProductItem .ui.rating').rating("disable")
                },500)

            },
            remove: function(e) {
                //handle event
                var r = confirm("Remove "+ e.model.product_name + "?");
                if (r != true) {
                    e.preventDefault();
                }
                else{
                    if(/*e.model.group_id == */1){
                        notification.show({
                            subject: "Sorry Buddy...",
                            message: "It's not possible to remove a product this time, we still need the information of this product for reporting purposes. But don't worry you may able to remove it on our next update",
                            icon: "warning sign",
                            color: "red"
                        }, "message");
                        e.preventDefault();
                        productsDs.read()
                    }
                }

            }
        }).data("kendoListView");

        $("#productsToolbar").kendoToolBar({
            items: [
                {
                    template: "<span><label>Select Category:</label><input id='productsCatFilter' style='width: 150px;' /></span>",
                    overflow: "never"
                },
                { type: "separator" },
                {
                    template: '<div class="ui action input small"><input type="text" placeholder="Search Product" id="productsNameFilter"> <div class="ui icon button" id="productsNameFilterDelete"> <i class="close icon"></i> </div> </div>',
                    overflow: "never"
                },
                { type: "separator" },
                { type: "button", text: "Clear Filters", click: function(){productsDs.filter([])}},
                {
                    type: "button",
                    text: "Create new product",
                    overflow: "always",
                    id: "newProductButton"


                }
            ]
        });

        function filterIt(){
            var category = $("#productsCatFilter").val();
            var name = $("#productsNameFilter").val();

            var catFilter = (category == "") ? { field: "product_category", operator: "neq", value: 0 } : { field: "product_category", operator: "eq", value: category };
            var nameFilter = (name == "") ? { field: "product_name", operator: "neq", value: "" } : { field: "product_name", operator: "contains", value: name };

            productsDs.filter([catFilter, nameFilter])
        }

        $("#newProductButton_overflow").click(function (e) {
            productsView.add();
            e.preventDefault();
        })

        $("#productsCatFilter").kendoDropDownList({
            dataSource: productCategoriesDs,
            valuePrimitive: true,
            dataTextField: "category_name",
            dataValueField: "category_id",
            optionLabel: "All",
            change: function(e) {
                filterIt()

                /*var value = this.value();
                if(value == "")
                    productsDs.filter( { field: "product_category", operator: "neq", value: 0 });
                else
                    productsDs.filter( { field: "product_category", operator: "eq", value: value });*/
            }
        });

        $("#productsNameFilter").keyup(function () {
            filterIt()
            /*var value = $(this).val();
            if(value == "")
                productsDs.filter( { field: "product_name", operator: "neq", value: "" });
            else
                productsDs.filter( { field: "product_name", operator: "contains", value: value });*/
        })

        $("#productsNameFilterDelete").click(function () {
            $("#productsNameFilter").val("").keyup()
            filterIt()
        })

        $("#productListPager2").kendoPager({
            dataSource: productsDs,
            pageSizes: [8, 16, 24, 100, 500]
        });


    }
    else{
        productsDs.filter({ field: "product_id", operator: "neq", value: 0 })
    }
}


