sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox) {
        "use strict";

        return Controller.extend("com.levi.ptpe2e.controller.View1", {
            onInit: function () {
                var oImageModel = new sap.ui.model.json.JSONModel({
                    US: jQuery.sap.getModulePath("com.levi.ptpe2e", "/img/US.jpg"),
                    MX: jQuery.sap.getModulePath("com.levi.ptpe2e", "/img/MX.jpg"),
                    CA: jQuery.sap.getModulePath("com.levi.ptpe2e", "/img/CA.jpg")
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
            _updateDateRangeValue: function (sValue) {
                var sText = "Showing For: ";
                if (sValue === 'PRS') {
                    sText += "Pre Season";
                } else if (sValue === "INS") {
                    sText += "In Season";
                } else {
                    sText += "Post Season";
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
                    sKey = sap.ui.core.Fragment.byId("idRegionOptionDlg", "idSelectAllRegions").getSelectedKey();
                if (sKey === '') {
                    MessageBox.error("Please Select Region");
                    return;
                }
                oDemoDataModel.setProperty("/Region", sKey);
                oDemoDataModel.setProperty("/CountryInitials", this.getOwnerComponent().getModel("ImageModel").getProperty("/" + sKey));
                this._refreshRandomData();
                this._oRegionOptionDlg.close();
                // this._oRegionOptionDlg.destroy();
                // this._oRegionOptionDlg = undefined;
                // this._oRegionOptionDlg = null;
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
            onAfterVendorDlgOpen: function (oEvt) {
                var oDemoDataModel = this.getOwnerComponent().getModel("DemoData"),
                    sRegion = oDemoDataModel.getProperty("/Region"),
                    aVendorsCompCode = oDemoDataModel.getProperty("/VendorsList"),
                    aCompCodes = aVendorsCompCode.filter(function (oItem) {
                        return oItem.region === sRegion
                    });
                if (aCompCodes.length > 0) {
                    oDemoDataModel.setProperty("/VendorCompCodes", aCompCodes[0].CompanyCodes);
                }
                oEvt.getSource().setTitle("Select Vendors for " + sRegion + " region");
            },
            onCompCodeChangeForVendor: function (oEvt) {
                var aSelectedItems = oEvt.getSource().getSelectedItems(),
                    oDemoDataModel = this.getOwnerComponent().getModel("DemoData");
                var aTemp = [];
                for (var i = 0; i < aSelectedItems.length; i++) {
                    aTemp = aTemp.concat(oDemoDataModel.getProperty(aSelectedItems[i].getBindingContext("DemoData").getPath()).Vendors);
                }
                oDemoDataModel.setProperty("/CurrVendors", aTemp);
            },
            onRegionChange: function (oEvt) {
                var sType = oEvt.getSource().getCustomData()[0].getValue(),
                    oDemoDataModel = this.getOwnerComponent().getModel("DemoData");
                if (sType === "Region") {
                    var sPath = "DemoData>" + oEvt.getParameter("selectedItem").getBindingContext("DemoData").getPath() + "/CompanyCodes";
                    var oTemplate = new sap.ui.core.Item({
                        key: "{DemoData>name}",
                        text: "{DemoData>name}"
                    });
                    sap.ui.core.Fragment.byId("idRegionOptionDlg", "idSelectCompCode").bindItems(sPath, oTemplate);
                } else if (sType === "CompCode") {
                    var aSelectedItems = oEvt.getSource().getSelectedItems();
                    var aTemp = [];
                    for (var i = 0; i < aSelectedItems.length; i++) {
                        aTemp = aTemp.concat(oDemoDataModel.getProperty(aSelectedItems[i].getBindingContext("DemoData").getPath()).DistCenters);
                    }
                    oDemoDataModel.setProperty("/CurrDistCenters", aTemp);
                    var oTemplate = new sap.ui.core.Item({
                        key: "{DemoData>name}",
                        text: "{DemoData>name}"
                    });
                    sap.ui.core.Fragment.byId("idRegionOptionDlg", "idSelectDistCenter").bindItems("DemoData>/CurrDistCenters", oTemplate);
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
                // if (sTimeRange === "Custom") {
                //     var oDateValue = sap.ui.core.Fragment.byId("idTimeRangeDlg", "idDateRange").getValue();
                //     if (oDateValue === null || oDateValue === undefined) {
                //         MessageBox.error("Please select date range to proceed");
                //         return;
                //     }
                // }
                this._updateDateRangeValue(sTimeRange);
                this._oTimeRangeDlg.close();
                this._refreshRandomData();
            },
            onCancelTimeFilter: function () {
                this._oTimeRangeDlg.close();
            },
            onRegionValueHelpClose: function (oEvt) {
                var oOwnerComponent = this.getOwnerComponent();
                this._refreshRandomData();
                oOwnerComponent.getModel("DemoData").setProperty("/Region", oEvt.getParameter("selectedItem").getTitle());
                oOwnerComponent.getModel("DemoData").setProperty("/CountryInitials", oOwnerComponent.getModel("ImageModel").getProperty("/" + oEvt.getParameter("selectedItem").getTitle()));
            },
            onListItemPress: function (oEvt) {
                var oDetailPage = this.getView().byId("idDetailPage");
                this.getView().byId("idSplitApp").toDetail(oDetailPage);
                oDetailPage.removeStyleClass(this._currentDetailStyle);
                oDetailPage.addStyleClass(oEvt.getParameter("listItem").getCustomData()[0].getValue());
                this._currentDetailStyle = oEvt.getParameter("listItem").getCustomData()[0].getValue();
                this._refreshRandomData();
            },
            onNavigateToMaster: function () {
                this.getView().byId("idSplitApp").toMaster(this.getView().byId("idMasterPage"));
            },
            onGenericTilePress: function (oEvt) {
                var sHeader = oEvt.getSource().getHeader(),
                    sTimeRange = this.getOwnerComponent().getModel("DemoData").getProperty("/TimeRange"),
                    aTempElements = [];
                if (sTimeRange === "PRS") {
                    sTimeRange = "Pre Season";
                } else if (sTimeRange === "INS") {
                    sTimeRange = "In Season";
                } else {
                    sTimeRange = "Post Season";
                }
                if (sHeader === "OA Creation") {
                    aTempElements = [
                        {
                            "label": "Forcast Qty",
                            "value": Math.floor(Math.random() * 10)
                        },
                        {
                            "label": "Doc. No",
                            "value": Math.floor(Math.random() * 1000000000)
                        },
                        {
                            "label": "PC9/PC13/prepack",
                            "value": "Test Data"
                        },
                        {
                            "label": "Qty of above",
                            "value": Math.floor(Math.random() * 10)
                        },
                        {
                            "label": "Season",
                            "value": sTimeRange
                        }
                    ];
                } else if (sHeader === "PO Issuance") {
                    aTempElements = [
                        {
                            "label": "Forcast Qty",
                            "value": Math.floor(Math.random() * 10)
                        },
                        {
                            "label": "Doc. No",
                            "value": Math.floor(Math.random() * 1000000000)
                        },
                        {
                            "label": "PC9/PC13/prepack",
                            "value": "Test Data"
                        },
                        {
                            "label": "Qty of above",
                            "value": Math.floor(Math.random() * 10)
                        },
                        {
                            "label": "Season",
                            "value": sTimeRange
                        }
                    ];
                } else if (sHeader === "Packing List Creation") {
                    aTempElements = [
                        {
                            "label": "Forcast Qty",
                            "value": Math.floor(Math.random() * 10)
                        },
                        {
                            "label": "Doc. No",
                            "value": Math.floor(Math.random() * 1000000000)
                        },
                        {
                            "label": "PC13/prepack",
                            "value": "Test Data"
                        },
                        {
                            "label": "Qty of above",
                            "value": Math.floor(Math.random() * 10)
                        }
                    ];
                } else if (sHeader === "IBD Creation") {
                    aTempElements = [
                        {
                            "label": "Forcast Qty",
                            "value": Math.floor(Math.random() * 10)
                        },
                        {
                            "label": "Doc. No",
                            "value": Math.floor(Math.random() * 1000000000)
                        },
                        {
                            "label": "PC13/prepack",
                            "value": "Test Data"
                        },
                        {
                            "label": "Qty of above",
                            "value": Math.floor(Math.random() * 10)
                        }
                    ];
                } else if (sHeader === "Shipment Milestone Updates") {
                    aTempElements = [
                        {
                            "label": "Forcast Qty",
                            "value": Math.floor(Math.random() * 10)
                        },
                        {
                            "label": "Doc. No",
                            "value": Math.floor(Math.random() * 1000000000)
                        },
                        {
                            "label": "PC13/prepack",
                            "value": "Test Data"
                        },
                        {
                            "label": "Planned, Actual HOD",
                            "value": Math.floor(Math.random() * 10)
                        },
                        {
                            "label": "Planned, Actual GR",
                            "value": Math.floor(Math.random() * 10)
                        }
                    ];
                } else if (sHeader === "Goods Reciept") {
                    aTempElements = [
                        {
                            "label": "Forcast Qty",
                            "value": Math.floor(Math.random() * 10)
                        },
                        {
                            "label": "Doc. No",
                            "value": Math.floor(Math.random() * 1000000000)
                        },
                        {
                            "label": "PC13/prepack",
                            "value": "Test Data"
                        },
                        {
                            "label": "Qty of above",
                            "value": Math.floor(Math.random() * 10)
                        }
                    ];
                } else {
                    aTempElements = [
                        {
                            "label": "Forcast Qty",
                            "value": Math.floor(Math.random() * 10)
                        },
                        {
                            "label": "Doc. No",
                            "value": Math.floor(Math.random() * 1000000000)
                        },
                        {
                            "label": "PC13/prepack",
                            "value": "Test Data"
                        },
                        {
                            "label": "Amount of above",
                            "value": Math.floor(Math.random() * 100000)
                        },
                        {
                            "label": "Qty of above",
                            "value": Math.floor(Math.random() * 10)
                        }
                    ];
                }
                var aTempQuickView = [
                    {   "header": "Information",
                        "title": sHeader,
                        "groups": [
                            {
                                "elements": aTempElements
                            }
                        ]
                    }
                ];
                this.getOwnerComponent().getModel("DemoData").setProperty("/QuickView", aTempQuickView);
                if (!this._oQuickViewDlg) {
                    this._oQuickViewDlg = sap.ui.xmlfragment("idQuickViewDlg", "com.levi.ptpe2e.view.fragments.QuickView", this);
                    this.getView().addDependent(this._oQuickViewDlg);
                }
                this._oQuickViewDlg.openBy(oEvt.getSource());
            },
            _refreshRandomData: function () {
                var oBsyDlg = new sap.m.BusyDialog();
                oBsyDlg.open();
                jQuery.sap.delayedCall(250, this, function () {
                    var aData = this.getOwnerComponent().getModel("DemoData").getProperty("/V2DC");
                    for (var i = 0; i < aData.length; i++) {
                        aData[i].OACreation = Math.floor(Math.random() * 100);
                        aData[i].POIssuance = Math.floor(Math.random() * 100);
                        aData[i].PackListCreation = Math.floor(Math.random() * 100);
                        aData[i].IBDCreation = Math.floor(Math.random() * 100);
                        aData[i].ShipMilesUpdate = Math.floor(Math.random() * 100);
                        aData[i].GoodReciept = Math.floor(Math.random() * 100);
                        aData[i].VendorInvoice = Math.floor(Math.random() * 100);
                    }
                    this.getOwnerComponent().getModel("DemoData").setProperty("/V2DC", aData);
                    oBsyDlg.close();
                });
            }
        });
    });
