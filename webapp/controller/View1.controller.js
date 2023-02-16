sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "../utils/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, formatter, Filter, FilterOperator, Fragment) {
        "use strict";

        return Controller.extend("com.levi.ptpe2e.controller.View1", {
            formatter: formatter,
            _bDefaultDesign: true,
            onInit: function () {
                var oImageModel = new sap.ui.model.json.JSONModel({
                    US: jQuery.sap.getModulePath("com.levi.ptpe2e", "/img/US.jpg"),
                    MX: jQuery.sap.getModulePath("com.levi.ptpe2e", "/img/MX.jpg"),
                    CA: jQuery.sap.getModulePath("com.levi.ptpe2e", "/img/CA.jpg"),
                    All: jQuery.sap.getModulePath("com.levi.ptpe2e", "/img/globe1.jpg")
                });
                this.getOwnerComponent().setModel(oImageModel, "ImageModel");
                this.getView().byId("idDetailPage").addStyleClass("dtlPageBgDC");
                this.oDemoDataModel = this.getOwnerComponent().getModel("DemoData");
                this.oImageModel = this.getOwnerComponent().getModel("ImageModel");
                this._currentDetailStyle = "dtlPageBgDC";
                if (!this.getOwnerComponent().getModel("device").getData().system.phone) {
                    if (this.oDemoDataModel.getProperty("/MasterDesign") === "Default") {
                        this.getView().byId("idMasterList").setSelectedItem(this.getView().byId("idMasterList").getItems()[0]);
                    } else {
                        this.getView().byId("idMasterList2").setSelectedItem(this.getView().byId("idMasterList2").getItems()[0]);
                    }
                }
            },
            onAfterRendering: function () {
                jQuery.sap.delayedCall(350, this, function () {
                    this.oDemoDataModel.setProperty("/RegionLogo", this.oImageModel.getProperty("/All"));
                });
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
                if (this.oDemoDataModel.getProperty("/Design") === "Transparent") {
                    this.oDemoDataModel.setProperty("/Design", "Table")
                } else {
                    this.oDemoDataModel.setProperty("/Design", "Transparent")
                }
            },
            onAfterRegionDialogOpen: function () {
                var oRegionComboBox = Fragment.byId("idFilterSettingsDlg", "idRegionComboBox"),
                    oCompCodeComboBox = Fragment.byId("idFilterSettingsDlg", "idCompCodeComboBox"),
                    oDistCenterComboBox = Fragment.byId("idFilterSettingsDlg", "idDistCenterComboBox"),
                    oVendorComboBox = Fragment.byId("idFilterSettingsDlg", "idVendorComboBox"),
                    oSeasonComboBox = Fragment.byId("idFilterSettingsDlg", "idSeasonComboBox"),
                    aRegKeys = this.oDemoDataModel.getProperty("/RegionFilters"),
                    aCompCodeKeys = this.oDemoDataModel.getProperty("/CompCodeFilters"),
                    aVendorKeys = this.oDemoDataModel.getProperty("/VendorFilters"),
                    aDistCenterKeys = this.oDemoDataModel.getProperty("/DistCentersFilters");
                oRegionComboBox.setSelectedKeys(aRegKeys);
                var aTemp = [];
                for (var i = 0; i < aRegKeys.length; i++) {
                    aTemp = aTemp.concat(this.oDemoDataModel.getProperty("/AllRegions").filter(function (oItem) {
                        return oItem.region === aRegKeys[i]
                    })[0].CompanyCodes);
                }
                aTemp = aTemp.filter((value, index, self) => index === self.findIndex((t) => (
                    t.name === value.name
                )));
                this.oDemoDataModel.setProperty("/CompCodes", aTemp);
                var aTemp1 = [],
                    aTemp2 = [];
                aTemp.forEach(function (oItem) {
                    aTemp1 = aTemp1.concat(oItem.DistCenters);
                    aTemp2 = aTemp1.concat(oItem.Vendors);
                });
                oCompCodeComboBox.setSelectedKeys(aCompCodeKeys);
                aTemp1 = aTemp1.filter((value, index, self) => index === self.findIndex((t) => (
                    t.name === value.name
                )));
                aTemp2 = aTemp2.filter((value, index, self) => index === self.findIndex((t) => (
                    t.name === value.name
                )));
                this.oDemoDataModel.setProperty("/DistCenters", aTemp1);
                this.oDemoDataModel.setProperty("/Vendors", aTemp2);
                oDistCenterComboBox.setSelectedKeys(aDistCenterKeys);
                oVendorComboBox.setSelectedKeys(aVendorKeys);
            },

            onCompCodeChangeForVendor: function (oEvt) {
                var aSelectedItems = oEvt.getParameter("selectedItems");
                if (aSelectedItems.length > 0) {
                    var aTemp = [];
                    for (var i = 0; i < aSelectedItems.length; i++) {
                        aTemp = aTemp.concat(this.oDemoDataModel.getProperty(aSelectedItems[i].getBindingContext("DemoData").getPath()).Vendors);
                    }
                    aTemp = aTemp.filter((value, index, self) => index === self.findIndex((t) => (
                        t.name === value.name
                    )));
                    this.oDemoDataModel.setProperty("/Vendors", aTemp);
                } else {
                    this.oDemoDataModel.setProperty("/Vendors", []);
                }
            },
            onRegionChange: function (oEvt) {
                var sType = oEvt.getSource().getCustomData()[0].getValue();
                if (sType === "Region") {
                    var aSelectedItems = oEvt.getParameter("selectedItems");
                    if (aSelectedItems.length > 0) {
                        var aTemp = [];
                        for (var i = 0; i < aSelectedItems.length; i++) {
                            aTemp = aTemp.concat(this.oDemoDataModel.getProperty(aSelectedItems[i].getBindingContext("DemoData").getPath()).CompanyCodes);
                        }
                        aTemp = aTemp.filter((value, index, self) => index === self.findIndex((t) => (
                            t.name === value.name
                        )));
                        this.oDemoDataModel.setProperty("/RegionCompCodes", aTemp);
                    } else {
                        this.oDemoDataModel.setProperty("/RegionCompCodes", []);
                        this.oDemoDataModel.setProperty("/RegionDistCenters", []);
                    }
                } else if (sType === "CompCode") {
                    var aSelectedItems = oEvt.getParameter("selectedItems");
                    if (aSelectedItems.length > 0) {
                        var aTemp = [];
                        for (var i = 0; i < aSelectedItems.length; i++) {
                            aTemp = aTemp.concat(this.oDemoDataModel.getProperty(aSelectedItems[i].getBindingContext("DemoData").getPath()).DistCenters);
                        }
                        aTemp = aTemp.filter((value, index, self) => index === self.findIndex((t) => (
                            t.name === value.name
                        )));
                        this.oDemoDataModel.setProperty("/RegionDistCenters", aTemp);
                    } else {
                        this.oDemoDataModel.setProperty("/RegionDistCenters", []);
                    }
                }
            },
            onApplyVendorSelection: function () {
                var oCompCodeComboBox = Fragment.byId("idVendorDlg", "idSelectCompCode"),
                    oVendorComboBox = Fragment.byId("idVendorDlg", "idSelectVendor"),
                    aCompCodeKeys = [],
                    aVendorKeys = [];
                oCompCodeComboBox.getSelectedItems().forEach(function (oItem) {
                    aCompCodeKeys.push(oItem.getKey());
                });
                oVendorComboBox.getSelectedItems().forEach(function (oItem) {
                    aVendorKeys.push(oItem.getKey());
                });
                this.oDemoDataModel.setProperty("/VendorCompCodeFilters", aCompCodeKeys);
                this.oDemoDataModel.setProperty("/VendorFilters", aVendorKeys);
                if (oVendorComboBox.getItems().length === oVendorComboBox.getSelectedItems().length) {
                    this.oDemoDataModel.setProperty("/Vendor", "All");
                } else {
                    this.oDemoDataModel.setProperty("/Vendor", oVendorComboBox.getSelectedItems().length);
                }
                this._oVendorFilterDlg.close();
                this._refreshRandomData();
            },
            onCancelVendorDialog: function () {
                this._oVendorFilterDlg.close();
            },
            onApplyTimeFilter: function () {
                var oSelect = Fragment.byId("idTimeRangeDlg", "idSelectSeason");
                if (oSelect.getSelectedItems().length === 0) {
                    MessageBox.error("Please select atleast one season to proceed");
                    return;
                }
                if (oSelect.getItems().length === oSelect.getSelectedItems().length) {
                    this.oDemoDataModel.setProperty("/Season", "All");
                } else {
                    this.oDemoDataModel.setProperty("/Season", oSelect.getSelectedItems().length);
                }
                var aSeasonKeys = [];
                oSelect.getSelectedItems().forEach(function (oItem) {
                    aSeasonKeys.push(oItem.getKey());
                });
                this.oDemoDataModel.setProperty("/SeasonFilters", aSeasonKeys);
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
                if (this.getOwnerComponent().getModel("device").getData().system.phone) {
                    this.getView().byId("idSplitApp").toMaster(this.getView().byId("idDetailPage"), "baseSlide");
                }
            },
            onNavigateToMaster: function () {
                this.getView().byId("idSplitApp").backMaster();
            },
            onTestTilePress: function (oEvt) {
                var sType = oEvt.getSource().getCustomData()[0].getValue(),
                    sPath = "",
                    sColor = "";

                if (sType === "GT") {
                    if (oEvt.getSource().getTileContent()[0].getContent().getId().includes("chart")) {
                        var iPercentage = oEvt.getSource().getTileContent()[0].getContent().getPercentage();
                        if (iPercentage >= 75) {
                            sColor = "#107e3e";
                        } else if (iPercentage < 75 && iPercentage > 30) {
                            sColor = "#df6e0c";
                        } else {
                            sColor = "#bb0000";
                        }
                    } else {
                        var sIndicator = oEvt.getSource().getTileContent()[0].getContent().getItems()[0].getIndicator();
                        if (sIndicator === "Up") {
                            sColor = "#107e3e";
                        } else if (sIndicator === "Down") {
                            sColor = "#bb0000";
                        } else {
                            sColor = "#788fa6";
                        }
                    }
                    sPath = oEvt.getSource().getBindingInfo("header").binding.getPath();
                    sPath = sPath.slice(0, sPath.lastIndexOf("/"));
                } else if (sType === "RMC") {
                    var iPercentage = oEvt.getSource().getPercentage();
                    if (iPercentage >= 75) {
                        sColor = "#107e3e";
                    } else if (iPercentage < 75 && iPercentage > 30) {
                        sColor = "#df6e0c";
                    } else {
                        sColor = "#bb0000";
                    }
                    sPath = oEvt.getSource().getBindingInfo("percentage").binding.getBindings()[0].getPath();
                    sPath = sPath.slice(0, sPath.lastIndexOf("/"));
                } else if (sType === "NC") {
                    var sIndicator = oEvt.getSource().getIndicator();
                    if (sIndicator === "Up") {
                        sColor = "#107e3e";
                    } else if (sIndicator === "Down") {
                        sColor = "#bb0000";
                    } else {
                        sColor = "#788fa6";
                    }
                    sPath = oEvt.getSource().getBindingInfo("value").binding.getBindings()[0].getPath();
                    sPath = sPath.slice(0, sPath.lastIndexOf("/"));
                }
                var oSelObj = this.oDemoDataModel.getProperty(sPath),
                    aCols = oSelObj.Cols;
                if (this.oDemoDataModel.getProperty("/SeasonFilters").length > 0) {
                    oSelObj.Season = this.oDemoDataModel.getProperty("/SeasonFilters")[0];
                } else {
                    oSelObj.Season = "H2 22/H2 22 LEVIS US";
                }
                var sValidFrom = oSelObj.Season.slice(0, 2) === "H1" ? "01/01/2022" : "07/01/2022";
                // oSelObj.ValidFrom = sValidFrom;
                // oSelObj.ValidTo = "12/31/9999";
                oSelObj.Season += " (" + sValidFrom + " - 12/31/9999";
                if (!this._oTestDlg) {
                    this._oTestDlg = sap.ui.xmlfragment("idTestTileDlg", "com.levi.ptpe2e.view.fragments.Test", this);
                    this.getView().addDependent(this._oTestDlg);
                }
                this._oTestDlg.open();
                // var aColorSet = ["ColorSet1", "ColorSet2", "ColorSet3", "ColorSet4", "ColorSet5", "ColorSet6", "ColorSet7", "ColorSet8", "ColorSet9", "ColorSet10", "ColorSet11"];
                var aColorShade = ["ShadeA", "ShadeB", "ShadeC", "ShadeD", "ShadeE", "ShadeF"];
                var aTemp = [];
                for (var j = 0; j < 6; j++) {
                    var sObjString = JSON.stringify(oSelObj);
                    var oTempObj = JSON.parse(sObjString);
                    oTempObj.ColorSet = "ColorSet7";
                    oTempObj.ColorShade = "ShadeE";
                    // var sSet = j%11 === 0 ? "11" : (j%11).toString();
                    // oTempObj.ColorSet = "ColorSet" + sSet;
                    // oTempObj.ColorShade = "ShadeC";
                    // oTempObj.ColorShade = aColorShade[Math.floor(Math.random() * (5 - 0) + 0)];
                    aTemp.push(oTempObj);
                }
                if (this.getOwnerComponent().getModel("device").getData().system.phone) {
                    //------------------For List--------------------------------
                    var oModel = new sap.ui.model.json.JSONModel(aTemp);
                    var oList = Fragment.byId("idTestTileDlg", "idTestList");
                    oList.setModel(oModel);
                    var oGrid = new sap.ui.layout.Grid().addStyleClass("sapUiTinyMarginTop");
                    for (var i = 0; i < aCols.length; i++) {
                        oGrid.addContent(
                            new sap.m.VBox({
                                items: [
                                    new sap.m.Label({
                                        text: aCols[i].ColName,
                                        design: "Bold",
                                        showColon: true
                                    }),
                                    new sap.m.Text({
                                        text: "{" + aCols[i].ColProperty + "}"
                                    })
                                ],
                                layoutData: [
                                    new sap.ui.layout.GridData({
                                        span: "XL2 L2 M6 S6"
                                    })
                                ]
                            })
                        );
                    }
                    oGrid.addContent(
                        new sap.m.VBox({
                            items: [
                                new sap.m.Label({
                                    text: "Flag",
                                    design: "Bold",
                                    showColon: true
                                }),
                                new sap.ui.core.Icon({
                                    src: "sap-icon://flag",
                                    color: sColor,
                                    backgroundColor: "#fff",
                                    width: "2.5rem",
                                    height: "1.8rem",
                                    size: "1.3rem"
                                })
                            ],
                            layoutData: [
                                new sap.ui.layout.GridData({
                                    span: "XL2 L2 M6 S6"
                                })
                            ]
                        })
                    );
                    var oBlkLayout = new sap.ui.layout.BlockLayout({
                        content: [new sap.ui.layout.BlockLayoutRow({
                            content: [new sap.ui.layout.BlockLayoutCell({
                                width: 1,
                                content: oGrid,
                                backgroundColorSet: "{ColorSet}",
                                backgroundColorShade: "{ColorShade}"
                            })]
                        })]
                    }).addStyleClass("roundedCellContent");
                    var oCustomListItem = new sap.m.CustomListItem({
                        content: oBlkLayout
                    });
                    oList.bindAggregation("items", "/", oCustomListItem);
                } else {
                    //-------------- For Table ------------------------------
                    var oModel = new sap.ui.model.json.JSONModel([oSelObj]);
                    var oTable = Fragment.byId("idTestTileDlg", "idTestTable");
                    var oCell = [];
                    oTable.destroyColumns();
                    oTable.setModel(oModel);
                    for (var i = 0; i < aCols.length; i++) {
                        oTable.addColumn(new sap.m.Column({
                            header: new sap.m.Label({
                                text: aCols[i].ColName,
                                wrapping: true
                            }),
                            demandPopin: i > 2 ? true : false,
                            minScreenWidth: i > 2 ? "Tablet" : "Phone"
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
                            text: "Flag",
                            wrapping: true
                        })
                    }));
                    oCell.push(
                        new sap.ui.core.Icon({
                            src: "sap-icon://flag",
                            color: sColor
                        })
                    );
                    var oTemplate = new sap.m.ColumnListItem({
                        cells: oCell
                    });
                    oTable.bindAggregation("items", "/", oTemplate);
                }
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
                    var aTilesData = this.oDemoDataModel.getProperty("/TilesData");
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
                    this.oDemoDataModel.setProperty("/TilesData", aTilesData);
                    oBsyDlg.close();
                });
            },
            onMasterDesignToggle: function (oEvt) {
                if (this._bDefaultDesign) {
                    this._bDefaultDesign = false;
                    this.getView().byId("idMasterPage").removeStyleClass("pageBg");
                    this.oDemoDataModel.setProperty("/MasterDesign", "New");
                } else {
                    this._bDefaultDesign = true;
                    this.getView().byId("idMasterPage").addStyleClass("pageBg");
                    this.oDemoDataModel.setProperty("/MasterDesign", "Default");
                }
            },
            onFilterSettingPress: function (oEvt) {
                if (!this._oFilterSettingsDlg) {
                    this._oFilterSettingsDlg = sap.ui.xmlfragment("idFilterSettingsDlg", "com.levi.ptpe2e.view.fragments.FilterSettings", this);
                    this.getView().addDependent(this._oFilterSettingsDlg);
                }
                this._oFilterSettingsDlg.open();
            },
            onAfterFilterSettingsOpen: function () {
                var oRegionComboBox = Fragment.byId("idFilterSettingsDlg", "idRegionComboBox"),
                    oCompCodeComboBox = Fragment.byId("idFilterSettingsDlg", "idCompCodeComboBox"),
                    oDistCenterComboBox = Fragment.byId("idFilterSettingsDlg", "idDistCenterComboBox"),
                    oVendorComboBox = Fragment.byId("idFilterSettingsDlg", "idVendorComboBox"),
                    oSeasonComboBox = Fragment.byId("idFilterSettingsDlg", "idSeasonComboBox"),
                    aRegKeys = this.oDemoDataModel.getProperty("/RegionFilters"),
                    aCompCodeKeys = this.oDemoDataModel.getProperty("/CompCodeFilters"),
                    aVendorKeys = this.oDemoDataModel.getProperty("/VendorFilters"),
                    aDistCenterKeys = this.oDemoDataModel.getProperty("/DistCentersFilters"),
                    aSeasonKeys = this.oDemoDataModel.getProperty("/SeasonFilters");
                oRegionComboBox.setSelectedKeys(aRegKeys);
                var aTemp = [],
                    aFilter = [];
                for (var i = 0; i < aRegKeys.length; i++) {
                    aFilter.push(new Filter("region", FilterOperator.EQ, aRegKeys[i]));
                    aTemp = aTemp.concat(this.oDemoDataModel.getProperty("/AllRegions").filter(function (oItem) {
                        return oItem.region === aRegKeys[i]
                    })[0].CompanyCodes);
                }
                aTemp = aTemp.filter((value, index, self) => index === self.findIndex((t) => (
                    t.name === value.name
                )));
                this.oDemoDataModel.setProperty("/CompCodes", aTemp);
                oCompCodeComboBox.setSelectedKeys(aCompCodeKeys);
                var aTemp1 = [],
                    aTemp2 = [];
                aTemp.forEach(function (oItem) {
                    aTemp1 = aTemp1.concat(oItem.DistCenters);
                    aTemp2 = aTemp1.concat(oItem.Vendors);
                });
                aTemp1 = aTemp1.filter((value, index, self) => index === self.findIndex((t) => (
                    t.name === value.name
                )));
                aTemp2 = aTemp2.filter((value, index, self) => index === self.findIndex((t) => (
                    t.name === value.name
                )));
                this.oDemoDataModel.setProperty("/DistCenters", aTemp1);
                this.oDemoDataModel.setProperty("/Vendors", aTemp2);
                oDistCenterComboBox.setSelectedKeys(aDistCenterKeys);
                oVendorComboBox.setSelectedKeys(aVendorKeys);
                var aAllFilter = new Filter(aFilter, false);
                oSeasonComboBox.getBinding("items").filter(aAllFilter);
                if (aSeasonKeys.length === 0) {
                    oSeasonComboBox.getItems().forEach(function (oItem) {
                        if (oItem.getBindingContext("DemoData").getObject().key === "H2 22" || oItem.getBindingContext("DemoData").getObject().key === "H1 23") {
                            aSeasonKeys.push(oItem.getKey());
                        }
                    });
                }
                oSeasonComboBox.setSelectedKeys(aSeasonKeys);
            },
            onApplyFilterSettings: function (oEvt) {
                var oRegionComboBox = Fragment.byId("idFilterSettingsDlg", "idRegionComboBox");
                if (oRegionComboBox.getSelectedItems().length === 0) {
                    MessageBox.error("Please Select Region");
                    return;
                }
                var oCompCodeComboBox = Fragment.byId("idFilterSettingsDlg", "idCompCodeComboBox"),
                    oDistCenterComboBox = Fragment.byId("idFilterSettingsDlg", "idDistCenterComboBox"),
                    oVendorComboBox = Fragment.byId("idFilterSettingsDlg", "idVendorComboBox"),
                    oSeasonComboBox = Fragment.byId("idFilterSettingsDlg", "idSeasonComboBox"),
                    aRegionKeys = [],
                    aCompCodeKeys = [],
                    aDistCenterKeys = [],
                    aVendorKeys = [],
                    aSeasonKeys = [];
                if (oRegionComboBox.getSelectedItems().length === this.oDemoDataModel.getProperty("/AllRegions").length) {
                    this.oDemoDataModel.setProperty("/Region", "All");
                } else {
                    var sText = "";
                    for (var i = 0; i < oRegionComboBox.getSelectedItems().length; i++) {
                        sText += oRegionComboBox.getSelectedItems()[i].getText() + ", ";
                    }
                    sText = sText.slice(0, sText.length - 2);
                    this.oDemoDataModel.setProperty("/Region", sText);
                }
                if (oRegionComboBox.getSelectedItems().length > 1) {
                    this.oDemoDataModel.setProperty("/RegionLogo", this.oImageModel.getProperty("/All"));
                } else {
                    this.oDemoDataModel.setProperty("/RegionLogo", this.oImageModel.getProperty("/" + sText));
                }
                oRegionComboBox.getSelectedItems().forEach(function (oItem) {
                    aRegionKeys.push(oItem.getKey());
                });
                oCompCodeComboBox.getSelectedItems().forEach(function (oItem) {
                    aCompCodeKeys.push(oItem.getKey());
                });
                oDistCenterComboBox.getSelectedItems().forEach(function (oItem) {
                    aDistCenterKeys.push(oItem.getKey());
                });
                oVendorComboBox.getSelectedItems().forEach(function (oItem) {
                    aVendorKeys.push(oItem.getKey());
                });
                oSeasonComboBox.getSelectedItems().forEach(function (oItem) {
                    aSeasonKeys.push(oItem.getKey());
                });
                this.oDemoDataModel.setProperty("/RegionFilters", aRegionKeys);
                this.oDemoDataModel.setProperty("/CompCodeFilters", aCompCodeKeys);
                this.oDemoDataModel.setProperty("/DistCentersFilters", aDistCenterKeys);
                this.oDemoDataModel.setProperty("/VendorFilters", aVendorKeys);
                this.oDemoDataModel.setProperty("/SeasonFilters", aSeasonKeys);
                this._oFilterSettingsDlg.close();
            },
            onCancelFilterSettings: function (oEvt) {
                this._oFilterSettingsDlg.close();
            },
            onCarouselPageChanged: function(oEvt) {
                var sTitle = oEvt.getSource().getPages()[oEvt.getParameter("activePages")[0]].getTitle();
                this.oDemoDataModel.setProperty("/TileTextMobile", sTitle);
            }


        });
    });
