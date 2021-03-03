import {DOSBox,DOSBoxConf} from './index';

let box = DOSBox.Fromdir('D:\\Program Files (x86)\\DOSBox-0.74-3\\');
console.log('launch test');
const conf: DOSBoxConf = {
    cpu: {
        cycles: '1000'
    },
    sdl: {
        windowresolution: '1024x640',
        output:'opengl'
    }
};
let n=0;
const cmds=[
    'echo '+ String(n++),
    'echo '+ String(n++),
    'echo '+ String(n++),
    'echo '+ String(n++),
    'echo '+ String(n++),
    'echo '+ String(n++),
    'echo '+ String(n++),
    'echo '+ String(n++),
    'echo '+ String(n++),
    'echo '+ String(n++),
    'echo '+ String(n++),
    'echo '+ String(n++),
    'echo '+ String(n++),
    'echo '+ String(n++),
    'echo '+ String(n++),
    'echo '+ String(n++),
    'echo '+ String(n++),
    'echo '+ String(n++),
    'echo '+ String(n++),
    'echo '+ String(n++),
    'echo '+ String(n++),
    'echo '+ String(n++),
    'echo '+ String(n++),
    'echo '+ String(n++),
    'echo '+ String(n++),
    'echo '+ String(n++),
    'echo '+ String(n++),
    'echo '+ String(n++),
    'echo '+ String(n++),
    'echo '+ String(n++),
    'echo '+ String(n++),
    'echo '+ String(n++),
    'echo '+ String(n++),
    'echo '+ String(n++),
    'echo '+ String(n++),
    'echo '+ String(n++),
    'echo '+ String(n++),
    'echo '+ String(n++),
    'echo '+ String(n++),
    'echo '+ String(n++),
    'echo '+ String(n++),
    'echo '+ String(n++),
    'echo '+ String(n++),
    'echo '+ String(n++),
    'echo '+ String(n++),
    //'exit',
]
box.runCommand(cmds, { conf }).then(
    info=>{
        console.log(info)}
)


