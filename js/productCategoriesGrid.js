function loadProductCategories(){
    $('#productCategoriesModal').modal("show");

    if(productsGridLoaded == false){
        productsGridLoaded = true;

        $("#productCategoriesGrid").kendoGrid({
            dataSource: productCategoriesDs,
            autoBind: true,
            pageable: true,
            toolbar: ["create"],
            columns: [
                { field:"category_name", title: "Category Name" },
                { command: ["edit", "destroy"], title: "&nbsp;"}],
            sortable: true,
            editable: "popup"
        });
    }
    else{

    }
}