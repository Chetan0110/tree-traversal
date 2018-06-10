import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Header Component which contains four radio button for
 * the different type of traversal to choose from
 */
class Header extends Component {

    constructor() {
        super();
        this.state = {
            animSpeed: 750
        }

    }

    onAnimSpeedChange = (event) => {
        this.setState({ animSpeed: event.target.value });
    }

    render() {
        const style = {
            paddingLeft: "20%",
            paddingTop: "20px",
            float: 'left',
            display: 'inline-block'
        }
        return (
            <div style={style}>
                <form>
                    <input type='radio' name="treeType" value="breadthfirst" onChange={this.props.onTypeChange} />
                    <label>Breadth First</label>
                    {' '}
                    <input type='radio' name="treeType" value="preorder" onChange={this.props.onTypeChange} />
                    <label>Preorder</label>
                    {' '}
                    <input type='radio' name="treeType" value="inorder" onChange={this.props.onTypeChange} />
                    <label>Inorder</label>
                    {' '}
                    <input type='radio' name="treeType" value="postorder" onChange={this.props.onTypeChange} />
                    <label>Postorder</label>
                    {
                        this.props.selTraversalType.length !== 0 ? <span>
                            <label style={{ paddingLeft: '100px' }}>Traverse Speed: </label>
                            <input type='number' name='animSpeed' defaultValue={this.state.animSpeed} onChange={this.onAnimSpeedChange} />
                            <label> (in ms) </label>
                            <button onClick={e => this.props.onApplyClick(e, this.state.animSpeed)}>APPLY</button>
                        </span> : null
                    }
                </form>
            </div>
        );
    }
}

Header.propTypes = {
    onTypeChange: PropTypes.func.isRequired
};

export default Header;