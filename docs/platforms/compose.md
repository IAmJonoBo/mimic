# Compose Multiplatform Integration Guide

This document covers advanced Compose Multiplatform integration including theme injection, iOS/Wasm platform quirks,
and React Native new architecture considerations.

## Table of Contents

- [Theme System Integration](#theme-system-integration)
- [Platform-Specific Considerations](#platform-specific-considerations)
- [iOS Platform Quirks](#ios-platform-quirks)
- [Wasm Platform Support](#wasm-platform-support)
- [React Native Integration](#react-native-integration)
- [Performance Optimization](#performance-optimization)

## Theme System Integration

### Compose Theme Provider

Create a comprehensive theme system for Compose Multiplatform:

```kotlin
// design-system/src/commonMain/kotlin/com/mimic/design/theme/MimicTheme.kt
package com.mimic.design.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.*
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.unit.Dp

// Import generated tokens
import com.mimic.design.tokens.MimicTokens

data class MimicColors(
    val primary: Color,
    val primaryVariant: Color,
    val secondary: Color,
    val background: Color,
    val surface: Color,
    val error: Color,
    val onPrimary: Color,
    val onSecondary: Color,
    val onBackground: Color,
    val onSurface: Color,
    val onError: Color
)

data class MimicTypography(
    val h1: TextStyle,
    val h2: TextStyle,
    val h3: TextStyle,
    val h4: TextStyle,
    val h5: TextStyle,
    val h6: TextStyle,
    val body1: TextStyle,
    val body2: TextStyle,
    val button: TextStyle,
    val caption: TextStyle,
    val overline: TextStyle
)

data class MimicSpacing(
    val xxs: Dp,
    val xs: Dp,
    val sm: Dp,
    val md: Dp,
    val lg: Dp,
    val xl: Dp,
    val xxl: Dp
)

object MimicTheme {
    val colors: MimicColors
        @Composable
        @ReadOnlyComposable
        get() = LocalMimicColors.current

    val typography: MimicTypography
        @Composable
        @ReadOnlyComposable
        get() = LocalMimicTypography.current

    val spacing: MimicSpacing
        @Composable
        @ReadOnlyComposable
        get() = LocalMimicSpacing.current
}

// Local composition providers
internal val LocalMimicColors = staticCompositionLocalOf<MimicColors> {
    error("No MimicColors provided")
}

internal val LocalMimicTypography = staticCompositionLocalOf<MimicTypography> {
    error("No MimicTypography provided")
}

internal val LocalMimicSpacing = staticCompositionLocalOf<MimicSpacing> {
    error("No MimicSpacing provided")
}

@Composable
fun MimicTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    colors: MimicColors = if (darkTheme) darkMimicColors() else lightMimicColors(),
    typography: MimicTypography = mimicTypography(),
    spacing: MimicSpacing = mimicSpacing(),
    content: @Composable () -> Unit
) {
    CompositionLocalProvider(
        LocalMimicColors provides colors,
        LocalMimicTypography provides typography,
        LocalMimicSpacing provides spacing
    ) {
        MaterialTheme(
            colorScheme = colors.toMaterial3ColorScheme(),
            typography = typography.toMaterial3Typography(),
            content = content
        )
    }
}

// Token-based theme factories
fun lightMimicColors(): MimicColors = MimicColors(
    primary = Color(MimicTokens.ColorPrimary500),
    primaryVariant = Color(MimicTokens.ColorPrimary700),
    secondary = Color(MimicTokens.ColorSecondary500),
    background = Color(MimicTokens.ColorSurface),
    surface = Color(MimicTokens.ColorSurfaceElevated),
    error = Color(MimicTokens.ColorError500),
    onPrimary = Color(MimicTokens.ColorOnPrimary),
    onSecondary = Color(MimicTokens.ColorOnSecondary),
    onBackground = Color(MimicTokens.ColorOnSurface),
    onSurface = Color(MimicTokens.ColorOnSurface),
    onError = Color(MimicTokens.ColorOnError)
)

fun darkMimicColors(): MimicColors = MimicColors(
    primary = Color(MimicTokens.ColorPrimary400),
    primaryVariant = Color(MimicTokens.ColorPrimary600),
    secondary = Color(MimicTokens.ColorSecondary400),
    background = Color(MimicTokens.ColorSurfaceDark),
    surface = Color(MimicTokens.ColorSurfaceElevatedDark),
    error = Color(MimicTokens.ColorError400),
    onPrimary = Color(MimicTokens.ColorOnPrimaryDark),
    onSecondary = Color(MimicTokens.ColorOnSecondaryDark),
    onBackground = Color(MimicTokens.ColorOnSurfaceDark),
    onSurface = Color(MimicTokens.ColorOnSurfaceDark),
    onError = Color(MimicTokens.ColorOnErrorDark)
)

fun mimicTypography(): MimicTypography = MimicTypography(
    h1 = MimicTokens.TypographyH1,
    h2 = MimicTokens.TypographyH2,
    h3 = MimicTokens.TypographyH3,
    h4 = MimicTokens.TypographyH4,
    h5 = MimicTokens.TypographyH5,
    h6 = MimicTokens.TypographyH6,
    body1 = MimicTokens.TypographyBody1,
    body2 = MimicTokens.TypographyBody2,
    button = MimicTokens.TypographyButton,
    caption = MimicTokens.TypographyCaption,
    overline = MimicTokens.TypographyOverline
)

fun mimicSpacing(): MimicSpacing = MimicSpacing(
    xxs = MimicTokens.SpacingXxs,
    xs = MimicTokens.SpacingXs,
    sm = MimicTokens.SpacingSm,
    md = MimicTokens.SpacingMd,
    lg = MimicTokens.SpacingLg,
    xl = MimicTokens.SpacingXl,
    xxl = MimicTokens.SpacingXxl
)
```

### Dynamic Theme Updates

Handle dynamic theme changes across platforms:

```kotlin
// design-system/src/commonMain/kotlin/com/mimic/design/theme/ThemeController.kt
package com.mimic.design.theme

import androidx.compose.runtime.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow

enum class ThemeMode {
    LIGHT,
    DARK,
    SYSTEM
}

class ThemeController {
    private val _themeMode = MutableStateFlow(ThemeMode.SYSTEM)
    val themeMode: StateFlow<ThemeMode> = _themeMode

    private val _customColors = MutableStateFlow<MimicColors?>(null)
    val customColors: StateFlow<MimicColors?> = _customColors

    fun setThemeMode(mode: ThemeMode) {
        _themeMode.value = mode
        // Persist theme preference
        saveThemePreference(mode)
    }

    fun setCustomColors(colors: MimicColors) {
        _customColors.value = colors
    }

    fun resetCustomColors() {
        _customColors.value = null
    }

    private fun saveThemePreference(mode: ThemeMode) {
        // Platform-specific implementation
        when (Platform.current) {
            is Platform.Android -> saveAndroidThemePreference(mode)
            is Platform.IOS -> saveIOSThemePreference(mode)
            is Platform.Wasm -> saveWebThemePreference(mode)
            is Platform.Desktop -> saveDesktopThemePreference(mode)
        }
    }
}

@Composable
fun rememberThemeController(): ThemeController {
    return remember { ThemeController() }
}

@Composable
fun DynamicMimicTheme(
    themeController: ThemeController = rememberThemeController(),
    content: @Composable () -> Unit
) {
    val themeMode by themeController.themeMode.collectAsState()
    val customColors by themeController.customColors.collectAsState()

    val isDarkTheme = when (themeMode) {
        ThemeMode.LIGHT -> false
        ThemeMode.DARK -> true
        ThemeMode.SYSTEM -> isSystemInDarkTheme()
    }

    val colors = customColors ?: if (isDarkTheme) darkMimicColors() else lightMimicColors()

    MimicTheme(
        darkTheme = isDarkTheme,
        colors = colors,
        content = content
    )
}
```

## Platform-Specific Considerations

### Platform Detection and Adaptation

```kotlin
// shared/src/commonMain/kotlin/com/mimic/shared/Platform.kt
package com.mimic.shared

expect object Platform {
    val name: String
    val version: String
    val current: PlatformType
}

sealed class PlatformType {
    object Android : PlatformType()
    object IOS : PlatformType()
    object Wasm : PlatformType()
    object Desktop : PlatformType()
}

// Platform-specific implementations
// shared/src/androidMain/kotlin/com/mimic/shared/Platform.android.kt
actual object Platform {
    actual val name = "Android"
    actual val version = android.os.Build.VERSION.RELEASE
    actual val current = PlatformType.Android
}

// shared/src/iosMain/kotlin/com/mimic/shared/Platform.ios.kt
import platform.UIKit.UIDevice

actual object Platform {
    actual val name = "iOS"
    actual val version = UIDevice.currentDevice.systemVersion
    actual val current = PlatformType.IOS
}

// shared/src/wasmJsMain/kotlin/com/mimic/shared/Platform.wasm.kt
actual object Platform {
    actual val name = "Wasm"
    actual val version = js("navigator.userAgent") as String
    actual val current = PlatformType.Wasm
}
```

### Responsive Design System

```kotlin
// design-system/src/commonMain/kotlin/com/mimic/design/responsive/Breakpoints.kt
package com.mimic.design.responsive

import androidx.compose.runtime.Composable
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

object Breakpoints {
    val xs = 0.dp
    val sm = 576.dp
    val md = 768.dp
    val lg = 992.dp
    val xl = 1200.dp
    val xxl = 1400.dp
}

enum class ScreenSize {
    XS, SM, MD, LG, XL, XXL
}

@Composable
fun rememberScreenSize(): ScreenSize {
    val density = LocalDensity.current
    val screenWidth = with(density) {
        // Platform-specific screen width calculation
        getScreenWidth()
    }

    return when {
        screenWidth < Breakpoints.sm -> ScreenSize.XS
        screenWidth < Breakpoints.md -> ScreenSize.SM
        screenWidth < Breakpoints.lg -> ScreenSize.MD
        screenWidth < Breakpoints.xl -> ScreenSize.LG
        screenWidth < Breakpoints.xxl -> ScreenSize.XL
        else -> ScreenSize.XXL
    }
}

@Composable
expect fun getScreenWidth(): Dp

// Responsive modifier
@Composable
fun Modifier.responsive(
    xs: Modifier = Modifier,
    sm: Modifier = Modifier,
    md: Modifier = Modifier,
    lg: Modifier = Modifier,
    xl: Modifier = Modifier,
    xxl: Modifier = Modifier
): Modifier {
    val screenSize = rememberScreenSize()

    return when (screenSize) {
        ScreenSize.XS -> this.then(xs)
        ScreenSize.SM -> this.then(sm)
        ScreenSize.MD -> this.then(md)
        ScreenSize.LG -> this.then(lg)
        ScreenSize.XL -> this.then(xl)
        ScreenSize.XXL -> this.then(xxl)
    }
}
```

## iOS Platform Quirks

### Safe Area Handling

```kotlin
// design-system/src/iosMain/kotlin/com/mimic/design/platform/SafeArea.ios.kt
package com.mimic.design.platform

import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.runtime.Composable
import androidx.compose.ui.unit.dp
import platform.UIKit.*

@Composable
actual fun rememberSafeAreaInsets(): PaddingValues {
    val safeAreaInsets = UIApplication.sharedApplication.keyWindow?.safeAreaInsets

    return PaddingValues(
        top = (safeAreaInsets?.top?.toFloat() ?: 0f).dp,
        bottom = (safeAreaInsets?.bottom?.toFloat() ?: 0f).dp,
        start = (safeAreaInsets?.left?.toFloat() ?: 0f).dp,
        end = (safeAreaInsets?.right?.toFloat() ?: 0f).dp
    )
}

@Composable
fun SafeAreaLayout(
    content: @Composable (PaddingValues) -> Unit
) {
    val safeAreaInsets = rememberSafeAreaInsets()
    content(safeAreaInsets)
}
```

### iOS-Specific Theme Adaptations

```kotlin
// design-system/src/iosMain/kotlin/com/mimic/design/theme/IOSTheme.ios.kt
package com.mimic.design.theme

import androidx.compose.runtime.Composable
import platform.UIKit.*

@Composable
fun IOSAdaptiveMimicTheme(
    content: @Composable () -> Unit
) {
    // Detect iOS dynamic type settings
    val preferredContentSizeCategory = UIApplication.sharedApplication
        .preferredContentSizeCategory

    // Adapt typography based on iOS accessibility settings
    val adaptedTypography = mimicTypography().adaptForAccessibility(
        contentSizeCategory = preferredContentSizeCategory
    )

    // Detect iOS appearance mode
    val isDarkMode = UITraitCollection.currentTraitCollection
        .userInterfaceStyle == UIUserInterfaceStyleDark

    MimicTheme(
        darkTheme = isDarkMode,
        typography = adaptedTypography,
        content = content
    )
}

fun MimicTypography.adaptForAccessibility(
    contentSizeCategory: UIContentSizeCategory
): MimicTypography {
    val scaleFactor = when (contentSizeCategory) {
        UIContentSizeCategoryExtraSmall -> 0.8f
        UIContentSizeCategorySmall -> 0.9f
        UIContentSizeCategoryMedium -> 1.0f
        UIContentSizeCategoryLarge -> 1.1f
        UIContentSizeCategoryExtraLarge -> 1.2f
        UIContentSizeCategoryExtraExtraLarge -> 1.3f
        UIContentSizeCategoryExtraExtraExtraLarge -> 1.4f
        UIContentSizeCategoryAccessibilityMedium -> 1.6f
        UIContentSizeCategoryAccessibilityLarge -> 1.8f
        UIContentSizeCategoryAccessibilityExtraLarge -> 2.0f
        UIContentSizeCategoryAccessibilityExtraExtraLarge -> 2.2f
        UIContentSizeCategoryAccessibilityExtraExtraExtraLarge -> 2.4f
        else -> 1.0f
    }

    return copy(
        h1 = h1.copy(fontSize = h1.fontSize * scaleFactor),
        h2 = h2.copy(fontSize = h2.fontSize * scaleFactor),
        h3 = h3.copy(fontSize = h3.fontSize * scaleFactor),
        h4 = h4.copy(fontSize = h4.fontSize * scaleFactor),
        h5 = h5.copy(fontSize = h5.fontSize * scaleFactor),
        h6 = h6.copy(fontSize = h6.fontSize * scaleFactor),
        body1 = body1.copy(fontSize = body1.fontSize * scaleFactor),
        body2 = body2.copy(fontSize = body2.fontSize * scaleFactor),
        button = button.copy(fontSize = button.fontSize * scaleFactor),
        caption = caption.copy(fontSize = caption.fontSize * scaleFactor),
        overline = overline.copy(fontSize = overline.fontSize * scaleFactor)
    )
}
```

### iOS Navigation Integration

```kotlin
// design-system/src/iosMain/kotlin/com/mimic/design/navigation/IOSNavigation.ios.kt
package com.mimic.design.navigation

import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.runtime.Composable
import androidx.compose.ui.unit.dp
import platform.UIKit.*

@Composable
fun IOSNavigationTheme(
    tintColor: UIColor? = null,
    barTintColor: UIColor? = null,
    content: @Composable () -> Unit
) {
    // Configure iOS navigation bar appearance
    val appearance = UINavigationBarAppearance().apply {
        configureWithOpaqueBackground()

        tintColor?.let {
            this.setTitleTextAttributes(mapOf(
                NSForegroundColorAttributeName to it
            ))
        }

        barTintColor?.let {
            this.backgroundColor = it
        }
    }

    UINavigationBar.appearance().apply {
        standardAppearance = appearance
        compactAppearance = appearance
        scrollEdgeAppearance = appearance
    }

    content()
}
```

## Wasm Platform Support

### Browser API Integration

```kotlin
// shared/src/wasmJsMain/kotlin/com/mimic/shared/Browser.wasm.kt
package com.mimic.shared

import kotlinx.browser.document
import kotlinx.browser.window
import org.w3c.dom.events.Event

object BrowserAPI {
    fun setThemePreference(isDark: Boolean) {
        document.documentElement?.setAttribute("data-theme", if (isDark) "dark" else "light")
        window.localStorage.setItem("theme", if (isDark) "dark" else "light")
    }

    fun getSystemThemePreference(): Boolean {
        return window.matchMedia("(prefers-color-scheme: dark)").matches
    }

    fun observeSystemThemeChanges(callback: (Boolean) -> Unit) {
        val mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
        mediaQuery.addEventListener("change") { event ->
            callback(mediaQuery.matches)
        }
    }

    fun getViewportSize(): Pair<Int, Int> {
        return Pair(
            window.innerWidth,
            window.innerHeight
        )
    }

    fun observeViewportChanges(callback: (Int, Int) -> Unit) {
        window.addEventListener("resize") {
            val (width, height) = getViewportSize()
            callback(width, height)
        }
    }
}
```

### Wasm-Specific Theme Implementation

```kotlin
// design-system/src/wasmJsMain/kotlin/com/mimic/design/theme/WasmTheme.wasm.kt
package com.mimic.design.theme

import androidx.compose.runtime.*
import com.mimic.shared.BrowserAPI

@Composable
fun WasmAdaptiveMimicTheme(
    content: @Composable () -> Unit
) {
    var isDarkTheme by remember { mutableStateOf(BrowserAPI.getSystemThemePreference()) }

    // Listen for system theme changes
    LaunchedEffect(Unit) {
        BrowserAPI.observeSystemThemeChanges { isDark ->
            isDarkTheme = isDark
        }
    }

    // Update document theme attribute
    LaunchedEffect(isDarkTheme) {
        BrowserAPI.setThemePreference(isDarkTheme)
    }

    MimicTheme(
        darkTheme = isDarkTheme,
        content = content
    )
}

@Composable
actual fun getScreenWidth(): Dp {
    var screenWidth by remember { mutableStateOf(BrowserAPI.getViewportSize().first) }

    LaunchedEffect(Unit) {
        BrowserAPI.observeViewportChanges { width, _ ->
            screenWidth = width
        }
    }

    return screenWidth.dp
}
```

## React Native Integration

### New Architecture Support

```typescript
// react-native/src/design-system/ThemeProvider.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance, useColorScheme } from 'react-native';
import { tokens } from '@mimic/design-tokens/dist/mobile/tokens.json';

interface ThemeContextType {
  theme: 'light' | 'dark';
  tokens: typeof tokens;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [userTheme, setUserTheme] = useState<'light' | 'dark' | 'system'>('system');

  const theme = userTheme === 'system' ? systemColorScheme || 'light' : userTheme;

  // Listen for system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (userTheme === 'system') {
        // Theme will update automatically via useColorScheme
      }
    });

    return () => subscription?.remove();
  }, [userTheme]);

  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setUserTheme(newTheme);
    // Persist theme preference
    // AsyncStorage.setItem('theme', newTheme);
  };

  const contextValue: ThemeContextType = {
    theme,
    tokens,
    setTheme
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
```

### Fabric Renderer Integration

```typescript
// react-native/src/components/FabricButton.tsx
import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../design-system/ThemeProvider';

interface ButtonProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onPress?: () => void;
}

export const FabricButton: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onPress
}) => {
  const { theme, tokens } = useTheme();

  const buttonStyles = StyleSheet.create({
    container: {
      borderRadius: tokens.border.radius.medium,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: tokens.spacing[size],
      paddingVertical: tokens.spacing.small,
      minHeight: tokens.component.button.height[size],
      opacity: disabled ? 0.6 : 1,
      ...getVariantStyles(variant, theme, tokens)
    } as ViewStyle,

    text: {
      fontSize: tokens.typography.button.fontSize,
      fontWeight: tokens.typography.button.fontWeight,
      fontFamily: tokens.typography.button.fontFamily,
      ...getTextVariantStyles(variant, theme, tokens)
    } as TextStyle
  });

  return (
    <Pressable
      style={({ pressed }) => [
        buttonStyles.container,
        pressed && { opacity: 0.8 }
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      <Text style={buttonStyles.text}>{title}</Text>
    </Pressable>
  );
};

function getVariantStyles(variant: string, theme: string, tokens: any): ViewStyle {
  switch (variant) {
    case 'primary':
      return {
        backgroundColor: tokens.color[theme].primary[500],
        borderWidth: 0
      };
    case 'secondary':
      return {
        backgroundColor: tokens.color[theme].secondary[500],
        borderWidth: 0
      };
    case 'outline':
      return {
        backgroundColor: 'transparent',
        borderWidth: tokens.border.width.medium,
        borderColor: tokens.color[theme].primary[500]
      };
    default:
      return {};
  }
}

function getTextVariantStyles(variant: string, theme: string, tokens: any): TextStyle {
  switch (variant) {
    case 'primary':
    case 'secondary':
      return {
        color: tokens.color[theme].onPrimary
      };
    case 'outline':
      return {
        color: tokens.color[theme].primary[500]
      };
    default:
      return {};
  }
}
```

### New Architecture TurboModules

```typescript
// react-native/src/modules/DesignTokensModule.ts
import { TurboModule, TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  getTokens(): Promise<string>;
  updateTokens(tokens: string): Promise<void>;
  getCurrentTheme(): Promise<string>;
  setTheme(theme: string): Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('DesignTokensModule');
```

## Performance Optimization

### Theme Caching

```kotlin
// design-system/src/commonMain/kotlin/com/mimic/design/cache/ThemeCache.kt
package com.mimic.design.cache

import androidx.compose.runtime.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlin.collections.mutableMapOf

object ThemeCache {
    private val colorCache = mutableMapOf<String, MimicColors>()
    private val typographyCache = mutableMapOf<String, MimicTypography>()

    fun getCachedColors(key: String): MimicColors? = colorCache[key]

    fun setCachedColors(key: String, colors: MimicColors) {
        colorCache[key] = colors
    }

    fun getCachedTypography(key: String): MimicTypography? = typographyCache[key]

    fun setCachedTypography(key: String, typography: MimicTypography) {
        typographyCache[key] = typography
    }

    fun clearCache() {
        colorCache.clear()
        typographyCache.clear()
    }
}

@Composable
fun cachedMimicColors(
    isDark: Boolean,
    customizations: Map<String, Any> = emptyMap()
): MimicColors {
    val cacheKey = "colors_${isDark}_${customizations.hashCode()}"

    return remember(cacheKey) {
        ThemeCache.getCachedColors(cacheKey) ?: run {
            val colors = if (isDark) darkMimicColors() else lightMimicColors()
            val customizedColors = applyCustomizations(colors, customizations)
            ThemeCache.setCachedColors(cacheKey, customizedColors)
            customizedColors
        }
    }
}
```

### Memory Management

```kotlin
// design-system/src/commonMain/kotlin/com/mimic/design/memory/MemoryManager.kt
package com.mimic.design.memory

import androidx.compose.runtime.*

class MemoryEfficientTheme {
    private val disposables = mutableListOf<DisposableEffect>()

    @Composable
    fun ProvideTheme(
        content: @Composable () -> Unit
    ) {
        // Track memory usage
        val memoryTracker = remember { MemoryTracker() }

        DisposableEffect(Unit) {
            memoryTracker.start()
            onDispose {
                memoryTracker.stop()
                clearCaches()
            }
        }

        content()
    }

    private fun clearCaches() {
        ThemeCache.clearCache()
        // Clear other caches
    }
}

class MemoryTracker {
    fun start() {
        // Platform-specific memory tracking
    }

    fun stop() {
        // Cleanup and report
    }
}
```

## Testing Strategies

### Platform-Specific Testing

```kotlin
// design-system/src/commonTest/kotlin/com/mimic/design/theme/ThemeTest.kt
package com.mimic.design.theme

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotNull

class ThemeTest {
    @Test
    fun testLightThemeColors() {
        val lightColors = lightMimicColors()

        assertNotNull(lightColors.primary)
        assertNotNull(lightColors.background)
        assertNotNull(lightColors.surface)
    }

    @Test
    fun testDarkThemeColors() {
        val darkColors = darkMimicColors()

        assertNotNull(darkColors.primary)
        assertNotNull(darkColors.background)
        assertNotNull(darkColors.surface)
    }

    @Test
    fun testThemeTokenConsistency() {
        val lightColors = lightMimicColors()
        val darkColors = darkMimicColors()

        // Ensure both themes have same structure
        assertEquals(lightColors::class, darkColors::class)
    }
}

// Platform-specific tests
// design-system/src/iosTest/kotlin/com/mimic/design/theme/IOSThemeTest.kt
class IOSThemeTest {
    @Test
    fun testSafeAreaInsets() {
        // Test iOS-specific safe area handling
    }

    @Test
    fun testDynamicTypeSupport() {
        // Test iOS Dynamic Type integration
    }
}
```

## Next Steps

- [Tauri Desktop Integration](./tauri.md)
- [CI/CD Platform Testing](../cicd/platform-testing.md)
- [Performance Monitoring](../quality/performance.md)
- [Cross-Platform Design Patterns](../design/cross-platform.md)

---

_This documentation is updated with each Compose Multiplatform release and covers the latest platform-specific
features._
