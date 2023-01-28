const acorn = require('acorn')
const walk = require('acorn-walk')

function parseImports(input) {
  const pathList = new Set()
  try {
    const visitors = {
      ImportDeclaration(node) {
        pathList.add(node.source.value)
      },
      // ImportSpecifier(node) {
    
      // },
      // ImportNamespaceSpecifier(node) {
    
      // },
      ImportExpression(node) {
        pathList.add(node.source.value)
      }
    }
    const ast = acorn.parse(input, {
      ecmaVersion: 'latest',
      sourceType: 'module',
      allowImportExportEverywhere: true,
      allowReturnOutsideFunction: true,
      allowReserved: true
    })
  
    walk.simple(ast, visitors)
  } catch (error) {
    console.log(error)
  }
  return Array.from(pathList)
}

module.exports = {
  parseImports
}