import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';

import { SimpleTokenDemo } from '../components/simple-token-demo';

export default component$(() => {
  return (
    <>
      <h1>Hi 👋</h1>
      <div>
        Welcome to Mimic Design Token Pipeline Demo!
        <br />
        Below you can see our design tokens in action with Qwik City.
      </div>

      <SimpleTokenDemo />
    </>
  );
});

export const head: DocumentHead = {
  title: 'Mimic Design Token Pipeline - Qwik Demo',
  meta: [
    {
      name: 'description',
      content:
        'Demo of Mimic design tokens integration with Qwik City and Vanilla Extract',
    },
  ],
};
