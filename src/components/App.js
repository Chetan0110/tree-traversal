import React, { Component } from 'react';

import Header from './Header';
import { TreeDiagram } from '../charts';
import { getAppropriateValues } from '../utils';

class App extends Component {
  constructor() {
    super();
    this.state = {
      data: [34, 23, 92, 12, 4, 16, 9],
      selectedType: '',
      updatedTraversal: [34, 23, 92, 12, 4, 16, 9]
    }
    this.onTraversalTypeChange = this.onTraversalTypeChange.bind(this);
  }

  onTraversalTypeChange(event) {
    const updatedTraversal = getAppropriateValues(this.treeDiagram.nodes, event.target.value);
    this.setState({
      selectedType: event.target.value,
      updatedTraversal
    });
    this.init("tree", this.state.data, updatedTraversal)
  }

  render() {
    return (
      <div style={{ minHeight: 'inherit' }} >
        <Header onTypeChange={this.onTraversalTypeChange} />
        <div id={"tree"} style={{ minHeight: 'inherit' }} />
      </div>
    )
  }

  componentDidMount() {
    this.init("tree", this.state.data, this.state.data);
  }

  init(divId, data, updatedTraversal) {
    this.treeDiagram = new TreeDiagram();
    this.treeDiagram.init(divId, data, updatedTraversal);
    this.treeDiagram.drawTreeDiagram();
  }

}

export default App;
