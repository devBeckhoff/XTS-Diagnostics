// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../Packages/Beckhoff.TwinCAT.HMI.Framework.14.3.431/runtimes/native1.12-tchmi/TcHmi.d.ts" />

(function (/** @type {globalThis.TcHmi} */ TcHmi) {
    // If you want to unregister an event outside the event code you need to use the return value of the method register()
    let destroyOnInitialized = TcHmi.EventProvider.register('onInitialized', (e, data) => {
        // This event will be raised only once, so we can free resources. 
        // It's best practice to use destroy function of the event object within the callback function to avoid conflicts.
        e.destroy();
        // ----------------------
        // Place your code here!
        // ----------------------
        var Target_Props = [
            'DCLinkVoltage',
            'DriveState',
            'PCBTemperature',
            'AmplifierI2T',
            'ActiveMoverCount',
            'DetectedMoverCount',
            'ActPos',
            'ActVelo',
            'NcModuloPos'
        ];

        function checkSymbols(){
            var allControls = TcHmi.Controls.getMap();

            var expressions = [];

            allControls.forEach(function (ctrl) {
                Target_Props.forEach(function (prop) {
                    var expr = TcHmi.Binding.resolveEx(prop, ctrl);
                    if (expr) {
                        expressions.push(expr);
                        console.log(expr)
                    }
                });
            });

            if (expressions.length === 0) {
                TcHmi.Log.info('CheckBoundSymbols: No bindings found for target properties.');
                return;
            }

            var eventFired = false;

            expressions.forEach(function (expr) {
                TcHmi.Symbol.readEx2(expr, function (data) {
                    if (eventFired) return;

                    if (data.error !== TcHmi.Errors.NONE || data.value === null || data.value === undefined) {
                        TcHmi.Log.info('CheckBoundSymbols: Symbol "'+ expr +'" has data error or null value.');

                        eventFired = true;

                        // Fire event to MoverSelector
                        var moverSelector = allControls.get('MoverSelector');
                        if(!moverSelector) {
                            TcHmi.Log.info('CheckBoundSymbols: "MoverSelector" not found.');
                            return;
                        }

                        var eventName = moverSelector.getId() + '.onSelectionChanged';
                        var selectedValue = (typeof moverSelector.getSelectedValue === 'function')
                            ? moverSelector.getSelectedValue()
                            : null;

                        TcHmi.EventProvider.raise(eventName, {
                            value: selectedValue,
                            triggerByDataError: true
                        });

                        TcHmi.Log.info('CheckBoundSymbols: Fired "'+ eventName +'" due to data error.');

                        // Fire event to ModuleSelector
                        var moduleSelector = allControls.get('ModuleSelector');
                        if(!moduleSelector) {
                            TcHmi.Log.info('CheckBoundSymbols: "ModuleSelector" not found.');
                            return;
                        }

                        var eventName = moduleSelector.getId() + '.onSelectionChanged';
                        var selectedValue = (typeof moduleSelector.getSelectedValue === 'function')
                            ? moduleSelector.getSelectedValue()
                            : null;

                        TcHmi.EventProvider.raise(eventName, {
                            value: selectedValue,
                            triggerByDataError: true
                        });

                        TcHmi.Log.info('CheckBoundSymbols: Fired "'+ eventName +'" due to data error.');
                    }
                });
            });

            if (!eventFired) {
                TcHmi.Log.info('CheckBoundSymbols: No symbols in error.')
            };
        }
        checkSymbols();
        setInterval(checkSymbols, 15000);
    });
})(TcHmi);
