import { DOSBox, DOSBoxConf } from './index';
const myDosboxFolder='D:\\Program Files (x86)\\DOSBox-0.74-3\\'

let box = DOSBox.Fromdir(myDosboxFolder);
console.log('launch test');
const conf: DOSBoxConf = {
    cpu: {
        cycles: '1000'
    },
    sdl: {
        windowresolution: '1024x640',
        output: 'opengl'
    }
};

let n = 0;
const cmds = new Array(99).fill('').map(
    _ => {
        return 'echo ' + String(++n);
    });
cmds.push('PAUSE','EXIT');


box.runCommand(cmds, { conf }).then(
    info => {
        console.log(info.stdout)
    }
)


