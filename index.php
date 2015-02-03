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
</head>
<body>
<div class="ui menu pointing inverted" id="mainMenu">
    <a class="active item">
        <i class="dashboard icon"></i> Dashboard
    </a>
    <a class="item">
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
                    <input id="productSearch"/>
                    <div class="ui horizontal divider">
                        Or
                    </div>
                    <div align="right" style="width: 150px; float: left" id="categoryButtons">
                        <div class="ui yellow animated button">
                            <div class="visible content">All Products</div>
                            <div class="hidden content">
                                <i class="right arrow icon"></i>
                            </div>
                        </div>
                        <div class="ui yellow animated button">
                            <div class="visible content">Machines</div>
                            <div class="hidden content">
                                <i class="right arrow icon"></i>
                            </div>
                        </div>
                        <div class="ui yellow animated button">
                            <div class="visible content">Powders</div>
                            <div class="hidden content">
                                <i class="right arrow icon"></i>
                            </div>
                        </div>
                        <div class="ui yellow animated button">
                            <div class="visible content">Parts</div>
                            <div class="hidden content">
                                <i class="right arrow icon"></i>
                            </div>
                        </div>
                        <div class="ui yellow animated button">
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
                    <i class="shop icon large"></i>
                    <span class="ui orange circular label mini">
                        <a class="ui black circular label mini">3</a> cart items
                    </span>

                </div>
                <div class="ui segment black" id="cartItems">
                    <div class="ui divided list">
                        <div class="item">
                            <div class="right floated compact ui"><a class="ui right ribbon label yellow">₱300.00</a></div>
                            <img class="ui avatar image" src="images/products/caramel.jpg">
                            <div class="content">
                                <div class="header">
                                    <div class="ui vertical animated button tiny">
                                        <div class="hidden content"><i class="edit icon"></i></div>
                                        <div class="visible content">
                                            2000x
                                        </div>
                                    </div>
                                    <span>Milky Choco Loco</span>
                                </div>
                                <div class="description">@ 170 / kg </div>
                            </div>

                        </div>
                        <div class="item">
                            <div class="right floated compact ui"><a class="ui right ribbon label yellow">₱300.00</a></div>
                            <img class="ui avatar image" src="images/products/caramel.jpg">
                            <div class="content">
                                <div class="header">
                                    <div class="ui vertical animated button tiny">
                                        <div class="hidden content"><i class="shop icon"></i></div>
                                        <div class="visible content">
                                            2000x
                                        </div>
                                    </div><span>Milky Choco Loco</span>
                                </div>
                                <div class="description">@ 170 / kg </div>
                            </div>

                        </div>
                        <div class="item">
                            <div class="right floated compact ui"><a class="ui right ribbon label yellow">₱300.00</a></div>
                            <img class="ui avatar image" src="images/products/caramel.jpg">
                            <div class="content">
                                <div class="header">
                                    <div class="ui vertical animated button tiny">
                                        <div class="hidden content"><i class="shop icon"></i></div>
                                        <div class="visible content">
                                            2000x
                                        </div>
                                    </div><span>Milky Choco Loco</span>
                                </div>
                                <div class="description">@ 170 / kg </div>
                            </div>

                        </div>
                    </div>
                </div>
                <h3 class="ui right floated header green">
                    ₱3000.00
                </h3>
                <h4 class="ui left floated header">
                    TOTAL:
                </h4>
            </div>
        </div>
        <div class="four wide column">
            <div class="ui segment yellow" style="height: 84vh; ">
                <p></p>
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
                        <div class=""><a class="ui #: colorLevel(data.product_stock) # label">#: data.product_stock #</a> #: add_S(data.product_unit_name, data.product_stock) # left <a class="ui label tag right floated yellow large">₱ #: data.product_price #</a></div>
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
    $(function() {





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