$(document).ready(function(){
    $('.menu a.item').on('click', function() {
        if(!$(this).hasClass('dropdown')) {
            $(this).addClass('active').closest('.ui.menu').find('.item').not($(this)).removeClass('active');

            function menuPageSelected(page){
                $('.menuPage:not(:hidden)').transition({
                    animation  : 'swing down out',
                    duration   : 100,
                    queue : false,
                    onComplete : function() {
                        $('#' + page).transition({
                            queue : false,
                            animation  : 'swing down in',
                            duration   : '1s'
                        })
                    }
                })
            }

            if($(this).parent().attr("id") == "mainMenu"){
                if($.trim($(this).text()) == "Point of Sale")
                    menuPageSelected("POSPage")
                if($.trim($(this).text()) == "Dashboard")
                    menuPageSelected("dashboardPage")
            }
        }
    });
});