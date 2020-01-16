import Command, {flags} from '@oclif/command'
import * as Config from "@oclif/config"
import Const from './const'
import Env from "./libs/env"
import AppConfig from "./libs/appConfigs"
import CustomConfig from "./libs/customConfig"
import ProjectConfig from "./libs/projectConfig"
import Shell from './libs/shell'
import Files from "./libs/files";
import {join} from "path";

export default abstract class extends Command {
  protected env: Env = new Env()
  protected appConfig: AppConfig = new AppConfig()
  protected customConfig: CustomConfig = new CustomConfig()
  protected projectConfig: ProjectConfig = new ProjectConfig()
  protected files: Files = new Files()
  protected shell: Shell = new Shell()

  protected args: any
  protected flags: any

  static flags = {
    help: flags.help({char: 'h'})
  }

  constructor(argv: string[], config: Config.IConfig) {
    super(argv, config)

    this.env.set(Env.CONFIG_ROOT, config.root)
    this.env.set(Env.CONFIG_DATA_DIR, config.dataDir)
    this.env.set(Env.CONFIG_CONFIG_DIR, config.configDir)

    this.env.set(Env.DATA_UPSTREAM_PROJECT_DIR, join(config.configDir, Const.UPSTREAM_PROJECTS_DIR))
    this.env.set(Env.DATA_UPSTREAM_DB_DIR, join(config.configDir, Const.UPSTREAM_DB_DIR))
    this.env.set(Env.DATA_UPSTREAM_DB_BACKUP_DIR, join(config.configDir, Const.UPSTREAM_DB_BACKUP_DIR))

    this.env.set(Env.DATA_LOCAL_PROJECT_DIR, join(config.configDir, Const.LOCAL_PROJECTS_DIR))
    this.env.set(Env.DATA_LOCAL_DB_DIR, join(config.configDir, Const.LOCAL_DB_DIR))
    this.env.set(Env.DATA_LOCAL_DB_BACKUP_DIR, join(config.configDir, Const.LOCAL_DB_BACKUP_DIR))
  }

  async init() {
    const {args, flags} = this.parse(this.constructor)
    this.args = args
    this.flags = flags

    await this.env.set(Env.WORKSPACE_DIR, await this.customConfig.get(CustomConfig.WORKSPACE_DIR))
    await this.env.set(Env.SOURCE_UPSTREAM_PROJECT_DIR, join(await this.customConfig.get(CustomConfig.DOCKER_SOURCE_DIR), Const.SOURCE_PROJECTS_DIR))

    const network = await this.customConfig.get(CustomConfig.NETWORK)
    if (network) {
      let {stdout} = await this.shell.sh(`ipconfig getifaddr ${await this.customConfig.get(CustomConfig.NETWORK)}`, true)
      await this.env.set(Env.REMOTE_HOST, stdout.trim())
    }

    if (this.args.hasOwnProperty(Const.ARG_PROJECT)) {
      this.env.set(Env.PROJECT_NAME, this.args[Const.ARG_PROJECT])
    }
  }
}
