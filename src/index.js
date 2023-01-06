const fs = require('fs')
const path = require('path')
const { walkImports } = require('./ast')
const { createPathTree } = require('./dep')

function detectFile(filePath) {
  if (path.extname(filePath) === '.js') {
    try {
      const tree = createPathTree(filePath)
      console.log(tree)

      return tree
    } catch (error) {
      console.log(error)
    }
  }
}

function detectDir(dirPath) {

}

function detect(entry=[]) {
  entry.forEach(filePath => {
    const fileDeps = detectFile(filePath)
  })
}



detect([
  path.resolve(__dirname, '../tests/mock/a.js')
])