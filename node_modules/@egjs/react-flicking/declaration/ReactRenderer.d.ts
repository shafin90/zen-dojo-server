import { ExternalRenderer, PanelOptions, RendererOptions } from "@egjs/flicking";
import ReactFlicking from "./Flicking";
import StrictPanel from "./StrictPanel";
import NonStrictPanel from "./NonStrictPanel";
export interface ReactRendererOptions extends RendererOptions {
    reactFlicking: ReactFlicking;
}
declare class ReactRenderer extends ExternalRenderer {
    protected _reactFlicking: ReactFlicking;
    constructor(options: ReactRendererOptions);
    render(): Promise<void>;
    forceRenderAllPanels(): Promise<void>;
    destroy(): void;
    protected _collectPanels(): void;
    protected _createPanel(externalComponent: StrictPanel | NonStrictPanel | HTMLDivElement, options: PanelOptions): import("@egjs/flicking/declaration/core/panel/Panel").default;
}
export default ReactRenderer;
