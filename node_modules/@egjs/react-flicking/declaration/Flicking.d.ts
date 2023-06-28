import * as React from "react";
import Component from "@egjs/component";
import VanillaFlicking, { FlickingOptions } from "@egjs/flicking";
import { FlickingProps } from "./types";
import StrictPanel from "./StrictPanel";
import NonStrictPanel from "./NonStrictPanel";
declare class Flicking extends React.Component<Partial<FlickingProps & FlickingOptions>> {
    static defaultProps: FlickingProps;
    private _vanillaFlicking;
    private _panels;
    private _pluginsDiffer;
    private _jsxDiffer;
    private _viewportElement;
    private _diffResult;
    private _renderEmitter;
    private _prevChildren;
    get reactPanels(): (StrictPanel | NonStrictPanel | HTMLDivElement)[];
    get renderEmitter(): Component<{
        render: void;
    }>;
    constructor(props: Partial<FlickingProps & FlickingOptions>);
    componentDidMount(): void;
    componentWillUnmount(): void;
    shouldComponentUpdate(nextProps: Readonly<Partial<FlickingProps & FlickingOptions>>): boolean;
    beforeRender(): void;
    componentDidUpdate(): void;
    render(): JSX.Element;
    private _createPanelRefs;
    private _bindEvents;
    private _checkPlugins;
    private _hasSameChildren;
    private _getChildren;
    private _getViewportSlot;
    private _unpackFragment;
    private _getVirtualPanels;
    private _getPanels;
    private _isFragment;
}
interface Flicking extends React.Component<Partial<FlickingProps & FlickingOptions>>, VanillaFlicking {
}
export default Flicking;
