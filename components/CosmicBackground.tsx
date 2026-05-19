import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { gradients } from '../lib/theme';

type Props = {
  children?: React.ReactNode;
  variant?: keyof typeof gradients;
};

export function CosmicBackground({ children, variant = 'galaxy' }: Props) {
  return (
    <View style={styles.root}>
      <LinearGradient
        colors={gradients[variant]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <StarField />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

function StarField() {
  const stars = Array.from({ length: 40 }, (_, i) => ({
    cx: `${(i * 47) % 100}%`,
    cy: `${(i * 31) % 100}%`,
    r: (i % 3) * 0.6 + 0.5,
    o: (i % 5) * 0.15 + 0.2,
  }));
  return (
    <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
      <Defs>
        <RadialGradient id="halo" cx="50%" cy="50%" r="60%">
          <Stop offset="0%" stopColor="#7c5cff" stopOpacity="0.35" />
          <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Circle cx="50%" cy="20%" r="180" fill="url(#halo)" />
      {stars.map((s, i) => (
        <Circle key={i} cx={s.cx as never} cy={s.cy as never} r={s.r} fill="white" opacity={s.o} />
      ))}
    </Svg>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#02030a' },
  content: { flex: 1 },
});
