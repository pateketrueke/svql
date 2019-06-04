import { Selector } from 'testcafe';

/* global fixture, test */

fixture('svql')
  .page(process.env.BASE_URL);

test('it loads...', async t => {
  const h3 = Selector('h3');

  await t
    .expect(h3.exists).ok()
    .expect(h3.count).eql(1);

  await t.expect(h3.textContent).contains('025. Pikachu');
});
