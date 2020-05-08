import * as fs from 'fs-extra'
import {join} from 'path'
import Command from '../base'
import Const from './../const'
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

  private hosts: Hosts = new Hosts()
  private fileProjects: FileProjects = new FileProjects()
  private fileDb: FileDb = new FileDb()

  async run() {
    const project = this.args[Const.ARG_PROJECT]
    const dataUpstreamDbDir = await this.env.get(Env.DATA_UPSTREAM_DB_DIR)
    const dataUpstreamDbBackupDir = await this.env.get(Env.DATA_UPSTREAM_DB_BACKUP_DIR)

    await this.hosts.addHost('adminer', true)
    await this.hosts.addHost(project, true)

    await this.fileProjects.download('system')
    await this.fileProjects.download(project)

    await this.fileDb.download(project)
    if (!fs.existsSync(dataUpstreamDbDir)) {
      fs.mkdirSync(dataUpstreamDbDir, {recursive: true})
    }

    const projectWorkspace = join(await this.env.get(Env.WORKSPACE_DIR), project)
    if (!fs.existsSync(projectWorkspace)) {
      const projectConfig = await this.getProjectConfig(project)
      const gitRepo = await projectConfig.get(ProjectConfig.GIT_REPO)
      if (gitRepo != '') {
        await this.shell.cmd('git', ['clone', gitRepo, projectWorkspace])
      } else {
        fs.mkdirSync(projectWorkspace, {recursive: true})
      }
    }

    if (fs.existsSync(join(dataUpstreamDbBackupDir, project, Const.DB_FILE))) {
      this.warn('downloaded db backup data')
    }
  }
}
