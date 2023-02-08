sap.ui.define(function () {
	"use strict";

	var fomatter = {

		calculatePercentage: function (iValue1, iValue2) {
            if(iValue1 && iValue2) {
                var iPercentage = (iValue1/iValue2) * 100;
                return iPercentage;
            } else {
                return iValue1;
            }
		},
		calculateDaysDifference: function (iValue1, iValue2) {
           var oDate1 = new Date(iValue1);
           var oDate2 = new Date(iValue2);
           var Difference_In_Time = oDate2.getTime() - oDate1.getTime();
           var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
           return Math.abs(Difference_In_Days);
		},
		calculateDaysDiffDesc: function (iValue1, iValue2) {
           var oDate1 = new Date(iValue1);
           var oDate2 = new Date(iValue2);
           var Difference_In_Time = oDate2.getTime() - oDate1.getTime();
           var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
           var sText = "";
           if(Difference_In_Days === 0) {
                sText = "On-Time";
            } else if (Difference_In_Days < 0) {
               sText = "Early";
            } else {
               sText = "Delay";
           }
           return sText;
		},
		calculateValueColor: function (iValue1, iValue2) {
           var oDate1 = new Date(iValue1);
           var oDate2 = new Date(iValue2);
           var Difference_In_Time = oDate2.getTime() - oDate1.getTime();
           var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
           var sText = "";
           if(Difference_In_Days === 0) {
                sText = "Good";
            } else if (Difference_In_Days < 0) {
               sText = "Good";
            } else {
               sText = "Error";
           }
           return sText;
		},
		getIndicator: function (iValue1, iValue2) {
           var oDate1 = new Date(iValue1);
           var oDate2 = new Date(iValue2);
           var Difference_In_Time = oDate2.getTime() - oDate1.getTime();
           var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
           var sText = "";
           if(Difference_In_Days === 0) {
                sText = "None";
            } else if (Difference_In_Days < 0) {
               sText = "Up";
            } else {
               sText = "Down";
           }
           return sText;
		},
        _getValueColor: function(iValue1, iValue2) {
            var iPercentage;
            if(iValue1 && iValue2) {
                iPercentage = (iValue1/iValue2) * 100;
            } else {
                iPercentage = iValue1;
            }
            if (iPercentage >= 75) {
                return "Good";
            } else if (iPercentage < 75 && iPercentage > 30) {
                return "Critical";
            } else {
                return "Error";
            }
        },
        getRegionDesc: function(sRegion) {
            var sDesc = "";
            if(sRegion === undefined) {
                var sRegion = "All";
            }
            if(sRegion === "All") {
                var aRegion = this.getOwnerComponent().getModel("DemoData").getProperty("/AllRegions");
                sDesc = aRegion[0].description + " + " + (aRegion.length - 1).toString();
            } else {
                var aRegion = sRegion.split(", "),
                    sTempReg = "";
                if(aRegion[0] === "US") {
                    sTempReg = "United States of America";
                } else if (aRegion[0] === "CA") {
                    sTempReg = "Canada";
                } else if (aRegion[0] === "MX") {
                    sTempReg = "Mexico";
                }

                if (aRegion.length > 1) {
                    sDesc = sTempReg + " + " + (aRegion.length - 1).toString();
                } else {
                    sDesc = sTempReg;
                }
            }
            return sDesc;
        }
		
	};

	return fomatter;

}, true);