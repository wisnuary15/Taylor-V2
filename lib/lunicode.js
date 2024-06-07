class Lunicode {
  constructor() {
    this.tools = {
      flip: {
        init: function() {
          for (var i in this.map) {
            this.map[this.map[i]] = i;
          }
        },
        encode: function(text) {
          var ret = [],
            ch;
          for (var i = 0, len = text.length; i < len; i++) {
            ch = text.charAt(i);
            if (i > 0 && (ch === '\u0324' || ch === '\u0317' || ch === '\u0316' || ch === '\u032e')) {
              ch = this.map[text.charAt(i - 1) + ch];
              ret.pop();
            } else {
              ch = this.map[ch];
              if (typeof(ch) === "undefined") {
                ch = text.charAt(i);
              }
            }
            ret.push(ch);
          }
          return ret.reverse().join("");
        },
        decode: function(text) {
          var ret = [],
            ch;
          for (var i = 0, len = text.length; i < len; i++) {
            ch = text.charAt(i);
            if (i > 0 && (ch === '\u0324' || ch === '\u0317' || ch === '\u0316' || ch === '\u032e')) {
              ch = this.map[text.charAt(i - 1) + ch];
              ret.pop();
            } else {
              ch = this.map[ch];
              if (typeof(ch) === "undefined") {
                ch = text.charAt(i);
              }
            }
            ret.push(ch);
          }
          return ret.reverse().join("");
        },
        map: {
          'a': '\u0250',
          'b': 'q',
          'c': '\u0254',
          'd': 'p',
          'e': '\u01DD',
          'f': '\u025F',
          'g': '\u0253',
          'h': '\u0265',
          'i': '\u0131',
          'j': '\u027E',
          'k': '\u029E',
          'l': '\u006C',
          'm': '\u026F',
          'n': 'u',
          'r': '\u0279',
          't': '\u0287',
          'v': '\u028C',
          'w': '\u028D',
          'y': '\u028E',
          'A': '\u2200',
          'B': 'á™ ',
          'C': '\u0186',
          'D': 'á—¡',
          'E': '\u018e',
          'F': '\u2132',
          'G': '\u2141',
          'J': '\u017f',
          'K': '\u22CA',
          'L': '\u02e5',
          'M': 'W',
          'P': '\u0500',
          'Q': '\u038C',
          'R': '\u1D1A',
          'T': '\u22a5',
          'U': '\u2229',
          'V': '\u039B',
          'Y': '\u2144',
          '1': '\u21c2',
          '2': '\u1105',
          '3': '\u0190',
          '4': '\u3123',
          '5': '\u078e',
          '6': '9',
          '7': '\u3125',
          '&': '\u214b',
          '.': '\u02D9',
          '"': '\u201e',
          ';': '\u061b',
          '[': ']',
          '(': ')',
          '{': '}',
          '?': '\u00BF',
          '!': '\u00A1',
          "\'": ',',
          '<': '>',
          '\u203E': '_',
          '\u00AF': '_',
          '\u203F': '\u2040',
          '\u2045': '\u2046',
          '\u2234': '\u2235',
          '\r': '\n',
          'ÃŸ': 'á™ ',
          '\u0308': '\u0324',
          'Ã¤': 'É' + '\u0324',
          'Ã¶': 'o' + '\u0324',
          'Ã¼': 'n' + '\u0324',
          'Ã„': '\u2200' + '\u0324',
          'Ã–': 'O' + '\u0324',
          'Ãœ': '\u2229' + '\u0324',
          'Â´': ' \u0317',
          'Ã©': '\u01DD' + '\u0317',
          'Ã¡': '\u0250' + '\u0317',
          'Ã³': 'o' + '\u0317',
          'Ãº': 'n' + '\u0317',
          'Ã‰': '\u018e' + '\u0317',
          'Ã': '\u2200' + '\u0317',
          'Ã“': 'O' + '\u0317',
          'Ãš': '\u2229' + '\u0317',
          '`': ' \u0316',
          'Ã¨': '\u01DD' + '\u0316',
          'Ã ': '\u0250' + '\u0316',
          'Ã²': 'o' + '\u0316',
          'Ã¹': 'n' + '\u0316',
          'Ãˆ': '\u018e' + '\u0316',
          'Ã€': '\u2200' + '\u0316',
          'Ã’': 'O' + '\u0316',
          'Ã™': '\u2229' + '\u0316',
          '^': ' \u032E',
          'Ãª': '\u01DD' + '\u032e',
          'Ã¢': '\u0250' + '\u032e',
          'Ã´': 'o' + '\u032e',
          'Ã»': 'n' + '\u032e',
          'ÃŠ': '\u018e' + '\u032e',
          'Ã‚': '\u2200' + '\u032e',
          'Ã”': 'O' + '\u032e',
          'Ã›': '\u2229' + '\u032e'
        }
      },
      mirror: {
        init: function() {
          for (var i in this.map) {
            this.map[this.map[i]] = i;
          }
        },
        encode: function(text) {
          var ret = [],
            ch, newLines = [];
          for (var i = 0, len = text.length; i < len; i++) {
            ch = text.charAt(i);
            if (i > 0 && (ch === '\u0308' || ch === '\u0300' || ch === '\u0301' || ch === '\u0302')) {
              ch = this.map[text.charAt(i - 1) + ch];
              ret.pop();
            } else {
              ch = this.map[ch];
              if (typeof(ch) === "undefined") {
                ch = text.charAt(i);
              }
            }
            if (ch === '\n') {
              newLines.push(ret.reverse().join(""));
              ret = [];
            } else {
              ret.push(ch);
            }
          }
          newLines.push(ret.reverse().join(""));
          return newLines.join("\n");
        },
        decode: function(text) {
          var ret = [],
            ch, newLines = [];
          for (var i = 0, len = text.length; i < len; i++) {
            ch = text.charAt(i);
            if (i > 0 && (ch === '\u0308' || ch === '\u0300' || ch === '\u0301' || ch === '\u0302')) {
              ch = this.map[text.charAt(i - 1) + ch];
              ret.pop();
            } else {
              ch = this.map[ch];
              if (typeof(ch) === "undefined") {
                ch = text.charAt(i);
              }
            }
            if (ch === '\n') {
              newLines.push(ret.reverse().join(""));
              ret = [];
            } else {
              ret.push(ch);
            }
          }
          newLines.push(ret.reverse().join(""));
          return newLines.join("\n");
        },
        map: {
          'a': 'É’',
          'b': 'd',
          'c': 'É”',
          'e': 'É˜',
          'f': 'áŽ¸',
          'g': 'Ç«',
          'h': 'Êœ',
          'j': 'êž',
          'k': 'Êž',
          'l': '|',
          'n': 'á´Ž',
          'p': 'q',
          'r': 'É¿',
          's': 'ê™…',
          't': 'Æš',
          'y': 'Ê',
          'z': 'Æ¹',
          'B': 'á™ ',
          'C': 'Æ†',
          'D': 'á—¡',
          'E': 'ÆŽ',
          'F': 'êŸ»',
          'G': 'áŽ®',
          'J': 'á‚±',
          'K': 'â‹Š',
          'L': 'â…ƒ',
          'N': 'Í¶',
          'P': 'êŸ¼',
          'Q': 'á»Œ',
          'R': 'Ð¯',
          'S': 'ê™„',
          'Z': 'Æ¸',
          '1': '',
          '2': '',
          '3': '',
          '4': '',
          '5': '',
          '6': '',
          '7': '',
          '&': '',
          ';': '',
          '[': ']',
          '(': ')',
          '{': '}',
          '?': 'â¸®',
          '<': '>',
          'Ã¤': 'É’' + '\u0308',
          'ÃŸ': 'á™ ',
          'Â´': '`',
          'Ã©': 'É˜' + '\u0300',
          'Ã¡': 'É’' + '\u0300',
          'Ã³': 'Ã²',
          'Ãº': 'Ã¹',
          'Ã‰': 'ÆŽ' + '\u0300',
          'Ã': 'Ã€',
          'Ã“': 'Ã’',
          'Ãš': 'Ã™',
          '`': 'Â´',
          'Ã¨': 'É˜' + '\u0301',
          'Ã ': 'É’' + '\u0301',
          'Ãˆ': 'ÆŽ' + '\u0301',
          'Ãª': 'É˜' + '\u0302',
          'Ã¢': 'É’' + '\u0302',
          'ÃŠ': 'ÆŽ' + '\u0302',
          'Ã˜': 'á´“',
          'Ã¸': 'á´“'
        }
      },
      creepify: {
        init: function() {
          for (var i = 768; i <= 789; i++) {
            this.diacriticsTop.push(String.fromCharCode(i));
          }
          for (var i = 790; i <= 819; i++) {
            if (i != 794 && i != 795) {
              this.diacriticsBottom.push(String.fromCharCode(i));
            }
          }
          this.diacriticsTop.push(String.fromCharCode(794));
          this.diacriticsTop.push(String.fromCharCode(795));
          for (var i = 820; i <= 824; i++) {
            this.diacriticsMiddle.push(String.fromCharCode(i));
          }
          for (var i = 825; i <= 828; i++) {
            this.diacriticsBottom.push(String.fromCharCode(i));
          }
          for (var i = 829; i <= 836; i++) {
            this.diacriticsTop.push(String.fromCharCode(i));
          }
          this.diacriticsTop.push(String.fromCharCode(836));
          this.diacriticsBottom.push(String.fromCharCode(837));
          this.diacriticsTop.push(String.fromCharCode(838));
          this.diacriticsBottom.push(String.fromCharCode(839));
          this.diacriticsBottom.push(String.fromCharCode(840));
          this.diacriticsBottom.push(String.fromCharCode(841));
          this.diacriticsTop.push(String.fromCharCode(842));
          this.diacriticsTop.push(String.fromCharCode(843));
          this.diacriticsTop.push(String.fromCharCode(844));
          this.diacriticsBottom.push(String.fromCharCode(845));
          this.diacriticsBottom.push(String.fromCharCode(846));
          this.diacriticsTop.push(String.fromCharCode(848));
          this.diacriticsTop.push(String.fromCharCode(849));
          this.diacriticsTop.push(String.fromCharCode(850));
          this.diacriticsBottom.push(String.fromCharCode(851));
          this.diacriticsBottom.push(String.fromCharCode(852));
          this.diacriticsBottom.push(String.fromCharCode(853));
          this.diacriticsBottom.push(String.fromCharCode(854));
          this.diacriticsTop.push(String.fromCharCode(855));
          this.diacriticsTop.push(String.fromCharCode(856));
          this.diacriticsBottom.push(String.fromCharCode(857));
          this.diacriticsBottom.push(String.fromCharCode(858));
          this.diacriticsTop.push(String.fromCharCode(859));
          this.diacriticsBottom.push(String.fromCharCode(860));
          this.diacriticsTop.push(String.fromCharCode(861));
          this.diacriticsTop.push(String.fromCharCode(861));
          this.diacriticsBottom.push(String.fromCharCode(863));
          this.diacriticsTop.push(String.fromCharCode(864));
          this.diacriticsTop.push(String.fromCharCode(865));
        },
        encode: function(text) {
          var newText = '',
            newChar;
          for (var i in text) {
            newChar = text[i];
            if (this.options.middle) {
              newChar += this.diacriticsMiddle[Math.floor(Math.random() * this.diacriticsMiddle.length)]
            }
            if (this.options.top) {
              var diacriticsTopLength = this.diacriticsTop.length - 1;
              for (var count = 0, len = this.options.maxHeight - Math.random() * ((this.options.randomization /
                  100) * this.options.maxHeight); count < len; count++) {
                newChar += this.diacriticsTop[Math.floor(Math.random() * diacriticsTopLength)]
              }
            }
            if (this.options.bottom) {
              var diacriticsBottomLength = this.diacriticsBottom.length - 1;
              for (var count = 0, len = this.options.maxHeight - Math.random() * ((this.options.randomization /
                  100) * this.options.maxHeight); count < len; count++) {
                newChar += this.diacriticsBottom[Math.floor(Math.random() * diacriticsBottomLength)]
              }
            }
            newText += newChar;
          }
          return newText;
        },
        decode: function(text) {
          var newText = '',
            charCode;
          for (var i in text) {
            charCode = text[i].charCodeAt(0);
            if (charCode < 768 || charCode > 865) {
              newText += text[i];
            }
          }
          return newText;
        },
        diacriticsTop: [],
        diacriticsMiddle: [],
        diacriticsBottom: [],
        options: {
          top: true,
          middle: true,
          bottom: true,
          maxHeight: 15,
          randomization: 100
        }
      },
      bubbles: {
        init: function() {
          for (var i = 49; i <= 57; i++) {
            this.map[String.fromCharCode(i)] = String.fromCharCode(i + 9263);
          }
          this.map['0'] = '\u24ea';
          for (var i = 65; i <= 90; i++) {
            this.map[String.fromCharCode(i)] = String.fromCharCode(i + 9333);
          }
          for (var i = 97; i <= 122; i++) {
            this.map[String.fromCharCode(i)] = String.fromCharCode(i + 9327);
          }
          for (var i in this.map) {
            this.mapInverse[this.map[i]] = i;
          }
        },
        encode: function(text) {
          var ret = "",
            ch, first = true;
          for (var i in text) {
            ch = this.map[text[i]];
            if ((typeof(ch) === "undefined")) {
              if (text[i].charCodeAt(0) >= 33) {
                ch = text[i] + String.fromCharCode(8413);
                if (!first) {
                  ch = String.fromCharCode(8239) + String.fromCharCode(160) + String.fromCharCode(160) + String
                    .fromCharCode(8239) + ch;
                }
              } else {
                ch = text[i];
              }
            }
            ret += ch;
            first = (ch === '\n');
          }
          return ret;
        },
        decode: function(text) {
          var ret = "",
            ch, newRet = '';
          for (var i in text) {
            ch = this.mapInverse[text[i]];
            ret += ((typeof(ch) === "undefined") ? text[i] : ch);
          }
          for (var i in ret) {
            ch = ret[i].charCodeAt(0);
            if (ch != 160 && ch != 8239 && ch != 8413) {
              newRet += ret[i];
            }
          }
          return newRet;
        },
        map: {},
        mapInverse: {}
      },
      squares: {
        init: function() {},
        encode: function(text) {
          var ret = "",
            ch, first = true;
          for (var i in text) {
            if (text[i].charCodeAt(0) >= 33) {
              ch = text[i] + String.fromCharCode(8414);
              if (!first) {
                ch = String.fromCharCode(8239) + String.fromCharCode(160) + String.fromCharCode(160) + String
                  .fromCharCode(8239) + ch;
              }
            } else {
              ch = text[i];
            }
            ret += ch;
            first = (ch === '\n');
          }
          return ret;
        },
        decode: function(text) {
          var ret = "",
            ch;
          for (var i in text) {
            ch = text[i].charCodeAt(0);
            if (ch != 160 && ch != 8239 && ch != 8414) {
              ret += text[i];
            }
          }
          return ret;
        }
      },
      roundsquares: {
        init: function() {},
        encode: function(text) {
          var ret = "",
            ch, first = true;
          for (var i in text) {
            if (text[i].charCodeAt(0) >= 33) {
              ch = text[i] + String.fromCharCode(8419);
              if (!first) {
                ch = String.fromCharCode(160) + String.fromCharCode(160) + String.fromCharCode(160) + ch;
              }
            } else {
              ch = text[i];
            }
            ret += ch;
            first = (ch === '\n');
          }
          return ret;
        },
        decode: function(text) {
          var ret = "",
            ch;
          for (var i in text) {
            ch = text[i].charCodeAt(0);
            if (ch != 160 && ch != 8239 && ch != 8419) {
              ret += text[i];
            }
          }
          return ret;
        }
      },
      bent: {
        init: function() {
          for (var i in this.map) {
            this.map[this.map[i]] = i;
          }
        },
        encode: function(text) {
          var ret = '',
            ch;
          for (var i = 0, len = text.length; i < len; i++) {
            ch = this.map[text.charAt(i)];
            if (typeof(ch) === "undefined") {
              ch = text.charAt(i);
            }
            ret += ch;
          }
          return ret;
        },
        decode: function(text) {
          var ret = '',
            ch;
          for (var i = 0, len = text.length; i < len; i++) {
            ch = this.map[text.charAt(i)];
            if (typeof(ch) === "undefined") {
              ch = text.charAt(i);
            }
            ret += ch;
          }
          return ret;
        },
        map: {
          'a': 'Ä…',
          'b': 'Ò',
          'c': 'Ã§',
          'd': 'Õª',
          'e': 'Ò½',
          'f': 'Æ’',
          'g': 'Ö',
          'h': 'Õ°',
          'i': 'Ã¬',
          'j': 'Ê',
          'k': 'ÒŸ',
          'l': 'Ó€',
          'm': 'Ê',
          'n': 'Õ²',
          'o': 'Ö…',
          'p': 'Ö„',
          'q': 'Õ¦',
          'r': 'É¾',
          's': 'Ê‚',
          't': 'Õ§',
          'u': 'Õ´',
          'v': 'Ñµ',
          'w': 'Õ¡',
          'x': 'Ã—',
          'y': 'Õ¾',
          'z': 'Õ€',
          'A': 'Èº',
          'B': 'Î²',
          'C': 'â†»',
          'D': 'áŽ ',
          'E': 'Æ',
          'F': 'Æ‘',
          'G': 'Æ“',
          'H': 'Ç¶',
          'I': 'Ä¯',
          'J': 'Ù„',
          'K': 'Ò ',
          'L': 'êˆ',
          'M': 'â±®',
          'N': 'áž ',
          'O': 'à¶§',
          'P': 'Ï†',
          'Q': 'Ò¨',
          'R': 'à½ ',
          'S': 'Ïš',
          'T': 'Í²',
          'U': 'Ô±',
          'V': 'á»¼',
          'W': 'à°š',
          'X': 'áƒ¯',
          'Y': 'Ó‹',
          'Z': 'É€',
          '0': 'âŠ˜',
          '1': 'ï¿½ï¿½',
          '2': 'Ï©',
          '3': 'Ó ',
          '4': 'à¥«',
          '5': 'Æ¼',
          '6': 'Ï¬',
          '7': '7',
          '8': 'ï¿½ï¿½',
          '9': 'à¥¯',
          '&': 'â…‹',
          '(': '{',
          ')': '}',
          '{': '(',
          '}': ')',
          'Ã¤': 'Ä…' + '\u0308',
          'Ã¶': 'Ö…' + '\u0308',
          'Ã¼': 'Õ´' + '\u0308',
          'Ã„': 'Èº' + '\u0308',
          'Ã–': 'à¶§' + '\u0308',
          'Ãœ': 'Ô±' + '\u0308',
          'Ã©': 'Ò½' + '\u0301',
          'Ã¡': 'Ä…' + '\u0301',
          'Ã³': 'Ö…' + '\u0301',
          'Ãº': 'Õ´' + '\u0301',
          'Ã‰': 'Æ' + '\u0301',
          'Ã': 'Èº' + '\u0301',
          'Ã“': 'à¶§' + '\u0301',
          'Ãš': 'Ô±' + '\u0301',
          'Ã¨': 'Ò½' + '\u0300',
          'Ã ': 'Ä…' + '\u0300',
          'Ã²': 'Ö…' + '\u0300',
          'Ã¹': 'Õ´' + '\u0300',
          'Ãˆ': 'Æ' + '\u0300',
          'Ã€': 'Èº' + '\u0300',
          'Ã’': 'à¶§' + '\u0300',
          'Ã™': 'Ô±' + '\u0300',
          'Ãª': 'Ò½' + '\u0302',
          'Ã¢': 'Ä…' + '\u0302',
          'Ã´': 'Ö…' + '\u0302',
          'Ã»': 'Õ´' + '\u0302',
          'ÃŠ': 'Æ' + '\u0302',
          'Ã‚': 'Èº' + '\u0302',
          'Ã”': 'à¶§' + '\u0302',
          'Ã›': 'Ô±' + '\u0302'
        }
      },
      tiny: {
        init: function() {
          for (var i in this.map) {
            this.map[this.map[i]] = i;
          }
        },
        encode: function(text) {
          var ret = '',
            ch;
          text = text.toUpperCase();
          for (var i = 0, len = text.length; i < len; i++) {
            ch = this.map[text.charAt(i)];
            if (typeof(ch) === "undefined") {
              ch = text.charAt(i);
            }
            ret += ch;
          }
          return ret;
        },
        decode: function(text) {
          var ret = '',
            ch;
          for (var i = 0, len = text.length; i < len; i++) {
            ch = this.map[text.charAt(i)];
            if (typeof(ch) === "undefined") {
              ch = text.charAt(i);
            }
            ret += ch;
          }
          return ret;
        },
        map: {
          'A': 'á´€',
          'B': 'Ê™',
          'C': 'á´„',
          'D': 'á´…',
          'E': 'á´‡',
          'F': 'êœ°',
          'G': 'É¢',
          'H': 'Êœ',
          'I': 'Éª',
          'J': 'á´Š',
          'K': 'á´‹',
          'L': 'ÊŸ',
          'M': 'á´',
          'N': 'É´',
          'O': 'á´',
          'P': 'á´˜',
          'Q': 'Q',
          'R': 'Ê€',
          'S': 'êœ±',
          'T': 'á´›',
          'U': 'á´œ',
          'V': 'á´ ',
          'W': 'á´¡',
          'X': 'x',
          'Y': 'Ê',
          'Z': 'á´¢'
        }
      }
    };
    for (var i in this.tools) {
      this.tools[i].init();
    }
    this.getHTML = function(text) {
      var html = '',
        ch, lastSpaceWasNonBreaking = true,
        highSurrogate = 0,
        codepoint = 0;
      for (var i = 0, len = text.length; i < len; i++) {
        ch = text.charCodeAt(i);
        if (ch === 10 || ch === 13) {
          html += '<br>\n';
          lastSpaceWasNonBreaking = true;
        } else if (ch === 32) {
          if (lastSpaceWasNonBreaking) {
            html += ' ';
            lastSpaceWasNonBreaking = false;
          } else {
            html += '&nbsp;';
            lastSpaceWasNonBreaking = true;
          }
        } else {
          if (ch >= 0xD800 && ch <= 0xDBFF) {
            highSurrogate = ch;
            codepoint = 0;
          } else if (highSurrogate > 0) {
            if (ch >= 0xDC00 && ch <= 0xDFFF) {
              codepoint = (highSurrogate - 0xD800) * 1024 + (ch - 0xDC00) + 0x10000;
            }
            highSurrogate = 0;
          } else {
            codepoint = ch;
          }
          if (codepoint != 0) {
            html += '&#x' + codepoint.toString(16) + ';';
            lastSpaceWasNonBreaking = true;
          }
        }
      }
      return html;
    }
  }
}
export {
  Lunicode
};
