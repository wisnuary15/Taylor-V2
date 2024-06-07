import axios from 'axios';
import cheerio from 'cheerio';
class Eporner {
  async home() {
    try {
      const response = await axios.get('https://www.eporner.com/');
      const $ = cheerio.load(response.data);
      const results = $('#vidresults .mb').map((index, el) => ({
        id: $(el).data('id') || 'ID not available',
        quality: $(el).find('.mvhdico span').text() || 'Quality not available',
        title: $(el).find('.mbtit a').text() || 'Title not available',
        duration: $(el).find('.mbtim').text() || 'Duration not available',
        rating: $(el).find('.mbrate').text() || 'Rating not available',
        views: $(el).find('.mbvie').text() || 'Views not available',
        uploader: $(el).find('.mb-uploader a').text() || 'Uploader not available',
        link: new URL($(el).find('.mbtit a').attr('href'), 'https://www.eporner.com').href ||
          'Link not available',
        thumbnail: $(el).find('.mbimg img').attr('src') || 'Thumbnail not available',
      })).get();
      return results;
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  }
  async search(q) {
    try {
      const response = await axios.get(`https://www.eporner.com/search?q=${q}`);
      const $ = cheerio.load(response.data);
      const results = $('#vidresults .mb').map((index, el) => ({
        id: $(el).data('id') || 'ID not available',
        quality: $(el).find('.mvhdico span').text() || 'Quality not available',
        title: $(el).find('.mbtit a').text() || 'Title not available',
        duration: $(el).find('.mbtim').text() || 'Duration not available',
        rating: $(el).find('.mbrate').text() || 'Rating not available',
        views: $(el).find('.mbvie').text() || 'Views not available',
        uploader: $(el).find('.mb-uploader a').text() || 'Uploader not available',
        link: new URL($(el).find('.mbtit a').attr('href'), 'https://www.eporner.com').href ||
          'Link not available',
        thumbnail: $(el).find('.mbimg img').attr('src') || 'Thumbnail not available',
      })).get();
      return results;
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  }
  async download(url) {
    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const title = $('meta[property="og:title"]').attr('content') || 'Meta Title Not Found';
      const description = $('meta[property="og:description"]').attr('content') || 'Meta Description Not Found';
      const thumbnail = $('meta[property="og:image"]').attr('content') || 'Thumbnail Not Found';
      const download = $('.dloaddivcol .download-h264 a').map((idx, downloadEl) => {
        const qualityMatch = $(downloadEl).text().match(/\d+p/);
        const fileSizeMatch = $(downloadEl).text().match(/\d+\.\d+\s*MB/);
        const downloadURL = new URL($(downloadEl).attr('href'), url);
        return {
          quality: qualityMatch ? qualityMatch[0] : 'Quality Not Found',
          url: downloadURL.href,
          info: $(downloadEl).text().trim(),
          size: fileSizeMatch ? fileSizeMatch[0] : 'Size Not Found'
        };
      }).get();
      return {
        title,
        description,
        thumbnail,
        download
      };
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  }
  async categoryList() {
    try {
      const response = await axios.get('https://www.eporner.com');
      const $ = cheerio.load(response.data);
      const baseURL = new URL('https://www.eporner.com');
      const links = $('a[href*="/cat/"]').map((index, element) => new URL($(element).attr('href'), baseURL).href)
      .get().filter((link, index, self) => link && link.includes('/cat/') && !link.includes('/cat//') && self
        .indexOf(link) === index);
      return links;
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  }
  async categoryInfo(url) {
    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const results = $('#vidresults .mb').map((index, el) => ({
        id: $(el).data('id') || 'ID not available',
        quality: $(el).find('.mvhdico span').text() || 'Quality not available',
        title: $(el).find('.mbtit a').text() || 'Title not available',
        duration: $(el).find('.mbtim').text() || 'Duration not available',
        rating: $(el).find('.mbrate').text() || 'Rating not available',
        views: $(el).find('.mbvie').text() || 'Views not available',
        uploader: $(el).find('.mb-uploader a').text() || 'Uploader not available',
        link: new URL($(el).find('.mbtit a').attr('href'), 'https://www.eporner.com').href ||
          'Link not available',
        thumbnail: $(el).find('.mbimg img').attr('src') || 'Thumbnail not available',
      })).get();
      return results;
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  }
}
export {
  Eporner
};
