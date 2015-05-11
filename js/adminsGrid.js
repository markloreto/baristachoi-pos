function loadAdmins(){
    $('#adminsModal').modal("show");

    if(adminsLoaded  == false){
        adminsLoaded  = true;

        $("#adminsGrid").kendoGrid({
            dataSource: adminsDs,
            autoBind: true,
            toolbar: ["create"],
            columns: [
                { field:"admin_photo", title: "Photo", template: "<img src='#= admin_photo #'>",
                    editor: function(container, options) {
                        var img = options.model.admin_photo
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
                { field:"admin_name", title: "Name"},
                { field:"admin_password", title: "Password", hidden: true,
                    editor: function(container, options) {
                        // create an input element
                        var input = $("<input/>");
                        // set its name to the field to which the column is bound ('name' in this case)
                        input.attr("name", options.field);
                        input.attr("type", "password")
                        input.attr("class", "k-input k-textbox")
                        // append it to the container
                        input.appendTo(container);
                        // initialize a Kendo UI AutoComplete
                    }
                },
                { field:"admin_role", title: "Role",
                    editor: function(container, options){
                        // create an input element
                        var input = $("<input/>");
                        // set its name to the field to which the column is bound ('name' in this case)
                        input.attr("name", options.field);
                        // append it to the container
                        input.appendTo(container);
                        // initialize a Kendo UI AutoComplete

                        input.kendoDropDownList({
                            dataSource: ["Cashier", "Admin"],
                            /*optionLabel: "All"*/
                        });
                    }
                },
                { command: ["edit", "destroy"], title: "&nbsp;"}
            ],
            sortable: true,
            editable: "popup",
            remove: function(e) {
                if(e.model.admin_id == 1){
                    notification.show({
                        subject: "I'm the Super Admin!",
                        message: "This Admin can't be remove from the list",
                        icon: "warning sign",
                        color: "red"
                    }, "message");
                    e.preventDefault();
                    adminsDs.read()
                }
                else{
                    $.post("data/defaultAdmin.php",{adminId: e.model.admin_id}, function () {
                        logType = "Admin "+e.model.admin_role;
                        var grid = $("#logsGrid").data("kendoGrid");
                        grid.addRow();
                    })
                }
            }
        });
    }
    else{

    }
}