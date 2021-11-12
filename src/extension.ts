// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';


function replaceSlashes(from: RegExp[], to: string)
{
	vscode.window.activeTextEditor?.selections.forEach((selection) => {
		let start = vscode.window.activeTextEditor?.selection.start
		let end = vscode.window.activeTextEditor?.selection.end
		if(!start || !end) {
			return;
		}
		let range = new vscode.Range(start, end)
		let content = vscode.window.activeTextEditor?.document.getText(range)
		if(!content) {
			return;
		}

		let newContent = content
		from.forEach((needle) => {
			newContent = newContent.replace(needle, to);
		});
		vscode.window.activeTextEditor?.edit((editBuilder) => editBuilder.replace(range, newContent))
	});
}


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	console.log('Congratulations, your extension "pathfixer" is now active!');

	let toforward = vscode.commands.registerCommand('pathfixer.toforward', () => {
		replaceSlashes([/\\\\/g, /\\/g] ,"/");
	});
	let tobackward = vscode.commands.registerCommand('pathfixer.tobackwardsingle', () => {
		replaceSlashes([/\\\\/g, /\//g] ,"\\");
	});
	let todouble = vscode.commands.registerCommand('pathfixer.tobackwarddouble', () => {
		replaceSlashes([/\//g,  /(?<=[^\\])\\(?=[^\\])/g ] ,"\\\\");
		// replaceSlashes([/([^\\])\\([^\\])/g] ,"\\\\");
	});

	context.subscriptions.push(toforward);
	context.subscriptions.push(tobackward);
	context.subscriptions.push(todouble);


}

// this method is called when your extension is deactivated
export function deactivate() {}
