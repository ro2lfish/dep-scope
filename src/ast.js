const acorn = require('acorn')
const walk = require('acorn-walk')

function walkImports(input) {
  const pathList = new Set()

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

  return Array.from(pathList)
}

module.exports = {
  walkImports
}