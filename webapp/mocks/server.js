sap.ui.define(
    [
        'sap/ui/core/util/MockServer',
        'sap/ui/model/json/JSONModel',
        'sap/base/Log',
        'sap/base/util/UriParameters'
    ],
    /**
     *
     * @param {sap.ui.core.util.MockServer} MockServer
     * @param {sap.ui.model.json.JSONModel} JSONModel
     * @param {any} Log
     * @param {any} UriParameters
     */
    function (MockServer, JSONModel, Log, UriParameters) {
        let oMockServer;
        const _sAppPath = 'me/sayazhan/ui5-example-app/';
        const _sJsonFilesPath = _sAppPath + 'mocks/mockdata';

        const oMockServerInterface = {

            /**
             * Initializes the mock server asynchronously.
             * You can configure the delay with the URL parameter 'serverDelay'.
             * The local mock data in this folder is returned instead of the real data for testing.
             * @protected
             * @returns{Promise} a promise that is resolved when the mock server has been started
             */
            init: function (oOptionsParameter) {
                const oOptions = oOptionsParameter || {};

                return new Promise(function (fnResolve) {
                    const sManifestUrl = sap.ui.require.toUrl(_sAppPath + 'manifest.json');
                    const oManifestModel = new JSONModel(sManifestUrl);

                    oManifestModel.attachRequestCompleted(function () {
                        const oUriParameters = UriParameters.fromQuery(window.location.search);
                        // parse manifest for local metadata URI
                        const sJsonFilesUrl = sap.ui.require.toUrl(_sJsonFilesPath);
                        const oMainDataSource = oManifestModel.getProperty('/sap.app/dataSources/mainService');
                        console.log(oMainDataSource);
                        const sMetadataUrl = sap.ui.require.toUrl(_sAppPath + oMainDataSource.settings.localUri);
                        // ensure there is a trailing slash
                        const sMockServerUrl = /.*\/$/.test(oMainDataSource.uri) ? oMainDataSource.uri : oMainDataSource.uri + '/';

                        // create a mock server instance or stop the existing one to reinitialize
                        if (!oMockServer) {
                            oMockServer = new MockServer({
                                rootUri: sMockServerUrl
                            });
                        } else {
                            oMockServer.stop();
                        }

                        // configure mock server with the given options or a default delay of 0.5s
                        MockServer.config({
                            autoRespond: true,
                            autoRespondAfter: (oOptions.delay || oUriParameters.get('serverDelay') || 500)
                        });

                        // simulate all requests using mock data
                        oMockServer.simulate(sMetadataUrl, {
                            sMockdataBaseUrl: sJsonFilesUrl,
                            bGenerateMissingMockData: true
                        });

                        const aRequests = oMockServer.getRequests();

                        // compose an error response for requesti
                        const fnResponse = function (iErrCode, sMessage, aRequest) {
                            aRequest.response = function (oXhr) {
                                oXhr.respond(iErrCode, { 'Content-Type': 'text/plain;charset=utf-8' }, sMessage);
                            };
                        };

                        // simulate metadata errors
                        if (oOptions.metadataError || oUriParameters.get('metadataError')) {
                            aRequests.forEach(function (aEntry) {
                                if (aEntry.path.toString().indexOf('$metadata') > -1) {
                                    fnResponse(500, 'metadata Error', aEntry);
                                }
                            });
                        }

                        // simulate request errors
                        const sErrorParam = oOptions.errorType || oUriParameters.get('errorType');
                        const iErrorCode = sErrorParam === 'badRequest' ? 400 : 500;
                        if (sErrorParam) {
                            aRequests.forEach(function (aEntry) {
                                fnResponse(iErrorCode, sErrorParam, aEntry);
                            });
                        }

                        // custom mock behaviour may be added here

                        // set requests and start the server
                        oMockServer.setRequests(aRequests);
                        oMockServer.start();

                        Log.info('Running the app with mock data');
                        fnResolve();
                    });

                    oManifestModel.attachRequestFailed(function () {
                        Log.error('Failed to load application manifest');
                        fnResolve();
                    });
                });
            },

            /**
             * @public returns the mockserver of the app, should be used in integration tests
             * @returns {sap.ui.core.util.MockServer} the mockserver instance
             */
            getMockServer: function () {
                return oMockServer;
            }
        };

        return oMockServerInterface;
    }
);
