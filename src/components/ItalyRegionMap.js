import Svg, { Path } from 'react-native-svg';
import { ITALY_MAP_VIEWBOX, ITALY_REGIONS_PATHS } from '../data/italyRegionsMap';

const COLORS = {
  card: '#ffffff',
  border: '#dbe9e2',
  correctBg: '#d4f0df',
  correctBorder: '#1f9d5c',
  wrongBg: '#fbdfdc',
  wrongBorder: '#d64545',
  modeActiveBg: '#e2f5ec',
};

export default function ItalyRegionMap({ correctRegion, status, selected, onSelect }) {
  const answered = status === 'answered';

  return (
    <Svg viewBox={ITALY_MAP_VIEWBOX} style={{ width: '100%', aspectRatio: 441.5 / 513.9 }}>
      {ITALY_REGIONS_PATHS.map(({ name, d }) => {
        const isCorrect = name === correctRegion;
        const isSelected = name === selected;

        let fill = COLORS.card;
        let stroke = COLORS.border;
        if (answered && isCorrect) {
          fill = COLORS.correctBg;
          stroke = COLORS.correctBorder;
        } else if (answered && isSelected && !isCorrect) {
          fill = COLORS.wrongBg;
          stroke = COLORS.wrongBorder;
        } else if (isSelected) {
          fill = COLORS.modeActiveBg;
        }

        return (
          <Path
            key={name}
            d={d}
            fill={fill}
            stroke={stroke}
            strokeWidth={1.2}
            strokeLinejoin="round"
            onPress={() => !answered && onSelect(name)}
          />
        );
      })}
    </Svg>
  );
}
