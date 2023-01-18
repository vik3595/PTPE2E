sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "../utils/formatter",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, formatter) {
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
                this._refreshTableRandomData();
                this._refreshPanelRandomData();
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
            _updateDateRangeValue: function (sValue, oDateValue) {
                debugger
                var sText = "Showing For: ";
                if (sValue === 'PRS') {
                    sText += "Pre Season";
                } else if (sValue === "INS") {
                    sText += "In Season";
                } else if (sValue === "POS") {
                    sText += "Post Season";
                } else {
                    sText = "Showing between: " + oDateValue;
                }
                this.getOwnerComponent().getModel("DemoData").setProperty("/DateRangeText", sText);
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
                if (oDemoDataModel.getProperty("/Design") === "Table") {
                    this._refreshTableRandomData();
                } else {
                    this._refreshPanelRandomData();
                }
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
            openVendorFilter: function () {
                if (!this._oVendorFilterDlg) {
                    this._oVendorFilterDlg = sap.ui.xmlfragment("idVendorDlg", "com.levi.ptpe2e.view.fragments.Vendors", this);
                    this.getView().addDependent(this._oVendorFilterDlg);
                }
                this._oVendorFilterDlg.open();
            },
            onTableMicroChartPress: function (oEvt) {
                var aCustomData = oEvt.getSource().getCustomData()[0].getValue().split("--"),
                    oSelObj = oEvt.getSource().getBindingContext("DemoData").getObject(),
                    sTimeRange = this.getOwnerComponent().getModel("DemoData").getProperty("/TimeRange");
                if (sTimeRange === "PRS") {
                    sTimeRange = "Pre Season";
                } else if (sTimeRange === "INS") {
                    sTimeRange = "In Season";
                } else if (sTimeRange === "POS") {
                    sTimeRange = "Post Season";
                } else {
                    sTimeRange = this.getOwnerComponent().getModel("DemoData").getProperty("/DateRangeText").split(": ")[1];
                }
                var aTemp = [];
                for (var i = 0; i < 2; i++) {
                    var oTemp = {
                        "DocNo": Math.floor(Math.random() * 1000000000),
                        "Forcast": oSelObj[aCustomData[1]],
                        "OA": oSelObj[aCustomData[0]],
                        "Percentage": ((oSelObj[aCustomData[0]] / oSelObj[aCustomData[1]]) * 100).toFixed(2),
                        "PC9": "Test Value",
                        "Qty": Math.floor(Math.random() * 10),
                        "Season": sTimeRange
                    };
                    aTemp.push(oTemp);
                }
                this.getOwnerComponent().getModel("DemoData").setProperty("/TableDetailData", aTemp);
                if (!this._oTileDetailDlg) {
                    this._oTileDetailDlg = sap.ui.xmlfragment("idTileDetailDlg", "com.levi.ptpe2e.view.fragments.TileDetails", this);
                    this.getView().addDependent(this._oTileDetailDlg);
                }
                this._oTileDetailDlg.open();
            },
            onCloseTileDetailDialog: function () {
                this._oTileDetailDlg.close();
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
                if (this.getOwnerComponent().getModel("DemoData").getProperty("/Design") === "Table") {
                    this._refreshTableRandomData();
                } else {
                    this._refreshPanelRandomData();
                }
            },
            onCancelVendorDialog: function () {
                this._oVendorFilterDlg.close();
            },
            onApplyTimeFilter: function () {
                var sTimeRange = this.getOwnerComponent().getModel("DemoData").getProperty("/TimeRange");
                if (sTimeRange === "Custom") {
                    var oDateValue = sap.ui.core.Fragment.byId("idTimeRangeDlg", "idDateRange").getValue();
                    if (oDateValue === null || oDateValue === undefined) {
                        MessageBox.error("Please select date range to proceed");
                        return;
                    }
                    this._updateDateRangeValue(sTimeRange, oDateValue);
                } else {
                    this._updateDateRangeValue(sTimeRange, null);
                }
                this._oTimeRangeDlg.close();
                if (this.getOwnerComponent().getModel("DemoData").getProperty("/Design") === "Table") {
                    this._refreshTableRandomData();
                } else {
                    this._refreshPanelRandomData();
                }
            },
            onCancelTimeFilter: function () {
                this._oTimeRangeDlg.close();
            },
            onListItemPress: function (oEvt) {
                var oDetailPage = this.getView().byId("idDetailPage"),
                    sDesign = this.getOwnerComponent().getModel("DemoData").getProperty("/Design");
                this.getView().byId("idSplitApp").toDetail(oDetailPage);
                oDetailPage.removeStyleClass(this._currentDetailStyle);
                oDetailPage.addStyleClass(oEvt.getParameter("listItem").getCustomData()[0].getValue());
                this._currentDetailStyle = oEvt.getParameter("listItem").getCustomData()[0].getValue();
                if (sDesign === "Table") {
                    this._refreshTableRandomData();
                } else {
                    this._refreshPanelRandomData();
                }
            },
            onNavigateToMaster: function () {
                this.getView().byId("idSplitApp").toMaster(this.getView().byId("idMasterPage"));
            },
            onPanelGenericTilePress: function (oEvt) {
                var sTimeRange = this.getOwnerComponent().getModel("DemoData").getProperty("/TimeRange"),
                    oSelObj = oEvt.getSource().getBindingContext("DemoData").getObject();
                if (sTimeRange === "PRS") {
                    sTimeRange = "Pre Season";
                } else if (sTimeRange === "INS") {
                    sTimeRange = "In Season";
                } else if (sTimeRange === "POS") {
                    sTimeRange = "Post Season";
                } else {
                    sTimeRange = this.getOwnerComponent().getModel("DemoData").getProperty("/DateRangeText").split(": ")[1];
                }
                var aTemp = [];
                for (var i = 0; i < 2; i++) {
                    var oTemp = {
                        "DocNo": Math.floor(Math.random() * 1000000000),
                        "Forcast": oSelObj.value2,
                        "OA": oSelObj.value1,
                        "Percentage": ((oSelObj.value1 / oSelObj.value2) * 100).toFixed(2),
                        "PC9": "Test Value",
                        "Qty": Math.floor(Math.random() * 10),
                        "Season": sTimeRange
                    };
                    aTemp.push(oTemp);
                }
                this.getOwnerComponent().getModel("DemoData").setProperty("/TableDetailData", aTemp);
                if (!this._oTileDetailDlg) {
                    this._oTileDetailDlg = sap.ui.xmlfragment("idTileDetailDlg", "com.levi.ptpe2e.view.fragments.TileDetails", this);
                    this.getView().addDependent(this._oTileDetailDlg);
                }
                this._oTileDetailDlg.open();
            },
            _refreshTableRandomData: function () {
                var oBsyDlg = new sap.m.BusyDialog();
                oBsyDlg.open();
                jQuery.sap.delayedCall(250, this, function () {
                    var aData = this.getOwnerComponent().getModel("DemoData").getProperty("/TableData");
                    for (var i = 0; i < aData.length; i++) {
                        aData[i].OACreation_Forcast = Math.floor(Math.random() * (10 - 1) + 1);
                        aData[i].OACreation_OA = Math.floor(Math.random() * (aData[i].OACreation_Forcast - 1) + 1);

                        aData[i].POIssuance_OA = Math.floor(Math.random() * (10 - 1) + 1);
                        aData[i].POIssuance_PO = Math.floor(Math.random() * (aData[i].POIssuance_OA - 1) + 1);

                        aData[i].PackListCreation_PO = Math.floor(Math.random() * (10 - 1) + 1);
                        aData[i].PackListCreation_PL = Math.floor(Math.random() * (aData[i].PackListCreation_PO - 1) + 1);

                        aData[i].IBDCreation_POPL = Math.floor(Math.random() * (10 - 1) + 1);
                        aData[i].IBDCreation_IBD = Math.floor(Math.random() * (aData[i].IBDCreation_POPL - 1) + 1);

                        aData[i].ShipMilesUpdate_Forcast = Math.floor(Math.random() * (10 - 1) + 1);
                        aData[i].ShipMilesUpdate_OA = Math.floor(Math.random() * (aData[i].ShipMilesUpdate_Forcast - 1) + 1);

                        aData[i].GoodReciept_IBD = Math.floor(Math.random() * (10 - 1) + 1);
                        aData[i].GoodReciept_GR = Math.floor(Math.random() * (aData[i].GoodReciept_IBD - 1) + 1);

                        aData[i].VendorInvoice_GR = Math.floor(Math.random() * (10 - 1) + 1);
                        aData[i].VendorInvoice_INV = Math.floor(Math.random() * (aData[i].VendorInvoice_GR - 1) + 1);
                    }
                    this.getOwnerComponent().getModel("DemoData").setProperty("/TableData", aData);
                    oBsyDlg.close();
                });
            },
            _refreshPanelRandomData: function () {
                var oBsyDlg = new sap.m.BusyDialog();
                oBsyDlg.open();
                jQuery.sap.delayedCall(250, this, function () {
                    var aData = this.getOwnerComponent().getModel("DemoData").getProperty("/PanelData");
                    for (var i = 0; i < aData.length; i++) {
                        for (var j = 0; j < aData[i].Tiles.length; j++) {
                            aData[i].Tiles[j].value2 = Math.floor(Math.random() * (10 - 1) + 1);;
                            aData[i].Tiles[j].value1 = Math.floor(Math.random() * (aData[i].Tiles[j].value2 - 1) + 1);;
                        }
                    }
                    this.getOwnerComponent().getModel("DemoData").setProperty("/PanelData", aData);
                    oBsyDlg.close();
                });
            }
        });
    });
