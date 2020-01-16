import cli from 'cli-ux'
import * as fs from 'fs-extra'
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
    const dataUpstreamDir = await this.env.get(Env.DATA_UPSTREAM_DIR)
    const dataUpstreamProjectDir = join(dataUpstreamDir, project)

    await this.shell.sh(`
      if ! grep -q local-adminer.legato.co "/etc/hosts"; then
          sudo -- sh -c -e "echo '127.0.0.1 local-adminer.legato.co' >> /etc/hosts"
      fi
    `)

    await this.shell.sh(`
      if ! grep -q local-${project}.legato.co "/etc/hosts"; then
          sudo -- sh -c -e "echo '127.0.0.1 local-${project}.legato.co' >> /etc/hosts"
          echo "Host name local-${project}.legato.co is added successfully"
      fi
    `)

    cli.action.start('download files')
    await this.files.download('system')
    await this.files.download(project)

    if (!fs.existsSync(join(dataUpstreamProjectDir, Const.DB_DIR))) {
      fs.mkdirSync(join(dataUpstreamProjectDir, Const.DB_DIR), {recursive: true})
    }

    if (!fs.existsSync(join(dataUpstreamProjectDir, Const.DB_BACKUP_DIR))) {
      fs.mkdirSync(join(dataUpstreamProjectDir, Const.DB_BACKUP_DIR), {recursive: true})
    }

    if (fs.existsSync(join(dataUpstreamProjectDir, project, Const.DB_FILE))) {
      await fs.copy(
        join(dataUpstreamProjectDir, project, Const.DB_FILE),
        join(dataUpstreamProjectDir, Const.DB_BACKUP_DIR, Const.DB_FILE)
      )
    }
    cli.action.stop()

    const projectWorkspace = join(await this.env.get(Env.WORKSPACE_DIR), project)
    if (!fs.existsSync(projectWorkspace)) {
      cli.action.start('checkout codebase')
      const gitRepo = await this.projectConfig.get(ProjectConfig.GIT_REPO)
      if (gitRepo != '') {
        await this.shell.sh(`git clone ${gitRepo} ${projectWorkspace}`)
      } else {
        fs.mkdirSync(projectWorkspace, {recursive: true})
      }
      cli.action.stop()
    }

    cli.action.start('docker up')
    await this.docker.up(project)
    cli.action.stop()


    this.log('wait for docker')
    await setTimeout(async () => {
      cli.action.start('import database')
      if (fs.existsSync(join(dataUpstreamProjectDir, Const.DB_BACKUP_DIR, Const.DB_FILE))) {
        await this.docker.dbRestore(project)
      } else {
        await this.docker.dbCreate(project)
      }
      cli.action.stop()

      this.log('URL: ', await this.projectConfig.get(ProjectConfig.ACCESS_URL))
    }, 5000)
  }
}
