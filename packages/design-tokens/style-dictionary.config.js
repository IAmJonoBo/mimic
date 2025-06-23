import StyleDictionary from 'style-dictionary';

// Register custom transforms
StyleDictionary.registerTransform({
  name: 'size/pxToRem',
  type: 'value',
  filter: token => {
    return (
      token.$type === 'dimension' && token.$value && token.$value.endsWith('px')
    );
  },
  transform: token => {
    const pixelValue = parseFloat(token.$value);
    return `${pixelValue / 16}rem`;
  },
});

StyleDictionary.registerTransform({
  name: 'color/hexToRgb',
  type: 'value',
  filter: token => {
    return (
      token.$type === 'color' && token.$value && token.$value.startsWith('#')
    );
  },
  transform: token => {
    const hex = token.$value.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgb(${r}, ${g}, ${b})`;
  },
});

// Custom transform to properly quote font family values for JS/TS
StyleDictionary.registerTransform({
  name: 'value/font-family-quote',
  type: 'value',
  matcher: token => token.$type === 'fontFamily',
  transform: token => {
    if (Array.isArray(token.$value)) {
      return token.$value.join(', '); // Don't add extra quotes, the format will handle it
    }
    if (typeof token.$value === 'string' && token.$value.includes(',')) {
      return token.$value; // Don't add extra quotes, the format will handle it
    }
    return token.$value;
  },
});

// Custom transform to handle numeric property names
StyleDictionary.registerTransform({
  name: 'name/js-numeric-safe',
  type: 'name',
  transform: token => {
    const name = token.path.slice(1).join('_');
    // If name starts with a number, prefix with underscore
    return /^\d/.test(name) ? `_${name}` : name;
  },
});

// Register custom formats
StyleDictionary.registerFormat({
  name: 'typescript/custom-declarations',
  format: dictionary => {
    const tokens = dictionary.allTokens;

    let output = '// Auto-generated design tokens\n\n';
    output += 'export interface DesignTokens {\n';

    tokens.forEach(token => {
      const path = token.path.join('.');
      let type = 'string';
      if (token.$type === 'fontWeight') {
        type = 'number | string';
      }
      output += `  '${path}': ${type};\n`;
    });

    output += '}\n\n';
    output += 'export const tokens: DesignTokens = {\n';

    tokens.forEach((token, index) => {
      const path = token.path.join('.');
      let value = token.$value;

      // Handle different value types properly
      if (typeof value === 'string') {
        value = `'${value}'`;
      } else if (typeof value === 'object' && value !== null) {
        // Convert objects to JSON string for complex tokens like shadows
        value = `'${JSON.stringify(value)}'`;
      }

      output += `  '${path}': ${value}`;
      if (index < tokens.length - 1) output += ',';
      output += '\n';
    });

    output += '};\n\n';
    output += 'export default tokens;\n';

    return output;
  },
});

StyleDictionary.registerFormat({
  name: 'json/flat',
  format: dictionary => {
    const tokens = dictionary.allTokens.reduce((acc, token) => {
      const path = token.path.join('.');
      acc[path] = token.$value;
      return acc;
    }, {});

    return JSON.stringify(tokens, null, 2);
  },
});

// Dart/Flutter format with namespace
StyleDictionary.registerFormat({
  name: 'dart/theme-dart',
  format: dictionary => {
    let output = '// Auto-generated Dart theme from design tokens\n';
    output += "import 'package:flutter/material.dart';\n\n";
    output += 'class DsTokens {\n'; // Prefixed class name

    // Group tokens by category
    const categories = {};
    dictionary.allTokens.forEach(token => {
      const category = token.path[0];
      if (!categories[category]) categories[category] = [];
      categories[category].push(token);
    });

    Object.entries(categories).forEach(([category, tokens]) => {
      output += `  // ${category.charAt(0).toUpperCase() + category.slice(1)} tokens\n`;
      tokens.forEach(token => {
        const name = token.path.slice(1).join('_');
        let value = token.$value;

        if (token.$type === 'color') {
          // Convert hex to Flutter Color
          const hex = token.$value.replace('#', '');
          value = `Color(0xFF${hex})`;
        } else if (token.$type === 'dimension') {
          // Convert to double for Flutter
          const numValue = parseFloat(token.$value.replace(/[^\d.]/g, ''));
          value = `${numValue}`;
        }

        output += `  static const ${name} = ${value};\n`;
      });
      output += '\n';
    });

    output += '}\n';
    return output;
  },
});

// Compose Multiplatform format with namespace
StyleDictionary.registerFormat({
  name: 'compose/theme-kt',
  format: dictionary => {
    let output = '// Auto-generated Compose theme from design tokens\n';
    output += 'package ds.theme\n\n'; // Use ds.theme namespace per playbook
    output += 'import androidx.compose.ui.graphics.Color\n';
    output += 'import androidx.compose.ui.unit.dp\n';
    output += 'import androidx.compose.ui.unit.sp\n\n';
    output += 'object DsTokens {\n'; // Prefixed object name

    // Group tokens by category
    const categories = {};
    dictionary.allTokens.forEach(token => {
      const category = token.path[0];
      if (!categories[category]) categories[category] = [];
      categories[category].push(token);
    });

    Object.entries(categories).forEach(([category, tokens]) => {
      output += `  object ${category.charAt(0).toUpperCase() + category.slice(1)} {\n`;
      tokens.forEach(token => {
        const name = token.path.slice(1).join('_').toUpperCase();
        let value = token.$value;

        if (token.$type === 'color') {
          value = `Color(0xFF${token.$value.replace('#', '')})`;
        } else if (token.$type === 'dimension') {
          const numericValue = parseFloat(token.$value.replace(/[^\d.]/g, ''));
          value = `${numericValue}.dp`;
        }

        output += `    val ${name} = ${value}\n`;
      });
      output += '  }\n';
    });

    output += '}\n';
    return output;
  },
});

// React Native format with namespace
StyleDictionary.registerFormat({
  name: 'react-native/theme-ts',
  format: dictionary => {
    let output = '// Auto-generated React Native theme from design tokens\n\n';

    const categories = {};
    dictionary.allTokens.forEach(token => {
      const category = token.path[0];
      if (!categories[category]) categories[category] = [];
      categories[category].push(token);
    });

    Object.entries(categories).forEach(([category, tokens]) => {
      output += `export const ${category} = {\n`;
      tokens.forEach(token => {
        let name = token.path.slice(1).join('_');
        // Handle numeric property names
        if (/^\d/.test(name)) {
          name = `_${name}`;
        }
        let value = token.$value;

        if (token.$type === 'dimension') {
          value = parseFloat(token.$value.replace(/[^\d.]/g, ''));
        } else if (token.$type === 'fontFamily') {
          // Handle font family arrays
          if (Array.isArray(token.$value)) {
            value = token.$value.join(', ');
          }
        } else if (typeof value === 'object' && value !== null) {
          // Handle complex objects (like shadow tokens)
          value = JSON.stringify(value);
        }

        const formattedValue = typeof value === 'string' ? `'${value}'` : value;
        output += `  ${name}: ${formattedValue},\n`;
      });
      output += '};\n\n';
    });

    return output;
  },
});

// Custom JavaScript ES6 format with namespace grouping
StyleDictionary.registerFormat({
  name: 'javascript/es6-grouped',
  format: dictionary => {
    let output = '// Auto-generated JavaScript tokens from design tokens\n\n';

    const categories = {};
    dictionary.allTokens.forEach(token => {
      const category = token.path[0];
      if (!categories[category]) categories[category] = [];
      categories[category].push(token);
    });

    Object.entries(categories).forEach(([category, tokens]) => {
      output += `export const ${category} = {\n`;
      tokens.forEach(token => {
        let name = token.path.slice(1).join('_');
        // Handle numeric property names
        if (/^\d/.test(name)) {
          name = `_${name}`;
        }
        let value = token.$value;

        if (token.$type === 'fontFamily') {
          // Handle font family arrays
          if (Array.isArray(token.$value)) {
            value = token.$value.join(', ');
          }
        } else if (typeof value === 'object' && value !== null) {
          // Handle complex objects (like shadow tokens) as JavaScript objects
          value = JSON.stringify(value, null, 0);
        }

        const formattedValue =
          typeof value === 'string' && !value.startsWith('{')
            ? `"${value}"`
            : value;
        const comment = token.comment ? ` // ${token.comment}` : '';
        output += `  ${name}: ${formattedValue},${comment}\n`;
      });
      output += '};\n\n';
    });

    return output;
  },
});

export default {
  // Base configuration - will be merged with platform-specific sources
  source: [
    'tokens/base.json',
    'tokens/semantic.json',
    'tokens/components.json',
  ],
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: 'ds', // Add namespace prefix for collision prevention
      buildPath: 'libs/tokens/css/', // Platform-rooted build path
      // Include web platform overrides for CSS
      source: [
        'tokens/base.json',
        'tokens/semantic.json',
        'tokens/components.json',
        'tokens/platforms/web.json',
      ],
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
        },
      ],
    },
    scss: {
      transformGroup: 'scss',
      prefix: 'ds', // Add namespace prefix for collision prevention
      buildPath: 'libs/tokens/scss/', // Platform-rooted build path
      // Include web platform overrides for SCSS
      source: [
        'tokens/base.json',
        'tokens/semantic.json',
        'tokens/components.json',
        'tokens/platforms/web.json',
      ],
      files: [
        {
          destination: 'tokens.scss',
          format: 'scss/variables',
        },
      ],
    },
    js: {
      transformGroup: 'js', // Use standard JS transform group
      transforms: ['value/font-family-quote', 'name/js-numeric-safe'], // Add font family and numeric-safe transforms
      prefix: 'ds', // Add namespace prefix for collision prevention
      buildPath: 'libs/tokens/js/', // Platform-rooted build path
      // Include web platform overrides for JS
      source: [
        'tokens/base.json',
        'tokens/semantic.json',
        'tokens/components.json',
        'tokens/platforms/web.json',
      ],
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/es6-grouped',
        },
      ],
    },
    ts: {
      transformGroup: 'js', // Use standard JS transform group
      transforms: ['value/font-family-quote', 'name/js-numeric-safe'], // Add font family and numeric-safe transforms
      prefix: 'ds', // Add namespace prefix for collision prevention
      buildPath: 'libs/tokens/ts/', // Platform-rooted build path
      // Include web platform overrides for TypeScript
      source: [
        'tokens/base.json',
        'tokens/semantic.json',
        'tokens/components.json',
        'tokens/platforms/web.json',
      ],
      files: [
        {
          destination: 'tokens.ts',
          format: 'typescript/custom-declarations',
        },
      ],
    },
    json: {
      transformGroup: 'js',
      prefix: 'ds', // Add namespace prefix for collision prevention
      buildPath: 'libs/tokens/json/', // Platform-rooted build path
      // JSON output includes base tokens only (no platform overrides)
      source: [
        'tokens/base.json',
        'tokens/semantic.json',
        'tokens/components.json',
      ],
      files: [
        {
          destination: 'tokens.json',
          format: 'json/nested',
        },
        {
          destination: 'tokens-flat.json',
          format: 'json/flat',
        },
      ],
    },
    dart: {
      transformGroup: 'js',
      prefix: 'Ds', // Add namespace prefix for collision prevention (PascalCase for Dart)
      buildPath: 'libs/tokens/dart/', // Platform-rooted build path
      // Include mobile platform overrides for Dart/Flutter
      source: [
        'tokens/base.json',
        'tokens/semantic.json',
        'tokens/components.json',
        'tokens/platforms/mobile.json',
      ],
      files: [
        {
          destination: 'tokens.dart',
          format: 'dart/theme-dart',
        },
      ],
    },
    compose: {
      transformGroup: 'js',
      prefix: 'Ds', // Add namespace prefix for collision prevention (PascalCase for Kotlin)
      buildPath: 'libs/tokens/compose/', // Platform-rooted build path
      // Include mobile platform overrides for Compose
      source: [
        'tokens/base.json',
        'tokens/semantic.json',
        'tokens/components.json',
        'tokens/platforms/mobile.json',
      ],
      files: [
        {
          destination: 'Theme.kt',
          format: 'compose/theme-kt',
        },
      ],
    },
    'react-native': {
      transformGroup: 'js',
      prefix: 'ds', // Add namespace prefix for collision prevention
      buildPath: 'libs/tokens/react-native/', // Platform-rooted build path
      // Include mobile platform overrides for React Native
      source: [
        'tokens/base.json',
        'tokens/semantic.json',
        'tokens/components.json',
        'tokens/platforms/mobile.json',
      ],
      files: [
        {
          destination: 'theme.ts',
          format: 'react-native/theme-ts',
        },
      ],
    },
  },
};
