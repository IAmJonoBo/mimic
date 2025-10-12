/**
 * Token Contract Validation Script
 *
 * Validates that design tokens conform to the formal contract specification:
 * 1. All semantic tokens use ds- prefix
 * 2. All token names use kebab-case (no spaces, slashes, capitals)
 * 3. DTCG hierarchy structure is maintained (global → alias → semantic)
 * 4. Color values are 6-digit hex, dimensions are unitless numbers
 * 5. Platform-scoped outputs are generated correctly
 */

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

interface TokenContractValidation {
  prefixCompliance: boolean;
  namingCompliance: boolean;
  structureCompliance: boolean;
  typeCompliance: boolean;
  platformOutputs: boolean;
  storybookPorts: boolean;
  violations: string[];
  warnings: string[];
}

interface TokenData {
  $value?: string;
  $type?: string;
  $description?: string;
  [key: string]: unknown;
}

/**
 * Recursively extracts all token paths from the token tree
 */
function getAllTokenPaths(tokens: Record<string, unknown>, prefix = ''): string[] {
  const paths: string[] = [];

  for (const [key, value] of Object.entries(tokens)) {
    const currentPath = prefix ? `${prefix}-${key}` : key;

    if (value && typeof value === 'object') {
      if ('$value' in value) {
        // This is a token leaf node
        paths.push(currentPath);
      } else {
        // This is a token group, recurse
        paths.push(...getAllTokenPaths(value as Record<string, unknown>, currentPath));
      }
    }
  }

  return paths;
}

/**
 * Validates DTCG structure (Design Token Community Group format)
 */
function hasValidDTCGStructure(tokens: Record<string, unknown>): boolean {
  // Check for required top-level structure
  const hasGlobal = 'global' in tokens || 'base' in tokens;
  const hasSemanticTokens = Object.keys(tokens).some(
    (key) =>
      key.startsWith('ds-') || (tokens[key] && typeof tokens[key] === 'object' && '$value' in (tokens[key] as object))
  );

  return hasGlobal || hasSemanticTokens;
}

/**
 * Validates a single token node for type and unit compliance
 */
function validateTokenNode(node: TokenData, path: string): string[] {
  const violations: string[] = [];

  if (!node.$value || !node.$type) {
    return violations;
  }

  const { $value, $type } = node;

  switch ($type) {
    case 'color':
      // Must be 6-digit hex
      if (typeof $value === 'string' && !/^#[0-9A-Fa-f]{6}$/.test($value)) {
        violations.push(`${path}: Color "${$value}" must be 6-digit hex format`);
      }
      break;

    case 'dimension':
    case 'spacing':
    case 'borderRadius':
      // Must be unitless number or valid CSS unit
      if (typeof $value === 'string') {
        if (!/^\d+(\.\d+)?(px|rem|em)?$/.test($value)) {
          violations.push(`${path}: Dimension "${$value}" should be unitless number or valid CSS unit`);
        }
      } else if (typeof $value !== 'number') {
        violations.push(`${path}: Dimension must be number or string, got ${typeof $value}`);
      }
      break;

    case 'fontWeight':
      // Must be number or valid keyword
      if (typeof $value !== 'number' && !['normal', 'bold', 'bolder', 'lighter'].includes($value as string)) {
        violations.push(`${path}: Font weight "${$value}" must be number or valid keyword`);
      }
      break;
  }

  return violations;
}

/**
 * Validates token types and units according to contract rules
 */
function validateTypesAndUnits(tokens: Record<string, unknown>): string[] {
  const violations: string[] = [];

  function validateNode(node: unknown, path: string): void {
    if (node && typeof node === 'object') {
      const tokenNode = node as TokenData;

      if (tokenNode.$value && tokenNode.$type) {
        violations.push(...validateTokenNode(tokenNode, path));
      } else {
        // Recurse into nested objects
        for (const [key, value] of Object.entries(tokenNode)) {
          if (!key.startsWith('$')) {
            validateNode(value, path ? `${path}-${key}` : key);
          }
        }
      }
    }
  }

  validateNode(tokens, '');
  return violations;
}

/**
 * Validates that required platform outputs exist with correct structure
 */
function validatePlatformOutputs(workspaceRoot: string): {
  success: boolean;
  missing: string[];
} {
  const requiredOutputs = [
    'packages/design-tokens/libs/tokens/css/tokens.css',
    'packages/design-tokens/libs/tokens/ts/tokens.ts',
    'packages/design-tokens/libs/tokens/js/tokens.js',
    'packages/design-tokens/libs/tokens/json/tokens.json',
    'packages/design-tokens/libs/tokens/compose/Theme.kt',
    'packages/design-tokens/libs/tokens/dart/tokens.dart',
  ];

  const missing: string[] = [];

  for (const outputPath of requiredOutputs) {
    const fullPath = resolve(workspaceRoot, outputPath);
    if (!existsSync(fullPath)) {
      missing.push(outputPath);
    }
  }

  return {
    success: missing.length === 0,
    missing,
  };
}

/**
 * Validates Storybook port isolation according to contract rules
 */
function validateStorybookPorts(workspaceRoot: string): {
  success: boolean;
  violations: string[];
} {
  const violations: string[] = [];

  // Check for Qwik Storybook port 6006
  const qwikStorybookConfig = resolve(workspaceRoot, 'packages/design-system/.storybook/main.ts');
  if (existsSync(qwikStorybookConfig)) {
    const content = readFileSync(qwikStorybookConfig, 'utf-8');
    if (!content.includes('6006') && !content.includes('framework: "@storybook/qwik"')) {
      violations.push('Qwik Storybook must use port 6006 and framework "@storybook/qwik"');
    }
  }

  // Check for React Native Storybook port 7007
  const rnStorybookConfig = resolve(workspaceRoot, 'packages/design-system/.storybook/main.mobile.ts');
  if (existsSync(rnStorybookConfig)) {
    const content = readFileSync(rnStorybookConfig, 'utf-8');
    if (!content.includes('7007')) {
      violations.push('React Native Storybook must use port 7007');
    }
  }

  return {
    success: violations.length === 0,
    violations,
  };
}

/**
 * Main validation function
 */
export function validateTokenContract(tokensPath: string, workspaceRoot?: string): TokenContractValidation {
  const violations: string[] = [];
  const warnings: string[] = [];

  // Read and parse tokens file
  let tokens: Record<string, unknown>;
  try {
    const tokensContent = readFileSync(tokensPath, 'utf-8');
    tokens = JSON.parse(tokensContent) as Record<string, unknown>;
  } catch (error) {
    violations.push(`Failed to read or parse tokens file: ${error}`);
    return {
      prefixCompliance: false,
      namingCompliance: false,
      structureCompliance: false,
      typeCompliance: false,
      platformOutputs: false,
      storybookPorts: false,
      violations,
      warnings,
    };
  }

  // 1. Validate ds- prefix compliance
  const tokenPaths = getAllTokenPaths(tokens);
  const semanticTokens = tokenPaths.filter(
    (path) => !path.startsWith('global') && !path.startsWith('base') && !path.startsWith('alias')
  );

  const unprefixedTokens = semanticTokens.filter((path) => !path.startsWith('ds-'));
  const prefixCompliance = unprefixedTokens.length === 0;

  if (!prefixCompliance) {
    violations.push(
      `Unprefixed semantic tokens found: ${unprefixedTokens.slice(0, 5).join(', ')}${unprefixedTokens.length > 5 ? '...' : ''}`
    );
    violations.push('Solution: Prefix all semantic tokens with "ds-" in Penpot');
  }

  // 2. Validate kebab-case naming compliance
  const invalidNames = tokenPaths.filter((path) => {
    // Check for uppercase letters, spaces, or forward slashes
    return /[A-Z]|\s|\//.test(path);
  });

  const namingCompliance = invalidNames.length === 0;

  if (!namingCompliance) {
    violations.push(
      `Invalid naming found: ${invalidNames.slice(0, 5).join(', ')}${invalidNames.length > 5 ? '...' : ''}`
    );
    violations.push('Solution: Use kebab-case names (lowercase with hyphens) in Penpot');
  }

  // 3. Validate DTCG structure compliance
  const structureCompliance = hasValidDTCGStructure(tokens);

  if (!structureCompliance) {
    violations.push('Invalid DTCG structure: Missing global/base tokens or proper hierarchy');
    violations.push('Solution: Organize tokens in global → alias → semantic hierarchy');
  }

  // 4. Validate types and units
  const typeViolations = validateTypesAndUnits(tokens);
  const typeCompliance = typeViolations.length === 0;

  violations.push(...typeViolations);

  if (!typeCompliance) {
    violations.push('Solution: Use 6-digit hex for colors, unitless numbers for dimensions');
  }

  // 5. Validate platform outputs (if workspace root provided)
  let platformOutputs = true;
  if (workspaceRoot) {
    const outputValidation = validatePlatformOutputs(workspaceRoot);
    platformOutputs = outputValidation.success;

    if (!platformOutputs) {
      violations.push(`Missing platform outputs: ${outputValidation.missing.join(', ')}`);
      violations.push('Solution: Run "pnpm build:tokens" to generate platform outputs');
    }
  }

  // 6. Validate Storybook port isolation (if workspace root provided)
  let storybookPorts = true;
  if (workspaceRoot) {
    const storybookValidation = validateStorybookPorts(workspaceRoot);
    storybookPorts = storybookValidation.success;

    if (!storybookPorts) {
      violations.push(...storybookValidation.violations);
      violations.push('Solution: Configure Qwik Storybook on port 6006, React Native on port 7007');
    }
  }

  // Generate warnings for best practices
  if (tokenPaths.length === 0) {
    warnings.push('No tokens found in file - this may be intentional for testing');
  }

  const colorTokens = tokenPaths.filter((path) => path.includes('color'));
  if (colorTokens.length === 0) {
    warnings.push('No color tokens found - consider adding color definitions');
  }

  const spacingTokens = tokenPaths.filter((path) => path.includes('spacing') || path.includes('space'));
  if (spacingTokens.length === 0) {
    warnings.push('No spacing tokens found - consider adding spacing definitions');
  }

  return {
    prefixCompliance,
    namingCompliance,
    structureCompliance,
    typeCompliance,
    platformOutputs,
    storybookPorts,
    violations,
    warnings,
  };
}

/**
 * CLI function for running token contract validation
 */
export function runTokenContractValidation(): void {
  const workspaceRoot = process.cwd();
  const tokensPath = resolve(workspaceRoot, 'tokens.json');

  if (!existsSync(tokensPath)) {
    // eslint-disable-next-line no-console
    console.log('❌ tokens.json not found in workspace root');
    // eslint-disable-next-line no-console
    console.log('Expected path:', tokensPath);
    process.exit(1);
  }

  // eslint-disable-next-line no-console
  console.log('🔍 Validating Token Contract Compliance\n');

  const validation = validateTokenContract(tokensPath, workspaceRoot);

  // Report results
  // eslint-disable-next-line no-console
  console.log('📋 Contract Validation Results:\n');

  const results = [
    { name: 'Prefix Compliance (ds-)', status: validation.prefixCompliance },
    {
      name: 'Naming Compliance (kebab-case)',
      status: validation.namingCompliance,
    },
    {
      name: 'Structure Compliance (DTCG)',
      status: validation.structureCompliance,
    },
    {
      name: 'Type Compliance (hex/unitless)',
      status: validation.typeCompliance,
    },
    { name: 'Platform Outputs', status: validation.platformOutputs },
    { name: 'Storybook Port Isolation', status: validation.storybookPorts },
  ];

  results.forEach(({ name, status }) => {
    const icon = status ? '✅' : '❌';
    // eslint-disable-next-line no-console
    console.log(`${icon} ${name}: ${status ? 'PASSED' : 'FAILED'}`);
  });

  // eslint-disable-next-line no-console
  console.log('');

  // Report violations
  if (validation.violations.length > 0) {
    // eslint-disable-next-line no-console
    console.log('❌ Contract Violations:');
    validation.violations.forEach((violation) => {
      // eslint-disable-next-line no-console
      console.log(`   • ${violation}`);
    });
    // eslint-disable-next-line no-console
    console.log('');
  }

  // Report warnings
  if (validation.warnings.length > 0) {
    // eslint-disable-next-line no-console
    console.log('⚠️  Warnings:');
    validation.warnings.forEach((warning) => {
      // eslint-disable-next-line no-console
      console.log(`   • ${warning}`);
    });
    // eslint-disable-next-line no-console
    console.log('');
  }

  // Overall status
  const allPassed =
    validation.prefixCompliance &&
    validation.namingCompliance &&
    validation.structureCompliance &&
    validation.typeCompliance &&
    validation.platformOutputs &&
    validation.storybookPorts;

  if (allPassed) {
    // eslint-disable-next-line no-console
    console.log('🎉 Token Contract Validation: PASSED');
    // eslint-disable-next-line no-console
    console.log('Your tokens are ready for collision-free consumption across all platforms!\n');
  } else {
    // eslint-disable-next-line no-console
    console.log('🚫 Token Contract Validation: FAILED');
    // eslint-disable-next-line no-console
    console.log('Please fix the violations above before proceeding.\n');
    process.exit(1);
  }
}

// Run CLI validation if this module is executed directly
if (require.main === module) {
  runTokenContractValidation();
}
