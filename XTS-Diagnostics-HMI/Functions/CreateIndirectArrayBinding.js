var TcHmi;
(function (TcHmi) {
    let Functions;
    (function (Functions) {
        let Custom;
        (function (Custom) {
            function CreateIndirectArrayBinding(Control, Property, Symbol, Index, IsTwoWay, BindingEvent) {
                // validate parameters
                if (!Control)
                    throw new Error("Invalid value: '" + Control + "' for parameter 'control'.");
                if (!Property)
                    throw new Error("Invalid value: '" + Property + "' for parameter 'propertyName'.");
                // check for existing binding
                const oldSymb = TcHmi.Binding.resolve(Property, Control);
                // remove if property is already bound
                if (oldSymb) {
                    // remove existing binding
                    TcHmi.Binding.removeEx2(oldSymb, Property, Control);
                }
                // get symbol name, remove prepending '%/s%' (server symbol identifier)
                let symbStr = Symbol.getExpression().toString().slice(0, -4);
                // append array index
                symbStr = symbStr + '[' + Index.toString() + ']';
                // append two-way binding
                if (IsTwoWay) {
                    symbStr = symbStr + "|BindingMode=TwoWay|BindingEvent=" + BindingEvent + "|SubscriptionMode=Change%/s%";
                }
                else
                    symbStr = symbStr + '%/s%';
                // create symbol type for validation
                const symb = new TcHmi.Symbol(symbStr);
                // validate index
                if (Index >= 0) {
                    // validate symbol
                    if (symb) {
                        // create binding
                        TcHmi.Binding.createEx2(symbStr, Property, Control);
                    }
                    else
                        throw new Error("Invalid value: '" + symbStr + "' for parameter 'Symbol'.");
                }
            }
            Custom.CreateIndirectArrayBinding = CreateIndirectArrayBinding;
        })(Custom = Functions.Custom || (Functions.Custom = {}));
        Functions.registerFunctionEx('CreateIndirectArrayBinding', 'TcHmi.Functions.Custom', Custom.CreateIndirectArrayBinding);
    })(Functions = TcHmi.Functions || (TcHmi.Functions = {}));
})(TcHmi || (TcHmi = {}));
//# sourceMappingURL=CreateIndirectArrayBinding.js.map