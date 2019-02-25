
var vscode = require('vscode');

var config = require('./extension/action/helpers/Config');
var manager = require('./extension/Manager');
var structureProvider = require('./extension/StructureProvider');
var connectionsProvider = require('./extension/ConnectionsProvider');
var completionItemsProvider = require('./extension/CompletionItemsProvider');
var { setExtensionPath } = require('./extension/webViews/webViewsRunner');

function activate(context) {
    
    config.getDatabases().then((databases) => {
        manager.restoreConnections(databases);
    });

    setExtensionPath(context.extensionPath);

    context.subscriptions.push(vscode.languages.registerCompletionItemProvider('sql', completionItemsProvider, ' '));
    
    vscode.window.registerTreeDataProvider('Table', structureProvider);

    vscode.window.registerTreeDataProvider('Connections', connectionsProvider);

    addCommand(context, 'extension.queryBuild');

    addCommand(context, 'extension.runQueryBuild');

    addCommand(context, 'extension.saveConfig');
    
    addCommand(context, 'extension.changeDB');
    
    addCommand(context, 'extension.changeServer');
    
    addCommand(context, 'extension.connectToSQLServer');

    addCommand(context, 'extension.querySQL');
    
    addCommand(context, 'extension.queryFileSQL');

    addCommand(context, 'extension.queryFileSQLToCSV');

    addTextEditorCommand(context, 'extension.querySelectedSQL');

    addTextEditorCommand(context, 'extension.querySelectedSQLToCSV');

}
exports.activate = activate;

function addCommand(context, name) {
    const func = getCommandFunction(name);
    const command = vscode.commands.registerCommand(name, func);
    context.subscriptions.push(command);
}

function addTextEditorCommand(context, name) {
    const func = getCommandFunction(name);
    const command = vscode.commands.registerTextEditorCommand(name, func);
    context.subscriptions.push(command);
}

function getCommandFunction(name) {
    const actionClass = require('./extension/action/' + name + '.js');
    const actionObject = new actionClass();
    return actionObject.execution;
}

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;