var grandTotal = 0;
var orderTotal = 0;
var netTotal = 0;
var itemsTotal = 0;
var dateChanges = false;

function pay(payment_order_id, payment_date, payment_type, payment_amount){
    if(payment_amount > 0) {
        paymentsDs.add({
            payment_order_id: payment_order_id,
            payment_date: payment_date,
            payment_type: payment_type,
            payment_amount: payment_amount
        });
    }
}

function newTransaction(){
    // prevents paying more!
    var paymentInput = $("#paymentInput").data("kendoNumericTextBox");
    paymentInput.enable(true);
    $("#chkPay").removeClass("disabled");

    // disable closure of modal
    $('.ui.modal.payment i.close.icon').show()

    $("#coChange").parent().transition('remove looping');
    removeCartItems();

    var userSearch = $("#userSearch").data("kendoComboBox");
    userSearch.value("");
    $("#userDetails").html("")

    var orderDate = $("#orderDate").data("kendoDatePicker");
    orderDate.value(new Date(Date.now()));
    dateChanges = false;

    $("#delivery").prop( "checked", false)

    $("#notes").val("")

    $('#checkoutAccordion').accordion('open', 0);

    $('.ui.modal.payment').modal("hide")
}

function checkOut(amount){
    function paymentsDs_sync(order_id) {
        var amountEntered = (change > 0) ? amount - change : amount;
        pay(order_id, new Date(Date.now()), "Cash", amountEntered);

        paymentsDs.sync()
    }

    function itemsDs_sync(e) {
        var data = this.data()

        itemsDs.unbind("sync")
        itemsDs.bind("sync", paymentsDs_sync(data[data.length-1].order_id));
        $( "#cartItems .item" ).each(function( index ) {
            var qty = parseInt($(this).find("input").val());
            itemsDs.add({ item_order_id: data[data.length-1].order_id, item_product_id: cartItems[index].product_id, item_qty: qty});
        });

        itemsDs.sync()
    }

    // prevents paying more!
    var paymentInput = $("#paymentInput").data("kendoNumericTextBox");
    paymentInput.enable(false);
    $("#chkPay").addClass("disabled");

    // disable closure of modal
    $('.ui.modal.payment i.close.icon').hide()

    var orderDate = $("#orderDate").data("kendoDatePicker");
    var order_user = $("#userSearch").data("kendoComboBox");
    var delivery = ($("#delivery").prop( "checked" )) ? 1 : 0;
    var notes = $("#notes").val()

    // Change
    var change = parseFloat(amount) - grandTotal;

    // Order Status
    var order_status;
    if(change >= 0)
        order_status = "Paid"
    else if(change < 0 && delivery)
        order_status = "Pending";
    else
        order_status = "Balance";

    // order date
    if(dateChanges)
        var order_date = orderDate.value();

    else
        var order_date = new Date(Date.now());


    // table infos

    $("#coAmountPaid").html(kendo.toString(amount, "c"));
    $("#coAmountPaid").parent().transition('slide right');
    if(change > 0){
        setTimeout(function () {
            $("#coChange").parent().removeClass("animating tada");
            $("#coChange").html(kendo.toString(change, "c"));
            $("#coChange").parent().transition('slide right');
        },500);

        setTimeout(function () {
            $("#coChange").parent().transition('set looping').transition('tada', 1000)
        },2000)
    }

    var timerNext = (change > 0) ? 500 : 0;

    if(order_status == "Paid"){
        setTimeout(function () {
            $("#coOrderStatus").html("<i class='smile icon'></i> Paid");
            $("#coOrderStatus").parent().addClass("positive");
            $("#coOrderStatus").parent().transition('slide right');
        },500+timerNext)
    }

    if(order_status == "Pending"){
        setTimeout(function () {
            $("#coOrderStatus").html("<i class='meh icon'></i> Pending");
            $("#coOrderStatus").parent().addClass("warning");
            $("#coOrderStatus").parent().transition('slide right');
        },500+timerNext)
    }

    if(order_status == "Balance"){
        setTimeout(function () {
            $("#coOrderStatus").html("<i class='frown icon'></i> Balance");
            $("#coOrderStatus").parent().addClass("negative");
            $("#coOrderStatus").parent().transition('slide right');
        },500+timerNext)
    }

    setTimeout(function () {
        $("#afterChkBtn").transition({
            animation  : 'scale',
            duration   : 500,
            onComplete : function() {
                $("#newTransactionBtn").focus()
            }
        })
    },1000+timerNext)

    // End

    ordersDs.unbind("sync")
    ordersDs.bind("sync", itemsDs_sync);
    ordersDs.add({ order_total: orderTotal, order_date: order_date, order_user_id: order_user.value(), order_delivery: delivery, order_notes: notes, order_status: order_status,  order_net: netTotal, order_cashier: 1 });
    ordersDs.sync()

}

function clickCart(index){
    var listView = $("#productlistView").data("kendoListView");
    var theItem = listView.dataItems()
    addToCart(theItem[index])
}

function calcTotal(){
    var numItems = $("#cartItems .item").length
    var calcGrantTotal = 0;
    var calcNetTotal = 0;
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
            calcNetTotal += qty * (cartItems[index].product_cost)
        });
    }

    if(grandTotal != calcGrantTotal )
        $("#grandTotal").parents(".input").transition({
            animation  : 'jiggle',
            duration   : 300,
            queue      : false,
        })

    orderTotal = calcGrantTotal;
    netTotal = orderTotal - calcNetTotal;

    grandTotal = calcGrantTotal;
    $("#grandTotal").val(kendo.toString(calcGrantTotal, "c"))
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

        //enable quick pay button
        if($("#quickPay").hasClass("disabled"))
            $("#quickPay").removeClass("disabled")

        if(!$("#cartItems").find(".cartItemAttr").length){
            $("#cartItems").html("")
        }

        //add template item
        var cartItemTemplate = $("#cartItemTemplate").html()
        cartItemTemplate = cartItemTemplate.replace("[product_name]", item.product_name).replace(/\[product_price\]/gim, kendo.toString(item.product_price, "c")).replace("[product_unit_name]", item.product_unit_name)
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
            subTotal = kendo.toString(subTotal, "c")
            $(this).parents(".item").find(".subTotal").html(subTotal);

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
                duration   : 300,
                onStart    : function(){
                    dis.parents("#cartItems").find(".itemCloseButton").addClass("disabled")
                    $("#quickPay").addClass("disabled");
                },
                onComplete : function() {

                    cartItems.splice(index,1);
                    console.log(cartItems)

                    dis.parents("#cartItems").find(".itemCloseButton").removeClass("disabled")
                    dis.parents(".item").remove();

                    //calculate grand total
                    calcTotal();

                    if(cartItems.length == 0){
                        $("#cartItems").html('<div class="item" align="center">Cart is Empty </div>');
                        $("#quickPay").addClass("disabled");
                    }
                    else{
                        $("#quickPay").removeClass("disabled");
                    }

                }
            });

        })
    }
}

function removeCartItems(){
    $("#cartItems").html("");
    cartItems = [];
    calcTotal();

    $("#cartItems").html('<div class="item" align="center">Cart is Empty </div>');
    $("#quickPay").addClass("disabled");


    console.log(cartItems)
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

function moneyIt(money){
    return kendo.toString(money, "c")
}