# DOSBox interface

An interface for running dosbox commands via child_process in node.js application.

## Installation

Use your favourite package manager:

- npm: `npm install dosbox-interface`

## System Dependencies

Requires [DOSBox](https://www.dosbox.com/) to be installed and that it can be called using the command `dosbox` or specify it's folder.

## Usage

```javascript
const {DOSBox} = require('dosbox-interface');
let box = DOSBox.Fromdir('C:\\your\\DOSBox\\Folder');

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
```