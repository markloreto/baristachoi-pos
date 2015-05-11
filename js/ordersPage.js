function loadOrdersPage(){
    $('#ordersModal').modal("show")
    if(ordersGridLoaded == false){
        ordersGridLoaded = true;

        $("#ordersGrid").kendoGrid({
            dataSource: ordersDs,
            autoBind: true,
            pageable: true,
            filterable: {
                mode: "row"
            },
            excel: {
                fileName: "Orders.xlsx",
                proxyURL: "http://demos.telerik.com/kendo-ui/service/export",
                filterable: true
            },
            pdf: {
                fileName: "Orders.pdf",
                proxyURL: "http://demos.telerik.com/kendo-ui/service/export"
            },
            toolbar: ["excel", "pdf",{template: '<a class="k-button" href="\\#" onclick="ordersDs.filter([])">Clear Filters</a>'}],
            columns: [
                { field:"order_date", title: "Date", format: "{0:MM/dd/yyyy hh:mm tt}", width: "15%"},
                { field:"order_id", title: "Invoice #", width: "10%",
                    attributes: {
                        "class": "invoiceNum"
                    }
                },
                { field:"order_user_id", title: "Client Name", template: "#=getAttendees(data, 0)#", width: "16%",
                    filterable: {
                        cell: {
                            template: function (args) {
                                args.element.kendoComboBox({
                                    placeholder: "Search for Clients",
                                    dataTextField: "user_name",
                                    dataValueField: "user_id",
                                    filter: "contains",
                                    valuePrimitive: true,
                                    autoBind: false,
                                    height:500,
                                    dataSource: userDs
                                });
                            },
                            showOperators: false
                        }

                    }
                },
                { field:"order_status", title: "Status", width: "12%",
                    filterable: {
                        cell: {
                            template: function (args) {
                                args.element.kendoDropDownList({
                                    dataSource: ["Paid", "Pending", "Balance"],
                                    optionLabel: "All"
                                });
                            },
                            showOperators: false,


                        }
                    }
                },
                { field:"order_delivery", title: "Delivery", template: "#= isDelivery(order_delivery) #",
                    filterable: {
                        cell: {
                            template: function (args) {
                                args.element.kendoDropDownList({
                                    dataSource: [
                                        { name: "Yes", id: 1 }, { name: "No", id: 0 }
                                    ],
                                    dataTextField: "name",
                                    dataValueField: "id",
                                    optionLabel: "All",
                                    valuePrimitive: true
                                });
                            },
                            showOperators: false

                        }
                    }
                },
                { field:"order_cashier", title: "Cashier", template: "#=getAdminName(order_cashier)#"},
                { field:"order_total", title: "Order Total", template: "#=kendo.toString(order_total, 'c')#"},
                { command: [{ name: "destroy", text: "Void Order" },
                    {
                        text: "Load Order",
                        click: function(e) {
                            var inVoice = parseInt($(e.target).parents("tr").find("td.invoiceNum").html());
                            $("#thePOS").click()
                            $("#ordersModal").modal("hide")
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
                    }
                ], title: "&nbsp;"}],
            editable: "popup",
            pageable: {
                pageSize: 5,
                pageSizes: [8, 10, 50, 100, 500],
            },
            groupable: true,
            sortable: true,
            resizable: true,
            reorderable: true,
            detailTemplate: kendo.template($("#ordersDetailTpl").html()),
            /*dataBound: function() {
                this.expandRow(this.tbody.find("tr.k-master-row").first());
            },*/
            detailInit: ordersDetailInit,
            remove: function(e){
                ordersDs.unbind("sync")
                $.post("data/removeOrder.php",{orderId: e.model.order_id}, function () {
                    logType = "Order Void";
                    logJson = {"Client Name" : e.model.Attendees[0][0], "Transaction Date": kendo.toString(e.model.order_date, "D"), "Transaction Amount" : moneyIt(e.model.order_total)}
                    var grid = $("#logsGrid").data("kendoGrid");
                    grid.addRow();

                    cashOnHand()
                    totalOrders()

                    if(orderId == e.model.order_id)
                        newTransaction()
                })

            }
        });
    }
}