const path = require('path')
const { expect, test } = require('@jest/globals')
const {
  detect,
  detectDir,
  detectFile
} = require('../src/index')

test('detectFile传入入口文件路径并返回引用路径数组', () => {
  const entry = 'tests/mock/a.js'
  const scope = detectFile(entry)
  expect(Array.isArray(scope)).toBeTruthy()
  expect(scope.length).toBeGreaterThan(0)
  
})

test('detectFile解析结果去重', () => {
  const entry = 'tests/mock/a.js'
  const duplicatePath = 'tests/mock/c.js'
  const scope = detectFile(entry)
  expect(scope.filter(i => i === duplicatePath).length).toBe(1)
})

test('detectFile可以正确解析引用文件路径', () => {
  const entry = 'tests/mock/a.js'
  let scope = detectFile(entry)
  expect(scope.length).toBe(6)
  expect(scope).toContain('tests/mock/a.js')
  expect(scope).toContain('tests/mock/b.js')
  expect(scope).toContain('tests/mock/c.js')
  expect(scope).toContain('tests/mock/d.js')
  expect(scope).toContain('tests/mock/e.js')
  expect(scope).toContain('tests/mock/f.js')

  scope = detectFile('tests/mock/b.js')
  expect(scope.length).toBe(2)
  expect(scope).toContain('tests/mock/c.js')

})

test('detectDir传入入口目录并返回数组', () => {
  const entry = path.resolve(__dirname, './mock/b1')
  const scope = detectDir(entry)
  expect(Array.isArray(scope)).toBeTruthy()
  expect(scope.length).toBeGreaterThan(0)
})

test('detectDir传入入口目录并返回目录中文件引用路径数组', () => {
  const entry = 'tests/mock/b1'
  const scope = detectDir(entry)
  expect(Array.isArray(scope)).toBeTruthy()
  expect(scope.length).toBeGreaterThan(0)
})

test('detectDir应当返回目录中所有引用文件路径', () => {
  const entry = 'tests/mock/b1'
  const scope = detectDir(entry)
  expect(scope.length).toBe(4)
  expect(scope).toContain('tests/mock/b1/m.js')
  expect(scope).toContain('tests/mock/b1/b2/k.js')
  expect(scope).toContain('tests/mock/b.js')
  expect(scope).toContain('tests/mock/c.js')
})

test('detect接收数组类型的参数并返回一个数组', () => {
  const scope = detect([
    'tests/mock/a.js',
    'tests/mock/b.js'
  ])
  expect(Array.isArray(scope)).toBeTruthy()
})

test('detect接收多个文件入口并返回合并后的引用返回数组', () => {
  const scope = detect([
    'tests/mock/b.js',
    'tests/mock/d.js'
  ])
  expect(Array.isArray(scope)).toBeTruthy()
  expect(scope.length).toBe(4)
  expect(scope).toContain('tests/mock/b.js')
  expect(scope).toContain('tests/mock/d.js')
  expect(scope).toContain('tests/mock/c.js')
  expect(scope).toContain('tests/mock/f.js')
})