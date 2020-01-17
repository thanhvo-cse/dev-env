import cli from 'cli-ux'
import * as fs from 'fs-extra'
import {join} from 'path'
import Command from '../base'
import Const from './../const'
import DockerUpstream from './../services/dockerUpstream'
import Env from "./../libs/env"
import ProjectConfig from "./../libs/projectConfig"
import Hosts from './../services/hosts'
import FileProjects from "../services/fileProjects"
import FileDb from "../services/fileDb"

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

  private docker: DockerUpstream = new DockerUpstream()
  private hosts: Hosts = new Hosts()
  private fileProjects: FileProjects = new FileProjects()
  private fileDb: FileDb = new FileDb()

  async run() {
    const project = this.args[Const.ARG_PROJECT]
    const dataUpstreamDbDir = await this.env.get(Env.DATA_UPSTREAM_DB_DIR)
    const dataUpstreamDbBackupDir = await this.env.get(Env.DATA_UPSTREAM_DB_BACKUP_DIR)

    await this.hosts.addHost('adminer', true)
    await this.hosts.addHost(project, true)

    cli.action.start('download project files')
    await this.fileProjects.download('system')
    await this.fileProjects.download(project)
    cli.action.stop()

    cli.action.start('download db files')
    await this.fileDb.download(project)
    if (!fs.existsSync(dataUpstreamDbDir)) {
      fs.mkdirSync(dataUpstreamDbDir, {recursive: true})
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
      if (fs.existsSync(join(dataUpstreamDbBackupDir, Const.DB_FILE))) {
        await this.docker.dbRestore(project)
      } else {
        await this.docker.dbCreate(project)
      }
      cli.action.stop()

      this.log('URL: ', await this.projectConfig.get(ProjectConfig.ACCESS_URL))
    }, 5000)
  }
}
