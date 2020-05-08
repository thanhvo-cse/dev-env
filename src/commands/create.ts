import cli from 'cli-ux'
import Command from '../base'
import Const from './../const'
import Env from "./../libs/env"
import {flags} from "@oclif/command"
import ProjectTemplate from '../services/projectTemplate'
import FileTransport from '../services/fileTransport'
import Hosts from '../services/hosts'
import {join} from "path";
import * as fs from "fs-extra";

export default class Create extends Command {
  static description = 'Create project'

  static args = [
    {
      name: Const.ARG_PROJECT,
      required: true,
      description: 'project name',
      hidden: false
    },
    {
      name: 'template',
      required: true,
      description: 'project template',
      hidden: false
    }
  ]

  static flags = {
    ...Command.flags,
    local: flags.boolean({
      char: 'l',
      description: 'locally'
    }),
    git: flags.string( {
      char: 'g',
      description: 'Git source path',
      default: '',
      multiple: false
    })
  }

  private projectTemplate: ProjectTemplate = new ProjectTemplate()
  private fileTransport: FileTransport = new FileTransport()
  private hosts: Hosts = new Hosts()

  async run() {
    const project = this.args[Const.ARG_PROJECT]
    const template = this.args.template

    cli.action.start('create files')
    await this.hosts.addHost(project, true)
    if (this.flags.local) {
      await this.projectTemplate.createLocalProject(template, project)
      await this.fileTransport.initLocalDir(project)
    } else {
      await this.projectTemplate.createUpstreamProject(template, project)
      await this.fileTransport.initUpstreamDir(project)
    }

    if (this.flags.git) {
      const gitRepo = this.flags.git
      const projectWorkspace = join(await this.env.get(Env.WORKSPACE_DIR), project)
      if (!fs.existsSync(projectWorkspace)) {
        if (gitRepo != '') {
          cli.action.start('checkout codebase')
          await this.shell.cmd('git', ['clone', gitRepo, projectWorkspace])
        }
      }
    }

    cli.action.stop()
  }
}
