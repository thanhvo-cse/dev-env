import * as path from 'path'
import * as fs from 'fs-extra'
import Env from './env'

export default class CustomConfig {
  private readonly FILENAME = 'config.json'
  private configs: any
  private configPath: string = ''

  static readonly WORKSPACE_DIR: string = 'WORKSPACE_DIR'
  static readonly NETWORK: string = 'NETWORK'

  private env: Env = new Env()

  async get(key: string) {
    await this.initialize()
    return this.configs[key] || ''
  }

  async set(key: string, value: any) {
    await this.initialize()
    this.configs = {...this.configs, ...{ [key]: value }}
    fs.writeJsonSync(this.configPath, this.configs)
  }

  private async initialize() {
    if (!this.configs) {
      this.configPath = path.join(await this.env.get(Env.CONFIG_CONFIG_DIR), this.FILENAME)

      if (!fs.existsSync(this.configPath)) {
        fs.writeJsonSync(this.configPath, {})
      }

      this.configs = fs.readJsonSync(this.configPath)
    }

    return this.configs
  }
}
