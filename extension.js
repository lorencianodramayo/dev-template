// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const {posix} = require('path');
const axios = require('axios');
const AdmZip = require("adm-zip");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "devtemplate" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('devtemplate.helloWorld', function () {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    if (!vscode.workspace.workspaceFolders) {
    	return vscode.window.showInformationMessage('No folder or workspace opened');
    }else{
    	axios.get("https://www.adlib-qa.tools/CreativesAPI/get")
    		.then((res) => {
    			const zip = new AdmZip(Buffer.from(res.data[0].encoded, 'base64'));
    			zip.getEntries().forEach(async (entry, index) => {
    				if(!entry.isDirectory && !entry.name.includes("._")){
    					let folderUri = vscode.workspace.workspaceFolders[0].uri;
    					let fileUri = folderUri.with({ path: posix.join(folderUri.path, entry.name) });
    					//console.log(fileUri)
    					await vscode.workspace.fs.writeFile(fileUri, Buffer.from(entry.getData(), 'utf8'));
    				}
    			})
    		})
    }
  });

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {} 

module.exports = {
	activate,
	deactivate
}
