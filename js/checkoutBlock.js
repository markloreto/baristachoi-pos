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
            loadClientFullInfo(this.value())
        }
    });

    $("#userSearch").prev().find("input").focus(function () {
        userDs.filter([])
        userDs.fetch(function () {
            var dropdownlist = $("#userSearch").data("kendoComboBox");
            dropdownlist.value("")
            orAddNewClient()
            clientValueTmp = "";
        })

    })

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
        toolbar: ["create"],
        columns: [
            { field:"payment_date", title: "Date", width: "24%", format: "{0:MM/dd/yyyy}" },
            { field: "payment_type", hidden: true, title:"Type", width: "18%", editor: function(container, options) {
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

    // fees grid
    $("#feesGrid").kendoGrid({
        dataSource: feesBlank,
        autoBind: true,
        toolbar: ["create"],
        columns: [
            { field: "fee_name", title:"Name", editor:
                function(container, options){
                    var input = $('<div class="ui search focus"/>');
                    input.html('<div class="ui icon input small"><input required="required" class="prompt" type="text" placeholder="" autocomplete="off" name="'+options.field+'" style="width: auto"><i class="search icon"></i></div><div class="results"></div>')
                    // set its name to the field to which the column is bound ('name' in this case)
                    input.search({
                        apiSettings: {
                            url: 'data/autoComplete.php?q={query}&table=fees&field=fee_name'
                        },
                        searchDelay: 500,
                        onSelect: function(){
                            setTimeout(function () {
                                input.find("input").change()
                            },100)
                        }
                    })

                    input.appendTo(container);
                }
            },
            { field: "fee_amount", title:"Amount", format: "{0:c}"},
            { command: ["edit", "destroy"], title: "&nbsp;", width: "33%" }],
        editable: "popup",
        dataBound: function(e) {
            calcTotalFees(this.dataSource.data())
        }
    });
    //paymentsDs.filter( { field: "payment_order_id", operator: "eq", value: "" });
})
