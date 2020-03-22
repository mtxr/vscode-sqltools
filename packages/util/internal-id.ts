import { v4 as generateId } from 'uuid';

import { InternalID } from '@sqltools/types';
export default generateId as () => InternalID;