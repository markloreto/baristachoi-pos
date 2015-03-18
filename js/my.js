var grandTotal = 0;
var orderTotal = 0;
var netTotal = 0;
var itemsTotal = 0;
var dateChanges = false;
var totalPayments = 0;

var photosJSON = "";
var mediazInput;

function calcTotalPayment(data){
    var totalPaid = 0
    $.each(data, function (i, v) {
        totalPaid = totalPaid + v.payment_amount
    })

    totalPayments = totalPaid;
    calcTotal()
}

function newTransaction(){
    // prevents paying more!
    var paymentInput = $("#paymentInput").data("kendoNumericTextBox");
    paymentInput.enable(true);
    $("#chkPay").removeClass("disabled");

    // disable closure of modal
    $('.ui.modal.payment i.close.icon').show()

    //if there are payments then remove it
    var paymentsNum = paymentsBlank.data().length
    if(paymentsNum){
        paymentsBlank.fetch(function() {
            for (i = 0; i < paymentsNum; i++) {
                paymentsBlank.remove(paymentsBlank.at(0));
            }
        })
    }


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

function pay(payment_order_id, payment_date, payment_type, payment_amount, payment_note){
    if(payment_amount > 0) {
        paymentsDs.add({
            payment_order_id: payment_order_id,
            payment_date: payment_date,
            payment_type: payment_type,
            payment_amount: payment_amount,
            payment_note: payment_note
        });
    }
}

function checkOut(amount){
    function paymentsDs_sync(order_id) {
        var amountEntered = (change > 0) ? amount - change : amount;
        pay(order_id, new Date(Date.now()), "Cash", amountEntered);

        var data = $("#paymentsGrid").data("kendoGrid").dataSource.data();
        $.each(data, function (i, v) {
            pay(order_id, v.payment_date, v.payment_type, v.payment_amount);
        })


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
    if(cartItems.length){
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

    // with payments code
    if(totalPayments > 0){
        calcGrantTotal = calcGrantTotal - totalPayments;
        $("#totalPayments").show()
        $("#totalPayments input").val("-" + kendo.toString(totalPayments, "c"))
    }
    else{
        $("#totalPayments").hide()
    }

    grandTotal = calcGrantTotal;

    // do not accept if negative or overpaid
    if(grandTotal < 0 ){
        $("#quickPay").addClass("disabled");
        $("#grandTotal").addClass("reds");
    }
    else{
        $("#quickPay").removeClass("disabled");
        $("#grandTotal").removeClass("reds");
    }


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


}

function randomIntegerBetween(minValue,maxValue){
    return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
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

function profilePhoto(img){
    if(img == "")
        img = "images/nophoto.jpg";

    return "<img src='"+img+"' />";
}



/* Media Code*/
function openMedia(title, jsonLink, dir, ppInput){
    $("#media-title").html(title);
    var data = $("#mediazFiles").data("kendoUpload")
    saveUrl = data.options.async.saveUrl;
    theDir = saveUrl.slice(0, saveUrl.lastIndexOf("dir=")+4) + dir
    data.options.async.saveUrl = theDir;
    photosJSON = jsonLink;
    mediazInput = ppInput;
    $.getJSON(jsonLink, function (entry) {
        mediazDs.fetch(function () {
            mediazDs.data(entry);

            $('.profile-photo2 img').popup();
        })
    });

}

function removeImage(j){
    j.next().popup("destroy")
    var img = j.next().attr("src");
    j.parent().parent().transition({
        animation  : 'scale',
        duration   : '1s',
        onComplete : function() {
            $.post("data/uploadImages.php?type=remove&filename="+img, function () {
                $.getJSON(photosJSON, function (entry) {
                    mediazDs.fetch(function () {
                        mediazDs.data(entry);
                        $('.profile-photo2 img').popup();
                    })
                });
            });
        }
    })

}

function selectedImage(j){
    setTimeout(function () {
        mediazInput.val(j.attr("src"))
        mediazInput.change()
    },500)


    mediazInput.parent().find("img").attr("src", j.attr("src"));
    $(".ui.modal.mediaz").modal('hide');
}

function groupsDropDownEditor(container, options) {
    $('<input required data-text-field="group_name" data-value-field="group_id" data-bind="value:' + options.field + '"/>')
        .appendTo(container)
        .kendoDropDownList({ autoBind: false, dataSource: groupDs
        });
}

function getGroupName(user_group){
    if(user_group === 0)
        return "";
    else{
        try{return groupDs.get(user_group).group_name} catch(e){return {group_name: "default", group_id: 1}}
    }

}



$(document).ready(function () {

    $('.ui.modal.groups').modal('hide dimmer').modal({
        closable: false,
        onShow: function () {

        },
        onHide: function(){

        }
    });

    $("#mediazListView").kendoListView({
        dataSource: mediazDs,
        template: kendo.template($("#mediazTpl").html())
    });

    $("#mediazPager").kendoPager({
        dataSource: mediazDs,
        change: function() {
            $('.profile-photo2 img').popup();
        }
    });

    $("#mediazFiles").kendoUpload({
        async: {
            saveUrl: "data/uploadImages.php?type=save&dir=weee",
            /*removeUrl: "remove",*/
            autoUpload: true
        },
        localization: {
            select: "Upload Profile Photos"
        },
        upload: function(e){
            var files = e.files;
            var file;
            // Check the extension of each file and abort the upload if it is not .jpg
            $.each(files, function (index) {
                if ($.inArray(this.extension.toLowerCase(), [".jpg", ".jpeg", ".png", ".gif"]) === -1) {
                    alert("Only jpg, jpeg, png and gif files can be uploaded")
                    e.preventDefault();
                }
            });
        },
        success: function(){
            $.getJSON(photosJSON, function (entry) {
                mediazDs.fetch(function () {
                    mediazDs.data(entry);

                    var pager = $("#mediazPager").data("kendoPager");
                    pager.page(1);

                    $('.profile-photo2 img').popup();
                })
            });

            $("#mediazFiles").parent().parent().next().find("li").delay(5000).fadeOut("slow", function(){
                $(this).remove()
            })
        }
    });

    $('.ui.modal.mediaz').modal('hide dimmer').modal({
        closable: false,
        onShow: function () {

        },
        onHide: function(){
            $(".k-overlay").transition('scale')
            $(".k-overlay").next().transition('scale')
        }
    });
})
