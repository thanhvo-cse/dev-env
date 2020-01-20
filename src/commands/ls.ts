import cli from 'cli-ux'
import {flags} from '@oclif/command'
import Command from '../base'
import Const from './../const'
import * as fs from 'fs'
import {join} from 'path'
import Env from "../libs/env";

export default class Ls extends Command {
  static description = 'List imported projects'

  static flags = {
    ...Command.flags
  }

  async run() {
    const projectDir = await this.env.get(Env.DATA_UPSTREAM_PROJECT_DIR)
    const dirents = fs.readdirSync(projectDir, { withFileTypes: true })
    const filesNames = dirents
      .filter(dirent => dirent.isDirectory() && dirent.name != 'system')
      .map(dirent => dirent.name)
    console.log(filesNames.join("\n"))
  }
}
