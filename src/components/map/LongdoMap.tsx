import React from "react";

export let longdo: any;
export let map: any;

type Props = {
  id: any;
  callback: any;
  mapKey: string;
  height?: number | string;
  width?: number | string;
};

type State = {};

export class LongdoMap extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.mapCallback = this.mapCallback.bind(this);
  }

  mapCallback() {
    longdo = (window as any).longdo;
    map = new longdo.Map({
      placeholder: document.getElementById(this.props.id),
      language: "th",
    });
  }

  componentDidMount() {
    const existingScript = document.getElementById("longdoMapScript");
    const callback = this.props.callback;

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = `https://api.longdo.com/map/?key=${this.props.mapKey}`;
      script.id = "longdoMapScript";
      document.body.appendChild(script);

      script.onload = () => {
        this.mapCallback();
        if (callback) callback();
      };
    }

    if (existingScript) this.mapCallback();
    if (existingScript && callback) callback();
  }

  render() {
    return (
      <div
        id={this.props.id}
        style={{
          width: this.props.width ? this.props.width : "100%",
          height: this.props.height ? this.props.height : "100%",
        }}
      />
    );
  }
}
