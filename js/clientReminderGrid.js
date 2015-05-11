function loadClientReminder(){
    $('#clientReminderModal').modal("show");

    if(clientReminderLoaded  == false){
        clientReminderLoaded  = true;

        $("#clientReminderGrid").kendoGrid({
            dataSource: remindersDs,
            autoBind: true,
            pageable: true,
            filterable: {
                mode: "row"
            },
            toolbar: ["create", {template: '<a class="k-button" href="\\#" onclick="remindersDs.filter([])">Clear Filters</a>'}],
            columns: [
                { field:"reminder_for", title: "Target Client", editor: reminderForEditor, template: "#=getAttendees(data, 0)#", width: "18%",
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
                { field:"reminder_subject", title: "Subject", width: "18%" },
                { field:"reminder_status", title: "Status", width: "12%",
                    filterable: {
                        cell: {
                            template: function (args) {
                                args.element.kendoDropDownList({
                                    dataSource: ["Pending", "Complete"],
                                    optionLabel: "All"
                                });
                            },
                            showOperators: false,


                        }
                    }
                },
                { field:"reminder_start", title: "Date Started", format: "{0:D}", width: "15%" },
                { field:"reminder_end", title: "Date Completed", format: "{0:D}", width: "15%" },
                { command: ["edit", "destroy", { text: "Set as Complete",
                    click: function(e) {
                        dataItem = remindersDs.getByUid($(e.target).parents("tr").attr("data-uid"))

                        if(dataItem.reminder_status == "Pending"){
                            dataItem.set("reminder_status", "Complete")
                            dataItem.set("reminder_end", new Date(Date.now()))
                            remindersDs.sync();

                            var dropdownlist = $("#userSearch").data("kendoComboBox");
                            var nametmp = dropdownlist.value()

                            if(dataItem.reminder_for == nametmp){
                                remindersDs.fetch(function () {
                                    reminderDetails(nametmp)
                                })

                            }
                        }

                        else{

                        }


                    }
                }], title: "&nbsp;", width: "22%"}],
            sortable: true,
            editable: "popup",
            groupable: true,
            save: function(e) {
                setTimeout(function(){
                    remindersDs.read()
                },100)
            },
            edit: function(e) {
                // Disable the editor of the "id" column when editing data items
                var field = e.container.find("input[name='reminder_status']")//.data("kendoNumericTextBox");
                field.prop("readonly", true)//.enable(false);

                field = e.container.find("input[name='reminder_end']").data("kendoDatePicker");
                field.enable(false);
            },
            save: function(e) {
                remindersDs.fetch(function () {
                    //var grid = $("#warrantiesGrid").data("kendoGrid");
                    //grid.refresh();
                    remindersDs.sort({ field: "reminder_id", dir: "desc" })

                })


            }
        });
    }
    else{

    }
}