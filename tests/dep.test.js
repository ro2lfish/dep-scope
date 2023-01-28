const { expect, test, jest: j } = require('@jest/globals')
const path = require('path')
const {
  sort,
  toSourceList,
  appendExtName,
  createPathTree,
} = require('../src/dep')


test('createPathTree应当接收一个入口参数并返回结果', () => {
  const mock = j.fn((path) => createPathTree(path))
  mock('tests/mock/a.js')
  expect(mock).toHaveBeenCalled()
  expect(mock).toHaveReturned()
})



test('createPathTree应当返回包含name、source、children属性的节点树对象', () => {
  const mock = j.fn((path) => createPathTree(path))

  const tree = mock('tests/mock/a.js')
  expect(tree).toBeDefined()
  expect(tree).toHaveProperty('children')
  expect(tree).toHaveProperty('name')
  expect(tree).toHaveProperty('source')
  expect(Array.isArray(tree.children)).toBeTruthy()
  const child =  tree.children[0]
  expect(child).toHaveProperty('children')
  expect(child).toHaveProperty('name')
  expect(child).toHaveProperty('source')
})

test('createPathTree接收到错误的入口路径时应当抛出异常', () => {
  expect(() => {
    createPathTree('./incorrect/path') 
  }).toThrow()
})

test('createPathTree可以正确解析入口文件引用的其他文件路径', () => {
  const entryPath = 'tests/mock/b.js'
  const tree = createPathTree(entryPath)
  expect(tree).toBeDefined()
  expect(tree.children.length).toBe(1)
  expect(tree).toEqual({
    name: 'b',
    source: entryPath,
    children: [
      {
        name: 'c',
        source: 'tests/mock/c.js',
        children: []
      }
    ]
  })
})

test('createPathTree传入第2个参数时应该正确更新引用对象', () => {
  const entryPath = 'tests/mock/b.js'
  const secondParams = {}
  createPathTree(entryPath, secondParams)
  expect(secondParams).not.toEqual({})
})

test('createPathTree传入第2个参数时应将传入对象更新为以引用路径为key的node map', () => {
  const entryPath = 'tests/mock/b.js'
  const referencePath = 'tests/mock/c.js'
  const secondParams = {}
  const tree = createPathTree(entryPath, secondParams)
  console.log(entryPath)
  expect(secondParams).toHaveProperty([entryPath])
  expect(secondParams).toHaveProperty([referencePath])
  expect(secondParams[entryPath]).toEqual(tree)
  expect(secondParams[entryPath].children).toEqual([
    secondParams[referencePath]
  ])
})

test('appendExtName应当在传入字符串的结尾补充指定扩展名', () => {
  const fileName = './a/b/c'
  const res = appendExtName(fileName, '.js')
  expect(res.indexOf('.js')).toBeGreaterThan(0)
  expect(res.indexOf('.js') === fileName.length)
})

test('appendExtName应当在传入字符串已经包含扩展名时不会重复添加', () => {
  const fileName = './a/b/c.js'
  const res = appendExtName(fileName, '.js')
  expect(res.endsWith('.js')).toBeTruthy()
  expect(res.endsWith('.js.js')).toBeFalsy()
})