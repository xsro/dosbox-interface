import * as ini from 'ini';
import * as os from 'os'

type obj={[id:string]:string|boolean}

/**works with dosbox conf file,see https://www.dosbox.com/wiki/Dosbox.conf */
export class dosboxConf {
    sdl?:obj = {
        /**fullscreen: Start dosbox directly in fullscreen. (Press ALT-Enter to go back) */
        fullscreen: false,
        /**fulldouble: Use double buffering in fullscreen. It can reduce screen flickering, but it can also result in a slow DOSBox. */
        fulldouble: false,
        fullresolution: 'original',
        windowresolution: 'original',
        output: 'surface',
        autolock: true,
        sensitivity: '100',
        waitonerror: true,
        priority: 'higher,normal',
        mapperfile: 'mapper-0.74-3.map',
        usescancodes: true
    };
    dosbox?:obj = {
        language: '',
        machine: 'svga_s3',
        captures: 'capture',
        memsize: '16'
    };
    render?:obj = {
        frameskip: '0',
        aspect: false,
        scaler: 'normal2x'
    };
    cpu?:obj = {
        core: 'auto',
        cputype: 'auto',
        cycles: 'auto',
        cycleup: '10',
        cycledown: '20'
    };
    mixer?:obj = {
        nosound: false,
        rate: '44100',
        blocksize: '1024',
        prebuffer: '25'
    };
    midi?:obj = {
        mpu401: 'intelligent',
        mididevice: 'default',
        midiconfig: ''
    };
    sblaster?:obj = {
        sbtype: 'sb16',
        sbbase: '220',
        irq: '7',
        dma: '1',
        hdma: '5',
        sbmixer: true,
        oplmode: 'auto',
        oplemu: 'default',
        oplrate: '44100'
    };
    gus?:obj = {
        gus: false,
        gusrate: '44100',
        gusbase: '240',
        gusirq: '5',
        gusdma: '3',
        ultradir: 'C:\\ULTRASND'
    };
    speaker?:obj = {
        pcspeaker: true,
        pcrate: '44100',
        tandy: 'auto',
        tandyrate: '44100',
        disney: true
    };
    joystick?:obj = {
        joysticktype: 'auto',
        timed: true,
        autofire: false,
        swap34: false,
        buttonwrap: false
    };
    serial?:obj = {
        serial1: 'dummy',
        serial2: 'dummy',
        serial3: 'disabled',
        serial4: 'disabled'
    };
    dos?:obj = {
        xms: true,
        ems: true,
        umb: true,
        keyboardlayout: 'auto'
    };
    ipx?:obj = { ipx: false };
    autoexec?: string[] = [];
    toString() {
        return dosboxConf.stringfy(this)
    }
    static stringfy(conf:dosboxConf){
        let str = ini.stringify(conf);
        str=str.replace(/autoexec\[\]=(.*)\n/g,"")
        const nl=os.EOL;
        if (conf.autoexec && conf.autoexec.length > 0) {
            str += `${nl}[AUTOEXEC]${nl}${conf.autoexec.join(nl)}`
        }
        return str;
    }
}


