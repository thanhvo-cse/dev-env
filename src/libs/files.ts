import {mkdirSync} from 'fs'
import {join} from 'path'
import {GoogleDrive} from './files/googleDrive'
import Env from './env'

export default class Files {
  private gdrive:GoogleDrive = new GoogleDrive()
  private env:Env = new Env()
  private readonly PROJECT_DIR: string = 'projects'
  private readonly SHARED_DIR: string  = 'shared'

  private projectDir: string = ''
  private sharedDir: string = ''

  async initialize() {
    const dataDir = await this.env.get(Env.CONFIG_DATA_DIR)
    this.projectDir = join(dataDir, this.PROJECT_DIR)
    this.sharedDir = join(dataDir, this.SHARED_DIR)
  }

  async download(target:string, callback?: any) {
    await this.initialize()

    const dest = join(await this.projectDir, target)
    mkdirSync(dest, { recursive: true })

    this.gdrive.download('1VQj9hTOB9WnVXiveNHdcZr8EV2a21I4a', target, dest, callback)
  }

}
