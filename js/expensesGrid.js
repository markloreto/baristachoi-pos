function loadExpenses(){
    $('#expensesModal').modal("show");

    if(expensesGridLoaded  == false){
        expensesGridLoaded  = true;

        $("#expensesGrid").kendoGrid({
            dataSource: expensesDs,
            autoBind: true,
            pageable: true,
            filterable: {
                mode: "row"
            },
            excel: {
                fileName: "Expenses.xlsx",
                proxyURL: "http://demos.telerik.com/kendo-ui/service/export",
                filterable: true
            },
            pdf: {
                fileName: "Expenses.pdf",
                proxyURL: "http://demos.telerik.com/kendo-ui/service/export"
            },
            toolbar: ["create", "excel", "pdf", {template: '<a class="k-button" href="\\#" onclick="expensesDs.filter([])">Clear Filters</a>'}],
            columns: [
                { field:"expense_date", title: "Date", format: "{0:D}"},
                { field:"expense_received_by", title: "Received By", editor:
                    function(container, options){
                        var input = $('<div class="ui search focus"/>');
                        input.html('<div class="ui icon input small"><input required="required" class="prompt" type="text" placeholder="" autocomplete="off" name="'+options.field+'" style="width: auto"><i class="search icon"></i></div><div class="results"></div>')
                        // set its name to the field to which the column is bound ('name' in this case)
                        input.search({
                            apiSettings: {
                                url: 'data/autoComplete.php?q={query}&table=expenses&field=expense_received_by'
                            },
                            searchDelay: 500
                        })

                        input.appendTo(container);
                    }},
                { field:"expense_login_user", title: "Received From", template : "#= getAdminName(expense_login_user)#", editable: false},
                { field:"expense_description", title: "Description", editor:
                    function(container, options){
                        var input = $('<div class="ui search focus"/>');
                        input.html('<div class="ui icon input small"><input required="required" class="prompt" type="text" placeholder="" autocomplete="off" name="'+options.field+'" style="width: auto"><i class="search icon"></i></div><div class="results"></div>')
                        // set its name to the field to which the column is bound ('name' in this case)
                        input.search({
                            apiSettings: {
                                url: 'data/autoComplete.php?q={query}&table=expenses&field=expense_description'
                            },
                            searchDelay: 500,
                            onSelect: function(){
                                setTimeout(function () {
                                    input.find("input").change()
                                },100)
                            }
                        })

                        input.appendTo(container);
                    }},
                { field:"expense_amount", title: "Amount", template: "#=kendo.toString(expense_amount, 'c')#"},
                { command: ["edit", "destroy"], title: "&nbsp;", width: "22%"}],
            sortable: true,
            groupable: true,
            editable: "popup"
        });
    }
    else{

    }
}