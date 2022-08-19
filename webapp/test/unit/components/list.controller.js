/*global QUnit*/

sap.ui.define([
    "me/sayazhan/ui5-example-app/components/list/list.controller"
], function (Controller) {
    "use strict";

    QUnit.module("List Controller");

    QUnit.test("I should test the List controller", function (assert) {
        var oAppController = new Controller();
        assert.ok(oAppController);
    });

});