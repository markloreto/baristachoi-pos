function loadSales(){
    if(salesGridLoaded == false){
        salesGridLoaded = true;

        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        function startChange() {
            var startDate = start.value(),
                endDate = end.value();

            if (startDate) {
                startDate = new Date(startDate);
                startDate.setDate(startDate.getDate());
                end.min(startDate);
            } else if (endDate) {
                start.max(new Date(endDate));
            } else {
                endDate = new Date();
                start.max(endDate);
                end.min(endDate);
            }
        }

        function endChange() {
            var endDate = end.value(),
                startDate = start.value();

            if (endDate) {
                endDate = new Date(endDate);
                endDate.setDate(endDate.getDate());
                start.max(endDate);
            } else if (startDate) {
                end.min(new Date(startDate));
            } else {
                endDate = new Date();
                start.max(endDate);
                end.min(endDate);
            }
        }

        var start = $("#reportStart").kendoDatePicker({
            change: startChange,
            value: firstDay
        }).data("kendoDatePicker");

        var end = $("#reportEnd").kendoDatePicker({
            change: endChange,
            value: lastDay
        }).data("kendoDatePicker");

        start.max(end.value());
        end.min(start.value());

        $("#printReport").click(function () {
            $('#reportPrint').print({
                globalStyles : true,
                mediaPrint : true,
                iframe : false,
                noPrintSelector : ".avoid-this",
                deferred: $.Deferred()
            });
        })
        
        $("#generateReport").click(function () {
            $(this).addClass("loading")
            $.post("data/reporting.php",{reportStart: start.value().toDateString(), reportEnd: end.value().toDateString()}, function(e){
                $("#generateReport").removeClass("loading")
                $("#generateReport").blur()
                $("#mainReportBody").html("")
                $("#printReport").removeClass("disabled")
                $(".reportName").html('<i class="table icon"></i>' + settings["Branch Name"] + " Branch Sales Report")
                $(".reportDate").html(kendo.toString(start.value(), "MMMM d, yyyy" ) + " - " + kendo.toString(end.value(), "MMMM d, yyyy" ))
                $("#reportPrint").show()

                //Powder Result
                var powderLength = e["Main Report"]["Powders Result"].length
                var machineLength = e["Main Report"]["Machines Result"].length
                var cupLength = e["Main Report"]["Cups Result"].length
                var partLength = e["Main Report"]["Parts Result"].length
                var category = ";"
                var qtySold = 0;
                var grossSales = 0;
                var grossProfit = 0;
                var grandGrossSales = 0;
                var grandGrossProfit = 0;
                var remainingStocks = 0
                var remainingStocksAmount = 0;
                var orderTotal = isNaN(parseFloat(e["Orders"]["Total"][0]["Order Total"])) ? 0 : parseFloat(e["Orders"]["Total"][0]["Order Total"]);
                var orderNet = isNaN(parseFloat(e["Orders"]["Total"][0]["Order Net"])) ? 0 : parseFloat(e["Orders"]["Total"][0]["Order Net"]);
                var unitName = "";

                //Powders
                $.each(e["Main Report"]["Powders Result"], function (i,v) {
                    if(i == 0)
                        category = '<td rowspan="'+powderLength+'">'+ add_S("Powder", powderLength) +'</td>'
                    else
                        category = '';
                    $("#mainReportBody").append('<tr>' +
                    category + '<td>'+ v["Product Name"] +'</td>' +
                    '<td>'+ v["Remaining Stock"] +' '+ add_S(v["Unit Name"], parseInt(v["Remaining Stock"])) +'</td>' +
                    /*'<td>'+ kendo.toString(parseFloat(v["Product Cost"]), "c") +'</td>' +
                    '<td>'+ kendo.toString(parseFloat(v["Product Price"]), "c") +'</td>' +*/
                    '<td>'+ v["Quantity Sold"] +' '+ add_S(v["Unit Name"], parseInt(v["Quantity Sold"])) +'</td>' +
                    '<td>'+ kendo.toString(parseFloat(v["Gross Sales"]), "c") +'</td>' +
                    '<td>'+ kendo.toString(parseFloat(v["Gross Profit"]), "c") +'</td>')
                    qtySold += parseInt(v["Quantity Sold"]);
                    grossSales += parseFloat(v["Gross Sales"]);
                    grossProfit += parseFloat(v["Gross Profit"]);
                    remainingStocks += parseInt(v["Remaining Stock"]);
                    remainingStocksAmount += (parseInt(v["Remaining Stock"]) * parseFloat(v["Product Price"]));
                    unitName = v["Unit Name"];
                });

                grandGrossSales += grossSales;
                grandGrossProfit += grossProfit;

                if(e["Main Report"]["Powders Result"].length){
                    $("#mainReportBody").append('<tr class="active">' +
                    '<td colspan="2" class="center aligned"></td>' +
                    '<td>'+remainingStocks+' '+ add_S(unitName, parseInt(remainingStocks)) +'</td>' +
                        /*'<td colspan="2"></td>' +*/
                    '<td>'+qtySold+' '+ add_S(unitName, parseInt(qtySold)) +'</td>' +
                    '<td>'+kendo.toString(grossSales, "c")+'</td>' +
                    '<td>'+kendo.toString(grossProfit, "c")+'</td>' +
                    '</tr>')
                }


                qtySold = 0;
                grossSales = 0;
                grossProfit = 0;
                remainingStocks = 0;

                //machines
                $.each(e["Main Report"]["Machines Result"], function (i,v) {
                    if(i == 0)
                        category = '<td rowspan="'+machineLength+'">'+ add_S("Machine", machineLength) +'</td>'
                    else
                        category = '';
                    $("#mainReportBody").append('<tr>' +
                    category + '<td>'+ v["Product Name"] +'</td>' +
                    '<td>'+ v["Remaining Stock"] +' '+ add_S(v["Unit Name"], parseInt(v["Remaining Stock"])) +'</td>' +
                    '<td>'+ v["Quantity Sold"] +' '+ add_S(v["Unit Name"], parseInt(v["Quantity Sold"])) +'</td>' +
                    '<td>'+ kendo.toString(parseFloat(v["Gross Sales"]), "c") +'</td>' +
                    '<td>'+ kendo.toString(parseFloat(v["Gross Profit"]), "c") +'</td>')
                    qtySold += parseInt(v["Quantity Sold"]);
                    grossSales += parseFloat(v["Gross Sales"]);
                    grossProfit += parseFloat(v["Gross Profit"]);
                    remainingStocks += parseInt(v["Remaining Stock"]);
                    remainingStocksAmount += (parseInt(v["Remaining Stock"]) * parseFloat(v["Product Price"]));
                    unitName = v["Unit Name"];
                });

                grandGrossSales += grossSales;
                grandGrossProfit += grossProfit;

                if(e["Main Report"]["Machines Result"].length){
                    $("#mainReportBody").append('<tr class="active">' +
                    '<td colspan="2" class="center aligned"></td>' +
                    '<td>'+remainingStocks+' '+ add_S(unitName, parseInt(remainingStocks)) +'</td>' +
                    '<td>'+qtySold+' '+ add_S(unitName, parseInt(qtySold)) +'</td>' +
                    '<td>'+kendo.toString(grossSales, "c")+'</td>' +
                    '<td>'+kendo.toString(grossProfit, "c")+'</td>' +
                    '</tr>')
                }

                qtySold = 0;
                grossSales = 0;
                grossProfit = 0;
                remainingStocks = 0;

                //Cups
                $.each(e["Main Report"]["Cups Result"], function (i,v) {
                    if(i == 0)
                        category = '<td rowspan="'+cupLength+'">'+ add_S("Paper Cup", cupLength) +'</td>'
                    else
                        category = '';
                    $("#mainReportBody").append('<tr>' +
                    category + '<td>'+ v["Product Name"] +'</td>' +
                    '<td>'+ v["Remaining Stock"] +' '+ add_S(v["Unit Name"], parseInt(v["Remaining Stock"])) +'</td>' +
                    '<td>'+ v["Quantity Sold"] +' '+ add_S(v["Unit Name"], parseInt(v["Quantity Sold"])) +'</td>' +
                    '<td>'+ kendo.toString(parseFloat(v["Gross Sales"]), "c") +'</td>' +
                    '<td>'+ kendo.toString(parseFloat(v["Gross Profit"]), "c") +'</td>')
                    qtySold += parseInt(v["Quantity Sold"]);
                    grossSales += parseFloat(v["Gross Sales"]);
                    grossProfit += parseFloat(v["Gross Profit"]);
                    remainingStocks += parseInt(v["Remaining Stock"]);
                    remainingStocksAmount += (parseInt(v["Remaining Stock"]) * parseFloat(v["Product Price"]));
                    unitName = v["Unit Name"];
                });

                grandGrossSales += grossSales;
                grandGrossProfit += grossProfit;

                if(e["Main Report"]["Cups Result"].length){
                    $("#mainReportBody").append('<tr class="active">' +
                    '<td colspan="2" class="center aligned"></td>' +
                    '<td>'+remainingStocks+' '+ add_S(unitName, parseInt(remainingStocks)) +'</td>' +
                    '<td>'+qtySold+' '+ add_S(unitName, parseInt(qtySold)) +'</td>' +
                    '<td>'+kendo.toString(grossSales, "c")+'</td>' +
                    '<td>'+kendo.toString(grossProfit, "c")+'</td>' +
                    '</tr>')
                }

                qtySold = 0;
                grossSales = 0;
                grossProfit = 0;
                remainingStocks = 0;

                //Parts
                $.each(e["Main Report"]["Parts Result"], function (i,v) {
                    if(i == 0)
                        category = '<td rowspan="'+partLength+'">'+ add_S("Spare Part", partLength) +'</td>'
                    else
                        category = '';
                    $("#mainReportBody").append('<tr>' +
                    category + '<td>'+ v["Product Name"] +'</td>' +
                    '<td>'+ v["Remaining Stock"] +' '+ add_S(v["Unit Name"], parseInt(v["Remaining Stock"])) +'</td>' +
                    '<td>'+ v["Quantity Sold"] +' '+ add_S(v["Unit Name"], parseInt(v["Quantity Sold"])) +'</td>' +
                    '<td>'+ kendo.toString(parseFloat(v["Gross Sales"]), "c") +'</td>' +
                    '<td>'+ kendo.toString(parseFloat(v["Gross Profit"]), "c") +'</td>')
                    qtySold += parseInt(v["Quantity Sold"]);
                    grossSales += parseFloat(v["Gross Sales"]);
                    remainingStocks += parseInt(v["Remaining Stock"]);
                    remainingStocksAmount += (parseInt(v["Remaining Stock"]) * parseFloat(v["Product Price"]));
                    grossProfit += parseFloat(v["Gross Profit"]);
                    unitName = v["Unit Name"];
                });


                grandGrossSales += grossSales;
                grandGrossProfit += grossProfit;

                if(e["Main Report"]["Parts Result"].length){
                    $("#mainReportBody").append('<tr class="active">' +
                    '<td colspan="2" class="center aligned"></td>' +
                    '<td><!--'+remainingStocks+' '+ add_S(unitName, parseInt(remainingStocks)) +'--></td>' +
                    '<td>'+qtySold+' '+ add_S(unitName, parseInt(qtySold)) +'</td>' +
                    '<td>'+kendo.toString(grossSales, "c")+'</td>' +
                    '<td>'+kendo.toString(grossProfit, "c")+'</td>' +
                    '</tr>')
                }

                var priceChanges = false;

                if(grandGrossSales != orderTotal){
                    priceChanges = true;
                    var grossSalesText = '<div style="text-decoration: line-through">'+kendo.toString(grandGrossSales, "c")+'</div><div style="font-weight: bold">'+moneyIt(orderTotal)+'</div>'
                    var grossProfitText = '<div style="text-decoration: line-through">'+kendo.toString(grandGrossProfit, "c")+'</div><div style="font-weight: bold">'+moneyIt(orderNet)+'</div>'

                    $("#changesMessage").show();
                    $("#changesMessage li:eq(0)").html('Total Sales: <span style="text-decoration: line-through">'+kendo.toString(grandGrossSales, "c")+'</span> <span style="font-weight: bold">'+moneyIt(orderTotal)+'</span>')
                    $("#changesMessage li:eq(1)").html('Total Profit: <span style="text-decoration: line-through">'+kendo.toString(grandGrossProfit, "c")+'</span> <span style="font-weight: bold">'+moneyIt(orderNet)+'</span>')
                }
                else{
                    $("#changesMessage").hide();
                    var grossSalesText = kendo.toString(grandGrossSales, "c");
                    var grossProfitText = kendo.toString(grandGrossProfit, "c");
                }

                //Grand Total
                $("#mainReportBody").append('<tr class="active">' +
                '<td colspan="2" class="right aligned" style="font-weight: bold">Remaining Stocks Amount</td>' +
                '<td>'+ moneyIt(remainingStocksAmount) +'</td>' +
                '<td colspan="1" class="right aligned" style="font-weight: bold">Grand Total</td>' +
                '<td>'+grossSalesText+'</td>' +
                '<td>'+grossProfitText+'</td>' +
                '</tr>')

                //Expenses
                $("#expensesReportBody").html("")
                var totalExpenses = 0;
                $.each(e["Expenses"], function (i,v) {
                    $("#expensesReportBody").append('<tr>' +
                    '<td>'+ v["Description"] +'</td>' +
                    '<td>'+ kendo.toString(parseFloat(v["Total"]), "c") +'</td>' +
                    '</tr>')
                    totalExpenses += parseFloat(v["Total"])
                })

                $("#expensesReportBody").append('<tr class="active">' +
                '<td class="center aligned" style="font-weight: bold">Total Expenses</td>' +
                '<td>'+ kendo.toString(totalExpenses, "c") +'</td>' +
                '</tr>')

                //fees
                $("#feesReportBody").html("")
                var totalFees = 0;
                var countFees = e["Fees"].length
                $.each(e["Fees"], function (i,v) {
                    $("#feesReportBody").append('<tr>' +
                    '<td>'+ v["Name"] +'</td>' +
                    '<td>'+ kendo.toString(parseFloat(v["Amount"]), "c") +'</td>' +
                    '</tr>')
                    totalFees += parseFloat(v["Amount"])
                })

                var netIncome = ((grandGrossProfit + totalFees) - totalExpenses);
                netIncomeColor = (netIncome > 0) ? "positive" : "negative";

                $("#feesReportBody").append('<tr class="active">' +
                '<td class="center aligned" style="font-weight: bold">Total '+add_S("Fee", countFees)+' / '+add_S("Charge", countFees)+'</td>' +
                '<td>'+ kendo.toString(totalFees, "c") +'</td>' +
                '</tr>')

                // Income

                if(priceChanges){
                    grandGrossSales = orderTotal
                    grandGrossProfit = orderNet;
                }

                $("#totalReport").html("<tr>" +
                "<td>Gross Sales</td> <td>"+ kendo.toString(grandGrossSales, "c") +"</td>" +
                "</tr>" +
                "<tr>" +
                "<td><div>Gross Profit</div><div style='font-size: xx-small'>(Total Profit + Fees)</div></td> <td>"+ kendo.toString((grandGrossProfit + totalFees), "c") +"</td>" +
                "</tr>" +
                "<tr>" +
                "<td>Expenses</td> <td>"+ kendo.toString(totalExpenses, "c") +"</td>" +
                "</tr>" +
                "<tr>" +
                "<tr>" +
                "<td><div>Net Income</div><div style='font-size: xx-small'>(Gross Profit - Expenses)</div></td> <td class='"+netIncomeColor+"'>"+ kendo.toString(netIncome, "c") +"</td>" +
                "</tr>" +
                "<tr>")

            }, "json");
        })

    }
}