import { reactNativeThemeTsFormatter } from '../style-dictionary.config.js';

describe('react-native/theme-ts formatter', () => {
  it('preserves multi-value dimension tokens with axis-aware structures', () => {
    const dictionary = {
      allTokens: [
        {
          path: ['button', 'padding', 'medium'],
          $value: '0.5rem 1rem',
          $type: 'dimension',
        },
        {
          path: ['button', 'padding', 'full'],
          $value: '1rem 2rem 3rem 4rem',
          $type: 'dimension',
        },
        {
          path: ['button', 'padding', 'single'],
          $value: '1rem',
          $type: 'dimension',
        },
        {
          path: ['button', 'borderRadius'],
          $value: '0.5rem',
          $type: 'dimension',
        },
      ],
    };

    const output = reactNativeThemeTsFormatter(dictionary as never);

    expect(output).toMatchInlineSnapshot(`
"// Auto-generated React Native theme from design tokens\n\nexport const button = {\n  padding_medium: {\n    vertical: 0.5,\n    horizontal: 1\n  },\n  padding_full: {\n    top: 1,\n    right: 2,\n    bottom: 3,\n    left: 4\n  },\n  padding_single: 1,\n  borderRadius: 0.5,\n};\n\n"
    `);
  });
});
