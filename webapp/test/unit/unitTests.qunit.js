/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
    "use strict";

    sap.ui.require([
        "me/sayazhan/ui5-example-app/test/unit/AllTests"
    ], function () {
        QUnit.start();
    });
});