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
            editable: "popup"
        });
    }
    else{

    }
}