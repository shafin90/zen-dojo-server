import * as React from "react";
declare class StrictPanel extends React.Component<{
    children?: React.ReactElement;
}> {
    private _hide;
    private _elRef;
    get nativeElement(): HTMLElement;
    get rendered(): boolean;
    render(): JSX.Element;
    show(): void;
    hide(): void;
    private _getElement;
}
export default StrictPanel;
