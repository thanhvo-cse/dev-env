import Command from '../base'

export default class Cleanup extends Command {
  static description = 'Cleanup docker environment'

  static flags = {
    ...Command.flags
  }

  async run() {
    let containers = (await this.shell.script(
      `docker ps -aq`,
      true
    )).stdout
    if (containers) {
      await this.shell.cmd('docker', ['rm', '-f'].concat(containers.split("\n")))
    }

    await this.shell.cmd('docker', ['network', 'prune', '-f'])

    let images = (await this.shell.script(
      `docker images | grep "<none>" | awk "{print \\$3}"`,
      true
    )).stdout
    if (images) {
      await this.shell.cmd('docker', ['rmi', '-f'].concat(images.split("\n")))
    }
  }
}
