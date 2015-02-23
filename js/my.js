var grandTotal = 0;
var itemsTotal = 0;

//ordersDs.add({ order_total: 170, order_date: "2/24/2015", order_user_id: 1, order_delivery: 0, order_notes: "", order_status: "Paid", order_method: "CASH", order_net: 15, order_cashier: 1 });
//ordersDs.sync()

function clickCart(index){
    var listView = $("#productlistView").data("kendoListView");
    var theItem = listView.dataItems()
    addToCart(theItem[index])
}

function calcTotal(){
    var numItems = $("#cartItems .item").length
    var calcGrantTotal = 0;
    itemsTotal = numItems;

    //number of items
    if(numItems > 1){
        $("#cartNumItems").html('<a class="ui black circular label mini">'+numItems+'</a> cart items');
    }
    else{
        $("#cartNumItems").html('<a class="ui black circular label mini">'+numItems+'</a> cart item');
    }

    //calculate Grand Total
    if(numItems){
        $( "#cartItems .item" ).each(function( index ) {
            var qty = parseInt($(this).find("input").val());
            calcGrantTotal += qty * (cartItems[index].product_price)
        });
    }

    if(grandTotal != calcGrantTotal )
        $("#grandTotal").parents(".input").transition({
            animation  : 'jiggle',
            duration   : 500,
            queue      : true,
        })

    grandTotal = calcGrantTotal
    $("#grandTotal").val("₱"+calcGrantTotal.toFixed(2))
}

function addToCart(item){
    var update = false;
    var curVal = 1;
    var combobox = $("#productSearch").data("kendoComboBox");

    $.each(cartItems, function( index, value ) {
        if(value.product_id == item.product_id){
            update = true;
            $("#cartItems .item:eq("+index+")").transition('pulse')
            curVal = parseInt($("#cartItems .item:eq("+index+")").find("input").val())
            $("#cartItems .item:eq("+index+")").find("input").val(curVal+1)
            $("#cartItems .item:eq("+index+")").find("input").keyup()
            combobox.value("");

            //calculate grand total
            calcTotal();
        }
    });

    if(!update){


        cartItems[cartItems.length] = item;

        if(!$("#cartItems").find(".cartItemAttr").length){
            $("#cartItems").html("")
        }

        //add template item
        var cartItemTemplate = $("#cartItemTemplate").html()
        cartItemTemplate = cartItemTemplate.replace("[product_name]", item.product_name).replace(/\[product_price\]/gim, item.product_price.toFixed(2)).replace("[product_unit_name]", item.product_unit_name)
        $("#cartItems").append(cartItemTemplate);

        //calculate grand total
        calcTotal();

        //clear product search value
        combobox.value("");

        var latestItem = $("#cartItems").find("div.item:last")
        latestItem.transition('pulse')
        var latestItemQty = latestItem.find("input");
        var latestX = latestItem.find(".itemCloseButton")

        latestItemQty.keydown(function(event) {
            // Prevent shift key since its not needed
            if (event.shiftKey == true) {
                event.preventDefault();
            }
            // Allow Only: keyboard 0-9, numpad 0-9, backspace, tab, left arrow, right arrow, delete
            if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105) || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 46) {

            } else {
                // Prevent the rest
                if(event.keyCode != 13)
                    $(this).parents(".input").transition('shake')
                event.preventDefault();
            }
        }).keyup(function(e){
            var index = $(this).parents(".item").index()
            var combobox = $("#productSearch").data("kendoComboBox");


            if($(this).val() == "")
                $(this).val(1)

            var subTotal = parseInt($(this).val()) * cartItems[index].product_price
            subTotal = subTotal.toFixed(2)
            $(this).parents(".item").find(".subTotal").html("₱"+subTotal);

            //calculate grand total
            calcTotal();

            if(e.keyCode == 13)
            {
                combobox.focus();
            }
        });

        latestItemQty.on('focus', function (e) {
            $(this).one('mouseup', function () {
                $(this).select();
                return false;
            }).select();
        });

        setTimeout(function(){
            latestItemQty.focus()
        },200)


        //remove cart item
        latestX.click(function(){
            var index = $(this).parents(".item").index()
            var dis = $(this)

            $(this).parents(".item").transition({
                animation  : 'scale',
                duration   : 500,
                onStart    : function(){
                    dis.parents("#cartItems").find(".itemCloseButton").addClass("disabled")
                },
                onComplete : function() {

                    cartItems.splice(index,1);
                    console.log(cartItems)

                    dis.parents("#cartItems").find(".itemCloseButton").removeClass("disabled")
                    dis.parents(".item").remove();

                    //calculate grand total
                    calcTotal();

                    if(cartItems.length == 0){
                        $("#cartItems").html('<div class="item" align="center">Cart is Empty </div>')
                    }

                }
            });

        })
    }
}

function add_S(str, num){
    if(num > 1)
        return str+"s";
    else
        return str
}

function colorLevel(num){
    if(num == 0)
        return "red";
    else
        return "green"
}

function addEllipses(txt, limit){
    if(txt.length > limit){
        txt = txt.slice(0,15);
        txt = txt + "...";
        return txt;
    }
    else{
        return txt;
    }
}