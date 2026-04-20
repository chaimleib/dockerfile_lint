/**
 * Created by lphiri on 3/20/16.
 */
'use strict';


const commandHandlerMap = Object.freeze({
    User: {command: 'USER', parser: parseUser},
    Entrypoint: {command: 'ENTRYPOINT', parser: parseEntryPoint},
    Env: {command: 'ENV', parser: parseEnv},
    Cmd: {command: 'CMD', parser: parseCmd},
    WorkingDir: {command: 'WORKDIR', parser: parseWorkDir},
    OnBuild: {command: 'ONBUILD', parser: parseOnBuild},
    Labels: {command: 'LABEL', parser: parseLabels},
    ExposedPorts: {command: 'EXPOSE', parser: parseExposedPorts},
});


function commandsFromInspect(inspectOutPutJson) {

    const inspectOutPut = JSON.parse(inspectOutPutJson);
    const commands = [],
        config = inspectOutPut.Config;
    if (parseMaintainer(inspectOutPut)){
        commands.push(parseMaintainer(inspectOutPut));
    }
    if (config) {
        const keys = Object.keys(config);
        for (const key in keys) {
            const commandName = keys[key];
            const commandHandler = commandHandlerMap[commandName];
            if (commandHandler) {
                const args = commandHandler.parser(config[commandName]);
                if (args) {
                    commands.push({
                        name: commandHandler.command,
                        args: args,
                        raw: config[commandName]
                    });
                }
            }
        }
    }
    return commands;
}


function parseUser(args) {
    return args;
}

function parseEntryPoint(args) {

}

function parseEnv(args) {

}

function parseCmd(args) {

}

function parseWorkDir(args) {

}

function parseOnBuild(args) {

}

function parseLabels(args) {
    return args;
}

function parseExposedPorts(args) {

}

function parseMaintainer(inspectOutPut) {
    const author = inspectOutPut['Author'];
    if (!author) return null;
    return {
        name: 'MAINTAINER',
        args: author,
        raw: null
    };
}

module.exports.commandsFromInspect = commandsFromInspect;

