import * as fs from 'fs-extra'
import Env from './env'
import {join} from "path";
import Const from "../const";

export default class ProjectConfig {
  private readonly FILENAME = 'config.json'
  private configs: any
  private configPath: string = ''

  static readonly ACCESS_URL: string = 'ACCESS_URL'
  static readonly GIT_REPO: string = 'GIT_REPO'

  private env: Env = new Env()

  async get(key: string) {
    await this.initialize()
    return this.configs[key] || ''
  }

  private async initialize() {
    if (!this.configs) {
      this.configs = fs.readJsonSync(join(
        await this.env.get(Env.DATA_UPSTREAM_PROJECT_DIR),
        await this.env.get(Env.PROJECT_NAME),
        Const.CONFIG_FILE
      ))
    }
  }
}
