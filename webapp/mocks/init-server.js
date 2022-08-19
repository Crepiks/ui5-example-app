sap.ui.define([
    'me/sayazhan/ui5-example-app/mocks/server'
], function (mockserver) {
    const servers = [];

    // initialize the mock server
    servers.push(mockserver.init());

    Promise.all(servers).then(function () {
        // initialize the embedded component on the HTML page
        sap.ui.require(["sap/ui/core/ComponentSupport"]);
    });
});