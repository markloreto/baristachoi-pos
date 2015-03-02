$(document).ready(function(){
    $('.ui.checkbox').checkbox();

    $('.ui.modal.payment').modal('hide dimmer').modal({
        closable: false,
        onShow: function () {
            var paymentInput = $("#paymentInput").data("kendoNumericTextBox");
            paymentInput.value(grandTotal);
            $("#paymentInput").attr("placeholder", "Total: " + kendo.toString(grandTotal, "c"));

            $("#coPayment").html(kendo.toString(grandTotal, "c"));

        }
    })


    $("#paymentInput").kendoNumericTextBox({
        format: "c",
        decimals: 3,
        step: 5
    }).focus(function(){
        setTimeout(function(){
            $("#paymentInput").select()
        },1)
    }).keypress(function(event) {
        var paymentInput = $("#paymentInput").data("kendoNumericTextBox");
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13') {
            checkOut(paymentInput.value());
        }
    });

    $("#quickPay").click(function(){
        if(itemsTotal){
            $("#coOrderStatus").parent().removeClass("warning").removeClass("positive").removeClass("negative")
            $("#paymentTable tr:not(:first)").hide();
            $("#paymentTable tr:not(:first)").addClass("transition hidden");
            $("#paymentTable tr:not(:first)").removeClass("visible")
            $("#paymentTable tr:not(:first)").removeAttr("style")
            $("#afterChkBtn").hide()
            $("#afterChkBtn").removeClass("visible")
            $('.ui.modal.payment').modal("show")
        }
    })

    $("#chkPay").click(function () {
        var paymentInput = $("#paymentInput").data("kendoNumericTextBox");
        checkOut(paymentInput.value());
    })

    //Orders DataSource

})