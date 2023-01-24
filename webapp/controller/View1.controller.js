sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "../utils/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast, MessageBox, formatter, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("com.levi.ptpe2e.controller.View1", {
            formatter: formatter,
            onInit: function () {
                var oImageModel = new sap.ui.model.json.JSONModel({
                    US: jQuery.sap.getModulePath("com.levi.ptpe2e", "/img/US.jpg"),
                    MX: jQuery.sap.getModulePath("com.levi.ptpe2e", "/img/MX.jpg"),
                    CA: jQuery.sap.getModulePath("com.levi.ptpe2e", "/img/CA.jpg"),
                    All: jQuery.sap.getModulePath("com.levi.ptpe2e", "/img/globe.jpg")
                });
                this.getOwnerComponent().setModel(oImageModel, "ImageModel");
                this.getOwnerComponent().getModel("DemoData").setProperty("/CountryInitials", jQuery.sap.getModulePath("com.levi.ptpe2e", "/img/US.jpg"));
                this.getView().byId("idDetailPage").addStyleClass("dtlPageBgDC");
                this._currentDetailStyle = "dtlPageBgDC";
                this.getView().byId("idMasterList").setSelectedItem(this.getView().byId("idMasterList").getItems()[0]);
            },
            _getValueColor: function (sValue) {
                if (sValue >= 75) {
                    return "Good";
                } else if (sValue < 75 && sValue > 30) {
                    return "Critical";
                } else {
                    return "Error";
                }
            },
            onChangeDesign: function () {
                if (!this._oChangeDesign) {
                    this._oChangeDesign = sap.ui.xmlfragment("idChangeDesignDlg", "com.levi.ptpe2e.view.fragments.DesignOptions", this);
                    this.getView().addDependent(this._oChangeDesign);
                }
                this._oChangeDesign.open();
            },
            onDesginValueHelpClose: function (oEvt) {
                this.getOwnerComponent().getModel("DemoData").setProperty("/Design", oEvt.getParameter("selectedItem").getTitle());
            },
            openRegionSelection: function () {
                if (!this._oRegionOptionDlg) {
                    this._oRegionOptionDlg = sap.ui.xmlfragment("idRegionOptionDlg", "com.levi.ptpe2e.view.fragments.RegionDialog", this);
                    this.getView().addDependent(this._oRegionOptionDlg);
                }
                this._oRegionOptionDlg.open();
            },
            onApplyRegionFilter: function () {
                var oDemoDataModel = this.getOwnerComponent().getModel("DemoData"),
                    oRegionComboBox = sap.ui.core.Fragment.byId("idRegionOptionDlg", "idSelectRegions");
                if (oRegionComboBox.getSelectedItems().length === 0) {
                    MessageBox.error("Please Select Region");
                    return;
                }
                if (oRegionComboBox.getSelectedItems().length === oDemoDataModel.getProperty("/AllRegions").length) {
                    oDemoDataModel.setProperty("/Region", "All");
                } else {
                    var sText = "";
                    for (var i = 0; i < oRegionComboBox.getSelectedItems().length; i++) {
                        sText += oRegionComboBox.getSelectedItems()[i].getText() + ", ";
                    }
                    sText = sText.slice(0, sText.length - 2);
                    oDemoDataModel.setProperty("/Region", sText);
                }
                if (oRegionComboBox.getSelectedItems().length > 1) {
                    oDemoDataModel.setProperty("/CountryInitials", this.getOwnerComponent().getModel("ImageModel").getProperty("/All"));
                } else {
                    oDemoDataModel.setProperty("/CountryInitials", this.getOwnerComponent().getModel("ImageModel").getProperty("/" + sText));
                }
                this._refreshRandomData();
                this._oRegionOptionDlg.close();
            },
            onCancelRegionDialog: function () {
                this._oRegionOptionDlg.close();
            },
            openTimeFilter: function () {
                if (!this._oTimeRangeDlg) {
                    this._oTimeRangeDlg = sap.ui.xmlfragment("idTimeRangeDlg", "com.levi.ptpe2e.view.fragments.TimeFilter", this);
                    this.getView().addDependent(this._oTimeRangeDlg);
                }
                this._oTimeRangeDlg.open();
            },
            onAfterTimeFilterOpen: function () {
                var oDemoDataModel = this.getOwnerComponent().getModel("DemoData"),
                    oSelect = sap.ui.core.Fragment.byId("idTimeRangeDlg", "idSelectSeason"),
                    sRegion = oDemoDataModel.getProperty("/Region"),
                    aFilter = [];
                if (sRegion === "All") {
                    aFilter.push(new Filter("region", FilterOperator.EQ, "US"));
                    aFilter.push(new Filter("region", FilterOperator.EQ, "CA"));
                    aFilter.push(new Filter("region", FilterOperator.EQ, "MX"));
                } else {
                    var aRegionKey = sRegion.split(", ");
                    for (var i = 0; i < aRegionKey.length; i++) {
                        aFilter.push(new Filter("region", FilterOperator.EQ, aRegionKey[i]));
                    }
                }
                var aAllFilter = new Filter(aFilter, false);
                oSelect.getBinding("items").filter(aAllFilter);
            },
            openVendorFilter: function () {
                if (!this._oVendorFilterDlg) {
                    this._oVendorFilterDlg = sap.ui.xmlfragment("idVendorDlg", "com.levi.ptpe2e.view.fragments.Vendors", this);
                    this.getView().addDependent(this._oVendorFilterDlg);
                }
                this._oVendorFilterDlg.open();
            },
            onAfterVendorDlgOpen: function (oEvt) {
                var oDemoDataModel = this.getOwnerComponent().getModel("DemoData"),
                    aAllRegions = oDemoDataModel.getProperty("/AllRegions"),
                    sRegion = oDemoDataModel.getProperty("/Region"),
                    aTemp = [];
                if (sRegion === "All") {
                    for (var i = 0; i < aAllRegions.length; i++) {
                        aTemp = aTemp.concat(aAllRegions[i].CompanyCodes);
                    }
                    aTemp = aTemp.filter((value, index, self) => index === self.findIndex((t) => (
                        t.name === value.name
                    )));
                    oDemoDataModel.setProperty("/VendorCompCodes", aTemp);
                } else {
                    var aRegionKey = sRegion.split(", ");
                    for (var i = 0; i < aRegionKey.length; i++) {
                        for (var j = 0; j < aAllRegions.length; j++) {
                            if (aAllRegions[j].region === aRegionKey[i]) {
                                aTemp = aTemp.concat(aAllRegions[i].CompanyCodes);
                                break;
                            }
                        }
                    }
                    aTemp = aTemp.filter((value, index, self) => index === self.findIndex((t) => (
                        t.name === value.name
                    )));
                    oDemoDataModel.setProperty("/VendorCompCodes", aTemp);
                }
                oEvt.getSource().setTitle("Select Vendors for " + sRegion + " region");
            },
            onCompCodeChangeForVendor: function (oEvt) {
                var aSelectedItems = oEvt.getParameter("selectedItems"),
                    oDemoDataModel = this.getOwnerComponent().getModel("DemoData");
                if (aSelectedItems.length > 0) {
                    var aTemp = [];
                    for (var i = 0; i < aSelectedItems.length; i++) {
                        aTemp = aTemp.concat(oDemoDataModel.getProperty(aSelectedItems[i].getBindingContext("DemoData").getPath()).Vendors);
                    }
                    aTemp = aTemp.filter((value, index, self) => index === self.findIndex((t) => (
                        t.name === value.name
                    )));
                    oDemoDataModel.setProperty("/Vendors", aTemp);
                } else {
                    oDemoDataModel.setProperty("/Vendors", []);
                }
            },
            onRegionChange: function (oEvt) {
                var sType = oEvt.getSource().getCustomData()[0].getValue(),
                    oDemoDataModel = this.getOwnerComponent().getModel("DemoData");
                if (sType === "Region") {
                    var aSelectedItems = oEvt.getParameter("selectedItems");
                    if (aSelectedItems.length > 0) {
                        var aTemp = [];
                        for (var i = 0; i < aSelectedItems.length; i++) {
                            aTemp = aTemp.concat(oDemoDataModel.getProperty(aSelectedItems[i].getBindingContext("DemoData").getPath()).CompanyCodes);
                        }
                        aTemp = aTemp.filter((value, index, self) => index === self.findIndex((t) => (
                            t.name === value.name
                        )));
                        oDemoDataModel.setProperty("/RegionCompCodes", aTemp);
                    } else {
                        oDemoDataModel.setProperty("/RegionCompCodes", []);
                        oDemoDataModel.setProperty("/RegionDistCenters", []);
                    }
                } else if (sType === "CompCode") {
                    var aSelectedItems = oEvt.getParameter("selectedItems");
                    if (aSelectedItems.length > 0) {
                        var aTemp = [];
                        for (var i = 0; i < aSelectedItems.length; i++) {
                            aTemp = aTemp.concat(oDemoDataModel.getProperty(aSelectedItems[i].getBindingContext("DemoData").getPath()).DistCenters);
                        }
                        aTemp = aTemp.filter((value, index, self) => index === self.findIndex((t) => (
                            t.name === value.name
                        )));
                        oDemoDataModel.setProperty("/RegionDistCenters", aTemp);
                    } else {
                        oDemoDataModel.setProperty("/RegionDistCenters", []);
                    }
                }
            },
            onApplyVendorSelection: function () {
                var iLength = sap.ui.core.Fragment.byId("idVendorDlg", "idSelectVendor").getSelectedItems().length;
                this.getOwnerComponent().getModel("DemoData").setProperty("/VendorCount", iLength);
                this._oVendorFilterDlg.close();
                this._refreshRandomData();
            },
            onCancelVendorDialog: function () {
                this._oVendorFilterDlg.close();
            },
            onApplyTimeFilter: function () {
                var sTimeRange = this.getOwnerComponent().getModel("DemoData").getProperty("/TimeRange");
                this.getOwnerComponent().getModel("DemoData").setProperty("/DateRangeText", sTimeRange);
                this._oTimeRangeDlg.close();
                this._refreshRandomData();
            },
            onCancelTimeFilter: function () {
                this._oTimeRangeDlg.close();
            },
            onListItemPress: function (oEvt) {
                var oDetailPage = this.getView().byId("idDetailPage");
                oDetailPage.removeStyleClass(this._currentDetailStyle);
                this._currentDetailStyle = oEvt.getParameter("listItem").getCustomData()[0].getValue();
                oDetailPage.addStyleClass(this._currentDetailStyle);
                this._refreshRandomData();
            },
            onNavigateToMaster: function () {
                this.getView().byId("idSplitApp").toMaster(this.getView().byId("idMasterPage"));
            },
            onTestTilePress: function (oEvt) {
                var oDemoDataModel = this.getOwnerComponent().getModel("DemoData"),
                    sType = oEvt.getSource().getCustomData()[0].getValue(),
                    sPath = "";
                if (sType === "GT") {
                    sPath = oEvt.getSource().getBindingInfo("header").binding.getPath();
                    sPath = sPath.slice(0, sPath.lastIndexOf("/"));
                } else if (sType === "RMC") {
                    sPath = oEvt.getSource().getBindingInfo("percentage").binding.getBindings()[0].getPath();
                    sPath = sPath.slice(0, sPath.lastIndexOf("/"));
                } else if (sType === "NC") {
                    sPath = oEvt.getSource().getBindingInfo("value").binding.getBindings()[0].getPath();
                    sPath = sPath.slice(0, sPath.lastIndexOf("/"));
                }
                var oSelObj = oDemoDataModel.getProperty(sPath),
                    aCols = oSelObj.Cols,
                    sTimeRange = oDemoDataModel.getProperty("/TimeRange");
                var sValidFrom = sTimeRange.slice(0, 2) === "H1" ? "01/01/2022" : "07/01/2022";
                oSelObj.Season = sTimeRange;
                oSelObj.ValidFrom = sValidFrom;
                oSelObj.ValidTo = "12/31/9999";
                if (!this._oTestDlg) {
                    this._oTestDlg = sap.ui.xmlfragment("idTestTileDlg", "com.levi.ptpe2e.view.fragments.Test", this);
                    this.getView().addDependent(this._oTestDlg);
                }
                this._oTestDlg.open();
                var oModel = new sap.ui.model.json.JSONModel([oSelObj]);
                var oTable = sap.ui.core.Fragment.byId("idTestTileDlg", "idTestTable");
                var oCell = [];
                oTable.setModel(oModel);
                for (var i = 0; i < aCols.length; i++) {
                    oTable.addColumn(new sap.m.Column({
                        header: new sap.m.Label({
                            text: aCols[i].ColName,
                            wrapping: true
                        }),
                    }));
                    oCell.push(
                        new sap.m.Text({
                            text: "{" + aCols[i].ColProperty + "}",
                            wrapping: true
                        })
                    );
                }
                oTable.addColumn(new sap.m.Column({
                    header: new sap.m.Label({
                        text: "Valid From",
                        wrapping: true
                    }),
                }));
                oCell.push(
                    new sap.m.Text({
                        text: "{ValidFrom}",
                        wrapping: true
                    })
                );
                oTable.addColumn(new sap.m.Column({
                    header: new sap.m.Label({
                        text: "Valid To",
                        wrapping: true
                    }),
                }));
                oCell.push(
                    new sap.m.Text({
                        text: "{ValidTo}",
                        wrapping: true
                    })
                );
                var oTemplate = new sap.m.ColumnListItem({
                    cells: oCell
                });
                oTable.bindAggregation("items", "/", oTemplate);
            },
            onCloseTestDialog: function () {
                this._oTestDlg.close();
                this._oTestDlg.destroy();
                this._oTestDlg = undefined;
                this._oTestDlg = null;
            },
            _refreshRandomData: function () {
                var oBsyDlg = new sap.m.BusyDialog();
                oBsyDlg.open();
                jQuery.sap.delayedCall(350, this, function () {
                    var oDemoDataModel = this.getOwnerComponent().getModel("DemoData");
                    var aTilesData = oDemoDataModel.getProperty("/TilesData");
                    for (var i = 0; i < aTilesData.length; i++) {
                        for (var j = 0; j < aTilesData[i].Tiles.length; j++) {
                            if (aTilesData[i].Tiles[j].SubHeader !== "Not Applicable") {
                                if (aTilesData[i].Tiles[j].PropertyType === "Qty") {
                                    aTilesData[i].Tiles[j][aTilesData[i].Tiles[j].Value2Property] = Math.floor(Math.random() * 100);
                                    aTilesData[i].Tiles[j][aTilesData[i].Tiles[j].Value1Property] = Math.floor(Math.random() * (aTilesData[i].Tiles[j][aTilesData[i].Tiles[j].Value2Property] - 1) + 1);
                                } else if (aTilesData[i].Tiles[j].PropertyType === "Amt") {
                                    aTilesData[i].Tiles[j][aTilesData[i].Tiles[j].Value2Property] = Math.floor(1000 + Math.random() * 9000);
                                    aTilesData[i].Tiles[j][aTilesData[i].Tiles[j].Value1Property] = Math.floor(Math.random() * (aTilesData[i].Tiles[j][aTilesData[i].Tiles[j].Value2Property] - 1) + 1);
                                } else if (aTilesData[i].Tiles[j].PropertyType === "Date") {
                                    function randomDate(start, end) {
                                        var date = new Date(+start + Math.random() * (end - start));
                                        return date;
                                    }
                                    var oDate1 = randomDate(new Date("12/1/2022"), new Date("12/31/2022"));
                                    var oDate2 = randomDate(new Date("12/1/2022"), new Date("12/31/2022"));
                                    aTilesData[i].Tiles[j][aTilesData[i].Tiles[j].Value2Property] = oDate2.toLocaleDateString();
                                    aTilesData[i].Tiles[j][aTilesData[i].Tiles[j].Value1Property] = oDate1.toLocaleDateString();
                                }
                            }
                        }
                    }
                    oDemoDataModel.setProperty("/TilesData", aTilesData);
                    oBsyDlg.close();
                });
            }

        });
    });
