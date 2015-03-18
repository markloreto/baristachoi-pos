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
            excel: {
                fileName: "Clients.xlsx",
                proxyURL: "http://demos.telerik.com/kendo-ui/service/export",
                filterable: true
            },
            pdf: {
                fileName: "Clients.pdf",
                proxyURL: "http://demos.telerik.com/kendo-ui/service/export"
            },
            toolbar: ["create", "excel", "pdf"],
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
                { field:"user_status", title: "Status" },
                { field:"user_date", title: "Date Registered", format: "{0:D}" },
                { field:"user_barangay", title: "Barangay",
                    editor: function(container, options) {
                        // create an input element
                        var input = $('<div class="ui category search focus" id="brgySearch"/>');
                        input.html('<div class="ui icon input medium"><input class="prompt" type="text" placeholder="Search Barangays..." autocomplete="off" name="'+options.field+'" style="width: auto"><i class="search icon"></i></div><div class="results"></div>')
                        // set its name to the field to which the column is bound ('name' in this case)
                        var timer;
                        input.search({
                            apiSettings: {
                                url: 'data/barangays.php?q={query}'
                            },
                            searchDelay: 500,
                            type: 'category',
                            onSelect: function(a,b){
                                var text = input.find(".category .result.active").parent().find("div.name").text();
                                if(text != ""){
                                    setTimeout(function () {
                                        var val = input.find("input").val()
                                        input.find("input").val(val + ", " + text)
                                        input.find("input").change()
                                    },100)

                                }

                            },
                            onResultsAdd: function(){
                                try{
                                    clearTimeout(timer)
                                }
                                catch(e){}
                                timer = setTimeout(function () {
                                    input.find(".category .result").click(function () {
                                        var text = $(this).parent().find("div.name").text();
                                        setTimeout(function () {
                                            var val = input.find("input").val()
                                            input.find("input").val(val + ", " + text)
                                            input.find("input").change()
                                        },100)
                                    })
                                },1000)

                            }
                        })

                        input.appendTo(container);
                    }
                },
                { command: ["edit", "destroy"], title: "&nbsp;"}],
            editable: "popup",
            pageable: {
                pageSize: 5,
                pageSizes: [8, 10, 50, 100, 500],
            },
            groupable: true,
            sortable: true,
            resizable: true,
            reorderable: true
        });


    }
    else{
        userDs.filter({ field: "user_id", operator: "neq", value: 0 })
    }
}