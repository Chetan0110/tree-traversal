import React, { Component } from 'react';

import Header from './Header';
import { TreeDiagram } from '../charts';

class App extends Component {
  constructor() {
    super();
    this.state = {
      data: [34, 23, 92, 12, 4, 16, 9],
      selectedType: '',
      animSpeed: 750
    }
    this.onTraversalTypeChange = this.onTraversalTypeChange.bind(this);
    this.onAnimSpeedChange = this.onAnimSpeedChange.bind(this);
  }

  // Set the sel traversal type in the state and
  // Call to TreeDiagram for redrawing
  onTraversalTypeChange(event) {
    this.setState({
      selectedType: event.target.value
    });
    this.init("tree", this.state.data, event.target.value, this.state.animSpeed);
  }

  //On click of APPLY button redraw the chart 
  //with updated animation speed
  onAnimSpeedChange(event, animSpeed) {
    event.preventDefault();
    animSpeed = Number(animSpeed)
    this.setState({ animSpeed })
    this.init("tree", this.state.data, this.state.selectedType, animSpeed);
  }

  render() {
    return (
      <div style={{ minHeight: 'inherit' }} >
        <Header onTypeChange={this.onTraversalTypeChange} selTraversalType={this.state.selectedType} onApplyClick={this.onAnimSpeedChange} />
        <div id={"tree"} style={{ minHeight: 'inherit' }} />
      </div>
    )
  }

  // For initial rendering
  componentDidMount() {
    this.init("tree", this.state.data, this.state.selectedType, this.state.animSpeed);
  }

  init(divId, data, selectedType, animSpeed) {
    this.treeDiagram = new TreeDiagram();
    this.treeDiagram.init(divId, data, selectedType, animSpeed);
    this.treeDiagram.drawTreeDiagram();
  }

}

export default App;
