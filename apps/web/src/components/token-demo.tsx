import { component$ } from '@builder.io/qwik';

import { Link } from '@builder.io/qwik-city';

import {
  buttonPrimary,
  buttonSecondary,
  card,
  heading,
  text,
} from '../styles/theme.css';

// Demo component showcasing design token integration as documented in USER_GUIDE.md
// This demonstrates the collision-safe ds- prefixed tokens with Vanilla Extract + Qwik
export const TokenDemo = component$(() => {
  return (
    <div class={card}>
      <h1 class={heading}>Design Token Integration Demo</h1>
      <p class={text}>
        This component demonstrates the design token pipeline integration with
        Qwik City and Vanilla Extract, following the architecture documented in
        the USER_GUIDE.md.
      </p>

      <div
        style={{
          display: 'flex',
          gap: 'var(--ds-spacing-md)',
          marginTop: 'var(--ds-spacing-lg)',
        }}
      >
        <button
          class={buttonPrimary}
          onClick$={() => alert('Primary action triggered!')}
        >
          Primary Button
        </button>
        <button
          class={buttonSecondary}
          onClick$={() => alert('Secondary action triggered!')}
        >
          Secondary Button
        </button>
      </div>

      <div style={{ marginTop: 'var(--ds-spacing-lg)' }}>
        <h2
          style={{
            fontSize: 'var(--ds-typography-font-size-lg)',
            fontWeight: 'var(--ds-typography-font-weight-semibold)',
            color: 'var(--ds-color-neutral-800)',
            marginBottom: 'var(--ds-spacing-sm)',
          }}
        >
          Performance Features Implemented:
        </h2>
        <ul style={{ color: 'var(--ds-color-neutral-600)' }}>
          <li>✅ Collision-safe design tokens with ds- prefix</li>
          <li>✅ Vanilla Extract CSS-in-JS with zero runtime</li>
          <li>✅ Qwik resumability for instant interactivity</li>
          <li>📦 Ready for prefetch optimization on navigation links</li>
        </ul>
      </div>

      <div style={{ marginTop: 'var(--ds-spacing-lg)' }}>
        <Link
          href="/dashboard"
          style={{
            color: 'var(--ds-color-primary-600)',
            textDecoration: 'none',
            fontWeight: 'var(--ds-typography-font-weight-medium)',
          }}
        >
          Example Navigation Link →
        </Link>
      </div>
    </div>
  );
});
