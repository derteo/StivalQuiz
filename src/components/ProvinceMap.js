import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';
import { PROVINCES_BY_REGION } from '../data/provincesByRegion';

export default function ProvinceMap({ region, correctProvince, status, selected, onSelect, colors: colorsOverride }) {
  const { colors: themeColors } = useTheme();
  const colors = colorsOverride ?? themeColors;
  const answered = status === 'answered';
  const regionData = PROVINCES_BY_REGION[region];

  if (!regionData) return null;

  const [, , w, h] = regionData.viewBox.split(' ').map(Number);

  return (
    <Svg viewBox={regionData.viewBox} style={{ width: '100%', aspectRatio: w / h }}>
      {regionData.provinces.map(({ name, d }) => {
        const isCorrect = name === correctProvince;
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
