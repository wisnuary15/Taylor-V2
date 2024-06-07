import cheerio from 'cheerio';
import axios from 'axios';
export class smstome {
  async Country() {
    try {
      const {
        data
      } = await axios.get('https://smstome.com');
      const $ = cheerio.load(data);
      return $('.column.fields ul li').map((_, listItem) => {
        const title = $('a', listItem).text().trim();
        const countryCode = $('a', listItem).attr('href').split('/').pop();
        const countryFlag = 'https://smstome.com' + $('img', listItem).attr('src');
        const link = 'https://smstome.com' + $('a', listItem).attr('href');
        return {
          title,
          countryCode,
          countryFlag,
          link
        };
      }).get().filter(entry => Object.values(entry).every(value => value !== undefined && value !== ''));
    } catch (error) {
      console.error('Error fetching country page:', error);
      return [];
    }
  }
  async getNumber(country) {
    try {
      const {
        data
      } = await axios.get(`https://smstome.com/country/${country.toLowerCase()}`);
      const $ = cheerio.load(data);
      return $('.numview').map((_, numview) => {
        const phoneNumber = $('a', numview).text().trim();
        const location = $('div.row:nth-child(1) > div > small', numview).text().trim();
        const addedDate = $('div.row:nth-child(2) > small', numview).text().trim();
        const link = $('a', numview).attr('href');
        return {
          phoneNumber,
          location,
          addedDate,
          link
        };
      }).get().filter(entry => Object.values(entry).every(value => value !== undefined && value !== ''));
    } catch (error) {
      console.error('Error fetching number page:', error);
      return [];
    }
  }
  async getMessage(url, page) {
    try {
      const {
        data
      } = await axios.get(page ? `${url}?page=${page}` : url);
      const $ = cheerio.load(data);
      return $('table.messagesTable tbody tr').map((_, message) => {
        const from = $('td:nth-child(1)', message).text().trim().replace('<!--sse-->', '').replace('<!--/sse-->',
          '');
        const received = $('td:nth-child(2)', message).text().trim().replace('<!--sse-->', '').replace(
          '<!--/sse-->', '');
        const content = $('td:nth-child(3)', message).text().trim().replace('<!--sse-->', '').replace(
          '<!--/sse-->', '');
        return {
          from,
          received,
          content
        };
      }).get().filter(entry => Object.values(entry).every(value => value !== undefined && value !== ''));
    } catch (error) {
      console.error('Error fetching message page:', error);
      return [];
    }
  }
}
export class sms24 {
  async Country() {
    try {
      const {
        data
      } = await axios.get('https://sms24.me/en/countries');
      const $ = cheerio.load(data);
      return $('.callout').map((_, callout) => {
        const title = $('span.placeholder.h5', callout).text().trim();
        const link = 'https://sms24.me/en/countries/' + $('span.fi', callout).attr('data-flag');
        const countryFlag = $('span.fi', callout).attr('data-flag');
        return {
          title,
          link,
          countryFlag
        };
      }).get();
    } catch (error) {
      console.error('Error fetching country page:', error);
      return [];
    }
  }
  async getNumber(country) {
    try {
      const {
        data
      } = await axios.get(`https://sms24.me/en/countries/${country.toLowerCase()}`);
      const $ = cheerio.load(data);
      return $('.callout').map((_, callout) => {
        const phoneNumber = $('.fw-bold.text-primary', callout).text().trim();
        const country = $('h5', callout).text().trim();
        return {
          phoneNumber,
          country
        };
      }).get();
    } catch (error) {
      console.error('Error fetching number page:', error);
      return [];
    }
  }
  async getMessage(number) {
    try {
      const {
        data
      } = await axios.get(`https://sms24.me/en/numbers/${parseInt(number)}`);
      const $ = cheerio.load(data);
      return $('.shadow-sm.bg-light.rounded.border-start.border-info.border-5').map((_, message) => {
        const from = $('a', message).text().trim().replace('From:', '').trim();
        const content = $('span', message).text().trim();
        return {
          from,
          content
        };
      }).get();
    } catch (error) {
      console.error('Error fetching message page:', error);
      return [];
    }
  }
}
