$(document).ready(function() {
    var userDs = new kendo.data.DataSource({
        pageSize: 6,
        serverFiltering: true,
        transport: {
            read: {
                url: "data/users.php",
                dataType: "json",
                type: "post",
            },
            parameterMap: function(data) {
                return kendo.stringify(data);
            }
        },
        schema: {
            data: function(response) {
                return response.data; // twitter's response is { "results": [ /* results */ ] }
            }
        }
    });

    $('#checkoutAccordion').accordion();

    $("#userSearch").css({width: "100%"}).kendoComboBox({
        placeholder: "Search for Clients",
        dataTextField: "user_name",
        dataValueField: "user_id",
        filter: "contains",
        autoBind: false,
        height:500,
        template: kendo.template($("#userSearchTpl").html()),
        dataSource: userDs
    });
})
