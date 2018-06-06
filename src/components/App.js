import React, { Component } from 'react';

import Header from './Header';
import { Chart } from '../charts';
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
    const updatedTraversal = getAppropriateValues(this.visualChart.nodes, event.target.value);
    this.setState({
      selectedType: event.target.value,
      updatedTraversal
    });
    this.init("binaryTree", this.state.data, updatedTraversal)
  }

  render() {
    return (
      <div style={{ minHeight: 'inherit' }} >
        <Header onTypeChange={this.onTraversalTypeChange} />
        <div id={"binaryTree"} style={{ minHeight: 'inherit' }} />
      </div>
    )
  }

  componentDidMount() {
    this.init("binaryTree", this.state.data, this.state.data);
  }

  init(divId, data, updatedTraversal) {
    this.visualChart = new Chart();
    this.visualChart.init(divId, data, updatedTraversal);
    this.visualChart.drawChart();
  }

}

export default App;
