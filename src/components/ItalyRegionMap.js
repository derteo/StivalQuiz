import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';
import { ITALY_MAP_VIEWBOX, ITALY_REGIONS_PATHS } from '../data/italyRegionsMap';

export default function ItalyRegionMap({ correctRegion, status, selected, onSelect }) {
  const { colors } = useTheme();
  const answered = status === 'answered';

  return (
    <Svg viewBox={ITALY_MAP_VIEWBOX} style={{ width: '100%', aspectRatio: 441.5 / 513.9 }}>
      {ITALY_REGIONS_PATHS.map(({ name, d }) => {
        const isCorrect = name === correctRegion;
        const isSelected = name === selected;

        let fill = colors.card;
        let stroke = colors.border;
        if (answered && isCorrect) {
          fill = colors.correctBg;
          stroke = colors.correctBorder;
        } else if (answered && isSelected && !isCorrect) {
          fill = colors.wrongBg;
          stroke = colors.wrongBorder;
        } else if (isSelected) {
          fill = colors.modeActiveBg;
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
