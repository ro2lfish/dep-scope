const path = require('path')
const fs = require('fs')
const { walkImports } = require('./ast')

function createPathTree(filePath, treeNode) {
  const input = fs.readFileSync(filePath, {
    encoding: 'utf8'
  })
  const { dir: dirName, name: fileName} = path.parse(filePath)

  const deps = walkImports(input)
  if (!treeNode) {
    treeNode = {
      name: fileName,
      source: filePath,
      children: []
    }
  }
  if (deps.length) {
    deps.forEach(value => {
      const relative = path.resolve(dirName, appendExtName(value))
      treeNode.children.push(createPathTree(relative))
    })
  }
  return treeNode
}

function appendExtName(path, extname = '.js') {
  if (path.endsWith(extname) === false) {
    return `${path}${extname}`
  }
  return path
}

function isRelative(path) {
  const char = path.charCodeAt(0)
  return char === '.'
}

function resolveImportPath(target, importPath) {
  if (isRelative(importPath)) {

  }
}

function sort(list) {
  list.sort((pre, next) => {
    return pre.split(path.sep).length - next.split(path.sep).length
  })
}


module.exports = {
  sort,
  createPathTree,
}