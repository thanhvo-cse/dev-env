import {flags} from '@oclif/command'
import Command from '../base'
import Const from './../const'
import * as fs from 'fs'
import {join} from 'path'
import Env from "../libs/env";

export default class Ls extends Command {
  static description = 'List imported projects'

  static flags = {
    ...Command.flags,
    source: flags.boolean({
      char: 's',
      description: 'with source'
    }),
    local: flags.boolean({
      char: 'l',
      description: 'locally'
    })
  }

  async run() {
    let projectDir
    if (this.flags.source) {
      projectDir = await this.env.get(Env.SOURCE_UPSTREAM_PROJECT_DIR)
    } else if (this.flags.local) {
      projectDir = await this.env.get(Env.DATA_LOCAL_PROJECT_DIR)
    } else {
      projectDir = await this.env.get(Env.DATA_UPSTREAM_PROJECT_DIR)
    }

    if (fs.existsSync(projectDir)) {
      const dirents = fs.readdirSync(projectDir, {withFileTypes: true})
      const filesNames = dirents
        .filter(dirent => dirent.isDirectory() && dirent.name != 'system')
        .map(dirent => dirent.name)
      console.log(filesNames.join("\n"))
    }
  }
}
