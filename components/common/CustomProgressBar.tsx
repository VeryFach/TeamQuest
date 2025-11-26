// components/common/CustomProgressBar.tsx
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';

interface CustomProgressBarProps {
  // Progress data
  completed?: number;
  total?: number;
  
  // Content customization
  title?: string;
  subtitle?: string;
  
  // Visual customization
  backgroundColor?: string;
  progressColor?: string;
  textColor?: string;
  titleColor?: string;
  subtitleColor?: string;
  
  // Image customization
  imageSource?: any;
  imageAlt?: string;
  imagePosition?: 'top' | 'left' | 'right' | 'bottom';
  
  // Style variants
  variant?: 'default' | 'minimal' | 'detailed';
  
  // Additional styling
  style?: any;
  showPercentage?: boolean;
  showIndicators?: boolean;
  
  // Sizes
  height?: number;
  borderRadius?: number;
}

const CustomProgressBar: React.FC<CustomProgressBarProps> = ({
  // Progress defaults
  completed = 5,
  total = 8,
  
  // Content defaults
  title = "Pizza Party!",
  subtitle = "Tasks",
  
  // Color defaults
  backgroundColor = "#FFFFFF",
  progressColor = "#F59E0B", // amber-400
  textColor = "#92400E", // amber-800
  titleColor = "#1F2937", // gray-800
  subtitleColor = "#4B5563", // gray-600
  
  // Image defaults
  imageSource,
  imageAlt = "Progress illustration",
  imagePosition = "top",
  
  // Style defaults
  variant = "default",
  style = {},
  showPercentage = false,
  showIndicators = true,
  
  // Size defaults
  height = 32,
  borderRadius = 16,
}) => {
  const progressPercentage = Math.min((completed / total) * 100, 100);
  const { width: screenWidth } = Dimensions.get('window');

  const styles = StyleSheet.create({
    container: {
      backgroundColor,
      borderRadius: 12,
      padding: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderWidth: 1,
      borderColor: '#F3F4F6',
    },
    rowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    columnContainer: {
      flexDirection: 'column',
    },
    image: {
      width: 64,
      height: 64,
      resizeMode: 'contain',
    },
    imageTop: {
      marginBottom: 16,
      alignSelf: 'center',
    },
    imageLeft: {
      marginRight: 16,
    },
    imageRight: {
      marginLeft: 16,
    },
    imageBottom: {
      marginTop: 16,
      alignSelf: 'center',
    },
    content: {
      flex: 1,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 16,
      textAlign: 'center',
      color: titleColor,
    },
    progressContainer: {
      width: '100%',
      marginBottom: 12,
    },
    progressBackground: {
      width: '100%',
      height,
      backgroundColor: '#E5E7EB',
      borderRadius: borderRadius,
      overflow: 'hidden',
      borderWidth: variant === 'detailed' ? 1 : 0,
      borderColor: '#D1D5DB',
    },
    progressFill: {
      height: '100%',
      borderRadius: borderRadius,
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
      paddingRight: 12,
    },
    progressText: {
      fontSize: 14,
      fontWeight: '600',
      color: textColor,
    },
    subtitle: {
      fontSize: 16,
      fontWeight: '500',
      textAlign: 'center',
      color: subtitleColor,
    },
    indicatorsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      width: '100%',
      marginTop: 16,
      gap: 4,
    },
    indicator: {
      flex: 1,
      height: 4,
      borderRadius: 2,
    },
    shineOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '33%',
      height: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
  });

  const renderProgressBar = () => (
    <View style={styles.content}>
      {/* Title */}
      {title && (
        <Text style={styles.title}>{title}</Text>
      )}

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View 
            style={[
              styles.progressFill,
              { 
                width: `${progressPercentage}%`,
                backgroundColor: progressColor,
              }
            ]}
          >
            {/* Shine effect for detailed variant */}
            {variant === 'detailed' && (
              <View style={styles.shineOverlay} />
            )}
            
            {/* Progress Text */}
            <Text style={styles.progressText}>
              {completed}/{total}
              {showPercentage && ` (${Math.round(progressPercentage)}%)`}
            </Text>
          </View>
        </View>
      </View>

      {/* Subtitle */}
      {subtitle && (
        <Text style={styles.subtitle}>{subtitle}</Text>
      )}

      {/* Progress Indicators */}
      {showIndicators && variant !== 'minimal' && (
        <View style={styles.indicatorsContainer}>
          {Array.from({ length: total }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                { 
                  backgroundColor: index < completed ? progressColor : '#D1D5DB'
                }
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );

  const renderImage = () => {
    if (!imageSource) return null;

    const imageStyle = [
      styles.image,
      styles[`image${imagePosition.charAt(0).toUpperCase() + imagePosition.slice(1)}` as keyof typeof styles]
    ];

    return (
      <Image
        source={imageSource}
        style={imageStyle as any}
        accessibilityLabel={imageAlt}
      />
    );
  };

  const getContainerStyle = () => {
    const baseStyle = [styles.container, style];
    
    if (imagePosition === 'left' || imagePosition === 'right') {
      return [...baseStyle, styles.rowContainer];
    } else {
      return [...baseStyle, styles.columnContainer];
    }
  };

  const renderContent = () => {
    switch (imagePosition) {
      case 'top':
        return (
          <>
            {renderImage()}
            {renderProgressBar()}
          </>
        );
      case 'left':
        return (
          <>
            {renderImage()}
            {renderProgressBar()}
          </>
        );
      case 'right':
        return (
          <>
            {renderProgressBar()}
            {renderImage()}
          </>
        );
      case 'bottom':
        return (
          <>
            {renderProgressBar()}
            {renderImage()}
          </>
        );
      default:
        return renderProgressBar();
    }
  };

  return (
    <View style={getContainerStyle()}>
      {renderContent()}
    </View>
  );
};

export default CustomProgressBar;

// import CustomProgressBar from '@/components/common/CustomProgressBar';
// import { View } from 'react-native';

// // 1. Default (seperti gambar asli)
// <CustomProgressBar />

// // 2. Custom tema biru
// <CustomProgressBar
//   completed={3}
//   total={10}
//   title="Project Progress"
//   subtitle="Milestones"
//   backgroundColor="#EFF6FF"
//   progressColor="#3B82F6"
//   textColor="#FFFFFF"
//   titleColor="#1E40AF"
//   subtitleColor="#2563EB"
// />

// // 3. Dengan gambar
// <CustomProgressBar
//   completed={7}
//   total={12}
//   title="Learning Journey"
//   subtitle="Courses Completed"
//   imageSource={require('../assets/learning-icon.png')}
//   imagePosition="left"
//   progressColor="#8B5CF6"
//   backgroundColor="#F5F3FF"
// />

// // 4. Minimal version
// <CustomProgressBar
//   variant="minimal"
//   completed={2}
//   total={5}
//   title="Simple Progress"
//   showIndicators={false}
//   style={{ width: 260 }}
// />

// // 5. Detailed dengan persentase
// <CustomProgressBar
//   variant="detailed"
//   completed={15}
//   total={20}
//   title="Fundraising Goal"
//   subtitle="Dollars Raised"
//   showPercentage={true}
//   progressColor="#10B981"
//   backgroundColor="#ECFDF5"
// />

// // 6. Multiple progress bars dalam satu screen
// <View style={{ padding: 16, gap: 16 }}>
//   <CustomProgressBar
//     completed={5}
//     total={8}
//     title="Pizza Party!"
//     subtitle="Tasks"
//   />
  
//   <CustomProgressBar
//     completed={3}
//     total={6}
//     title="Project Tasks"
//     subtitle="Completed"
//     progressColor="#EF4444"
//   />
// </View>