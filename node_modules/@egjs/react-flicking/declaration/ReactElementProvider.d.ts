import { ElementProvider } from "@egjs/flicking";
import StrictPanel from "./StrictPanel";
import NonStrictPanel from "./NonStrictPanel";
declare class ReactElementProvider implements ElementProvider {
    private _el;
    get element(): HTMLElement;
    get rendered(): boolean;
    constructor(el: StrictPanel | NonStrictPanel);
    show(): void;
    hide(): void;
}
export default ReactElementProvider;
