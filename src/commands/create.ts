import cli from 'cli-ux'
import * as fs from 'fs-extra'
import {join} from 'path'
import Command from '../base'
import Const from './../const'
import Docker from './../libs/docker'
import Env from "./../libs/env"
import replace from 'replace'
import {flags} from "@oclif/command";

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
    })
  }

  private docker: Docker = new Docker()

  async run() {
    const project = this.args[Const.ARG_PROJECT]
    const dockerSourceDir = await this.env.get(Env.DOCKER_SOURCE_DIR)
    const projectDir = await this.env.get(Env.PROJECT_DIR)

    cli.action.start('copy files')
    let destProject = join(dockerSourceDir, project)
    let destNginx = join(dockerSourceDir, 'system', 'nginx', 'conf.d', 'upstream')
    let ipGroup = 10
    if (this.flags.local) {
      destProject = join(projectDir, project)
      destNginx = join(projectDir, 'system', 'nginx', 'conf.d', 'local')
      ipGroup = 20
    }

    await fs.copy(join(dockerSourceDir, this.args.template), destProject)

    const newIp = await this.getMaxIp(destNginx)
    const paddingIp = ("0".repeat(2) + newIp).slice(-2)
    const newConfFile = join(destNginx, `local-${ipGroup}.${paddingIp}-${project}.legato.co.conf`)
    await fs.copy(
      join(destNginx, 'local.legato.co.conf.sample'),
      newConfFile
    )
    await this.replaceText(newConfFile, 'local-sample.legato.co', `local-${project}.legato.co`)
    await this.replaceText(newConfFile, `10.10.${ipGroup}.0`, `10.10.${ipGroup}.${newIp}`)

    await this.replaceText(join(destProject, 'docker-compose.yml'), this.args.template, project)
    await this.replaceText(
      join(destProject, 'docker-compose.yml'),
      `10\.10\.\d+\.\d+`,
      `10.10.${ipGroup}.${newIp}`
    )
    await this.replaceText(join(destProject, 'config.json'), this.args.template, project)

    cli.action.stop()
  }

  private async replaceText(file: string, from: string, to: string) {
    replace({
      regex: from,
      replacement: to,
      paths: [file],
      recursive: true,
      silent: true,
    })
  }

  private async getMaxIp(dir: string) {
    const dirents = fs.readdirSync(dir, { withFileTypes: true })
    const filesNames = dirents
      .filter(dirent => dirent.name.match(/^local\-.*\.(conf)$/))
      .map(dirent => {
        return dirent.name
      }).reverse()

    const maxIp = filesNames.shift()
    let newIp = 0
    if (maxIp != undefined) {
      newIp = parseInt(maxIp.split('-')[1].split('.')[1]) + 1
    }

    return newIp
  }
}
