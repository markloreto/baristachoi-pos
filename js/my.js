var grandTotal = 0;
var orderTotal = 0;
var netTotal = 0;
var itemsTotal = 0;
var dateChanges = false;
var totalPayments = 0;
var totalFees = 0;
var notification;
var orderId = "";
var logType = "";
var logJson = ""

var loginId = ""
var username = ""
var password = ""

var photosJSON = "";
var mediazInput;
var minusPoints = 0;

function totalOrders(){
    $.get("data/ordersStatistic.php", function (result) {
        $("#totalOrders").html(result["Total Orders"])
    }, "json")
}

function cashOnHand(){
    $.get("data/cashOnHand.php", function (result) {
        $("#cashOnHand").val(moneyIt(result["Cash On Hand"]))
        $(".coh").html(moneyIt(result["Cash On Hand"]))
        $("#coh").transition('set looping').transition('flash', '2000ms');
        setTimeout(function () {
            $("#coh").transition('remove looping')
        },5000)
    }, "json")
}

function totalClientThisMonth(){
    $.get("data/clientStatistic.php", function (result) {
        $("#totalClients").html(result["Total Clients"])
    }, "json")
}

function calcTotalPayment(data){
    var totalPaid = 0
    $.each(data, function (i, v) {
        totalPaid = totalPaid + v.payment_amount
    })

    totalPayments = totalPaid;
    calcTotal()
}

function calcTotalFees(data){
    var totalCharge = 0

    //Receipt
    $("#totalFees, #receiptFoot").html("")
    //

    $.each(data, function (i, v) {
        totalCharge = totalCharge + v.fee_amount;

        //Receipt
        $("#receiptFoot").append('<tr><th></th><th style="color: rgba(0,0,0,1) !important;">' + v.fee_name + '</th><th style="color: rgba(0,0,0,1) !important;">' + v.fee_amount + '</th></tr>')

        $("#totalFees").append('<div class="ui labeled input mini right fr"><div class="ui label">'+ v.fee_name +': </div><input type="text" placeholder="" value="'+ kendo.toString(v.fee_amount, "c") +'" readonly style="color: red"> </div>')
    })

    totalFees = totalCharge;
    calcTotal()
}

function newTransaction(){
    // prevents paying more!
    orderId = "";
    minusPoints = 0;
    ordersDs.filter({field: "order_date", operator: "eq", value: new Date()})
    clientNameTmp = "";
    clientValueTmp = "";
    clientGroup = "";

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

    //if there are fees then remove it
    var feesNum = feesBlank.data().length
    if(feesNum){
        feesBlank.fetch(function() {
            for (i = 0; i < feesNum; i++) {
                feesBlank.remove(feesBlank.at(0));
            }
        })
    }


    $("#coChange").parent().transition('remove looping');
    removeCartItems();

    var userSearch = $("#userSearch").data("kendoComboBox");
    userSearch.value("");
    orAddNewClient()
    userDs.filter([]);

    var orderDate = $("#orderDate").data("kendoDatePicker");
    orderDate.value(new Date(Date.now()));
    dateChanges = false;

    $("#deliveryChb").checkbox( "uncheck")

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

function addFees(fee_order_id, fee_name, fee_amount){
    if(fee_amount > 0) {
        feesDs.add({
            fee_order_id: fee_order_id,
            fee_name: fee_name,
            fee_amount: fee_amount
        });
    }
}

function checkOut(amount){
    function paymentsDs_sync(order_id) {
        if(orderId != ""){
            logType = "Order Changes";
            var grid = $("#logsGrid").data("kendoGrid");
            grid.addRow();
        }

        var amountEntered = (change > 0) ? amount - change : amount;
        pay(order_id, new Date(Date.now()), "Cash", amountEntered, "");

        //payments
        var data = $("#paymentsGrid").data("kendoGrid").dataSource.data();
        $.each(data, function (i, v) {
            pay(order_id, v.payment_date, v.payment_type, v.payment_amount, v.payment_note);
        })

        //fees
        var dataFees = $("#feesGrid").data("kendoGrid").dataSource.data();
        $.each(dataFees, function (i, v) {
            addFees(order_id, v.fee_name, v.fee_amount);
        })

        feesDs.sync()
        paymentsDs.sync();
        setTimeout(function () {
            cashOnHand()
            totalOrders()
            cashSound.play()
        },1500)
    }

    function itemsDs_sync(e) {
        var data = this.data()

        itemsDs.unbind("sync")
        itemsDs.bind("sync", paymentsDs_sync(data[data.length - 1].order_id));

        // Receipt
        $(".receiptNumber").html(data[data.length - 1].order_id)
        $("#receiptBody").html("")
        //

        var qty;
        var sub;
        var pointsAcquired = 0

        $("#cartItems .item .cartItemAttr").each(function( index ) {
            qty = parseInt($(this).find("input").val());

            // Receipt
            sub = qty * cartItems[index].product_price;
            $("#receiptBody").append('<tr><td class="right aligned"><div class="borderBottom">' + qty + 'x</div><div>@ ' + cartItems[index].product_price + '</div></td><td>' + cartItems[index].product_name + '</td><td>' + sub + '</td></tr>')
            //

            pointsAcquired += qty * cartItems[index].product_points

            itemsDs.add({ item_order_id: data[data.length - 1].order_id, item_product_id: cartItems[index].product_id, item_qty: qty});
        });

        pointsAcquired = pointsAcquired - minusPoints;

        var pointsGroup = settings["Points Group"];
        var pointsArray = new Array();
        pointsArray = pointsGroup.split(",");
        $.each(pointsArray, function (i, v) {
            if(parseInt(clientGroup) == parseInt(v) && pointsAcquired > 0){
                $.post("data/addPoints.php", {points: pointsAcquired, uid: clientValueTmp}, function () {
                    notification.show({
                        subject: "Points Acquired!",
                        message: "Total of " + pointsAcquired + " " + add_S("Point", pointsAcquired) + " Acquired",
                        icon: "star",
                        color: "green"
                    }, "message");

                    $(".receiptPoints").html(parseFloat($(".currentUserPoints").html()) + pointsAcquired)

                    try{
                        userDs.filter([])
                    }catch(e){}
                })
            }

            if(parseInt(clientGroup) == parseInt(v) && pointsAcquired < 0){
                $.post("data/addPoints.php", {points: pointsAcquired, uid: clientValueTmp}, function () {
                    notification.show({
                        subject: "Points Deducted!",
                        message: "Total of " + pointsAcquired + " " + add_S("Point", pointsAcquired) + " Deducted",
                        icon: "star",
                        color: "red"
                    }, "message");

                    $(".receiptPoints").html(parseFloat($(".currentUserPoints").html()) + pointsAcquired)

                    try{
                        userDs.filter([])
                    }catch(e){}
                })
            }
        })

        itemsDs.sync()
    }

    // prevents paying more!
    var paymentInput = $("#paymentInput").data("kendoNumericTextBox");
    paymentInput.enable(false);
    $("#chkPay").addClass("disabled");

    // disable closure of modal
    $('.ui.modal.payment i.close.icon').hide()

    var orderDate = $("#orderDate").data("kendoDatePicker");
    var delivery = ($("#deliveryChb").checkbox( "is checked" )) ? 1 : 0;
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

    var pOrderStatus;
    if(order_status == "Paid"){
        pOrderStatus = "<i class='smile icon'></i> Paid"
        setTimeout(function () {
            $("#coOrderStatus").html(pOrderStatus);
            $("#coOrderStatus").parent().addClass("positive");
            $("#coOrderStatus").parent().transition('slide right');
        },500+timerNext)
    }

    if(order_status == "Pending"){
        pOrderStatus = "<i class='meh icon'></i> Pending"
        setTimeout(function () {
            $("#coOrderStatus").html(pOrderStatus);
            $("#coOrderStatus").parent().addClass("warning");
            $("#coOrderStatus").parent().transition('slide right');
        },500+timerNext)
    }

    if(order_status == "Balance"){
        pOrderStatus = "<i class='frown icon'></i> Balance"
        setTimeout(function () {
            $("#coOrderStatus").html(pOrderStatus);
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
    if(orderId == "") {
        ordersDs.unbind("sync")
        ordersDs.bind("sync", itemsDs_sync);
        ordersDs.add({
            order_total: orderTotal,
            order_date: order_date,
            order_user_id: clientValueTmp,
            order_delivery: delivery,
            order_notes: notes,
            order_status: order_status,
            order_net: netTotal,
            order_cashier: loginId
        });
        ordersDs.sync();
    }
    else{
        $.post("data/removeOrder.php",{orderId: orderId}, function () {
            ordersDs.filter({field:"order_id", operator: "eq", value: orderId})
            ordersDs.fetch(function () {
                var dataItem = ordersDs.get(orderId);
                dataItem.set("order_total", orderTotal)
                dataItem.set("order_date", orderDate.value())
                dataItem.set("order_user_id", clientValueTmp)
                dataItem.set("order_delivery", delivery)
                dataItem.set("order_notes", notes)
                dataItem.set("order_status", order_status)
                dataItem.set("order_net", netTotal)
                dataItem.set("order_cashier", loginId)

                ordersDs.unbind("sync")
                ordersDs.bind("sync", itemsDs_sync);
                ordersDs.sync()
            })

        })

    }




    // Receipt
    $(".receiptName").html(clientNameTmp)
    $(".receiptStatus").html(pOrderStatus)
    $(".receiptDate").html(kendo.toString(order_date, "D"))
    $(".receiptPoints").html($(".currentUserPoints").html())
    $(".receiptGrandTotal").html(grandTotal)
    $(".receiptAmountPaid").html(parseFloat(amount))

    if(totalPayments > 0){
        $(".receiptPayments").html(totalPayments)
        $(".receiptPayments").parent().parent().show()
    }
    else{
        $(".receiptPayments").parent().parent().hide()
    }

    if(change <= 0){
        $(".receiptChange").parent().parent().hide();
    }
    else{
        $(".receiptChange").parent().parent().show()
        $(".receiptChange").html(change)
    }

    if(notes != ""){
        $(".receiptNote").parent().show()
        $(".receiptNote").html(notes)
    }
    else{
        $(".receiptNote").parent().hide()
    }


}

function clickCart(index){
    var listView = $("#productlistView").data("kendoListView");
    var theItem = listView.dataItems()
    addToCart(theItem[index])
}

function calcTotal(){
    var numItems = $("#cartItems .item .cartItemAttr").length
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
            duration   : 500,
            queue      : false,
        })

    orderTotal = calcGrantTotal;
    netTotal = orderTotal - calcNetTotal;

    // with Fees code
    if(totalFees > 0){
        calcGrantTotal = calcGrantTotal + totalFees;
        $("#totalFees").show()
    }
    else{
        $("#totalPayments").hide()
    }

    // with payments code
    if(totalPayments > 0){
        calcGrantTotal = calcGrantTotal - totalPayments;
        $("#totalPayments").show()
        $("#totalPayments input").val(kendo.toString(totalPayments, "c"))
    }
    else{
        $("#totalPayments").hide()
    }

    grandTotal = calcGrantTotal;

    // do not accept if negative or overpaid
    if(grandTotal < 0 ){
        $("#quickPay").addClass("disabled");
        $("#grandTotal").addClass("greens");
    }
    else{
        $("#quickPay").removeClass("disabled");
        $("#grandTotal").removeClass("greens");
    }


    $("#grandTotal").val(kendo.toString(calcGrantTotal, "c"))
}

function addToCart(item){
    itemSound.pause()
    itemSound.currentTime = 0;
    itemSound.play()
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
        cartItemTemplate = cartItemTemplate.replace("[product_name]", item.product_name).replace(/\[product_price\]/gim, kendo.toString(parseFloat(item.product_price), "c")).replace("[product_unit_name]", item.product_unit_name)
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
    if(num <= 0)
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
    $(".ui.modal.mediaz").modal('show');
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
    //weee
    var r = confirm("Are you sure you want to remove this photo?");
    if (r == true) {
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

}

function selectedImage(j){
    setTimeout(function () {
        mediazInput.val(j.attr("src"))
        mediazInput.change()
    },500)


    mediazInput.parent().find("img").attr("src", j.attr("src"));
    $(".ui.modal.mediaz").modal('hide');
}

function isDelivery(order_delivery){
    if(order_delivery){
        return "Yes"
    }
    else{
        return "No"
    }
}

function groupsDropDownEditor(container, options) {
    $('<input required data-text-field="group_name" data-value-field="group_id" data-bind="value:' + options.field + '"/>').appendTo(container).kendoDropDownList({
        autoBind: true,
        dataSource: groupDs,
        dataTextField: "group_name",
        dataValueField: "group_id",
        valuePrimitive: true
    });
}

function reminderForEditor(container, options) {
    var input = $('<input data-text-field="user_name" data-value-field="user_id" name="reminder_for" width="100" data-bind="value:' + options.field + '" />')//.appendTo(container)

    input.attr("name", options.field);

    input.appendTo(container);

    input.kendoComboBox({
        placeholder: "Search for Clients",
        dataTextField: "user_name",
        dataValueField: "user_id",
        width: 250,
        filter: "contains",
        autoBind: true,
        height:500,
        dataSource: userDs
    });

    var combobox = input.data("kendoComboBox");

    userDs.fetch(function () {
        try{combobox.text(options.model.Attendees[0][0])}catch(e){combobox.text("")}
    })
}

function warratyUserEditor(container, options) {
    var att = options.model.Attendees;
    var input = $('<input data-text-field="user_name" data-value-field="user_id" name="warranty_user_id" width="100" data-bind="value:' + options.field + '" />')//.appendTo(container)

    input.attr("name", options.field);

    input.appendTo(container);

    input.kendoComboBox({
        placeholder: "Search for Clients",
        dataTextField: "user_name",
        dataValueField: "user_id",
        width: 250,
        filter: "contains",
        autoBind: true,
        height:500,
        dataSource: userDs
    });

    var combobox = input.data("kendoComboBox");

    setTimeout(function () {
        try{
            combobox.text(options.model.Attendees[0][0])

        }catch(e){combobox.text("")}
    },200)

}

function modifyUser(user_id){

    userDs.filter({ field: "user_id", operator: "eq", value: user_id })
    //$(".theClients").click()
    userDs.fetch(function () {
        try{
            var grid = $("#clientsGrid").data("kendoGrid");
            grid.editRow($("#clientsGrid .k-grid-content table tbody tr:first"));
        }catch(e){
            loadClients()
            var grid = $("#clientsGrid").data("kendoGrid");
            grid.editRow($("#clientsGrid .k-grid-content table tbody tr:first"));
        }

    })

}

function openReminderFor(user_id){
    remindersDs.filter([{ field: "reminder_for", operator: "eq", value: user_id }, {field: "reminder_status", operator: "eq", value: "Pending"}])
    loadClientReminder()
    $('#clientReminderModal').modal("show")
}

function openReminderItem(reminder_id){
    remindersDs.filter({ field: "reminder_id", operator: "eq", value: reminder_id })
    loadClientReminder()
    $('#clientReminderModal').modal("show")
}

function viewUser(user_id){
    userDs.filter({ field: "user_id", operator: "eq", value: user_id })
    $(".theClients").click()
}

function viewOrder(order_id){
    ordersDs.filter({ field: "order_id", operator: "eq", value: order_id })
    loadOrdersPage()
    $('#ordersModal').modal("show")
}

function getGroupName(user_group){
    if(user_group === 0)
        return "";
    else{
        try{return groupDs.get(user_group).group_name} catch(e){return {group_name: "default", group_id: 1}}
    }
}

function getCategoryName(category_id){
    return productCategoriesDs.get(category_id).category_name
}

function getAdminName(admin_id){
    if(admin_id === 0)
        return "";
    else{
        try{return adminsDs.get(admin_id).admin_name} catch(e){return {admin_name: "Admin", admin_id: 1}}
    }
}

function getAttendees(data, index){
    //console.log(data)
    if(data.Attendees)
        return data.Attendees[0][index]
    else
        return "";

}

function brgyEditor(container, options) {
    // create an input element
    var input = $('<div class="ui category search focus" id="brgySearch"/>');
    input.html('<div class="ui icon input medium"><input required="required" class="prompt" type="text" placeholder="Search Barangays..." autocomplete="off" name="'+options.field+'" style="width: auto"><i class="search icon"></i></div><div class="results"></div>')
    // set its name to the field to which the column is bound ('name' in this case)
    var timer;
    input.search({
        apiSettings: {
            url: 'data/barangays.php?q={query}'
        },
        searchDelay: 500,
        type: 'category',
        onSelect: function(a,b){
            var text = input.find(".category .result.active").parent().find("div.name").text();
            if(text != ""){
                setTimeout(function () {
                    var val = input.find("input").val()
                    input.find("input").val(val + ", " + text)
                    input.find("input").change()
                },100)

            }

        },
        onResultsAdd: function(){
            try{
                clearTimeout(timer)
            }
            catch(e){}
            timer = setTimeout(function () {
                input.find(".category .result").click(function () {
                    var text = $(this).parent().find("div.name").text();
                    setTimeout(function () {
                        var val = input.find("input").val()
                        input.find("input").val(val + ", " + text)
                        input.find("input").change()
                    },100)
                })
            },1000)

        }
    })

    input.appendTo(container);
}

function POCalcAll(){
    var totalKilos = 0
    var totalPercent = 0
    var totalBoxes = 0
    $("#POCalcBody tr").each(function (i,v) {
        totalKilos += parseInt($(this).find("td:eq(1)").html().replace(" Kilos", "").replace(" Kilo", ""))
        totalPercent += ($(this).find("td:eq(2) input").val() == "") ? 0 : parseFloat($(this).find("td:eq(2) input").val())
        totalBoxes += parseInt($(this).find("td:eq(3)").html().replace(" Boxes", "").replace(" Boxes", ""))
    })
    $("#POCalcTotalRemaining").html(totalKilos + " Kilos")
    $("#POCalcTotalPercent input").val(totalPercent)
    $("#POCalcTotalBoxes").html(totalBoxes + " Boxes")
}

function POCalcStart(){
    var countText = ""
    $("#POCalcBody .POCalcPerInput").each(function (i,el) {
        var val = ($(this).val() == "") ? 0 : $(this).val()
        var value = val
        var targetStock = ($("#POCalcTargetStock").val() == "") ? 0 : parseInt($("#POCalcTargetStock").val())
        var remainingStock = parseInt($(this).parents("td").prev().html().replace(" Kilos", "").replace(" Kilo", ""))
        var tdHtml = $(this).parents("td").next()

        if(value.length == 2)
            countText = ''
        if(value.length == 1)
            countText = "0"

        remainingStock *= -1;

        if(value != 0)
            var kilos = (targetStock * parseFloat(("0." + countText + value))) + remainingStock;
        else
            var kilos = 0;
        var boxes = ~~(kilos/6)
        tdHtml.html(boxes + " Boxes")
    })

    POCalcAll()
}

function loadPOCalc(){
    $("#POCalculatorModal").modal("show");
    productsDs.filter({ field: "product_category", operator: "eq", value: settings["Report Powders"] })
    productsDs.fetch(function () {
        var data = productsDs.data()
        $("#POCalcBody").html("")

        var perEach = ~~(100/data.length);

        $.each(data, function(i, v){
            $("#POCalcBody").append("<tr>" +
            "<td>"+ v.product_name +"</td>" +
            '<td>'+ v.product_stock +' '+add_S("Kilo", v.product_stock)+'</td>' +
            '<td><div class="ui right labeled input" style="width: 160px"><input id="POCalcId'+ v.product_id+'" class="POCalcPerInput" type="text" placeholder="Percentage" value="'+ perEach +'" onkeyup="POCalcStart()"><div class="ui label">%</div></div></td>' +
            "<td></td>" +
            "</tr>")
        })

        if($.cookie("POCalcTargetStock") != undefined)
            $("#POCalcTargetStock").val($.cookie("POCalcTargetStock"))

        var atId
        var atVal

        $(".POCalcPerInput").each(function (i, v) {
            atId = $(this).attr("id");
            if($.cookie(atId) != undefined)
                $(this).val($.cookie(atId))
        })

        POCalcStart()
    })

}

function getSettings(name){
    var multiselect;
    var value;

    if(name == "Branch Name")
        return $("#theBranchName").val();
    if(name == "Branch Address")
        return $("#theBranchAddress").val()
    if (name == "Branch Contact")
        return $("#theBranchContact").val()
    if (name == "Printing Footer")
        return $("#theReceiptFooter").val()
    if (name == "Printing Sub")
        return $("#theReceiptSub").val()
    if (name == "Warranty Maintenance")
        return $("#theWarrantyMaintenance").val()
    if (name == "Warranty Void")
        return $("#theWarrantyVoid").val()

    if(name == "Points Group"){
        multiselect = $("#pointsGroupSettings").data("kendoMultiSelect");
        value = multiselect.value();

        return value
    }

    if(name == "Report Powders"){
        multiselect = $("#powdersCatSettings").data("kendoMultiSelect");
        value = multiselect.value();

        return value
    }

    if(name == "Report Machines"){
        multiselect = $("#machinesCatSettings").data("kendoMultiSelect");
        value = multiselect.value();

        return value
    }

    if(name == "Report Cups"){
        multiselect = $("#cupsCatSettings").data("kendoMultiSelect");
        value = multiselect.value();

        return value
    }

    if(name == "Report Parts"){
        multiselect = $("#partsCatSettings").data("kendoMultiSelect");
        value = multiselect.value();

        return value
    }

}

function loadClientFullInfo(uid){
    try{
        var userSearch = $("#userSearch").data("kendoComboBox");
        userSearch.value(uid);
        $("#userSearch").prev().find("input").blur()
        var value = uid;
        var dataItem = userDs.get(value);
        clientNameTmp = userSearch.text();
        clientValueTmp = value
        clientGroup = dataItem.user_group;

        var userDetailsTpl = $("#userDetailsTpl").html();
        userDetailsTpl = userDetailsTpl.replace("[user_name]", dataItem.user_name).replace("[user_photo]", dataItem.user_photo).replace("[user_address]", dataItem.user_address).replace("[user_points]", dataItem.user_points).replace("[user_group]", getGroupName(dataItem.user_group)).replace(/\[user_id\]/gim, dataItem.user_id)
        $("#userDetails").html(userDetailsTpl);

        userIssues(dataItem.user_id)
        reminderDetails(dataItem.user_id)

        campaignDs.filter({
            // leave data items which are "Food" or "Tea"
            logic: "and",
            filters: [
                {field: "campaign_start", operator: "lte", value: new Date(Date.now())}, {field: "campaign_end", operator: "gte", value: new Date(Date.now())}
            ]
        })

        campaignDs.fetch(function () {
            var data = campaignDs.data()
            var show;

            $.each(data, function (i, v) {
                show = true
                $.each(v["Attendees"], function (d, t) {
                    if(t == value)
                        show = false
                })

                if(show){
                    $("#userDetails .campaign .description").append('<div style="margin-top: 5px"><div class="ui checkbox"><input type="checkbox" name="fun"><label>'+v["campaign_subject"]+'</label></div></div>')
                    $("#userDetails .campaign .description .ui.checkbox:last").checkbox({
                        uncheckable: false,
                        onChecked: function(){
                            campaignUsersDs.add({campaign_user_foreign_id: v.campaign_id, campaign_user_user_id: value, campaign_user_join_date: new Date()})
                            campaignUsersDs.sync()
                            $(this).parent().parent().find("label").css({"text-decoration" : "line-through"})
                        }
                    })
                }

            })

            if($("#userDetails .campaign .description .ui.checkbox").length){
                $("#userDetails .campaign").css({"display" : "list-item"})
            }
            else{
                $("#userDetails .campaign").css({"display" : "none"})
            }
        })
    }catch(e){}
}

function buildtransactionMenu(){
    $("#savedTransactions").html('')

    $.each(savedTransaction, function (i, v) {
        $("#savedTransactions").append('<div class="item"><i class="ui circular label red close icon" onclick="removeTransaction('+i+')"></i><div class="content"><div class="header" onclick="loadTransaction('+i+')">'+v["client name"]+'</div></div></div>')
    })

    if(savedTransaction.length){
        $("#savedTrasansactionNumbers").show()
        $("#savedTrasansactionNumbers").html(savedTransaction.length)
    }
    else{
        $("#savedTrasansactionNumbers").hide()
        $("#savedTransactions").html('<div class="item"><div class="content"><div class="header">No Saved Transaction</div></div></div>')
    }
}

function removeTransaction(i){
    savedTransaction.splice(i,1)

    buildtransactionMenu()
}

function loadTransaction(i){
    newTransaction()
    userDs.filter({field: "user_id", operator: "eq", value: savedTransaction[i]["client id"]})
    userDs.fetch(function () {
        loadClientFullInfo(savedTransaction[i]["client id"])
    })


    if(savedTransaction[i]["delivery"] == 1)
        $("#deliveryChb").checkbox("check")
    else
        $("#deliveryChb").checkbox("uncheck")



    $("#orderDate").data("kendoDatePicker").value(savedTransaction[i]["transaction date"])
    $("#notes").val(savedTransaction[i]["transaction notes"])

    $.each(savedTransaction[i]["fees"], function (index, v) {
        feesBlank.add({fee_amount: parseFloat(v.fee_amount), fee_name: v.fee_name})
    })

    feesBlank.sync()

    $.each(savedTransaction[i]["payments"], function (index, v) {
        paymentsBlank.add({payment_amount: parseFloat(v.payment_amount), payment_note: v.payment_note, payment_type: v.payment_type, payment_date: kendo.parseDate(v.payment_date, "yyyy-MM-ddTHH:mm:ss.fffZ")})
    })

    paymentsBlank.sync()

    $.each(savedTransaction[i]["items"], function (index,v) {
        addToCart(v)
        $("#cartItems .item .cartItemAttr:last").find("input").val(parseInt(savedTransaction[i]["qty"][index]))

    })

    clientNameTmp = savedTransaction[i]["client name"]
}

function saveTransaction(){
    var dropdownlist = $("#userSearch").data("kendoComboBox");
    var orderDate = $("#orderDate").data("kendoDatePicker");
    var notes = $("#notes").val()

    if(dropdownlist.value() == ""){
        notification.show({
            subject: "Client Information Needed",
            message: "To save transaction please provide the client information",
            icon: "info circle",
            color: "blue"
        }, "message");
    }
    else{
        saveSound.play()
        var feesX = new Array()
        $.each(feesBlank.data(), function (i, v) {
            feesX[i] = {fee_amount: v.fee_amount, fee_name: v.fee_name}
        })

        var paymentsX = new Array()
        $.each(paymentsBlank.data(), function (i, v) {
            paymentsX[i] = {payment_amount: parseFloat(v.payment_amount), payment_note: v.payment_note, payment_type: v.payment_type, payment_date: kendo.parseDate(v.payment_date, "yyyy-MM-ddTHH:mm:ss.fffZ")}
        })

        var qtyX = new Array()
        $( "#cartItems .item input" ).each(function( i ) {
            qtyX[i] = parseInt($(this).val());
        });


        var itemsC = new Array();
        $.each(cartItems, function (i, v) {
            itemsC[i] = v
        })
        
        
        savedTransaction.push({"delivery" : ($("#deliveryChb").checkbox( "is checked" )) ? 1 : 0, "client name" : dropdownlist.text(), "client id" : dropdownlist.value(), "transaction date" : orderDate.value(), "transaction notes" : notes, "fees" : feesX, "payments": paymentsX, "items" : itemsC, "qty" : qtyX})
        buildtransactionMenu()
    }


}

var settingsNoti = 0;
function setSettingsValues(){
    var settings = [];

    settingsDs.read().then(function() {
        var view = settingsDs.view();

        $.each(view, function (i, v) {
            settings[v.setting_name] = v.setting_value;
        })

        settings["fullscreen"] = false // another one in datasource

        productCategoriesDs.read().then(function() {
            var multiselect;
            var value;
            var array;
            var groupItem

            $("#theBranchName").val(settings["Branch Name"])
            $(".receiptBranchName").html(settings["Branch Name"] + " Branch")

            if(settings["Branch Name"].length > 46){
                $("#receipt .ui.header").css({"text-align" : "center"})
            }

            $("#theBranchAddress").val(settings["Branch Address"])
            $(".receiptBranchAddress").html(settings["Branch Address"])

            if(settings["Branch Address"].length > 40 || settings["Branch Name"].length > 24)
                $("#receipt .ui.header.rTop, .mainStub .ui.header.rTop").css({"text-align" : "center"})
            else{
                $("#receipt .ui.header.rTop, .mainStub .ui.header.rTop").css({"text-align" : "left"})
            }

            $("#theBranchContact").val(settings["Branch Contact"])
            $(".stubOurContact").html(settings["Branch Contact"])

            $("#theReceiptFooter").val(settings["Printing Footer"])
            $(".receiptFooter").html(settings["Printing Footer"])
            $("#theReceiptSub").val(settings["Printing Sub"])
            $(".receiptSub").html(settings["Printing Sub"])

            $("#theWarrantyVoid").val(settings["Warranty Void"])
            $("#theWarrantyMaintenance").val(settings["Warranty Maintenance"])

            multiselect = $("#powdersCatSettings").data("kendoMultiSelect");

            array = [];

            array = settings["Report Powders"].split(',');
            multiselect.value(array)

            multiselect = $("#machinesCatSettings").data("kendoMultiSelect");

            array = [];

            array = settings["Report Machines"].split(',');
            multiselect.value(array)

            multiselect = $("#cupsCatSettings").data("kendoMultiSelect");

            array = [];

            array = settings["Report Cups"].split(',');
            multiselect.value(array)

            multiselect = $("#partsCatSettings").data("kendoMultiSelect");

            array = [];

            array = settings["Report Parts"].split(',');
            multiselect.value(array)

            groupDs.read().then(function() {
                multiselect = $("#pointsGroupSettings").data("kendoMultiSelect");

                array = [];

                array = settings["Points Group"].split(',');
                multiselect.value(array)

                if(settingsNoti){
                    notification.show({
                        subject: "Settings Updated!",
                        message: "Information sent is now saved.",
                        icon: "save circle",
                        color: "blue"
                    }, "message");

                    settingsNoti = 0;
                }

            });

        });

    });
}

function migrateData(){
    $("#migrateModal").modal("show")
    if(migrationLoaded == false){
        migrationLoaded = true
        
        $("#startDataMigrate").click(function () {
            $(this).addClass("loading")
            notification.show({
                subject: "Migrating Admins",
                message: "This may take awhile",
                icon: "info circle",
                color: "blue"
            }, "message");
            $.get("mapper/admins.php", function (data1) {
                if(data1 == "Done"){
                    $('#migrateProgress').progress('increment')
                    notification.show({
                        subject: "Migrating Groups",
                        message: "This may take awhile",
                        icon: "info circle",
                        color: "blue"
                    }, "message");
                    $.get("mapper/groups.php", function (data2) {
                        if(data2 == "Done"){
                            $('#migrateProgress').progress('increment')
                            notification.show({
                                subject: "Migrating Clients",
                                message: "This may take awhile",
                                icon: "info circle",
                                color: "blue"
                            }, "message");

                            $.get("mapper/users.php", function (data3) {
                                if(data3 == "Done"){
                                    $('#migrateProgress').progress('increment')
                                    notification.show({
                                        subject: "Migrating Machine Warranties",
                                        message: "This may take awhile",
                                        icon: "info circle",
                                        color: "blue"
                                    }, "message");

                                    $.get("mapper/warranties.php", function (data4) {
                                        if(data4 == "Done"){
                                            $('#migrateProgress').progress('increment')
                                            notification.show({
                                                subject: "Migrating Orders",
                                                message: "This may take awhile",
                                                icon: "info circle",
                                                color: "blue"
                                            }, "message");

                                            $.get("mapper/orders.php", function (data5) {
                                                if(data5 == "Done"){
                                                    $('#migrateProgress').progress('increment')
                                                    notification.show({
                                                        subject: "Migrating Product Categories",
                                                        message: "This may take awhile",
                                                        icon: "info circle",
                                                        color: "blue"
                                                    }, "message");
                                                    $.get("mapper/product_categories.php", function (data6) {
                                                        if(data6 == "Done"){
                                                            $('#migrateProgress').progress('increment')
                                                            notification.show({
                                                                subject: "Migrating Products",
                                                                message: "This may take awhile",
                                                                icon: "info circle",
                                                                color: "blue"
                                                            }, "message");
                                                            $.get("mapper/products.php", function (data7) {
                                                                if(data7 == "Done"){
                                                                    $('#migrateProgress').progress('increment')
                                                                    notification.show({
                                                                        subject: "Migrating Rent to Own",
                                                                        message: "This may take awhile",
                                                                        icon: "info circle",
                                                                        color: "blue"
                                                                    }, "message");

                                                                    $.get("mapper/rent2own.php", function (data8) {
                                                                        if(data8 == "Done"){
                                                                            $('#migrateProgress').progress('increment')
                                                                            notification.show({
                                                                                subject: "Migrating Expenses",
                                                                                message: "This may take awhile",
                                                                                icon: "info circle",
                                                                                color: "blue"
                                                                            }, "message");
                                                                            $.get("mapper/expenses.php", function (data9) {
                                                                                if(data9 == "Done"){
                                                                                    $('#migrateProgress').progress('increment')

                                                                                }
                                                                            })
                                                                        }
                                                                    })
                                                                }
                                                            })
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        })

        $('#migrateProgress').progress({
            text: {
                active  : 'Migrating {value} of {total} Data',
                success : 'Migration is finished'
            },
            onSuccess: function(e){
                $("#startDataMigrate").removeClass("loading")
                notification.show({
                    subject: "Data Migration is finished!",
                    message: "Barista Choi POS will now restart after 10 seconds",
                    icon: "thumbs up",
                    color: "green"
                }, "message");
                setTimeout(function () {
                    window.location.reload()
                }, 10000)

            }
        })
        
        $.get("data/baristachoi4.php", function (data) {
            if(data == "oldVersion"){
                
            }
            else{
                $("#migrateModal").modal("hide")
                notification.show({
                    subject: "Unnecessary...",
                    message: "There's no Barista Choi version 4 Detected",
                    icon: "info",
                    color: "blue"
                }, "message");
            }
        })
    }
}

function logOut(){
    $("#newTransaction, #saveTransaction").hide()
    $("#dashBoardMenu").click()
    $(".loggedInfo").prev().show()
    $(".loggedInfo").prev().prev().show()
    $(".loggedInfo").hide()
    $(".theMainMenu:not(.active)").hide()

    $("#loginUser").val("")
    $("#loginPass").val("");
}

function transferAccount(){
    $("#transferAccountModal").modal("show")
}

function addNewClient(){
    loadClients();
    var grid = $("#clientsGrid").data("kendoGrid");
    userDs.fetch(function () {
        grid.addRow();
    })
}

function orAddNewClient(){
    $("#userDetails").html('<div class="ui horizontal divider">Or</div><div align="center"><div class="ui button" onclick="addNewClient()"><i class="add user icon"></i> Add New Client </div> </div>')
}

function scrRes(){
    if($(document).width() < 1518){
        notification.show({
            subject: "Screen Resolution is too Small!",
            message: "Please Consider Pressing 'CTRL' and '-' at the same time to zoom out for better viewing",
            icon: "info circle",
            color: "blue"
        }, "message");
    }
}

function changeMachinePic(el){
    var photo = el.next().attr("src")
    var myId = parseInt(el.next().attr("myid"))
    $('#warrantiesModal').modal('show')

    notification.show({
        subject: "Machine Photo Saved",
        message: "Machine Photo Updated",
        icon: "info circle",
        color: "blue"
    }, "message");

    var dataItem = warrantiesDs.get(myId);
    dataItem.set("warranty_photo", photo)

    warrantiesDs.sync()

}

$(document).ready(function () {
    //Login autocomplete
    $("#loginID").search({
        apiSettings: {
            url: 'data/autoComplete.php?q={query}&table=admins&field=admin_name'
        },
        searchDelay: 500
    })

    //
    $("#cartDrag").kendoDraggable({
        hint: function(element) {
            return element.clone();
        },
        dragstart: function(e) {
            $("#cartContainer").addClass("onDrop")
            $("#cartContainer").show()
        },
        dragend: function(e) {
            $("#cartContainer").removeClass("onDrop")
            $("#cartContainer").hide()
        },
        group: "cart"
    });

    $("#cartContainer").kendoDropTarget({
        group: "cart",
        drop: function(e) {
            $("#cartContainer").removeClass("onDrop")
            $(e.dropTarget).html(e.draggable.element)
            e.draggable.destroy(); //detach events
            $("#cartColumn").hide()
            $("#productSearchColumn").removeClass("seven wide column").addClass("nine wide column")
            $("#checkoutColumn").removeClass("five wide column").addClass("seven wide column")
        },
        dragenter: function(e) {
            e.draggable.hint.css("opacity", 0.5); //modify the draggable hint
        },
        dragleave: function(e) {
            e.draggable.hint.css("opacity", 1); //modify the draggable hint

        }
    });

    // add new client button
    orAddNewClient()
    // new transaction button
    $("#newTransaction").click(function () {
        newTransactionSound.play()
        $("#thePOS").click()
        newTransaction()
    })
    // Menu Hover Sound
    /*$(".theMainMenu, .ui.flowing.popup.inverted .item").hover(function () {
        menuSound.pause();
        menuSound.currentTime = 0;
        menuSound.play()
    })*/

    //Transfer Account
    $("#transferAccountBtn").click(function () {
        var from = $("#transferFrom").data("kendoComboBox").value()
        var to = $("#transferTo").data("kendoComboBox").value()

        if(from == "" || to == ""){
            notification.show({
                subject: "Incomplete Fields",
                message: "Please input transfer from and transfer to fields",
                icon: "exchange",
                color: "yellow"
            }, "message");
        }
        else{
            var r = confirm("Please confirm merging of accounts...");

            if(r){
                $("#transferAccountBtn").addClass("loading")
                $.post("data/transferAccount.php", {from : from, to: to}, function () {
                    $("#transferAccountBtn").removeClass("loading");
                    notification.show({
                        subject: "Transfer Complete",
                        message: "All Orders, Campaigns, reminders and warranties are now transferred",
                        icon: "exchange",
                        color: "green"
                    }, "message");

                    $('#transferAccountModal').modal("hide")
                })
            }
            else{

            }
        }
    })
    
    $("#transferFrom, #transferTo").kendoComboBox({
        placeholder: "Search for Clients",
        dataTextField: "user_name",
        dataValueField: "user_id",
        filter: "contains",
        valuePrimitive: true,
        autoBind: true,
        height:500,
        dataSource: userDs,
        select: function(e){
            $(this.wrapper).hide();
            $(this.wrapper).next().html($(e.item).text())
            $(this.wrapper).next().show()
        }
    });
    // statistics
    cashOnHand()
    totalClientThisMonth()
    totalOrders()
    //my info
    $("#myInfo").popup()
    //body
    $("body").show()
    //login code
    $(".theMainMenu:not(.active)").hide()
    $('#loginPass').keyup(function (e) {
        if (e.keyCode === 13) {
            var logged = false;
            username = $("#loginUser").val()
            password = $("#loginPass").val();

            var role = ""
            $.each(adminsDs.data(), function (i,v) {
                if(v.admin_name == username && v.admin_password == password){
                    logged = true;
                    role = v.admin_role
                    loginId = v.admin_id

                    $(".theMainMenu:not(.active)").show()
                    $(".admin, .cashier").hide()

                    if(role == "Admin")
                        $(".admin").show()
                    if(role == "Cashier")
                        $(".cashier").show()


                    $(".loggedInfo").prev().hide()
                    $(".loggedInfo").prev().prev().hide()
                    $(".loggedInfo").show()
                    $(".loggedInfo img").attr("src", v.admin_photo);
                    $(".loggedInfo .usernameHere").html(username);

                    logsDs.add({log_type: "Logins", log_flag: "Unread", log_message: username, log_date: new Date(), log_json: ""})
                    logsDs.sync()
                }
            })

            if(logged == false){
                notification.show({
                    subject: "You are not Authorized!",
                    message: "Invalid Username and/or Password",
                    icon: "warning circle",
                    color: "red"
                }, "message");
            }
            else{
                notification.show({
                    subject: "You are now Authorized!",
                    message: "Hi "+ username + ", Welcome and enjoy you're work as " + role,
                    icon: "thumbs up",
                    color: "green"
                }, "message");
                infoSound.play()
            }
        }
    });

    // settings
    $("#saveSettings").click(function () {
        var view = settingsDs.view();
        var dataItem

        $.each(view, function (i,v) {

            dataItem = settingsDs.get(v.setting_id);
            dataItem.set("setting_value", getSettings(v.setting_name))

        })
        settingsNoti = 1
        settingsDs.sync()
    })

    $("#powdersCatSettings").kendoMultiSelect({
        placeholder: "Select categories...",
        dataTextField: "category_name",
        dataValueField: "category_id",
        autoBind: false,
        dataSource: productCategoriesDs
    });

    $("#machinesCatSettings").kendoMultiSelect({
        placeholder: "Select categories...",
        dataTextField: "category_name",
        dataValueField: "category_id",
        autoBind: false,
        dataSource: productCategoriesDs
    })


    $("#cupsCatSettings").kendoMultiSelect({
        placeholder: "Select categories...",
        dataTextField: "category_name",
        dataValueField: "category_id",
        autoBind: false,
        dataSource: productCategoriesDs
    })

    $("#partsCatSettings").kendoMultiSelect({
        placeholder: "Select categories...",
        dataTextField: "category_name",
        dataValueField: "category_id",
        autoBind: false,
        dataSource: productCategoriesDs
    })

    $("#pointsGroupSettings").kendoMultiSelect({
        placeholder: "Select groups...",
        dataTextField: "group_name",
        dataValueField: "group_id",
        autoBind: false,
        dataSource: groupDs
    })

    setSettingsValues()

    settingsDs.bind("sync", setSettingsValues);

    // end settings

    notification = $("#notification").kendoNotification({
        position: {
            pinned: true,
            top: 45,
            right: 30
        },
        autoHideAfter: 10000,
        stacking: "down",
        templates: [{
            type: "message",
            template: $("#alertTpl").html()
        }]

    }).data("kendoNotification");

    // window resoltion code

    scrRes()
    $( window ).resize(function() {
        scrRes()
        if($(document).width() > 1518){
            notification.show({
                subject: "Good Screen Resolution!",
                message: "The interface for the POS in now in perfect shape",
                icon: "thumbs up",
                color: "green"
            }, "message");
        }
    });

    $('#printReceiptBtn').popup({
        popup : $('.receipt.popup'),
        on    : 'hover',
        position : "bottom left",
        setFluidWidth: false,
        closable: false,
        distanceAway: 120,
        offset: -150
    })

    $("#printReceiptBtn").click(function () {
        $('#receipt').print({
            globalStyles : true,
            mediaPrint : true,
            iframe : false,
            noPrintSelector : ".avoid-this",
            deferred: $.Deferred()
        });
        //http://www.jqueryscript.net/other/jQuery-Plugin-To-Print-Any-Part-Of-Your-Page-Print.html
    })

    // Modals

    $('#transferAccountModal').modal('hide dimmer').modal({
        closable: false,
        onShow: function () {
            setTimeout(function () {
                $('#transferAccountModal').modal("refresh")
            },610)
        },
        onHide: function(){
            $(".transferValues").prev().show()
            $(".transferValues").hide()

            $("#transferFrom").data("kendoComboBox").value("");
            $("#transferTo").data("kendoComboBox").value("");
        }
    });

    $('#adminsModal').modal('hide dimmer').modal({
        closable: false,
        onShow: function () {
            setTimeout(function () {
                $('#adminsModal').modal("refresh")
            },610)
        },
        onHide: function(){

        }
    });

    $('#migrateModal').modal('hide dimmer').modal({
        closable: false,
        onShow: function () {
            setTimeout(function () {
                $('#migrateModal').modal("refresh")
            },610)
        },
        onHide: function(){

        }
    });

    $('#POCalculatorModal').modal('hide dimmer').modal({
        closable: false,
        onShow: function () {
            setTimeout(function () {
                $('#POCalculatorModal').modal("refresh")
            },610)
        },
        onHide: function(){
            $.cookie("POCalcTargetStock", $("#POCalcTargetStock").val())
            var id
            var value
            $(".POCalcPerInput").each(function (i, v) {
                id = $(this).attr("id");
                value = $(this).val()
                $.cookie(id, value);
            })
        }
    });

    $('#clientReminderModal').modal('hide dimmer').modal({
        closable: false,
        onShow: function () {
            setTimeout(function () {
                $('#clientReminderModal').modal("refresh")
            },610)
        },
        onHide: function(){
            userDs.filter( { field: "user_id", operator: "neq", value: 0 });
            fixNameBug()
        }
    });

    $('#warrantiesModal').modal('hide dimmer').modal({
        closable: false,
        onShow: function () {
            setTimeout(function () {
                $('#warrantiesModal').modal("refresh")
            },610)
        },
        onHide: function(){

        }
    });

    $('#expensesModal').modal('hide dimmer').modal({
        closable: false,
        onShow: function () {
            setTimeout(function () {
                $('#expensesModal').modal("refresh")
            },610)
        },
        onHide: function(){

        }
    });

    $('#logsModal').modal('hide dimmer').modal({
        closable: false,
        onShow: function () {
            setTimeout(function () {
                $('#logsModal').modal("refresh")
                logsDs.read()
            },610)
        },
        onHide: function(){
            logsDs.filter([])
        }
    });

    $('#feesModal').modal('hide dimmer').modal({
        closable: false,
        onShow: function () {
            setTimeout(function () {
                $('#feesModal').modal("refresh")
                feesDs.filter([])
            },610)
        },
        onHide: function(){

        }
    });

    $('#ordersModal').modal('hide dimmer').modal({
        closable: false,
        onShow: function () {
            setTimeout(function () {
                $('#ordersModal').modal("refresh")
            },610)
        },
        onHide: function(){
            userDs.filter([]);
            fixNameBug()
        }
    });


    $('.ui.modal.groups').modal('hide dimmer').modal({
        closable: false,
        onShow: function () {
            groupDs.filter([])
            setTimeout(function () {
                $('.ui.modal.groups').modal("refresh")

            },610)
        },
        onHide: function(){

        }
    });

    $('#productCategoriesModal').modal('hide dimmer').modal({
        closable: false,
        onShow: function () {
            productCategoriesDs.filter([])
            setTimeout(function () {
                $('#productCategoriesModal').modal("refresh")
            },610)
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
            select: "Upload Photos"
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
            setTimeout(function () {
                $('.ui.modal.mediaz').modal("refresh")
            },610)
        },
        onHide: function(){
            $(".k-overlay").transition('scale')
            $(".k-overlay").next().transition('scale')
        }
    });
})

function clearReminderFilters(){
    remindersDs.filter([]);
}

function userIssues(user_id){
    userDs.filter({field: "user_id", operator: "eq", value: user_id})
    var issues = new Array();

    $.get("data/clientInfo.php", {uid: user_id}, function (userInfo) {
        $("#userDetails .lastTransactionDate").html("<div style='cursor: pointer' onClick='viewOrder(" +parseInt(userInfo.Transaction.order_id)+ ")'>" + kendo.toString(kendo.parseDate(userInfo.Transaction.order_date, "yyyy-MM-ddTHH:mm:ss.fffZ"), "MMMM d, yyyy" ) + " <span style='font-size: small; font-style: italic'>(" + parseInt(userInfo.Transaction.daysDiff) + add_S(" day", parseInt(userInfo.Transaction.daysDiff)) + " ago)</span></div>")
        var totalCups = userInfo["Total Cups"]
        var totalPowders = userInfo["Total Powders"] * 100

        $("#userDetails .netIncome").html(moneyIt(userInfo["Income"]))
        $("#userDetails .thisMonth").html("(" + kendo.toString(new Date(), "MMMM" ) + ")")

        var limitColor = (totalPowders >= totalCups) ? "green" : "red";
        if(limitColor == "red")
            issues[issues.length] = {name: "Total bought cups are already on it's limit", clicky: ""}

        $("#userDetails .cupsLimit").html("<span style='color:"+limitColor+";'>" + totalCups + "</span> / " + totalPowders)

        $.each(userInfo["Status Result"], function (i, v) {
            issues[issues.length] = {name: v["Count"] + " " + v.order_status + " " + add_S("Order", parseInt(v["Count"])), clicky: "viewOrder("+ v.order_id+")"}
        })

        userDs.fetch(function () {
            var dataItem = userDs.get(user_id);


            if(dataItem.user_address == ""){
                issues[issues.length] = {name: "Address is empty", clicky: "modifyUser("+dataItem.user_id+")"}
            }
            if(dataItem.user_barangay == ""){
                issues[issues.length] = {name: "Barangay is empty", clicky: "modifyUser("+dataItem.user_id+")"}
            }
            if(dataItem.user_contact == ""){
                issues[issues.length] = {name: "Contact # is empty", clicky: "modifyUser("+dataItem.user_id+")"}
            }

            warrantiesDs.filter({
                logic: "and",
                filters: [
                    {field: "warranty_user_id", operator: "eq", value: user_id}, {field: "warranty_status", operator: "neq", value: "Maintained"}
                ]
            })

            warrantiesDs.fetch(function () {
                var machineData = warrantiesDs.data()

                $.each(machineData, function (i, v) {
                    issues[issues.length] = {name: v.warranty_serial + " Status: " + v.warranty_status, clicky: ""}
                })

                warrantiesDs.filter([])

                if(issues.length){

                    $("#userDetails .thumbs.up").removeClass("green").removeClass("up").addClass("red").addClass("down")
                    $("#userDetails .issues .header").html("<span class='reds'>"+issues.length+"</span> " + add_S("Issue", issues.length) + " needs to resolve")
                    var descContent = $("#userDetails .issues .description");
                    var descVal = "";
                    descVal += '<div class="ui bulleted list" style="margin-top: -5px">'
                    $.each(issues, function (i,v) {
                        descVal += '<a class="item" onclick="'+ v.clicky +'">'+ v.name +'</a>'
                    })
                    descVal += '</div>'
                    descContent.html(descVal)

                    $('#userDetails .thumbs.down').transition('set looping').transition('bounce', '1250ms')
                }
                else{
                    $('#userDetails .thumbs.down').transition('remove looping')
                    $("#userDetails .issues .header").html("No Issues")
                    $("#userDetails .issues .description").html("This client is awesome!.")

                    $("#userDetails .thumbs.down").removeClass("red").removeClass("down").addClass("up").addClass("green")
                }
            })
        })
    }, 'json')

}

function reminderDetails(user_id){
    remindersDs.filter({
        // leave data items which are "Food" or "Tea"
        logic: "and",
        filters: [
            {field: "reminder_for", operator: "eq", value: user_id}, {field: "reminder_start", operator: "lte", value: new Date(Date.now())}, {field: "reminder_status", operator: "eq", value: "Pending"}
        ]
    })

    remindersDs.fetch(function(){
        var data = remindersDs.data();
        if(data.length){

            $("#userDetails .alarm").removeClass("green").addClass("red")
            $("#userDetails .reminders .header").html("Reminders (<span class='reds' onclick='openReminderFor("+user_id+")' style='cursor: pointer'>"+data.length+"</span>)")
            var descContent = $("#userDetails .reminders .description");
            var descVal = "";
            descVal += '<div class="ui bulleted list" style="margin-top: -5px">'
            $.each(data, function (i,v) {
                descVal += '<a class="item" onclick="openReminderItem('+ v.reminder_id+')">'+ v.reminder_subject+'</a>'
            })
            descVal += '</div>'
            descContent.html(descVal)

            $('#userDetails .alarm') .transition('set looping').transition('tada', '1250ms')
        }
        else{
            $('#userDetails .alarm').transition('remove looping')
            $("#userDetails .alarm").removeClass("red").addClass("green")
            $("#userDetails .reminders .header").html("Reminders")
            $("#userDetails .reminders .description").html("No active reminders.")
        }
    });
}

function fixNameBug(){
    var dropdownlist = $("#userSearch").data("kendoComboBox");
    var nametmp = dropdownlist.value()
    if(nametmp != ""){
        userDs.fetch(function () {
            dropdownlist.text(clientNameTmp);
        })
    }
}

function clearProductFilters(){
    //productsDs.filter({ field: "product_category", operator: "neq", value: 0 }, { field: "product_name", operator: "neq", value: "" })
    productsDs.filter([]);
}

function catFilter(a){
    var catFilter = (a == "") ? { field: "product_category", operator: "neq", value: 0 } : { field: "product_category", operator: "eq", value: a };
    productsDs.filter(catFilter)
}

function createCategoryButtons(){
    productCategoriesDs.fetch(function () {
        var data = productCategoriesDs.data();

        $("#categoryButtons .ui.buttons").html('<div class="ui button" onclick="catFilter(\'\')">All Products</div>')

        $.each(data, function(a,b){
            $("#categoryButtons .ui.buttons").append('<div class="ui button" onclick="catFilter('+ b.category_id +')">'+b.category_name+'</div>')
        })
    })
}
createCategoryButtons()

function hardReset(){
    var r = confirm("Are you sure you want to Reset the Database to it's original State?");
    if (r == true) {
        $('#hardResetModal').modal('hide dimmer').modal({
            closable: false,
            onShow: function () {
                setTimeout(function () {
                    $('#hardResetModal').modal("refresh")
                },650)
            },
            onHide: function(){

            }
        });

        $('#hardResetModal').modal('show')

        notification.show({
            subject: "30 seconds left to start resetting the database...",
            message: "You have 30 seconds to cancel the Hard Reset... To cancel this function press <b>F5</b>",
            icon: "info",
            color: "blue"
        }, "message");

        setTimeout(function () {
            notification.show({
                subject: "15 seconds left to start resetting the database...",
                message: "You have 15 seconds to cancel the Hard Reset... To cancel this function press <b>F5</b>",
                icon: "info",
                color: "blue"
            }, "message");
        }, 15000)

        setTimeout(function () {
            $("#hardResetModal .content").html("<div>Hard Reset Started... Please Wait...</div>")

            $.post("data/hardReset.php", function(){
                notification.show({
                    subject: "Hard Reset is done",
                    message: "Barista Choi POS will Restart in 5 seconds",
                    icon: "info",
                    color: "blue"
                }, "message");

                setTimeout(function () {
                    window.location.reload()
                }, 5000)
            })
        }, 30000)
    }
}

function logsDetailInit(e) {
    var detailRow = e.detailRow;

    detailRow.find(".tabstrip").kendoTabStrip({
        animation: {
            open: {effects: "fadeIn"}
        }
    });

    detailRow.find(".logMessage").val(e.data.log_message)

    detailRow.find(".jsonData").html("")

    if(e.data.log_json != ""){
        var jsonData = JSON.parse(e.data.log_json)
        $.each(jsonData, function (i,v) {
            detailRow.find(".jsonData").append('<div class="ui label" style="margin: 5px">'+i+'<div class="detail">'+v+'</div></div>')
        })
    }

    if(e.data.log_flag == "Unread"){
        var dataItem = logsDs.get(e.data.log_id)
        dataItem.set("log_flag","Read")
        logsDs.sync()
        
        /*logsDs.fetch(function () {
            var grid = $("#logsGrid").data("kendoGrid");
            grid.refresh();
        })*/
    }
}

function campaignsDetailInit(e) {
    var detailRow = e.detailRow;

    detailRow.find(".tabstrip").kendoTabStrip({
        animation: {
            open: {effects: "fadeIn"}
        }
    });

    var campaignUsersUrl = "data/campaignUsers.php?"
    detailRow.find(".campaign_users").kendoGrid({
        dataSource: {
            sort: { field: "campaign_user_id", dir: "desc" },
            filter: { field: "campaign_user_foreign_id", operator: "eq", value: e.data.campaign_id },
            transport: {
                read:  {
                    url: campaignUsersUrl + "type=read",
                    dataType: "json",
                    type: "post",
                },
                update: {
                    url: campaignUsersUrl + "type=update",
                    dataType: "json",
                    type: "post",
                },
                destroy: {
                    url: campaignUsersUrl + "type=destroy",
                    dataType: "json",
                    type: "post",
                },
                create: {
                    url: campaignUsersUrl + "type=create",
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
            serverPaging: false,
            serverFiltering: true,
            serverSorting: true,
            sync: function(e) {

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
        },
        autoBind: true,
        columns: [
            { field:"campaign_user_user_id", title: "Client Name", template: "#=getAttendees(data, 0)#",},
            { field:"campaign_user_join_date", title: "Joined Date", format: "{0:MM/dd/yyyy hh:mm tt}"},
        ],
        sortable: true,
        excel: {
            fileName: "Campaigns.xlsx",
            proxyURL: "http://demos.telerik.com/kendo-ui/service/export",
            filterable: true
        },
        pdf: {
            fileName: "Campaigns.pdf",
            proxyURL: "http://demos.telerik.com/kendo-ui/service/export"
        },
        toolbar: ["excel", "pdf"]
    });
}

function usersDetailInit(e) {
    var detailRow = e.detailRow;

    detailRow.find(".tabstrip").kendoTabStrip({
        animation: {
            open: { effects: "fadeIn" }
        }
    });

    detailRow.find(".label .detail").html(e.data.user_points)

    campaignDs.filter({
        logic: "and",
        filters: [
            {field: "campaign_start", operator: "lte", value: new Date(Date.now())}, {field: "campaign_end", operator: "gte", value: new Date(Date.now())}
        ]
    })

    productsDs.query({
        filter: {
            logic: "and",
            filters: [
                { field: "product_redeem_points", operator: "gt", value: 0}, { field: "product_redeem_points", operator: "lte", value: e.data.user_points}
            ]
        }
    }).then(function(e) {
        detailRow.find(".ui.selection.dropdown").dropdown()
        var view = productsDs.view();
        var outOfStockMessage = '';
        $.each(view, function (i, v) {
            outOfStockMessage = ''
            if (v.product_stock < 1)
                outOfStockMessage = '<div class="fr ui red label">Out of Stock</div>'

            detailRow.find(".ui.selection.dropdown .menu").append('<div class="item" data-value="'+ v.product_redeem_points+'"><img class="ui avatar image fl" src="'+ v.product_image+'">' +
            outOfStockMessage+'<div class="dn pid">'+ v.product_id+'</div><div class="pname">'+ v.product_name+'</div>' +
            '<div class="description"><span class="greens">'+ v.product_redeem_points+'</span> '+add_S("Point", v.product_redeem_points)+' to Redeem this Product / '+ v.product_stock+' '+add_S(v.product_unit_name, v.product_stock)+' Left</div>' +
            '</div>')
        })

        if(view.length == 0)
            detailRow.find(".ui.selection.dropdown .text").html("Insufficient Points To Redeem")
    });

    detailRow.find(".redeem.button").click(function (b) {
        var el = $(this)
        var points2Redeem = detailRow.find(".ui.selection.dropdown").dropdown("get value")
        if(points2Redeem != ""){
            $.post("data/redeemPoints.php", {points: points2Redeem, uid: e.data.user_id, pid: parseInt(detailRow.find(".ui.selection.dropdown .text .pid").html())}, function () {
                el.removeClass("loading")

                notification.show({
                    subject: "Points Successfully Redeemed",
                    message: points2Redeem + " " + add_S("Point", points2Redeem) + " Deducted for " + e.data.user_name,
                    icon: "gift",
                    color: "green"
                }, "message");

                userDs.filter([])
                logsDs.add({log_type: "Points Redeemed", log_flag: "Unread", log_message: points2Redeem + " " + add_S("Point", points2Redeem) + " Deducted for " + e.data.user_name, log_date: new Date(), log_json: JSON.stringify({"Redeemed Product" : detailRow.find(".ui.selection.dropdown .text .pname").html()})})
                logsDs.sync()
            })
        }
        else{
            notification.show({
                subject: "What Product to Redeem?",
                message: "Please select a product to redeem",
                icon: "warning",
                color: "red"
            }, "message");
        }
    })

    detailRow.find(".ui.action.input.addPoints button").click(function (b) {
        var points2Add = $(this).prev().val()
        var el = $(this)

        $.post("data/addPoints.php", {points: points2Add, uid: e.data.user_id}, function () {
            el.removeClass("loading")

            notification.show({
                subject: "Points Successfully Added",
                message: points2Add + " " + add_S("Point", points2Add) + " Added for " + e.data.user_name,
                icon: "star",
                color: "green"
            }, "message");

            userDs.filter([])

            logType = "Points Added";
            logJson = {"Client Id" : e.data.user_id, "Client Name" : e.data.user_name, "Added Points" : points2Add}
            var grid = $("#logsGrid").data("kendoGrid");
            grid.addRow();
        })
    })
}

function warrantiesDetailInit(e) {
    var detailRow = e.detailRow;

    detailRow.find(".tabstrip").kendoTabStrip({
        animation: {
            open: { effects: "fadeIn" }
        }
    });

    detailRow.find(".photo img").attr("myId", e.data.warranty_id)

    if(e.data.warranty_photo != ""){
        detailRow.find(".photo img").attr("src", e.data.warranty_photo)
    }

    userDs.filter( { field: "user_id", operator: "eq", value: e.data.warranty_user_id });
    userDs.fetch(function() {
        var dataItem = userDs.get(e.data.warranty_user_id);
        detailRow.find(".image img").attr("src", dataItem.user_photo)
        detailRow.find(".header").html(dataItem.user_name)
        detailRow.find(".meta span").html(getGroupName(dataItem.user_group))
        detailRow.find(".description p").html('<i class="home icon"></i>'+dataItem.user_address)
        detailRow.find(".extra").html('<i class="call square icon"></i>'+dataItem.user_contact)

        detailRow.find(".stubBtn").click(function () {
            $(".stubSerial").html(e.data.warranty_serial)
            $(".stubType").html(e.data.warranty_machine_type)
            $(".stubDate").html(kendo.toString(new Date(), "dddd MMMM d, yyyy hh:mm tt" ))
            $(".stubClientContact").html(dataItem.user_contact)

            $('#claimStub .mainStub').print({
                globalStyles : true,
                mediaPrint : true,
                iframe : false,
                noPrintSelector : ".avoid-this",
                deferred: $.Deferred()
            });

        })
    });

    var dataItem = warrantiesDs.get(e.data.warranty_id);

    detailRow.find(".maintainBtn").click(function () {

        logsDs.add({log_type: "Machine Maintenance", log_flag: "Unread", log_message: e.data.Attendees[0][0] + "'s " + e.data.warranty_serial + " is now Maintained", log_date: new Date(), log_json: ""})
        logsDs.sync()

        var newDate = addDays(new Date(), parseInt(settings["Warranty Maintenance"]));

        dataItem.set("warranty_status", "Maintained")
        dataItem.set("warranty_maintenance_date", newDate)
        warrantiesDs.sync();
    })

    detailRow.find(".repairBtn").click(function () {
        logsDs.add({log_type: "Machine Repair", log_flag: "Unread", log_message: e.data.Attendees[0][0] + "'s " + e.data.warranty_serial + " is for Repair", log_date: new Date(), log_json: ""})
        logsDs.sync()

        dataItem.set("warranty_status", "On Repair")
        warrantiesDs.sync();
    })
}

function ordersDetailInit(e) {
    var detailRow = e.detailRow;

    detailRow.find(".tabstrip").kendoTabStrip({
        animation: {
            open: { effects: "fadeIn" }
        }
    });

    userDs.filter( { field: "user_id", operator: "eq", value: e.data.order_user_id });
    userDs.fetch(function() {
        var dataItem = userDs.get(e.data.order_user_id);
        detailRow.find(".image img").attr("src", dataItem.user_photo)
        detailRow.find(".header").html(dataItem.user_name)
        detailRow.find(".meta span").html(getGroupName(dataItem.user_group))
        detailRow.find(".description p").html('<i class="home icon"></i>'+dataItem.user_address)
        detailRow.find(".extra").html('<i class="call square icon"></i>'+dataItem.user_contact)
    });

    var notes = (e.data.order_notes) ? e.data.order_notes : "<i>Notes not supplied</i>"
    detailRow.find(".notes").html(notes)

    detailRow.find(".fees").kendoGrid({
        dataSource: {
            sort: { field: "fee_id", dir: "desc" },
            filter: { field: "fee_order_id", operator: "eq", value: e.data.order_id },
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
            pageSize: 12,
            serverPaging: false,
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
        },
        autoBind: true,
        columns: [
            { field:"fee_order_id", title: "Invoice #"},
            { field:"fee_name", title: "Fee / Charge Name"},
            { field:"fee_amount", title: "Amount", template: "#=kendo.toString(fee_amount, 'c')#"}
        ],
        sortable: true,
        editable: "popup"
    });

    detailRow.find(".orders").kendoGrid({
        dataSource: {
            transport: {
                read:  {
                    url: "data/items.php?type=read",
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
            batch: true,
            pageSize: 20,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
            filter: { field: "item_order_id", operator: "eq", value: e.data.order_id },
            schema: {
                data: function(response) {
                    return response.data; // twitter's response is { "results": [ /* results */ ] }
                },
                model: {
                    id: "item_id",
                    fields: {
                        item_order_id: { type: "number" },
                        item_product_id: { type: "number" },
                        item_qty: { type: "number" }
                    }
                }
            }
        },
        scrollable: false,
        columns: [
            { field: "item_product_id", title:"Product Name", template: "#=getAttendees(data, 0)#"},
            { field: "item_qty", title:"Quantity"},
            { field: "item_product_id", title:"Price", template: "#=getAttendees(data, 1)#"},
        ]
    });
}