import Shell from './../libs/shell'
import Env from './../libs/Env'
import CustomConfig from "./../libs/customConfig";

export default abstract class DockerAbstract {
  protected shell: Shell = new Shell()
  protected env: Env = new Env()
  protected customConfig: CustomConfig = new CustomConfig()

  async up(project: string) {
    await this.runWithSystem(project, 'up -d')
  }

  async down(project: string) {
    if (project == 'all') {
      await this.shell.sh('docker stop $(docker ps -q)')
    } else {
      await this.run(project, 'down -v')
    }
  }

  async restart(project: string) {
    await this.run(project, 'restart -d')
  }

  async rebuild(project: string) {
    await this.run(project, 'pull')
    await this.runWithSystem(project, 'restart -d')
  }

  async dbRestore(project: string) {
    await this.exec(project, 'db', `mysql -u root -p123456 < /home/database.sql`)
  }

  async dbBackup(project: string) {
    await this.exec(
      project,
      'db',
      `
        mysqldump -u root -p123456 --add-drop-database --databases ${project} \
        | sed -e 's/CREATE DATABASE \\/\\*\\!32312 IF NOT EXISTS\\*\\//CREATE DATABASE IF NOT EXISTS/g' \
        > "/home/database.sql"
      `
    )
  }

  async webCmd(project: string, cmd: string, debugFlag: boolean = false) {
    if (debugFlag) {
      cmd = `
      PHP_IDE_CONFIG=\"serverName=local-${project}.legato.co\" \
      XDEBUG_CONFIG=\"ideKey=${await this.customConfig.get(CustomConfig.XDEBUG_IDE_KEY)}\" \
      XDEBUG_CONFIG=\"remote_enable=1\" \
      ${cmd}
      `
    }

    await this.exec(project, 'php', `cd /var/www/html/; ${cmd}`)
  }

  protected async run(project: string, cmd: string) {
    const projectCompose = await this.getProjectCompose(project)
    await this.shell.sh(`docker-compose -f ${projectCompose} ${cmd}`)
  }

  protected async runWithSystem(project: string, cmd: string) {
    const systemCompose = await this.getSystemCompose()
    const projectCompose = await this.getProjectCompose(project)
    let {stdout} = await this.shell.sh(`
      docker-compose -f ${systemCompose} -f ${projectCompose} ${cmd}
    `)
  }

  protected async exec(project: string, container: string, cmd: string) {
    let {stdout} = await this.shell.sh(`docker exec -i ${container}_${project} bash -c "${cmd}"`)
  }

  protected async abstract getProjectCompose(project: string)

  protected async abstract getSystemCompose()
}