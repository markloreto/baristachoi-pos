function loadClients(){
    if(clientsGridLoaded == false){
        clientsGridLoaded = true;

        //userDs.filter({ field: "user_id", operator: "neq", value: 0 })
        $("#clientsGrid").kendoGrid({
            dataSource: userDs,
            autoBind: true,
            pageable: true,
            filterable: {
                mode: "row"
            },
            excel: {
                fileName: "Clients.xlsx",
                proxyURL: "http://demos.telerik.com/kendo-ui/service/export",
                filterable: true
            },
            pdf: {
                fileName: "Clients.pdf",
                proxyURL: "http://demos.telerik.com/kendo-ui/service/export"
            },
            toolbar: ["create", "excel", "pdf",{template: '<a class="k-button" href="\\#" onclick="userDs.filter([])">Clear Filters</a>'}],
            columns: [
                { field:"user_photo", title: "Photo", template: "#= profilePhoto(data.user_photo) #", hidden: true,
                    editor: function(container, options) {
                        var img = options.model.user_photo
                        if(img == "")
                            img = "images/nophoto.jpg";
                        // create an input element
                        var input = $("<input/>");
                        var photo = $("<img/>");

                        // set its name to the field to which the column is bound ('name' in this case)
                        input.attr("name", options.field).attr("type", "hidden").attr("value", img)

                        photo.attr("src", img).attr("class", "profile-photo").attr("width", 80).attr("height", 80).click(function () {
                            openMedia("Profile Photos", "data/profilePics.php", "profile", $(this).parent().find("input"))

                            $(".k-overlay").transition('scale')
                            $(".k-overlay").next().transition('scale');

                        }).load(function () {
                            $(this).parent().find("input").val(img);
                            $(this).parent().find("input").change()
                        })
                        // append it to the container

                        input.appendTo(container);
                        photo.appendTo(container);
                    }
                },
                { field:"user_name", title: "Name" },
                { field:"user_address", title: "Address" },
                { field:"user_contact", title: "Contact Info" },
                { field:"user_group", title: "Group", editor: groupsDropDownEditor, template: "#=getGroupName(user_group)#", width: 250,
                    filterable: {
                        cell: {
                            template: function (args) {
                                args.element.kendoDropDownList({
                                    dataSource: groupDs,
                                    valuePrimitive: true,
                                    dataTextField: "group_name",
                                    dataValueField: "group_id",
                                    optionLabel: {
                                        group_name: "Select a Group",
                                        group_id: 0
                                    }
                                });
                            },
                            showOperators: false,


                        },

                    }
                },
                { field:"user_date", title: "Date Registered", format: "{0:D}" },
                { field:"user_barangay", title: "Barangay",
                    editor: brgyEditor
                },
                { command: ["edit", "destroy"], title: "&nbsp;"}
            ],
            editable: "popup",
            pageable: {
                pageSize: 5,
                pageSizes: [8, 10, 50, 100, 500],
            },
            groupable: true,
            sortable: true,
            resizable: true,
            reorderable: true,
            save: function(e) {
                var dropdownlist = $("#userSearch").data("kendoComboBox");
                var nametmp = dropdownlist.value()

                if(e.model.user_id == nametmp && e.model.user_id != ""){
                    loadClientFullInfo(nametmp)
                }
                try{
                    var grid = $("#ordersGrid").data("kendoGrid");
                    grid.refresh();

                }catch(e){}

            },
            remove: function(e) {
                if(e.model.user_id == 1){
                    notification.show({
                        subject: "Oh! not him!",
                        message: "Anonymous is a protected client, please do not remove him",
                        icon: "warning sign",
                        color: "red"
                    }, "message");
                    e.preventDefault();
                    userDs.read()
                }
                else{
                    $.post("data/removeUser.php",{userId: e.model.user_id}, function () {
                        logType = "Client Removed";
                        logJson = {"Client ID" : e.model.user_id, "Client Name" : e.model.user_name}
                        var grid = $("#logsGrid").data("kendoGrid");
                        grid.addRow();
                    })
                }
            },
            dataBinding: function(e){
                totalClientThisMonth()
            },
            detailTemplate: kendo.template($("#usersDetailTpl").html()),
            detailInit: usersDetailInit
        });


    }
    else{
        //userDs.filter({ field: "user_id", operator: "neq", value: 0 })
    }
}