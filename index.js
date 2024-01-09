
import EventEmitter from 'node:events';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import { open, rm } from 'node:fs/promises';

let urls = [
    'https://www.amazon.in/s?k=perfumes&page=1&crid=3GFMFR248N1O3&sprefix=perfumes%2Caps%2C559&ref=nb_sb_ss_inft-rank-pairwise-in-t1_1_8',
    'https://www.amazon.in/s?k=perfumes&page=2&crid=3GFMFR248N1O3&qid=1704825047&sprefix=perfumes%2Caps%2C559&ref=sr_pg_2',
    'https://www.amazon.in/s?k=perfumes&page=3&crid=3GFMFR248N1O3&qid=1704825047&sprefix=perfumes%2Caps%2C559&ref=sr_pg_2',
    'https://www.amazon.in/s?k=perfumes&page=4&crid=3GFMFR248N1O3&qid=1704825047&sprefix=perfumes%2Caps%2C559&ref=sr_pg_2',
    // 'https://www.amazon.in/s?k=perfumes&page=5&crid=3GFMFR248N1O3&qid=1704825047&sprefix=perfumes%2Caps%2C559&ref=sr_pg_2',
    // 'https://www.amazon.in/s?k=perfumes&page=6&crid=3GFMFR248N1O3&qid=1704825047&sprefix=perfumes%2Caps%2C559&ref=sr_pg_2',
    // 'https://www.amazon.in/s?k=perfumes&page=7&crid=3GFMFR248N1O3&qid=1704825047&sprefix=perfumes%2Caps%2C559&ref=sr_pg_2',
    // 'https://www.amazon.in/s?k=perfumes&page=8&crid=3GFMFR248N1O3&qid=1704825047&sprefix=perfumes%2Caps%2C559&ref=sr_pg_2',
    // 'https://www.amazon.in/s?k=perfumes&page=9&crid=3GFMFR248N1O3&qid=1704825047&sprefix=perfumes%2Caps%2C559&ref=sr_pg_2',
    // 'https://www.amazon.in/s?k=perfumes&page=10&crid=3GFMFR248N1O3&qid=1704825047&sprefix=perfumes%2Caps%2C559&ref=sr_pg_2',
    ];

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    let fileHandle;
    const scrapedLinks = [];
    let text = '';
    for(const url of urls) {
        await page.goto(url, { waitUntil: 'domcontentloaded'});
        await page.setViewport({width: 1080, height: 1024});
        const links = await page.$$('#search > div.s-desktop-width-max.s-desktop-content.s-wide-grid-style-t1.s-opposite-dir.s-wide-grid-style.sg-row > div.sg-col-20-of-24.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span.rush-component.s-latency-cf-section > div.s-main-slot.s-result-list.s-search-results.sg-row div > div > span > div > div > div.a-section.a-spacing-small.puis-padding-left-small.puis-padding-right-small > div.a-section.a-spacing-none.a-spacing-top-small.s-title-instructions-style > h2 > a');
        for(const link of links) {
            text = await link?.evaluate(el => el.getAttribute('href'));
            scrapedLinks.push('amazon.in'+text);
        }
    }

    await rm('./links.txt', { force: true });
    fileHandle = await open('links.txt', 'w');
    const writeStream = fileHandle.createWriteStream();
    for(const link of scrapedLinks) {
        writeStream.write(link, 'utf-8');
        writeStream.write('\n');
    }
    fileHandle.close();
    browser.close();
    console.log('Total Links: ', scrapedLinks.length);
})();
