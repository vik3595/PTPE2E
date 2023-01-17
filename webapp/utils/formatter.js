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
        }
		
	};

	return fomatter;

}, true);