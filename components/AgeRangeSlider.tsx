import React, { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, PanResponder, Animated } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const CONTAINER_PADDING = 24; // Padding inside the modal
const SLIDER_PADDING = 20; // Padding inside the slider component
const THUMB_SIZE = 24;
const TRACK_HEIGHT = 6;

// Calculate available width for the slider track
const SLIDER_WIDTH = screenWidth - (CONTAINER_PADDING * 2) - (SLIDER_PADDING * 2) - THUMB_SIZE;

interface AgeRangeSliderProps {
  minAge: number;
  maxAge: number;
  absoluteMin?: number;
  absoluteMax?: number;
  onRangeChange: (min: number, max: number) => void;
}

export default function AgeRangeSlider({
  minAge,
  maxAge,
  absoluteMin = 18,
  absoluteMax = 65,
  onRangeChange,
}: AgeRangeSliderProps) {
  // Convert age values to slider positions (0 to SLIDER_WIDTH)
  const ageToPosition = useCallback((age: number) => {
    return ((age - absoluteMin) / (absoluteMax - absoluteMin)) * SLIDER_WIDTH;
  }, [absoluteMin, absoluteMax]);

  // Convert slider positions to age values
  const positionToAge = useCallback((position: number) => {
    const ratio = position / SLIDER_WIDTH;
    return Math.round(absoluteMin + ratio * (absoluteMax - absoluteMin));
  }, [absoluteMin, absoluteMax]);

  // Initialize positions based on current age values
  const [currentMinAge, setCurrentMinAge] = useState(minAge);
  const [currentMaxAge, setCurrentMaxAge] = useState(maxAge);

  // Animated values for thumb positions
  const minPosition = useRef(new Animated.Value(ageToPosition(minAge))).current;
  const maxPosition = useRef(new Animated.Value(ageToPosition(maxAge))).current;

  // Track which thumb is being dragged
  const [isDraggingMin, setIsDraggingMin] = useState(false);
  const [isDraggingMax, setIsDraggingMax] = useState(false);

  // Update age range and notify parent
  const updateAgeRange = useCallback((min: number, max: number) => {
    // Ensure min is at least absoluteMin and max is at most absoluteMax
    const validMin = Math.max(min, absoluteMin);
    const validMax = Math.min(max, absoluteMax);
    
    // Ensure min is not greater than max
    const finalMin = Math.min(validMin, validMax - 1);
    const finalMax = Math.max(validMax, validMin + 1);
    
    setCurrentMinAge(finalMin);
    setCurrentMaxAge(finalMax);
    onRangeChange(finalMin, finalMax);
  }, [onRangeChange, absoluteMin, absoluteMax]);

  // Pan responder for minimum thumb
  const minPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      setIsDraggingMin(true);
    },
    onPanResponderMove: (_, gestureState) => {
      const currentPos = ageToPosition(currentMinAge);
      const newPosition = Math.max(0, Math.min(currentPos + gestureState.dx, ageToPosition(currentMaxAge) - 20));
      
      minPosition.setValue(newPosition);
      
      const newMinAge = positionToAge(newPosition);
      const newMaxAge = currentMaxAge;
      
      updateAgeRange(newMinAge, newMaxAge);
    },
    onPanResponderRelease: () => {
      setIsDraggingMin(false);
    },
  });

  // Pan responder for maximum thumb
  const maxPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      setIsDraggingMax(true);
    },
    onPanResponderMove: (_, gestureState) => {
      const currentPos = ageToPosition(currentMaxAge);
      const newPosition = Math.max(ageToPosition(currentMinAge) + 20, Math.min(currentPos + gestureState.dx, SLIDER_WIDTH));
      
      maxPosition.setValue(newPosition);
      
      const newMinAge = currentMinAge;
      const newMaxAge = positionToAge(newPosition);
      
      updateAgeRange(newMinAge, newMaxAge);
    },
    onPanResponderRelease: () => {
      setIsDraggingMax(false);
    },
  });

  // Update positions when props change
  React.useEffect(() => {
    const newMinPos = ageToPosition(minAge);
    const newMaxPos = ageToPosition(maxAge);
    
    Animated.timing(minPosition, {
      toValue: newMinPos,
      duration: 200,
      useNativeDriver: false,
    }).start();
    
    Animated.timing(maxPosition, {
      toValue: newMaxPos,
      duration: 200,
      useNativeDriver: false,
    }).start();
    
    setCurrentMinAge(minAge);
    setCurrentMaxAge(maxAge);
  }, [minAge, maxAge, ageToPosition]);

  // Calculate active track style
  const activeTrackStyle = {
    left: ageToPosition(currentMinAge) + THUMB_SIZE / 2,
    width: ageToPosition(currentMaxAge) - ageToPosition(currentMinAge),
  };

  return (
    <View style={styles.container}>
      <View style={styles.sliderContainer}>
        {/* Age labels */}
        <View style={styles.labelsContainer}>
          <View style={[styles.labelContainer, isDraggingMin && styles.labelContainerActive]}>
            <Text style={styles.ageLabel}>{currentMinAge}</Text>
            <Text style={styles.ageLabelSubtext}>anos</Text>
          </View>
          <View style={[styles.labelContainer, isDraggingMax && styles.labelContainerActive]}>
            <Text style={styles.ageLabel}>{currentMaxAge}</Text>
            <Text style={styles.ageLabelSubtext}>anos</Text>
          </View>
        </View>

        {/* Slider track */}
        <View style={styles.trackContainer}>
          {/* Background track */}
          <View style={styles.track} />
          
          {/* Active track (between thumbs) */}
          <View style={[styles.activeTrack, activeTrackStyle]} />
          
          {/* Minimum thumb */}
          <Animated.View
            style={[
              styles.thumb,
              styles.minThumb,
              {
                transform: [{ translateX: minPosition }],
              },
              isDraggingMin && styles.thumbActive,
            ]}
            {...minPanResponder.panHandlers}
          >
            <View style={styles.thumbInner} />
          </Animated.View>
          
          {/* Maximum thumb */}
          <Animated.View
            style={[
              styles.thumb,
              styles.maxThumb,
              {
                transform: [{ translateX: maxPosition }],
              },
              isDraggingMax && styles.thumbActive,
            ]}
            {...maxPanResponder.panHandlers}
          >
            <View style={styles.thumbInner} />
          </Animated.View>
        </View>

        {/* Range display */}
        <View style={styles.rangeDisplay}>
          <Text style={styles.rangeText}>
            Faixa etária: {currentMinAge} - {currentMaxAge} anos
          </Text>
        </View>

        {/* Age markers */}
        <View style={styles.markersContainer}>
          <Text style={styles.marker}>{absoluteMin}</Text>
          <Text style={styles.marker}>{Math.round((absoluteMin + absoluteMax) / 2)}</Text>
          <Text style={styles.marker}>{absoluteMax}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  sliderContainer: {
    paddingHorizontal: SLIDER_PADDING,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: THUMB_SIZE / 2,
  },
  labelContainer: {
    alignItems: 'center',
    backgroundColor: '#FF4458',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 50,
    shadowColor: '#FF4458',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  labelContainerActive: {
    backgroundColor: '#FF8A00',
    transform: [{ scale: 1.05 }],
  },
  ageLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  ageLabelSubtext: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  trackContainer: {
    height: THUMB_SIZE,
    justifyContent: 'center',
    marginBottom: 20,
  },
  track: {
    height: TRACK_HEIGHT,
    backgroundColor: '#E5E7EB',
    borderRadius: TRACK_HEIGHT / 2,
    width: SLIDER_WIDTH,
    marginLeft: THUMB_SIZE / 2,
  },
  activeTrack: {
    position: 'absolute',
    height: TRACK_HEIGHT,
    backgroundColor: '#FF4458',
    borderRadius: TRACK_HEIGHT / 2,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 3,
    borderColor: '#FF4458',
  },
  thumbActive: {
    borderColor: '#FF8A00',
    transform: [{ scale: 1.1 }],
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  minThumb: {
    top: (THUMB_SIZE - TRACK_HEIGHT) / 2 - THUMB_SIZE / 2,
  },
  maxThumb: {
    top: (THUMB_SIZE - TRACK_HEIGHT) / 2 - THUMB_SIZE / 2,
  },
  thumbInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF4458',
  },
  rangeDisplay: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 16,
  },
  rangeText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    textAlign: 'center',
  },
  markersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: THUMB_SIZE / 2,
  },
  marker: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
});