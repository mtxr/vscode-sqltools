import { Uri } from 'vscode';
import Context from './context';

const getIconPath = (icon: string) => Uri.parse(Context.asAbsolutePath(`icons/${icon}.svg`))

export const getIconPaths = (icon: string) => {
  return {
    dark: getIconPath(`${icon}-dark`),
    light: getIconPath(`${icon}-light`)
  };
}