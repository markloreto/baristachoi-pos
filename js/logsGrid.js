var logsLoaded = false;
function loadLogs(){
    $('#logsModal').modal("show")
}

$(document).ready(function () {
    $("#logsGrid").kendoGrid({
        dataSource: logsDs,
        autoBind: true,
        pageable: true,
        filterable: {
            mode: "row"
        },
        excel: {
            fileName: "Sales.xlsx",
            proxyURL: "http://demos.telerik.com/kendo-ui/service/export",
            filterable: true
        },
        pdf: {
            fileName: "Sales.pdf",
            proxyURL: "http://demos.telerik.com/kendo-ui/service/export"
        },
        toolbar: ["excel", "pdf", {template: '<a class="k-button" href="\\#" onclick="logsDs.filter([])">Clear Filters</a>'}, {template: '<a class="k-button" href="\\#" onclick="$.post(\'data/deleteLogs.php\', function(){logsDs.read()})">Delete Log Data</a>'}],
        columns: [
            { field:"log_date", title: "Log Date", format: "{0:MM/dd/yyyy hh:mm tt}"},
            { field:"log_message", title: "Message", hidden: true},
            { field:"log_type", title: "Type"},
            { field:"log_flag", title: "Flag",
                filterable: {
                    cell: {
                        template: function (args) {
                            args.element.kendoDropDownList({
                                dataSource: ["Unread", "Read"],
                                optionLabel: "All"
                            });
                        },
                        showOperators: false,


                    }
                },
                editor: function(container, options){
                    // create an input element
                    var input = $("<input/>");
                    // set its name to the field to which the column is bound ('name' in this case)
                    input.attr("name", options.field);
                    // append it to the container
                    input.appendTo(container);
                    // initialize a Kendo UI AutoComplete

                    input.kendoDropDownList({
                        dataSource: ["Unread", "Read"],
                        /*optionLabel: "All"*/
                    });
                }
            },
        ],
        editable: "popup",
        pageable: {
            pageSize: 12,
            pageSizes: [8, 10, 50, 100, 500]
        },
        groupable: true,
        sortable: true,
        resizable: true,
        reorderable: true,
        edit: function(e){
            var field = e.container.find("input[name='log_type']")//.data("kendoNumericTextBox");
            field.prop("readonly", true)//.enable(false);

            e.container.find("input[name='log_flag']").parent().hide()
            e.container.find("input[name='log_flag']").parent().prev().hide()

        },
        cancel: function(e) {
            e.preventDefault()
        },
        detailTemplate: kendo.template($("#logsDetailTpl").html()),
        detailInit: logsDetailInit,
        detailExpand: function(e) {

        }
    });
})
