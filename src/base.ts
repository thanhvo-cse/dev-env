import Command, {flags} from '@oclif/command'
import * as Config from "@oclif/config"
import Const from './const'
import Env from "./libs/env"
import CustomConfig from "./libs/customConfig"
import ProjectConfig from "./libs/projectConfig"
import Shell from './libs/shell'
import {join} from "path"
import DockerAbstract from "./services/dockerAbstract"
import DockerSource from "./services/dockerSource"
import DockerLocal from "./services/dockerLocal"
import DockerUpstream from "./services/dockerUpstream"

export default abstract class extends Command {
  protected env: Env = new Env()
  protected customConfig: CustomConfig = new CustomConfig()
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

    this.env.set(Env.DATA_UPSTREAM_PROJECT_DIR, join(config.dataDir, Const.UPSTREAM_PROJECTS_DIR))
    this.env.set(Env.DATA_UPSTREAM_DB_DIR, join(config.dataDir, Const.UPSTREAM_DB_DIR))
    this.env.set(Env.DATA_UPSTREAM_DB_BACKUP_DIR, join(config.dataDir, Const.UPSTREAM_DB_BACKUP_DIR))

    this.env.set(Env.DATA_LOCAL_PROJECT_DIR, join(config.dataDir, Const.LOCAL_PROJECTS_DIR))
    this.env.set(Env.DATA_LOCAL_DB_DIR, join(config.dataDir, Const.LOCAL_DB_DIR))
    this.env.set(Env.DATA_LOCAL_DB_BACKUP_DIR, join(config.dataDir, Const.LOCAL_DB_BACKUP_DIR))
  }

  async init() {
    // @ts-ignore
    const {args, flags} = this.parse(this.constructor)
    this.args = args
    this.flags = flags

    await this.env.set(Env.WORKSPACE_DIR, await this.customConfig.get(CustomConfig.WORKSPACE_DIR))
    await this.env.set(
      Env.SOURCE_UPSTREAM_PROJECT_DIR,
      join(await this.customConfig.get(CustomConfig.DOCKER_SOURCE_DIR), Const.SOURCE_PROJECTS_DIR)
    )

    const network = await this.customConfig.get(CustomConfig.NETWORK)
    if (network) {
      try {
        let {stdout} = await this.shell.script(
          `ipconfig getifaddr ${await this.customConfig.get(CustomConfig.NETWORK)}`,
          true
        )

        await this.env.set(Env.REMOTE_HOST, stdout.trim())
      } catch (e) {
      }

    }

    if (this.args.hasOwnProperty(Const.ARG_PROJECT)) {
      this.env.set(Env.PROJECT_NAME, this.args[Const.ARG_PROJECT])
    }
  }

  protected async getDocker(): Promise<DockerAbstract> {
    let docker: DockerAbstract
    if (this.flags.source) {
      docker = new DockerSource()
    } else if (this.flags.local) {
      docker = new DockerLocal()
    } else {
      docker = new DockerUpstream()
    }

    return docker
  }

  protected async getProjectConfig(project: string): Promise<ProjectConfig> {
    const config: ProjectConfig = new ProjectConfig()

    if (this.flags.source) {
      await config.initialize(await this.env.get(Env.SOURCE_UPSTREAM_PROJECT_DIR), project)
    } else if (this.flags.local) {
      await config.initialize(await this.env.get(Env.DATA_LOCAL_PROJECT_DIR), project)
    } else {
      await config.initialize(await this.env.get(Env.DATA_UPSTREAM_PROJECT_DIR), project)
    }

    return config
  }
}
