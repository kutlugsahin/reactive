import { Component, ReactNode } from 'react';

export class ClassComp extends Component {
  public x: number;

  constructor(props: any) {
    super(props);
    this.x = 4;
  }

  componentDidMount(): void {
    console.log('did mount');
  }

  componentWillUnmount(): void {
    console.log('will unmount');
  }

  render(): ReactNode {
    return <div>Class comp</div>;
  }
}
