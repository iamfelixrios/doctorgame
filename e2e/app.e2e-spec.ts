import { DoctorgamePage } from './app.po';

describe('doctorgame App', () => {
  let page: DoctorgamePage;

  beforeEach(() => {
    page = new DoctorgamePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
