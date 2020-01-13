import { ExtensionContext, TreeItemCollapsibleState, SnippetString } from 'vscode';
import { NSDatabase } from '@sqltools/types';
import SidebarAbstractItem from './SidebarAbstractItem';
import ContextValue from '../context-value';
export default class SidebarFunction extends SidebarAbstractItem<null> {
  public contextValue: ContextValue = ContextValue.FUNCTION;
  public value: string;
  public get items(): null { return null; }
  public addItem(_: never): never {
    throw new Error('Cannot add items to database function');
  }
  public get conn() { return this.parent.conn; }
  constructor(context: ExtensionContext, public functionData: NSDatabase.IFunction) {
    super(functionData.name, TreeItemCollapsibleState.None);
    this.value = functionData.name;
    this.iconPath = {
      dark: context.asAbsolutePath('icons/function-dark.svg'),
      light: context.asAbsolutePath('icons/function-light.svg'),
    };
    this.description = `${this.functionData.name}(${this.functionData.args.join(',')}) => ${this.functionData.resultType || 'void'}`;
    this.tooltip = `${this.functionData.signature}(${this.functionData.args.join(',')}) => ${this.functionData.resultType || 'void'}`;
    this.value = `${this.functionData.signature}`;
    let args = [];
    this.functionData.args.forEach((type, index) => {
      const [argName, argType] = type.split('=>');
      if (argType && argType.trim()) {
        args.push(`${argName} => \${${index + 1}:${argType}}`);
      }
      else {
        args.push(`\${${index + 1}:${type}}`);
      }
    });
    this.snippet = new SnippetString(`${this.functionData.signature}(${args.join(', ')})`).appendTabstop(0);
  }
}
