function loadWarranties(){
    $('#warrantiesModal').modal("show")
    if(warrantiesLoaded == false){
        warrantiesLoaded = true;

        $("#warrantiesGrid").kendoGrid({
            dataSource: warrantiesDs,
            autoBind: true,
            pageable: true,
            filterable: {
                mode: "row"
            },
            excel: {
                fileName: "Warranties.xlsx",
                proxyURL: "http://demos.telerik.com/kendo-ui/service/export",
                filterable: true
            },
            pdf: {
                fileName: "Warranties.pdf",
                proxyURL: "http://demos.telerik.com/kendo-ui/service/export"
            },
            toolbar: ["create", "excel", "pdf", {template: '<a class="k-button" href="\\#" onclick="warrantiesDs.filter([])">Clear Filters</a>'}],
            columns: [
                { field:"warranty_serial", title: "Serial "},
                { field:"warranty_user_id", title: "Client Name", template: "#=getAttendees(data, 0)#", editor: warratyUserEditor,
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
                { field:"warranty_machine_type", title: "Machine Type", editor:
                    function(container, options){
                        var input = $('<div class="ui search focus"/>');
                        input.html('<div class="ui icon input small"><input required="required" class="prompt" type="text" placeholder="" autocomplete="off" name="'+options.field+'" style="width: auto"><i class="search icon"></i></div><div class="results"></div>')
                        // set its name to the field to which the column is bound ('name' in this case)
                        input.search({
                            apiSettings: {
                                url: 'data/autoComplete.php?q={query}&table=warranties&field=warranty_machine_type'
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
                { field:"warranty_machine_location", title: "Machine's Location",
                    editor: brgyEditor
                },
                { field:"warranty_status", title: "Status",
                    filterable: {
                        cell: {
                            template: function (args) {
                                args.element.kendoDropDownList({
                                    dataSource: ["Maintained", "For Maintenance", "On Repair", "Warranty Void"],
                                    optionLabel: "All"
                                });
                            },
                            showOperators: false


                        }
                    }

                },
                { field:"warranty_maintenance_date", title: "Maintenance Date", format: "{0:D}" },
                { command: ["edit", "destroy"], title: "&nbsp;"}
            ],
            editable: "popup",
            pageable: {
                pageSize: 12,
                pageSizes: [8, 10, 50, 100, 500]
            },
            edit: function(e) {
                e.container.find("input[name='warranty_user_id']").attr("required", "required")
                // Disable the editor of the "id" column when editing data items
                var field = e.container.find("input[name='warranty_status']")//.data("kendoNumericTextBox");
                field.prop("readonly", true)//.enable(false);

                field = e.container.find("input[name='warranty_maintenance_date']").data("kendoDatePicker");
                field.enable(false);
            },
            groupable: true,
            sortable: true,
            resizable: true,
            reorderable: true,
            detailTemplate: kendo.template($("#warrantiesDetailTpl").html()),
            detailInit: warrantiesDetailInit,
            save: function(e) {
                warrantiesDs.fetch(function () {
                    //var grid = $("#warrantiesGrid").data("kendoGrid");
                    //grid.refresh();
                    warrantiesDs.sort({ field: "warranty_id", dir: "desc" })

                })


            },
            dataBinding: function(e){
                //console.log(e) // action = rebind
                var data = warrantiesDs.data()
                //console.log(data)
            }
        });
    }
}