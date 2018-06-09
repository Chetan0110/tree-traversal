import React, { Component } from 'react';

import Header from './Header';
import { TreeDiagram } from '../charts';

class App extends Component {
  constructor() {
    super();
    this.state = {
      data: [34, 23, 92, 12, 4, 16, 9],
      selectedType: '',
    }
    this.onTraversalTypeChange = this.onTraversalTypeChange.bind(this);
  }

  // Set the sel traversal type in the state and
  // Call to TreeDiagram for redrawing
  onTraversalTypeChange(event) {
    this.setState({
      selectedType: event.target.value
    });
    this.init("tree", this.state.data, event.target.value)
  }

  render() {
    return (
      <div style={{ minHeight: 'inherit' }} >
        <Header onTypeChange={this.onTraversalTypeChange} />
        <div id={"tree"} style={{ minHeight: 'inherit' }} />
      </div>
    )
  }

  // For initial rendering
  componentDidMount() {
    this.init("tree", this.state.data, "");
  }

  init(divId, data, selectedType) {
    this.treeDiagram = new TreeDiagram();
    this.treeDiagram.init(divId, data, selectedType);
    this.treeDiagram.drawTreeDiagram();
  }

}

export default App;
