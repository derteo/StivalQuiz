import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';
import { ITALY_MAP_VIEWBOX, ITALY_REGIONS_PATHS } from '../data/italyRegionsMap';

export default function ItalyRegionMap({ correctRegion, status, selected, onSelect, colors: colorsOverride }) {
  const { colors: themeColors } = useTheme();
  const colors = colorsOverride ?? themeColors;
  const answered = status === 'answered';

  // Le regioni evidenziate (corretta/selezionata) vanno disegnate per ultime,
  // altrimenti una regione confinante disegnata dopo ne coprirebbe il bordo.
  const orderedRegions = [...ITALY_REGIONS_PATHS].sort((a, b) => {
    const aHighlighted = a.name === correctRegion || a.name === selected ? 1 : 0;
    const bHighlighted = b.name === correctRegion || b.name === selected ? 1 : 0;
    return aHighlighted - bHighlighted;
  });

  return (
    <Svg viewBox={ITALY_MAP_VIEWBOX} style={{ width: '100%', aspectRatio: 441.5 / 513.9 }}>
      {orderedRegions.map(({ name, d }) => {
        const isCorrect = name === correctRegion;
        const isSelected = name === selected;
        const highlighted = answered && (isCorrect || isSelected);

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
            strokeWidth={highlighted ? 2.2 : 1.2}
            strokeLinejoin="round"
            onPress={() => !answered && onSelect(name)}
          />
        );
      })}
    </Svg>
  );
}
