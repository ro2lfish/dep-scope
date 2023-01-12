const path = require('path')
const { createPathTree, treeToList } = require('./dep')
const fs = require('fs')

let scopeNodes = {}

function detectFile(filePath) {
  if (path.extname(filePath) === '.js') {
    try {
      const tree = createPathTree(filePath, scopeNodes)
      return tree
    } catch (error) {
      console.log(error)
    }
  }
}

function detectDir(dirPath, options = {}, deep = 1) {
  if (deep === 1) {
    scopeNodes = {}
  }
  try {
    let files = fs.readdirSync(dirPath)
    files = files.map(name => path.resolve(dirPath, name))
    
    files.forEach(path => {
      const stat = fs.statSync(path)
      stat.isDirectory() && detectDir(path, options, deep + 1)
      stat.isFile() && detectFile(path)
    })
    return Object.keys(scopeNodes)
  } catch (error) {
    console.log(error)
  }
}

function detect(entry=[], options) {
  scopeNodes = {}
  entry.forEach(filePath => {
    detectFile(filePath)
  })
  let scopeArray = Object.keys(scopeNodes)
  scopeNodes = null
  return scopeArray
}

module.exports = {
  detect,
  detectDir,
  detectFile,
}