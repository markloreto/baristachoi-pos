$(document).ready(function(){
    $('.ui.checkbox').checkbox();

    $('.ui.modal.payment').modal('hide dimmer').modal({
        closable: false,
        onShow: function () {
            var paymentInput = $("#paymentInput").data("kendoNumericTextBox");
            paymentInput.value(grandTotal);
            $("#paymentInput").attr("placeholder", "Total: ₱" + grandTotal.toFixed(2))

        }
    })


    $("#paymentInput").kendoNumericTextBox({
        format: "c",
        decimals: 3
    }).focus(function(){
        setTimeout(function(){
            $("#paymentInput").select()
        },1)
    }).keypress(function(event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13') {
            alert('You pressed a "enter" key in somewhere');
        }
    });

    $("#quickPay").click(function(){
        if(itemsTotal){

            $('.ui.modal.payment').modal("show")
        }

        else{
            // to do: alert no items
        }
    })

    //Orders DataSource

})