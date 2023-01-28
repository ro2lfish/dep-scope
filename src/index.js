const path = require('path')
const { createPathTree, toSourceList } = require('./dep')
const fs = require('fs')

let scopeNodes = {}

function detectFile(filePath) {
  if (path.extname(filePath) === '.js') {
    try {
      const tree = createPathTree(filePath, scopeNodes)
      return toSourceList(tree)
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
    
    files.forEach(fileName => {
      const relativePath = path.relative(process.cwd(), fileName)
      const stat = fs.statSync(relativePath)
      stat.isDirectory() && detectDir(relativePath, options, deep + 1)
      stat.isFile() && detectFile(relativePath)
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