import cli from 'cli-ux'
import * as fs from 'fs-extra'
import {join} from 'path'
import Command from '../base'
import Const from './../const'
import Env from "./../libs/env"
import {flags} from "@oclif/command"
import DockerUpstream from "../services/dockerUpstream"

export default class Remove extends Command {
  static description = 'Remove project'

  static args = [
    {
      name: Const.ARG_PROJECT,
      required: true,
      description: 'project name',
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

  private docker: DockerUpstream = new DockerUpstream()

  async run() {
    const project = this.args[Const.ARG_PROJECT]
    const dockerSourceDir = await this.env.get(Env.SOURCE_UPSTREAM_PROJECT_DIR)
    const projectDir = await this.env.get(Env.DATA_UPSTREAM_PROJECT_DIR)
    const sharedDir = await this.env.get(Env.DATA_UPSTREAM_DB_BACKUP_DIR)
    const sharedProjectDir = join(sharedDir, project)

    if (await cli.prompt(`Are you sure to remove project '${project}'? (y/n)`) == 'y') {
      cli.action.start('remove files')

      if (this.flags.local) {
        this.log('remove local project')
        if (fs.existsSync(join(projectDir, project))) {
          fs.removeSync(join(projectDir, project))
          await this.unlinkNginxConf(join(projectDir, 'system', 'nginx', 'conf.d', 'local'), project)
        }
      } else {
        this.log('remove upstream project')
        if (fs.existsSync(join(dockerSourceDir, project))) {
          fs.removeSync(join(dockerSourceDir, project))
          await this.unlinkNginxConf(join(dockerSourceDir, 'system', 'nginx', 'conf.d', 'upstream'), project)
        }

        if (fs.existsSync(join(projectDir, project))) {
          fs.removeSync(join(projectDir, project))
          await this.unlinkNginxConf(join(projectDir, 'system', 'nginx', 'conf.d', 'upstream'), project)
        }
      }

      if (fs.existsSync(sharedProjectDir)) {
        fs.removeSync(sharedProjectDir)
      }

      cli.action.stop()
    }
  }

  private async unlinkNginxConf(dir: string, project: string) {
    const dirents = fs.readdirSync(dir, { withFileTypes: true })
    const filesNames = dirents
      .filter(dirent => dirent.name.match(`^local\-.*\-${project}\.legato\.co\.conf$`))
      .map(dirent => {
        fs.unlink(join(dir, dirent.name))
      })
  }
}
