import * as cp from 'child_process';
import * as conf from './dosbox_conf';
import * as core from './dosbox_core';


export class DOSBox extends core.DOSBox { };
export class BoxConf extends conf.BoxConf { };



async function whereIsDosbox() {
    return new Promise(
        resolve => {
            cp.exec('where dosbox', { encoding: 'utf-8', shell: 'cmd.exe' }, (error, stdout, stderr) => {
                if (error) {
                    resolve(undefined);
                } else if (stdout) {
                    resolve(stdout);
                }
            });
        }
    )
}

