import Shell from './shell'
import Env from './Env'

export default class Docker {
  protected shell: Shell = new Shell()
  protected env: Env = new Env()

  protected projectConfigs: any

  async up(project: string) {
    await this.runWithSystem(project, 'up -d --no-build')
  }

  async down(project: string) {
    await this.run(project, 'down')
  }

  async restart(project: string) {
    await this.run(project, 'restart -d --no-build')
  }

  async dbRestore(project: string) {
    await this.exec(project, 'db', `mysql -u root -p123456 < /home/database.sql`)
  }

  protected async run(project: string, cmd: string) {
    const dockerDir = await this.getDockerDir()
    await this.shell.sh(`docker-compose -f ${dockerDir}/${project}/docker-compose.yml ${cmd}`);
  }

  protected async runWithSystem(project: string, cmd: string) {
    const dockerDir = await this.getDockerDir()
    let {stdout} = await this.shell.sh(`docker-compose -f ${dockerDir}/system/docker-compose.yml -f ${dockerDir}/${project}/docker-compose.yml ${cmd}`);
  }

  protected async exec(project: string, container: string, cmd: string) {
    let {stdout} = await this.shell.sh(`docker exec -i ${container}_${project} bash -c "${cmd}"`);
  }

  protected async getDockerDir() {
    return await this.env.get(Env.PROJECT_DIR)
  }
}
