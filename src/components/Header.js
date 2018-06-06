import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Header Component which contains four radio button for
 * the different type of traversal to choose from
 */
class Header extends Component {
    render() {
        return (
            <div>
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
                </form>
            </div>
        );
    }
}

Header.propTypes = {
    onTypeChange: PropTypes.func.isRequired
};

export default Header;