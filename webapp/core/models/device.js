sap.ui.define(
    [
        'sap/ui/model/json/JSONModel',
        'sap/ui/Device',
    ],
    /**
     *
     * @param {sap.ui.model.json.JSONModel} JSONModel
     * @param {sap.ui.Device} Device
     */
    function (
        JSONModel,
        Device
    ) {
        class DeviceModel {
            /**
             *
             * @param {sap.ui.Device} device
             */
            constructor(device) {
                this._device = device;
            }

            /**
             *
             * @param {sap.ui.model.json.JSONModel} model
             * @param {sap.ui.model.BindingMode} mode
             * @returns {sap.ui.model.json.JSONModel}
             */
            setBindingMode(model, mode) {
                model.setDefaultBindingMode(mode);
                return model;
            }

            /**
             *
             * @returns {sap.ui.model.json.JSONModel}
             */
            create() {
                const model = new JSONModel(this._device);
                const bindingMode = sap.ui.model.BindingMode.OneWay;
                return this.setBindingMode(model, bindingMode);
            }
        }

        return new DeviceModel(Device);
    }
);
