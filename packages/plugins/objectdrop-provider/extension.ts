import { languages, DocumentSelector, CancellationToken, DataTransfer, DocumentDropEdit, DocumentDropEditProvider, Position, TextDocument } from "vscode";
import { IExtensionPlugin, IExtension } from '@sqltools/types';
import Context from '@sqltools/vscode/context';
import { Print } from "@material-ui/icons";

class ObjectDropProvider implements DocumentDropEditProvider {
    async provideDocumentDropEdits(
        _document: TextDocument
        , _position: Position
        , dataTransfer: DataTransfer
        , _token: CancellationToken
    ): Promise<DocumentDropEdit | undefined> {
        console.log("Editor item drop detected");
        const dataTransferItem = dataTransfer.get('application/vnd.code.tree.sqltoolsobjectdrop');
        if (!dataTransferItem) {
            console.log("No data transfer items found, canceling");
            return undefined;
        }
        dataTransfer.forEach((item, mimetype) => {
            console.log("Itterate types");
            console.log(`${mimetype} - ${JSON.stringify(item)}`);
        });

        const val = await dataTransferItem.value;
        console.log(`Recieved data ${JSON.stringify(dataTransferItem)}, ${JSON.stringify(val)}`);
        const snippet: DocumentDropEdit = new DocumentDropEdit(val);
        console.log(`Dropped data ${JSON.stringify(snippet)}`);
        return snippet;
    }
}

export default class ObjectDropProviderPlugin implements IExtensionPlugin {
    public type: "driver" | "plugin" = "plugin";
    public name: string = "Object Drop-in Provider";
    private isRegistered: boolean = false;

    register(_extension: IExtension) {
        console.log("Checking whether to register object drop extension");
        if (this.isRegistered) {
            return; // do not register twice
        }
        console.log("Registering object drop provider");

        // Register editor drop-in plugin which will allow dropping data from the connection explorer

        // Register unsaved files (included .session files generated when connecting to a source via sqltools)
        Context.subscriptions.push(
            languages.registerDocumentDropEditProvider(
                { scheme: 'untitled' },
                new ObjectDropProvider()
            )
        );

        // Register sql files
        Context.subscriptions.push(
            languages.registerDocumentDropEditProvider(
                { scheme: 'file', language: 'sql' },
                new ObjectDropProvider()
            )
        );
        console.log("Registered object drop provider");
        this.isRegistered = true;
    };

}