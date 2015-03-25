function loadProducts(){
    if(productsListViewLoaded == false){
        productsListViewLoaded = true;

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
            edit: function(){
                if($(".prodProdImg").attr("src") == ""){
                    $(".prodProdImg").attr("src", "images/noimagemachine.png")
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
            },
            save: function () {
                $('.special.card.cardProductItem .image').dimmer({
                    on: 'hover'
                });
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

            }
        }).data("kendoListView");

        $("#productsToolbar").kendoToolBar({
            items: [
                { type: "button", text: "Create new product", id: "newProductButton" },
                { type: "button", text: "Toggle Button", togglable: true },
                {
                    type: "splitButton",
                    text: "Insert",
                    menuButtons: [
                        { text: "Insert above", icon: "insert-n" },
                        { text: "Insert between", icon: "insert-m" },
                        { text: "Insert below", icon: "insert-s" }
                    ]
                },
                { type: "separator" },
                { template: "<label>Format:</label>" },
                {
                    template: "<input id='dropdown' style='width: 150px;' />",
                    overflow: "never"
                },
                { type: "separator" },
                {
                    type: "buttonGroup",
                    buttons: [
                        { spriteCssClass: "k-tool-icon k-justifyLeft", text: "Left", togglable: true, group: "text-align" },
                        { spriteCssClass: "k-tool-icon k-justifyCenter", text: "Center", togglable: true, group: "text-align" },
                        { spriteCssClass: "k-tool-icon k-justifyRight", text: "Right", togglable: true, group: "text-align" }
                    ]
                },
                {
                    type: "buttonGroup",
                    buttons: [
                        { spriteCssClass: "k-tool-icon k-bold", text: "Bold", togglable: true, showText: "overflow" },
                        { spriteCssClass: "k-tool-icon k-italic", text: "Italic", togglable: true, showText: "overflow" },
                        { spriteCssClass: "k-tool-icon k-underline", text: "Underline", togglable: true, showText: "overflow" }
                    ]
                },
                {
                    type: "button",
                    text: "Action",
                    overflow: "always"
                },
                {
                    type: "button",
                    text: "Another Action",
                    overflow: "always"
                },
                {
                    type: "button",
                    text: "Something else here",
                    overflow: "always"
                }
            ]
        });

        $("#newProductButton").click(function (e) {
            productsView.add();
            e.preventDefault();
        })


    }
    else{
        productsDs.filter({ field: "product_id", operator: "neq", value: 0 })
    }
}


