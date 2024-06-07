import fetch from "node-fetch"
const handler = async (m, {
  conn,
  usedPrefix,
  command,
  text
}) => {
  let domain = ["aaa", "abb", "abbott", "abc", "abudhabi", "ac", "academy", "accountant", "accountants", "actor",
    "ad", "ads", "adult", "ae", "aero", "af", "afl", "africa", "ag", "agency", "ai", "aig", "al", "alsace", "am",
    "amazon", "amex", "amsterdam", "anz", "ao", "app", "apple", "aq", "ar", "archi", "army", "arpa", "art", "as",
    "asia", "associates", "at", "au", "auction", "audi", "audio", "auspost", "auto", "aw", "aws", "ax", "axa",
    "az", "ba", "baby", "baidu", "band", "bank", "bar", "barcelona", "barclaycard", "barclays", "bargains",
    "basketball", "bayern", "bb", "bd", "be", "beauty", "beer", "berlin", "best", "bet", "bf", "bg", "bh", "bi",
    "bible", "bid", "bike", "bingo", "bio", "biz", "bj", "black", "blog", "blue", "bm", "bmw", "bn", "bnpparibas",
    "bo", "bot", "boutique", "box", "br", "bradesco", "broker", "brother", "brussels", "bs", "bt", "bugatti",
    "build", "builders", "business", "buy", "buzz", "bw", "by", "bz", "bzh", "ca", "cab", "cafe", "cal", "cam",
    "camera", "camp", "canon", "capetown", "capital", "car", "cards", "care", "careers", "cars", "casa", "cash",
    "casino", "cat", "catering", "cba", "cbs", "cc", "cd", "center", "ceo", "cern", "cf", "cg", "ch", "channel",
    "charity", "chat", "cheap", "chintai", "chrome", "church", "ci", "cisco", "citic", "city", "ck", "cl",
    "claims", "cleaning", "click", "clinic", "clothing", "cloud", "club", "cm", "cn", "co", "coach", "codes",
    "coffee", "college", "cologne", "com", "community", "company", "computer", "condos", "construction",
    "consulting", "contact", "cooking", "cool", "coop", "corsica", "country", "coupons", "courses", "cpa", "cr",
    "credit", "creditcard", "creditunion", "cricket", "crs", "cu", "cuisinella", "cv", "cw", "cx", "cy", "cymru",
    "cyou", "cz", "dance", "date", "dating", "de", "deals", "degree", "delivery", "dental", "desi", "design",
    "dev", "dhl", "diamonds", "diet", "digital", "direct", "directory", "discount", "dj", "dk", "dm", "do",
    "doctor", "dog", "domains", "download", "durban", "dz", "earth", "ec", "eco", "edeka", "edu", "education",
    "ee", "eg", "email", "energy", "engineering", "enterprises", "equipment", "erni", "es", "estate", "et", "eu",
    "eus", "events", "exchange", "expert", "exposed", "express", "fage", "fail", "faith", "family", "fan", "fans",
    "farm", "fashion", "fast", "fi", "film", "finance", "financial", "fish", "fishing", "fit", "fitness", "fj",
    "fk", "flickr", "flights", "flowers", "fm", "fo", "football", "forex", "forsale", "foundation", "fox", "fr",
    "free", "frl", "fun", "fund", "futbol", "fyi", "ga", "gal", "gallery", "game", "games", "garden", "gay", "gd",
    "gdn", "ge", "gent", "gf", "gg", "gh", "gi", "gift", "gifts", "gives", "gl", "glass", "gle", "global", "gm",
    "gmail", "gmbh", "gn", "godaddy", "gold", "golf", "goo", "goog", "google", "gop", "gov", "gp", "gq", "gr",
    "graphics", "gratis", "green", "gripe", "group", "gs", "gt", "gu", "guide", "guru", "gw", "gy", "hamburg",
    "haus", "health", "healthcare", "help", "here", "hermes", "hisamitsu", "hitachi", "hiv", "hk", "hm", "hn",
    "hockey", "holdings", "holiday", "honda", "horse", "host", "hosting", "hot", "house", "how", "hr", "hsbc",
    "ht", "hu", "icbc", "icu", "id", "ie", "il", "im", "immo", "in", "inc", "industries", "info", "ink",
    "institute", "insure", "int", "international", "investments", "io", "ipiranga", "iq", "ir", "irish", "is",
    "ismaili", "ist", "istanbul", "it", "java", "jcb", "je", "jetzt", "jll", "jm", "jo", "jobs", "joburg", "jp",
    "kaufen", "ke", "kg", "kh", "ki", "kim", "kitchen", "kiwi", "kn", "koeln", "komatsu", "kp", "kpmg", "kpn",
    "kr", "krd", "kred", "kw", "ky", "kyoto", "kz", "la", "land", "lat", "law", "lawyer", "lb", "lc", "lease",
    "leclerc", "legal", "lgbt", "li", "lidl", "life", "lighting", "limited", "limo", "link", "live", "lk", "llc",
    "llp", "loan", "loans", "lol", "london", "love", "lr", "ls", "lt", "ltd", "ltda", "lu", "luxe", "luxury",
    "lv", "ly", "ma", "madrid", "management", "map", "market", "marketing", "markets", "mattel", "mba", "mc",
    "md", "me", "media", "meet", "melbourne", "men", "menu", "mg", "mh", "miami", "microsoft", "mil", "mk", "ml",
    "mls", "mm", "mn", "mo", "mobi", "mobile", "moda", "moe", "moi", "mom", "monash", "money", "monster",
    "mortgage", "moscow", "movie", "mp", "mq", "mr", "ms", "mt", "mu", "museum", "mv", "mw", "mx", "my", "mz",
    "na", "nagoya", "name", "navy", "nc", "ne", "net", "network", "neustar", "new", "news", "nf", "ng", "ngo",
    "ni", "nico", "ninja", "nl", "no", "np", "nr", "nra", "nrw", "ntt", "nu", "nyc", "nz", "observer", "okinawa",
    "om", "one", "ong", "onion", "onl", "online", "ooo", "orange", "org", "organic", "osaka", "ovh", "pa", "page",
    "paris", "partners", "parts", "party", "pe", "pet", "pf", "pg", "ph", "pharmacy", "phone", "photo",
    "photography", "photos", "physio", "pics", "pictet", "pictures", "pink", "pioneer", "pizza", "pk", "pl",
    "place", "plus", "pm", "pn", "poker", "porn", "post", "pr", "press", "pro", "productions", "promo",
    "properties", "property", "ps", "pt", "pub", "pw", "py", "qa", "quebec", "racing", "radio", "re",
    "realestate", "realtor", "realty", "recipes", "red", "rehab", "reise", "reisen", "ren", "rent", "rentals",
    "repair", "report", "rest", "restaurant", "review", "reviews", "rio", "rip", "rmit", "ro", "rocks", "rodeo",
    "rs", "ru", "rugby", "ruhr", "run", "rw", "rwe", "sa", "saarland", "sale", "salon", "sandvik", "sap", "saxo",
    "sb", "sbi", "sc", "schmidt", "school", "schule", "science", "scot", "sd", "se", "security", "sener",
    "services", "ses", "sex", "sexy", "sg", "sh", "sharp", "shell", "shiksha", "shoes", "shop", "shopping",
    "show", "si", "singles", "site", "sk", "ski", "sky", "sl", "sm", "sn", "sncf", "so", "social", "softbank",
    "software", "solar", "solutions", "sony", "soy", "space", "sport", "spot", "sr", "srl", "st", "stockholm",
    "store", "stream", "studio", "study", "style", "su", "sucks", "supplies", "supply", "support", "surf", "sv",
    "swiss", "sx", "sy", "sydney", "systems", "sz", "taipei", "tatar", "tattoo", "tax", "taxi", "tc", "td",
    "team", "tech", "technology", "tel", "tennis", "tf", "tg", "th", "tickets", "tienda", "tips", "tirol", "tj",
    "tk", "tl", "tm", "tn", "to", "today", "tokyo", "tools", "top", "toshiba", "total", "tours", "town", "toyota",
    "toys", "tr", "trade", "trading", "training", "travel", "trust", "tt", "tube", "tv", "tw", "tz", "ua", "ug",
    "uk", "university", "uno", "uol", "us", "uy", "uz", "va", "vanguard", "vc", "ve", "vegas", "ventures", "vet",
    "vg", "vi", "video", "villas", "vin", "vip", "vision", "vlaanderen", "vn", "vote", "vu", "wales", "wang",
    "watch", "webcam", "weber", "website", "wedding", "weir", "wf", "wien", "wiki", "win", "wine", "work",
    "works", "world", "ws", "wtf", "xin", "xn--3e0b707e", "xn--54b7fta0cc", "xn--55qx5d", "xn--80adxhks",
    "xn--80asehdb", "xn--80aswg", "xn--90ais", "xn--9dbq2a", "xn--c1avg", "xn--d1acj3b", "xn--fiqs8s",
    "xn--h2brj9c", "xn--j1amh", "xn--p1acf", "xn--p1ai", "xn--vuq861b", "xxx", "xyz", "yahoo", "yandex", "ye",
    "yoga", "yokohama", "you", "youtube", "yt", "yun", "za", "zip", "zm", "zone", "zw"
  ]
  var listnya = domain.map((v, index) => {
    return `${++index}. ${usedPrefix + command} ${v}`
  }).join("\n")
  let nah = `${htki} *L I S T* ${htka}
_Example: ${usedPrefix + command} com_

${listnya}`
  if (!domain.includes(text)) throw nah
  let gex = await fetch(
    "https://raw.githubusercontent.com/rahultoppur/CY4740FinalProject/b82823d18371cd02adc47086b7e5cac1b7f4dad4/whois/tld_lists/" +
    text).then(response => response.text())
  let res = gex.split("\n")
  let list = res.map((v, index) => {
    return `${++index}. ${v}`
  }).join("\n")
  await m.reply("📮 *L I N K :*\n" + list)
}
handler.help = ["linksearch"]
handler.tags = ["search"]
handler.command = /^(linksearch)$/i
handler.limit = true
export default handler
