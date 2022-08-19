sap.ui.define(
    [
        'sap/ui/core/mvc/Controller',
    ],
    /**
     *
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (
        Controller
    ) {
        class AppController extends Controller {
            constructor() {
                super('me.sayazhan.ui5-example-app.components.app.controller');
            }
        }

        return AppController;
    }
);
