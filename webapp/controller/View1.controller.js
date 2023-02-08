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
                this.getView().byId("idDetailPage").addStyleClass("dtlPageBgDC");
                this._currentDetailStyle = "dtlPageBgDC";
                if(this.getOwnerComponent().getModel("DemoData").getProperty("/MasterDesign") === "Default") {
                    this.getView().byId("idMasterList").setSelectedItem(this.getView().byId("idMasterList").getItems()[0]);
                } else {
                    this.getView().byId("idMasterList2").setSelectedItem(this.getView().byId("idMasterList2").getItems()[0]);
                }
            },
            onAfterRendering: function() {
                this.getOwnerComponent().getModel("DemoData").setProperty("/CountryInitials", this.getOwnerComponent().getModel("ImageModel").getProperty("/All"));
            },
            onHintBtnPress: function (oEvt) {
                if (!this._oPopover) {
                    this._oPopover = sap.ui.xmlfragment("idInfoPopover", "com.levi.ptpe2e.view.fragments.Information", this);
                    this.getView().addDependent(this._oPopover);
                }
                this._oPopover.openBy(oEvt.getSource());
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
            onAfterRegionDialogOpen: function () {
                var oRegionComboBox = sap.ui.core.Fragment.byId("idRegionOptionDlg", "idSelectRegions");
                var oCompCodeComboBox = sap.ui.core.Fragment.byId("idRegionOptionDlg", "idSelectCompCode");
                var oDistCenterComboBox = sap.ui.core.Fragment.byId("idRegionOptionDlg", "idSelectDistCenter");
                var aRegKeys = this.getOwnerComponent().getModel("DemoData").getProperty("/RegionFilters"),
                    aCompCodeKeys = this.getOwnerComponent().getModel("DemoData").getProperty("/CompCodeFilters"),
                    aDistCenterKeys = this.getOwnerComponent().getModel("DemoData").getProperty("/DistCentersFilters");
                oRegionComboBox.setSelectedKeys(aRegKeys);
                var aTemp = [];
                for (var i = 0; i < aRegKeys.length; i++) {
                    aTemp = aTemp.concat(this.getOwnerComponent().getModel("DemoData").getProperty("/AllRegions").filter(function (oItem) {
                        return oItem.region === aRegKeys[i]
                    })[0].CompanyCodes);
                }
                aTemp = aTemp.filter((value, index, self) => index === self.findIndex((t) => (
                    t.name === value.name
                )));
                this.getOwnerComponent().getModel("DemoData").setProperty("/RegionCompCodes", aTemp);
                var aTemp1 = [];
                aTemp.forEach(function (oItem) {
                    aTemp1 = aTemp1.concat(oItem.DistCenters);
                });
                oCompCodeComboBox.setSelectedKeys(aCompCodeKeys);
                aTemp1 = aTemp1.filter((value, index, self) => index === self.findIndex((t) => (
                    t.name === value.name
                )));
                this.getOwnerComponent().getModel("DemoData").setProperty("/RegionDistCenters", aTemp1);
                oDistCenterComboBox.setSelectedKeys(aDistCenterKeys);
            },
            onApplyRegionFilter: function () {
                var oRegionComboBox = sap.ui.core.Fragment.byId("idRegionOptionDlg", "idSelectRegions"),
                    oCompCodeComboBox = sap.ui.core.Fragment.byId("idRegionOptionDlg", "idSelectCompCode"),
                    oDistCenterComboBox = sap.ui.core.Fragment.byId("idRegionOptionDlg", "idSelectDistCenter");
                if (oRegionComboBox.getSelectedItems().length === 0) {
                    MessageBox.error("Please Select Region");
                    return;
                }
                if (oRegionComboBox.getSelectedItems().length === this.getOwnerComponent().getModel("DemoData").getProperty("/AllRegions").length) {
                    this.getOwnerComponent().getModel("DemoData").setProperty("/Region", "All");
                } else {
                    var sText = "";
                    for (var i = 0; i < oRegionComboBox.getSelectedItems().length; i++) {
                        sText += oRegionComboBox.getSelectedItems()[i].getText() + ", ";
                    }
                    sText = sText.slice(0, sText.length - 2);
                    this.getOwnerComponent().getModel("DemoData").setProperty("/Region", sText);
                }
                if (oRegionComboBox.getSelectedItems().length > 1) {
                    this.getOwnerComponent().getModel("DemoData").setProperty("/CountryInitials", this.getOwnerComponent().getModel("ImageModel").getProperty("/All"));
                } else {
                    this.getOwnerComponent().getModel("DemoData").setProperty("/CountryInitials", this.getOwnerComponent().getModel("ImageModel").getProperty("/" + sText));
                }
                var aRegionKeys = [],
                    aCompCodeKeys = [],
                    aDistCenterKeys = [];
                oRegionComboBox.getSelectedItems().forEach(function (oItem) {
                    aRegionKeys.push(oItem.getKey());
                });
                oCompCodeComboBox.getSelectedItems().forEach(function (oItem) {
                    aCompCodeKeys.push(oItem.getKey());
                });
                oDistCenterComboBox.getSelectedItems().forEach(function (oItem) {
                    aDistCenterKeys.push(oItem.getKey());
                });
                this.getOwnerComponent().getModel("DemoData").setProperty("/RegionFilters", aRegionKeys);
                this.getOwnerComponent().getModel("DemoData").setProperty("/CompCodeFilters", aCompCodeKeys);
                this.getOwnerComponent().getModel("DemoData").setProperty("/DistCentersFilters", aDistCenterKeys);
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
                    aRegionKeys = oDemoDataModel.getProperty("/RegionFilters"),
                    aSeasonKeys = oDemoDataModel.getProperty("/SeasonFilters"),
                    aFilter = [];
                for (var i = 0; i < aRegionKeys.length; i++) {
                    aFilter.push(new Filter("region", FilterOperator.EQ, aRegionKeys[i]));
                }
                var aAllFilter = new Filter(aFilter, false);
                oSelect.getBinding("items").filter(aAllFilter);
                if (aSeasonKeys.length === 0) {
                    oSelect.getItems().forEach(function (oItem) {
                        if(oItem.getBindingContext("DemoData").getObject().key === "H2 22" || oItem.getBindingContext("DemoData").getObject().key === "H1 23") {
                            aSeasonKeys.push(oItem.getKey());
                        }
                    });
                }
                oSelect.setSelectedKeys(aSeasonKeys);
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
                    oCompCodeComboBox = sap.ui.core.Fragment.byId("idVendorDlg", "idSelectCompCode"),
                    oVendorComboBox = sap.ui.core.Fragment.byId("idVendorDlg", "idSelectVendor"),
                    aAllRegions = oDemoDataModel.getProperty("/AllRegions"),
                    aRegionKeys = oDemoDataModel.getProperty("/RegionFilters"),
                    aTemp = [];
                for (var i = 0; i < aRegionKeys.length; i++) {
                    for (var j = 0; j < aAllRegions.length; j++) {
                        if (aAllRegions[j].region === aRegionKeys[i]) {
                            aTemp = aTemp.concat(aAllRegions[i].CompanyCodes);
                            break;
                        }
                    }
                }
                aTemp = aTemp.filter((value, index, self) => index === self.findIndex((t) => (
                    t.name === value.name
                )));
                oDemoDataModel.setProperty("/VendorCompCodes", aTemp);
                oCompCodeComboBox.setSelectedKeys(oDemoDataModel.getProperty("/VendorCompCodeFilters"));
                var aTemp1 = [];
                aTemp.forEach(function (oItem) {
                    aTemp1 = aTemp1.concat(oItem.Vendors);
                });
                aTemp1 = aTemp1.filter((value, index, self) => index === self.findIndex((t) => (
                    t.name === value.name
                )));
                oDemoDataModel.setProperty("/Vendors", aTemp1);
                oVendorComboBox.setSelectedKeys(oDemoDataModel.getProperty("/VendorFilters"));
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
                var oDemoDataModel = this.getOwnerComponent().getModel("DemoData"),
                    oCompCodeComboBox = sap.ui.core.Fragment.byId("idVendorDlg", "idSelectCompCode"),
                    oVendorComboBox = sap.ui.core.Fragment.byId("idVendorDlg", "idSelectVendor"),
                    aCompCodeKeys = [],
                    aVendorKeys = [];
                oCompCodeComboBox.getSelectedItems().forEach(function (oItem) {
                    aCompCodeKeys.push(oItem.getKey());
                });
                oVendorComboBox.getSelectedItems().forEach(function (oItem) {
                    aVendorKeys.push(oItem.getKey());
                });
                oDemoDataModel.setProperty("/VendorCompCodeFilters", aCompCodeKeys);
                oDemoDataModel.setProperty("/VendorFilters", aVendorKeys);
                if (oVendorComboBox.getItems().length === oVendorComboBox.getSelectedItems().length) {
                    oDemoDataModel.setProperty("/Vendor", "All");
                } else {
                    oDemoDataModel.setProperty("/Vendor", oVendorComboBox.getSelectedItems().length);
                }
                this._oVendorFilterDlg.close();
                this._refreshRandomData();
            },
            onCancelVendorDialog: function () {
                this._oVendorFilterDlg.close();
            },
            onApplyTimeFilter: function () {
                var oSelect = sap.ui.core.Fragment.byId("idTimeRangeDlg", "idSelectSeason"),
                    oDemoDataModel = this.getOwnerComponent().getModel("DemoData");
                if (oSelect.getSelectedItems().length === 0) {
                    MessageBox.error("Please select atleast one season to proceed");
                    return;
                }
                if (oSelect.getItems().length === oSelect.getSelectedItems().length) {
                    oDemoDataModel.setProperty("/Season", "All");
                } else {
                    oDemoDataModel.setProperty("/Season", oSelect.getSelectedItems().length);
                }
                var aSeasonKeys = [];
                oSelect.getSelectedItems().forEach(function (oItem) {
                    aSeasonKeys.push(oItem.getKey());
                });
                oDemoDataModel.setProperty("/SeasonFilters", aSeasonKeys);
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
                    aCols = oSelObj.Cols;
                if(oDemoDataModel.getProperty("/SeasonFilters").length > 0) {
                    oSelObj.Season = oDemoDataModel.getProperty("/SeasonFilters")[0];
                } else {
                    oSelObj.Season = "H2 22/H2 22 LEVIS US";
                }
                var sValidFrom = oSelObj.Season.slice(0, 2) === "H1" ? "01/01/2022" : "07/01/2022";
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
                oTable.destroyColumns();
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
            },
            onMasterDesignToggle: function(oEvt) {
                if(oEvt.getSource().getPressed()) {
                    this.getView().byId("idMasterPage").removeStyleClass("pageBg");
                    this.getOwnerComponent().getModel("DemoData").setProperty("/MasterDesign", "New");
                } else {
                    this.getView().byId("idMasterPage").addStyleClass("pageBg");
                    this.getOwnerComponent().getModel("DemoData").setProperty("/MasterDesign", "Default");
                }
            }

        });
    });
