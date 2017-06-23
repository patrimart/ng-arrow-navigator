import { NgArrowNavigatorPage } from './app.po';

describe('ng-arrow-navigator App', () => {
  let page: NgArrowNavigatorPage;

  beforeEach(() => {
    page = new NgArrowNavigatorPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
