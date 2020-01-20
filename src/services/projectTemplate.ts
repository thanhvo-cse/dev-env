import {join} from "path";
import Env from "../libs/env"
import * as fs from "fs-extra"
import replace from 'replace'

export default class ProjectTemplate {
  private env: Env = new Env()
  static readonly UPSTREAM_IP: number = 0
  static readonly LOCAL_IP: number = 100
  static readonly PHP_IP: number = 10

  async createUpstreamProject(template: string, project: string) {
    const sourceUpstreamProjectDir = await this.env.get(Env.SOURCE_UPSTREAM_PROJECT_DIR)
    const nginxDir = join(sourceUpstreamProjectDir, 'system', 'upstream')

    const systemConf = await this.findSystemConf(nginxDir, project)
    if (systemConf !== undefined) {
      console.log('system file exists')
      return
    }

    const ip4 = await this.getNewIp(nginxDir)

    await this.createSystem(nginxDir, project, ProjectTemplate.UPSTREAM_IP, ip4)
    await this.createProject(
      sourceUpstreamProjectDir,
      template,
      sourceUpstreamProjectDir,
      project,
      ProjectTemplate.UPSTREAM_IP,
      ip4
    )
  }

  async createLocalProject(template: string, project: string) {
    const dataUpstreamProjectDir = await this.env.get(Env.DATA_UPSTREAM_PROJECT_DIR)
    const nginxDir = join(dataUpstreamProjectDir, 'system', 'local')
    const dataLocalProjectDir = await this.env.get(Env.DATA_LOCAL_PROJECT_DIR)

    const systemConf = await this.findSystemConf(nginxDir, project)
    if (systemConf !== undefined) {
      console.log('system file exists')
      return
    }

    const newIp = await this.getNewIp(nginxDir)

    await this.createSystem(nginxDir, project, ProjectTemplate.LOCAL_IP, newIp)
    await this.createProject(
      dataUpstreamProjectDir,
      template,
      dataLocalProjectDir,
      project,
      ProjectTemplate.LOCAL_IP,
      newIp
    )
  }

  async removeUpstreamProject(project: string) {
    const sourceUpstreamProjectDir = await this.env.get(Env.SOURCE_UPSTREAM_PROJECT_DIR)
    const sourceNginxDir = join(sourceUpstreamProjectDir, 'system', 'upstream')
    const dataUpstreamProjectDir = await this.env.get(Env.DATA_UPSTREAM_PROJECT_DIR)
    const dataNginxDir = join(dataUpstreamProjectDir, 'system', 'upstream')

    await this.removeSystem(sourceNginxDir, project)
    await this.removeProject(sourceUpstreamProjectDir, project)
    await this.removeSystem(dataNginxDir, project)
    await this.removeProject(dataUpstreamProjectDir, project)
  }

  async removeLocalProject(project: string) {
    const dataUpstreamProjectDir = await this.env.get(Env.DATA_UPSTREAM_PROJECT_DIR)
    const dataLocalProjectDir = await this.env.get(Env.DATA_LOCAL_PROJECT_DIR)
    const dataNginxDir = join(dataUpstreamProjectDir, 'system', 'local')

    await this.removeSystem(dataNginxDir, project)
    await this.removeProject(dataLocalProjectDir, project)
  }

  private async createSystem(nginxDir: string, project: string, ip3Group: number, ip4: number) {
    const paddingIp = await this.padding(ip4.toString(), '0', 2)
    const ip3 = ip3Group + ProjectTemplate.PHP_IP
    const newConfFile = join(nginxDir, `local-${ip3}.${paddingIp}-${project}.legato.co.conf`)
    await fs.copySync(
      join(nginxDir, 'local.legato.co.conf.sample'),
      newConfFile
    )

    await this.replaceText(newConfFile, 'local-sample.legato.co', `local-${project}.legato.co`)
    await this.replaceText(newConfFile, /10\.10\.\d+\.\d+/g,`10.10.${ip3}.${ip4}`)
  }

  private async removeSystem(nginxDir: string, project: string) {
    const systemConf = await this.findSystemConf(nginxDir, project)
    if (systemConf !== undefined) {
      await fs.removeSync(join(nginxDir, systemConf.name))
    }
  }

  private async createProject(
    fromDir: string,
    fromName: string,
    toDir: string,
    toName: string,
    ip3Group: number,
    ip4: number
  ) {
    await fs.copy(join(fromDir, fromName), join(toDir, toName))
    const dockerFile = join(toDir, toName, 'docker-compose.yml')
    await this.replaceText(dockerFile, fromName, toName)
    await this.replaceText(
      dockerFile,
      /ipv4_address\:\s*10\.10\.\d+\.\d+/g,
      function(line) {
        return line.replace(/10\.10\.\d+\.\d+/g, function(ip) {
          let ips = ip.split('.')
          ips[2] = parseInt(ips[2]) + ip3Group
          ips[3] = ip4
          return ips.join('.')
        })
      })

    await this.replaceText(join(toDir, toName, 'config.json'), fromName, toName)
  }

  private async removeProject(projectDir: string, project: string) {
    if (fs.existsSync(join(projectDir, project))) {
      await fs.removeSync(join(projectDir, project))
    }
  }

  private async findSystemConf(nginxDir: string, project: string) {
    const dirents = fs.readdirSync(nginxDir, { withFileTypes: true })
    return dirents.find(
      dirent => dirent.name.match(`^local\-.*\-${project}\..*\.(conf)$`)
    )
  }

  private async getNewIp(nginxDir: string): Promise<number> {
    const dirents = fs.readdirSync(nginxDir, { withFileTypes: true })
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

  private async padding(str: string, char: string, count: number): Promise<string> {
    return (char.repeat(count) + str).slice(-2)
  }

  private async replaceText(file: string, from: any, to: any) {
    replace({
      regex: from,
      replacement: to,
      paths: [file],
      recursive: true,
      silent: true,
    })
  }
}
