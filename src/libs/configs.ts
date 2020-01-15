import {resolve} from 'path'
import {existsSync, writeFileSync, readFileSync} from 'fs'

export default class Configs {
  private configs: any
  private configDir: string

  constructor() {
    this.configDir = resolve(String(process.env.HOME), process.env.CLI_CONFIG_DIR || '.config/dev-env.json')
    if (!existsSync(this.configDir)) {
      writeFileSync(resolve(process.env.HOME as string, this.configDir), JSON.stringify({}), {
        encoding: 'UTF-8',
        mode: '0755',
      })
    }

    this.configs = JSON.parse(String(readFileSync(this.configDir)))
  }

  async get(key: string) {
    return this.configs[key] || ''
  }

  async set(key: string, value: any) {
    let newConfig = {}
    this.configs = {...this.configs, ...{[key]: value}}

    writeFileSync(resolve(process.env.HOME as string, this.configDir), JSON.stringify(this.configs), {
      encoding: 'UTF-8',
      mode: '0755',
    })
  }
}
