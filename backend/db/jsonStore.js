import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'

export function createJsonStore(filePath) {
  let writeQueue = Promise.resolve()

  async function read() {
    return JSON.parse(await readFile(filePath, 'utf8'))
  }

  async function write(value) {
    writeQueue = writeQueue.then(async () => {
      await mkdir(dirname(filePath), { recursive: true })
      const temporaryPath = `${filePath}.tmp`
      await writeFile(temporaryPath, JSON.stringify(value, null, 2) + '\n', 'utf8')
      await rename(temporaryPath, filePath)
    })
    return writeQueue
  }

  return { read, write }
}
