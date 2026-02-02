import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

// A single moving circle
const MovingCircle = ({ delay, color, size, startX, duration }: any) => {
  const translateY = useSharedValue(-50); // Start above container
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Fade in
    opacity.value = withDelay(delay, withTiming(0.6, { duration: 1000 }));

    // Fall animation
    translateY.value = withDelay(
      delay,
      withRepeat(
        withTiming(200, {
          // Fall distance (approx height of header box)
          duration: duration,
          easing: Easing.linear,
        }),
        -1, // Infinite
        false, // Do not reverse
      ),
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          backgroundColor: color,
          left: startX,
          top: 0,
        },
        animatedStyle,
      ]}
    />
  );
};

export default function HeaderRain() {
  // Generate random green circles
  const circles = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    size: Math.random() * 20 + 5, // Smaller sizes for header
    startX: Math.random() * 300, // Random X within box width
    color: i % 2 === 0 ? "#10B981" : "#34D399", // Green-500 and Emerald-400
    delay: Math.random() * 2000,
    duration: 3000 + Math.random() * 2000,
  }));

  return (
    <View
      style={[
        StyleSheet.absoluteFillObject,
        { overflow: "hidden", borderRadius: 24 },
      ]}
      pointerEvents="none"
    >
      {circles.map((c) => (
        <MovingCircle key={c.id} {...c} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    position: "absolute",
    borderRadius: 999,
  },
});
