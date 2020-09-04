import { NSDatabase } from '@sqltools/types';
import { UIAction } from './actions';
import { ReducerAction } from '../../interfaces';

type ActionKeys = keyof typeof UIAction;

export type ResultsReducerAction<
  K extends ActionKeys = ActionKeys
> = ReducerAction<typeof UIAction[K], ResultsScreenState>;

export interface ResultsScreenState {
  loading: boolean;
  hasError: boolean;
  resultTabs: NSDatabase.IResult[];
  activeTab: number;
}
