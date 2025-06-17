const fs = require('fs');
const path = require('path');

describe('index.html', () => {
  test('contains a title element', () => {
    const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
    document.documentElement.innerHTML = html;
    const title = document.querySelector('title');
    expect(title).not.toBeNull();
  });
});
