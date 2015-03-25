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
    <link rel="stylesheet" type="text/css" href="dist/semantic.min.css"/>
    <link rel="stylesheet" type="text/css" href="css/my.css"/>

    <script src="js/jquery-2.1.3.min.js"></script>
    <script src="kendojs/jszip.min.js"></script>
    <script src="kendojs/pako_deflate.min.js"></script>
    <script src="kendojs/kendo.all.min.js"></script>
    <script src="dist/semantic.min.js"></script>

    <script src="kendojs/cultures/kendo.culture.en-PH.min.js"></script>

    <!-- JS MAIN -->
    <script>
        var cartItems = new Array();
        var settings = {"fullscreen" : false}
        var clientsGridLoaded = false;
        var groupsGridLoaded = false;
        var productsListViewLoaded = false;
        var productsGridLoaded = false
        // culture
        kendo.culture("en-PH");
    </script>
    <!-- JS BLOCK -->
    <script src="js/menuBlock.js"></script>
    <script src="js/productSearchBlock.js"></script>
    <script src="js/checkoutBlock.js"></script>
    <script src="js/cartBlock.js"></script>
    <script src="js/groupsGrid.js"></script>
    <script src="js/productCategoriesGrid.js"></script>
    <!-- PAGES -->
    <script src="js/clientsPage.js"></script>
    <script src="js/productsPage.js"></script>
    <!-- JS FUNCTION -->
    <script src="js/datasources.js"></script>
    <script src="js/fullsreen.js"></script>
    <script src="js/my.js"></script>
</head>
<body>
<div class="ui menu pointing inverted" id="mainMenu">
    <a class="active item theMainMenu">
        <i class="dashboard icon"></i> <span>Dashboard</span>
    </a>
    <a class="item theMainMenu" onclick="toggleFullScreen()">
        <i class="desktop icon"></i> <span>Point of Sale</span>
    </a>
    <a class="item theMainMenu" onclick="loadClients()">
        <i class="user icon"></i> <span>Clients</span> <i class="dropdown icon"></i>
    </a>
    <div class="ui flowing popup inverted">
        <div class="ui selection list inverted animated">
            <div class="item" onclick="loadGroups()">
                <i class="users icon"></i>
                <div class="content">
                    <div class="header">Groups Manager</div>
                    <div class="description">Categorized clients by <i>groups</i></div>
                </div>
            </div>
            <div class="item" onclick="">
                <i class="alarm outline icon"></i>
                <div class="content">
                    <div class="header">Client Reminder</div>
                    <div class="description">Manage Reminders</div>
                </div>
            </div>
            <div class="item" onclick="">
                <i class="exchange icon"></i>
                <div class="content">
                    <div class="header">Transfer Account</div>
                    <div class="description">Merge Clients into one</div>
                </div>
            </div>
        </div>
    </div>
    <a class="item theMainMenu" onclick="loadProducts()">
        <i class="archive icon"></i> <span>Products / Inventory</span> <i class="dropdown icon"></i>
    </a>
    <div class="ui flowing popup inverted">
        <div class="ui selection list inverted animated">
            <div class="item" onclick="loadProductCategories()">
                <i class="tags icon"></i>
                <div class="content">
                    <div class="header">Category Manager</div>
                    <div class="description">Manage Product Categories</div>
                </div>
            </div>
        </div>
    </div>
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
                    <div>
                        <div style="float: left; width: 21%" id="categoryButtons">
                            <div class="ui vertical buttons">
                                <div class="ui button">All Products</div>
                                <div class="ui button">Featured Products</div>
                                <div class="ui button">Machines</div>
                                <div class="ui button">Powders</div>
                                <div class="ui button">Parts</div>
                                <div class="ui button">Misc</div>
                            </div>
                        </div>
                        <div style="float: right; width: 78%">

                            <div id="productlistView"></div>
                            <div id="productListPager" class="k-pager-wrap"></div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="four wide column" style="margin-bottom: 30px">
            <div class="ui segment yellow">
                <div class="ui segment inverted">
                    <i class="shop icon large"></i> Shopping Cart
                    <span class="ui orange circular label mini fr" id="cartNumItems" onclick="removeCartItems()">
                        <a class="ui black circular label mini">0</a> cart item
                    </span>

                </div>
                <div class="ui segment black">
                    <div class="ui divided list" id="cartItems">

                        <div class="item" align="center">
                            Cart is Empty
                        </div>

                    </div>
                </div>
                <div style="margin-bottom: 10px" class="fr dn" id="totalPayments">
                    <div class="ui labeled input small right">
                        <div class="ui label">
                            Payments:
                        </div>
                        <input type="text" placeholder="" value="" readonly>
                    </div>
                </div>

                <div class="ui left action input fr massive" style="width: 100%; z-index: 20; clear: both">
                    <button class="ui labeled icon button teal disabled" id="quickPay">
                        <i class="cart icon"></i>
                        Checkout
                    </button>
                    <input type="text" value="₱0.00" readonly id="grandTotal">
                </div>
            </div>
        </div>
        <div class="five wide column">
            <div class="ui segment yellow">
                <h4 class="ui dividing header">Checkout</h4>
                <div class="ui styled accordion" id="checkoutAccordion">
                    <div class="active title">
                        <i class="dropdown icon"></i>
                        <i class="user icon"></i>Client Information
                    </div>
                    <div class="active content">
                        <input id="userSearch" title="Product Search">
                        <div id="userDetails">

                        </div>
                    </div>
                    <div class="title">
                        <i class="dropdown icon"></i>
                        <i class="configure icon"></i>Extended Options
                    </div>
                    <div class="content" style="margin-bottom: 10px">
                        <h6 class="ui top attached header inverted">
                            <i class="calendar icon"></i>Date
                        </h6>
                        <div class="ui attached segment">
                            <input id="orderDate" style="width: 100%"/>
                        </div>
                        <h6 class="ui attached header inverted">
                            <i class="shipping icon"></i>Delivery
                        </h6>
                        <div class="ui attached segment">
                            <div class="inline field">
                                <div class="ui toggle checkbox">
                                    <input type="checkbox" id="delivery">
                                    <label><i class="shipping icon"></i> Deliver</label>
                                </div>
                            </div>
                        </div>
                        <h6 class="ui attached header inverted">
                            <i class="file text outline icon"></i>Notes
                        </h6>
                        <div class="ui attached segment">
                            <div class="ui form">
                                <div class="field">
                                    <textarea id="notes"></textarea>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="title">
                        <i class="dropdown icon"></i>
                        <i class="payment icon"></i>Payment
                    </div>
                    <div class="content">
                        <div id="paymentsGrid"></div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</div>

<div id="usersPage" class="menuPage dn">
    <div class="ui grid horizontally padded">
        <div class="sixteen wide column">
            <div class="ui segment" style="height: 100%; margin-bottom: 40px;">
                <div id="clientsGrid"></div>
            </div>
        </div>
    </div>
</div>

<div id="productsPage" class="menuPage dn">
    <div class="ui grid horizontally padded">
        <div class="sixteen wide column">
            <div class="ui segment" style="height: 100%; margin-bottom: 40px;">
                <div class="demo-section k-header">
                    <div id="productsToolbar"></div>
                </div>
                <div id="productsListViewMain" class="ui grid" style="margin-top: 20px"></div>
            </div>
        </div>
    </div>
</div>


<div class="ui icon menu mini bottom fixed yellow bottomMenu">

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
                        <div class=""><a class="ui #: colorLevel(data.product_stock) # label">#: data.product_stock #</a> #: add_S(data.product_unit_name, data.product_stock) # left <a class="ui label tag right floated large">#: moneyIt(data.product_price) #</a></div>
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
            <div class="ui dimmer productItem">
                <div class="content" align="center" style="margin-left: 3px">
                    <div class="center">
                        <div class="ui animated fade button inverted yellow" onclick="clickCart($(this).parents('.productPs').index())">
                            <div class="visible content">#:moneyIt(data.product_price)#</div>
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

<div id="cartItemTemplate" class="dn">
    <div class="item">
        <div class="right floated ui" style="margin: 0px"><b class="ui right ribbon label subTotal">[product_price]</b></div>
        <div class="content fl cartItemAttr">
            <div class="circular ui icon button fl tiny itemCloseButton red">
                <i class="icon close"></i>
            </div>

            <div class="fl" style="width: 80%">
                <h4 class="ui header">
                    <div class="content">
                        [product_name]
                    </div>
                </h4>
                <div class="theUnit"><i class="at icon"></i> <span>[product_price]</span> / [product_unit_name]</div>
                <div class="ui right labeled left input medium" style="width: 100%;">
                    <input type="text" placeholder="" value="1">
                    <div class="ui label">
                        QTY
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div id="userDetailsTpl" class="dn">
    <div class="ui items">
        <div class="item">
            <a class="ui tiny image">
                <img src="[user_photo]">
            </a>
            <div class="content">
                <a class="header tiny">[user_name]</a>
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
        <div class="item">
            [user_address]
        </div>
        <div class="item">
            <i class="thumbs outline down icon red big"></i>
            <div class="content">
                <div class="header">Issues</div>
                <div class="description"><span class="reds">3</span> issues needs to resolve</div>
            </div>
        </div>
        <div class="item">
            <i class="alarm outline icon green big"></i>
            <div class="content">
                <div class="header">Reminders</div>
                <div class="description">
                    no active reminders.
                </div>
            </div>
        </div>
    </div>
</div>

<script type="text/x-kendo-template" id="mediazTpl">
    <div class="profile-photo2 fl">
        <div class="ui fluid image profilePic" style="width: 80px; height: 80px">
            <a class="ui red corner label" onclick="removeImage($(this))">
                <i class="close icon"></i>
            </a>
            <img src="#= data.filename #" data-content="Click to Select" onclick="selectedImage($(this))">
        </div>
    </div>

</script>

<script type="text/x-kendo-tmpl" id="productsTpl">

    <div class="two wide column">

        <div class="ui special card #: colorLevel(data.product_stock) # cardProductItem">
            <div class="dimmable image">
                <div class="ui dimmer">
                    <div class="content">
                        <div class="center">
                            <div class="ui buttons tiny">
                                <div class="ui button positive k-edit-button"><i class="edit icon"></i>Edit</div>
                                <div class="or"></div>
                                <div class="ui button negative k-delete-button"><i class="remove icon"></i>Remove</div>
                            </div>
                        </div>
                    </div>
                </div>
                <img src="#= data.product_image #">
            </div>

            <div class="content">
                <div class="header">
                #= data.product_name #

                </div>
                <div class="meta">
                    #= data.product_description #
                </div>
                <div style="margin-top: 10px">
                    <a class="ui #: colorLevel(data.product_stock) # label">#: data.product_stock #</a> #: add_S(data.product_unit_name, data.product_stock) # left
                </div>
            </div>
            <div class="extra content">
                <span class="ui left floated star rating" data-max-rating="3" data-rating="#: data.product_rating #" data-id="#: data.product_id #">

                </span>
                <span class="ui label tag right floated medium">#: moneyIt(data.product_price) #</span>
            </div>
        </div>

    </div>
</script>

<script type="text/x-kendo-tmpl" id="productsEditTpl">
    <div class="two wide column" style="">
        <div style="position:absolute; z-index: 9999999; border: 4px solid black; left: -15px; border-radius: 5px; top:-10px; margin-bottom: 50px">
            <div class="ui special card #: colorLevel(data.product_stock) # cardProductItemEdit">
                <div class="dimmable image">
                    <div class="ui dimmer">
                        <div class="content">
                            <div class="center">
                                <div class="ui button prodImageEdit">
                                    Edit Photo
                                </div>
                            </div>
                        </div>
                    </div>
                    <input type="hidden" data-bind="value:product_image" name="product_image" required="required" validationMessage="required">
                    <img src="#= data.product_image #" class="prodProdImg">
                </div>

                <div class="content">
                    <form class="ui form">
                        <div class="center" align="center">
                            <input type="hidden" data-bind="value:product_rating" name="product_rating">
                            <span class="ui star rating" data-max-rating="3" data-rating="#: data.product_rating #"></span>
                        </div>
                        <div class="field">
                            <label>Product Name</label>
                            <div class="ui corner labeled input fluid small">
                                <input type="text" placeholder="Product Name" data-bind="value:product_name" name="product_name" required="required" validationMessage="required">
                                <div class="ui corner label">
                                    <i class="asterisk icon"></i>
                                </div>
                            </div>
                        </div>
                        <span data-for="product_name" class="k-invalid-msg"></span>
                        <div class="field">
                            <label>Product Description</label>
                            <textarea style="width: 88%; height: auto; min-height: 0px" placeholder="Description" data-bind="value:product_description" name="product_description" required="required" validationMessage="required" rows="2"></textarea>
                        </div>
                        <span data-for="product_description" class="k-invalid-msg"></span>
                        <div class="field">
                            <label>Stocks / Inventory</label>
                            <div class="ui right labeled input small">
                                <input type="text" placeholder="Stocks" data-bind="value:product_stock" name="product_stock" required="required" validationMessage="required">
                                <div class="ui dropdown item label">
                                    <input type="hidden" data-bind="value:product_unit_name" name="product_unit_name" required="required" validationMessage="required">
                                    <div class="default text">unit</div>
                                    <i class="dropdown icon"></i>
                                    <div class="menu">
                                        <div class="item" data-value="unit" data-text="unit">unit</div>
                                        <div class="item" data-value="kg" data-text="kg">kg</div>
                                        <div class="item" data-value="lb" data-text="lb">lb</div>
                                        <div class="item" data-value="pc" data-text="pc">pc</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <span data-for="product_stock" class="k-invalid-msg"></span>
                        <div class="field">
                            <label>Category</label>
                            <input data-bind="value:product_category" name="product_category" required="required" validationMessage="required" style="width:100%"/>
                        </div>
                        <span data-for="product_category" class="k-invalid-msg"></span>
                        <div class="field">
                            <label>Cost</label>
                            <input data-bind="value:product_cost" name="product_cost" required="required" validationMessage="required" style="width:100%; padding: 0px; border: none"/>
                        </div>
                        <span data-for="product_cost" class="k-invalid-msg"></span>
                        <div class="field">
                            <label>Price</label>
                            <input data-bind="value:product_price" name="product_price" required="required" validationMessage="required" style="width:100%; padding: 0px; border: none"/>
                        </div>
                        <span data-for="product_price" class="k-invalid-msg"></span>
                    </form>
                </div>
                <div class="extra content">
                    <div class="center" align="center">
                        <div class="ui buttons mini">
                            <div class="ui button positive k-update-button"><i class="edit icon"></i>Save</div>
                            <div class="or"></div>
                            <div class="ui button negative k-cancel-button"><i class="remove icon"></i>Cancel</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
    </script>

<!-- TEMPLATE END-->

<!-- MODALS -->

<div class="ui modal small" id="productCategoriesModal">
    <i class="close icon"></i>
    <div class="header">
        Product Categories
    </div>
    <div class="content">
        <div id="productCategoriesGrid"></div>
    </div>
</div>

<div class="ui modal groups small">
    <i class="close icon"></i>
    <div class="header">
        Client Groups
    </div>
    <div class="content">
        <div id="groupsGrid"></div>
    </div>
</div>

<div class="ui modal mediaz">
    <i class="close icon"></i>
    <div class="header" id="media-title">

    </div>
    <div class="content" id="mediazContent">
        <div id="mediazListView"></div>
        <div id="mediazPager" class="k-pager-wrap"></div>

        <div style="margin-top: 10px">
            <div class="demo-section k-header">
                <input name="files" id="mediazFiles" type="file"/>
            </div>
        </div>
    </div>
</div>

<div class="ui modal small payment">
    <i class="close icon"></i>
    <div class="header green">
        <i class="dollar icon large"></i>Payment
    </div>
    <div class="content">
        <input id="paymentInput" type="number" value="0" style="font-size: 32px; margin-right: 10px; width:70%" placeholder=""/>
        <div class="ui animated fade button huge green" id="chkPay">
            <div class="visible content"><i class="money icon big"></i></div>
            <div class="hidden content">
                Pay
            </div>
        </div>

        <table class="ui definition table green two column" id="paymentTable">
            <tbody>
                <tr>
                    <td class="right aligned">TOTAL PAYMENT:</td>
                    <td id="coPayment"></td>
                </tr>
                <tr class="">
                    <td class="right aligned">AMOUNT PAID:</td>
                    <td id="coAmountPaid"></td>
                </tr>
                <tr class="warning" style="z-index: 25">
                    <td class="right aligned">CHANGE:</td>
                    <td id="coChange"></td>
                </tr>
                <tr class="">
                    <td class="right aligned">ORDER STATUS:</td>
                    <td id="coOrderStatus"></td>
                </tr>
            </tbody>
        </table>
        <div class="ui center aligned segment" id="afterChkBtn">
            <button class="ui button" id="newTransactionBtn" onclick="newTransaction()">
                New Transaction
            </button>
        </div>
    </div>
</div>

<!-- END MODALS -->

</body>
</html>