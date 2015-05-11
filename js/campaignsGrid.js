function loadCampaigns(){
    $('.ui.modal.campaigns').modal("show");

    if(campaignsGridLoaded == false){
        campaignsGridLoaded = true;

        $("#campaignsGrid").kendoGrid({
            dataSource: campaignDs,
            autoBind: true,
            pageable: true,
            filterable: {
                mode: "row"
            },
            sortable: true,
            toolbar: ["create", {template: '<a class="k-button" href="\\#" onclick="campaignDs.filter([])">Clear Filters</a>'}],
            columns: [
                { field:"campaign_subject", title: "Subject", width: "40%" },
                { field:"campaign_start", title: "Start Date", format: "{0:D}" },
                { field:"campaign_end", title: "End Date", format: "{0:D}" },
                { command: ["edit", "destroy"], title: "&nbsp;"}],
            sortable: true,
            editable: "popup",
            detailTemplate: kendo.template($("#campaignsDetailTpl").html()),
            detailInit: campaignsDetailInit,
            remove: function(e){
                $.post("data/removeCampaign.php",{campaignId: e.model.campaign_id}, function () {
                    logType = "Campaign Remove";
                    logJson = {"Campaign Name" : e.model.campaign_subject}
                    var grid = $("#logsGrid").data("kendoGrid");
                    grid.addRow();
                })

            }
        });
    }
    else{

    }
}