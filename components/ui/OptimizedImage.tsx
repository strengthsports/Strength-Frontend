import React, { useState, useRef, useCallback, useEffect, memo } from 'react';
import {
  Image,
  View,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Animated,
  InteractionManager,
} from 'react-native';

const DEFAULT_PLACEHOLDER_COLOR = '#EAEAEA';
const DEFAULT_FADE_DURATION = 300;
const IMAGE_TIMEOUT = 15000; // 15 seconds timeout for image loading

/**
 * A performant and optimized image component built on top of React Native's Image
 * with features like progressive loading, caching, timeout handling, and fade-in effects.
 */
const OptimizedImage = memo(({
  source,
  style,
  resizeMode = 'cover',
  placeholderColor = DEFAULT_PLACEHOLDER_COLOR,
  fadeDuration = DEFAULT_FADE_DURATION,
  onLoad,
  onError,
  onLoadStart,
  onLoadEnd,
  placeholderContent,
  priority = 'normal',
  loadingIndicatorSize = 'small',
  loadingIndicatorColor = '#999',
  blurRadius = 0,
  tintColor,
  progressiveRenderingEnabled = true,
  defaultSource,
  ...props
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef(null);
  const isMounted = useRef(true);

  // Extract dimensions from style
  const flattenedStyle = StyleSheet.flatten(style) || {};
  const { width: styleWidth, height: styleHeight } = flattenedStyle;
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Set timeout for image loading
  useEffect(() => {
    if (loading) {
      timeoutRef.current = setTimeout(() => {
        if (isMounted.current) {
          setError(true);
          setLoading(false);
        }
      }, IMAGE_TIMEOUT);
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [loading]);

  // Handle image successful load
  const handleLoad = useCallback((event) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // If we need original image dimensions for aspect ratio calculations
    if (event.nativeEvent?.source) {
      setImageSize({
        width: event.nativeEvent.source.width,
        height: event.nativeEvent.source.height,
      });
    }
    
    // Use InteractionManager to ensure UI thread isn't blocked
    InteractionManager.runAfterInteractions(() => {
      if (isMounted.current) {
        setLoading(false);
        
        // Animate the fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: fadeDuration,
          useNativeDriver: true,
        }).start();
        
        // Call original onLoad if provided
        if (onLoad) {
          onLoad(event);
        }
      }
    });
  }, [fadeAnim, fadeDuration, onLoad]);

  // Handle image loading errors
  const handleError = useCallback((event) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (isMounted.current) {
      setError(true);
      setLoading(false);
      
      if (onError) {
        onError(event);
      }
    }
  }, [onError]);

  // Handle loading start
  const handleLoadStart = useCallback(() => {
    if (isMounted.current) {
      setLoading(true);
      setError(false);
      fadeAnim.setValue(0);
      
      if (onLoadStart) {
        onLoadStart();
      }
    }
  }, [fadeAnim, onLoadStart]);

  // Handle loading end
  const handleLoadEnd = useCallback(() => {
    if (isMounted.current && onLoadEnd) {
      onLoadEnd();
    }
  }, [onLoadEnd]);

  // Calculate aspect ratio if needed
  const getImageStyle = () => {
    const imageStyles = [
      styles.image,
      { opacity: fadeAnim },
      style,
    ];

    // If we have image dimensions but no style dimensions,
    // calculate aspect ratio to maintain proportion
    if (imageSize.width > 0 && imageSize.height > 0) {
      if (!styleWidth && styleHeight) {
        const aspectRatio = imageSize.width / imageSize.height;
        imageStyles.push({ width: styleHeight * aspectRatio });
      } else if (styleWidth && !styleHeight) {
        const aspectRatio = imageSize.height / imageSize.width;
        imageStyles.push({ height: styleWidth * aspectRatio });
      }
    }

    return imageStyles;
  };

  // Determine if source is a remote URI or local require
  const isRemoteImage = typeof source === 'object' && source?.uri && source.uri.startsWith('http');

  // Create optimized source object with cache control
  const optimizedSource = React.useMemo(() => {
    if (!source) return null;
    
    if (isRemoteImage) {
      return {
        ...source,
        headers: {
          ...source.headers,
          // Add cache control to prevent redownloading the same image
          'Cache-Control': 'max-age=31536000', // Cache for a year
        },
        // Enable progress download on Android
        progressiveRenderingEnabled: Platform.OS === 'android' ? progressiveRenderingEnabled : undefined,
        // Add timestamp for cache busting if needed
        // uri: source.uri + (source.uri.includes('?') ? '&' : '?') + 'cache=' + Date.now(),
      };
    }
    
    return source;
  }, [source, isRemoteImage, progressiveRenderingEnabled]);

  // Prepare platform-specific props
  const platformProps = Platform.select({
    android: {
      fadeDuration: fadeDuration, // Android specific
    },
    ios: {
      // iOS specific props
    },
    default: {},
  });

  return (
    <View style={[styles.container, style]}>
      {/* Placeholder */}
      {loading && (
        <View 
          style={[
            styles.placeholder, 
            { backgroundColor: placeholderColor },
            StyleSheet.absoluteFill
          ]}
        >
          {placeholderContent || (
            <ActivityIndicator 
              size={loadingIndicatorSize}
              color={loadingIndicatorColor}
            />
          )}
        </View>
      )}
      
      {/* Error state */}
      {error && !loading && (
        <View style={[styles.errorContainer, StyleSheet.absoluteFill]}>
          {defaultSource ? (
            <Image 
              source={defaultSource}
              style={styles.errorImage}
              resizeMode={resizeMode}
            />
          ) : (
            <View style={[styles.errorPlaceholder, { backgroundColor: '#FFE5E5' }]} />
          )}
        </View>
      )}
      
      {/* Actual Image */}
      {!error && (
        <Animated.Image
          source={optimizedSource}
          style={getImageStyle()}
          resizeMode={resizeMode}
          onLoad={handleLoad}
          onError={handleError}
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
          blurRadius={blurRadius}
          tintColor={tintColor}
          // For image priorities - impacts how the native side queues them
          // Added in React Native 0.65
          {...(priority === 'high' ? { loading: 'eager' } : { loading: 'lazy' })}
          // Platform specific props
          {...platformProps}
          {...props}
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorImage: {
    width: '100%',
    height: '100%',
  },
  errorPlaceholder: {
    width: '100%',
    height: '100%',
  },
});

export default OptimizedImage;