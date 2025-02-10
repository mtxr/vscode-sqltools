import inLine from './line';
import inArc from './arc';

export default function rectWithRadius(minX, minY, width, height, radius, lineWidth, x, y) {
  const halfWidth = lineWidth / 2;
  return (
    inLine(minX + radius, minY, minX + width - radius, minY, lineWidth, x, y) ||
    inLine(minX + width, minY + radius, minX + width, minY + height - radius, lineWidth, x, y) ||
    inLine(minX + width - radius, minY + height, minX + radius, minY + height, lineWidth, x, y) ||
    inLine(minX, minY + height - radius, minX, minY + radius, lineWidth, x, y) ||
    inArc(minX + width - radius, minY + radius, radius, 1.5 * Math.PI, 2 * Math.PI, lineWidth, x, y) ||
    inArc(minX + width - radius, minY + height - radius, radius, 0, 0.5 * Math.PI, lineWidth, x, y) ||
    inArc(minX + radius, minY + height - radius, radius, 0.5 * Math.PI, Math.PI, lineWidth, x, y) ||
    inArc(minX + radius, minY + radius, radius, Math.PI, 1.5 * Math.PI, lineWidth, x, y)
  );
}
