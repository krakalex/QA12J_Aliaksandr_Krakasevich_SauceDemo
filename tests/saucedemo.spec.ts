import { describe } from 'mocha';
import { Browser, Builder, By, Key, until, WebDriver } from 'selenium-webdriver';
import assert from 'assert';

describe('SauceDemo', async () => {
  let driver: WebDriver;

  beforeEach(async () => {
    driver = await new Builder().forBrowser(Browser.EDGE).build();
    await driver.manage().window().maximize();
    await driver.get('https://www.saucedemo.com/');
  });

  afterEach(async () => {
    await driver.quit();
  });

  it('Test 1: Happy Flow', async () => {
    const elementText = await driver
      .findElement(By.xpath('//h4[contains(text(), "Accepted usernames are:")]/parent::div'))
      .getText();
    const usernames = elementText.split('\n');
    const username = usernames[1];
    const passwordElementText = await driver.findElement(By.css('.login_password')).getText();
    const password = passwordElementText.substring(passwordElementText.indexOf(':') + 1);
    await driver.findElement(By.id('user-name')).sendKeys(username);
    await driver.findElement(By.css('#password')).sendKeys(password);
    await driver.findElement(By.css('input[type="submit"]')).click();
    await driver.wait(until.elementLocated(By.css('#item_0_img_link')), 2000);

    const itemCatalogueName = await driver.findElement(By.css('#item_0_title_link .inventory_item_name')).getText();
    await driver.findElement(By.xpath('//a[@id="item_0_img_link"]/parent::div/following-sibling::div//button')).click();
    assert.equal(
      await driver
        .findElement(By.xpath('//a[@id="item_0_img_link"]/parent::div/following-sibling::div//button'))
        .getText(),
      'Remove',
    );
    await driver.findElement(By.css('[class="shopping_cart_link"]')).click();

    await driver.wait(until.elementLocated(By.css('.inventory_item_name')), 2000);
    assert.equal(await driver.findElement(By.css('.inventory_item_name')).getText(), itemCatalogueName);
    await driver.findElement(By.css('[name="checkout"]')).click();

    await driver.wait(until.elementLocated(By.name('continue')), 2000);
    await driver.findElement(By.id('first-name')).sendKeys('TestFName');
    await driver.findElement(By.css('#last-name')).sendKeys('TestLName');
    await driver.findElement(By.css('#postal-code')).sendKeys('220022');
    await driver.findElement(By.css('[name="continue"]')).click();
    await driver.findElement(By.name('finish')).click();

    assert.equal(
      await driver.findElement(By.xpath('//h2[@class="complete-header"]')).getText(),
      'Thank you for your order!',
    );
    await driver.findElement(By.name('back-to-products')).click();
    await driver.wait(until.elementLocated(By.css('#item_0_img_link')), 2000);
  });
});
