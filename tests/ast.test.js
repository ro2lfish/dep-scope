const { expect, test } = require('@jest/globals')
const { parseImports } = require('../src/ast')

test('parseImports应当返回数组类型', () => {
  let input = `
    const acorn = import('acorn')
  `
  let imports = parseImports(input)
  expect(Array.isArray(imports)).toBe(true)
  expect(imports.length).toBe(1)

})

test('parseImports可以解析npm模块名称', () => {
  let input = `
    const acorn = import('acorn')
  `
  let imports = parseImports(input)
  expect(imports.length).toBe(1)
  expect(imports[0]).toBe('acorn')

  input = `
    const core = import('@babel/core')
  `
  imports = parseImports(input)
  expect(imports.length).toBe(1)
  expect(imports[0]).toBe('@babel/core')
})

test('parseImports可以解析相对路径', () => {
  let input = `
    const C = import('../a/b/c')
  `
  let imports = parseImports(input)
  expect(imports.length).toBe(1)
  expect(imports[0]).toBe('../a/b/c')
})

test('parseImports可以解析绝对路径', () => {
  let input = `
    const C = import('/a/b/c')
  `
  let imports = parseImports(input)
  expect(imports.length).toBe(1)
  expect(imports[0]).toBe('/a/b/c')
})


test('parseImports可以解析别名路径', () => {
  let input = `
    const C = import('@/src/a/c.js')
  `
  let imports = parseImports(input)
  expect(imports.length).toBe(1)
  expect(imports[0]).toBe('@/src/a/c.js')
})


test('parseImports可以解析多个import路径', () => {
  let input = `
    const a = import('./src/a.js')
    const b = import('./src/b.js')
    const c = import('./src/c.js')
  `
  let imports = parseImports(input)
  expect(imports.length).toBe(3)
  expect(imports).toEqual([
    './src/a.js',
    './src/b.js',
    './src/c.js',
  ])
})


test('parseImports可以解析动态导入', () => {
  let input = `
    function testFunction() {
      const module = import('../src/a.js')
    }
  `
  let imports = parseImports(input)
  expect(imports.length).toBe(1)
  expect(imports[0]).toBe('../src/a.js')
})

test('parseImports不会解析require方法', () => {
  let input = `
    const a = import('./src/a.js')
    const b = require('./src/b.js')
    const c = import('./src/c.js')
  `
  let imports = parseImports(input)
  expect(imports.length).toBe(2)
  expect(imports).toEqual([
    './src/a.js',
    './src/c.js',
  ])
})

test('parseImports可以识别变量导入', () => {
  let input = `
    const { b } = import('./src/b.js')
  `
  let imports = parseImports(input)
  expect(imports.length).toBe(1)
  expect(imports).toEqual([
    './src/b.js',
  ])
})

test('parseImports可以识别别名标识符', () => {
  let input = `
    import { a as A } from './src/a.js'
    import * as B from './src/b.js'
  `
  let imports = parseImports(input)
  expect(imports.length).toBe(2)
  expect(imports).toEqual([
    './src/a.js',
    './src/b.js'
  ])
})

test('parseImports可以解析多种导入模式', () => {
  let input = `
    const a = import('./src/a.js')
    import * as B from './src/b.js'
    import { c as C } from './src/c.js'
    import('./src/d.js')
  `
  let imports = parseImports(input)
  expect(imports.length).toBe(4)
  expect(imports).toEqual([
    './src/a.js',
    './src/b.js',
    './src/c.js',
    './src/d.js'
  ])
})