import { DOSBox, BoxConf } from './index';

const myDosboxFolder = 'D:\\Program Files (x86)\\DOSBox-0.74-3\\'

const conf: BoxConf = {
    cpu: {
        cycles: '1000'
    },
    sdl: {
        windowresolution: '1024x640',
        output: 'opengl'
    }
};

const cmds = new Array(99).fill('').map(
    (val, idx) => 'echo ' + String(idx));
cmds.push('PAUSE', 'EXIT');

async function main() {
    const box1 = await DOSBox.fromDir();
    if (box1) {
        box1?.runCommand(cmds, { conf })
    }
    const box2 = await DOSBox.fromDir(myDosboxFolder);
    if (box2) {
        box2?.runCommand(cmds, { conf })
    }
}

main();



