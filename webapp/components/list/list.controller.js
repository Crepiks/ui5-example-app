sap.ui.define(
    [
        'sap/ui/core/mvc/Controller',
        'me/sayazhan/ui5-example-app/components/list/list.service',
    ],
    /**
     *
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {ListService} listService
     */
    function (
        Controller,
        listService,
    ) {
        class ListController extends Controller {
            constructor() {
                super('me.sayazhan.ui5-example-app.components.list.controller');
                this._listService = listService;
            }
        }

        return ListController;
    }
);
