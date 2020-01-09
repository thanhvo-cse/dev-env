import {join} from 'path'
import Shell from './shell'
import Env from './Env'
import Const from './../const'

export default class Docker {
    private shell: Shell = new Shell()
    private env: Env = new Env()

    private projectName: string = ''

    async up() {
        await this.runWithSystem('up')
    }

    async down() {
        await this.run('down')
    }

    async dbRestore() {
        await this.exec('db', `mysql -u root -p123456 < /home/${this.projectName}.sql`)
    }

    private async initialize() {
        if (this.projectName == '') {
            this.projectName = await this.env.get(Env.PROJECT_NAME)
        }
    }

    private async run(cmd: string) {
        await this.initialize()
        const projectDir = await this.env.get(Env.PROJECT_DIR)
        let {stdout} = await this.shell.sh(`docker-compose -f ${projectDir}/${this.projectName}/docker-compose.yml ${cmd} -d`);
    }

    private async runWithSystem(cmd: string) {
        await this.initialize()
        const projectDir = await this.env.get(Env.PROJECT_DIR)
        let {stdout} = await this.shell.sh(`docker-compose -f ${projectDir}/system/docker-compose.yml -f ${projectDir}/${this.projectName}/docker-compose.yml ${cmd} -d`);
    }

    private async exec(container: string, cmd: string) {
        await this.initialize()
        let {stdout} = await this.shell.sh(`docker exec -it ${container}_${this.projectName} bash -c "${cmd}"`);
    }
}
