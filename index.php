<!DOCTYPE html>
<html>
<head>
    <!-- Standard Meta -->
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">

    <!-- Site Properities -->
    <title>.: Barista Choi POS :.</title>

    <link rel="stylesheet" type="text/css" href="kendostyles/kendo.common.min.css"/>
    <link rel="stylesheet" type="text/css" href="kendostyles/kendo.uniform.min.css"/>
    <link rel="stylesheet" type="text/css" href="dist/semantic.css"/>
    <link rel="stylesheet" type="text/css" href="css/my.css"/>

    <script src="js/jquery-2.1.3.min.js"></script>
    <script src="kendojs/kendo.all.min.js"></script>
    <script src="dist/semantic.js"></script>

    <!-- JS BLOCK -->
    <script src="js/menuBlock.js"></script>
    <script src="js/productSearchBlock.js"></script>
    <script src="js/checkoutBlock.js"></script>
</head>
<body>
<div class="ui menu pointing inverted" id="mainMenu">
    <a class="active item">
        <i class="dashboard icon"></i> Dashboard
    </a>
    <a class="item" onclick="toggleFullScreen()">
        <i class="desktop icon"></i> Point of Sale
    </a>
    <div class="right menu">
        <div class="item">
            <div class="ui inverted icon input">
                <input type="text" placeholder="Search...">
                <i class="search link icon"></i>
            </div>
        </div>
    </div>
</div>

<div id="dashboardPage" class="menuPage">
    <div class="ui grid horizontally padded">
        <div class="sixteen wide column">
            <div class="ui segment" style="height: 84vh">
                Lorem Ipsum
            </div>
        </div>
    </div>
</div>

<div id="POSPage" class="menuPage dn">
    <div class="ui three grid horizontally padded stackable">
        <div class="seven wide column">
            <div class="ui segment yellow" style="height: 100%">
                <div>
                    <input id="productSearch" title="Product Search">
                    <div class="ui horizontal divider">
                        Or
                    </div>
                    <div align="right" style="width: 150px; float: left" id="categoryButtons">
                        <div class="ui animated button">
                            <div class="visible content">All Products</div>
                            <div class="hidden content">
                                <i class="right arrow icon"></i>
                            </div>
                        </div>
                        <div class="ui animated button">
                            <div class="visible content">Featured Products</div>
                            <div class="hidden content">
                                <i class="right arrow icon"></i>
                            </div>
                        </div>
                        <div class="ui animated button">
                            <div class="visible content">Machines</div>
                            <div class="hidden content">
                                <i class="right arrow icon"></i>
                            </div>
                        </div>
                        <div class="ui animated button">
                            <div class="visible content">Powders</div>
                            <div class="hidden content">
                                <i class="right arrow icon"></i>
                            </div>
                        </div>
                        <div class="ui animated button">
                            <div class="visible content">Parts</div>
                            <div class="hidden content">
                                <i class="right arrow icon"></i>
                            </div>
                        </div>
                        <div class="ui animated button">
                            <div class="visible content">Misc</div>
                            <div class="hidden content">
                                <i class="right arrow icon"></i>
                            </div>
                        </div>
                    </div>
                    <div style="float: right">

                        <div id="productlistView"></div>
                        <div id="pager" class="k-pager-wrap"></div>

                    </div>
                </div>
            </div>
        </div>
        <div class="five wide column" style="margin-bottom: 30px">
            <div class="ui segment yellow">
                <div class="ui segment inverted">
                    <i class="shop icon large"></i> Shopping Cart
                    <span class="ui orange circular label mini" style="float: right">
                        <a class="ui black circular label mini">3</a> cart items
                    </span>

                </div>
                <div class="ui segment black" id="cartItems">
                    <div class="ui divided list">
                        <div class="item">
                            <div class="right floated compact ui"><b class="ui right ribbon label">₱300.00</b></div>
                            <div class="ui rotate reveal image left" style="float: left; border: 1px dashed #808080l;">
                                <img class="ui avatar image visible content" src="images/products/caramel.jpg">
                                <img class="ui avatar image hidden content" src="images/products/caramel.jpg">
                            </div>
                            <div class="content">
                                <div class="header">
                                    <div class="ui vertical animated button tiny">
                                        <div class="hidden content"><i class="edit icon"></i></div>
                                        <div class="visible content">
                                            2000x
                                        </div>
                                    </div><span>Milky Choco Loco</span>
                                </div>
                                <div class="description">@ ₱170 / kg </div>
                            </div>
                        </div>
                        <div class="item">
                            <div class="right floated compact ui"><b class="ui right ribbon label">₱300.00</b></div>
                            <div class="ui rotate reveal image left" style="float: left; border: 1px dashed #808080l;">
                                <img class="ui avatar image visible content" src="images/products/caramel.jpg">
                                <img class="ui avatar image hidden content" src="images/products/caramel.jpg">
                            </div>
                            <div class="content">
                                <div class="header">
                                    <div class="ui vertical animated button tiny">
                                        <div class="hidden content"><i class="edit icon"></i></div>
                                        <div class="visible content">
                                            2000x
                                        </div>
                                    </div><span>Milky Choco Loco</span>
                                </div>
                                <div class="description">@ ₱170 / kg </div>
                            </div>
                        </div>
                        <div class="item">
                            <div class="right floated compact ui"><b class="ui right ribbon label">₱300.00</b></div>
                            <div class="ui rotate reveal image left" style="float: left; border: 1px dashed #808080l;">
                                <img class="ui avatar image visible content" src="images/products/caramel.jpg">
                                <img class="ui avatar image hidden content" src="images/products/caramel.jpg">
                            </div>
                            <div class="content">
                                <div class="header">
                                    <div class="ui vertical animated button tiny">
                                        <div class="hidden content"><i class="edit icon"></i></div>
                                        <div class="visible content">
                                            2000x
                                        </div>
                                    </div><span>Milky Choco Loco</span>
                                </div>
                                <div class="description">@ ₱170 / kg </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="ui label huge" style="float: right">
                    <i class="money icon large"></i> ₱2300.00
                </div>
            </div>
        </div>
        <div class="four wide column">
            <div class="ui segment yellow">
                <h4 class="ui dividing header">Checkout</h4>
                <div class="ui styled accordion" id="checkoutAccordion">
                    <div class="active title">
                        <i class="dropdown icon"></i>
                        <i class="user icon"></i>Client Information
                    </div>
                    <div class="active content">
                        <input id="userSearch" title="Product Search">
                        <div class="ui items">
                            <div class="item">
                                <a class="ui tiny image">
                                    <img src="images/profile/stock.jpg">
                                </a>
                                <div class="content">
                                    <a class="header tiny">Stevie Feliciano Jr.</a>
                                    <div class="meta">
                                        <span class="category">Barista Choi</span>
                                    </div>
                                    <div class="description">
                                        <a>View</a> | <a>Edit</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="ui celled list">
                            <a class="item ">
                                <i class="thumbs outline down icon small circular red inverted large"></i>
                                <div class="content">
                                    <div class="header"><span style="color: red">3</span> issues needs to resolve</div>

                                    <div class="ui text shape">
                                        <div class="sides">
                                            <div class="active ui side">Address is empty</div>
                                            <div class="ui side">Client contact is empty</div>
                                            <div class="ui side">Update Information</div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                            <a class="item">
                                <i class="announcement red outline icon small circular inverted large"></i>
                                <div class="content">
                                    <div class="header"><span style="color: red">4</span> active reminders</div>
                                    <div class="ui text shape">
                                        <div class="sides">
                                            <div class="active ui side">Inform about plastic</div>
                                            <div class="ui side">Give Ecobag</div>
                                            <div class="ui side">Inform new Flavor: Choco Brown</div>
                                            <div class="ui side">Inform Branch Close</div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                    <div class="title">
                        <i class="dropdown icon"></i>
                        <i class="configure icon"></i>Extended Options
                    </div>
                    <div class="content">
                        <p>There are many breeds of dogs. Each breed varies in size and temperament. Owners often select a breed of dog that they find to be compatible with their own lifestyle and desires from a companion.</p>
                    </div>
                    <div class="title">
                        <i class="dropdown icon"></i>
                        <i class="payment icon"></i>Payment
                    </div>
                    <div class="content">
                        <p>Three common ways for a prospective owner to acquire a dog is from pet shops, private owners, or shelters.</p>
                        <p>A pet shop may be the most convenient way to buy a dog. Buying a dog from a private owner allows you to assess the pedigree and upbringing of your dog before choosing to take it home. Lastly, finding your dog from a shelter, helps give a good home to a dog who may not find one so readily.</p>
                    </div>
                </div>
            </div>
        </div>

    </div>
</div>


<div class="ui icon menu mini bottom fixed yellow">

    <a class="red item">
        v5.10
    </a>

    <div class="right menu">
        <a class="red item">
            <i class="mail icon"></i>
        </a>
        <a class="teal item">
            <i class="lab icon"></i>
        </a>
        <a class="green item">
            <i class="star icon"></i>
        </a>
    </div>
</div>

<!-- Templates -->
<script type="text/x-kendo-template" id="productSearchTpl">
        <div class="ui divided items">
            <div class="item">
                <div class="ui tiny image bordered">
                    <img src="#:data.product_image #" />
                </div>
                <div class="middle aligned content">
                    <a class="header">#:data.product_name#</a>
                    <div class="meta">
                        <div class=""><a class="ui #: colorLevel(data.product_stock) # label">#: data.product_stock #</a> #: add_S(data.product_unit_name, data.product_stock) # left <a class="ui label tag right floated large">₱ #: data.product_price #</a></div>
                    </div>
                </div>
            </div>
        </div>
</script>

<script type="text/x-kendo-template" id="userSearchTpl">
    <div class="ui divided items">
        <div class="item">
            <div class="ui tiny image bordered">
                <img src="#:data.user_photo #" />
                <div align="center">Barista Choi</div>
            </div>
            <div class="middle aligned content">
                <a class="header">#:data.user_name#</a>
                <div class="ui divided list" style="position: relative; top: -5px">
                    <div class="item">
                        <i class="home icon"></i>
                        <div class="content">
                            <div class="meta">#:data.user_barangay #</div>
                        </div>
                    </div>
                    <div class="item">
                        <i class="call square icon"></i>
                        <div class="content">
                            <div class="meta">#:data.user_contact #</div>
                        </div>
                    </div>
                    <div class="item">
                        <i class="star icon"></i>
                        <div class="content">
                            <div class="meta">#:data.user_status #</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</script>

<script type="text/x-kendo-template" id="productTemplate">
    <div class="productPs">
        <div class="ui image small dimmable">
            <div class="ui dimmer">
                <div class="content" align="center">
                    <div class="center">
                        <div class="ui animated fade button inverted yellow">
                            <div class="visible content">₱#:data.product_price#</div>
                            <div class="hidden content">
                                Add to Cart
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <img src="#= data.product_image #" />
        </div>

        <div class="darklabel">
            <div class="thelabel">&nbsp;</div>
            <div class="thedescription">#= addEllipses(data.product_name, 16) #</div>
        </div>
    </div>
</script>

<script>
    var isFullScr = false;
    function isFullScreen() {
        isFullScr = true
        console.log(isFullScr)
    }

    function notFullScreen() {
        isFullScr = false;
        if($("#POSPage").hasClass("visible")){
            $("#mainMenu a:first").click()
        }
        console.log(isFullScr)
    }
    document.addEventListener("fullscreenchange", function () {
        if (document.fullscreen) {
            isFullScreen();
        } else {
            notFullScreen();
        }
    }, false);

    document.addEventListener("mozfullscreenchange", function () {
        if (document.mozFullScreen) {
            isFullScreen();
        } else {
            notFullScreen();
        }
    }, false);

    document.addEventListener("webkitfullscreenchange", function () {
        if (document.webkitIsFullScreen) {
            isFullScreen();
        } else {
            notFullScreen();
        }
    }, false);

    function toggleFullScreen() {
        if(!isFullScr){
            if ((document.fullScreenElement && document.fullScreenElement !== null) ||
                (!document.mozFullScreen && !document.webkitIsFullScreen)) {
                if (document.documentElement.requestFullScreen) {
                    document.documentElement.requestFullScreen();
                } else if (document.documentElement.mozRequestFullScreen) {
                    document.documentElement.mozRequestFullScreen();
                } else if (document.documentElement.webkitRequestFullScreen) {
                    document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
                }
            } else {
                if (document.cancelFullScreen) {
                    document.cancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                }
            }
        }

    }

    $(function() {
        $('.shape').shape();
        setInterval(function(){
            $('.shape').shape('flip up');
        },4000)
    });
</script>


<script>
    function add_S(str, num){
        if(num > 1)
            return str+"s";
        else
            return str
    }

    function colorLevel(num){
        if(num == 0)
            return "red";
        else
            return "green"
    }

    function addEllipses(txt, limit){
        if(txt.length > limit){
            txt = txt.slice(0,15);
            txt = txt + "...";
            return txt;
        }
        else{
            return txt;
        }
    }
</script>
</body>
</html>