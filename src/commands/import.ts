import cli from 'cli-ux'
import * as fs from 'fs'
import {join} from 'path'
import Command from '../base'
import Const from './../const'
import Docker from './../libs/docker'
import Env from "./../libs/env"
import ProjectConfig from "./../libs/projectConfig"

export default class Import extends Command {
  static description = 'Import project'

  static args = [
    {
      name: Const.ARG_PROJECT,
      required: true,
      description: 'project name',
      hidden: false
    }
  ]

  static flags = {
    ...Command.flags
  }

  private docker: Docker = new Docker()

  async run() {
    const project = this.args[Const.ARG_PROJECT]

    cli.action.start('download files')
    await this.files.download('system')
    // await this.files.download(project)
    process.exit()
    const sharedDir = await this.env.get(Env.SHARED_DIR)
    const sharedProjectDir = join(sharedDir, project)

    if (!fs.existsSync(join(sharedProjectDir, Const.DB_DIR))) {
      fs.mkdirSync(join(sharedProjectDir, Const.DB_DIR), {recursive: true})
    }

    if (!fs.existsSync(join(sharedProjectDir, Const.DB_BACKUP_DIR))) {
      fs.mkdirSync(join(sharedProjectDir, Const.DB_BACKUP_DIR), {recursive: true})
    }

    await this.files.copy(project, Const.DB_FILE, join(sharedProjectDir, Const.DB_BACKUP_DIR, Const.DB_FILE))
    cli.action.stop()

    if (!fs.existsSync(join(sharedProjectDir, Const.DB_DIR))) {
      cli.action.start('checkout codebase')
      const gitRepo = await this.projectConfig.get(ProjectConfig.GIT_REPO)
      await this.shell.sh(`git clone ${gitRepo} $WORKSPACE_DIR/$PROJECT_NAME`)
      cli.action.stop()
    }

    cli.action.start('docker up')
    await this.docker.up(project)
    cli.action.stop()

    cli.action.start('import database')
    await this.docker.dbRestore(project)
    cli.action.stop()
  }
}
