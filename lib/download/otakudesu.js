import cheerio from "cheerio";
import axios from "axios";
const url = {
    baseUrl: 'https://otakudesu.cloud/',
    completeAnime: 'complete-anime/',
    onGoingAnime: 'ongoing-anime/',
    schedule: 'jadwal-rilis/',
    genreList: 'genre-list/'
};
const requestFailed = (err) => ({
    status: false,
    message: err.message
});
export const home = async () => {
    let home = {};
    let on_going = [];
    let complete = [];
    try {
        const response = await axios.get(url.baseUrl);
        const $ = cheerio.load(response.data);
        const element = $(".venz");
        let episode, uploaded_on, day_updated, score, thumb, title, link, id;
        element.children().eq(0).find("ul > li").each(function () {
            $(this).find(".thumb > a")?.filter(function () {
                title = $(this).find(".thumbz > h2").text();
                thumb = $(this).find(".thumbz > img").attr("src");
                link = $(this).attr("href");
                id = link.replace(`${url.baseUrl}anime/`, "");
            });
            uploaded_on = $(this).find(".newnime").text();
            episode = $(this).find(".epz").text().replace(" Episode", "");
            day_updated = $(this).find(".epztipe").text().replace(" ", "");
            on_going.push({
                title,
                id,
                thumb,
                episode,
                uploaded_on,
                day_updated,
                link
            });
        });
        element.children().eq(1).find("ul > li").each(function () {
            $(this).find(".thumb > a")?.filter(function () {
                title = $(this).find(".thumbz > h2").text();
                thumb = $(this).find(".thumbz > img").attr("src");
                link = $(this).attr("href");
                id = link.replace(`${url.baseUrl}anime/`, "");
            });
            uploaded_on = $(this).find(".newnime").text();
            episode = $(this).find(".epz").text().replace(" Episode", "");
            score = parseFloat($(this).find(".epztipe").text().replace(" ", ""));
            complete.push({
                title,
                id,
                thumb,
                episode,
                uploaded_on,
                score,
                link
            });
        });
        home.on_going = on_going;
        home.complete = complete;
        return {
            status: "success",
            baseUrl: url.baseUrl,
            home
        };
    } catch (e) {
        console.log(e.message);
        return requestFailed(e);
    }
};
export const completeAnimeList = async (page) => {
    const fullUrl = `${url.baseUrl}${url.completeAnime}${page ? `page/${page}` : ''}`;
    try {
        const response = await axios.get(fullUrl);
        const $ = cheerio.load(response.data);
        const element = $(".venz");
        let animeList = [];
        let episode, uploaded_on, score, thumb, title, link, id;
        element.children().eq(0).find("ul > li").each(function () {
            $(this).find(".thumb > a")?.filter(function () {
                title = $(this).find(".thumbz > h2").text();
                thumb = $(this).find(".thumbz > img").attr("src");
                link = $(this).attr("href");
                id = link.replace(`${url.baseUrl}anime/`, "");
            });
            uploaded_on = $(this).find(".newnime").text();
            episode = $(this).find(".epz").text().replace(" Episode", "");
            score = parseFloat($(this).find(".epztipe").text().replace(" ", ""));
            animeList.push({
                title,
                id,
                thumb,
                episode,
                uploaded_on,
                score,
                link
            });
        });
        return {
            status: "success",
            baseUrl: fullUrl,
            animeList
        };
    } catch (err) {
        console.log(err.message);
        return requestFailed(err);
    }
};
export const onGoingAnimeList = async (page) => {
    const fullUrl = `${url.baseUrl}${url.onGoingAnime}${page ? `page/${page}` : ''}`;
    try {
        const response = await axios.get(fullUrl);
        const $ = cheerio.load(response.data);
        const element = $(".venz");
        let animeList = [];
        let episode, uploaded_on, day_updated, thumb, title, link, id;
        element.children().eq(0).find("ul > li").each(function () {
            $(this).find(".thumb > a")?.filter(function () {
                title = $(this).find(".thumbz > h2").text();
                thumb = $(this).find(".thumbz > img").attr("src");
                link = $(this).attr("href");
                id = link.replace(`${url.baseUrl}anime/`, "");
            });
            uploaded_on = $(this).find(".newnime").text();
            episode = $(this).find(".epz").text().replace(" Episode", "");
            day_updated = $(this).find(".epztipe").text().replace(" ", "");
            animeList.push({
                title,
                id,
                thumb,
                episode,
                uploaded_on,
                day_updated,
                link
            });
        });
        return {
            status: "success",
            baseUrl: url.baseUrl,
            animeList
        };
    } catch (err) {
        console.log(err.message);
        return requestFailed(err);
    }
};
export const schedule = async () => {
    try {
        const response = await axios.get(url.baseUrl + url.schedule);
        const $ = cheerio.load(response.data);
        const element = $(".kgjdwl321");
        let animeList = [];
        let scheduleList = [];
        let day, anime_name, link, id;
        element.find(".kglist321").each(function () {
            day = $(this).find("h2").text();
            animeList = [];
            $(this).find("ul > li").each(function () {
                anime_name = $(this).find("a").text();
                link = $(this).find("a").attr("href");
                id = link.replace(url.baseUrl + "anime/", "");
                animeList.push({
                    anime_name,
                    id,
                    link
                });
            });
            scheduleList.push({
                day,
                animeList
            });
        });
        return {
            scheduleList
        };
    } catch (err) {
        console.log(err.message);
        return requestFailed(err);
    }
};
export const genre = async () => {
    const fullUrl = url.baseUrl + url.genreList;
    try {
        const response = await axios.get(fullUrl);
        const $ = cheerio.load(response.data);
        const element = $(".genres");
        let genreList = [];
        element.find("li > a").each(function (i, el) {
            let object = {};
            object.genre_name = $(el).text();
            object.id = $(el).attr("href").replace("/genres/", "");
            object.link = url.baseUrl + $(el).attr("href");
            object.image_link = ImageList[i];
            genreList.push(object);
        });
        return {
            genreList
        };
    } catch (err) {
        console.log(err.message);
        return requestFailed(err);
    }
};
export const animeByGenre = async (pageNumber, id) => {
    const fullUrl = url.baseUrl + `genres/${id}/page/${pageNumber}`;
    try {
        const response = await axios.get(fullUrl);
        const $ = cheerio.load(response.data);
        const element = $(".page");
        let animeList = [];
        let genreList = [];
        let object = {};
        let genre_name, genre_link, genre_id;
        element.find(".col-md-4").each(function () {
            object = {};
            object.anime_name = $(this).find(".col-anime-title").text();
            object.thumb = $(this).find('div.col-anime-cover > img').attr('src')
            object.link = $(this).find(".col-anime-title > a").attr("href");
            object.id = $(this)
                .find(".col-anime-title > a")
                .attr("href")
                .replace("https://otakudesu.cloud/anime/", "");
            object.studio = $(this).find(".col-anime-studio").text();
            object.episode = $(this).find(".col-anime-eps").text();
            object.score = parseFloat($(this).find(".col-anime-rating").text());
            object.release_date = $(this).find(".col-anime-date").text();
            genreList = [];
            $(this)
                .find(".col-anime-genre > a")
                .each(function () {
                    genre_name = $(this).text();
                    genre_link = $(this).attr("href");
                    genre_id = genre_link.replace("https://otakudesu.cloud/genres/", "");
                    genreList.push({
                        genre_name,
                        genre_link,
                        genre_id
                    });
                    object.genre_list = genreList;
                });
            animeList.push(object);
        });
        return {
            status: "success",
            baseUrl: fullUrl,
            animeList
        };
    } catch (err) {
        requestFailed(err);
    }
};
export const search = async (query) => {
    const fullUrl = `${url.baseUrl}?s=${query}&post_type=anime`;
    try {
        const response = await axios.get(fullUrl);
        const $ = cheerio.load(response.data);
        const element = $(".page");
        let obj = {};
        let anime_list = [];
        obj.status = "success";
        obj.baseUrl = fullUrl;
        if (element.find("ul > li").length === 0) {
            obj.search_results = [];
        } else {
            element.find("ul > li").each(function () {
                const genre_list = [];
                $(this).find(".set").find("a").each(function () {
                    const genre_result = {
                        genre_title: $(this).text(),
                        genre_link: $(this).attr("href"),
                        genre_id: $(this).attr("href").replace(`${url.baseUrl}genres/`, ""),
                    };
                    genre_list.push(genre_result);
                });
                const results = {
                    thumb: $(this).find("img").attr("src"),
                    title: $(this).find("h2").text(),
                    link: $(this).find("h2 > a").attr("href"),
                    id: $(this).find("h2 > a").attr("href").replace(`${url.baseUrl}anime/`, ""),
                    status: $(this).find(".set").eq(1).text().replace("Status : ", ""),
                    score: parseFloat(
                        $(this).find(".set").eq(2).text().replace("Rating : ", "")
                    ),
                    genre_list,
                };
                anime_list.push(results);
                obj.search_results = anime_list;
            });
        }
        return obj;
    } catch (err) {
        console.log(err.message);
        return requestFailed(err);
    }
};
const get = async (url) => {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        let source1 = $.html().search('"file":');
        let source2 = $.html().search("'file':");
        console.log(source1);
        console.log(source2);
        if (source1 !== -1) {
            const end = $.html().indexOf('","');
            return $.html().substring(source1 + 8, end);
        } else if (source2 !== -1) {
            const end = $.html().indexOf("','");
            return $.html().substring(source2 + 8, end);
        }
        return "-";
    } catch (error) {
        return "-";
    }
};
export const detailAnime = async (id) => {
    const fullUrl = url.baseUrl + `anime/${id}`;
    try {
        const response = await axios.get(fullUrl);
        const $ = cheerio.load(response.data);
        const detailElement = $(".venser").find(".fotoanime");
        const epsElement = $("#_epslist").html();
        let object = {};
        let episode_list = [];
        object.thumb = detailElement.find("img").attr("src");
        object.anime_id = id;
        let genre_name, genre_id, genre_link;
        let genreList = [];
        object.synopsis = $("#venkonten > div.venser > div.fotoanime > div.sinopc")
            .find("p")
            .text();
        detailElement.find(".infozin")?.filter(function () {
            object.title = $(this)
                .find("p")
                .children()
                .eq(0)
                .text()
                .replace("Judul: ", "");
            object.japanase = $(this)
                .find("p")
                .children()
                .eq(1)
                .text()
                .replace("Japanese: ", "");
            object.score = parseFloat(
                $(this).find("p").children().eq(2).text().replace("Skor: ", "")
            );
            object.producer = $(this)
                .find("p")
                .children()
                .eq(3)
                .text()
                .replace("Produser:  ", "");
            object.type = $(this)
                .find("p")
                .children()
                .eq(4)
                .text()
                .replace("Tipe: ", "");
            object.status = $(this)
                .find("p")
                .children()
                .eq(5)
                .text()
                .replace("Status: ", "");
            object.total_episode = parseInt(
                $(this).find("p").children().eq(6).text().replace("Total Episode: ", "")
            );
            object.duration = $(this)
                .find("p")
                .children()
                .eq(7)
                .text()
                .replace("Durasi: ", "");
            object.release_date = $(this)
                .find("p")
                .children()
                .eq(8)
                .text()
                .replace("Tanggal Rilis: ", "");
            object.studio = $(this)
                .find("p")
                .children()
                .eq(9)
                .text()
                .replace("Studio: ", "");
            $(this)
                .find("p")
                .children()
                .eq(10)
                .find("span > a")
                .each(function () {
                    genre_name = $(this).text();
                    genre_id = $(this)
                        .attr("href")
                        .replace(`https://otakudesu.cloud/genres/`, "");
                    genre_link = $(this).attr("href");
                    genreList.push({
                        genre_name,
                        genre_id,
                        genre_link
                    });
                    object.genre_list = genreList;
                });
        });
        $("#venkonten > div.venser > div:nth-child(8) > ul > li").each(
            (i, element) => {
                const dataList = {
                    title: $(element).find("span > a").text(),
                    id: $(element)
                        .find("span > a")
                        .attr("href")
                        .replace('https://otakudesu.cloud/', ""),
                    link: $(element).find("span > a").attr("href"),
                    uploaded_on: $(element).find(".zeebr").text(),
                };
                episode_list.push(dataList);
            }
        );
        object.episode_list =
            episode_list.length === 0 ? [{
                title: "Maaf, masih kosong bro",
                id: "Maaf, masih kosong bro",
                link: "Maaf, masih kosong bro",
                uploaded_on: "Maaf, masih kosong bro",
            }, ] :
            episode_list;
        const batch_link = {
            id: $("div.venser > div:nth-child(6) > ul").text().length !== 0 ?
                $("div.venser > div:nth-child(6) > ul > li > span:nth-child(1) > a")
                .attr("href")
                .replace(`https://otakudesu.cloud/batch/`, "") : "Maaf, masih kosong bro",
            link: $("div.venser > div:nth-child(6) > ul").text().length !== 0 ?
                $(
                    "div.venser > div:nth-child(6) > ul > li > span:nth-child(1) > a"
                ).attr("href") : "Maaf, masih kosong bro",
        };
        const empty_link = {
            id: "Maaf, masih kosong bro",
            link: "Maaf, masih kosong bro",
        };
        object.batch_link = batch_link;
        return object;
    } catch (err) {
        console.log(err);
        requestFailed(err);
    }
};
export const batchAnime = async (id) => {
    const fullUrl = `${url.baseUrl}batch/${id}`;
    console.log(fullUrl);
    axios.get(fullUrl)
        .then((response) => {
            const $ = cheerio.load(response.data);
            const obj = {};
            obj.title = $(".batchlink > h4").text();
            obj.status = "success";
            obj.baseUrl = fullUrl;
            let low_quality = _batchQualityFunction(0, response.data);
            let medium_quality = _batchQualityFunction(1, response.data);
            let high_quality = _batchQualityFunction(2, response.data);
            obj.download_list = {
                low_quality,
                medium_quality,
                high_quality
            };
            return obj;
        })
        .catch((err) => {
            requestFailed(err);
        });
};
export const epsAnime = async (id) => {
    const fullUrl = `${url.baseUrl}${id}`;
    try {
        const response = await axios.get(fullUrl);
        const $ = cheerio.load(response.data);
        const streamElement = $("#lightsVideo").find("#embed_holder");
        const obj = {};
        obj.title = $(".venutama > h1").text();
        obj.baseUrl = fullUrl;
        obj.id = fullUrl.replace(url.baseUrl, "");
        const streamLink = streamElement.find("iframe").attr("src");
        obj.link_stream = await get(streamLink);
        console.log($('#pembed > div > iframe').attr('src'));
        let low_quality;
        let medium_quality;
        let high_quality;
        let mirror1 = [];
        let mirror2 = [];
        let mirror3 = [];
        $('#embed_holder > div.mirrorstream > ul.m360p > li').each((idx, el) => {
            mirror1.push({
                host: $(el).find('a').text().trim(),
                id: $(el).find('a').attr('href'),
            });
        });
        $('#embed_holder > div.mirrorstream > ul.m480p > li').each((idx, el) => {
            mirror2.push({
                host: $(el).find('a').text().trim(),
                id: $(el).find('a').attr('href'),
            });
        });
        $('#embed_holder > div.mirrorstream > ul.m720p > li').each((idx, el) => {
            mirror3.push({
                host: $(el).find('a').text().trim(),
                id: $(el).find('a').attr('href'),
            });
        });
        obj.mirror1 = {
            quality: '360p',
            mirrorList: mirror1
        };
        obj.mirror2 = {
            quality: '480p',
            mirrorList: mirror2
        };
        obj.mirror3 = {
            quality: '720p',
            mirrorList: mirror3
        };
        if ($('#venkonten > div.venser > div.venutama > div.download > ul > li:nth-child(1)').text() === '') {
            console.log('ul is empty');
            low_quality = _notFoundQualityHandler(response.data, 0);
            medium_quality = _notFoundQualityHandler(response.data, 1);
            high_quality = _notFoundQualityHandler(response.data, 2);
        } else {
            console.log('ul is not empty');
            low_quality = _epsQualityFunction(0, response.data);
            medium_quality = _epsQualityFunction(1, response.data);
            high_quality = _epsQualityFunction(2, response.data);
        }
        obj.quality = {
            low_quality,
            medium_quality,
            high_quality
        };
        return obj;
    } catch (err) {
        console.log(err);
        requestFailed(err);
    }
};
export const epsMirror = async (mirrorId, animeId) => {
    const fullUrl = `${url.baseUrl}${animeId}/${mirrorId}`;
    try {
        const response = await axios.get(fullUrl);
        const $ = cheerio.load(response.data);
        const obj = {};
        obj.title = $(".venutama > h1").text();
        obj.baseUrl = fullUrl;
        obj.id = fullUrl.replace(url.baseUrl, "");
        const streamLink = $('#pembed > div > iframe').attr('src');
        obj.streamLink = streamLink;
        obj.link_stream = await get(streamLink);
        return obj;
    } catch (error) {
        console.log(error);
        requestFailed(err);
    }
};

function _batchQualityFunction(num, res) {
    const $ = cheerio.load(res);
    const element = $(".download").find(".batchlink");
    const download_links = [];
    let response;
    element.find("ul")?.filter(function () {
        const quality = $(this).find("li").eq(num).find("strong").text();
        const size = $(this).find("li").eq(num).find("i").text();
        $(this)
            .find("li")
            .eq(num)
            .find("a")
            .each(function () {
                const _list = {
                    host: $(this).text(),
                    link: $(this).attr("href"),
                };
                download_links.push(_list);
                response = {
                    quality,
                    size,
                    download_links
                };
            });
    });
    return response;
}

function _epsQualityFunction(num, res) {
    const $ = cheerio.load(res);
    const element = $(".download");
    const download_links = [];
    let response;
    element.find("ul")?.filter(function () {
        const quality = $(this).find("li").eq(num).find("strong").text();
        const size = $(this).find("li").eq(num).find("i").text();
        $(this).find("li").eq(num).find("a").each(function () {
            const _list = {
                host: $(this).text(),
                link: $(this).attr("href"),
            };
            download_links.push(_list);
            response = {
                quality,
                size,
                download_links
            };
        });
    });
    return response;
}

function _notFoundQualityHandler(res, num) {
    const $ = cheerio.load(res);
    const download_links = [];
    const element = $('.download');
    let response;
    element?.filter(function () {
        if ($(this).find('.anime-box > .anime-title').eq(0).text() === '') {
            $(this).find('.yondarkness-box')?.filter(function () {
                const quality = $(this).find('.yondarkness-title').eq(num).text().split('[')[1].split(']')[0];
                const size = $(this).find('.yondarkness-title').eq(num).text().split(']')[1].split('[')[1];
                $(this).find('.yondarkness-item').eq(num).find('a').each((idx, el) => {
                    const _list = {
                        host: $(el).text(),
                        link: $(el).attr("href"),
                    };
                    download_links.push(_list);
                    response = {
                        quality,
                        size,
                        download_links
                    };
                });
            });
        } else {
            $(this).find('.anime-box')?.filter(function () {
                const quality = $(this).find('.anime-title').eq(num).text().split('[')[1].split(']')[0];
                const size = $(this).find('.anime-title').eq(num).text().split(']')[1].split('[')[1];
                $(this).find('.anime-item').eq(num).find('a').each((idx, el) => {
                    const _list = {
                        host: $(el).text(),
                        link: $(el).attr("href"),
                    };
                    download_links.push(_list);
                    response = {
                        quality,
                        size,
                        download_links
                    };
                });
            });
        }
    });
    return response;
}
