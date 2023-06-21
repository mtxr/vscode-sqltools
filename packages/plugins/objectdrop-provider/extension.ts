import { languages, CancellationToken, DataTransfer, DocumentDropEdit, DocumentDropEditProvider, Position, TextDocument } from "vscode";
import { IExtensionPlugin, IExtension, ContextValue } from '@sqltools/types';
import Context from '@sqltools/vscode/context';
import { SidebarTreeItem } from "../connection-manager/explorer";

class ObjectDropProvider implements DocumentDropEditProvider {
    private ELIGIBLE_CONTEXT_TYPES: ContextValue[] = [ContextValue.DATABASE, ContextValue.SCHEMA, ContextValue.TABLE, ContextValue.VIEW, ContextValue.COLUMN, ContextValue.FUNCTION];

    async provideDocumentDropEdits(
        _document: TextDocument
        , _position: Position
        , dataTransfer: DataTransfer
        , _token: CancellationToken
    ): Promise<DocumentDropEdit | undefined> {
        const dataTransferItem = await dataTransfer.get('application/vnd.code.tree.connectionExplorer');
        if (!dataTransferItem) {
            return undefined;
        }
        const val: SidebarTreeItem[] = JSON.parse(await dataTransferItem.value);             
        const snippet: DocumentDropEdit = new DocumentDropEdit(this.parseData(val));
        return snippet;
    }

    private parseData = (items: Array<SidebarTreeItem>): string|undefined => {
        return items.map(item=>{
            if (this.ELIGIBLE_CONTEXT_TYPES.indexOf(item.contextValue) === -1 ){
                return undefined;
            }
            else {
                return item.value;
            }
        }).join("\n");
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

