import Coordinate from './coord/base';
import Cartesian from './coord/cartesian';
import Helix from './coord/helix';
import Polar from './coord/polar';

import { getCoordinate, registerCoordinate } from './factory';

registerCoordinate('rect', Cartesian);
registerCoordinate('cartesian', Cartesian);
registerCoordinate('polar', Polar);
registerCoordinate('helix', Helix);

export { getCoordinate, registerCoordinate, Coordinate };

export { Point, PolarCfg, CoordinateCfg } from './interface';
