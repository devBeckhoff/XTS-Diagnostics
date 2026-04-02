module TcHmi {
    export module Functions {
        export module Custom {
            export function CreateIndirectArrayBinding(Control: Controls.System.baseTcHmiControl, Property: string, Symbol: Symbol,
                Index: number, IsTwoWay: Boolean, BindingEvent: string) {

                // validate parameters
                if (!Control) throw new Error("Invalid value: '"+Control+"' for parameter 'control'.");
                if (!Property) throw new Error("Invalid value: '"+Property+"' for parameter 'propertyName'.");

                // check for existing binding
                const oldSymb: string | null = TcHmi.Binding.resolve(Property,Control);

                // remove if property is already bound
                if (oldSymb) {
                    // remove existing binding
                    TcHmi.Binding.removeEx2(oldSymb,Property,Control);
                }

                // get symbol name, remove prepending '%/s%' (server symbol identifier)
                let symbStr: string = Symbol.getExpression().toString().slice(0,-4);

                // append array index
                symbStr = symbStr + '[' + Index.toString() + ']';

                // append two-way binding
                if (IsTwoWay) {
                    symbStr = symbStr + "|BindingMode=TwoWay|BindingEvent=" + BindingEvent + "|SubscriptionMode=Change%/s%";
                }
                else symbStr = symbStr + '%/s%';

                // create symbol type for validation
                const symb : Symbol = new TcHmi.Symbol(symbStr);

                // validate index
                if (Index >= 0) {
                    // validate symbol
                    if (symb) {
                        // create binding
                        TcHmi.Binding.createEx2(symbStr, Property, Control);
                    }
                    else throw new Error("Invalid value: '" + symbStr + "' for parameter 'Symbol'.");
                }
            }
        }
        registerFunctionEx('CreateIndirectArrayBinding', 'TcHmi.Functions.Custom', Custom.CreateIndirectArrayBinding);
    }
}