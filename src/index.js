const path = require('path')
const { createPathTree, treeToList } = require('./dep')

function detectFile(filePath) {
  if (path.extname(filePath) === '.js') {
    try {
      const tree = createPathTree(filePath)
      console.log(treeToList(tree))

      return tree
    } catch (error) {
      console.log(error)
    }
  }
}

function detectDir(dirPath) {

}

function detect(entry=[], options) {
  entry.forEach(filePath => {
    const fileDeps = detectFile(filePath)
  })
}




detect([
  path.resolve(__dirname, '../tests/mock/a1/j.js')
])