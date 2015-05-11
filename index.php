<?php
include 'updater.php';
?>
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
    <script src="js/jQuery.print.js"></script>

    <script src="kendojs/cultures/kendo.culture.en-PH.min.js"></script>

    <!-- JS MAIN -->
    <script>
        var cartItems = new Array();
        var savedTransaction = new Array();
        var clientsGridLoaded = false;
        var groupsGridLoaded = false;
        var productsListViewLoaded = false;
        var productsGridLoaded = false
        var clientReminderLoaded = false
        var campaignsGridLoaded = false;
        var salesGridLoaded = false;
        var ordersGridLoaded = false;
        var expensesGridLoaded = false;
        var feesGridLoaded = false;
        var warrantiesLoaded = false;
        var adminsLoaded = false
        var migrationLoaded = false;

        var clientGroup = 1;
        var clientNameTmp = "";
        var clientValueTmp = "";

        var productNameTmp = "";
        var productDescTmp = "";
        var productImageTmp = ""
        var productStockTmp = 0;
        var productUnitNameTmp = "";
        var productPriceTmp = 0
        var productCostTmp = 0
        var productCategoryTmp = 0
        var productRatingTmp = 0
        var productPointsTmp = 0
        var productRedeemPointsTmp = 0
        // culture
        kendo.culture("en-PH");
    </script>
    <script>
        //Global Script Functions
        function addDays(theDate, days) {
            return new Date(theDate.getTime() + days*24*60*60*1000);
        }

        var infoSound = new Audio("audio/info.mp3");
        var menuSound = new Audio("audio/menu.mp3");
        var itemSound = new Audio("audio/item.mp3");
        var cashSound = new Audio("audio/cash.mp3");
        var newTransactionSound = new Audio("audio/new.mp3");
        var saveSound = new Audio("audio/save.mp3");

    </script>
    <!-- JS BLOCK -->
    <script src="js/menuBlock.js"></script>
    <script src="js/productSearchBlock.js"></script>
    <script src="js/checkoutBlock.js"></script>
    <script src="js/cartBlock.js"></script>
    <script src="js/groupsGrid.js"></script>
    <script src="js/campaignsGrid.js"></script>
    <script src="js/clientReminderGrid.js"></script>
    <script src="js/productCategoriesGrid.js"></script>
    <script src="js/expensesGrid.js"></script>
    <script src="js/feesGrid.js"></script>
    <script src="js/warrantiesGrid.js"></script>
    <script src="js/logsGrid.js"></script>
    <script src="js/adminsGrid.js"></script>
    <!-- PAGES -->
    <script src="js/clientsPage.js"></script>
    <script src="js/productsPage.js"></script>
    <script src="js/salesPage.js"></script>
    <script src="js/ordersPage.js"></script>
    <!-- JS FUNCTION -->
    <script src="js/jquery.cookie.js"></script>
    <script src="js/datasources.js"></script>
    <script src="js/fullsreen.js"></script>
    <script src="js/my.js"></script>
</head>
<body class="dn">
<div class="ui menu pointing inverted" id="mainMenu">
    <a class="active item theMainMenu" id="dashBoardMenu">
        <i class="dashboard icon"></i> <span>Dashboard</span>
    </a>
    <a class="item theMainMenu admin cashier" onclick="toggleFullScreen()" id="thePOS">
        <i class="desktop icon"></i> <span>Point of Sale</span>
    </a>
    <a class="item theMainMenu theClients admin cashier" onclick="loadClients()">
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
            <div class="item" onclick="loadClientReminder();clearReminderFilters()">
                <i class="alarm outline icon"></i>
                <div class="content">
                    <div class="header">Client Reminder</div>
                    <div class="description">Manage Reminders</div>
                </div>
            </div>
            <div class="item" onclick="loadCampaigns()">
                <i class="flag outline icon"></i>
                <div class="content">
                    <div class="header">Campaigns</div>
                    <div class="description">Manage Campaigns</div>
                </div>
            </div>
            <div class="item" onclick="transferAccount()">
                <i class="exchange icon"></i>
                <div class="content">
                    <div class="header">Transfer Account</div>
                    <div class="description">Merge Clients into one</div>
                </div>
            </div>
        </div>
    </div>
    <a class="item theMainMenu admin cashier" onclick="loadProducts()">
        <i class="archive icon"></i> <span>Products / Inventory</span> <i class="dropdown icon"></i>
    </a>
    <div class="ui flowing popup inverted">
        <div class="ui selection list inverted animated">
            <div class="item" onclick="loadWarranties()">
                <i class="protect icon"></i>
                <div class="content">
                    <div class="header">Warranties</div>
                    <div class="description">Machine Warranty Manager for Clients</div>
                </div>
            </div>
            <div class="item" onclick="loadProductCategories()">
                <i class="tags icon"></i>
                <div class="content">
                    <div class="header">Category Manager</div>
                    <div class="description">Manage Product Categories</div>
                </div>
            </div>
        </div>
    </div>
    <a class="item theMainMenu admin cashier" onclick="loadSales()">
        <i class="dollar icon"></i> <span>Sales</span> <i class="dropdown icon"></i>
    </a>
    <div class="ui flowing popup inverted">
        <div class="ui selection list inverted animated">
            <div class="item" onclick="loadOrdersPage()">
                <i class="in cart icon"></i>
                <div class="content">
                    <div class="header">Orders</div>
                    <div class="description">Manage Orders from Clients</div>
                </div>
            </div>
            <div class="item" onclick="loadExpenses()">
                <i class="file excel outline icon"></i>
                <div class="content">
                    <div class="header">Expenses</div>
                    <div class="description">Manage Expenses</div>
                </div>
            </div>
            <div class="item" onclick="loadFees()">
                <i class="ticket icon"></i>
                <div class="content">
                    <div class="header">Fees & Charges</div>
                    <div class="description">Other Charges Received from Orders</div>
                </div>
            </div>
            <div class="item" onclick="loadPOCalc()">
                <i class="calculator icon"></i>
                <div class="content">
                    <div class="header">P.O. Calculator</div>
                    <div class="description">Helps you to to calculate your next Purchase Order</div>
                </div>
            </div>
        </div>
    </div>
    <a class="item theMainMenu admin">
        <i class="settings icon"></i> <span>Administration / Settings</span> <i class="dropdown icon"></i>
    </a>
    <div class="ui flowing popup inverted">
        <div class="ui selection list inverted animated">
            <div class="item" onclick="loadAdmins()">
                <i class="tasks icon"></i>
                <div class="content">
                    <div class="header">Admins</div>
                    <div class="description">Manage Admin List</div>
                </div>
            </div>
            <div class="item" onclick="loadLogs()">
                <i class="keyboard icon"></i>
                <div class="content">
                    <div class="header">Logs</div>
                    <div class="description">Records the changes and important messages</div>
                </div>
            </div>
            <div class="item" onclick="migrateData()">
                <i class="external square icon"></i>
                <div class="content">
                    <div class="header">Migrate Data</div>
                    <div class="description">Use this tool to transfer data from Baristachoi4</div>
                </div>
            </div>
            <div class="item" onclick="hardReset()">
                <i class="warning sign icon"></i>
                <div class="content">
                    <div class="header">Hard Reset</div>
                    <div class="description">Erases All Data of POS</div>
                </div>
            </div>
        </div>
    </div>
    <div class="right menu">
        <div class="item" style="padding-bottom: 3px; padding-top: 3px">
            <div class="ui search" id="loginID">
                <div class="ui icon input mini">
                    <input class="prompt" type="text" placeholder="Username" style="" id="loginUser" value="">
                    <i class="user icon"></i>
                </div>
                <div class="results"></div>
            </div>
        </div>
        <div class="item" style="padding-bottom: 3px; padding-top: 3px">
            <div class="ui search"">
                <div class="ui icon input mini">
                    <input class="prompt" type="password" placeholder="Password" style="" id="loginPass" value="">
                    <i class="lock icon"></i>
                </div>
                <div class="results"></div>
            </div>
        </div>
        <div class="item loggedInfo" style="display: none">
            <a class="ui image label">
                <img src="images/nophoto.jpg">
                <span class="usernameHere"></span>
                <div class="detail" onclick="logOut()">Log out</div>
            </a>
        </div>
    </div>
</div>

<div id="dashboardPage" class="menuPage">
    <div class="ui grid horizontally padded">
        <div class="sixteen wide centered column">
            <div class="ui segment">
                <div class="ui statistics">
                    <div class="statistic">
                        <div class="value" id="totalOrders">

                        </div>
                        <div class="label">
                            Total Orders Today
                        </div>
                    </div>
                    <div class="statistic">
                        <div class="value" id="totalClients">

                        </div>
                        <div class="label">
                            New Clients This Month
                        </div>
                    </div>
                    <div class="statistic">
                        <div class="value coh">

                        </div>
                        <div class="label">
                            Cash on Hand
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div id="POSPage" class="menuPage dn">
    <div class="ui three grid horizontally padded stackable">
        <div class="seven wide column" id="productSearchColumn">
            <div class="ui segment yellow" style="height: 100%">
                <div>
                    <input id="productSearch" title="Product Search">
                    <div id="cartContainer" class="dn" style="margin-top: 10px; ">
                        <h2 class="ui header center aligned">Drop Here</h2>
                    </div>
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
        <div class="four wide column" style="margin-bottom: 30px" id="cartColumn">
            <div class="ui segment yellow" id="cartDrag">
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

                <div class="fr dn" id="totalFees">

                </div>

                <div class="fr dn" id="totalPayments">
                    <div class="ui labeled input mini right primary">
                        <div class="ui label">
                            Payments:
                        </div>
                        <input type="text" placeholder="" value="" readonly style="color: green">
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
        <div class="five wide column" style="margin-bottom: 50px" id="checkoutColumn">
            <div class="ui segment yellow">
                <h4 class="ui dividing header">Checkout</h4>
                <div class="ui styled accordion" id="checkoutAccordion" style="width: 100%">
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
                                <div class="ui toggle checkbox" id="deliveryChb">
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
                        <i class="add square icon"></i>Other Fees & Charges
                    </div>
                    <div class="content">
                        <div id="feesGrid"></div>
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
                <div id="productListPager2" class="k-pager-wrap cb" style="margin-top: 25px"></div>
            </div>
        </div>
    </div>
</div>

<div id="salesPage" class="menuPage dn">
    <div class="ui grid horizontally padded">
        <div class="sixteen wide column">
            <div class="ui segment" style="height: 100%; margin-bottom: 40px;">
                <div class="ui segment cashier">
                    You are not authorized to view this page
                </div>
                <div class="ui segment admin">
                    <div class="ui segment">
                        <label for="reportEnd">Start date:</label><input id="reportStart" style="width: 200px" value="" />
                        <label for="reportEnd">End date:</label><input id="reportEnd" style="width: 200px" value=""/>
                        <button class="ui button" id="generateReport" style="margin-left: 10px">
                            Generate Report
                        </button>
                        <button class="ui button disabled" id="printReport" style="margin-left: 10px">
                            <i class="ui print icon"></i> Print Report
                        </button>
                    </div>

                    <div id="reportPrint" class="dn bcPrintReport">
                        <div class="ui segment top attached">
                            <h6 class="ui right floated header reportDate">
                                Date Here
                            </h6>
                            <h4 class="ui left floated header reportName">
                                Top Attached
                            </h4>
                        </div>
                        <div class="ui attached segment cb">
                            <div class="ui stackable grid">
                                <div class="nine wide column">
                                    <h6 class="ui dividing header">
                                        Total Sales from Stocks
                                    </h6>
                                    <table class="ui celled structured small green table">
                                        <thead>
                                            <tr>
                                                <th>Category</th>
                                                <th>Product Name</th>
                                                <th>Remaining Stock</th>
                                                <th>Quantity Sold</th>
                                                <th>Total Sales</th>
                                                <th>Total Profit</th>
                                            </tr>
                                        </thead>
                                        <tbody id="mainReportBody">

                                        </tbody>
                                    </table>
                                </div>
                                <div class="three wide column">
                                    <h6 class="ui dividing header">
                                        Expenses
                                    </h6>
                                    <table class="ui small red table">
                                        <thead>
                                        <tr>
                                            <th>Description</th>
                                            <th>Amount</th>
                                        </tr>
                                        </thead>
                                        <tbody id="expensesReportBody">

                                        </tbody>
                                    </table>

                                    <h6 class="ui dividing header">
                                        Fees & Charges from Orders
                                    </h6>
                                    <table class="ui small green table">
                                        <thead>
                                        <tr>
                                            <th>Fee / Charge Name</th>
                                            <th>Amount</th>
                                        </tr>
                                        </thead>
                                        <tbody id="feesReportBody">

                                        </tbody>
                                    </table>
                                </div>
                                <div class="four wide column">
                                    <div class="ui icon small warning message dn" id="changesMessage">
                                        <i class="warning icon"></i>

                                        <div class="content">
                                            <div class="header">
                                                Inventory Price Changes Detected!
                                            </div>
                                            <ul class="list">
                                                <li></li>
                                                <li></li>
                                            </ul>
                                        </div>

                                    </div>
                                    <div class="ui segment">
                                        <table class="ui small very basic table">
                                            <thead>
                                            </thead>
                                            <tbody id="totalReport">

                                            </tbody>
                                        </table>
                                    </div>
                                    <div align="center">
                                        <!--<div class="ui statistic">
                                            <div class="value">
                                                <i class="users icon"></i> 5
                                            </div>
                                            <div class="label">
                                                New Clients
                                            </div>
                                        </div>-->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div id="settingsPage" class="menuPage dn">
    <div class="ui grid horizontally padded">
        <div class="sixteen wide column">
            <div class="ui segment" style="height: 100%; margin-bottom: 40px;">
                <div class="ui grid">
                    <div class="sixteen wide column">
                        <div class="ui yellow segment">
                            <div class="ui labeled icon yellow small button" id="saveSettings">
                                <i class="save icon"></i>
                                Save Settings
                            </div>
                        </div>
                    </div>
                    <div class="four wide column">
                        <div class="ui segment">
                            <h5 class="ui right floated header">
                                Branch Information
                                <!--<div class="sub header">Manage your account</div>-->
                            </h5>
                            <div class="ui clearing divider"></div>
                            <div class="ui right labeled fluid input">
                                <input type="text" placeholder="Lilo-an" id="theBranchName">
                                <div class="ui label">
                                    Branch
                                </div>
                            </div>
                            <textarea class="k-textbox mtop" style="width: 100%;" placeholder="Jubay, San Antonio, Liloan, Cebu" id="theBranchAddress"></textarea>
                            <div class="ui left icon fluid input mtop">
                                <input type="text" placeholder="(032) 4241684 / 09173242410" id="theBranchContact">
                                <i class="text telephone icon"></i>
                            </div>
                        </div>
                    </div>
                    <div class="four wide column">
                        <div class="ui segment">
                            <h5 class="ui right floated header">Printing</h5>
                            <div class="ui clearing divider"></div>
                            <div style="font-size: 0.90em">
                                Receipt
                            </div>
                            <div class="ui segment">
                                <div class="ui labeled fluid small input mtop">
                                    <div class="ui label">
                                        Footer
                                    </div>
                                    <input type="text" placeholder="Barista Choi Vending Solutions Inc." id="theReceiptFooter">
                                </div>
                                <div class="ui labeled fluid small input mtop">
                                    <div class="ui label">
                                        Sub
                                    </div>
                                    <input type="text" placeholder="Monday to Saturday 8am to 5pm" id="theReceiptSub">
                                </div>
                            </div>
                            <div style="font-size: 0.90em" class="mtop">
                                Reports
                            </div>
                            <div class="ui segment">
                                <div style="font-size: 0.80em">
                                    Powders
                                </div>
                                <select id="powdersCatSettings"></select>

                                <div style="font-size: 0.80em" class="mtop">
                                    Machines
                                </div>
                                <select id="machinesCatSettings"></select>

                                <div style="font-size: 0.80em" class="mtop">
                                    Cups
                                </div>
                                <select id="cupsCatSettings"></select>

                                <div style="font-size: 0.80em" class="mtop">
                                    Parts
                                </div>
                                <select id="partsCatSettings"></select>
                            </div>
                        </div>
                    </div>

                    <div class="four wide column">
                        <div class="ui segment">
                            <h5 class="ui right floated header">Warranty</h5>
                            <div class="ui clearing divider"></div>
                            <div style="font-size: 0.90em">
                                Number of days to void the warranty after maintenance
                            </div>
                            <div class="ui right labeled fluid input mtop">
                                <input type="text" placeholder="30" id="theWarrantyVoid">
                                <div class="ui label">
                                    days
                                </div>
                            </div>

                            <div style="font-size: 0.90em" class="mtop">
                                Number of days for machine maintenance
                            </div>
                            <div class="ui right labeled fluid input mtop">
                                <input type="text" placeholder="30" id="theWarrantyMaintenance">
                                <div class="ui label">
                                    days
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="four wide column">
                        <div class="ui segment">
                            <h5 class="ui right floated header">Points System</h5>
                            <div class="ui clearing divider"></div>
                            <div style="font-size: 0.90em">
                                Groups who will earn points
                            </div>
                            <select id="pointsGroupSettings" class="mtop"></select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="ui icon menu mini bottom fixed yellow bottomMenu">

    <a class="red item" id="myInfo" data-html='<a class="ui card"><div class="content"><div class="header">Barista Choi POS</div><div class="meta"><span class="category">Version 5.20 (Lucky)</span></div><div class="description"><ul class="ui list"><li>Fixed: Cash on hand where it doubles the calculation for fees & Charges</li><li>Fixed: Sales Generation if there is no sales returning isNaN message</li><li>Tweaked: Product Description is not required</li><li>Tweaked: for better interface on small screens you may now combine Shopping cart to product search by dragging it.</li><li>Added: Points Redemption and Deduction on Client Page</li><li>Added: Auto Complete for Expenses and Fees</li><li>Added: Screen Resolution Check</li><li>Added: Auto Complete for login field</li><li>Improved: More details for Log Information</li><li>Added: It is now possible to upload Machine photo in Warranties Page</li></ul><p>Found bugs? Need Help? Suggestions? You may contact me directly <i class="ui icon at"></i> 09173242410</p><p>Always request for the latest version of this web application</p></div></div><div class="extra content"><div class="right floated author"><img class="ui avatar image" src="images/logo.png">Mark Loreto</div></div></a>'>
        v5.20
    </a>

    <div class="right menu">
        <a class="red item dn admin cashier">
            <div class="ui blue button admin cashier" onclick="saveTransaction()" id="saveTransaction" style="display: none">
                <i class="icon save"></i>
                Save Transaction
                <div class="floating ui red circular label" id="savedTrasansactionNumbers" style="display: none">0</div>
            </div>
        </a>
        <div class="ui flowing popup">
            <div class="ui selection list animated" id="savedTransactions">
                <div class="item"><div class="content"><div class="header">No Saved Transaction</div></div></div>
            </div>
        </div>
        <a class="red item dn admin cashier">
            <div class="ui orange button admin cashier" onclick="newTransaction()" id="newTransaction" style="display: none">
                <i class="icon shop"></i>
                New Transaction
            </div>
        </a>
        <a class="red item">
            <div class="ui labeled small input" id="coh">
                <div class="ui label">
                    Cash on Hand
                </div>
                <input type="text" placeholder="" value="" style="width: 150px" id="cashOnHand" readonly>
            </div>
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
                <div align="center">#:getGroupName(data.user_group)#</div>
            </div>
            <div class="middle aligned content">
                <a class="header">#:data.user_name#</a>
                <div class="ui divided list" style="position: relative; top: -5px">
                    <div class="item">
                        <i class="home icon"></i>
                        <div class="content">
                            <div class="meta">#:data.user_address #</div>
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
                            <div class="meta">#:data.user_points # #: add_S("point", data.user_points) #</div>
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

<script type="text/x-kendo-template" id="userDetailsTpl">
    <div class="dn currentUserPoints">[user_points]</div>
    <div class="ui items">
        <div class="item">
            <a class="ui tiny image">
                <img src="[user_photo]">
            </a>
            <div class="content">
                <a class="header tiny">[user_name]</a>
                <div class="meta">
                    <span class="category">[user_group]</span>
                </div>
                <p>[user_address]</p>
                <div class="description">
                    <a onclick="viewUser([user_id])">View</a> | <a onclick="modifyUser([user_id])">Edit</a>
                </div>
            </div>
        </div>
    </div>
    <div class="ui celled list">
        <div class="item">
            <table class="ui celled table">
                <tbody>
                <tr>
                    <td class="active right aligned">Last Transaction:</td>
                    <td class="lastTransactionDate"></td>
                </tr>
                <tr>
                    <td class="active right aligned">Cups Limit:</td>
                    <td class="cupsLimit"></td>
                </tr>
                <tr>
                    <td class="active right aligned"><div>Net Income:</div><div class="thisMonth" style="font-size: x-small; font-style: italic"></div></td>
                    <td class="netIncome"></td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="item issues">
            <i class="thumbs outline up icon green big"></i>
            <div class="content">
                <div class="header">No Issues</div>
                <div class="description">This client is awesome!.</div>
            </div>
        </div>
        <div class="item reminders">
            <i class="alarm outline icon green big"></i>
            <div class="content">
                <div class="header">Reminders</div>
                <div class="description">
                    no active reminders.
                </div>
            </div>
        </div>
        <div class="item campaign">
            <i class="checkered flag icon green big"></i>
            <div class="content">
                <div class="header">Campaigns</div>
                <div class="description">

                </div>
            </div>
        </div>
    </div>
</script>

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
                <img src="#= data.product_image #" onerror="$(this).attr('src', 'images/noimageproduct.jpg')">
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
                    <img src="#= data.product_image #" class="prodProdImg" onerror="$(this).attr('src', 'images/noimageproduct.jpg')">
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
                            <textarea style="width: 88%; height: auto; min-height: 0px" placeholder="Description" data-bind="value:product_description" name="product_description" rows="2"></textarea>
                        </div>
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

                        <div>
                            <div class="field fl" style="width: 48%; clear: none !important">
                                <label>Cost</label>
                                <input data-bind="value:product_cost" name="product_cost" required="required" validationMessage="required" style="width:100%; padding: 0px; border: none"/>
                                <span data-for="product_cost" class="k-invalid-msg"></span>
                            </div>


                            <div class="field fr" style="width: 48%; clear: none !important">
                                <label>Price</label>
                                <input data-bind="value:product_price" name="product_price" required="required" validationMessage="required" style="width:100%; padding: 0px; border: none"/>
                                <span data-for="product_price" class="k-invalid-msg"></span>
                            </div>
                        </div>

                        <div class="field cb">
                            <label>Points</label>
                            <input data-bind="value:product_points" name="product_points" required="required" validationMessage="required" style="width:100%; padding: 0px; border: none"/>
                        </div>
                        <span data-for="product_points" class="k-invalid-msg"></span>
                        <div class="field cb">
                            <label>Required Points to Redeem</label>
                            <input data-bind="value:product_redeem_points" name="product_redeem_points" required="required" validationMessage="required" style="width:100%; padding: 0px; border: none"/>
                        </div>
                        <span data-for="product_redeem_points" class="k-invalid-msg"></span>

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

<script type="text/x-kendo-template" id="campaignDetails">
    <div class="campaignDetailsGrid"></div>
</script>

<span id="notification" style="display:none;"></span>
<script id="alertTpl" type="text/x-kendo-template">
    <div style="padding: 10px; max-width: 400px">
        <h2 class="ui header #= color #">
            <i class="#= color # #= icon # icon"></i>
            <div class="content">
                #= subject #
                <div class="sub header">#= message #</div>
            </div>
        </h2>
    </div>
</script>

<div id="claimStub" class="dn">
    <div class="mainStub" style="background: #fff !important;">
        <h3 class="ui header fl rTop" style="text-align: left">
            <img src="images/logo.png">
            <div class="content">
                <span class="receiptBranchName">Liloan Branch</span>
                <div class="sub header receiptBranchAddress">Jubay, San Antonio, Liloan</div>
            </div>
        </h3>

        <div align="center" class="thermal1"><img src="images/logo.png" /></div>
        <div class="thermal1 receiptBranchName" align="center" style="font-size: 9pt">Liloan Branch</div>
        <div class="thermal1 receiptBranchAddress" align="center" style="font-size: 8px">Jubay, San Antonio, Liloan</div>

        <div class="cb fl">
            <table class="ui very basic small collapsing table" style="color: rgba(0,0,0,1);">
                <tbody>
                <tr>
                    <td class="right aligned">Serial #:</td>
                    <td class="stubSerial">
                        SVM75847545
                    </td>
                </tr>
                <tr>
                    <td class="right aligned">Type:</td>
                    <td class="stubType">
                        Sapoe
                    </td>
                </tr>
                <tr>
                    <td class="right aligned">Date:</td>
                    <td class="stubDate">
                        3/27/1985
                    </td>
                </tr>
                <tr>
                    <td class="right aligned">Contact us#:</td>
                    <td class="stubOurContact">

                    </td>
                </tr>
                <tr>
                    <td class="right aligned">Technician:</td>
                    <td class="stubTechnician">

                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="cb" style="margin-bottom: 30px">
            <img src="images/cut-here.png" class="cb" style=" position: fixed; margin-top: 10px;">
        </div>


        <table class="ui very basic small collapsing table" style="color: rgba(0,0,0,1);">
            <tbody>
            <tr>
                <td class="right aligned">Serial #:</td>
                <td class="stubSerial">
                    SVM75847545
                </td>
            </tr>
            <tr>
                <td class="right aligned">Type:</td>
                <td class="stubType">
                    Sapoe
                </td>
            </tr>
            <tr>
                <td class="right aligned">Date:</td>
                <td class="stubDate">
                    3/27/1985
                </td>
            </tr>
            <tr>
                <td class="right aligned">Client Contact #:</td>
                <td class="stubClientContact">

                </td>
            </tr>
            <tr>
                <td class="right aligned">Technician:</td>
                <td>

                </td>
            </tr>
            </tbody>
        </table>

        <table class="ui small celled yellow table" style="color: rgba(0,0,0,1);">
            <thead>
            <tr>
                <th colspan="2" class="center aligned two wide" style="color: rgba(0,0,0,1);">Parts Replacement</th>
            </tr>
            <tr>
                <th class="right aligned two wide" style="color: rgba(0,0,0,1);">Quantity</th>
                <th class="twelve wide" style="color: rgba(0,0,0,1);">Parts</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td class="right aligned">

                </td>
                <td>

                </td>
            </tr>
            <tr>
                <td class="right aligned">

                </td>
                <td>

                </td>
            </tr>
            <tr>
                <td class="right aligned">

                </td>
                <td>

                </td>
            </tr>
            <tr>
                <td class="right aligned">

                </td>
                <td>

                </td>
            </tr>
            <tr>
                <td class="right aligned">

                </td>
                <td>

                </td>
            </tr>
            <tr>
                <td class="right aligned">

                </td>
                <td>

                </td>
            </tr>
            <tr>
                <td class="right aligned">

                </td>
                <td>

                </td>
            </tr>
            <tr>
                <td class="right aligned">

                </td>
                <td>

                </td>
            </tr>
            </tbody>
        </table>

        <table class="ui small collapsing celled table fr" style="color: rgba(0,0,0,1);">
            <tbody>
            <tr>
                <td class="right aligned active" style="color: rgba(0,0,0,1) !important;">TOTAL:</td>
                <td><span style="color: rgba(0,0,0,1)!important;"></span></td>
            </tr>
            <tr>
                <td class="right aligned active" style="color: rgba(0,0,0,1) !important;">Customer Signature:</td>
                <td><span style="color: rgba(0,0,0,1) !important;"></span></td>
            </tr>
            </tbody>
        </table>

        <div class="cb"></div>
        <div style="border-top: 1px dashed #000;" class="receiptMargin"><div class="fl">.</div><div class="fr">.</div></div>
    </div>
</div>

<!-- ui receipt flowing popup -->
<div class="ui receipt flowing popup" style="width: 480px">
    <div id="receipt">
        <h4 class="ui header rTop" style="text-align: left">
            <img src="images/logo.png">
            <div class="content">
                <span class="receiptBranchName">Liloan Branch</span>
                <div class="sub header receiptBranchAddress" style="font-size: 0.8em !important;">302 North Road Plaza BLDG, North Road, Brgy Labogon, Mandaue City</div>
            </div>
        </h4>

        <div align="center" class="thermal1"><img src="images/logo.png" /></div>
        <div class="thermal1 receiptBranchName" align="center" style="font-size: 9pt">Liloan Branch</div>
        <div class="thermal1 receiptBranchAddress" align="center" style="font-size: 8px">Jubay, San Antonio, Liloan</div>


        <table class="ui celled small table" style="color: rgba(0,0,0,1);">
            <tbody>
            <tr>
                <td colspan="3" class="mark"><i class="user icon thermal3"></i><span class="receiptName">Mark Loreto</span></td>
                <td><i class="circle icon thermal3"></i>#<span class="receiptNumber">881999</span></td>
            </tr>
            <tr>
                <td colspan="2"><i class="calendar icon thermal3"></i><span class="receiptDate">Tuesday, April 15, 2014</span></td>
                <td><i class="star icon thermal3"></i><span class="receiptPoints">20</span></td>
                <td><span class="receiptStatus">Balance</span></td>
            </tr>
            </tbody>
        </table>

        <table class="ui yellow small table" style="color: rgba(0,0,0,1);">
            <thead>
            <tr>
                <th class="right aligned two wide" style="color: rgba(0,0,0,1);">Quantity</th>
                <th class="twelve wide" style="color: rgba(0,0,0,1);">Description</th>
                <th class="two wide" style="color: rgba(0,0,0,1);">Amount</th>
            </tr>
            </thead>
            <tbody id="receiptBody">
            <tr>
                <td class="right aligned">
                    <div class="borderBottom">3x</div>
                    <div>@ 170</div>
                </td>
                <td>Milky Choco Loco</td>
                <td>340</td>
            </tr>
            <tr>
                <td class="right aligned">
                    <div class="borderBottom">2000x</div>
                    <div>@ 0.70</div>
                </td>
                <td>Paper Cups</td>
                <td>1400</td>
            </tr>
            <tr>
                <td class="right aligned">
                    <div class="borderBottom">1x</div>
                    <div>@ 170</div>
                </td>
                <td>Coffee Pinoy Blend</td>
                <td>170</td>
            </tr>
            <tr>
                <td class="right aligned">
                    <div class="borderBottom">1x</div>
                    <div>@ 170</div>
                </td>
                <td>Coffee Pinoy Blend</td>
                <td>170</td>
            </tr>
            <tr>
                <td class="right aligned">
                    <div class="borderBottom">1x</div>
                    <div>@ 170</div>
                </td>
                <td>Coffee Pinoy Blend</td>
                <td>170</td>
            </tr>
            </tbody>
            <tfoot id="receiptFoot">
            <tr>
                <th></th>
                <th>Plastic</th>
                <th>1</th>
            </tr>
            <tr>
                <th></th>
                <th>Delivery</th>
                <th>30</th>
            </tr>
            </tfoot>
        </table>

        <table class="ui small collapsing celled table fr" style="color: rgba(0,0,0,1);">
            <tbody>
            <tr>
                <td class="right aligned active" style="color: rgba(0,0,0,1) !important;">TOTAL:</td>
                <td><span class="receiptGrandTotal" style="color: rgba(0,0,0,1)!important;">12,000.00</span></td>
            </tr>
            <tr>
                <td class="right aligned active" style="color: rgba(0,0,0,1) !important;">AMOUNT PAID:</td>
                <td><span class="receiptAmountPaid" style="color: rgba(0,0,0,1);">12,000.00</span></td>
            </tr>
            <tr>
                <td class="right aligned active" style="color: rgba(0,0,0,1) !important;">PAYMENTS:</td>
                <td><span class="receiptPayments" style="color: rgba(0,0,0,1);"></span></td>
            </tr>
            <tr>
                <td class="right aligned active" style="color: rgba(0,0,0,1) !important;">CHANGE:</td>
                <td><span class="receiptChange" style="color: rgba(0,0,0,1) !important;">200</span></td>
            </tr>
            </tbody>
        </table>

        <div class="cb"></div>

        <div class="ui piled segment" style="color: rgba(0,0,0,1);">
            <p class="receiptNote"></p>
        </div>

        <div class="thermal1 receiptFooter" align="center" style="font-size: 8pt">Barista Choi Vending Solutions</div>
        <div class="thermal1 receiptSub" align="center" style="font-size: 6px">Open from Monday to Friday 8am to 5pm.</div>

        <h4 class="ui center aligned yellow header" style="color: rgba(0,0,0,1) !important;">
            <span class="receiptFooter">Barista Choi Vending Solutions</span>
            <div class="sub header" style="color: rgba(0,0,0,1) !important;">Open from Monday to Friday 8am to 5pm.</div>
        </h4>

        <div style="border-top: 1px dashed #000;" class="receiptMargin"><div class="fl">.</div><div class="fr">.</div></div>
    </div>
</div>

<script type="text/x-kendo-template" id="usersDetailTpl">
    <div class="tabstrip">
        <ul>
            <li class="k-state-active">
                Points
            </li>
        </ul>
        <div style="padding: 10px">
            <div style="margin-bottom: 10px">
                <div class="ui label">
                    Total Points
                    <div class="detail"></div>
                </div>
            </div>

            <div style="margin-bottom: 10px">
                <div class="ui selection dropdown" style="width: 700px">
                    <input type="hidden" name="product_redeem_points">
                    <div class="default text" style="width: 650px">Available Products that you can Redeem</div>
                    <i class="dropdown icon"></i>
                    <div class="menu">

                    </div>
                </div>
                <button class="ui green button redeem"><i class="ui gift icon"></i>Redeem Points</button>
            </div>
            <div class="ui clearing divider"></div>
            <div style="margin-bottom: 10px">
                <div class="ui action input addPoints">
                    <input type="number" placeholder="Points to Add" value="">
                    <button class="ui green button"><i class="ui add circle icon"></i>Add Points Manually</button>
                </div>
            </div>

        </div>
    </div>

</script>

<script type="text/x-kendo-template" id="ordersDetailTpl">
    <div class="tabstrip">
        <ul>
            <li class="k-state-active">
                Orders
            </li>
            <li>
                Contact Information
            </li>
            <li>
                Fees & Charges
            </li>
            <li>
                Notes
            </li>
        </ul>
        <div style="padding: 10px">
            <div class="orders"></div>
        </div>
        <div style="padding: 10px">
            <div class="ui items">
                <div class="item">
                    <div class="ui tiny image">
                        <img src="">
                    </div>
                    <div class="content">
                        <a class="header"></a>
                        <div class="meta">
                            <span></span>
                        </div>
                        <div class="description">
                            <p></p>
                        </div>
                        <div class="extra">
                            Additional Details
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div style="padding: 10px">
            <div class="fees"></div>
        </div>
        <div class="notes" style="padding: 10px">

        </div>
    </div>
</script>

<script type="text/x-kendo-template" id="logsDetailTpl">
    <div class="tabstrip">
        <ul>
            <li class="k-state-active">
                Log Message
            </li>
        </ul>
        <div style="padding: 10px">
            <textarea class="k-textbox logMessage" style="width: 100%;" rows="5"></textarea>
            <div class="jsonData">

            </div>
        </div>
    </div>

</script>

<script type="text/x-kendo-template" id="campaignsDetailTpl">
    <div class="tabstrip">
        <ul>
            <li class="k-state-active">
                List
            </li>
        </ul>
        <div style="padding: 10px">
            <div class="campaign_users"></div>
        </div>
    </div>

</script>

<script type="text/x-kendo-template" id="warrantiesDetailTpl">
    <div class="tabstrip">
        <ul>
            <li class="k-state-active">
                Functions
            </li>
            <li>
                Contact Information
            </li>
            <li>
                Photo
            </li>
            <li>
                Map
            </li>
        </ul>
        <div style="padding: 10px">
            <div class="functions">
                <div class="ui buttons">
                    <div class="ui button maintainBtn">Maintained</div>
                    <div class="ui button repairBtn">On Repair</div>
                    <div class="ui button stubBtn">Print Claim Stub</div>
                </div>
            </div>
        </div>
        <div style="padding: 10px">
            <div class="ui items">
                <div class="item">
                    <div class="ui tiny image">
                        <img src="">
                    </div>
                    <div class="content">
                        <a class="header"></a>
                        <div class="meta">
                            <span></span>
                        </div>
                        <div class="description">
                            <p></p>
                        </div>
                        <div class="extra">
                            Additional Details
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="photo" style="padding: 10px">
            <input type="hidden" onchange="changeMachinePic($(this))" value="">
            <img src="images/noimageproduct.jpg" onclick="openMedia('Machine Photo', 'data/machinePics.php', 'machines', $(this).parent().find('input'))" style="cursor: pointer" onerror="$(this).attr('src', 'images/noimageproduct.jpg')"/>
        </div>
        <div style="padding: 10px">
            <div class="map"></div>
        </div>
    </div>

</script>

<!-- TEMPLATE END-->

<!-- MODALS -->

<div class="ui modal medium" id="migrateModal">
    <i class="close icon"></i>
    <div class="header">
        Data Migration Tool
    </div>
    <div class="content">
        <div class="ui top attached segment">
            <div class="ui warning message">
                <div class="header">
                    Data Migration Tool Will Overwrite your Existing Database
                </div>
                Backup your database first before proceeding
            </div>
        </div>
        <div class="ui attached segment">
            <div class="ui labeled yellow icon button" id="startDataMigrate">
                <i class="warning icon"></i>
                Start Data Migration
            </div>
        </div>
        <div class="ui bottom attached segment">
            <div class="ui indicating teal progress" data-value="0" data-total="9" id="migrateProgress">
                <div class="bar">
                    <div class="progress"></div>
                </div>
                <div class="label">Progress Bar</div>
            </div>
        </div>
    </div>
</div>

<div class="ui modal medium" id="POCalculatorModal">
    <i class="close icon"></i>
    <div class="header">
        Purchase Order Calculator
    </div>
    <div class="content">
        <div class="ui top attached segment">
            <div class="ui right labeled left icon input">
                <i class="cubes icon"></i>
                <input type="text" placeholder="Target Stock" id="POCalcTargetStock" value="2100" onkeyup="POCalcStart()">
                <div class="ui label">
                    Kilos
                </div>
            </div>
        </div>
        <div class="ui attached segment">
            <table class="ui celled structured table">
                <thead>
                <tr>
                    <th>Powder Name</th>
                    <th>Remaining Stock</th>
                    <th>Target Percentage</th>
                    <th>Number of Boxes to Purchase</th>
                </tr>
                </thead>
                <tbody id="POCalcBody">

                </tbody>
                <tfoot>
                    <tr>
                        <th class="right aligned">Total:</th>
                        <th id="POCalcTotalRemaining"></th>
                        <th id="POCalcTotalPercent">
                            <div class="ui right labeled input" style="width: 160px">
                                <input type="text" placeholder="Percentage" value="" readonly>
                                <div class="ui label">%</div>
                            </div>
                        </th>
                        <th id="POCalcTotalBoxes"></th>
                    </tr>
                </tfoot>
            </table>
        </div>
        <div class="ui bottom attached segment">
            <p>All Information Provided will Automatically Saved</p>
        </div>
    </div>
</div>

<div class="ui modal medium" id="transferAccountModal">
    <i class="close icon"></i>
    <div class="header">
        Transfer Account
    </div>
    <div class="content">
        <div>
            <div class="ui labeled icon button" id="transferAccountBtn">
                <i class="exchange icon"></i>
                Start Transfer
            </div>
        </div>
        <div class="ui top attached segment">
            <div class="ui two column middle aligned relaxed fitted stackable grid">
                <div class="center aligned column">
                    <div class="ui tiny header">From</div>
                    <input id="transferFrom"/>
                    <div class="dn transferValues">test</div>
                </div>
                <div class="ui vertical divider">
                    <i class="pointing right icon"></i>
                </div>
                <div class="column center aligned">
                    <div class="ui tiny header">To</div>
                    <input id="transferTo"/>
                    <div class="dn transferValues">test</div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="ui modal small" id="hardResetModal">
    <div class="header">
        Hard Reset
    </div>
    <div class="content">
        <div>Initializing...</div>
        <div>To cancel press <b>F5</b></div>
    </div>
</div>

<div class="ui modal small" id="adminsModal">
    <i class="close icon"></i>
    <div class="header">
        Admins
    </div>
    <div class="content">
        <div id="adminsGrid"></div>
    </div>
</div>

<div class="ui modal medium" id="logsModal">
    <i class="close icon"></i>
    <div class="header">
        Logs
    </div>
    <div class="content">
        <div id="logsGrid"></div>
    </div>
</div>

<div class="ui modal fullscreen" id="warrantiesModal">
    <i class="close icon"></i>
    <div class="header">
        Machine Warranty
    </div>
    <div class="content">
        <div id="warrantiesGrid"></div>
    </div>
</div>

<div class="ui modal fullscreen" id="ordersModal">
    <i class="close icon"></i>
    <div class="header">
        Orders
    </div>
    <div class="content">
        <div id="ordersGrid"></div>
    </div>
</div>

<div class="ui modal fullscreen" id="expensesModal">
    <i class="close icon"></i>
    <div class="header">
        Expenses
    </div>
    <div class="content">
        <div id="expensesGrid"></div>
    </div>
</div>

<div class="ui modal large" id="feesModal">
    <i class="close icon"></i>
    <div class="header">
        Fees & Charges
    </div>
    <div class="content">
        <div id="feesGridModal"></div>
    </div>
</div>

<div class="ui modal fullscreen" id="clientReminderModal">
    <i class="close icon"></i>
    <div class="header">
        Client Reminder
    </div>
    <div class="content">
        <div id="clientReminderGrid"></div>
    </div>
</div>

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

<div class="ui modal campaigns large">
    <i class="close icon"></i>
    <div class="header">
        Campaigns
    </div>
    <div class="content">
        <div id="campaignsGrid"></div>
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
            <button class="ui button" id="printReceiptBtn">
                Print Receipt
            </button>
            <button class="ui button" id="newTransactionBtn" onclick="newTransaction()">
                New Transaction
            </button>
        </div>
    </div>
</div>

<!-- END MODALS -->

</body>
</html>