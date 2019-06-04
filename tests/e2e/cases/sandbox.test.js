import { Selector } from 'testcafe';

/* global fixture, test */

fixture('svelte-fetchql')
  .page(process.env.BASE_URL);

test('it loads', async t => {
  const body = Selector('body');

  await t
    .expect(body.exists).ok()
    .expect(body.count).eql(1);
});
