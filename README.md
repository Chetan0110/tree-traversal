# Tree Traversal
A small app which provides correct traversal pattern using animation based on the selected traversal type.
Currently, supported traversal types are Breadth-First, Pre-order, In-order and Post-order.
Green or red color will be filled if node is visited or selected respectively.
**Note: The tree is static, dynamic tree is not supported as of now.** 

## References

* A reference have been taken from [this](https://bl.ocks.org/mpmckenna8/1bdbff541a7f47909c5b1471748b5638) example to build the static vertical tree diagram.
 
## Getting Started

* Download and install node's latest version based on your system from [here](https://nodejs.org/en/download/)
* Install npm package manager
* Clone the project
* Under the root (tree-traversal) directory run `npm install`

### Prerequisites

* All the required packages for this app have been listed under **package.json** file, some of them are needs to be installed menually and some of them come while creating app with create-react-app
* Menually needs to be installed includes-
  1. d3
  2. jquery
* Rest of them come while creating app

### Installing
* Fourth point under **Getting started** will install all the required packages


## Usage

### To run the server:

* Under the root (tree-traversal) directory run `npm start`
* The app will be accessible at [localhost:3000](http://localhost:3000)

## Deployment
* Under the root (tree-traversal) directory run `npm run build`
* Above command will create build of the app and put it inside **build** directory which can be found inside root directory of the app
* You can keep **build directory** as it is or you can move it anywhere else
* Install serve to run the build by running command `npm install -g serve`
* Go to build directory and run `serve -s .` or go to parent directory of **build** and run `serve -s build`

