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
            console.log(dataItem); // displays "Jane Doe"
        }
    });

    //datepicker
    $("#orderDate").kendoDatePicker({
        value: new Date(Date.now())
    });
})
