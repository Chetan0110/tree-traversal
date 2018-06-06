import TreeDiagram from './TreeDiagram';

export default function Chart() {
    this.VisHeight = null;
    this.VisWidth = null;
    this.divId = null;
    this.data = {};

    /*This method initialises basic paramters */
    this.init = function (divId, data, updatedTraversal) {
        this.divId = divId;
        this.data = data;
        this.updatedTraversal = updatedTraversal;
    };


    this.drawChart = function () {
        new TreeDiagram(this);
        this.drawTreeDiagram();
    };

}