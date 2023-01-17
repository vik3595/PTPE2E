/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comlevi/ptpe2e/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
