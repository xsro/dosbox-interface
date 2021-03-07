const { DOSBox } = require('../out/index');
let box = DOSBox.Fromdir('D:\\Program Files (x86)\\DOSBox-0.74-3\\');

//set DOSBox configurations
const conf = {
    cpu: {
        cycles: '1000'
    },
    sdl: {
        windowresolution: '1024x640',
        output: 'opengl'
    }
};

//run DOSBox with command
box.runCommand('echo hello dosbox', { conf })
    .catch(error => {
        throw error
    })
    .then(
        info => {
            console.log(info)
        }
    )