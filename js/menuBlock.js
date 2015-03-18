function menuPageSelected(page){
    $('.menuPage:not(:hidden)').transition({
        animation  : 'fade out',
        duration   : 100,
        queue : false,
        onComplete : function() {
            $('#' + page).transition({
                queue : false,
                animation  : 'fade in',
                duration   : 500
            })
        }
    })
}



$(document).ready(function(){
    $('.menu a.item').on('click', function() {
        if($(this).hasClass('theMainMenu')) {


            if($(this).parent().attr("id") == "mainMenu"){
                if($.trim($(this).text()) == "Point of Sale" && !$(this).hasClass("active"))
                    menuPageSelected("POSPage")
                if($.trim($(this).text()) == "Dashboard" && !$(this).hasClass("active"))
                    menuPageSelected("dashboardPage")
                if($.trim($(this).text()) == "Clients" && !$(this).hasClass("active"))
                    menuPageSelected("usersPage")
                if($.trim($(this).text()) == "Products / Inventory" && !$(this).hasClass("active"))
                    menuPageSelected("productsPage")
            }
            $(this).addClass('active').closest('.ui.menu').find('.item').not($(this)).removeClass('active');
        }
    });

    $('.menu a.item')
        .popup({
            inline   : true,
            hoverable: true,
            position : 'bottom left',
            delay: {
                show: 300,
                hide: 800
            }
        })
    ;
});