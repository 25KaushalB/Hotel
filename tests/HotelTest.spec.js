const { test, expect } = require('@playwright/test');
const data = JSON.parse(JSON.stringify(require('../Resources/resource.json')));

test('Verify hotel details is displayed with Highest Rating and Lowest Price', async ({ page }) => {

   //navigate to WebSite.
   await page.goto('https://www.trivago.com/');
   await page.waitForLoadState('networkidle');

   //Enter City Name in Search Box.
   await page.getByPlaceholder('Where to').fill(data.place);
   await page.locator('li[data-testid="suggested-item"]').first().click();

   // Select Date for which Hotels need to Book. 
   await page.locator('time[datetime="' + data.fromDate + '"]').click();
   await page.waitForLoadState('networkidle');
   await page.locator('time[datetime="' + data.toDate + '"]').first().click();
   await page.waitForLoadState('networkidle');

   //Select 2 Adults and 1 kid in accomodation Box.
   await page.locator('[data-testid="adults-amount"]').fill(data.adults.toString());
   await page.locator('[data-testid="children-amount"]').fill(data.kids.toString());
   await page.locator('[data-testid="guest-selector-apply"]').click();
   await page.locator('[data-testid="child-age-select"]').selectOption('1');
   await page.locator('[data-testid="guest-selector-apply"]').click();

   // Search with above Criteria.
   await page.locator('button[data-testid="search-button-with-loader"]').click();

   // Verify Search Result with above Criteria.
   await page.locator('[data-testid="accommodation-list"] li').first().waitFor();

    // sort by Rating
   const ratingShortlist = await page.locator('.LX1cii span');
   ratingShortlist.getByText('Rating').click();

   // sort by Price
   await page.getByRole('button', { name: 'Sort by' }).click();
   const priceShortlist = await page.locator('[data-testid="refinement-row-sorting-selector"] li label');
   await priceShortlist.getByText('Price ascending').click();
   await page.locator('[data-testid="filters-popover-apply-button"]').click();

   // Print Result in Console for Hotel with Best Rating and Lowest Price.
   await page.locator('[data-testid="accommodation-list"] li').first().waitFor();
   const hotelName = await page.locator('[data-testid="accommodation-list"] li [data-testid="item"] [data-testid="details-section"] h2');
   console.log(await hotelName.first().textContent() + " This is the Hotel with Best Rating and Lowest Price.");
   await expect(hotelName.first()).toBeVisible();
});
