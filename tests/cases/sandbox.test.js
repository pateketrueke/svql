import { Selector } from 'testcafe';

/* global fixture, test */

function url(x = '') {
  return process.env.BASE_URL + x;
}

fixture('svql')
  .page(url());

test('it loads...', async t => {
  const h1 = Selector('h1');

  await t
    .expect(h1.exists).ok()
    .expect(h1.count).eql(1);

  await t.expect(h1.textContent).contains('It works!');
});

test.page(url('/Pikachu'))
('it can display pokemon info', async t => {
  await t.expect(Selector('h3').textContent).contains('Loading...');
  await t.wait(400).expect(Selector('h3').textContent).contains('025. Pikachu');
});

test.page(url('/ImNotExists'))
('it can display failures', async t => {
  await t.expect(Selector('h3').textContent).contains('Loading...');
  await t.wait(400).expect(Selector('h3').textContent).contains('An error has ocurred');
});
