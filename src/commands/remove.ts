import cli from 'cli-ux'
import * as fs from 'fs-extra'
import {join} from 'path'
import Command from '../base'
import Const from './../const'
import Docker from './../libs/docker'
import Env from "./../libs/env"
import replace from 'replace'
import {flags} from "@oclif/command";

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

  private docker: Docker = new Docker()

  async run() {
    const project = this.args[Const.ARG_PROJECT]
    const dockerSourceDir = await this.env.get(Env.DOCKER_SOURCE_DIR)
    const projectDir = await this.env.get(Env.PROJECT_DIR)
    const sharedDir = await this.env.get(Env.SHARED_DIR)
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
