function loadGroups(){
    $('.ui.modal.groups').modal("show");

    if(groupsGridLoaded == false){
        groupsGridLoaded = true;

        $("#groupsGrid").kendoGrid({
            dataSource: groupDs,
            autoBind: true,
            pageable: true,
            toolbar: ["create"],
            columns: [
                { field:"group_name", title: "Group Name" },
                { command: ["edit", "destroy"], title: "&nbsp;"}],
            sortable: true,
            editable: "popup",
            remove: function(e) {
                if(e.model.group_id == 1){
                    notification.show({
                        subject: "Default is default!!!",
                        message: "It's Important if we have a default group",
                        icon: "warning sign",
                        color: "red"
                    }, "message");
                    e.preventDefault();
                    groupDs.read()
                }
                else{
                    $.post("data/removeGroup.php",{groupId: e.model.group_id}, function () {
                        logType = "Group Removed";
                        logJson = {"Group Name" : e.model.group_name}
                        var grid = $("#logsGrid").data("kendoGrid");
                        grid.addRow();
                        userDs.filter([])
                    })
                }
            }
        });
    }
    else{

    }
}