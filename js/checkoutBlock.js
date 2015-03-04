$(document).ready(function() {
    $('#checkoutAccordion').accordion();

    $("#userSearch").css({width: "100%"}).kendoComboBox({
        placeholder: "Search for Clients",
        dataTextField: "user_name",
        dataValueField: "user_id",
        filter: "contains",
        autoBind: false,
        height:500,
        template: kendo.template($("#userSearchTpl").html()),
        dataSource: userDs,
        change: function(e) {
            var value = this.value();
            var dataItem = userDs.get(value);

            var userDetailsTpl = $("#userDetailsTpl").html();
            userDetailsTpl = userDetailsTpl.replace("[user_name]", dataItem.user_name).replace("[user_photo]", dataItem.user_photo).replace("[user_address]", dataItem.user_address)
            $("#userDetails").html(userDetailsTpl)
        }
    });

    //datepicker
    $("#orderDate").kendoDatePicker({
        value: new Date(Date.now()),
        change: function() {
            dateChanges = true
        }
    });

    // payments grid
    $("#paymentsGrid").kendoGrid({
        dataSource: paymentsBlank,
        pageable: true,
        toolbar: ["create"],
        columns: [
            { field:"payment_date", title: "Date", width: "24%", format: "{0:MM/dd/yyyy}" },
            { field: "payment_type", title:"Type", width: "18%", editor: function(container, options) {
                // create an input element
                var input = $("<input/>");
                // set its name to the field to which the column is bound ('name' in this case)
                input.attr("name", options.field);
                // append it to the container
                input.appendTo(container);
                // initialize a Kendo UI AutoComplete
                input.kendoDropDownList({
                    dataTextField: "value",
                    dataValueField: "value",
                    dataSource: [
                        { value: "Cash" },
                        { value: "Bank" },
                        { value: "Check" }
                    ]
                });
            }
            },
            { field: "payment_amount", title:"Amount", width: "25%", format: "{0:c}"},
            { field: "payment_note", title:"Notes", hidden: true, editor: function(container, options) {
                // create an input element
                var input = $("<textarea class='k-textbox'/>");
                // set its name to the field to which the column is bound ('name' in this case)
                input.attr("name", options.field);
                // append it to the container
                input.appendTo(container);
                // initialize a Kendo UI AutoComplete
            }
            },
            { command: ["edit", "destroy"], title: "&nbsp;", width: "33%" }],
        editable: "popup",
        dataBound: function(e) {
            calcTotalPayment(this.dataSource.data())
        }
    });

    //paymentsDs.filter( { field: "payment_order_id", operator: "eq", value: "" });
})
