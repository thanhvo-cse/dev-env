import Env from './../libs/env'
import FileAbstract from './fileAbstract'

export default class FileProjects extends FileAbstract {
  protected sourceFolder: string = 'projects'

  protected async getSourcePath() {
    return await this.env.get(Env.DATA_UPSTREAM_PROJECT_DIR)
  }
}
