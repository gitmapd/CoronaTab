export class Meta {
  static APP_NAME = 'CoronaTab'
  static STRAPLINE = 'Open source browser extension for Coronavirus stats & news'
  static DESCRIPTION = 'Open source browser extension showing localized Coronavirus statistics, news & advice every time you open a new tab.'
  static KEYWORDS = 'Coronavirus, COVID2019, browser extension'
  static PAGE_TITLE_DELIMITER = ' - '
  static BASE_PATH = 'https://coronatab.app'
  static EXTENSION_URL = {
    CHROME: 'https://chrome.google.com/webstore/detail/fipekhmgdkpocnpkfonlgbflampgkmlk',
    FIREFOX: 'https://addons.mozilla.org/en-GB/firefox/addon/coronatab/',
    EDGE: 'https://microsoftedge.microsoft.com/addons/detail/jkmoagnlaijjdljpablgbefbofojlinm'
  }
  static FACEBOOK_APP_ID = '' // TODO: Add this

  static buildPageTitle (config?: string | { strapline?: boolean, title?: string }) {
    let segments = [Meta.APP_NAME]
    const title = typeof config === 'string' ? config : config?.title
    if (title) segments = [title, ...segments]
    if (typeof config !== 'string' && config?.strapline) {
      segments.push(Meta.STRAPLINE)
    }
    return segments.join(Meta.PAGE_TITLE_DELIMITER)
  }
}
