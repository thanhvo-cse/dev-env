import * as path from 'path'
import * as fs from 'fs-extra'
import Env from './env'

export default class AppConfigs {
  private readonly FILENAME = 'config.json'
  private configs: any
  private configPath?: string

  private env: Env = new Env()

  async get(key: string) {
    await this.initialize()
    return this.configs[key] || ''
  }

  private async initialize() {
    if (!this.configs) {
      this.configPath = path.join(await this.env.get(Env.CONFIG_ROOT), this.FILENAME)
      this.configs = fs.readJsonSync(this.configPath)
    }
  }
}
