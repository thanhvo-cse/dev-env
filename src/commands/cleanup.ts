import cli from 'cli-ux'
import Command from '../base'

export default class Cleanup extends Command {
  static description = 'Cleanup docker environment'

  static flags = {
    ...Command.flags
  }

  async run() {
    cli.action.start('docker cleanup')
    await this.shell.sh('docker rm -f $(docker ps -aq)')
    await this.shell.sh('docker network prune -f')
    await this.shell.sh('docker rmi -f $(docker images | grep "<none>" | awk "{print \\$3}")')
    cli.action.stop()
  }
}
