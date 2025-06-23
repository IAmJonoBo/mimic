import StyleDictionary from 'style-dictionary';

// Register custom transforms
StyleDictionary.registerTransform({
  name: 'size/pxToRem',
  type: 'value',
  filter: (token) => {
    return (
      token.$type === 'dimension' && token.$value && token.$value.endsWith('px')
    );
  },
  transform: (token) => {
    const pixelValue = parseFloat(token.$value);
    return `${pixelValue / 16}rem`;
  },
});

StyleDictionary.registerTransform({
  name: 'color/hexToRgb',
  type: 'value',
  filter: (token) => {
    return (
      token.$type === 'color' && token.$value && token.$value.startsWith('#')
    );
  },
  transform: (token) => {
    const hex = token.$value.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgb(${r}, ${g}, ${b})`;
  },
});

// Register custom formats
StyleDictionary.registerFormat({
  name: 'typescript/custom-declarations',
  format: (dictionary) => {
    const tokens = dictionary.allTokens;

    let output = '// Auto-generated design tokens\n\n';
    output += 'export interface DesignTokens {\n';

    tokens.forEach((token) => {
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
      const value =
        typeof token.$value === 'string' ? `'${token.$value}'` : token.$value;
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
  format: (dictionary) => {
    const tokens = dictionary.allTokens.reduce((acc, token) => {
      const path = token.path.join('.');
      acc[path] = token.$value;
      return acc;
    }, {});

    return JSON.stringify(tokens, null, 2);
  },
});

// Future: Compose Multiplatform format
StyleDictionary.registerFormat({
  name: 'compose/theme-kt',
  format: (dictionary) => {
    let output = '// Auto-generated Compose theme from design tokens\n';
    output += 'package com.mimic.designsystem.theme\n\n';
    output += 'import androidx.compose.ui.graphics.Color\n';
    output += 'import androidx.compose.ui.unit.dp\n';
    output += 'import androidx.compose.ui.unit.sp\n\n';
    output += 'object DesignTokens {\n';

    // Group tokens by category
    const categories = {};
    dictionary.allTokens.forEach((token) => {
      const category = token.path[0];
      if (!categories[category]) categories[category] = [];
      categories[category].push(token);
    });

    Object.entries(categories).forEach(([category, tokens]) => {
      output += `  object ${category.charAt(0).toUpperCase() + category.slice(1)} {\n`;
      tokens.forEach((token) => {
        const name = token.path.slice(1).join('_').toUpperCase();
        let value = token.$value;

        if (token.$type === 'color') {
          value = `Color(0xFF${token.$value.replace('#', '')})`;
        } else if (token.$type === 'dimension') {
          value = `${parseFloat(token.$value)}${token.$value.includes('rem') ? '.dp' : '.dp'}`;
        }

        output += `    val ${name} = ${value}\n`;
      });
      output += '  }\n';
    });

    output += '}\n';
    return output;
  },
});

// Future: React Native format
StyleDictionary.registerFormat({
  name: 'react-native/theme-ts',
  format: (dictionary) => {
    let output = '// Auto-generated React Native theme from design tokens\n';
    output += "import { StyleSheet } from 'react-native';\n\n";

    const categories = {};
    dictionary.allTokens.forEach((token) => {
      const category = token.path[0];
      if (!categories[category]) categories[category] = [];
      categories[category].push(token);
    });

    Object.entries(categories).forEach(([category, tokens]) => {
      output += `export const ${category} = {\n`;
      tokens.forEach((token) => {
        const name = token.path.slice(1).join('_');
        let value = token.$value;

        if (token.$type === 'dimension') {
          value = parseFloat(token.$value.replace(/[^\d.]/g, ''));
        }

        output += `  ${name}: ${typeof value === 'string' ? `'${value}'` : value},\n`;
      });
      output += '};\n\n';
    });

    return output;
  },
});

export default {
  source: ['tokens/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'dist/css/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
        },
      ],
    },
    scss: {
      transformGroup: 'scss',
      buildPath: 'dist/scss/',
      files: [
        {
          destination: 'tokens.scss',
          format: 'scss/variables',
        },
      ],
    },
    js: {
      transformGroup: 'js',
      buildPath: 'dist/js/',
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/es6',
        },
      ],
    },
    ts: {
      transformGroup: 'js',
      buildPath: 'dist/types/',
      files: [
        {
          destination: 'tokens.ts',
          format: 'typescript/custom-declarations',
        },
      ],
    },
    json: {
      transformGroup: 'js',
      buildPath: 'dist/json/',
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
  },
};
