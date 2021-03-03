import * as fs from 'fs';
import * as cp from 'child_process';
import * as path from 'path';
import { dosboxConf as DosboxConf } from './dosbox_conf';
import { DOSBoxConf } from '.';

interface DOSBoxOption {
    /**the dosbox conf can be a path of conf file or a  DosboxConf*/
    conf?: string | DosboxConf;
    param?: string[];
}

/**defines the option to do with dosbox's console message **in windows system**.
 * - For **windows**, if with parameter **noconsole** ,
 * the dosbox will redirect the console message to files in the *dosbox.exe*'s folder named 'stdout' and 'stderr'.
 * so we can read the message from these files **after dosbox exit**.
 * If without `noconsole` parameter, the dosbox will create a console window
 * - For **other OS**, dosbox will put it's console message in shell's stdout and stderr.
 */
export enum WINCONSOLEOPTION {
    /**use the `this._core` directly use `dosbox` directly.
     * For windos, dosbox will create a console window.*/
    normal,
    /**for windows using `start /min dosbox`
     * this will create and minimize the console window*/
    min,
    /**for windows using `dosbox -nocosle`
     * dosbox will redirect the console message to files
     * NOTE: for the extension, it will try to redirect the message to outputchannel*/
    noconsole,
}

export class DOSBox {
    /**the maximum of dosbox commands */
    static MAX_DOSBOX_COMMAND = 10;
    /**constructe from the path of dosbox */
    static Fromdir(cwd?: string, opt?: { winConsole?: WINCONSOLEOPTION }) {
        const core = OpenDosboxCmd(opt?.winConsole === WINCONSOLEOPTION.min);
        const box = new DOSBox(core);

        if (opt?.winConsole !== undefined) {
            box.console = opt?.winConsole;
        }
        box.cwd = cwd;
        return box;
    }

    /**the command to open DOSBox */
    public readonly _core: string;
    /**the Current Work Diractory for child_process*/
    public cwd?: string = process.cwd();
    /**the console option for windows OS */
    protected console: WINCONSOLEOPTION = WINCONSOLEOPTION.noconsole;
    /**whether the dosbox redirects the std information */
    public get redirect(): boolean {
        return process.platform === 'win32' && this.console === WINCONSOLEOPTION.noconsole;
    }
    /**count the time of run */
    private _count = 0;

    constructor(core: string) {
        this._core = core;
    }

    public version() {
        return this.run('-version')
    }

    /**run dosbox commands */
    public runCommand(boxcmd: string[], opt?: DOSBoxOption): Promise<DOSBoxStd> {
        const param = [];
        if (opt && opt.conf && (typeof opt.conf) === 'string') {
            if(fs.existsSync(opt.conf as string)){
                param.push(`-conf "${opt?.conf}"`);
            }
        }
        if (opt?.param && opt?.param.length > 0) {
            param.push(...opt.param);
        }

        let conf: DOSBoxConf | undefined = undefined;
        if (opt?.conf) {
            conf = opt.conf;
        }
        if (boxcmd.length > DOSBox.MAX_DOSBOX_COMMAND) {
            if (conf) {
                conf.autoexec ? conf.autoexec.concat(boxcmd) : conf.autoexec = boxcmd;
            } else {
                conf = { autoexec: boxcmd };
            }
        }
        else if (boxcmd.length > 0) {
            const mapper = (val: string): string => `-c "${val}"`;
            param.push(...boxcmd.map(mapper));
        }

        if (conf && this.cwd) {
            const dst = path.resolve(this.cwd, 'node_dosbox.conf');
            param.push(`-conf "${dst}"`);
            const data = DosboxConf.stringfy(conf);
            fs.writeFileSync(dst, data)
        }
        return this.run(param.join(" "));
    }

    /**run with parameters */
    public run(parameters?: string) {
        let param = this.redirect ? ' -noconsole ' : ' ';
        if (parameters) {
            param += parameters;
        }
        let command = "";
        if (this._core.includes('${args}')) {
            command = this._core.replace('${args}', param)
        } else {
            command = this._core + param;
        }
        return this.runViaChildProcess(command);
    };

    public stdoutHander: (message: string, text: string, No: number) => void = (message: string) => {
        // console.count('stdout');
        // console.log(message);
    };

    public stderrHander: (message: string, text: string, No: number) => void = (message: string) => {
        // console.log('stderr');
        // console.error(message);
    };

    private runViaChildProcess(command: string): Promise<DOSBoxStd> {
        let stdout = "", stderr = "", exitcode: number | null | undefined = undefined;
        //console.log(command);
        this._count++;
        return new Promise(
            (resolve, reject) => {
                const child = cp.exec(
                    command,
                    {
                        cwd: this.cwd,
                    },
                    (error, stdout, stderr): void => {
                        if (this.redirect && this.cwd) {
                            const stdinfo = winReadConsole(this.cwd);
                            if (stdinfo.length >= 2 && stdinfo[0]) {
                                this.stdoutHander(stdinfo[0], stdinfo[0], this._count);
                                stdout += stdinfo[0];
                            }
                            if (stdinfo.length >= 2 && stdinfo[1]) {
                                this.stderrHander(stdinfo[1], stdinfo[1], this._count);
                                stderr += stdinfo[1];
                            }
                        }
                        const output = { stdout, stderr, exitcode }
                        if (error) {
                            (error as any).note='try to open DOSBox failed';
                            (error as any).child_processError=error;
                            (error as any).output=output;
                            reject(error);
                           // throw error;
                        }
                        else {
                            resolve(output);
                        }
                    });

                child.on('exit', (code) => {
                    exitcode = code;
                });
                if (process.platform !== 'win32') {
                    child.stdout?.on('data', (data) => {
                        stdout += data;
                        this.stdoutHander(data, stdout, this._count);
                    });
                    child.stderr?.on('data', (data) => {
                        stderr += data;
                        this.stderrHander(data, stderr, this._count);
                    });
                }
            }
        );
    }
}

/**read the dosbox's console std information for win32
 * @param folder the folder to store stdout and stderr, usually the folder of dosbox.exe
 */
function winReadConsole(folder: string) {
    const dirs = fs.readdirSync(folder)
    const output = ['stdout.txt', 'stderr.txt'].map(
        val => {
            if (dirs.includes(val)) {
                return fs.readFileSync(path.resolve(folder, val), { encoding: 'utf-8' })
            } else {
                //console.warn(`no file ${val}`)
            }
        }
    )
    return output;
}



export interface DOSBoxStd {
    stdout: string;
    stderr: string;
    exitcode: number | null | undefined;
}

/**default command for open dosbox */
function OpenDosboxCmd(min?: boolean): string {
    //command for open dosbox
    let command = "dosbox";
    //for windows,using different command according to dosbox's path and the choice of the console window
    switch (process.platform) {
        case 'win32':
            command = min ? 'start/min/wait "" dosbox' : 'dosbox';
            break;
        case 'darwin':
            command = "open -a DOSBox --args";
            break;
        default:
            command = 'dosbox';
    }
    return command;
}
