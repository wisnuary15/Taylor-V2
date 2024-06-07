import {
  fetch
} from 'undici';
import cheerio from 'cheerio';
async function searchDrakor(query) {
  try {
    const response = await fetch('https://drakorasia.us?s=' + query + '&post_type=post');
    const html = await response.text();
    const $ = cheerio.load(html);
    const extractedData = $('#post.archive').map((index, element) => ({
      title: $(element).find('h2 a').text().trim(),
      link: $(element).find('h2 a').attr('href'),
      image: $(element).find('img').attr('src'),
      categories: $(element).find('.genrenya span[rel="tag"]').map((index, el) => $(el).text()).get(),
      year: $(element).find('.category a[rel="tag"]').text(),
      episodes: $(element).find('.category').contents().filter((index, el) => el.nodeType === 3).text().trim(),
    })).get();
    return extractedData;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}
async function downloadDrakor(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    const genres = $('.genrenya span[rel="tag"]').map(function(_, el) {
      return $(el).text().trim();
    }).get();
    const resolutions = $('thead th').filter(function(_, el) {
      return $(el).text().includes('Download');
    }).map(function(_, el) {
      return $(el).text().trim().replace('Download ', '').toLowerCase();
    }).get();
    return {
      title: $('h2 span.border-b-4').text().trim(),
      synopsis: $('#synopsis p.caps strong').text().trim(),
      rating: $('.wpd-rating-value .wpdrv').text(),
      genres,
      downloadInfo: $('#content-post table.mdl-data-table tbody tr').map(function(_, el) {
        const episode = $(el).find('td:first-child').text().trim();
        const episodeInfo = Object.fromEntries(resolutions.map(function(resolution) {
          const columnIndex = $('thead th:contains("Download ' + resolution + '")').index();
          const resolutionColumn = $(el).find('td:eq(' + columnIndex + ')');
          const downloadLinks = resolutionColumn.find('a').map(function(_, a) {
            const link = $(a).attr('href');
            const platform = $(a).text().trim();
            return {
              platform,
              link
            };
          }).get();
          return [resolution, downloadLinks];
        }));
        return {
          episode,
          episodeInfo
        };
      }).get(),
    };
  } catch (error) {
    console.error('Error:', error);
    return {};
  }
}
export {
  searchDrakor,
  downloadDrakor
};
