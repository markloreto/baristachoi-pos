function loadFees(){
    $('#feesModal').modal("show");

    if(feesGridLoaded  == false){
        feesGridLoaded  = true;

        $("#feesGridModal").kendoGrid({
            excel: {
                fileName: "Charges.xlsx",
                proxyURL: "http://demos.telerik.com/kendo-ui/service/export",
                filterable: true
            },
            pdf: {
                fileName: "Charges.pdf",
                proxyURL: "http://demos.telerik.com/kendo-ui/service/export"
            },
            toolbar: ["excel", "pdf", {template: '<a class="k-button" href="\\#" onclick="feesDs.filter([])">Clear Filters</a>'}],
            dataSource: feesDs,
            groupable: true,
            autoBind: true,
            pageable: true,
            filterable: {
                mode: "row"
            },
            pageable: {
                pageSize: 12
            },
            columns: [
                { field:"fee_order_id", title: "Invoice #",
                    attributes: {
                        "class": "invoiceNum"
                    }
                },
                { field:"fee_name", title: "Fee / Charge Name"},
                { field:"fee_amount", title: "Amount", template: "#=kendo.toString(fee_amount, 'c')#"},
                { command: [{
                    name: "Load Order",
                    click: function(e) {
                        var inVoice = parseInt($(e.target).parents("tr").find("td.invoiceNum").html());
                        $("#thePOS").click()
                        $("#feesModal").modal("hide")
                        $.post("data/loadOrder.php",{orderId: inVoice}, function (k) {
                            newTransaction()
                            orderId = inVoice;
                            $.each(k["items"], function (i,v) {
                                addToCart(v)
                                $("#cartItems .item .cartItemAttr:last").find("input").val(parseInt(v.item_qty))

                            })

                            //points deduction minusPoints
                            $.each(cartItems, function( index, value ) {
                                minusPoints += parseFloat(value.product_points) * parseInt(value.item_qty)
                            });

                            $.each(k["fees"], function (i, v) {
                                feesBlank.add({fee_amount: parseFloat(v.fee_amount), fee_name: v.fee_name})
                            })

                            feesBlank.sync()

                            $.each(k["payments"], function (i, v) {
                                paymentsBlank.add({ payment_amount: parseFloat(v.payment_amount), payment_note: v.payment_note, payment_type: v.payment_type, payment_date: kendo.parseDate(v.payment_date, "yyyy-MM-ddTHH:mm:ss.fffZ")})
                            })

                            paymentsBlank.sync()


                            userDs.filter({field: "user_id", operator: "eq", value: k["main"][0].order_user_id})
                            userDs.fetch(function () {

                                // same with change in checkoutBlock.js
                                loadClientFullInfo(k["main"][0].order_user_id)
                                //
                            })

                            var deli = parseInt(k["main"][0].order_delivery)
                            if(deli === 0){
                                $('#deliveryChb').checkbox("uncheck")
                            }
                            else{
                                $('#deliveryChb').checkbox("check")
                            }

                            $("#orderDate").data("kendoDatePicker").value(kendo.parseDate(k["main"][0].order_date, "yyyy-MM-ddTHH:mm:ss.fffZ"))
                            $("#notes").val(k["main"][0].order_notes)


                            calcTotal()
                        },"json")
                    }
                }], title: "&nbsp;"}
            ],
            sortable: true,
            editable: "popup"
        });
    }
    else{

    }
}