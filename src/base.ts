import Command, {flags} from '@oclif/command'
import * as Config from "@oclif/config"
import Env from "./libs/env"
import AppConfig from "./libs/appConfigs"
import CustomConfig from "./libs/customConfig"
import Shell from './libs/shell'
import Files from "./libs/files";

export default abstract class extends Command {
    protected env: Env = new Env()
    protected appConfig: AppConfig = new AppConfig()
    protected customConfig: CustomConfig = new CustomConfig()
    protected files: Files = new Files()
    protected shell: Shell = new Shell()

    static readonly WORKSPACE_DIR: string = 'WORKSPACE_DIR'
    static readonly NETWORK: string = 'NETWORK'
    static readonly PROJECT_NAME: string = 'PROJECT_NAME'

    static flags = {
        help: flags.help({char: 'h'})
    }

    constructor(argv: string[], config: Config.IConfig) {
        super(argv, config)

        this.env.set(Env.CONFIG_ROOT, config.root)
        this.env.set(Env.CONFIG_DATA_DIR, config.dataDir)
        this.env.set(Env.CONFIG_CONFIG_DIR, config.configDir)
    }

    async init() {
        await this.env.set(Env.WORKSPACE_DIR, await this.customConfig.get(CustomConfig.WORKSPACE_DIR))

        const network = await this.customConfig.get(CustomConfig.NETWORK)

        if (network) {
            let {stdout} = await this.shell.sh(`ipconfig getifaddr ${await this.customConfig.get(CustomConfig.NETWORK)}`)
            await this.env.set(Env.REMOTE_HOST, stdout.trim())
        }
    }
}
