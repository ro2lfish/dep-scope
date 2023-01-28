
const fs = require('fs')
const { detectFile, detectDir } = require('./index')
const [,,...args] = process.argv

let entry
if (args.length) {
  entry = args[0]
}

if (!entry) {
  process.exit()
}

const stat = fs.statSync(entry)
let scope
if (stat.isDirectory()) {
  scope = detectDir(entry)
} else if (stat.isFile()) {
  scope = detectFile(entry)
}
console.log(scope)