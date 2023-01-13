const path = require('path')
const fs = require('fs')
const { parseImports } = require('./ast')

function createPathTree(filePath, existNodes = {}) {
  const input = fs.readFileSync(filePath, {
    encoding: 'utf8'
  })
  const { dir: dirName, name: fileName} = path.parse(filePath)

  const deps = parseImports(input)
 
  const treeNode = {
    name: fileName,
    source: filePath,
    children: []
  }
  if (!existNodes[filePath]) {
    existNodes[filePath] = treeNode
  }
  
  if (deps.length) {
    deps.forEach(value => {
      const relative = path.resolve(dirName, appendExtName(value))
      if (existNodes[relative]) {
        treeNode.children.push(existNodes[relative])
      } else {
        treeNode.children.push(createPathTree(relative, existNodes))
      }
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

function treeToList(tree, list) {
  if (!list) {
    list = []
  }
  if (list.indexOf(tree.source) < 0) {
    list.push(tree.source)
  }
  tree.children.forEach(node => {
    treeToList(node, list)
  })
  return list
}

function sort(list) {
  list.sort((pre, next) => {
    return pre.split(path.sep).length - next.split(path.sep).length
  })
}

module.exports = {
  sort,
  treeToList,
  createPathTree,
}