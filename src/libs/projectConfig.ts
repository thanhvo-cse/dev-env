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
    return this.configs[key] || ''
  }

  async initialize(projectDir: string, projectName: string) {
    if (!this.configs) {
      this.configs = fs.readJsonSync(join(
        projectDir,
        projectName,
        Const.CONFIG_FILE
      ))
    }
  }
}
