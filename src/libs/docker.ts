import {join} from 'path'
import Shell from './shell'
import Env from './Env'
import Const from './../const'
import * as fs from "fs-extra";

export default class Docker {
    private shell: Shell = new Shell()
    private env: Env = new Env()

    private projectConfigs: any

    async up(project: string) {
        await this.runWithSystem(project, 'up -d')
    }

    async down(project: string) {
        await this.run(project, 'down')
    }

    async dbRestore(project: string) {
        await this.exec(project, 'db', `mysql -u root -p123456 < /home/database.sql`)
    }

    private async run(project: string, cmd: string) {
        const projectDir = await this.env.get(Env.PROJECT_DIR)
        let {stdout} = await this.shell.sh(`docker-compose -f ${projectDir}/${project}/docker-compose.yml ${cmd}`);
    }

    private async runWithSystem(project: string, cmd: string) {
        const projectDir = await this.env.get(Env.PROJECT_DIR)
        let {stdout} = await this.shell.sh(`docker-compose -f ${projectDir}/system/docker-compose.yml -f ${projectDir}/${project}/docker-compose.yml ${cmd}`);
    }

    private async exec(project: string, container: string, cmd: string) {
        let {stdout} = await this.shell.sh(`docker exec -i ${container}_${project} bash -c "${cmd}"`);
    }
}
