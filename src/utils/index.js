export const getAppropriateValues = (nodes, type) => {
    let traversalPattern = [34, 23, 92, 12, 4, 16, 9];
    switch (type) {
        case 'breadthfirst':
            traversalPattern = [34, 23, 92, 12, 4, 16, 9];
            break;
        case 'preorder':
            traversalPattern = [34, 23, 12, 4, 92, 16, 9];
            break;
        case 'inorder':
            traversalPattern = [12, 23, 4, 34, 16, 92, 9];
            break;
        case 'postorder':
            traversalPattern = [12, 4, 23, 16, 9, 92, 34];
            break;
        default:
            traversalPattern = [34, 23, 92, 12, 4, 16, 9];
    }

    return traversalPattern;
}