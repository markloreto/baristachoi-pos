function loadClients(){
    if(clientsGridLoaded == false){
        clientsGridLoaded = true;

        userDs.filter({ field: "user_id", operator: "neq", value: 0 })
        $("#clientsGrid").kendoGrid({
            dataSource: userDs,
            autoBind: false,
            pageable: true,
            filterable: {
                mode: "row"
            },
            toolbar: ["create"],
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
                            $(".ui.modal.mediaz").modal('show');
                            $(".k-overlay").transition('scale')
                            $(".k-overlay").next().transition('scale');

                            openMedia("Profile Photos", "data/profilePics.php", "profile", $(this).parent().find("input"))
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
                { field:"user_group", title: "Group" },
                { field:"user_status", title: "Status" },
                { field:"user_date", title: "Date Registered", format: "{0:D}" },
                { field:"user_barangay", title: "Barangay" },
                { command: ["edit", "destroy"], title: "&nbsp;"}],
            editable: "popup",
            pageable: {
                pageSize: 5
            }
        });


    }
    else{
        userDs.filter({ field: "user_id", operator: "neq", value: 0 })
    }
}