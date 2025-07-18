globalThis.Intl = globalThis.Intl || {};


// Intl.getCanonicalLocales
(function() {
  // node_modules/tslib/tslib.es6.js
  var __assign = function() {
    __assign = Object.assign || function __assign2(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
      }
      return t;
    };
    return __assign.apply(this, arguments);
  };
  function __spreadArray(to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
      to[j] = from[i];
    return to;
  }

  // bazel-out/darwin-fastbuild/bin/packages/intl-getcanonicallocales/lib/src/parser.js
  var ALPHANUM_1_8 = /^[a-z0-9]{1,8}$/i;
  var ALPHANUM_2_8 = /^[a-z0-9]{2,8}$/i;
  var ALPHANUM_3_8 = /^[a-z0-9]{3,8}$/i;
  var KEY_REGEX = /^[a-z0-9][a-z]$/i;
  var TYPE_REGEX = /^[a-z0-9]{3,8}$/i;
  var ALPHA_4 = /^[a-z]{4}$/i;
  var OTHER_EXTENSION_TYPE = /^[0-9a-svwyz]$/i;
  var UNICODE_REGION_SUBTAG_REGEX = /^([a-z]{2}|[0-9]{3})$/i;
  var UNICODE_VARIANT_SUBTAG_REGEX = /^([a-z0-9]{5,8}|[0-9][a-z0-9]{3})$/i;
  var UNICODE_LANGUAGE_SUBTAG_REGEX = /^([a-z]{2,3}|[a-z]{5,8})$/i;
  var TKEY_REGEX = /^[a-z][0-9]$/i;
  var SEPARATOR = "-";
  function isUnicodeLanguageSubtag(lang) {
    return UNICODE_LANGUAGE_SUBTAG_REGEX.test(lang);
  }
  function isUnicodeRegionSubtag(region) {
    return UNICODE_REGION_SUBTAG_REGEX.test(region);
  }
  function isUnicodeScriptSubtag(script) {
    return ALPHA_4.test(script);
  }
  function isUnicodeVariantSubtag(variant) {
    return UNICODE_VARIANT_SUBTAG_REGEX.test(variant);
  }
  function parseUnicodeLanguageId(chunks) {
    if (typeof chunks === "string") {
      chunks = chunks.split(SEPARATOR);
    }
    var lang = chunks.shift();
    if (!lang) {
      throw new RangeError("Missing unicode_language_subtag");
    }
    if (lang === "root") {
      return {lang: "root", variants: []};
    }
    if (!isUnicodeLanguageSubtag(lang)) {
      throw new RangeError("Malformed unicode_language_subtag");
    }
    var script;
    if (chunks.length && isUnicodeScriptSubtag(chunks[0])) {
      script = chunks.shift();
    }
    var region;
    if (chunks.length && isUnicodeRegionSubtag(chunks[0])) {
      region = chunks.shift();
    }
    var variants = {};
    while (chunks.length && isUnicodeVariantSubtag(chunks[0])) {
      var variant = chunks.shift();
      if (variant in variants) {
        throw new RangeError('Duplicate variant "' + variant + '"');
      }
      variants[variant] = 1;
    }
    return {
      lang: lang,
      script: script,
      region: region,
      variants: Object.keys(variants)
    };
  }
  function parseUnicodeExtension(chunks) {
    var keywords = [];
    var keyword;
    while (chunks.length && (keyword = parseKeyword(chunks))) {
      keywords.push(keyword);
    }
    if (keywords.length) {
      return {
        type: "u",
        keywords: keywords,
        attributes: []
      };
    }
    var attributes = [];
    while (chunks.length && ALPHANUM_3_8.test(chunks[0])) {
      attributes.push(chunks.shift());
    }
    while (chunks.length && (keyword = parseKeyword(chunks))) {
      keywords.push(keyword);
    }
    if (keywords.length || attributes.length) {
      return {
        type: "u",
        attributes: attributes,
        keywords: keywords
      };
    }
    throw new RangeError("Malformed unicode_extension");
  }
  function parseKeyword(chunks) {
    var key;
    if (!KEY_REGEX.test(chunks[0])) {
      return;
    }
    key = chunks.shift();
    var type = [];
    while (chunks.length && TYPE_REGEX.test(chunks[0])) {
      type.push(chunks.shift());
    }
    var value = "";
    if (type.length) {
      value = type.join(SEPARATOR);
    }
    return [key, value];
  }
  function parseTransformedExtension(chunks) {
    var lang;
    try {
      lang = parseUnicodeLanguageId(chunks);
    } catch (e) {
    }
    var fields = [];
    while (chunks.length && TKEY_REGEX.test(chunks[0])) {
      var key = chunks.shift();
      var value = [];
      while (chunks.length && ALPHANUM_3_8.test(chunks[0])) {
        value.push(chunks.shift());
      }
      if (!value.length) {
        throw new RangeError('Missing tvalue for tkey "' + key + '"');
      }
      fields.push([key, value.join(SEPARATOR)]);
    }
    if (fields.length) {
      return {
        type: "t",
        fields: fields,
        lang: lang
      };
    }
    throw new RangeError("Malformed transformed_extension");
  }
  function parsePuExtension(chunks) {
    var exts = [];
    while (chunks.length && ALPHANUM_1_8.test(chunks[0])) {
      exts.push(chunks.shift());
    }
    if (exts.length) {
      return {
        type: "x",
        value: exts.join(SEPARATOR)
      };
    }
    throw new RangeError("Malformed private_use_extension");
  }
  function parseOtherExtensionValue(chunks) {
    var exts = [];
    while (chunks.length && ALPHANUM_2_8.test(chunks[0])) {
      exts.push(chunks.shift());
    }
    if (exts.length) {
      return exts.join(SEPARATOR);
    }
    return "";
  }
  function parseExtensions(chunks) {
    if (!chunks.length) {
      return {extensions: []};
    }
    var extensions = [];
    var unicodeExtension;
    var transformedExtension;
    var puExtension;
    var otherExtensionMap = {};
    do {
      var type = chunks.shift();
      switch (type) {
        case "u":
        case "U":
          if (unicodeExtension) {
            throw new RangeError("There can only be 1 -u- extension");
          }
          unicodeExtension = parseUnicodeExtension(chunks);
          extensions.push(unicodeExtension);
          break;
        case "t":
        case "T":
          if (transformedExtension) {
            throw new RangeError("There can only be 1 -t- extension");
          }
          transformedExtension = parseTransformedExtension(chunks);
          extensions.push(transformedExtension);
          break;
        case "x":
        case "X":
          if (puExtension) {
            throw new RangeError("There can only be 1 -x- extension");
          }
          puExtension = parsePuExtension(chunks);
          extensions.push(puExtension);
          break;
        default:
          if (!OTHER_EXTENSION_TYPE.test(type)) {
            throw new RangeError("Malformed extension type");
          }
          if (type in otherExtensionMap) {
            throw new RangeError("There can only be 1 -" + type + "- extension");
          }
          var extension = {
            type: type,
            value: parseOtherExtensionValue(chunks)
          };
          otherExtensionMap[extension.type] = extension;
          extensions.push(extension);
          break;
      }
    } while (chunks.length);
    return {extensions: extensions};
  }
  function parseUnicodeLocaleId(locale) {
    var chunks = locale.split(SEPARATOR);
    var lang = parseUnicodeLanguageId(chunks);
    return __assign({lang: lang}, parseExtensions(chunks));
  }

  // bazel-out/darwin-fastbuild/bin/packages/intl-getcanonicallocales/lib/src/emitter.js
  function emitUnicodeLanguageId(lang) {
    if (!lang) {
      return "";
    }
    return __spreadArray([lang.lang, lang.script, lang.region], lang.variants || []).filter(Boolean).join("-");
  }
  function emitUnicodeLocaleId(_a) {
    var lang = _a.lang, extensions = _a.extensions;
    var chunks = [emitUnicodeLanguageId(lang)];
    for (var _i = 0, extensions_1 = extensions; _i < extensions_1.length; _i++) {
      var ext = extensions_1[_i];
      chunks.push(ext.type);
      switch (ext.type) {
        case "u":
          chunks.push.apply(chunks, __spreadArray(__spreadArray([], ext.attributes), ext.keywords.reduce(function(all, kv) {
            return all.concat(kv);
          }, [])));
          break;
        case "t":
          chunks.push.apply(chunks, __spreadArray([emitUnicodeLanguageId(ext.lang)], ext.fields.reduce(function(all, kv) {
            return all.concat(kv);
          }, [])));
          break;
        default:
          chunks.push(ext.value);
          break;
      }
    }
    return chunks.filter(Boolean).join("-");
  }

  // bazel-out/darwin-fastbuild/bin/packages/intl-getcanonicallocales/lib/src/data/aliases.js
  var languageAlias = {
    "aa-saaho": "ssy",
    "aam": "aas",
    "aar": "aa",
    "abk": "ab",
    "adp": "dz",
    "afr": "af",
    "agp": "apf",
    "ais": "ami",
    "aju": "jrb",
    "aka": "ak",
    "alb": "sq",
    "als": "sq",
    "amh": "am",
    "ara": "ar",
    "arb": "ar",
    "arg": "an",
    "arm": "hy",
    "art-lojban": "jbo",
    "asd": "snz",
    "asm": "as",
    "aue": "ktz",
    "ava": "av",
    "ave": "ae",
    "aym": "ay",
    "ayr": "ay",
    "ayx": "nun",
    "aze": "az",
    "azj": "az",
    "bak": "ba",
    "bam": "bm",
    "baq": "eu",
    "baz": "nvo",
    "bcc": "bal",
    "bcl": "bik",
    "bel": "be",
    "ben": "bn",
    "bgm": "bcg",
    "bh": "bho",
    "bhk": "fbl",
    "bih": "bho",
    "bis": "bi",
    "bjd": "drl",
    "bjq": "bzc",
    "bkb": "ebk",
    "bod": "bo",
    "bos": "bs",
    "bre": "br",
    "btb": "beb",
    "bul": "bg",
    "bur": "my",
    "bxk": "luy",
    "bxr": "bua",
    "cat": "ca",
    "ccq": "rki",
    "cel-gaulish": "xtg",
    "ces": "cs",
    "cha": "ch",
    "che": "ce",
    "chi": "zh",
    "chu": "cu",
    "chv": "cv",
    "cjr": "mom",
    "cka": "cmr",
    "cld": "syr",
    "cmk": "xch",
    "cmn": "zh",
    "cnr": "sr-ME",
    "cor": "kw",
    "cos": "co",
    "coy": "pij",
    "cqu": "quh",
    "cre": "cr",
    "cwd": "cr",
    "cym": "cy",
    "cze": "cs",
    "daf": "dnj",
    "dan": "da",
    "dap": "njz",
    "deu": "de",
    "dgo": "doi",
    "dhd": "mwr",
    "dik": "din",
    "diq": "zza",
    "dit": "dif",
    "div": "dv",
    "djl": "dze",
    "dkl": "aqd",
    "drh": "mn",
    "drr": "kzk",
    "drw": "fa-AF",
    "dud": "uth",
    "duj": "dwu",
    "dut": "nl",
    "dwl": "dbt",
    "dzo": "dz",
    "ekk": "et",
    "ell": "el",
    "elp": "amq",
    "emk": "man",
    "en-GB-oed": "en-GB-oxendict",
    "eng": "en",
    "epo": "eo",
    "esk": "ik",
    "est": "et",
    "eus": "eu",
    "ewe": "ee",
    "fao": "fo",
    "fas": "fa",
    "fat": "ak",
    "fij": "fj",
    "fin": "fi",
    "fra": "fr",
    "fre": "fr",
    "fry": "fy",
    "fuc": "ff",
    "ful": "ff",
    "gav": "dev",
    "gaz": "om",
    "gbc": "wny",
    "gbo": "grb",
    "geo": "ka",
    "ger": "de",
    "gfx": "vaj",
    "ggn": "gvr",
    "ggo": "esg",
    "ggr": "gtu",
    "gio": "aou",
    "gla": "gd",
    "gle": "ga",
    "glg": "gl",
    "gli": "kzk",
    "glv": "gv",
    "gno": "gon",
    "gre": "el",
    "grn": "gn",
    "gti": "nyc",
    "gug": "gn",
    "guj": "gu",
    "guv": "duz",
    "gya": "gba",
    "hat": "ht",
    "hau": "ha",
    "hbs": "sr-Latn",
    "hdn": "hai",
    "hea": "hmn",
    "heb": "he",
    "her": "hz",
    "him": "srx",
    "hin": "hi",
    "hmo": "ho",
    "hrr": "jal",
    "hrv": "hr",
    "hun": "hu",
    "hy-arevmda": "hyw",
    "hye": "hy",
    "i-ami": "ami",
    "i-bnn": "bnn",
    "i-default": "en-x-i-default",
    "i-enochian": "und-x-i-enochian",
    "i-hak": "hak",
    "i-klingon": "tlh",
    "i-lux": "lb",
    "i-mingo": "see-x-i-mingo",
    "i-navajo": "nv",
    "i-pwn": "pwn",
    "i-tao": "tao",
    "i-tay": "tay",
    "i-tsu": "tsu",
    "ibi": "opa",
    "ibo": "ig",
    "ice": "is",
    "ido": "io",
    "iii": "ii",
    "ike": "iu",
    "iku": "iu",
    "ile": "ie",
    "ill": "ilm",
    "ilw": "gal",
    "in": "id",
    "ina": "ia",
    "ind": "id",
    "ipk": "ik",
    "isl": "is",
    "ita": "it",
    "iw": "he",
    "izi": "eza",
    "jar": "jgk",
    "jav": "jv",
    "jeg": "oyb",
    "ji": "yi",
    "jpn": "ja",
    "jw": "jv",
    "kal": "kl",
    "kan": "kn",
    "kas": "ks",
    "kat": "ka",
    "kau": "kr",
    "kaz": "kk",
    "kdv": "zkd",
    "kgc": "tdf",
    "kgd": "ncq",
    "kgh": "kml",
    "khk": "mn",
    "khm": "km",
    "kik": "ki",
    "kin": "rw",
    "kir": "ky",
    "kmr": "ku",
    "knc": "kr",
    "kng": "kg",
    "knn": "kok",
    "koj": "kwv",
    "kom": "kv",
    "kon": "kg",
    "kor": "ko",
    "kpp": "jkm",
    "kpv": "kv",
    "krm": "bmf",
    "ktr": "dtp",
    "kua": "kj",
    "kur": "ku",
    "kvs": "gdj",
    "kwq": "yam",
    "kxe": "tvd",
    "kxl": "kru",
    "kzh": "dgl",
    "kzj": "dtp",
    "kzt": "dtp",
    "lao": "lo",
    "lat": "la",
    "lav": "lv",
    "lbk": "bnc",
    "leg": "enl",
    "lii": "raq",
    "lim": "li",
    "lin": "ln",
    "lit": "lt",
    "llo": "ngt",
    "lmm": "rmx",
    "ltz": "lb",
    "lub": "lu",
    "lug": "lg",
    "lvs": "lv",
    "mac": "mk",
    "mah": "mh",
    "mal": "ml",
    "mao": "mi",
    "mar": "mr",
    "may": "ms",
    "meg": "cir",
    "mgx": "jbk",
    "mhr": "chm",
    "mkd": "mk",
    "mlg": "mg",
    "mlt": "mt",
    "mnk": "man",
    "mnt": "wnn",
    "mo": "ro",
    "mof": "xnt",
    "mol": "ro",
    "mon": "mn",
    "mri": "mi",
    "msa": "ms",
    "mst": "mry",
    "mup": "raj",
    "mwd": "dmw",
    "mwj": "vaj",
    "mya": "my",
    "myd": "aog",
    "myt": "mry",
    "nad": "xny",
    "nau": "na",
    "nav": "nv",
    "nbf": "nru",
    "nbl": "nr",
    "nbx": "ekc",
    "ncp": "kdz",
    "nde": "nd",
    "ndo": "ng",
    "nep": "ne",
    "nld": "nl",
    "nln": "azd",
    "nlr": "nrk",
    "nno": "nn",
    "nns": "nbr",
    "nnx": "ngv",
    "no-bok": "nb",
    "no-bokmal": "nb",
    "no-nyn": "nn",
    "no-nynorsk": "nn",
    "nob": "nb",
    "noo": "dtd",
    "nor": "no",
    "npi": "ne",
    "nts": "pij",
    "nxu": "bpp",
    "nya": "ny",
    "oci": "oc",
    "ojg": "oj",
    "oji": "oj",
    "ori": "or",
    "orm": "om",
    "ory": "or",
    "oss": "os",
    "oun": "vaj",
    "pan": "pa",
    "pbu": "ps",
    "pcr": "adx",
    "per": "fa",
    "pes": "fa",
    "pli": "pi",
    "plt": "mg",
    "pmc": "huw",
    "pmu": "phr",
    "pnb": "lah",
    "pol": "pl",
    "por": "pt",
    "ppa": "bfy",
    "ppr": "lcq",
    "prs": "fa-AF",
    "pry": "prt",
    "pus": "ps",
    "puz": "pub",
    "que": "qu",
    "quz": "qu",
    "rmr": "emx",
    "rmy": "rom",
    "roh": "rm",
    "ron": "ro",
    "rum": "ro",
    "run": "rn",
    "rus": "ru",
    "sag": "sg",
    "san": "sa",
    "sap": "aqt",
    "sca": "hle",
    "scc": "sr",
    "scr": "hr",
    "sgl": "isk",
    "sgn-BE-FR": "sfb",
    "sgn-BE-NL": "vgt",
    "sgn-BR": "bzs",
    "sgn-CH-DE": "sgg",
    "sgn-CO": "csn",
    "sgn-DE": "gsg",
    "sgn-DK": "dsl",
    "sgn-ES": "ssp",
    "sgn-FR": "fsl",
    "sgn-GB": "bfi",
    "sgn-GR": "gss",
    "sgn-IE": "isg",
    "sgn-IT": "ise",
    "sgn-JP": "jsl",
    "sgn-MX": "mfs",
    "sgn-NI": "ncs",
    "sgn-NL": "dse",
    "sgn-NO": "nsi",
    "sgn-PT": "psr",
    "sgn-SE": "swl",
    "sgn-US": "ase",
    "sgn-ZA": "sfs",
    "sh": "sr-Latn",
    "sin": "si",
    "skk": "oyb",
    "slk": "sk",
    "slo": "sk",
    "slv": "sl",
    "sme": "se",
    "smo": "sm",
    "sna": "sn",
    "snd": "sd",
    "som": "so",
    "sot": "st",
    "spa": "es",
    "spy": "kln",
    "sqi": "sq",
    "src": "sc",
    "srd": "sc",
    "srp": "sr",
    "ssw": "ss",
    "sul": "sgd",
    "sum": "ulw",
    "sun": "su",
    "swa": "sw",
    "swc": "sw-CD",
    "swe": "sv",
    "swh": "sw",
    "tah": "ty",
    "tam": "ta",
    "tat": "tt",
    "tdu": "dtp",
    "tel": "te",
    "tgg": "bjp",
    "tgk": "tg",
    "tgl": "fil",
    "tha": "th",
    "thc": "tpo",
    "thw": "ola",
    "thx": "oyb",
    "tib": "bo",
    "tid": "itd",
    "tie": "ras",
    "tir": "ti",
    "tkk": "twm",
    "tl": "fil",
    "tlw": "weo",
    "tmp": "tyj",
    "tne": "kak",
    "tnf": "fa-AF",
    "ton": "to",
    "tsf": "taj",
    "tsn": "tn",
    "tso": "ts",
    "ttq": "tmh",
    "tuk": "tk",
    "tur": "tr",
    "tw": "ak",
    "twi": "ak",
    "uig": "ug",
    "ukr": "uk",
    "umu": "del",
    "und-aaland": "und-AX",
    "und-arevela": "und",
    "und-arevmda": "und",
    "und-bokmal": "und",
    "und-hakka": "und",
    "und-hepburn-heploc": "und-alalc97",
    "und-lojban": "und",
    "und-nynorsk": "und",
    "und-saaho": "und",
    "und-xiang": "und",
    "unp": "wro",
    "uok": "ema",
    "urd": "ur",
    "uzb": "uz",
    "uzn": "uz",
    "ven": "ve",
    "vie": "vi",
    "vol": "vo",
    "wel": "cy",
    "wgw": "wgb",
    "wit": "nol",
    "wiw": "nwo",
    "wln": "wa",
    "wol": "wo",
    "xba": "cax",
    "xho": "xh",
    "xia": "acn",
    "xkh": "waw",
    "xpe": "kpe",
    "xrq": "dmw",
    "xsj": "suj",
    "xsl": "den",
    "ybd": "rki",
    "ydd": "yi",
    "yen": "ynq",
    "yid": "yi",
    "yiy": "yrm",
    "yma": "lrr",
    "ymt": "mtm",
    "yor": "yo",
    "yos": "zom",
    "yuu": "yug",
    "zai": "zap",
    "zh-cmn": "zh",
    "zh-cmn-Hans": "zh-Hans",
    "zh-cmn-Hant": "zh-Hant",
    "zh-gan": "gan",
    "zh-guoyu": "zh",
    "zh-hakka": "hak",
    "zh-min": "nan-x-zh-min",
    "zh-min-nan": "nan",
    "zh-wuu": "wuu",
    "zh-xiang": "hsn",
    "zh-yue": "yue",
    "zha": "za",
    "zho": "zh",
    "zir": "scv",
    "zsm": "ms",
    "zul": "zu",
    "zyb": "za"
  };
  var territoryAlias = {
    "100": "BG",
    "104": "MM",
    "108": "BI",
    "112": "BY",
    "116": "KH",
    "120": "CM",
    "124": "CA",
    "132": "CV",
    "136": "KY",
    "140": "CF",
    "144": "LK",
    "148": "TD",
    "152": "CL",
    "156": "CN",
    "158": "TW",
    "162": "CX",
    "166": "CC",
    "170": "CO",
    "172": "RU AM AZ BY GE KG KZ MD TJ TM UA UZ",
    "174": "KM",
    "175": "YT",
    "178": "CG",
    "180": "CD",
    "184": "CK",
    "188": "CR",
    "191": "HR",
    "192": "CU",
    "196": "CY",
    "200": "CZ SK",
    "203": "CZ",
    "204": "BJ",
    "208": "DK",
    "212": "DM",
    "214": "DO",
    "218": "EC",
    "222": "SV",
    "226": "GQ",
    "230": "ET",
    "231": "ET",
    "232": "ER",
    "233": "EE",
    "234": "FO",
    "238": "FK",
    "239": "GS",
    "242": "FJ",
    "246": "FI",
    "248": "AX",
    "249": "FR",
    "250": "FR",
    "254": "GF",
    "258": "PF",
    "260": "TF",
    "262": "DJ",
    "266": "GA",
    "268": "GE",
    "270": "GM",
    "275": "PS",
    "276": "DE",
    "278": "DE",
    "280": "DE",
    "288": "GH",
    "292": "GI",
    "296": "KI",
    "300": "GR",
    "304": "GL",
    "308": "GD",
    "312": "GP",
    "316": "GU",
    "320": "GT",
    "324": "GN",
    "328": "GY",
    "332": "HT",
    "334": "HM",
    "336": "VA",
    "340": "HN",
    "344": "HK",
    "348": "HU",
    "352": "IS",
    "356": "IN",
    "360": "ID",
    "364": "IR",
    "368": "IQ",
    "372": "IE",
    "376": "IL",
    "380": "IT",
    "384": "CI",
    "388": "JM",
    "392": "JP",
    "398": "KZ",
    "400": "JO",
    "404": "KE",
    "408": "KP",
    "410": "KR",
    "414": "KW",
    "417": "KG",
    "418": "LA",
    "422": "LB",
    "426": "LS",
    "428": "LV",
    "430": "LR",
    "434": "LY",
    "438": "LI",
    "440": "LT",
    "442": "LU",
    "446": "MO",
    "450": "MG",
    "454": "MW",
    "458": "MY",
    "462": "MV",
    "466": "ML",
    "470": "MT",
    "474": "MQ",
    "478": "MR",
    "480": "MU",
    "484": "MX",
    "492": "MC",
    "496": "MN",
    "498": "MD",
    "499": "ME",
    "500": "MS",
    "504": "MA",
    "508": "MZ",
    "512": "OM",
    "516": "NA",
    "520": "NR",
    "524": "NP",
    "528": "NL",
    "530": "CW SX BQ",
    "531": "CW",
    "532": "CW SX BQ",
    "533": "AW",
    "534": "SX",
    "535": "BQ",
    "536": "SA IQ",
    "540": "NC",
    "548": "VU",
    "554": "NZ",
    "558": "NI",
    "562": "NE",
    "566": "NG",
    "570": "NU",
    "574": "NF",
    "578": "NO",
    "580": "MP",
    "581": "UM",
    "582": "FM MH MP PW",
    "583": "FM",
    "584": "MH",
    "585": "PW",
    "586": "PK",
    "591": "PA",
    "598": "PG",
    "600": "PY",
    "604": "PE",
    "608": "PH",
    "612": "PN",
    "616": "PL",
    "620": "PT",
    "624": "GW",
    "626": "TL",
    "630": "PR",
    "634": "QA",
    "638": "RE",
    "642": "RO",
    "643": "RU",
    "646": "RW",
    "652": "BL",
    "654": "SH",
    "659": "KN",
    "660": "AI",
    "662": "LC",
    "663": "MF",
    "666": "PM",
    "670": "VC",
    "674": "SM",
    "678": "ST",
    "682": "SA",
    "686": "SN",
    "688": "RS",
    "690": "SC",
    "694": "SL",
    "702": "SG",
    "703": "SK",
    "704": "VN",
    "705": "SI",
    "706": "SO",
    "710": "ZA",
    "716": "ZW",
    "720": "YE",
    "724": "ES",
    "728": "SS",
    "729": "SD",
    "732": "EH",
    "736": "SD",
    "740": "SR",
    "744": "SJ",
    "748": "SZ",
    "752": "SE",
    "756": "CH",
    "760": "SY",
    "762": "TJ",
    "764": "TH",
    "768": "TG",
    "772": "TK",
    "776": "TO",
    "780": "TT",
    "784": "AE",
    "788": "TN",
    "792": "TR",
    "795": "TM",
    "796": "TC",
    "798": "TV",
    "800": "UG",
    "804": "UA",
    "807": "MK",
    "810": "RU AM AZ BY EE GE KZ KG LV LT MD TJ TM UA UZ",
    "818": "EG",
    "826": "GB",
    "830": "JE GG",
    "831": "GG",
    "832": "JE",
    "833": "IM",
    "834": "TZ",
    "840": "US",
    "850": "VI",
    "854": "BF",
    "858": "UY",
    "860": "UZ",
    "862": "VE",
    "876": "WF",
    "882": "WS",
    "886": "YE",
    "887": "YE",
    "890": "RS ME SI HR MK BA",
    "891": "RS ME",
    "894": "ZM",
    "958": "AA",
    "959": "QM",
    "960": "QN",
    "962": "QP",
    "963": "QQ",
    "964": "QR",
    "965": "QS",
    "966": "QT",
    "967": "EU",
    "968": "QV",
    "969": "QW",
    "970": "QX",
    "971": "QY",
    "972": "QZ",
    "973": "XA",
    "974": "XB",
    "975": "XC",
    "976": "XD",
    "977": "XE",
    "978": "XF",
    "979": "XG",
    "980": "XH",
    "981": "XI",
    "982": "XJ",
    "983": "XK",
    "984": "XL",
    "985": "XM",
    "986": "XN",
    "987": "XO",
    "988": "XP",
    "989": "XQ",
    "990": "XR",
    "991": "XS",
    "992": "XT",
    "993": "XU",
    "994": "XV",
    "995": "XW",
    "996": "XX",
    "997": "XY",
    "998": "XZ",
    "999": "ZZ",
    "004": "AF",
    "008": "AL",
    "010": "AQ",
    "012": "DZ",
    "016": "AS",
    "020": "AD",
    "024": "AO",
    "028": "AG",
    "031": "AZ",
    "032": "AR",
    "036": "AU",
    "040": "AT",
    "044": "BS",
    "048": "BH",
    "050": "BD",
    "051": "AM",
    "052": "BB",
    "056": "BE",
    "060": "BM",
    "062": "034 143",
    "064": "BT",
    "068": "BO",
    "070": "BA",
    "072": "BW",
    "074": "BV",
    "076": "BR",
    "084": "BZ",
    "086": "IO",
    "090": "SB",
    "092": "VG",
    "096": "BN",
    "AAA": "AA",
    "ABW": "AW",
    "AFG": "AF",
    "AGO": "AO",
    "AIA": "AI",
    "ALA": "AX",
    "ALB": "AL",
    "AN": "CW SX BQ",
    "AND": "AD",
    "ANT": "CW SX BQ",
    "ARE": "AE",
    "ARG": "AR",
    "ARM": "AM",
    "ASC": "AC",
    "ASM": "AS",
    "ATA": "AQ",
    "ATF": "TF",
    "ATG": "AG",
    "AUS": "AU",
    "AUT": "AT",
    "AZE": "AZ",
    "BDI": "BI",
    "BEL": "BE",
    "BEN": "BJ",
    "BES": "BQ",
    "BFA": "BF",
    "BGD": "BD",
    "BGR": "BG",
    "BHR": "BH",
    "BHS": "BS",
    "BIH": "BA",
    "BLM": "BL",
    "BLR": "BY",
    "BLZ": "BZ",
    "BMU": "BM",
    "BOL": "BO",
    "BRA": "BR",
    "BRB": "BB",
    "BRN": "BN",
    "BTN": "BT",
    "BU": "MM",
    "BUR": "MM",
    "BVT": "BV",
    "BWA": "BW",
    "CAF": "CF",
    "CAN": "CA",
    "CCK": "CC",
    "CHE": "CH",
    "CHL": "CL",
    "CHN": "CN",
    "CIV": "CI",
    "CMR": "CM",
    "COD": "CD",
    "COG": "CG",
    "COK": "CK",
    "COL": "CO",
    "COM": "KM",
    "CPT": "CP",
    "CPV": "CV",
    "CRI": "CR",
    "CS": "RS ME",
    "CT": "KI",
    "CUB": "CU",
    "CUW": "CW",
    "CXR": "CX",
    "CYM": "KY",
    "CYP": "CY",
    "CZE": "CZ",
    "DD": "DE",
    "DDR": "DE",
    "DEU": "DE",
    "DGA": "DG",
    "DJI": "DJ",
    "DMA": "DM",
    "DNK": "DK",
    "DOM": "DO",
    "DY": "BJ",
    "DZA": "DZ",
    "ECU": "EC",
    "EGY": "EG",
    "ERI": "ER",
    "ESH": "EH",
    "ESP": "ES",
    "EST": "EE",
    "ETH": "ET",
    "FIN": "FI",
    "FJI": "FJ",
    "FLK": "FK",
    "FQ": "AQ TF",
    "FRA": "FR",
    "FRO": "FO",
    "FSM": "FM",
    "FX": "FR",
    "FXX": "FR",
    "GAB": "GA",
    "GBR": "GB",
    "GEO": "GE",
    "GGY": "GG",
    "GHA": "GH",
    "GIB": "GI",
    "GIN": "GN",
    "GLP": "GP",
    "GMB": "GM",
    "GNB": "GW",
    "GNQ": "GQ",
    "GRC": "GR",
    "GRD": "GD",
    "GRL": "GL",
    "GTM": "GT",
    "GUF": "GF",
    "GUM": "GU",
    "GUY": "GY",
    "HKG": "HK",
    "HMD": "HM",
    "HND": "HN",
    "HRV": "HR",
    "HTI": "HT",
    "HUN": "HU",
    "HV": "BF",
    "IDN": "ID",
    "IMN": "IM",
    "IND": "IN",
    "IOT": "IO",
    "IRL": "IE",
    "IRN": "IR",
    "IRQ": "IQ",
    "ISL": "IS",
    "ISR": "IL",
    "ITA": "IT",
    "JAM": "JM",
    "JEY": "JE",
    "JOR": "JO",
    "JPN": "JP",
    "JT": "UM",
    "KAZ": "KZ",
    "KEN": "KE",
    "KGZ": "KG",
    "KHM": "KH",
    "KIR": "KI",
    "KNA": "KN",
    "KOR": "KR",
    "KWT": "KW",
    "LAO": "LA",
    "LBN": "LB",
    "LBR": "LR",
    "LBY": "LY",
    "LCA": "LC",
    "LIE": "LI",
    "LKA": "LK",
    "LSO": "LS",
    "LTU": "LT",
    "LUX": "LU",
    "LVA": "LV",
    "MAC": "MO",
    "MAF": "MF",
    "MAR": "MA",
    "MCO": "MC",
    "MDA": "MD",
    "MDG": "MG",
    "MDV": "MV",
    "MEX": "MX",
    "MHL": "MH",
    "MI": "UM",
    "MKD": "MK",
    "MLI": "ML",
    "MLT": "MT",
    "MMR": "MM",
    "MNE": "ME",
    "MNG": "MN",
    "MNP": "MP",
    "MOZ": "MZ",
    "MRT": "MR",
    "MSR": "MS",
    "MTQ": "MQ",
    "MUS": "MU",
    "MWI": "MW",
    "MYS": "MY",
    "MYT": "YT",
    "NAM": "NA",
    "NCL": "NC",
    "NER": "NE",
    "NFK": "NF",
    "NGA": "NG",
    "NH": "VU",
    "NIC": "NI",
    "NIU": "NU",
    "NLD": "NL",
    "NOR": "NO",
    "NPL": "NP",
    "NQ": "AQ",
    "NRU": "NR",
    "NT": "SA IQ",
    "NTZ": "SA IQ",
    "NZL": "NZ",
    "OMN": "OM",
    "PAK": "PK",
    "PAN": "PA",
    "PC": "FM MH MP PW",
    "PCN": "PN",
    "PER": "PE",
    "PHL": "PH",
    "PLW": "PW",
    "PNG": "PG",
    "POL": "PL",
    "PRI": "PR",
    "PRK": "KP",
    "PRT": "PT",
    "PRY": "PY",
    "PSE": "PS",
    "PU": "UM",
    "PYF": "PF",
    "PZ": "PA",
    "QAT": "QA",
    "QMM": "QM",
    "QNN": "QN",
    "QPP": "QP",
    "QQQ": "QQ",
    "QRR": "QR",
    "QSS": "QS",
    "QTT": "QT",
    "QU": "EU",
    "QUU": "EU",
    "QVV": "QV",
    "QWW": "QW",
    "QXX": "QX",
    "QYY": "QY",
    "QZZ": "QZ",
    "REU": "RE",
    "RH": "ZW",
    "ROU": "RO",
    "RUS": "RU",
    "RWA": "RW",
    "SAU": "SA",
    "SCG": "RS ME",
    "SDN": "SD",
    "SEN": "SN",
    "SGP": "SG",
    "SGS": "GS",
    "SHN": "SH",
    "SJM": "SJ",
    "SLB": "SB",
    "SLE": "SL",
    "SLV": "SV",
    "SMR": "SM",
    "SOM": "SO",
    "SPM": "PM",
    "SRB": "RS",
    "SSD": "SS",
    "STP": "ST",
    "SU": "RU AM AZ BY EE GE KZ KG LV LT MD TJ TM UA UZ",
    "SUN": "RU AM AZ BY EE GE KZ KG LV LT MD TJ TM UA UZ",
    "SUR": "SR",
    "SVK": "SK",
    "SVN": "SI",
    "SWE": "SE",
    "SWZ": "SZ",
    "SXM": "SX",
    "SYC": "SC",
    "SYR": "SY",
    "TAA": "TA",
    "TCA": "TC",
    "TCD": "TD",
    "TGO": "TG",
    "THA": "TH",
    "TJK": "TJ",
    "TKL": "TK",
    "TKM": "TM",
    "TLS": "TL",
    "TMP": "TL",
    "TON": "TO",
    "TP": "TL",
    "TTO": "TT",
    "TUN": "TN",
    "TUR": "TR",
    "TUV": "TV",
    "TWN": "TW",
    "TZA": "TZ",
    "UGA": "UG",
    "UK": "GB",
    "UKR": "UA",
    "UMI": "UM",
    "URY": "UY",
    "USA": "US",
    "UZB": "UZ",
    "VAT": "VA",
    "VCT": "VC",
    "VD": "VN",
    "VEN": "VE",
    "VGB": "VG",
    "VIR": "VI",
    "VNM": "VN",
    "VUT": "VU",
    "WK": "UM",
    "WLF": "WF",
    "WSM": "WS",
    "XAA": "XA",
    "XBB": "XB",
    "XCC": "XC",
    "XDD": "XD",
    "XEE": "XE",
    "XFF": "XF",
    "XGG": "XG",
    "XHH": "XH",
    "XII": "XI",
    "XJJ": "XJ",
    "XKK": "XK",
    "XLL": "XL",
    "XMM": "XM",
    "XNN": "XN",
    "XOO": "XO",
    "XPP": "XP",
    "XQQ": "XQ",
    "XRR": "XR",
    "XSS": "XS",
    "XTT": "XT",
    "XUU": "XU",
    "XVV": "XV",
    "XWW": "XW",
    "XXX": "XX",
    "XYY": "XY",
    "XZZ": "XZ",
    "YD": "YE",
    "YEM": "YE",
    "YMD": "YE",
    "YU": "RS ME",
    "YUG": "RS ME",
    "ZAF": "ZA",
    "ZAR": "CD",
    "ZMB": "ZM",
    "ZR": "CD",
    "ZWE": "ZW",
    "ZZZ": "ZZ"
  };
  var scriptAlias = {
    "Qaai": "Zinh"
  };
  var variantAlias = {
    "heploc": "alalc97",
    "polytoni": "polyton"
  };

  // node_modules/cldr-core/supplemental/likelySubtags.json
  var supplemental = {
    version: {
      _unicodeVersion: "13.0.0",
      _cldrVersion: "39"
    },
    likelySubtags: {
      aa: "aa-Latn-ET",
      aai: "aai-Latn-ZZ",
      aak: "aak-Latn-ZZ",
      aau: "aau-Latn-ZZ",
      ab: "ab-Cyrl-GE",
      abi: "abi-Latn-ZZ",
      abq: "abq-Cyrl-ZZ",
      abr: "abr-Latn-GH",
      abt: "abt-Latn-ZZ",
      aby: "aby-Latn-ZZ",
      acd: "acd-Latn-ZZ",
      ace: "ace-Latn-ID",
      ach: "ach-Latn-UG",
      ada: "ada-Latn-GH",
      ade: "ade-Latn-ZZ",
      adj: "adj-Latn-ZZ",
      adp: "adp-Tibt-BT",
      ady: "ady-Cyrl-RU",
      adz: "adz-Latn-ZZ",
      ae: "ae-Avst-IR",
      aeb: "aeb-Arab-TN",
      aey: "aey-Latn-ZZ",
      af: "af-Latn-ZA",
      agc: "agc-Latn-ZZ",
      agd: "agd-Latn-ZZ",
      agg: "agg-Latn-ZZ",
      agm: "agm-Latn-ZZ",
      ago: "ago-Latn-ZZ",
      agq: "agq-Latn-CM",
      aha: "aha-Latn-ZZ",
      ahl: "ahl-Latn-ZZ",
      aho: "aho-Ahom-IN",
      ajg: "ajg-Latn-ZZ",
      ak: "ak-Latn-GH",
      akk: "akk-Xsux-IQ",
      ala: "ala-Latn-ZZ",
      ali: "ali-Latn-ZZ",
      aln: "aln-Latn-XK",
      alt: "alt-Cyrl-RU",
      am: "am-Ethi-ET",
      amm: "amm-Latn-ZZ",
      amn: "amn-Latn-ZZ",
      amo: "amo-Latn-NG",
      amp: "amp-Latn-ZZ",
      an: "an-Latn-ES",
      anc: "anc-Latn-ZZ",
      ank: "ank-Latn-ZZ",
      ann: "ann-Latn-ZZ",
      any: "any-Latn-ZZ",
      aoj: "aoj-Latn-ZZ",
      aom: "aom-Latn-ZZ",
      aoz: "aoz-Latn-ID",
      apc: "apc-Arab-ZZ",
      apd: "apd-Arab-TG",
      ape: "ape-Latn-ZZ",
      apr: "apr-Latn-ZZ",
      aps: "aps-Latn-ZZ",
      apz: "apz-Latn-ZZ",
      ar: "ar-Arab-EG",
      arc: "arc-Armi-IR",
      "arc-Nbat": "arc-Nbat-JO",
      "arc-Palm": "arc-Palm-SY",
      arh: "arh-Latn-ZZ",
      arn: "arn-Latn-CL",
      aro: "aro-Latn-BO",
      arq: "arq-Arab-DZ",
      ars: "ars-Arab-SA",
      ary: "ary-Arab-MA",
      arz: "arz-Arab-EG",
      as: "as-Beng-IN",
      asa: "asa-Latn-TZ",
      ase: "ase-Sgnw-US",
      asg: "asg-Latn-ZZ",
      aso: "aso-Latn-ZZ",
      ast: "ast-Latn-ES",
      ata: "ata-Latn-ZZ",
      atg: "atg-Latn-ZZ",
      atj: "atj-Latn-CA",
      auy: "auy-Latn-ZZ",
      av: "av-Cyrl-RU",
      avl: "avl-Arab-ZZ",
      avn: "avn-Latn-ZZ",
      avt: "avt-Latn-ZZ",
      avu: "avu-Latn-ZZ",
      awa: "awa-Deva-IN",
      awb: "awb-Latn-ZZ",
      awo: "awo-Latn-ZZ",
      awx: "awx-Latn-ZZ",
      ay: "ay-Latn-BO",
      ayb: "ayb-Latn-ZZ",
      az: "az-Latn-AZ",
      "az-Arab": "az-Arab-IR",
      "az-IQ": "az-Arab-IQ",
      "az-IR": "az-Arab-IR",
      "az-RU": "az-Cyrl-RU",
      ba: "ba-Cyrl-RU",
      bal: "bal-Arab-PK",
      ban: "ban-Latn-ID",
      bap: "bap-Deva-NP",
      bar: "bar-Latn-AT",
      bas: "bas-Latn-CM",
      bav: "bav-Latn-ZZ",
      bax: "bax-Bamu-CM",
      bba: "bba-Latn-ZZ",
      bbb: "bbb-Latn-ZZ",
      bbc: "bbc-Latn-ID",
      bbd: "bbd-Latn-ZZ",
      bbj: "bbj-Latn-CM",
      bbp: "bbp-Latn-ZZ",
      bbr: "bbr-Latn-ZZ",
      bcf: "bcf-Latn-ZZ",
      bch: "bch-Latn-ZZ",
      bci: "bci-Latn-CI",
      bcm: "bcm-Latn-ZZ",
      bcn: "bcn-Latn-ZZ",
      bco: "bco-Latn-ZZ",
      bcq: "bcq-Ethi-ZZ",
      bcu: "bcu-Latn-ZZ",
      bdd: "bdd-Latn-ZZ",
      be: "be-Cyrl-BY",
      bef: "bef-Latn-ZZ",
      beh: "beh-Latn-ZZ",
      bej: "bej-Arab-SD",
      bem: "bem-Latn-ZM",
      bet: "bet-Latn-ZZ",
      bew: "bew-Latn-ID",
      bex: "bex-Latn-ZZ",
      bez: "bez-Latn-TZ",
      bfd: "bfd-Latn-CM",
      bfq: "bfq-Taml-IN",
      bft: "bft-Arab-PK",
      bfy: "bfy-Deva-IN",
      bg: "bg-Cyrl-BG",
      bgc: "bgc-Deva-IN",
      bgn: "bgn-Arab-PK",
      bgx: "bgx-Grek-TR",
      bhb: "bhb-Deva-IN",
      bhg: "bhg-Latn-ZZ",
      bhi: "bhi-Deva-IN",
      bhl: "bhl-Latn-ZZ",
      bho: "bho-Deva-IN",
      bhy: "bhy-Latn-ZZ",
      bi: "bi-Latn-VU",
      bib: "bib-Latn-ZZ",
      big: "big-Latn-ZZ",
      bik: "bik-Latn-PH",
      bim: "bim-Latn-ZZ",
      bin: "bin-Latn-NG",
      bio: "bio-Latn-ZZ",
      biq: "biq-Latn-ZZ",
      bjh: "bjh-Latn-ZZ",
      bji: "bji-Ethi-ZZ",
      bjj: "bjj-Deva-IN",
      bjn: "bjn-Latn-ID",
      bjo: "bjo-Latn-ZZ",
      bjr: "bjr-Latn-ZZ",
      bjt: "bjt-Latn-SN",
      bjz: "bjz-Latn-ZZ",
      bkc: "bkc-Latn-ZZ",
      bkm: "bkm-Latn-CM",
      bkq: "bkq-Latn-ZZ",
      bku: "bku-Latn-PH",
      bkv: "bkv-Latn-ZZ",
      blt: "blt-Tavt-VN",
      bm: "bm-Latn-ML",
      bmh: "bmh-Latn-ZZ",
      bmk: "bmk-Latn-ZZ",
      bmq: "bmq-Latn-ML",
      bmu: "bmu-Latn-ZZ",
      bn: "bn-Beng-BD",
      bng: "bng-Latn-ZZ",
      bnm: "bnm-Latn-ZZ",
      bnp: "bnp-Latn-ZZ",
      bo: "bo-Tibt-CN",
      boj: "boj-Latn-ZZ",
      bom: "bom-Latn-ZZ",
      bon: "bon-Latn-ZZ",
      bpy: "bpy-Beng-IN",
      bqc: "bqc-Latn-ZZ",
      bqi: "bqi-Arab-IR",
      bqp: "bqp-Latn-ZZ",
      bqv: "bqv-Latn-CI",
      br: "br-Latn-FR",
      bra: "bra-Deva-IN",
      brh: "brh-Arab-PK",
      brx: "brx-Deva-IN",
      brz: "brz-Latn-ZZ",
      bs: "bs-Latn-BA",
      bsj: "bsj-Latn-ZZ",
      bsq: "bsq-Bass-LR",
      bss: "bss-Latn-CM",
      bst: "bst-Ethi-ZZ",
      bto: "bto-Latn-PH",
      btt: "btt-Latn-ZZ",
      btv: "btv-Deva-PK",
      bua: "bua-Cyrl-RU",
      buc: "buc-Latn-YT",
      bud: "bud-Latn-ZZ",
      bug: "bug-Latn-ID",
      buk: "buk-Latn-ZZ",
      bum: "bum-Latn-CM",
      buo: "buo-Latn-ZZ",
      bus: "bus-Latn-ZZ",
      buu: "buu-Latn-ZZ",
      bvb: "bvb-Latn-GQ",
      bwd: "bwd-Latn-ZZ",
      bwr: "bwr-Latn-ZZ",
      bxh: "bxh-Latn-ZZ",
      bye: "bye-Latn-ZZ",
      byn: "byn-Ethi-ER",
      byr: "byr-Latn-ZZ",
      bys: "bys-Latn-ZZ",
      byv: "byv-Latn-CM",
      byx: "byx-Latn-ZZ",
      bza: "bza-Latn-ZZ",
      bze: "bze-Latn-ML",
      bzf: "bzf-Latn-ZZ",
      bzh: "bzh-Latn-ZZ",
      bzw: "bzw-Latn-ZZ",
      ca: "ca-Latn-ES",
      cad: "cad-Latn-US",
      can: "can-Latn-ZZ",
      cbj: "cbj-Latn-ZZ",
      cch: "cch-Latn-NG",
      ccp: "ccp-Cakm-BD",
      ce: "ce-Cyrl-RU",
      ceb: "ceb-Latn-PH",
      cfa: "cfa-Latn-ZZ",
      cgg: "cgg-Latn-UG",
      ch: "ch-Latn-GU",
      chk: "chk-Latn-FM",
      chm: "chm-Cyrl-RU",
      cho: "cho-Latn-US",
      chp: "chp-Latn-CA",
      chr: "chr-Cher-US",
      cic: "cic-Latn-US",
      cja: "cja-Arab-KH",
      cjm: "cjm-Cham-VN",
      cjv: "cjv-Latn-ZZ",
      ckb: "ckb-Arab-IQ",
      ckl: "ckl-Latn-ZZ",
      cko: "cko-Latn-ZZ",
      cky: "cky-Latn-ZZ",
      cla: "cla-Latn-ZZ",
      cme: "cme-Latn-ZZ",
      cmg: "cmg-Soyo-MN",
      co: "co-Latn-FR",
      cop: "cop-Copt-EG",
      cps: "cps-Latn-PH",
      cr: "cr-Cans-CA",
      crh: "crh-Cyrl-UA",
      crj: "crj-Cans-CA",
      crk: "crk-Cans-CA",
      crl: "crl-Cans-CA",
      crm: "crm-Cans-CA",
      crs: "crs-Latn-SC",
      cs: "cs-Latn-CZ",
      csb: "csb-Latn-PL",
      csw: "csw-Cans-CA",
      ctd: "ctd-Pauc-MM",
      cu: "cu-Cyrl-RU",
      "cu-Glag": "cu-Glag-BG",
      cv: "cv-Cyrl-RU",
      cy: "cy-Latn-GB",
      da: "da-Latn-DK",
      dad: "dad-Latn-ZZ",
      daf: "daf-Latn-CI",
      dag: "dag-Latn-ZZ",
      dah: "dah-Latn-ZZ",
      dak: "dak-Latn-US",
      dar: "dar-Cyrl-RU",
      dav: "dav-Latn-KE",
      dbd: "dbd-Latn-ZZ",
      dbq: "dbq-Latn-ZZ",
      dcc: "dcc-Arab-IN",
      ddn: "ddn-Latn-ZZ",
      de: "de-Latn-DE",
      ded: "ded-Latn-ZZ",
      den: "den-Latn-CA",
      dga: "dga-Latn-ZZ",
      dgh: "dgh-Latn-ZZ",
      dgi: "dgi-Latn-ZZ",
      dgl: "dgl-Arab-ZZ",
      dgr: "dgr-Latn-CA",
      dgz: "dgz-Latn-ZZ",
      dia: "dia-Latn-ZZ",
      dje: "dje-Latn-NE",
      dmf: "dmf-Medf-NG",
      dnj: "dnj-Latn-CI",
      dob: "dob-Latn-ZZ",
      doi: "doi-Deva-IN",
      dop: "dop-Latn-ZZ",
      dow: "dow-Latn-ZZ",
      drh: "drh-Mong-CN",
      dri: "dri-Latn-ZZ",
      drs: "drs-Ethi-ZZ",
      dsb: "dsb-Latn-DE",
      dtm: "dtm-Latn-ML",
      dtp: "dtp-Latn-MY",
      dts: "dts-Latn-ZZ",
      dty: "dty-Deva-NP",
      dua: "dua-Latn-CM",
      duc: "duc-Latn-ZZ",
      dud: "dud-Latn-ZZ",
      dug: "dug-Latn-ZZ",
      dv: "dv-Thaa-MV",
      dva: "dva-Latn-ZZ",
      dww: "dww-Latn-ZZ",
      dyo: "dyo-Latn-SN",
      dyu: "dyu-Latn-BF",
      dz: "dz-Tibt-BT",
      dzg: "dzg-Latn-ZZ",
      ebu: "ebu-Latn-KE",
      ee: "ee-Latn-GH",
      efi: "efi-Latn-NG",
      egl: "egl-Latn-IT",
      egy: "egy-Egyp-EG",
      eka: "eka-Latn-ZZ",
      eky: "eky-Kali-MM",
      el: "el-Grek-GR",
      ema: "ema-Latn-ZZ",
      emi: "emi-Latn-ZZ",
      en: "en-Latn-US",
      "en-Shaw": "en-Shaw-GB",
      enn: "enn-Latn-ZZ",
      enq: "enq-Latn-ZZ",
      eo: "eo-Latn-001",
      eri: "eri-Latn-ZZ",
      es: "es-Latn-ES",
      esg: "esg-Gonm-IN",
      esu: "esu-Latn-US",
      et: "et-Latn-EE",
      etr: "etr-Latn-ZZ",
      ett: "ett-Ital-IT",
      etu: "etu-Latn-ZZ",
      etx: "etx-Latn-ZZ",
      eu: "eu-Latn-ES",
      ewo: "ewo-Latn-CM",
      ext: "ext-Latn-ES",
      eza: "eza-Latn-ZZ",
      fa: "fa-Arab-IR",
      faa: "faa-Latn-ZZ",
      fab: "fab-Latn-ZZ",
      fag: "fag-Latn-ZZ",
      fai: "fai-Latn-ZZ",
      fan: "fan-Latn-GQ",
      ff: "ff-Latn-SN",
      "ff-Adlm": "ff-Adlm-GN",
      ffi: "ffi-Latn-ZZ",
      ffm: "ffm-Latn-ML",
      fi: "fi-Latn-FI",
      fia: "fia-Arab-SD",
      fil: "fil-Latn-PH",
      fit: "fit-Latn-SE",
      fj: "fj-Latn-FJ",
      flr: "flr-Latn-ZZ",
      fmp: "fmp-Latn-ZZ",
      fo: "fo-Latn-FO",
      fod: "fod-Latn-ZZ",
      fon: "fon-Latn-BJ",
      for: "for-Latn-ZZ",
      fpe: "fpe-Latn-ZZ",
      fqs: "fqs-Latn-ZZ",
      fr: "fr-Latn-FR",
      frc: "frc-Latn-US",
      frp: "frp-Latn-FR",
      frr: "frr-Latn-DE",
      frs: "frs-Latn-DE",
      fub: "fub-Arab-CM",
      fud: "fud-Latn-WF",
      fue: "fue-Latn-ZZ",
      fuf: "fuf-Latn-GN",
      fuh: "fuh-Latn-ZZ",
      fuq: "fuq-Latn-NE",
      fur: "fur-Latn-IT",
      fuv: "fuv-Latn-NG",
      fuy: "fuy-Latn-ZZ",
      fvr: "fvr-Latn-SD",
      fy: "fy-Latn-NL",
      ga: "ga-Latn-IE",
      gaa: "gaa-Latn-GH",
      gaf: "gaf-Latn-ZZ",
      gag: "gag-Latn-MD",
      gah: "gah-Latn-ZZ",
      gaj: "gaj-Latn-ZZ",
      gam: "gam-Latn-ZZ",
      gan: "gan-Hans-CN",
      gaw: "gaw-Latn-ZZ",
      gay: "gay-Latn-ID",
      gba: "gba-Latn-ZZ",
      gbf: "gbf-Latn-ZZ",
      gbm: "gbm-Deva-IN",
      gby: "gby-Latn-ZZ",
      gbz: "gbz-Arab-IR",
      gcr: "gcr-Latn-GF",
      gd: "gd-Latn-GB",
      gde: "gde-Latn-ZZ",
      gdn: "gdn-Latn-ZZ",
      gdr: "gdr-Latn-ZZ",
      geb: "geb-Latn-ZZ",
      gej: "gej-Latn-ZZ",
      gel: "gel-Latn-ZZ",
      gez: "gez-Ethi-ET",
      gfk: "gfk-Latn-ZZ",
      ggn: "ggn-Deva-NP",
      ghs: "ghs-Latn-ZZ",
      gil: "gil-Latn-KI",
      gim: "gim-Latn-ZZ",
      gjk: "gjk-Arab-PK",
      gjn: "gjn-Latn-ZZ",
      gju: "gju-Arab-PK",
      gkn: "gkn-Latn-ZZ",
      gkp: "gkp-Latn-ZZ",
      gl: "gl-Latn-ES",
      glk: "glk-Arab-IR",
      gmm: "gmm-Latn-ZZ",
      gmv: "gmv-Ethi-ZZ",
      gn: "gn-Latn-PY",
      gnd: "gnd-Latn-ZZ",
      gng: "gng-Latn-ZZ",
      god: "god-Latn-ZZ",
      gof: "gof-Ethi-ZZ",
      goi: "goi-Latn-ZZ",
      gom: "gom-Deva-IN",
      gon: "gon-Telu-IN",
      gor: "gor-Latn-ID",
      gos: "gos-Latn-NL",
      got: "got-Goth-UA",
      grb: "grb-Latn-ZZ",
      grc: "grc-Cprt-CY",
      "grc-Linb": "grc-Linb-GR",
      grt: "grt-Beng-IN",
      grw: "grw-Latn-ZZ",
      gsw: "gsw-Latn-CH",
      gu: "gu-Gujr-IN",
      gub: "gub-Latn-BR",
      guc: "guc-Latn-CO",
      gud: "gud-Latn-ZZ",
      gur: "gur-Latn-GH",
      guw: "guw-Latn-ZZ",
      gux: "gux-Latn-ZZ",
      guz: "guz-Latn-KE",
      gv: "gv-Latn-IM",
      gvf: "gvf-Latn-ZZ",
      gvr: "gvr-Deva-NP",
      gvs: "gvs-Latn-ZZ",
      gwc: "gwc-Arab-ZZ",
      gwi: "gwi-Latn-CA",
      gwt: "gwt-Arab-ZZ",
      gyi: "gyi-Latn-ZZ",
      ha: "ha-Latn-NG",
      "ha-CM": "ha-Arab-CM",
      "ha-SD": "ha-Arab-SD",
      hag: "hag-Latn-ZZ",
      hak: "hak-Hans-CN",
      ham: "ham-Latn-ZZ",
      haw: "haw-Latn-US",
      haz: "haz-Arab-AF",
      hbb: "hbb-Latn-ZZ",
      hdy: "hdy-Ethi-ZZ",
      he: "he-Hebr-IL",
      hhy: "hhy-Latn-ZZ",
      hi: "hi-Deva-IN",
      hia: "hia-Latn-ZZ",
      hif: "hif-Latn-FJ",
      hig: "hig-Latn-ZZ",
      hih: "hih-Latn-ZZ",
      hil: "hil-Latn-PH",
      hla: "hla-Latn-ZZ",
      hlu: "hlu-Hluw-TR",
      hmd: "hmd-Plrd-CN",
      hmt: "hmt-Latn-ZZ",
      hnd: "hnd-Arab-PK",
      hne: "hne-Deva-IN",
      hnj: "hnj-Hmng-LA",
      hnn: "hnn-Latn-PH",
      hno: "hno-Arab-PK",
      ho: "ho-Latn-PG",
      hoc: "hoc-Deva-IN",
      hoj: "hoj-Deva-IN",
      hot: "hot-Latn-ZZ",
      hr: "hr-Latn-HR",
      hsb: "hsb-Latn-DE",
      hsn: "hsn-Hans-CN",
      ht: "ht-Latn-HT",
      hu: "hu-Latn-HU",
      hui: "hui-Latn-ZZ",
      hy: "hy-Armn-AM",
      hz: "hz-Latn-NA",
      ia: "ia-Latn-001",
      ian: "ian-Latn-ZZ",
      iar: "iar-Latn-ZZ",
      iba: "iba-Latn-MY",
      ibb: "ibb-Latn-NG",
      iby: "iby-Latn-ZZ",
      ica: "ica-Latn-ZZ",
      ich: "ich-Latn-ZZ",
      id: "id-Latn-ID",
      idd: "idd-Latn-ZZ",
      idi: "idi-Latn-ZZ",
      idu: "idu-Latn-ZZ",
      ife: "ife-Latn-TG",
      ig: "ig-Latn-NG",
      igb: "igb-Latn-ZZ",
      ige: "ige-Latn-ZZ",
      ii: "ii-Yiii-CN",
      ijj: "ijj-Latn-ZZ",
      ik: "ik-Latn-US",
      ikk: "ikk-Latn-ZZ",
      ikt: "ikt-Latn-CA",
      ikw: "ikw-Latn-ZZ",
      ikx: "ikx-Latn-ZZ",
      ilo: "ilo-Latn-PH",
      imo: "imo-Latn-ZZ",
      in: "in-Latn-ID",
      inh: "inh-Cyrl-RU",
      io: "io-Latn-001",
      iou: "iou-Latn-ZZ",
      iri: "iri-Latn-ZZ",
      is: "is-Latn-IS",
      it: "it-Latn-IT",
      iu: "iu-Cans-CA",
      iw: "iw-Hebr-IL",
      iwm: "iwm-Latn-ZZ",
      iws: "iws-Latn-ZZ",
      izh: "izh-Latn-RU",
      izi: "izi-Latn-ZZ",
      ja: "ja-Jpan-JP",
      jab: "jab-Latn-ZZ",
      jam: "jam-Latn-JM",
      jar: "jar-Latn-ZZ",
      jbo: "jbo-Latn-001",
      jbu: "jbu-Latn-ZZ",
      jen: "jen-Latn-ZZ",
      jgk: "jgk-Latn-ZZ",
      jgo: "jgo-Latn-CM",
      ji: "ji-Hebr-UA",
      jib: "jib-Latn-ZZ",
      jmc: "jmc-Latn-TZ",
      jml: "jml-Deva-NP",
      jra: "jra-Latn-ZZ",
      jut: "jut-Latn-DK",
      jv: "jv-Latn-ID",
      jw: "jw-Latn-ID",
      ka: "ka-Geor-GE",
      kaa: "kaa-Cyrl-UZ",
      kab: "kab-Latn-DZ",
      kac: "kac-Latn-MM",
      kad: "kad-Latn-ZZ",
      kai: "kai-Latn-ZZ",
      kaj: "kaj-Latn-NG",
      kam: "kam-Latn-KE",
      kao: "kao-Latn-ML",
      kbd: "kbd-Cyrl-RU",
      kbm: "kbm-Latn-ZZ",
      kbp: "kbp-Latn-ZZ",
      kbq: "kbq-Latn-ZZ",
      kbx: "kbx-Latn-ZZ",
      kby: "kby-Arab-NE",
      kcg: "kcg-Latn-NG",
      kck: "kck-Latn-ZW",
      kcl: "kcl-Latn-ZZ",
      kct: "kct-Latn-ZZ",
      kde: "kde-Latn-TZ",
      kdh: "kdh-Arab-TG",
      kdl: "kdl-Latn-ZZ",
      kdt: "kdt-Thai-TH",
      kea: "kea-Latn-CV",
      ken: "ken-Latn-CM",
      kez: "kez-Latn-ZZ",
      kfo: "kfo-Latn-CI",
      kfr: "kfr-Deva-IN",
      kfy: "kfy-Deva-IN",
      kg: "kg-Latn-CD",
      kge: "kge-Latn-ID",
      kgf: "kgf-Latn-ZZ",
      kgp: "kgp-Latn-BR",
      kha: "kha-Latn-IN",
      khb: "khb-Talu-CN",
      khn: "khn-Deva-IN",
      khq: "khq-Latn-ML",
      khs: "khs-Latn-ZZ",
      kht: "kht-Mymr-IN",
      khw: "khw-Arab-PK",
      khz: "khz-Latn-ZZ",
      ki: "ki-Latn-KE",
      kij: "kij-Latn-ZZ",
      kiu: "kiu-Latn-TR",
      kiw: "kiw-Latn-ZZ",
      kj: "kj-Latn-NA",
      kjd: "kjd-Latn-ZZ",
      kjg: "kjg-Laoo-LA",
      kjs: "kjs-Latn-ZZ",
      kjy: "kjy-Latn-ZZ",
      kk: "kk-Cyrl-KZ",
      "kk-AF": "kk-Arab-AF",
      "kk-Arab": "kk-Arab-CN",
      "kk-CN": "kk-Arab-CN",
      "kk-IR": "kk-Arab-IR",
      "kk-MN": "kk-Arab-MN",
      kkc: "kkc-Latn-ZZ",
      kkj: "kkj-Latn-CM",
      kl: "kl-Latn-GL",
      kln: "kln-Latn-KE",
      klq: "klq-Latn-ZZ",
      klt: "klt-Latn-ZZ",
      klx: "klx-Latn-ZZ",
      km: "km-Khmr-KH",
      kmb: "kmb-Latn-AO",
      kmh: "kmh-Latn-ZZ",
      kmo: "kmo-Latn-ZZ",
      kms: "kms-Latn-ZZ",
      kmu: "kmu-Latn-ZZ",
      kmw: "kmw-Latn-ZZ",
      kn: "kn-Knda-IN",
      knf: "knf-Latn-GW",
      knp: "knp-Latn-ZZ",
      ko: "ko-Kore-KR",
      koi: "koi-Cyrl-RU",
      kok: "kok-Deva-IN",
      kol: "kol-Latn-ZZ",
      kos: "kos-Latn-FM",
      koz: "koz-Latn-ZZ",
      kpe: "kpe-Latn-LR",
      kpf: "kpf-Latn-ZZ",
      kpo: "kpo-Latn-ZZ",
      kpr: "kpr-Latn-ZZ",
      kpx: "kpx-Latn-ZZ",
      kqb: "kqb-Latn-ZZ",
      kqf: "kqf-Latn-ZZ",
      kqs: "kqs-Latn-ZZ",
      kqy: "kqy-Ethi-ZZ",
      kr: "kr-Latn-ZZ",
      krc: "krc-Cyrl-RU",
      kri: "kri-Latn-SL",
      krj: "krj-Latn-PH",
      krl: "krl-Latn-RU",
      krs: "krs-Latn-ZZ",
      kru: "kru-Deva-IN",
      ks: "ks-Arab-IN",
      ksb: "ksb-Latn-TZ",
      ksd: "ksd-Latn-ZZ",
      ksf: "ksf-Latn-CM",
      ksh: "ksh-Latn-DE",
      ksj: "ksj-Latn-ZZ",
      ksr: "ksr-Latn-ZZ",
      ktb: "ktb-Ethi-ZZ",
      ktm: "ktm-Latn-ZZ",
      kto: "kto-Latn-ZZ",
      ktr: "ktr-Latn-MY",
      ku: "ku-Latn-TR",
      "ku-Arab": "ku-Arab-IQ",
      "ku-LB": "ku-Arab-LB",
      "ku-Yezi": "ku-Yezi-GE",
      kub: "kub-Latn-ZZ",
      kud: "kud-Latn-ZZ",
      kue: "kue-Latn-ZZ",
      kuj: "kuj-Latn-ZZ",
      kum: "kum-Cyrl-RU",
      kun: "kun-Latn-ZZ",
      kup: "kup-Latn-ZZ",
      kus: "kus-Latn-ZZ",
      kv: "kv-Cyrl-RU",
      kvg: "kvg-Latn-ZZ",
      kvr: "kvr-Latn-ID",
      kvx: "kvx-Arab-PK",
      kw: "kw-Latn-GB",
      kwj: "kwj-Latn-ZZ",
      kwo: "kwo-Latn-ZZ",
      kwq: "kwq-Latn-ZZ",
      kxa: "kxa-Latn-ZZ",
      kxc: "kxc-Ethi-ZZ",
      kxe: "kxe-Latn-ZZ",
      kxl: "kxl-Deva-IN",
      kxm: "kxm-Thai-TH",
      kxp: "kxp-Arab-PK",
      kxw: "kxw-Latn-ZZ",
      kxz: "kxz-Latn-ZZ",
      ky: "ky-Cyrl-KG",
      "ky-Arab": "ky-Arab-CN",
      "ky-CN": "ky-Arab-CN",
      "ky-Latn": "ky-Latn-TR",
      "ky-TR": "ky-Latn-TR",
      kye: "kye-Latn-ZZ",
      kyx: "kyx-Latn-ZZ",
      kzh: "kzh-Arab-ZZ",
      kzj: "kzj-Latn-MY",
      kzr: "kzr-Latn-ZZ",
      kzt: "kzt-Latn-MY",
      la: "la-Latn-VA",
      lab: "lab-Lina-GR",
      lad: "lad-Hebr-IL",
      lag: "lag-Latn-TZ",
      lah: "lah-Arab-PK",
      laj: "laj-Latn-UG",
      las: "las-Latn-ZZ",
      lb: "lb-Latn-LU",
      lbe: "lbe-Cyrl-RU",
      lbu: "lbu-Latn-ZZ",
      lbw: "lbw-Latn-ID",
      lcm: "lcm-Latn-ZZ",
      lcp: "lcp-Thai-CN",
      ldb: "ldb-Latn-ZZ",
      led: "led-Latn-ZZ",
      lee: "lee-Latn-ZZ",
      lem: "lem-Latn-ZZ",
      lep: "lep-Lepc-IN",
      leq: "leq-Latn-ZZ",
      leu: "leu-Latn-ZZ",
      lez: "lez-Cyrl-RU",
      lg: "lg-Latn-UG",
      lgg: "lgg-Latn-ZZ",
      li: "li-Latn-NL",
      lia: "lia-Latn-ZZ",
      lid: "lid-Latn-ZZ",
      lif: "lif-Deva-NP",
      "lif-Limb": "lif-Limb-IN",
      lig: "lig-Latn-ZZ",
      lih: "lih-Latn-ZZ",
      lij: "lij-Latn-IT",
      lis: "lis-Lisu-CN",
      ljp: "ljp-Latn-ID",
      lki: "lki-Arab-IR",
      lkt: "lkt-Latn-US",
      lle: "lle-Latn-ZZ",
      lln: "lln-Latn-ZZ",
      lmn: "lmn-Telu-IN",
      lmo: "lmo-Latn-IT",
      lmp: "lmp-Latn-ZZ",
      ln: "ln-Latn-CD",
      lns: "lns-Latn-ZZ",
      lnu: "lnu-Latn-ZZ",
      lo: "lo-Laoo-LA",
      loj: "loj-Latn-ZZ",
      lok: "lok-Latn-ZZ",
      lol: "lol-Latn-CD",
      lor: "lor-Latn-ZZ",
      los: "los-Latn-ZZ",
      loz: "loz-Latn-ZM",
      lrc: "lrc-Arab-IR",
      lt: "lt-Latn-LT",
      ltg: "ltg-Latn-LV",
      lu: "lu-Latn-CD",
      lua: "lua-Latn-CD",
      luo: "luo-Latn-KE",
      luy: "luy-Latn-KE",
      luz: "luz-Arab-IR",
      lv: "lv-Latn-LV",
      lwl: "lwl-Thai-TH",
      lzh: "lzh-Hans-CN",
      lzz: "lzz-Latn-TR",
      mad: "mad-Latn-ID",
      maf: "maf-Latn-CM",
      mag: "mag-Deva-IN",
      mai: "mai-Deva-IN",
      mak: "mak-Latn-ID",
      man: "man-Latn-GM",
      "man-GN": "man-Nkoo-GN",
      "man-Nkoo": "man-Nkoo-GN",
      mas: "mas-Latn-KE",
      maw: "maw-Latn-ZZ",
      maz: "maz-Latn-MX",
      mbh: "mbh-Latn-ZZ",
      mbo: "mbo-Latn-ZZ",
      mbq: "mbq-Latn-ZZ",
      mbu: "mbu-Latn-ZZ",
      mbw: "mbw-Latn-ZZ",
      mci: "mci-Latn-ZZ",
      mcp: "mcp-Latn-ZZ",
      mcq: "mcq-Latn-ZZ",
      mcr: "mcr-Latn-ZZ",
      mcu: "mcu-Latn-ZZ",
      mda: "mda-Latn-ZZ",
      mde: "mde-Arab-ZZ",
      mdf: "mdf-Cyrl-RU",
      mdh: "mdh-Latn-PH",
      mdj: "mdj-Latn-ZZ",
      mdr: "mdr-Latn-ID",
      mdx: "mdx-Ethi-ZZ",
      med: "med-Latn-ZZ",
      mee: "mee-Latn-ZZ",
      mek: "mek-Latn-ZZ",
      men: "men-Latn-SL",
      mer: "mer-Latn-KE",
      met: "met-Latn-ZZ",
      meu: "meu-Latn-ZZ",
      mfa: "mfa-Arab-TH",
      mfe: "mfe-Latn-MU",
      mfn: "mfn-Latn-ZZ",
      mfo: "mfo-Latn-ZZ",
      mfq: "mfq-Latn-ZZ",
      mg: "mg-Latn-MG",
      mgh: "mgh-Latn-MZ",
      mgl: "mgl-Latn-ZZ",
      mgo: "mgo-Latn-CM",
      mgp: "mgp-Deva-NP",
      mgy: "mgy-Latn-TZ",
      mh: "mh-Latn-MH",
      mhi: "mhi-Latn-ZZ",
      mhl: "mhl-Latn-ZZ",
      mi: "mi-Latn-NZ",
      mif: "mif-Latn-ZZ",
      min: "min-Latn-ID",
      miw: "miw-Latn-ZZ",
      mk: "mk-Cyrl-MK",
      mki: "mki-Arab-ZZ",
      mkl: "mkl-Latn-ZZ",
      mkp: "mkp-Latn-ZZ",
      mkw: "mkw-Latn-ZZ",
      ml: "ml-Mlym-IN",
      mle: "mle-Latn-ZZ",
      mlp: "mlp-Latn-ZZ",
      mls: "mls-Latn-SD",
      mmo: "mmo-Latn-ZZ",
      mmu: "mmu-Latn-ZZ",
      mmx: "mmx-Latn-ZZ",
      mn: "mn-Cyrl-MN",
      "mn-CN": "mn-Mong-CN",
      "mn-Mong": "mn-Mong-CN",
      mna: "mna-Latn-ZZ",
      mnf: "mnf-Latn-ZZ",
      mni: "mni-Beng-IN",
      mnw: "mnw-Mymr-MM",
      mo: "mo-Latn-RO",
      moa: "moa-Latn-ZZ",
      moe: "moe-Latn-CA",
      moh: "moh-Latn-CA",
      mos: "mos-Latn-BF",
      mox: "mox-Latn-ZZ",
      mpp: "mpp-Latn-ZZ",
      mps: "mps-Latn-ZZ",
      mpt: "mpt-Latn-ZZ",
      mpx: "mpx-Latn-ZZ",
      mql: "mql-Latn-ZZ",
      mr: "mr-Deva-IN",
      mrd: "mrd-Deva-NP",
      mrj: "mrj-Cyrl-RU",
      mro: "mro-Mroo-BD",
      ms: "ms-Latn-MY",
      "ms-CC": "ms-Arab-CC",
      mt: "mt-Latn-MT",
      mtc: "mtc-Latn-ZZ",
      mtf: "mtf-Latn-ZZ",
      mti: "mti-Latn-ZZ",
      mtr: "mtr-Deva-IN",
      mua: "mua-Latn-CM",
      mur: "mur-Latn-ZZ",
      mus: "mus-Latn-US",
      mva: "mva-Latn-ZZ",
      mvn: "mvn-Latn-ZZ",
      mvy: "mvy-Arab-PK",
      mwk: "mwk-Latn-ML",
      mwr: "mwr-Deva-IN",
      mwv: "mwv-Latn-ID",
      mww: "mww-Hmnp-US",
      mxc: "mxc-Latn-ZW",
      mxm: "mxm-Latn-ZZ",
      my: "my-Mymr-MM",
      myk: "myk-Latn-ZZ",
      mym: "mym-Ethi-ZZ",
      myv: "myv-Cyrl-RU",
      myw: "myw-Latn-ZZ",
      myx: "myx-Latn-UG",
      myz: "myz-Mand-IR",
      mzk: "mzk-Latn-ZZ",
      mzm: "mzm-Latn-ZZ",
      mzn: "mzn-Arab-IR",
      mzp: "mzp-Latn-ZZ",
      mzw: "mzw-Latn-ZZ",
      mzz: "mzz-Latn-ZZ",
      na: "na-Latn-NR",
      nac: "nac-Latn-ZZ",
      naf: "naf-Latn-ZZ",
      nak: "nak-Latn-ZZ",
      nan: "nan-Hans-CN",
      nap: "nap-Latn-IT",
      naq: "naq-Latn-NA",
      nas: "nas-Latn-ZZ",
      nb: "nb-Latn-NO",
      nca: "nca-Latn-ZZ",
      nce: "nce-Latn-ZZ",
      ncf: "ncf-Latn-ZZ",
      nch: "nch-Latn-MX",
      nco: "nco-Latn-ZZ",
      ncu: "ncu-Latn-ZZ",
      nd: "nd-Latn-ZW",
      ndc: "ndc-Latn-MZ",
      nds: "nds-Latn-DE",
      ne: "ne-Deva-NP",
      neb: "neb-Latn-ZZ",
      new: "new-Deva-NP",
      nex: "nex-Latn-ZZ",
      nfr: "nfr-Latn-ZZ",
      ng: "ng-Latn-NA",
      nga: "nga-Latn-ZZ",
      ngb: "ngb-Latn-ZZ",
      ngl: "ngl-Latn-MZ",
      nhb: "nhb-Latn-ZZ",
      nhe: "nhe-Latn-MX",
      nhw: "nhw-Latn-MX",
      nif: "nif-Latn-ZZ",
      nii: "nii-Latn-ZZ",
      nij: "nij-Latn-ID",
      nin: "nin-Latn-ZZ",
      niu: "niu-Latn-NU",
      niy: "niy-Latn-ZZ",
      niz: "niz-Latn-ZZ",
      njo: "njo-Latn-IN",
      nkg: "nkg-Latn-ZZ",
      nko: "nko-Latn-ZZ",
      nl: "nl-Latn-NL",
      nmg: "nmg-Latn-CM",
      nmz: "nmz-Latn-ZZ",
      nn: "nn-Latn-NO",
      nnf: "nnf-Latn-ZZ",
      nnh: "nnh-Latn-CM",
      nnk: "nnk-Latn-ZZ",
      nnm: "nnm-Latn-ZZ",
      nnp: "nnp-Wcho-IN",
      no: "no-Latn-NO",
      nod: "nod-Lana-TH",
      noe: "noe-Deva-IN",
      non: "non-Runr-SE",
      nop: "nop-Latn-ZZ",
      nou: "nou-Latn-ZZ",
      nqo: "nqo-Nkoo-GN",
      nr: "nr-Latn-ZA",
      nrb: "nrb-Latn-ZZ",
      nsk: "nsk-Cans-CA",
      nsn: "nsn-Latn-ZZ",
      nso: "nso-Latn-ZA",
      nss: "nss-Latn-ZZ",
      ntm: "ntm-Latn-ZZ",
      ntr: "ntr-Latn-ZZ",
      nui: "nui-Latn-ZZ",
      nup: "nup-Latn-ZZ",
      nus: "nus-Latn-SS",
      nuv: "nuv-Latn-ZZ",
      nux: "nux-Latn-ZZ",
      nv: "nv-Latn-US",
      nwb: "nwb-Latn-ZZ",
      nxq: "nxq-Latn-CN",
      nxr: "nxr-Latn-ZZ",
      ny: "ny-Latn-MW",
      nym: "nym-Latn-TZ",
      nyn: "nyn-Latn-UG",
      nzi: "nzi-Latn-GH",
      oc: "oc-Latn-FR",
      ogc: "ogc-Latn-ZZ",
      okr: "okr-Latn-ZZ",
      okv: "okv-Latn-ZZ",
      om: "om-Latn-ET",
      ong: "ong-Latn-ZZ",
      onn: "onn-Latn-ZZ",
      ons: "ons-Latn-ZZ",
      opm: "opm-Latn-ZZ",
      or: "or-Orya-IN",
      oro: "oro-Latn-ZZ",
      oru: "oru-Arab-ZZ",
      os: "os-Cyrl-GE",
      osa: "osa-Osge-US",
      ota: "ota-Arab-ZZ",
      otk: "otk-Orkh-MN",
      ozm: "ozm-Latn-ZZ",
      pa: "pa-Guru-IN",
      "pa-Arab": "pa-Arab-PK",
      "pa-PK": "pa-Arab-PK",
      pag: "pag-Latn-PH",
      pal: "pal-Phli-IR",
      "pal-Phlp": "pal-Phlp-CN",
      pam: "pam-Latn-PH",
      pap: "pap-Latn-AW",
      pau: "pau-Latn-PW",
      pbi: "pbi-Latn-ZZ",
      pcd: "pcd-Latn-FR",
      pcm: "pcm-Latn-NG",
      pdc: "pdc-Latn-US",
      pdt: "pdt-Latn-CA",
      ped: "ped-Latn-ZZ",
      peo: "peo-Xpeo-IR",
      pex: "pex-Latn-ZZ",
      pfl: "pfl-Latn-DE",
      phl: "phl-Arab-ZZ",
      phn: "phn-Phnx-LB",
      pil: "pil-Latn-ZZ",
      pip: "pip-Latn-ZZ",
      pka: "pka-Brah-IN",
      pko: "pko-Latn-KE",
      pl: "pl-Latn-PL",
      pla: "pla-Latn-ZZ",
      pms: "pms-Latn-IT",
      png: "png-Latn-ZZ",
      pnn: "pnn-Latn-ZZ",
      pnt: "pnt-Grek-GR",
      pon: "pon-Latn-FM",
      ppa: "ppa-Deva-IN",
      ppo: "ppo-Latn-ZZ",
      pra: "pra-Khar-PK",
      prd: "prd-Arab-IR",
      prg: "prg-Latn-001",
      ps: "ps-Arab-AF",
      pss: "pss-Latn-ZZ",
      pt: "pt-Latn-BR",
      ptp: "ptp-Latn-ZZ",
      puu: "puu-Latn-GA",
      pwa: "pwa-Latn-ZZ",
      qu: "qu-Latn-PE",
      quc: "quc-Latn-GT",
      qug: "qug-Latn-EC",
      rai: "rai-Latn-ZZ",
      raj: "raj-Deva-IN",
      rao: "rao-Latn-ZZ",
      rcf: "rcf-Latn-RE",
      rej: "rej-Latn-ID",
      rel: "rel-Latn-ZZ",
      res: "res-Latn-ZZ",
      rgn: "rgn-Latn-IT",
      rhg: "rhg-Arab-MM",
      ria: "ria-Latn-IN",
      rif: "rif-Tfng-MA",
      "rif-NL": "rif-Latn-NL",
      rjs: "rjs-Deva-NP",
      rkt: "rkt-Beng-BD",
      rm: "rm-Latn-CH",
      rmf: "rmf-Latn-FI",
      rmo: "rmo-Latn-CH",
      rmt: "rmt-Arab-IR",
      rmu: "rmu-Latn-SE",
      rn: "rn-Latn-BI",
      rna: "rna-Latn-ZZ",
      rng: "rng-Latn-MZ",
      ro: "ro-Latn-RO",
      rob: "rob-Latn-ID",
      rof: "rof-Latn-TZ",
      roo: "roo-Latn-ZZ",
      rro: "rro-Latn-ZZ",
      rtm: "rtm-Latn-FJ",
      ru: "ru-Cyrl-RU",
      rue: "rue-Cyrl-UA",
      rug: "rug-Latn-SB",
      rw: "rw-Latn-RW",
      rwk: "rwk-Latn-TZ",
      rwo: "rwo-Latn-ZZ",
      ryu: "ryu-Kana-JP",
      sa: "sa-Deva-IN",
      saf: "saf-Latn-GH",
      sah: "sah-Cyrl-RU",
      saq: "saq-Latn-KE",
      sas: "sas-Latn-ID",
      sat: "sat-Olck-IN",
      sav: "sav-Latn-SN",
      saz: "saz-Saur-IN",
      sba: "sba-Latn-ZZ",
      sbe: "sbe-Latn-ZZ",
      sbp: "sbp-Latn-TZ",
      sc: "sc-Latn-IT",
      sck: "sck-Deva-IN",
      scl: "scl-Arab-ZZ",
      scn: "scn-Latn-IT",
      sco: "sco-Latn-GB",
      scs: "scs-Latn-CA",
      sd: "sd-Arab-PK",
      "sd-Deva": "sd-Deva-IN",
      "sd-Khoj": "sd-Khoj-IN",
      "sd-Sind": "sd-Sind-IN",
      sdc: "sdc-Latn-IT",
      sdh: "sdh-Arab-IR",
      se: "se-Latn-NO",
      sef: "sef-Latn-CI",
      seh: "seh-Latn-MZ",
      sei: "sei-Latn-MX",
      ses: "ses-Latn-ML",
      sg: "sg-Latn-CF",
      sga: "sga-Ogam-IE",
      sgs: "sgs-Latn-LT",
      sgw: "sgw-Ethi-ZZ",
      sgz: "sgz-Latn-ZZ",
      shi: "shi-Tfng-MA",
      shk: "shk-Latn-ZZ",
      shn: "shn-Mymr-MM",
      shu: "shu-Arab-ZZ",
      si: "si-Sinh-LK",
      sid: "sid-Latn-ET",
      sig: "sig-Latn-ZZ",
      sil: "sil-Latn-ZZ",
      sim: "sim-Latn-ZZ",
      sjr: "sjr-Latn-ZZ",
      sk: "sk-Latn-SK",
      skc: "skc-Latn-ZZ",
      skr: "skr-Arab-PK",
      sks: "sks-Latn-ZZ",
      sl: "sl-Latn-SI",
      sld: "sld-Latn-ZZ",
      sli: "sli-Latn-PL",
      sll: "sll-Latn-ZZ",
      sly: "sly-Latn-ID",
      sm: "sm-Latn-WS",
      sma: "sma-Latn-SE",
      smj: "smj-Latn-SE",
      smn: "smn-Latn-FI",
      smp: "smp-Samr-IL",
      smq: "smq-Latn-ZZ",
      sms: "sms-Latn-FI",
      sn: "sn-Latn-ZW",
      snc: "snc-Latn-ZZ",
      snk: "snk-Latn-ML",
      snp: "snp-Latn-ZZ",
      snx: "snx-Latn-ZZ",
      sny: "sny-Latn-ZZ",
      so: "so-Latn-SO",
      sog: "sog-Sogd-UZ",
      sok: "sok-Latn-ZZ",
      soq: "soq-Latn-ZZ",
      sou: "sou-Thai-TH",
      soy: "soy-Latn-ZZ",
      spd: "spd-Latn-ZZ",
      spl: "spl-Latn-ZZ",
      sps: "sps-Latn-ZZ",
      sq: "sq-Latn-AL",
      sr: "sr-Cyrl-RS",
      "sr-ME": "sr-Latn-ME",
      "sr-RO": "sr-Latn-RO",
      "sr-RU": "sr-Latn-RU",
      "sr-TR": "sr-Latn-TR",
      srb: "srb-Sora-IN",
      srn: "srn-Latn-SR",
      srr: "srr-Latn-SN",
      srx: "srx-Deva-IN",
      ss: "ss-Latn-ZA",
      ssd: "ssd-Latn-ZZ",
      ssg: "ssg-Latn-ZZ",
      ssy: "ssy-Latn-ER",
      st: "st-Latn-ZA",
      stk: "stk-Latn-ZZ",
      stq: "stq-Latn-DE",
      su: "su-Latn-ID",
      sua: "sua-Latn-ZZ",
      sue: "sue-Latn-ZZ",
      suk: "suk-Latn-TZ",
      sur: "sur-Latn-ZZ",
      sus: "sus-Latn-GN",
      sv: "sv-Latn-SE",
      sw: "sw-Latn-TZ",
      swb: "swb-Arab-YT",
      swc: "swc-Latn-CD",
      swg: "swg-Latn-DE",
      swp: "swp-Latn-ZZ",
      swv: "swv-Deva-IN",
      sxn: "sxn-Latn-ID",
      sxw: "sxw-Latn-ZZ",
      syl: "syl-Beng-BD",
      syr: "syr-Syrc-IQ",
      szl: "szl-Latn-PL",
      ta: "ta-Taml-IN",
      taj: "taj-Deva-NP",
      tal: "tal-Latn-ZZ",
      tan: "tan-Latn-ZZ",
      taq: "taq-Latn-ZZ",
      tbc: "tbc-Latn-ZZ",
      tbd: "tbd-Latn-ZZ",
      tbf: "tbf-Latn-ZZ",
      tbg: "tbg-Latn-ZZ",
      tbo: "tbo-Latn-ZZ",
      tbw: "tbw-Latn-PH",
      tbz: "tbz-Latn-ZZ",
      tci: "tci-Latn-ZZ",
      tcy: "tcy-Knda-IN",
      tdd: "tdd-Tale-CN",
      tdg: "tdg-Deva-NP",
      tdh: "tdh-Deva-NP",
      tdu: "tdu-Latn-MY",
      te: "te-Telu-IN",
      ted: "ted-Latn-ZZ",
      tem: "tem-Latn-SL",
      teo: "teo-Latn-UG",
      tet: "tet-Latn-TL",
      tfi: "tfi-Latn-ZZ",
      tg: "tg-Cyrl-TJ",
      "tg-Arab": "tg-Arab-PK",
      "tg-PK": "tg-Arab-PK",
      tgc: "tgc-Latn-ZZ",
      tgo: "tgo-Latn-ZZ",
      tgu: "tgu-Latn-ZZ",
      th: "th-Thai-TH",
      thl: "thl-Deva-NP",
      thq: "thq-Deva-NP",
      thr: "thr-Deva-NP",
      ti: "ti-Ethi-ET",
      tif: "tif-Latn-ZZ",
      tig: "tig-Ethi-ER",
      tik: "tik-Latn-ZZ",
      tim: "tim-Latn-ZZ",
      tio: "tio-Latn-ZZ",
      tiv: "tiv-Latn-NG",
      tk: "tk-Latn-TM",
      tkl: "tkl-Latn-TK",
      tkr: "tkr-Latn-AZ",
      tkt: "tkt-Deva-NP",
      tl: "tl-Latn-PH",
      tlf: "tlf-Latn-ZZ",
      tlx: "tlx-Latn-ZZ",
      tly: "tly-Latn-AZ",
      tmh: "tmh-Latn-NE",
      tmy: "tmy-Latn-ZZ",
      tn: "tn-Latn-ZA",
      tnh: "tnh-Latn-ZZ",
      to: "to-Latn-TO",
      tof: "tof-Latn-ZZ",
      tog: "tog-Latn-MW",
      toq: "toq-Latn-ZZ",
      tpi: "tpi-Latn-PG",
      tpm: "tpm-Latn-ZZ",
      tpz: "tpz-Latn-ZZ",
      tqo: "tqo-Latn-ZZ",
      tr: "tr-Latn-TR",
      tru: "tru-Latn-TR",
      trv: "trv-Latn-TW",
      trw: "trw-Arab-PK",
      ts: "ts-Latn-ZA",
      tsd: "tsd-Grek-GR",
      tsf: "tsf-Deva-NP",
      tsg: "tsg-Latn-PH",
      tsj: "tsj-Tibt-BT",
      tsw: "tsw-Latn-ZZ",
      tt: "tt-Cyrl-RU",
      ttd: "ttd-Latn-ZZ",
      tte: "tte-Latn-ZZ",
      ttj: "ttj-Latn-UG",
      ttr: "ttr-Latn-ZZ",
      tts: "tts-Thai-TH",
      ttt: "ttt-Latn-AZ",
      tuh: "tuh-Latn-ZZ",
      tul: "tul-Latn-ZZ",
      tum: "tum-Latn-MW",
      tuq: "tuq-Latn-ZZ",
      tvd: "tvd-Latn-ZZ",
      tvl: "tvl-Latn-TV",
      tvu: "tvu-Latn-ZZ",
      twh: "twh-Latn-ZZ",
      twq: "twq-Latn-NE",
      txg: "txg-Tang-CN",
      ty: "ty-Latn-PF",
      tya: "tya-Latn-ZZ",
      tyv: "tyv-Cyrl-RU",
      tzm: "tzm-Latn-MA",
      ubu: "ubu-Latn-ZZ",
      udi: "udi-Aghb-RU",
      udm: "udm-Cyrl-RU",
      ug: "ug-Arab-CN",
      "ug-Cyrl": "ug-Cyrl-KZ",
      "ug-KZ": "ug-Cyrl-KZ",
      "ug-MN": "ug-Cyrl-MN",
      uga: "uga-Ugar-SY",
      uk: "uk-Cyrl-UA",
      uli: "uli-Latn-FM",
      umb: "umb-Latn-AO",
      und: "en-Latn-US",
      "und-002": "en-Latn-NG",
      "und-003": "en-Latn-US",
      "und-005": "pt-Latn-BR",
      "und-009": "en-Latn-AU",
      "und-011": "en-Latn-NG",
      "und-013": "es-Latn-MX",
      "und-014": "sw-Latn-TZ",
      "und-015": "ar-Arab-EG",
      "und-017": "sw-Latn-CD",
      "und-018": "en-Latn-ZA",
      "und-019": "en-Latn-US",
      "und-021": "en-Latn-US",
      "und-029": "es-Latn-CU",
      "und-030": "zh-Hans-CN",
      "und-034": "hi-Deva-IN",
      "und-035": "id-Latn-ID",
      "und-039": "it-Latn-IT",
      "und-053": "en-Latn-AU",
      "und-054": "en-Latn-PG",
      "und-057": "en-Latn-GU",
      "und-061": "sm-Latn-WS",
      "und-142": "zh-Hans-CN",
      "und-143": "uz-Latn-UZ",
      "und-145": "ar-Arab-SA",
      "und-150": "ru-Cyrl-RU",
      "und-151": "ru-Cyrl-RU",
      "und-154": "en-Latn-GB",
      "und-155": "de-Latn-DE",
      "und-202": "en-Latn-NG",
      "und-419": "es-Latn-419",
      "und-AD": "ca-Latn-AD",
      "und-Adlm": "ff-Adlm-GN",
      "und-AE": "ar-Arab-AE",
      "und-AF": "fa-Arab-AF",
      "und-Aghb": "udi-Aghb-RU",
      "und-Ahom": "aho-Ahom-IN",
      "und-AL": "sq-Latn-AL",
      "und-AM": "hy-Armn-AM",
      "und-AO": "pt-Latn-AO",
      "und-AQ": "und-Latn-AQ",
      "und-AR": "es-Latn-AR",
      "und-Arab": "ar-Arab-EG",
      "und-Arab-CC": "ms-Arab-CC",
      "und-Arab-CN": "ug-Arab-CN",
      "und-Arab-GB": "ks-Arab-GB",
      "und-Arab-ID": "ms-Arab-ID",
      "und-Arab-IN": "ur-Arab-IN",
      "und-Arab-KH": "cja-Arab-KH",
      "und-Arab-MM": "rhg-Arab-MM",
      "und-Arab-MN": "kk-Arab-MN",
      "und-Arab-MU": "ur-Arab-MU",
      "und-Arab-NG": "ha-Arab-NG",
      "und-Arab-PK": "ur-Arab-PK",
      "und-Arab-TG": "apd-Arab-TG",
      "und-Arab-TH": "mfa-Arab-TH",
      "und-Arab-TJ": "fa-Arab-TJ",
      "und-Arab-TR": "az-Arab-TR",
      "und-Arab-YT": "swb-Arab-YT",
      "und-Armi": "arc-Armi-IR",
      "und-Armn": "hy-Armn-AM",
      "und-AS": "sm-Latn-AS",
      "und-AT": "de-Latn-AT",
      "und-Avst": "ae-Avst-IR",
      "und-AW": "nl-Latn-AW",
      "und-AX": "sv-Latn-AX",
      "und-AZ": "az-Latn-AZ",
      "und-BA": "bs-Latn-BA",
      "und-Bali": "ban-Bali-ID",
      "und-Bamu": "bax-Bamu-CM",
      "und-Bass": "bsq-Bass-LR",
      "und-Batk": "bbc-Batk-ID",
      "und-BD": "bn-Beng-BD",
      "und-BE": "nl-Latn-BE",
      "und-Beng": "bn-Beng-BD",
      "und-BF": "fr-Latn-BF",
      "und-BG": "bg-Cyrl-BG",
      "und-BH": "ar-Arab-BH",
      "und-Bhks": "sa-Bhks-IN",
      "und-BI": "rn-Latn-BI",
      "und-BJ": "fr-Latn-BJ",
      "und-BL": "fr-Latn-BL",
      "und-BN": "ms-Latn-BN",
      "und-BO": "es-Latn-BO",
      "und-Bopo": "zh-Bopo-TW",
      "und-BQ": "pap-Latn-BQ",
      "und-BR": "pt-Latn-BR",
      "und-Brah": "pka-Brah-IN",
      "und-Brai": "fr-Brai-FR",
      "und-BT": "dz-Tibt-BT",
      "und-Bugi": "bug-Bugi-ID",
      "und-Buhd": "bku-Buhd-PH",
      "und-BV": "und-Latn-BV",
      "und-BY": "be-Cyrl-BY",
      "und-Cakm": "ccp-Cakm-BD",
      "und-Cans": "cr-Cans-CA",
      "und-Cari": "xcr-Cari-TR",
      "und-CD": "sw-Latn-CD",
      "und-CF": "fr-Latn-CF",
      "und-CG": "fr-Latn-CG",
      "und-CH": "de-Latn-CH",
      "und-Cham": "cjm-Cham-VN",
      "und-Cher": "chr-Cher-US",
      "und-Chrs": "xco-Chrs-UZ",
      "und-CI": "fr-Latn-CI",
      "und-CL": "es-Latn-CL",
      "und-CM": "fr-Latn-CM",
      "und-CN": "zh-Hans-CN",
      "und-CO": "es-Latn-CO",
      "und-Copt": "cop-Copt-EG",
      "und-CP": "und-Latn-CP",
      "und-Cprt": "grc-Cprt-CY",
      "und-CR": "es-Latn-CR",
      "und-CU": "es-Latn-CU",
      "und-CV": "pt-Latn-CV",
      "und-CW": "pap-Latn-CW",
      "und-CY": "el-Grek-CY",
      "und-Cyrl": "ru-Cyrl-RU",
      "und-Cyrl-AL": "mk-Cyrl-AL",
      "und-Cyrl-BA": "sr-Cyrl-BA",
      "und-Cyrl-GE": "os-Cyrl-GE",
      "und-Cyrl-GR": "mk-Cyrl-GR",
      "und-Cyrl-MD": "uk-Cyrl-MD",
      "und-Cyrl-RO": "bg-Cyrl-RO",
      "und-Cyrl-SK": "uk-Cyrl-SK",
      "und-Cyrl-TR": "kbd-Cyrl-TR",
      "und-Cyrl-XK": "sr-Cyrl-XK",
      "und-CZ": "cs-Latn-CZ",
      "und-DE": "de-Latn-DE",
      "und-Deva": "hi-Deva-IN",
      "und-Deva-BT": "ne-Deva-BT",
      "und-Deva-FJ": "hif-Deva-FJ",
      "und-Deva-MU": "bho-Deva-MU",
      "und-Deva-PK": "btv-Deva-PK",
      "und-Diak": "dv-Diak-MV",
      "und-DJ": "aa-Latn-DJ",
      "und-DK": "da-Latn-DK",
      "und-DO": "es-Latn-DO",
      "und-Dogr": "doi-Dogr-IN",
      "und-Dupl": "fr-Dupl-FR",
      "und-DZ": "ar-Arab-DZ",
      "und-EA": "es-Latn-EA",
      "und-EC": "es-Latn-EC",
      "und-EE": "et-Latn-EE",
      "und-EG": "ar-Arab-EG",
      "und-Egyp": "egy-Egyp-EG",
      "und-EH": "ar-Arab-EH",
      "und-Elba": "sq-Elba-AL",
      "und-Elym": "arc-Elym-IR",
      "und-ER": "ti-Ethi-ER",
      "und-ES": "es-Latn-ES",
      "und-ET": "am-Ethi-ET",
      "und-Ethi": "am-Ethi-ET",
      "und-EU": "en-Latn-IE",
      "und-EZ": "de-Latn-EZ",
      "und-FI": "fi-Latn-FI",
      "und-FO": "fo-Latn-FO",
      "und-FR": "fr-Latn-FR",
      "und-GA": "fr-Latn-GA",
      "und-GE": "ka-Geor-GE",
      "und-Geor": "ka-Geor-GE",
      "und-GF": "fr-Latn-GF",
      "und-GH": "ak-Latn-GH",
      "und-GL": "kl-Latn-GL",
      "und-Glag": "cu-Glag-BG",
      "und-GN": "fr-Latn-GN",
      "und-Gong": "wsg-Gong-IN",
      "und-Gonm": "esg-Gonm-IN",
      "und-Goth": "got-Goth-UA",
      "und-GP": "fr-Latn-GP",
      "und-GQ": "es-Latn-GQ",
      "und-GR": "el-Grek-GR",
      "und-Gran": "sa-Gran-IN",
      "und-Grek": "el-Grek-GR",
      "und-Grek-TR": "bgx-Grek-TR",
      "und-GS": "und-Latn-GS",
      "und-GT": "es-Latn-GT",
      "und-Gujr": "gu-Gujr-IN",
      "und-Guru": "pa-Guru-IN",
      "und-GW": "pt-Latn-GW",
      "und-Hanb": "zh-Hanb-TW",
      "und-Hang": "ko-Hang-KR",
      "und-Hani": "zh-Hani-CN",
      "und-Hano": "hnn-Hano-PH",
      "und-Hans": "zh-Hans-CN",
      "und-Hant": "zh-Hant-TW",
      "und-Hebr": "he-Hebr-IL",
      "und-Hebr-CA": "yi-Hebr-CA",
      "und-Hebr-GB": "yi-Hebr-GB",
      "und-Hebr-SE": "yi-Hebr-SE",
      "und-Hebr-UA": "yi-Hebr-UA",
      "und-Hebr-US": "yi-Hebr-US",
      "und-Hira": "ja-Hira-JP",
      "und-HK": "zh-Hant-HK",
      "und-Hluw": "hlu-Hluw-TR",
      "und-HM": "und-Latn-HM",
      "und-Hmng": "hnj-Hmng-LA",
      "und-Hmnp": "mww-Hmnp-US",
      "und-HN": "es-Latn-HN",
      "und-HR": "hr-Latn-HR",
      "und-HT": "ht-Latn-HT",
      "und-HU": "hu-Latn-HU",
      "und-Hung": "hu-Hung-HU",
      "und-IC": "es-Latn-IC",
      "und-ID": "id-Latn-ID",
      "und-IL": "he-Hebr-IL",
      "und-IN": "hi-Deva-IN",
      "und-IQ": "ar-Arab-IQ",
      "und-IR": "fa-Arab-IR",
      "und-IS": "is-Latn-IS",
      "und-IT": "it-Latn-IT",
      "und-Ital": "ett-Ital-IT",
      "und-Jamo": "ko-Jamo-KR",
      "und-Java": "jv-Java-ID",
      "und-JO": "ar-Arab-JO",
      "und-JP": "ja-Jpan-JP",
      "und-Jpan": "ja-Jpan-JP",
      "und-Kali": "eky-Kali-MM",
      "und-Kana": "ja-Kana-JP",
      "und-KE": "sw-Latn-KE",
      "und-KG": "ky-Cyrl-KG",
      "und-KH": "km-Khmr-KH",
      "und-Khar": "pra-Khar-PK",
      "und-Khmr": "km-Khmr-KH",
      "und-Khoj": "sd-Khoj-IN",
      "und-Kits": "zkt-Kits-CN",
      "und-KM": "ar-Arab-KM",
      "und-Knda": "kn-Knda-IN",
      "und-Kore": "ko-Kore-KR",
      "und-KP": "ko-Kore-KP",
      "und-KR": "ko-Kore-KR",
      "und-Kthi": "bho-Kthi-IN",
      "und-KW": "ar-Arab-KW",
      "und-KZ": "ru-Cyrl-KZ",
      "und-LA": "lo-Laoo-LA",
      "und-Lana": "nod-Lana-TH",
      "und-Laoo": "lo-Laoo-LA",
      "und-Latn-AF": "tk-Latn-AF",
      "und-Latn-AM": "ku-Latn-AM",
      "und-Latn-CN": "za-Latn-CN",
      "und-Latn-CY": "tr-Latn-CY",
      "und-Latn-DZ": "fr-Latn-DZ",
      "und-Latn-ET": "en-Latn-ET",
      "und-Latn-GE": "ku-Latn-GE",
      "und-Latn-IR": "tk-Latn-IR",
      "und-Latn-KM": "fr-Latn-KM",
      "und-Latn-MA": "fr-Latn-MA",
      "und-Latn-MK": "sq-Latn-MK",
      "und-Latn-MM": "kac-Latn-MM",
      "und-Latn-MO": "pt-Latn-MO",
      "und-Latn-MR": "fr-Latn-MR",
      "und-Latn-RU": "krl-Latn-RU",
      "und-Latn-SY": "fr-Latn-SY",
      "und-Latn-TN": "fr-Latn-TN",
      "und-Latn-TW": "trv-Latn-TW",
      "und-Latn-UA": "pl-Latn-UA",
      "und-LB": "ar-Arab-LB",
      "und-Lepc": "lep-Lepc-IN",
      "und-LI": "de-Latn-LI",
      "und-Limb": "lif-Limb-IN",
      "und-Lina": "lab-Lina-GR",
      "und-Linb": "grc-Linb-GR",
      "und-Lisu": "lis-Lisu-CN",
      "und-LK": "si-Sinh-LK",
      "und-LS": "st-Latn-LS",
      "und-LT": "lt-Latn-LT",
      "und-LU": "fr-Latn-LU",
      "und-LV": "lv-Latn-LV",
      "und-LY": "ar-Arab-LY",
      "und-Lyci": "xlc-Lyci-TR",
      "und-Lydi": "xld-Lydi-TR",
      "und-MA": "ar-Arab-MA",
      "und-Mahj": "hi-Mahj-IN",
      "und-Maka": "mak-Maka-ID",
      "und-Mand": "myz-Mand-IR",
      "und-Mani": "xmn-Mani-CN",
      "und-Marc": "bo-Marc-CN",
      "und-MC": "fr-Latn-MC",
      "und-MD": "ro-Latn-MD",
      "und-ME": "sr-Latn-ME",
      "und-Medf": "dmf-Medf-NG",
      "und-Mend": "men-Mend-SL",
      "und-Merc": "xmr-Merc-SD",
      "und-Mero": "xmr-Mero-SD",
      "und-MF": "fr-Latn-MF",
      "und-MG": "mg-Latn-MG",
      "und-MK": "mk-Cyrl-MK",
      "und-ML": "bm-Latn-ML",
      "und-Mlym": "ml-Mlym-IN",
      "und-MM": "my-Mymr-MM",
      "und-MN": "mn-Cyrl-MN",
      "und-MO": "zh-Hant-MO",
      "und-Modi": "mr-Modi-IN",
      "und-Mong": "mn-Mong-CN",
      "und-MQ": "fr-Latn-MQ",
      "und-MR": "ar-Arab-MR",
      "und-Mroo": "mro-Mroo-BD",
      "und-MT": "mt-Latn-MT",
      "und-Mtei": "mni-Mtei-IN",
      "und-MU": "mfe-Latn-MU",
      "und-Mult": "skr-Mult-PK",
      "und-MV": "dv-Thaa-MV",
      "und-MX": "es-Latn-MX",
      "und-MY": "ms-Latn-MY",
      "und-Mymr": "my-Mymr-MM",
      "und-Mymr-IN": "kht-Mymr-IN",
      "und-Mymr-TH": "mnw-Mymr-TH",
      "und-MZ": "pt-Latn-MZ",
      "und-NA": "af-Latn-NA",
      "und-Nand": "sa-Nand-IN",
      "und-Narb": "xna-Narb-SA",
      "und-Nbat": "arc-Nbat-JO",
      "und-NC": "fr-Latn-NC",
      "und-NE": "ha-Latn-NE",
      "und-Newa": "new-Newa-NP",
      "und-NI": "es-Latn-NI",
      "und-Nkoo": "man-Nkoo-GN",
      "und-NL": "nl-Latn-NL",
      "und-NO": "nb-Latn-NO",
      "und-NP": "ne-Deva-NP",
      "und-Nshu": "zhx-Nshu-CN",
      "und-Ogam": "sga-Ogam-IE",
      "und-Olck": "sat-Olck-IN",
      "und-OM": "ar-Arab-OM",
      "und-Orkh": "otk-Orkh-MN",
      "und-Orya": "or-Orya-IN",
      "und-Osge": "osa-Osge-US",
      "und-Osma": "so-Osma-SO",
      "und-PA": "es-Latn-PA",
      "und-Palm": "arc-Palm-SY",
      "und-Pauc": "ctd-Pauc-MM",
      "und-PE": "es-Latn-PE",
      "und-Perm": "kv-Perm-RU",
      "und-PF": "fr-Latn-PF",
      "und-PG": "tpi-Latn-PG",
      "und-PH": "fil-Latn-PH",
      "und-Phag": "lzh-Phag-CN",
      "und-Phli": "pal-Phli-IR",
      "und-Phlp": "pal-Phlp-CN",
      "und-Phnx": "phn-Phnx-LB",
      "und-PK": "ur-Arab-PK",
      "und-PL": "pl-Latn-PL",
      "und-Plrd": "hmd-Plrd-CN",
      "und-PM": "fr-Latn-PM",
      "und-PR": "es-Latn-PR",
      "und-Prti": "xpr-Prti-IR",
      "und-PS": "ar-Arab-PS",
      "und-PT": "pt-Latn-PT",
      "und-PW": "pau-Latn-PW",
      "und-PY": "gn-Latn-PY",
      "und-QA": "ar-Arab-QA",
      "und-QO": "en-Latn-DG",
      "und-RE": "fr-Latn-RE",
      "und-Rjng": "rej-Rjng-ID",
      "und-RO": "ro-Latn-RO",
      "und-Rohg": "rhg-Rohg-MM",
      "und-RS": "sr-Cyrl-RS",
      "und-RU": "ru-Cyrl-RU",
      "und-Runr": "non-Runr-SE",
      "und-RW": "rw-Latn-RW",
      "und-SA": "ar-Arab-SA",
      "und-Samr": "smp-Samr-IL",
      "und-Sarb": "xsa-Sarb-YE",
      "und-Saur": "saz-Saur-IN",
      "und-SC": "fr-Latn-SC",
      "und-SD": "ar-Arab-SD",
      "und-SE": "sv-Latn-SE",
      "und-Sgnw": "ase-Sgnw-US",
      "und-Shaw": "en-Shaw-GB",
      "und-Shrd": "sa-Shrd-IN",
      "und-SI": "sl-Latn-SI",
      "und-Sidd": "sa-Sidd-IN",
      "und-Sind": "sd-Sind-IN",
      "und-Sinh": "si-Sinh-LK",
      "und-SJ": "nb-Latn-SJ",
      "und-SK": "sk-Latn-SK",
      "und-SM": "it-Latn-SM",
      "und-SN": "fr-Latn-SN",
      "und-SO": "so-Latn-SO",
      "und-Sogd": "sog-Sogd-UZ",
      "und-Sogo": "sog-Sogo-UZ",
      "und-Sora": "srb-Sora-IN",
      "und-Soyo": "cmg-Soyo-MN",
      "und-SR": "nl-Latn-SR",
      "und-ST": "pt-Latn-ST",
      "und-Sund": "su-Sund-ID",
      "und-SV": "es-Latn-SV",
      "und-SY": "ar-Arab-SY",
      "und-Sylo": "syl-Sylo-BD",
      "und-Syrc": "syr-Syrc-IQ",
      "und-Tagb": "tbw-Tagb-PH",
      "und-Takr": "doi-Takr-IN",
      "und-Tale": "tdd-Tale-CN",
      "und-Talu": "khb-Talu-CN",
      "und-Taml": "ta-Taml-IN",
      "und-Tang": "txg-Tang-CN",
      "und-Tavt": "blt-Tavt-VN",
      "und-TD": "fr-Latn-TD",
      "und-Telu": "te-Telu-IN",
      "und-TF": "fr-Latn-TF",
      "und-Tfng": "zgh-Tfng-MA",
      "und-TG": "fr-Latn-TG",
      "und-Tglg": "fil-Tglg-PH",
      "und-TH": "th-Thai-TH",
      "und-Thaa": "dv-Thaa-MV",
      "und-Thai": "th-Thai-TH",
      "und-Thai-CN": "lcp-Thai-CN",
      "und-Thai-KH": "kdt-Thai-KH",
      "und-Thai-LA": "kdt-Thai-LA",
      "und-Tibt": "bo-Tibt-CN",
      "und-Tirh": "mai-Tirh-IN",
      "und-TJ": "tg-Cyrl-TJ",
      "und-TK": "tkl-Latn-TK",
      "und-TL": "pt-Latn-TL",
      "und-TM": "tk-Latn-TM",
      "und-TN": "ar-Arab-TN",
      "und-TO": "to-Latn-TO",
      "und-TR": "tr-Latn-TR",
      "und-TV": "tvl-Latn-TV",
      "und-TW": "zh-Hant-TW",
      "und-TZ": "sw-Latn-TZ",
      "und-UA": "uk-Cyrl-UA",
      "und-UG": "sw-Latn-UG",
      "und-Ugar": "uga-Ugar-SY",
      "und-UY": "es-Latn-UY",
      "und-UZ": "uz-Latn-UZ",
      "und-VA": "it-Latn-VA",
      "und-Vaii": "vai-Vaii-LR",
      "und-VE": "es-Latn-VE",
      "und-VN": "vi-Latn-VN",
      "und-VU": "bi-Latn-VU",
      "und-Wara": "hoc-Wara-IN",
      "und-Wcho": "nnp-Wcho-IN",
      "und-WF": "fr-Latn-WF",
      "und-WS": "sm-Latn-WS",
      "und-XK": "sq-Latn-XK",
      "und-Xpeo": "peo-Xpeo-IR",
      "und-Xsux": "akk-Xsux-IQ",
      "und-YE": "ar-Arab-YE",
      "und-Yezi": "ku-Yezi-GE",
      "und-Yiii": "ii-Yiii-CN",
      "und-YT": "fr-Latn-YT",
      "und-Zanb": "cmg-Zanb-MN",
      "und-ZW": "sn-Latn-ZW",
      unr: "unr-Beng-IN",
      "unr-Deva": "unr-Deva-NP",
      "unr-NP": "unr-Deva-NP",
      unx: "unx-Beng-IN",
      uok: "uok-Latn-ZZ",
      ur: "ur-Arab-PK",
      uri: "uri-Latn-ZZ",
      urt: "urt-Latn-ZZ",
      urw: "urw-Latn-ZZ",
      usa: "usa-Latn-ZZ",
      uth: "uth-Latn-ZZ",
      utr: "utr-Latn-ZZ",
      uvh: "uvh-Latn-ZZ",
      uvl: "uvl-Latn-ZZ",
      uz: "uz-Latn-UZ",
      "uz-AF": "uz-Arab-AF",
      "uz-Arab": "uz-Arab-AF",
      "uz-CN": "uz-Cyrl-CN",
      vag: "vag-Latn-ZZ",
      vai: "vai-Vaii-LR",
      van: "van-Latn-ZZ",
      ve: "ve-Latn-ZA",
      vec: "vec-Latn-IT",
      vep: "vep-Latn-RU",
      vi: "vi-Latn-VN",
      vic: "vic-Latn-SX",
      viv: "viv-Latn-ZZ",
      vls: "vls-Latn-BE",
      vmf: "vmf-Latn-DE",
      vmw: "vmw-Latn-MZ",
      vo: "vo-Latn-001",
      vot: "vot-Latn-RU",
      vro: "vro-Latn-EE",
      vun: "vun-Latn-TZ",
      vut: "vut-Latn-ZZ",
      wa: "wa-Latn-BE",
      wae: "wae-Latn-CH",
      waj: "waj-Latn-ZZ",
      wal: "wal-Ethi-ET",
      wan: "wan-Latn-ZZ",
      war: "war-Latn-PH",
      wbp: "wbp-Latn-AU",
      wbq: "wbq-Telu-IN",
      wbr: "wbr-Deva-IN",
      wci: "wci-Latn-ZZ",
      wer: "wer-Latn-ZZ",
      wgi: "wgi-Latn-ZZ",
      whg: "whg-Latn-ZZ",
      wib: "wib-Latn-ZZ",
      wiu: "wiu-Latn-ZZ",
      wiv: "wiv-Latn-ZZ",
      wja: "wja-Latn-ZZ",
      wji: "wji-Latn-ZZ",
      wls: "wls-Latn-WF",
      wmo: "wmo-Latn-ZZ",
      wnc: "wnc-Latn-ZZ",
      wni: "wni-Arab-KM",
      wnu: "wnu-Latn-ZZ",
      wo: "wo-Latn-SN",
      wob: "wob-Latn-ZZ",
      wos: "wos-Latn-ZZ",
      wrs: "wrs-Latn-ZZ",
      wsg: "wsg-Gong-IN",
      wsk: "wsk-Latn-ZZ",
      wtm: "wtm-Deva-IN",
      wuu: "wuu-Hans-CN",
      wuv: "wuv-Latn-ZZ",
      wwa: "wwa-Latn-ZZ",
      xav: "xav-Latn-BR",
      xbi: "xbi-Latn-ZZ",
      xco: "xco-Chrs-UZ",
      xcr: "xcr-Cari-TR",
      xes: "xes-Latn-ZZ",
      xh: "xh-Latn-ZA",
      xla: "xla-Latn-ZZ",
      xlc: "xlc-Lyci-TR",
      xld: "xld-Lydi-TR",
      xmf: "xmf-Geor-GE",
      xmn: "xmn-Mani-CN",
      xmr: "xmr-Merc-SD",
      xna: "xna-Narb-SA",
      xnr: "xnr-Deva-IN",
      xog: "xog-Latn-UG",
      xon: "xon-Latn-ZZ",
      xpr: "xpr-Prti-IR",
      xrb: "xrb-Latn-ZZ",
      xsa: "xsa-Sarb-YE",
      xsi: "xsi-Latn-ZZ",
      xsm: "xsm-Latn-ZZ",
      xsr: "xsr-Deva-NP",
      xwe: "xwe-Latn-ZZ",
      yam: "yam-Latn-ZZ",
      yao: "yao-Latn-MZ",
      yap: "yap-Latn-FM",
      yas: "yas-Latn-ZZ",
      yat: "yat-Latn-ZZ",
      yav: "yav-Latn-CM",
      yay: "yay-Latn-ZZ",
      yaz: "yaz-Latn-ZZ",
      yba: "yba-Latn-ZZ",
      ybb: "ybb-Latn-CM",
      yby: "yby-Latn-ZZ",
      yer: "yer-Latn-ZZ",
      ygr: "ygr-Latn-ZZ",
      ygw: "ygw-Latn-ZZ",
      yi: "yi-Hebr-001",
      yko: "yko-Latn-ZZ",
      yle: "yle-Latn-ZZ",
      ylg: "ylg-Latn-ZZ",
      yll: "yll-Latn-ZZ",
      yml: "yml-Latn-ZZ",
      yo: "yo-Latn-NG",
      yon: "yon-Latn-ZZ",
      yrb: "yrb-Latn-ZZ",
      yre: "yre-Latn-ZZ",
      yrl: "yrl-Latn-BR",
      yss: "yss-Latn-ZZ",
      yua: "yua-Latn-MX",
      yue: "yue-Hant-HK",
      "yue-CN": "yue-Hans-CN",
      "yue-Hans": "yue-Hans-CN",
      yuj: "yuj-Latn-ZZ",
      yut: "yut-Latn-ZZ",
      yuw: "yuw-Latn-ZZ",
      za: "za-Latn-CN",
      zag: "zag-Latn-SD",
      zdj: "zdj-Arab-KM",
      zea: "zea-Latn-NL",
      zgh: "zgh-Tfng-MA",
      zh: "zh-Hans-CN",
      "zh-AU": "zh-Hant-AU",
      "zh-BN": "zh-Hant-BN",
      "zh-Bopo": "zh-Bopo-TW",
      "zh-GB": "zh-Hant-GB",
      "zh-GF": "zh-Hant-GF",
      "zh-Hanb": "zh-Hanb-TW",
      "zh-Hant": "zh-Hant-TW",
      "zh-HK": "zh-Hant-HK",
      "zh-ID": "zh-Hant-ID",
      "zh-MO": "zh-Hant-MO",
      "zh-PA": "zh-Hant-PA",
      "zh-PF": "zh-Hant-PF",
      "zh-PH": "zh-Hant-PH",
      "zh-SR": "zh-Hant-SR",
      "zh-TH": "zh-Hant-TH",
      "zh-TW": "zh-Hant-TW",
      "zh-US": "zh-Hant-US",
      "zh-VN": "zh-Hant-VN",
      zhx: "zhx-Nshu-CN",
      zia: "zia-Latn-ZZ",
      zkt: "zkt-Kits-CN",
      zlm: "zlm-Latn-TG",
      zmi: "zmi-Latn-MY",
      zne: "zne-Latn-ZZ",
      zu: "zu-Latn-ZA",
      zza: "zza-Latn-TR"
    }
  };

  // bazel-out/darwin-fastbuild/bin/packages/intl-getcanonicallocales/lib/src/canonicalizer.js
  function canonicalizeAttrs(strs) {
    return Object.keys(strs.reduce(function(all, str) {
      all[str.toLowerCase()] = 1;
      return all;
    }, {})).sort();
  }
  function canonicalizeKVs(arr) {
    var all = {};
    var result = [];
    for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
      var kv = arr_1[_i];
      if (kv[0] in all) {
        continue;
      }
      all[kv[0]] = 1;
      if (!kv[1] || kv[1] === "true") {
        result.push([kv[0].toLowerCase()]);
      } else {
        result.push([kv[0].toLowerCase(), kv[1].toLowerCase()]);
      }
    }
    return result.sort(compareKV);
  }
  function compareKV(t1, t2) {
    return t1[0] < t2[0] ? -1 : t1[0] > t2[0] ? 1 : 0;
  }
  function compareExtension(e1, e2) {
    return e1.type < e2.type ? -1 : e1.type > e2.type ? 1 : 0;
  }
  function mergeVariants(v1, v2) {
    var result = __spreadArray([], v1);
    for (var _i = 0, v2_1 = v2; _i < v2_1.length; _i++) {
      var v = v2_1[_i];
      if (v1.indexOf(v) < 0) {
        result.push(v);
      }
    }
    return result;
  }
  function canonicalizeUnicodeLanguageId(unicodeLanguageId) {
    var finalLangAst = unicodeLanguageId;
    if (unicodeLanguageId.variants.length) {
      var replacedLang_1 = "";
      for (var _i = 0, _a = unicodeLanguageId.variants; _i < _a.length; _i++) {
        var variant = _a[_i];
        if (replacedLang_1 = languageAlias[emitUnicodeLanguageId({
          lang: unicodeLanguageId.lang,
          variants: [variant]
        })]) {
          var replacedLangAst = parseUnicodeLanguageId(replacedLang_1.split(SEPARATOR));
          finalLangAst = {
            lang: replacedLangAst.lang,
            script: finalLangAst.script || replacedLangAst.script,
            region: finalLangAst.region || replacedLangAst.region,
            variants: mergeVariants(finalLangAst.variants, replacedLangAst.variants)
          };
          break;
        }
      }
    }
    if (finalLangAst.script && finalLangAst.region) {
      var replacedLang_2 = languageAlias[emitUnicodeLanguageId({
        lang: finalLangAst.lang,
        script: finalLangAst.script,
        region: finalLangAst.region,
        variants: []
      })];
      if (replacedLang_2) {
        var replacedLangAst = parseUnicodeLanguageId(replacedLang_2.split(SEPARATOR));
        finalLangAst = {
          lang: replacedLangAst.lang,
          script: replacedLangAst.script,
          region: replacedLangAst.region,
          variants: finalLangAst.variants
        };
      }
    }
    if (finalLangAst.region) {
      var replacedLang_3 = languageAlias[emitUnicodeLanguageId({
        lang: finalLangAst.lang,
        region: finalLangAst.region,
        variants: []
      })];
      if (replacedLang_3) {
        var replacedLangAst = parseUnicodeLanguageId(replacedLang_3.split(SEPARATOR));
        finalLangAst = {
          lang: replacedLangAst.lang,
          script: finalLangAst.script || replacedLangAst.script,
          region: replacedLangAst.region,
          variants: finalLangAst.variants
        };
      }
    }
    var replacedLang = languageAlias[emitUnicodeLanguageId({
      lang: finalLangAst.lang,
      variants: []
    })];
    if (replacedLang) {
      var replacedLangAst = parseUnicodeLanguageId(replacedLang.split(SEPARATOR));
      finalLangAst = {
        lang: replacedLangAst.lang,
        script: finalLangAst.script || replacedLangAst.script,
        region: finalLangAst.region || replacedLangAst.region,
        variants: finalLangAst.variants
      };
    }
    if (finalLangAst.region) {
      var region = finalLangAst.region.toUpperCase();
      var regionAlias = territoryAlias[region];
      var replacedRegion = void 0;
      if (regionAlias) {
        var regions = regionAlias.split(" ");
        replacedRegion = regions[0];
        var likelySubtag = supplemental.likelySubtags[emitUnicodeLanguageId({
          lang: finalLangAst.lang,
          script: finalLangAst.script,
          variants: []
        })];
        if (likelySubtag) {
          var likelyRegion = parseUnicodeLanguageId(likelySubtag.split(SEPARATOR)).region;
          if (likelyRegion && regions.indexOf(likelyRegion) > -1) {
            replacedRegion = likelyRegion;
          }
        }
      }
      if (replacedRegion) {
        finalLangAst.region = replacedRegion;
      }
      finalLangAst.region = finalLangAst.region.toUpperCase();
    }
    if (finalLangAst.script) {
      finalLangAst.script = finalLangAst.script[0].toUpperCase() + finalLangAst.script.slice(1).toLowerCase();
      if (scriptAlias[finalLangAst.script]) {
        finalLangAst.script = scriptAlias[finalLangAst.script];
      }
    }
    if (finalLangAst.variants.length) {
      for (var i = 0; i < finalLangAst.variants.length; i++) {
        var variant = finalLangAst.variants[i].toLowerCase();
        if (variantAlias[variant]) {
          var alias = variantAlias[variant];
          if (isUnicodeVariantSubtag(alias)) {
            finalLangAst.variants[i] = alias;
          } else if (isUnicodeLanguageSubtag(alias)) {
            finalLangAst.lang = alias;
          }
        }
      }
      finalLangAst.variants.sort();
    }
    return finalLangAst;
  }
  function canonicalizeUnicodeLocaleId(locale) {
    locale.lang = canonicalizeUnicodeLanguageId(locale.lang);
    if (locale.extensions) {
      for (var _i = 0, _a = locale.extensions; _i < _a.length; _i++) {
        var extension = _a[_i];
        switch (extension.type) {
          case "u":
            extension.keywords = canonicalizeKVs(extension.keywords);
            if (extension.attributes) {
              extension.attributes = canonicalizeAttrs(extension.attributes);
            }
            break;
          case "t":
            if (extension.lang) {
              extension.lang = canonicalizeUnicodeLanguageId(extension.lang);
            }
            extension.fields = canonicalizeKVs(extension.fields);
            break;
          default:
            extension.value = extension.value.toLowerCase();
            break;
        }
      }
      locale.extensions.sort(compareExtension);
    }
    return locale;
  }

  // bazel-out/darwin-fastbuild/bin/packages/intl-getcanonicallocales/lib/index.js
  function CanonicalizeLocaleList(locales) {
    if (locales === void 0) {
      return [];
    }
    var seen = [];
    if (typeof locales === "string") {
      locales = [locales];
    }
    for (var _i = 0, locales_1 = locales; _i < locales_1.length; _i++) {
      var locale = locales_1[_i];
      var canonicalizedTag = emitUnicodeLocaleId(canonicalizeUnicodeLocaleId(parseUnicodeLocaleId(locale)));
      if (seen.indexOf(canonicalizedTag) < 0) {
        seen.push(canonicalizedTag);
      }
    }
    return seen;
  }
  function getCanonicalLocales(locales) {
    return CanonicalizeLocaleList(locales);
  }

  // bazel-out/darwin-fastbuild/bin/packages/intl-getcanonicallocales/lib/should-polyfill.js
  function shouldPolyfill() {
    return typeof Intl === "undefined" || !("getCanonicalLocales" in Intl) || Intl.getCanonicalLocales("und-x-private")[0] === "x-private";
  }

  // bazel-out/darwin-fastbuild/bin/packages/intl-getcanonicallocales/lib/polyfill.js
  if (typeof Intl === "undefined") {
    if (typeof window !== "undefined") {
      Object.defineProperty(window, "Intl", {
        value: {}
      });
    } else if (typeof global !== "undefined") {
      Object.defineProperty(global, "Intl", {
        value: {}
      });
    }
  }
  if (shouldPolyfill()) {
    Object.defineProperty(Intl, "getCanonicalLocales", {
      value: getCanonicalLocales,
      writable: true,
      enumerable: false,
      configurable: true
    });
  }
})();
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */


// Intl.Locale
(function() {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __markAsModule = function(target) {
    return __defProp(target, "__esModule", {value: true});
  };
  var __commonJS = function(cb, mod) {
    return function __require() {
      return mod || (0, cb[Object.keys(cb)[0]])((mod = {exports: {}}).exports, mod), mod.exports;
    };
  };
  var __reExport = function(target, module, desc) {
    if (module && typeof module === "object" || typeof module === "function")
      for (var keys = __getOwnPropNames(module), i = 0, n = keys.length, key; i < n; i++) {
        key = keys[i];
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, {get: function(k) {
            return module[k];
          }.bind(null, key), enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable});
      }
    return target;
  };
  var __toModule = function(module) {
    return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? {get: function() {
      return module.default;
    }, enumerable: true} : {value: module, enumerable: true})), module);
  };

  // node_modules/tslib/tslib.js
  var require_tslib = __commonJS({
    "node_modules/tslib/tslib.js": function(exports, module) {
      var __extends2;
      var __assign5;
      var __rest;
      var __decorate;
      var __param;
      var __metadata;
      var __awaiter;
      var __generator;
      var __exportStar;
      var __values;
      var __read;
      var __spread;
      var __spreadArrays;
      var __spreadArray2;
      var __await;
      var __asyncGenerator;
      var __asyncDelegator;
      var __asyncValues;
      var __makeTemplateObject;
      var __importStar;
      var __importDefault;
      var __classPrivateFieldGet;
      var __classPrivateFieldSet;
      var __createBinding;
      (function(factory) {
        var root = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
        if (typeof define === "function" && define.amd) {
          define("tslib", ["exports"], function(exports2) {
            factory(createExporter(root, createExporter(exports2)));
          });
        } else if (typeof module === "object" && typeof module.exports === "object") {
          factory(createExporter(root, createExporter(module.exports)));
        } else {
          factory(createExporter(root));
        }
        function createExporter(exports2, previous) {
          if (exports2 !== root) {
            if (typeof Object.create === "function") {
              Object.defineProperty(exports2, "__esModule", {value: true});
            } else {
              exports2.__esModule = true;
            }
          }
          return function(id, v) {
            return exports2[id] = previous ? previous(id, v) : v;
          };
        }
      })(function(exporter) {
        var extendStatics = Object.setPrototypeOf || {__proto__: []} instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b)
            if (Object.prototype.hasOwnProperty.call(b, p))
              d[p] = b[p];
        };
        __extends2 = function(d, b) {
          if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
          extendStatics(d, b);
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        __assign5 = Object.assign || function(t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s)
              if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
          }
          return t;
        };
        __rest = function(s, e) {
          var t = {};
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
              t[p] = s[p];
          if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
              if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
            }
          return t;
        };
        __decorate = function(decorators, target, key, desc) {
          var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
          if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
          else
            for (var i = decorators.length - 1; i >= 0; i--)
              if (d = decorators[i])
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
          return c > 3 && r && Object.defineProperty(target, key, r), r;
        };
        __param = function(paramIndex, decorator) {
          return function(target, key) {
            decorator(target, key, paramIndex);
          };
        };
        __metadata = function(metadataKey, metadataValue) {
          if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(metadataKey, metadataValue);
        };
        __awaiter = function(thisArg, _arguments, P, generator) {
          function adopt(value) {
            return value instanceof P ? value : new P(function(resolve) {
              resolve(value);
            });
          }
          return new (P || (P = Promise))(function(resolve, reject) {
            function fulfilled(value) {
              try {
                step(generator.next(value));
              } catch (e) {
                reject(e);
              }
            }
            function rejected(value) {
              try {
                step(generator["throw"](value));
              } catch (e) {
                reject(e);
              }
            }
            function step(result) {
              result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
          });
        };
        __generator = function(thisArg, body) {
          var _ = {label: 0, sent: function() {
            if (t[0] & 1)
              throw t[1];
            return t[1];
          }, trys: [], ops: []}, f, y, t, g;
          return g = {next: verb(0), "throw": verb(1), "return": verb(2)}, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
            return this;
          }), g;
          function verb(n) {
            return function(v) {
              return step([n, v]);
            };
          }
          function step(op) {
            if (f)
              throw new TypeError("Generator is already executing.");
            while (_)
              try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                  return t;
                if (y = 0, t)
                  op = [op[0] & 2, t.value];
                switch (op[0]) {
                  case 0:
                  case 1:
                    t = op;
                    break;
                  case 4:
                    _.label++;
                    return {value: op[1], done: false};
                  case 5:
                    _.label++;
                    y = op[1];
                    op = [0];
                    continue;
                  case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                  default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                      _ = 0;
                      continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                      _.label = op[1];
                      break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                      _.label = t[1];
                      t = op;
                      break;
                    }
                    if (t && _.label < t[2]) {
                      _.label = t[2];
                      _.ops.push(op);
                      break;
                    }
                    if (t[2])
                      _.ops.pop();
                    _.trys.pop();
                    continue;
                }
                op = body.call(thisArg, _);
              } catch (e) {
                op = [6, e];
                y = 0;
              } finally {
                f = t = 0;
              }
            if (op[0] & 5)
              throw op[1];
            return {value: op[0] ? op[1] : void 0, done: true};
          }
        };
        __exportStar = function(m, o) {
          for (var p in m)
            if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
              __createBinding(o, m, p);
        };
        __createBinding = Object.create ? function(o, m, k, k2) {
          if (k2 === void 0)
            k2 = k;
          Object.defineProperty(o, k2, {enumerable: true, get: function() {
            return m[k];
          }});
        } : function(o, m, k, k2) {
          if (k2 === void 0)
            k2 = k;
          o[k2] = m[k];
        };
        __values = function(o) {
          var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
          if (m)
            return m.call(o);
          if (o && typeof o.length === "number")
            return {
              next: function() {
                if (o && i >= o.length)
                  o = void 0;
                return {value: o && o[i++], done: !o};
              }
            };
          throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
        };
        __read = function(o, n) {
          var m = typeof Symbol === "function" && o[Symbol.iterator];
          if (!m)
            return o;
          var i = m.call(o), r, ar = [], e;
          try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
              ar.push(r.value);
          } catch (error) {
            e = {error: error};
          } finally {
            try {
              if (r && !r.done && (m = i["return"]))
                m.call(i);
            } finally {
              if (e)
                throw e.error;
            }
          }
          return ar;
        };
        __spread = function() {
          for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
          return ar;
        };
        __spreadArrays = function() {
          for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
          for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
              r[k] = a[j];
          return r;
        };
        __spreadArray2 = function(to, from) {
          for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
            to[j] = from[i];
          return to;
        };
        __await = function(v) {
          return this instanceof __await ? (this.v = v, this) : new __await(v);
        };
        __asyncGenerator = function(thisArg, _arguments, generator) {
          if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
          var g = generator.apply(thisArg, _arguments || []), i, q = [];
          return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
            return this;
          }, i;
          function verb(n) {
            if (g[n])
              i[n] = function(v) {
                return new Promise(function(a, b) {
                  q.push([n, v, a, b]) > 1 || resume(n, v);
                });
              };
          }
          function resume(n, v) {
            try {
              step(g[n](v));
            } catch (e) {
              settle(q[0][3], e);
            }
          }
          function step(r) {
            r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
          }
          function fulfill(value) {
            resume("next", value);
          }
          function reject(value) {
            resume("throw", value);
          }
          function settle(f, v) {
            if (f(v), q.shift(), q.length)
              resume(q[0][0], q[0][1]);
          }
        };
        __asyncDelegator = function(o) {
          var i, p;
          return i = {}, verb("next"), verb("throw", function(e) {
            throw e;
          }), verb("return"), i[Symbol.iterator] = function() {
            return this;
          }, i;
          function verb(n, f) {
            i[n] = o[n] ? function(v) {
              return (p = !p) ? {value: __await(o[n](v)), done: n === "return"} : f ? f(v) : v;
            } : f;
          }
        };
        __asyncValues = function(o) {
          if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
          var m = o[Symbol.asyncIterator], i;
          return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
            return this;
          }, i);
          function verb(n) {
            i[n] = o[n] && function(v) {
              return new Promise(function(resolve, reject) {
                v = o[n](v), settle(resolve, reject, v.done, v.value);
              });
            };
          }
          function settle(resolve, reject, d, v) {
            Promise.resolve(v).then(function(v2) {
              resolve({value: v2, done: d});
            }, reject);
          }
        };
        __makeTemplateObject = function(cooked, raw) {
          if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", {value: raw});
          } else {
            cooked.raw = raw;
          }
          return cooked;
        };
        var __setModuleDefault = Object.create ? function(o, v) {
          Object.defineProperty(o, "default", {enumerable: true, value: v});
        } : function(o, v) {
          o["default"] = v;
        };
        __importStar = function(mod) {
          if (mod && mod.__esModule)
            return mod;
          var result = {};
          if (mod != null) {
            for (var k in mod)
              if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                __createBinding(result, mod, k);
          }
          __setModuleDefault(result, mod);
          return result;
        };
        __importDefault = function(mod) {
          return mod && mod.__esModule ? mod : {"default": mod};
        };
        __classPrivateFieldGet = function(receiver, state, kind, f) {
          if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a getter");
          if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot read private member from an object whose class did not declare it");
          return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
        };
        __classPrivateFieldSet = function(receiver, state, value, kind, f) {
          if (kind === "m")
            throw new TypeError("Private method is not writable");
          if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a setter");
          if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot write private member to an object whose class did not declare it");
          return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
        };
        exporter("__extends", __extends2);
        exporter("__assign", __assign5);
        exporter("__rest", __rest);
        exporter("__decorate", __decorate);
        exporter("__param", __param);
        exporter("__metadata", __metadata);
        exporter("__awaiter", __awaiter);
        exporter("__generator", __generator);
        exporter("__exportStar", __exportStar);
        exporter("__createBinding", __createBinding);
        exporter("__values", __values);
        exporter("__read", __read);
        exporter("__spread", __spread);
        exporter("__spreadArrays", __spreadArrays);
        exporter("__spreadArray", __spreadArray2);
        exporter("__await", __await);
        exporter("__asyncGenerator", __asyncGenerator);
        exporter("__asyncDelegator", __asyncDelegator);
        exporter("__asyncValues", __asyncValues);
        exporter("__makeTemplateObject", __makeTemplateObject);
        exporter("__importStar", __importStar);
        exporter("__importDefault", __importDefault);
        exporter("__classPrivateFieldGet", __classPrivateFieldGet);
        exporter("__classPrivateFieldSet", __classPrivateFieldSet);
      });
    }
  });

  // bazel-out/darwin-fastbuild/bin/packages/intl-getcanonicallocales/src/parser.js
  var require_parser = __commonJS({
    "bazel-out/darwin-fastbuild/bin/packages/intl-getcanonicallocales/src/parser.js": function(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {value: true});
      exports.parseUnicodeLocaleId = exports.parseUnicodeLanguageId = exports.isUnicodeVariantSubtag = exports.isUnicodeScriptSubtag = exports.isUnicodeRegionSubtag = exports.isStructurallyValidLanguageTag = exports.isUnicodeLanguageSubtag = exports.SEPARATOR = void 0;
      var tslib_1 = require_tslib();
      var ALPHANUM_1_8 = /^[a-z0-9]{1,8}$/i;
      var ALPHANUM_2_8 = /^[a-z0-9]{2,8}$/i;
      var ALPHANUM_3_8 = /^[a-z0-9]{3,8}$/i;
      var KEY_REGEX = /^[a-z0-9][a-z]$/i;
      var TYPE_REGEX = /^[a-z0-9]{3,8}$/i;
      var ALPHA_4 = /^[a-z]{4}$/i;
      var OTHER_EXTENSION_TYPE = /^[0-9a-svwyz]$/i;
      var UNICODE_REGION_SUBTAG_REGEX = /^([a-z]{2}|[0-9]{3})$/i;
      var UNICODE_VARIANT_SUBTAG_REGEX = /^([a-z0-9]{5,8}|[0-9][a-z0-9]{3})$/i;
      var UNICODE_LANGUAGE_SUBTAG_REGEX = /^([a-z]{2,3}|[a-z]{5,8})$/i;
      var TKEY_REGEX = /^[a-z][0-9]$/i;
      exports.SEPARATOR = "-";
      function isUnicodeLanguageSubtag2(lang) {
        return UNICODE_LANGUAGE_SUBTAG_REGEX.test(lang);
      }
      exports.isUnicodeLanguageSubtag = isUnicodeLanguageSubtag2;
      function isStructurallyValidLanguageTag2(tag) {
        try {
          parseUnicodeLanguageId2(tag.split(exports.SEPARATOR));
        } catch (e) {
          return false;
        }
        return true;
      }
      exports.isStructurallyValidLanguageTag = isStructurallyValidLanguageTag2;
      function isUnicodeRegionSubtag2(region) {
        return UNICODE_REGION_SUBTAG_REGEX.test(region);
      }
      exports.isUnicodeRegionSubtag = isUnicodeRegionSubtag2;
      function isUnicodeScriptSubtag2(script) {
        return ALPHA_4.test(script);
      }
      exports.isUnicodeScriptSubtag = isUnicodeScriptSubtag2;
      function isUnicodeVariantSubtag(variant) {
        return UNICODE_VARIANT_SUBTAG_REGEX.test(variant);
      }
      exports.isUnicodeVariantSubtag = isUnicodeVariantSubtag;
      function parseUnicodeLanguageId2(chunks) {
        if (typeof chunks === "string") {
          chunks = chunks.split(exports.SEPARATOR);
        }
        var lang = chunks.shift();
        if (!lang) {
          throw new RangeError("Missing unicode_language_subtag");
        }
        if (lang === "root") {
          return {lang: "root", variants: []};
        }
        if (!isUnicodeLanguageSubtag2(lang)) {
          throw new RangeError("Malformed unicode_language_subtag");
        }
        var script;
        if (chunks.length && isUnicodeScriptSubtag2(chunks[0])) {
          script = chunks.shift();
        }
        var region;
        if (chunks.length && isUnicodeRegionSubtag2(chunks[0])) {
          region = chunks.shift();
        }
        var variants = {};
        while (chunks.length && isUnicodeVariantSubtag(chunks[0])) {
          var variant = chunks.shift();
          if (variant in variants) {
            throw new RangeError('Duplicate variant "' + variant + '"');
          }
          variants[variant] = 1;
        }
        return {
          lang: lang,
          script: script,
          region: region,
          variants: Object.keys(variants)
        };
      }
      exports.parseUnicodeLanguageId = parseUnicodeLanguageId2;
      function parseUnicodeExtension(chunks) {
        var keywords = [];
        var keyword;
        while (chunks.length && (keyword = parseKeyword(chunks))) {
          keywords.push(keyword);
        }
        if (keywords.length) {
          return {
            type: "u",
            keywords: keywords,
            attributes: []
          };
        }
        var attributes = [];
        while (chunks.length && ALPHANUM_3_8.test(chunks[0])) {
          attributes.push(chunks.shift());
        }
        while (chunks.length && (keyword = parseKeyword(chunks))) {
          keywords.push(keyword);
        }
        if (keywords.length || attributes.length) {
          return {
            type: "u",
            attributes: attributes,
            keywords: keywords
          };
        }
        throw new RangeError("Malformed unicode_extension");
      }
      function parseKeyword(chunks) {
        var key;
        if (!KEY_REGEX.test(chunks[0])) {
          return;
        }
        key = chunks.shift();
        var type = [];
        while (chunks.length && TYPE_REGEX.test(chunks[0])) {
          type.push(chunks.shift());
        }
        var value = "";
        if (type.length) {
          value = type.join(exports.SEPARATOR);
        }
        return [key, value];
      }
      function parseTransformedExtension(chunks) {
        var lang;
        try {
          lang = parseUnicodeLanguageId2(chunks);
        } catch (e) {
        }
        var fields = [];
        while (chunks.length && TKEY_REGEX.test(chunks[0])) {
          var key = chunks.shift();
          var value = [];
          while (chunks.length && ALPHANUM_3_8.test(chunks[0])) {
            value.push(chunks.shift());
          }
          if (!value.length) {
            throw new RangeError('Missing tvalue for tkey "' + key + '"');
          }
          fields.push([key, value.join(exports.SEPARATOR)]);
        }
        if (fields.length) {
          return {
            type: "t",
            fields: fields,
            lang: lang
          };
        }
        throw new RangeError("Malformed transformed_extension");
      }
      function parsePuExtension(chunks) {
        var exts = [];
        while (chunks.length && ALPHANUM_1_8.test(chunks[0])) {
          exts.push(chunks.shift());
        }
        if (exts.length) {
          return {
            type: "x",
            value: exts.join(exports.SEPARATOR)
          };
        }
        throw new RangeError("Malformed private_use_extension");
      }
      function parseOtherExtensionValue(chunks) {
        var exts = [];
        while (chunks.length && ALPHANUM_2_8.test(chunks[0])) {
          exts.push(chunks.shift());
        }
        if (exts.length) {
          return exts.join(exports.SEPARATOR);
        }
        return "";
      }
      function parseExtensions(chunks) {
        if (!chunks.length) {
          return {extensions: []};
        }
        var extensions = [];
        var unicodeExtension;
        var transformedExtension;
        var puExtension;
        var otherExtensionMap = {};
        do {
          var type = chunks.shift();
          switch (type) {
            case "u":
            case "U":
              if (unicodeExtension) {
                throw new RangeError("There can only be 1 -u- extension");
              }
              unicodeExtension = parseUnicodeExtension(chunks);
              extensions.push(unicodeExtension);
              break;
            case "t":
            case "T":
              if (transformedExtension) {
                throw new RangeError("There can only be 1 -t- extension");
              }
              transformedExtension = parseTransformedExtension(chunks);
              extensions.push(transformedExtension);
              break;
            case "x":
            case "X":
              if (puExtension) {
                throw new RangeError("There can only be 1 -x- extension");
              }
              puExtension = parsePuExtension(chunks);
              extensions.push(puExtension);
              break;
            default:
              if (!OTHER_EXTENSION_TYPE.test(type)) {
                throw new RangeError("Malformed extension type");
              }
              if (type in otherExtensionMap) {
                throw new RangeError("There can only be 1 -" + type + "- extension");
              }
              var extension = {
                type: type,
                value: parseOtherExtensionValue(chunks)
              };
              otherExtensionMap[extension.type] = extension;
              extensions.push(extension);
              break;
          }
        } while (chunks.length);
        return {extensions: extensions};
      }
      function parseUnicodeLocaleId2(locale) {
        var chunks = locale.split(exports.SEPARATOR);
        var lang = parseUnicodeLanguageId2(chunks);
        return tslib_1.__assign({lang: lang}, parseExtensions(chunks));
      }
      exports.parseUnicodeLocaleId = parseUnicodeLocaleId2;
    }
  });

  // bazel-out/darwin-fastbuild/bin/packages/intl-getcanonicallocales/src/emitter.js
  var require_emitter = __commonJS({
    "bazel-out/darwin-fastbuild/bin/packages/intl-getcanonicallocales/src/emitter.js": function(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {value: true});
      exports.emitUnicodeLocaleId = exports.emitUnicodeLanguageId = void 0;
      var tslib_1 = require_tslib();
      function emitUnicodeLanguageId2(lang) {
        if (!lang) {
          return "";
        }
        return tslib_1.__spreadArray([lang.lang, lang.script, lang.region], lang.variants || []).filter(Boolean).join("-");
      }
      exports.emitUnicodeLanguageId = emitUnicodeLanguageId2;
      function emitUnicodeLocaleId2(_a) {
        var lang = _a.lang, extensions = _a.extensions;
        var chunks = [emitUnicodeLanguageId2(lang)];
        for (var _i = 0, extensions_1 = extensions; _i < extensions_1.length; _i++) {
          var ext = extensions_1[_i];
          chunks.push(ext.type);
          switch (ext.type) {
            case "u":
              chunks.push.apply(chunks, tslib_1.__spreadArray(tslib_1.__spreadArray([], ext.attributes), ext.keywords.reduce(function(all, kv) {
                return all.concat(kv);
              }, [])));
              break;
            case "t":
              chunks.push.apply(chunks, tslib_1.__spreadArray([emitUnicodeLanguageId2(ext.lang)], ext.fields.reduce(function(all, kv) {
                return all.concat(kv);
              }, [])));
              break;
            default:
              chunks.push(ext.value);
              break;
          }
        }
        return chunks.filter(Boolean).join("-");
      }
      exports.emitUnicodeLocaleId = emitUnicodeLocaleId2;
    }
  });

  // bazel-out/darwin-fastbuild/bin/packages/intl-getcanonicallocales/src/data/aliases.js
  var require_aliases = __commonJS({
    "bazel-out/darwin-fastbuild/bin/packages/intl-getcanonicallocales/src/data/aliases.js": function(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {value: true});
      exports.variantAlias = exports.scriptAlias = exports.territoryAlias = exports.languageAlias = void 0;
      exports.languageAlias = {
        "aa-saaho": "ssy",
        "aam": "aas",
        "aar": "aa",
        "abk": "ab",
        "adp": "dz",
        "afr": "af",
        "agp": "apf",
        "ais": "ami",
        "aju": "jrb",
        "aka": "ak",
        "alb": "sq",
        "als": "sq",
        "amh": "am",
        "ara": "ar",
        "arb": "ar",
        "arg": "an",
        "arm": "hy",
        "art-lojban": "jbo",
        "asd": "snz",
        "asm": "as",
        "aue": "ktz",
        "ava": "av",
        "ave": "ae",
        "aym": "ay",
        "ayr": "ay",
        "ayx": "nun",
        "aze": "az",
        "azj": "az",
        "bak": "ba",
        "bam": "bm",
        "baq": "eu",
        "baz": "nvo",
        "bcc": "bal",
        "bcl": "bik",
        "bel": "be",
        "ben": "bn",
        "bgm": "bcg",
        "bh": "bho",
        "bhk": "fbl",
        "bih": "bho",
        "bis": "bi",
        "bjd": "drl",
        "bjq": "bzc",
        "bkb": "ebk",
        "bod": "bo",
        "bos": "bs",
        "bre": "br",
        "btb": "beb",
        "bul": "bg",
        "bur": "my",
        "bxk": "luy",
        "bxr": "bua",
        "cat": "ca",
        "ccq": "rki",
        "cel-gaulish": "xtg",
        "ces": "cs",
        "cha": "ch",
        "che": "ce",
        "chi": "zh",
        "chu": "cu",
        "chv": "cv",
        "cjr": "mom",
        "cka": "cmr",
        "cld": "syr",
        "cmk": "xch",
        "cmn": "zh",
        "cnr": "sr-ME",
        "cor": "kw",
        "cos": "co",
        "coy": "pij",
        "cqu": "quh",
        "cre": "cr",
        "cwd": "cr",
        "cym": "cy",
        "cze": "cs",
        "daf": "dnj",
        "dan": "da",
        "dap": "njz",
        "deu": "de",
        "dgo": "doi",
        "dhd": "mwr",
        "dik": "din",
        "diq": "zza",
        "dit": "dif",
        "div": "dv",
        "djl": "dze",
        "dkl": "aqd",
        "drh": "mn",
        "drr": "kzk",
        "drw": "fa-AF",
        "dud": "uth",
        "duj": "dwu",
        "dut": "nl",
        "dwl": "dbt",
        "dzo": "dz",
        "ekk": "et",
        "ell": "el",
        "elp": "amq",
        "emk": "man",
        "en-GB-oed": "en-GB-oxendict",
        "eng": "en",
        "epo": "eo",
        "esk": "ik",
        "est": "et",
        "eus": "eu",
        "ewe": "ee",
        "fao": "fo",
        "fas": "fa",
        "fat": "ak",
        "fij": "fj",
        "fin": "fi",
        "fra": "fr",
        "fre": "fr",
        "fry": "fy",
        "fuc": "ff",
        "ful": "ff",
        "gav": "dev",
        "gaz": "om",
        "gbc": "wny",
        "gbo": "grb",
        "geo": "ka",
        "ger": "de",
        "gfx": "vaj",
        "ggn": "gvr",
        "ggo": "esg",
        "ggr": "gtu",
        "gio": "aou",
        "gla": "gd",
        "gle": "ga",
        "glg": "gl",
        "gli": "kzk",
        "glv": "gv",
        "gno": "gon",
        "gre": "el",
        "grn": "gn",
        "gti": "nyc",
        "gug": "gn",
        "guj": "gu",
        "guv": "duz",
        "gya": "gba",
        "hat": "ht",
        "hau": "ha",
        "hbs": "sr-Latn",
        "hdn": "hai",
        "hea": "hmn",
        "heb": "he",
        "her": "hz",
        "him": "srx",
        "hin": "hi",
        "hmo": "ho",
        "hrr": "jal",
        "hrv": "hr",
        "hun": "hu",
        "hy-arevmda": "hyw",
        "hye": "hy",
        "i-ami": "ami",
        "i-bnn": "bnn",
        "i-default": "en-x-i-default",
        "i-enochian": "und-x-i-enochian",
        "i-hak": "hak",
        "i-klingon": "tlh",
        "i-lux": "lb",
        "i-mingo": "see-x-i-mingo",
        "i-navajo": "nv",
        "i-pwn": "pwn",
        "i-tao": "tao",
        "i-tay": "tay",
        "i-tsu": "tsu",
        "ibi": "opa",
        "ibo": "ig",
        "ice": "is",
        "ido": "io",
        "iii": "ii",
        "ike": "iu",
        "iku": "iu",
        "ile": "ie",
        "ill": "ilm",
        "ilw": "gal",
        "in": "id",
        "ina": "ia",
        "ind": "id",
        "ipk": "ik",
        "isl": "is",
        "ita": "it",
        "iw": "he",
        "izi": "eza",
        "jar": "jgk",
        "jav": "jv",
        "jeg": "oyb",
        "ji": "yi",
        "jpn": "ja",
        "jw": "jv",
        "kal": "kl",
        "kan": "kn",
        "kas": "ks",
        "kat": "ka",
        "kau": "kr",
        "kaz": "kk",
        "kdv": "zkd",
        "kgc": "tdf",
        "kgd": "ncq",
        "kgh": "kml",
        "khk": "mn",
        "khm": "km",
        "kik": "ki",
        "kin": "rw",
        "kir": "ky",
        "kmr": "ku",
        "knc": "kr",
        "kng": "kg",
        "knn": "kok",
        "koj": "kwv",
        "kom": "kv",
        "kon": "kg",
        "kor": "ko",
        "kpp": "jkm",
        "kpv": "kv",
        "krm": "bmf",
        "ktr": "dtp",
        "kua": "kj",
        "kur": "ku",
        "kvs": "gdj",
        "kwq": "yam",
        "kxe": "tvd",
        "kxl": "kru",
        "kzh": "dgl",
        "kzj": "dtp",
        "kzt": "dtp",
        "lao": "lo",
        "lat": "la",
        "lav": "lv",
        "lbk": "bnc",
        "leg": "enl",
        "lii": "raq",
        "lim": "li",
        "lin": "ln",
        "lit": "lt",
        "llo": "ngt",
        "lmm": "rmx",
        "ltz": "lb",
        "lub": "lu",
        "lug": "lg",
        "lvs": "lv",
        "mac": "mk",
        "mah": "mh",
        "mal": "ml",
        "mao": "mi",
        "mar": "mr",
        "may": "ms",
        "meg": "cir",
        "mgx": "jbk",
        "mhr": "chm",
        "mkd": "mk",
        "mlg": "mg",
        "mlt": "mt",
        "mnk": "man",
        "mnt": "wnn",
        "mo": "ro",
        "mof": "xnt",
        "mol": "ro",
        "mon": "mn",
        "mri": "mi",
        "msa": "ms",
        "mst": "mry",
        "mup": "raj",
        "mwd": "dmw",
        "mwj": "vaj",
        "mya": "my",
        "myd": "aog",
        "myt": "mry",
        "nad": "xny",
        "nau": "na",
        "nav": "nv",
        "nbf": "nru",
        "nbl": "nr",
        "nbx": "ekc",
        "ncp": "kdz",
        "nde": "nd",
        "ndo": "ng",
        "nep": "ne",
        "nld": "nl",
        "nln": "azd",
        "nlr": "nrk",
        "nno": "nn",
        "nns": "nbr",
        "nnx": "ngv",
        "no-bok": "nb",
        "no-bokmal": "nb",
        "no-nyn": "nn",
        "no-nynorsk": "nn",
        "nob": "nb",
        "noo": "dtd",
        "nor": "no",
        "npi": "ne",
        "nts": "pij",
        "nxu": "bpp",
        "nya": "ny",
        "oci": "oc",
        "ojg": "oj",
        "oji": "oj",
        "ori": "or",
        "orm": "om",
        "ory": "or",
        "oss": "os",
        "oun": "vaj",
        "pan": "pa",
        "pbu": "ps",
        "pcr": "adx",
        "per": "fa",
        "pes": "fa",
        "pli": "pi",
        "plt": "mg",
        "pmc": "huw",
        "pmu": "phr",
        "pnb": "lah",
        "pol": "pl",
        "por": "pt",
        "ppa": "bfy",
        "ppr": "lcq",
        "prs": "fa-AF",
        "pry": "prt",
        "pus": "ps",
        "puz": "pub",
        "que": "qu",
        "quz": "qu",
        "rmr": "emx",
        "rmy": "rom",
        "roh": "rm",
        "ron": "ro",
        "rum": "ro",
        "run": "rn",
        "rus": "ru",
        "sag": "sg",
        "san": "sa",
        "sap": "aqt",
        "sca": "hle",
        "scc": "sr",
        "scr": "hr",
        "sgl": "isk",
        "sgn-BE-FR": "sfb",
        "sgn-BE-NL": "vgt",
        "sgn-BR": "bzs",
        "sgn-CH-DE": "sgg",
        "sgn-CO": "csn",
        "sgn-DE": "gsg",
        "sgn-DK": "dsl",
        "sgn-ES": "ssp",
        "sgn-FR": "fsl",
        "sgn-GB": "bfi",
        "sgn-GR": "gss",
        "sgn-IE": "isg",
        "sgn-IT": "ise",
        "sgn-JP": "jsl",
        "sgn-MX": "mfs",
        "sgn-NI": "ncs",
        "sgn-NL": "dse",
        "sgn-NO": "nsi",
        "sgn-PT": "psr",
        "sgn-SE": "swl",
        "sgn-US": "ase",
        "sgn-ZA": "sfs",
        "sh": "sr-Latn",
        "sin": "si",
        "skk": "oyb",
        "slk": "sk",
        "slo": "sk",
        "slv": "sl",
        "sme": "se",
        "smo": "sm",
        "sna": "sn",
        "snd": "sd",
        "som": "so",
        "sot": "st",
        "spa": "es",
        "spy": "kln",
        "sqi": "sq",
        "src": "sc",
        "srd": "sc",
        "srp": "sr",
        "ssw": "ss",
        "sul": "sgd",
        "sum": "ulw",
        "sun": "su",
        "swa": "sw",
        "swc": "sw-CD",
        "swe": "sv",
        "swh": "sw",
        "tah": "ty",
        "tam": "ta",
        "tat": "tt",
        "tdu": "dtp",
        "tel": "te",
        "tgg": "bjp",
        "tgk": "tg",
        "tgl": "fil",
        "tha": "th",
        "thc": "tpo",
        "thw": "ola",
        "thx": "oyb",
        "tib": "bo",
        "tid": "itd",
        "tie": "ras",
        "tir": "ti",
        "tkk": "twm",
        "tl": "fil",
        "tlw": "weo",
        "tmp": "tyj",
        "tne": "kak",
        "tnf": "fa-AF",
        "ton": "to",
        "tsf": "taj",
        "tsn": "tn",
        "tso": "ts",
        "ttq": "tmh",
        "tuk": "tk",
        "tur": "tr",
        "tw": "ak",
        "twi": "ak",
        "uig": "ug",
        "ukr": "uk",
        "umu": "del",
        "und-aaland": "und-AX",
        "und-arevela": "und",
        "und-arevmda": "und",
        "und-bokmal": "und",
        "und-hakka": "und",
        "und-hepburn-heploc": "und-alalc97",
        "und-lojban": "und",
        "und-nynorsk": "und",
        "und-saaho": "und",
        "und-xiang": "und",
        "unp": "wro",
        "uok": "ema",
        "urd": "ur",
        "uzb": "uz",
        "uzn": "uz",
        "ven": "ve",
        "vie": "vi",
        "vol": "vo",
        "wel": "cy",
        "wgw": "wgb",
        "wit": "nol",
        "wiw": "nwo",
        "wln": "wa",
        "wol": "wo",
        "xba": "cax",
        "xho": "xh",
        "xia": "acn",
        "xkh": "waw",
        "xpe": "kpe",
        "xrq": "dmw",
        "xsj": "suj",
        "xsl": "den",
        "ybd": "rki",
        "ydd": "yi",
        "yen": "ynq",
        "yid": "yi",
        "yiy": "yrm",
        "yma": "lrr",
        "ymt": "mtm",
        "yor": "yo",
        "yos": "zom",
        "yuu": "yug",
        "zai": "zap",
        "zh-cmn": "zh",
        "zh-cmn-Hans": "zh-Hans",
        "zh-cmn-Hant": "zh-Hant",
        "zh-gan": "gan",
        "zh-guoyu": "zh",
        "zh-hakka": "hak",
        "zh-min": "nan-x-zh-min",
        "zh-min-nan": "nan",
        "zh-wuu": "wuu",
        "zh-xiang": "hsn",
        "zh-yue": "yue",
        "zha": "za",
        "zho": "zh",
        "zir": "scv",
        "zsm": "ms",
        "zul": "zu",
        "zyb": "za"
      };
      exports.territoryAlias = {
        "100": "BG",
        "104": "MM",
        "108": "BI",
        "112": "BY",
        "116": "KH",
        "120": "CM",
        "124": "CA",
        "132": "CV",
        "136": "KY",
        "140": "CF",
        "144": "LK",
        "148": "TD",
        "152": "CL",
        "156": "CN",
        "158": "TW",
        "162": "CX",
        "166": "CC",
        "170": "CO",
        "172": "RU AM AZ BY GE KG KZ MD TJ TM UA UZ",
        "174": "KM",
        "175": "YT",
        "178": "CG",
        "180": "CD",
        "184": "CK",
        "188": "CR",
        "191": "HR",
        "192": "CU",
        "196": "CY",
        "200": "CZ SK",
        "203": "CZ",
        "204": "BJ",
        "208": "DK",
        "212": "DM",
        "214": "DO",
        "218": "EC",
        "222": "SV",
        "226": "GQ",
        "230": "ET",
        "231": "ET",
        "232": "ER",
        "233": "EE",
        "234": "FO",
        "238": "FK",
        "239": "GS",
        "242": "FJ",
        "246": "FI",
        "248": "AX",
        "249": "FR",
        "250": "FR",
        "254": "GF",
        "258": "PF",
        "260": "TF",
        "262": "DJ",
        "266": "GA",
        "268": "GE",
        "270": "GM",
        "275": "PS",
        "276": "DE",
        "278": "DE",
        "280": "DE",
        "288": "GH",
        "292": "GI",
        "296": "KI",
        "300": "GR",
        "304": "GL",
        "308": "GD",
        "312": "GP",
        "316": "GU",
        "320": "GT",
        "324": "GN",
        "328": "GY",
        "332": "HT",
        "334": "HM",
        "336": "VA",
        "340": "HN",
        "344": "HK",
        "348": "HU",
        "352": "IS",
        "356": "IN",
        "360": "ID",
        "364": "IR",
        "368": "IQ",
        "372": "IE",
        "376": "IL",
        "380": "IT",
        "384": "CI",
        "388": "JM",
        "392": "JP",
        "398": "KZ",
        "400": "JO",
        "404": "KE",
        "408": "KP",
        "410": "KR",
        "414": "KW",
        "417": "KG",
        "418": "LA",
        "422": "LB",
        "426": "LS",
        "428": "LV",
        "430": "LR",
        "434": "LY",
        "438": "LI",
        "440": "LT",
        "442": "LU",
        "446": "MO",
        "450": "MG",
        "454": "MW",
        "458": "MY",
        "462": "MV",
        "466": "ML",
        "470": "MT",
        "474": "MQ",
        "478": "MR",
        "480": "MU",
        "484": "MX",
        "492": "MC",
        "496": "MN",
        "498": "MD",
        "499": "ME",
        "500": "MS",
        "504": "MA",
        "508": "MZ",
        "512": "OM",
        "516": "NA",
        "520": "NR",
        "524": "NP",
        "528": "NL",
        "530": "CW SX BQ",
        "531": "CW",
        "532": "CW SX BQ",
        "533": "AW",
        "534": "SX",
        "535": "BQ",
        "536": "SA IQ",
        "540": "NC",
        "548": "VU",
        "554": "NZ",
        "558": "NI",
        "562": "NE",
        "566": "NG",
        "570": "NU",
        "574": "NF",
        "578": "NO",
        "580": "MP",
        "581": "UM",
        "582": "FM MH MP PW",
        "583": "FM",
        "584": "MH",
        "585": "PW",
        "586": "PK",
        "591": "PA",
        "598": "PG",
        "600": "PY",
        "604": "PE",
        "608": "PH",
        "612": "PN",
        "616": "PL",
        "620": "PT",
        "624": "GW",
        "626": "TL",
        "630": "PR",
        "634": "QA",
        "638": "RE",
        "642": "RO",
        "643": "RU",
        "646": "RW",
        "652": "BL",
        "654": "SH",
        "659": "KN",
        "660": "AI",
        "662": "LC",
        "663": "MF",
        "666": "PM",
        "670": "VC",
        "674": "SM",
        "678": "ST",
        "682": "SA",
        "686": "SN",
        "688": "RS",
        "690": "SC",
        "694": "SL",
        "702": "SG",
        "703": "SK",
        "704": "VN",
        "705": "SI",
        "706": "SO",
        "710": "ZA",
        "716": "ZW",
        "720": "YE",
        "724": "ES",
        "728": "SS",
        "729": "SD",
        "732": "EH",
        "736": "SD",
        "740": "SR",
        "744": "SJ",
        "748": "SZ",
        "752": "SE",
        "756": "CH",
        "760": "SY",
        "762": "TJ",
        "764": "TH",
        "768": "TG",
        "772": "TK",
        "776": "TO",
        "780": "TT",
        "784": "AE",
        "788": "TN",
        "792": "TR",
        "795": "TM",
        "796": "TC",
        "798": "TV",
        "800": "UG",
        "804": "UA",
        "807": "MK",
        "810": "RU AM AZ BY EE GE KZ KG LV LT MD TJ TM UA UZ",
        "818": "EG",
        "826": "GB",
        "830": "JE GG",
        "831": "GG",
        "832": "JE",
        "833": "IM",
        "834": "TZ",
        "840": "US",
        "850": "VI",
        "854": "BF",
        "858": "UY",
        "860": "UZ",
        "862": "VE",
        "876": "WF",
        "882": "WS",
        "886": "YE",
        "887": "YE",
        "890": "RS ME SI HR MK BA",
        "891": "RS ME",
        "894": "ZM",
        "958": "AA",
        "959": "QM",
        "960": "QN",
        "962": "QP",
        "963": "QQ",
        "964": "QR",
        "965": "QS",
        "966": "QT",
        "967": "EU",
        "968": "QV",
        "969": "QW",
        "970": "QX",
        "971": "QY",
        "972": "QZ",
        "973": "XA",
        "974": "XB",
        "975": "XC",
        "976": "XD",
        "977": "XE",
        "978": "XF",
        "979": "XG",
        "980": "XH",
        "981": "XI",
        "982": "XJ",
        "983": "XK",
        "984": "XL",
        "985": "XM",
        "986": "XN",
        "987": "XO",
        "988": "XP",
        "989": "XQ",
        "990": "XR",
        "991": "XS",
        "992": "XT",
        "993": "XU",
        "994": "XV",
        "995": "XW",
        "996": "XX",
        "997": "XY",
        "998": "XZ",
        "999": "ZZ",
        "004": "AF",
        "008": "AL",
        "010": "AQ",
        "012": "DZ",
        "016": "AS",
        "020": "AD",
        "024": "AO",
        "028": "AG",
        "031": "AZ",
        "032": "AR",
        "036": "AU",
        "040": "AT",
        "044": "BS",
        "048": "BH",
        "050": "BD",
        "051": "AM",
        "052": "BB",
        "056": "BE",
        "060": "BM",
        "062": "034 143",
        "064": "BT",
        "068": "BO",
        "070": "BA",
        "072": "BW",
        "074": "BV",
        "076": "BR",
        "084": "BZ",
        "086": "IO",
        "090": "SB",
        "092": "VG",
        "096": "BN",
        "AAA": "AA",
        "ABW": "AW",
        "AFG": "AF",
        "AGO": "AO",
        "AIA": "AI",
        "ALA": "AX",
        "ALB": "AL",
        "AN": "CW SX BQ",
        "AND": "AD",
        "ANT": "CW SX BQ",
        "ARE": "AE",
        "ARG": "AR",
        "ARM": "AM",
        "ASC": "AC",
        "ASM": "AS",
        "ATA": "AQ",
        "ATF": "TF",
        "ATG": "AG",
        "AUS": "AU",
        "AUT": "AT",
        "AZE": "AZ",
        "BDI": "BI",
        "BEL": "BE",
        "BEN": "BJ",
        "BES": "BQ",
        "BFA": "BF",
        "BGD": "BD",
        "BGR": "BG",
        "BHR": "BH",
        "BHS": "BS",
        "BIH": "BA",
        "BLM": "BL",
        "BLR": "BY",
        "BLZ": "BZ",
        "BMU": "BM",
        "BOL": "BO",
        "BRA": "BR",
        "BRB": "BB",
        "BRN": "BN",
        "BTN": "BT",
        "BU": "MM",
        "BUR": "MM",
        "BVT": "BV",
        "BWA": "BW",
        "CAF": "CF",
        "CAN": "CA",
        "CCK": "CC",
        "CHE": "CH",
        "CHL": "CL",
        "CHN": "CN",
        "CIV": "CI",
        "CMR": "CM",
        "COD": "CD",
        "COG": "CG",
        "COK": "CK",
        "COL": "CO",
        "COM": "KM",
        "CPT": "CP",
        "CPV": "CV",
        "CRI": "CR",
        "CS": "RS ME",
        "CT": "KI",
        "CUB": "CU",
        "CUW": "CW",
        "CXR": "CX",
        "CYM": "KY",
        "CYP": "CY",
        "CZE": "CZ",
        "DD": "DE",
        "DDR": "DE",
        "DEU": "DE",
        "DGA": "DG",
        "DJI": "DJ",
        "DMA": "DM",
        "DNK": "DK",
        "DOM": "DO",
        "DY": "BJ",
        "DZA": "DZ",
        "ECU": "EC",
        "EGY": "EG",
        "ERI": "ER",
        "ESH": "EH",
        "ESP": "ES",
        "EST": "EE",
        "ETH": "ET",
        "FIN": "FI",
        "FJI": "FJ",
        "FLK": "FK",
        "FQ": "AQ TF",
        "FRA": "FR",
        "FRO": "FO",
        "FSM": "FM",
        "FX": "FR",
        "FXX": "FR",
        "GAB": "GA",
        "GBR": "GB",
        "GEO": "GE",
        "GGY": "GG",
        "GHA": "GH",
        "GIB": "GI",
        "GIN": "GN",
        "GLP": "GP",
        "GMB": "GM",
        "GNB": "GW",
        "GNQ": "GQ",
        "GRC": "GR",
        "GRD": "GD",
        "GRL": "GL",
        "GTM": "GT",
        "GUF": "GF",
        "GUM": "GU",
        "GUY": "GY",
        "HKG": "HK",
        "HMD": "HM",
        "HND": "HN",
        "HRV": "HR",
        "HTI": "HT",
        "HUN": "HU",
        "HV": "BF",
        "IDN": "ID",
        "IMN": "IM",
        "IND": "IN",
        "IOT": "IO",
        "IRL": "IE",
        "IRN": "IR",
        "IRQ": "IQ",
        "ISL": "IS",
        "ISR": "IL",
        "ITA": "IT",
        "JAM": "JM",
        "JEY": "JE",
        "JOR": "JO",
        "JPN": "JP",
        "JT": "UM",
        "KAZ": "KZ",
        "KEN": "KE",
        "KGZ": "KG",
        "KHM": "KH",
        "KIR": "KI",
        "KNA": "KN",
        "KOR": "KR",
        "KWT": "KW",
        "LAO": "LA",
        "LBN": "LB",
        "LBR": "LR",
        "LBY": "LY",
        "LCA": "LC",
        "LIE": "LI",
        "LKA": "LK",
        "LSO": "LS",
        "LTU": "LT",
        "LUX": "LU",
        "LVA": "LV",
        "MAC": "MO",
        "MAF": "MF",
        "MAR": "MA",
        "MCO": "MC",
        "MDA": "MD",
        "MDG": "MG",
        "MDV": "MV",
        "MEX": "MX",
        "MHL": "MH",
        "MI": "UM",
        "MKD": "MK",
        "MLI": "ML",
        "MLT": "MT",
        "MMR": "MM",
        "MNE": "ME",
        "MNG": "MN",
        "MNP": "MP",
        "MOZ": "MZ",
        "MRT": "MR",
        "MSR": "MS",
        "MTQ": "MQ",
        "MUS": "MU",
        "MWI": "MW",
        "MYS": "MY",
        "MYT": "YT",
        "NAM": "NA",
        "NCL": "NC",
        "NER": "NE",
        "NFK": "NF",
        "NGA": "NG",
        "NH": "VU",
        "NIC": "NI",
        "NIU": "NU",
        "NLD": "NL",
        "NOR": "NO",
        "NPL": "NP",
        "NQ": "AQ",
        "NRU": "NR",
        "NT": "SA IQ",
        "NTZ": "SA IQ",
        "NZL": "NZ",
        "OMN": "OM",
        "PAK": "PK",
        "PAN": "PA",
        "PC": "FM MH MP PW",
        "PCN": "PN",
        "PER": "PE",
        "PHL": "PH",
        "PLW": "PW",
        "PNG": "PG",
        "POL": "PL",
        "PRI": "PR",
        "PRK": "KP",
        "PRT": "PT",
        "PRY": "PY",
        "PSE": "PS",
        "PU": "UM",
        "PYF": "PF",
        "PZ": "PA",
        "QAT": "QA",
        "QMM": "QM",
        "QNN": "QN",
        "QPP": "QP",
        "QQQ": "QQ",
        "QRR": "QR",
        "QSS": "QS",
        "QTT": "QT",
        "QU": "EU",
        "QUU": "EU",
        "QVV": "QV",
        "QWW": "QW",
        "QXX": "QX",
        "QYY": "QY",
        "QZZ": "QZ",
        "REU": "RE",
        "RH": "ZW",
        "ROU": "RO",
        "RUS": "RU",
        "RWA": "RW",
        "SAU": "SA",
        "SCG": "RS ME",
        "SDN": "SD",
        "SEN": "SN",
        "SGP": "SG",
        "SGS": "GS",
        "SHN": "SH",
        "SJM": "SJ",
        "SLB": "SB",
        "SLE": "SL",
        "SLV": "SV",
        "SMR": "SM",
        "SOM": "SO",
        "SPM": "PM",
        "SRB": "RS",
        "SSD": "SS",
        "STP": "ST",
        "SU": "RU AM AZ BY EE GE KZ KG LV LT MD TJ TM UA UZ",
        "SUN": "RU AM AZ BY EE GE KZ KG LV LT MD TJ TM UA UZ",
        "SUR": "SR",
        "SVK": "SK",
        "SVN": "SI",
        "SWE": "SE",
        "SWZ": "SZ",
        "SXM": "SX",
        "SYC": "SC",
        "SYR": "SY",
        "TAA": "TA",
        "TCA": "TC",
        "TCD": "TD",
        "TGO": "TG",
        "THA": "TH",
        "TJK": "TJ",
        "TKL": "TK",
        "TKM": "TM",
        "TLS": "TL",
        "TMP": "TL",
        "TON": "TO",
        "TP": "TL",
        "TTO": "TT",
        "TUN": "TN",
        "TUR": "TR",
        "TUV": "TV",
        "TWN": "TW",
        "TZA": "TZ",
        "UGA": "UG",
        "UK": "GB",
        "UKR": "UA",
        "UMI": "UM",
        "URY": "UY",
        "USA": "US",
        "UZB": "UZ",
        "VAT": "VA",
        "VCT": "VC",
        "VD": "VN",
        "VEN": "VE",
        "VGB": "VG",
        "VIR": "VI",
        "VNM": "VN",
        "VUT": "VU",
        "WK": "UM",
        "WLF": "WF",
        "WSM": "WS",
        "XAA": "XA",
        "XBB": "XB",
        "XCC": "XC",
        "XDD": "XD",
        "XEE": "XE",
        "XFF": "XF",
        "XGG": "XG",
        "XHH": "XH",
        "XII": "XI",
        "XJJ": "XJ",
        "XKK": "XK",
        "XLL": "XL",
        "XMM": "XM",
        "XNN": "XN",
        "XOO": "XO",
        "XPP": "XP",
        "XQQ": "XQ",
        "XRR": "XR",
        "XSS": "XS",
        "XTT": "XT",
        "XUU": "XU",
        "XVV": "XV",
        "XWW": "XW",
        "XXX": "XX",
        "XYY": "XY",
        "XZZ": "XZ",
        "YD": "YE",
        "YEM": "YE",
        "YMD": "YE",
        "YU": "RS ME",
        "YUG": "RS ME",
        "ZAF": "ZA",
        "ZAR": "CD",
        "ZMB": "ZM",
        "ZR": "CD",
        "ZWE": "ZW",
        "ZZZ": "ZZ"
      };
      exports.scriptAlias = {
        "Qaai": "Zinh"
      };
      exports.variantAlias = {
        "heploc": "alalc97",
        "polytoni": "polyton"
      };
    }
  });

  // node_modules/cldr-core/supplemental/likelySubtags.json
  var require_likelySubtags = __commonJS({
    "node_modules/cldr-core/supplemental/likelySubtags.json": function(exports, module) {
      module.exports = {
        supplemental: {
          version: {
            _unicodeVersion: "13.0.0",
            _cldrVersion: "39"
          },
          likelySubtags: {
            aa: "aa-Latn-ET",
            aai: "aai-Latn-ZZ",
            aak: "aak-Latn-ZZ",
            aau: "aau-Latn-ZZ",
            ab: "ab-Cyrl-GE",
            abi: "abi-Latn-ZZ",
            abq: "abq-Cyrl-ZZ",
            abr: "abr-Latn-GH",
            abt: "abt-Latn-ZZ",
            aby: "aby-Latn-ZZ",
            acd: "acd-Latn-ZZ",
            ace: "ace-Latn-ID",
            ach: "ach-Latn-UG",
            ada: "ada-Latn-GH",
            ade: "ade-Latn-ZZ",
            adj: "adj-Latn-ZZ",
            adp: "adp-Tibt-BT",
            ady: "ady-Cyrl-RU",
            adz: "adz-Latn-ZZ",
            ae: "ae-Avst-IR",
            aeb: "aeb-Arab-TN",
            aey: "aey-Latn-ZZ",
            af: "af-Latn-ZA",
            agc: "agc-Latn-ZZ",
            agd: "agd-Latn-ZZ",
            agg: "agg-Latn-ZZ",
            agm: "agm-Latn-ZZ",
            ago: "ago-Latn-ZZ",
            agq: "agq-Latn-CM",
            aha: "aha-Latn-ZZ",
            ahl: "ahl-Latn-ZZ",
            aho: "aho-Ahom-IN",
            ajg: "ajg-Latn-ZZ",
            ak: "ak-Latn-GH",
            akk: "akk-Xsux-IQ",
            ala: "ala-Latn-ZZ",
            ali: "ali-Latn-ZZ",
            aln: "aln-Latn-XK",
            alt: "alt-Cyrl-RU",
            am: "am-Ethi-ET",
            amm: "amm-Latn-ZZ",
            amn: "amn-Latn-ZZ",
            amo: "amo-Latn-NG",
            amp: "amp-Latn-ZZ",
            an: "an-Latn-ES",
            anc: "anc-Latn-ZZ",
            ank: "ank-Latn-ZZ",
            ann: "ann-Latn-ZZ",
            any: "any-Latn-ZZ",
            aoj: "aoj-Latn-ZZ",
            aom: "aom-Latn-ZZ",
            aoz: "aoz-Latn-ID",
            apc: "apc-Arab-ZZ",
            apd: "apd-Arab-TG",
            ape: "ape-Latn-ZZ",
            apr: "apr-Latn-ZZ",
            aps: "aps-Latn-ZZ",
            apz: "apz-Latn-ZZ",
            ar: "ar-Arab-EG",
            arc: "arc-Armi-IR",
            "arc-Nbat": "arc-Nbat-JO",
            "arc-Palm": "arc-Palm-SY",
            arh: "arh-Latn-ZZ",
            arn: "arn-Latn-CL",
            aro: "aro-Latn-BO",
            arq: "arq-Arab-DZ",
            ars: "ars-Arab-SA",
            ary: "ary-Arab-MA",
            arz: "arz-Arab-EG",
            as: "as-Beng-IN",
            asa: "asa-Latn-TZ",
            ase: "ase-Sgnw-US",
            asg: "asg-Latn-ZZ",
            aso: "aso-Latn-ZZ",
            ast: "ast-Latn-ES",
            ata: "ata-Latn-ZZ",
            atg: "atg-Latn-ZZ",
            atj: "atj-Latn-CA",
            auy: "auy-Latn-ZZ",
            av: "av-Cyrl-RU",
            avl: "avl-Arab-ZZ",
            avn: "avn-Latn-ZZ",
            avt: "avt-Latn-ZZ",
            avu: "avu-Latn-ZZ",
            awa: "awa-Deva-IN",
            awb: "awb-Latn-ZZ",
            awo: "awo-Latn-ZZ",
            awx: "awx-Latn-ZZ",
            ay: "ay-Latn-BO",
            ayb: "ayb-Latn-ZZ",
            az: "az-Latn-AZ",
            "az-Arab": "az-Arab-IR",
            "az-IQ": "az-Arab-IQ",
            "az-IR": "az-Arab-IR",
            "az-RU": "az-Cyrl-RU",
            ba: "ba-Cyrl-RU",
            bal: "bal-Arab-PK",
            ban: "ban-Latn-ID",
            bap: "bap-Deva-NP",
            bar: "bar-Latn-AT",
            bas: "bas-Latn-CM",
            bav: "bav-Latn-ZZ",
            bax: "bax-Bamu-CM",
            bba: "bba-Latn-ZZ",
            bbb: "bbb-Latn-ZZ",
            bbc: "bbc-Latn-ID",
            bbd: "bbd-Latn-ZZ",
            bbj: "bbj-Latn-CM",
            bbp: "bbp-Latn-ZZ",
            bbr: "bbr-Latn-ZZ",
            bcf: "bcf-Latn-ZZ",
            bch: "bch-Latn-ZZ",
            bci: "bci-Latn-CI",
            bcm: "bcm-Latn-ZZ",
            bcn: "bcn-Latn-ZZ",
            bco: "bco-Latn-ZZ",
            bcq: "bcq-Ethi-ZZ",
            bcu: "bcu-Latn-ZZ",
            bdd: "bdd-Latn-ZZ",
            be: "be-Cyrl-BY",
            bef: "bef-Latn-ZZ",
            beh: "beh-Latn-ZZ",
            bej: "bej-Arab-SD",
            bem: "bem-Latn-ZM",
            bet: "bet-Latn-ZZ",
            bew: "bew-Latn-ID",
            bex: "bex-Latn-ZZ",
            bez: "bez-Latn-TZ",
            bfd: "bfd-Latn-CM",
            bfq: "bfq-Taml-IN",
            bft: "bft-Arab-PK",
            bfy: "bfy-Deva-IN",
            bg: "bg-Cyrl-BG",
            bgc: "bgc-Deva-IN",
            bgn: "bgn-Arab-PK",
            bgx: "bgx-Grek-TR",
            bhb: "bhb-Deva-IN",
            bhg: "bhg-Latn-ZZ",
            bhi: "bhi-Deva-IN",
            bhl: "bhl-Latn-ZZ",
            bho: "bho-Deva-IN",
            bhy: "bhy-Latn-ZZ",
            bi: "bi-Latn-VU",
            bib: "bib-Latn-ZZ",
            big: "big-Latn-ZZ",
            bik: "bik-Latn-PH",
            bim: "bim-Latn-ZZ",
            bin: "bin-Latn-NG",
            bio: "bio-Latn-ZZ",
            biq: "biq-Latn-ZZ",
            bjh: "bjh-Latn-ZZ",
            bji: "bji-Ethi-ZZ",
            bjj: "bjj-Deva-IN",
            bjn: "bjn-Latn-ID",
            bjo: "bjo-Latn-ZZ",
            bjr: "bjr-Latn-ZZ",
            bjt: "bjt-Latn-SN",
            bjz: "bjz-Latn-ZZ",
            bkc: "bkc-Latn-ZZ",
            bkm: "bkm-Latn-CM",
            bkq: "bkq-Latn-ZZ",
            bku: "bku-Latn-PH",
            bkv: "bkv-Latn-ZZ",
            blt: "blt-Tavt-VN",
            bm: "bm-Latn-ML",
            bmh: "bmh-Latn-ZZ",
            bmk: "bmk-Latn-ZZ",
            bmq: "bmq-Latn-ML",
            bmu: "bmu-Latn-ZZ",
            bn: "bn-Beng-BD",
            bng: "bng-Latn-ZZ",
            bnm: "bnm-Latn-ZZ",
            bnp: "bnp-Latn-ZZ",
            bo: "bo-Tibt-CN",
            boj: "boj-Latn-ZZ",
            bom: "bom-Latn-ZZ",
            bon: "bon-Latn-ZZ",
            bpy: "bpy-Beng-IN",
            bqc: "bqc-Latn-ZZ",
            bqi: "bqi-Arab-IR",
            bqp: "bqp-Latn-ZZ",
            bqv: "bqv-Latn-CI",
            br: "br-Latn-FR",
            bra: "bra-Deva-IN",
            brh: "brh-Arab-PK",
            brx: "brx-Deva-IN",
            brz: "brz-Latn-ZZ",
            bs: "bs-Latn-BA",
            bsj: "bsj-Latn-ZZ",
            bsq: "bsq-Bass-LR",
            bss: "bss-Latn-CM",
            bst: "bst-Ethi-ZZ",
            bto: "bto-Latn-PH",
            btt: "btt-Latn-ZZ",
            btv: "btv-Deva-PK",
            bua: "bua-Cyrl-RU",
            buc: "buc-Latn-YT",
            bud: "bud-Latn-ZZ",
            bug: "bug-Latn-ID",
            buk: "buk-Latn-ZZ",
            bum: "bum-Latn-CM",
            buo: "buo-Latn-ZZ",
            bus: "bus-Latn-ZZ",
            buu: "buu-Latn-ZZ",
            bvb: "bvb-Latn-GQ",
            bwd: "bwd-Latn-ZZ",
            bwr: "bwr-Latn-ZZ",
            bxh: "bxh-Latn-ZZ",
            bye: "bye-Latn-ZZ",
            byn: "byn-Ethi-ER",
            byr: "byr-Latn-ZZ",
            bys: "bys-Latn-ZZ",
            byv: "byv-Latn-CM",
            byx: "byx-Latn-ZZ",
            bza: "bza-Latn-ZZ",
            bze: "bze-Latn-ML",
            bzf: "bzf-Latn-ZZ",
            bzh: "bzh-Latn-ZZ",
            bzw: "bzw-Latn-ZZ",
            ca: "ca-Latn-ES",
            cad: "cad-Latn-US",
            can: "can-Latn-ZZ",
            cbj: "cbj-Latn-ZZ",
            cch: "cch-Latn-NG",
            ccp: "ccp-Cakm-BD",
            ce: "ce-Cyrl-RU",
            ceb: "ceb-Latn-PH",
            cfa: "cfa-Latn-ZZ",
            cgg: "cgg-Latn-UG",
            ch: "ch-Latn-GU",
            chk: "chk-Latn-FM",
            chm: "chm-Cyrl-RU",
            cho: "cho-Latn-US",
            chp: "chp-Latn-CA",
            chr: "chr-Cher-US",
            cic: "cic-Latn-US",
            cja: "cja-Arab-KH",
            cjm: "cjm-Cham-VN",
            cjv: "cjv-Latn-ZZ",
            ckb: "ckb-Arab-IQ",
            ckl: "ckl-Latn-ZZ",
            cko: "cko-Latn-ZZ",
            cky: "cky-Latn-ZZ",
            cla: "cla-Latn-ZZ",
            cme: "cme-Latn-ZZ",
            cmg: "cmg-Soyo-MN",
            co: "co-Latn-FR",
            cop: "cop-Copt-EG",
            cps: "cps-Latn-PH",
            cr: "cr-Cans-CA",
            crh: "crh-Cyrl-UA",
            crj: "crj-Cans-CA",
            crk: "crk-Cans-CA",
            crl: "crl-Cans-CA",
            crm: "crm-Cans-CA",
            crs: "crs-Latn-SC",
            cs: "cs-Latn-CZ",
            csb: "csb-Latn-PL",
            csw: "csw-Cans-CA",
            ctd: "ctd-Pauc-MM",
            cu: "cu-Cyrl-RU",
            "cu-Glag": "cu-Glag-BG",
            cv: "cv-Cyrl-RU",
            cy: "cy-Latn-GB",
            da: "da-Latn-DK",
            dad: "dad-Latn-ZZ",
            daf: "daf-Latn-CI",
            dag: "dag-Latn-ZZ",
            dah: "dah-Latn-ZZ",
            dak: "dak-Latn-US",
            dar: "dar-Cyrl-RU",
            dav: "dav-Latn-KE",
            dbd: "dbd-Latn-ZZ",
            dbq: "dbq-Latn-ZZ",
            dcc: "dcc-Arab-IN",
            ddn: "ddn-Latn-ZZ",
            de: "de-Latn-DE",
            ded: "ded-Latn-ZZ",
            den: "den-Latn-CA",
            dga: "dga-Latn-ZZ",
            dgh: "dgh-Latn-ZZ",
            dgi: "dgi-Latn-ZZ",
            dgl: "dgl-Arab-ZZ",
            dgr: "dgr-Latn-CA",
            dgz: "dgz-Latn-ZZ",
            dia: "dia-Latn-ZZ",
            dje: "dje-Latn-NE",
            dmf: "dmf-Medf-NG",
            dnj: "dnj-Latn-CI",
            dob: "dob-Latn-ZZ",
            doi: "doi-Deva-IN",
            dop: "dop-Latn-ZZ",
            dow: "dow-Latn-ZZ",
            drh: "drh-Mong-CN",
            dri: "dri-Latn-ZZ",
            drs: "drs-Ethi-ZZ",
            dsb: "dsb-Latn-DE",
            dtm: "dtm-Latn-ML",
            dtp: "dtp-Latn-MY",
            dts: "dts-Latn-ZZ",
            dty: "dty-Deva-NP",
            dua: "dua-Latn-CM",
            duc: "duc-Latn-ZZ",
            dud: "dud-Latn-ZZ",
            dug: "dug-Latn-ZZ",
            dv: "dv-Thaa-MV",
            dva: "dva-Latn-ZZ",
            dww: "dww-Latn-ZZ",
            dyo: "dyo-Latn-SN",
            dyu: "dyu-Latn-BF",
            dz: "dz-Tibt-BT",
            dzg: "dzg-Latn-ZZ",
            ebu: "ebu-Latn-KE",
            ee: "ee-Latn-GH",
            efi: "efi-Latn-NG",
            egl: "egl-Latn-IT",
            egy: "egy-Egyp-EG",
            eka: "eka-Latn-ZZ",
            eky: "eky-Kali-MM",
            el: "el-Grek-GR",
            ema: "ema-Latn-ZZ",
            emi: "emi-Latn-ZZ",
            en: "en-Latn-US",
            "en-Shaw": "en-Shaw-GB",
            enn: "enn-Latn-ZZ",
            enq: "enq-Latn-ZZ",
            eo: "eo-Latn-001",
            eri: "eri-Latn-ZZ",
            es: "es-Latn-ES",
            esg: "esg-Gonm-IN",
            esu: "esu-Latn-US",
            et: "et-Latn-EE",
            etr: "etr-Latn-ZZ",
            ett: "ett-Ital-IT",
            etu: "etu-Latn-ZZ",
            etx: "etx-Latn-ZZ",
            eu: "eu-Latn-ES",
            ewo: "ewo-Latn-CM",
            ext: "ext-Latn-ES",
            eza: "eza-Latn-ZZ",
            fa: "fa-Arab-IR",
            faa: "faa-Latn-ZZ",
            fab: "fab-Latn-ZZ",
            fag: "fag-Latn-ZZ",
            fai: "fai-Latn-ZZ",
            fan: "fan-Latn-GQ",
            ff: "ff-Latn-SN",
            "ff-Adlm": "ff-Adlm-GN",
            ffi: "ffi-Latn-ZZ",
            ffm: "ffm-Latn-ML",
            fi: "fi-Latn-FI",
            fia: "fia-Arab-SD",
            fil: "fil-Latn-PH",
            fit: "fit-Latn-SE",
            fj: "fj-Latn-FJ",
            flr: "flr-Latn-ZZ",
            fmp: "fmp-Latn-ZZ",
            fo: "fo-Latn-FO",
            fod: "fod-Latn-ZZ",
            fon: "fon-Latn-BJ",
            for: "for-Latn-ZZ",
            fpe: "fpe-Latn-ZZ",
            fqs: "fqs-Latn-ZZ",
            fr: "fr-Latn-FR",
            frc: "frc-Latn-US",
            frp: "frp-Latn-FR",
            frr: "frr-Latn-DE",
            frs: "frs-Latn-DE",
            fub: "fub-Arab-CM",
            fud: "fud-Latn-WF",
            fue: "fue-Latn-ZZ",
            fuf: "fuf-Latn-GN",
            fuh: "fuh-Latn-ZZ",
            fuq: "fuq-Latn-NE",
            fur: "fur-Latn-IT",
            fuv: "fuv-Latn-NG",
            fuy: "fuy-Latn-ZZ",
            fvr: "fvr-Latn-SD",
            fy: "fy-Latn-NL",
            ga: "ga-Latn-IE",
            gaa: "gaa-Latn-GH",
            gaf: "gaf-Latn-ZZ",
            gag: "gag-Latn-MD",
            gah: "gah-Latn-ZZ",
            gaj: "gaj-Latn-ZZ",
            gam: "gam-Latn-ZZ",
            gan: "gan-Hans-CN",
            gaw: "gaw-Latn-ZZ",
            gay: "gay-Latn-ID",
            gba: "gba-Latn-ZZ",
            gbf: "gbf-Latn-ZZ",
            gbm: "gbm-Deva-IN",
            gby: "gby-Latn-ZZ",
            gbz: "gbz-Arab-IR",
            gcr: "gcr-Latn-GF",
            gd: "gd-Latn-GB",
            gde: "gde-Latn-ZZ",
            gdn: "gdn-Latn-ZZ",
            gdr: "gdr-Latn-ZZ",
            geb: "geb-Latn-ZZ",
            gej: "gej-Latn-ZZ",
            gel: "gel-Latn-ZZ",
            gez: "gez-Ethi-ET",
            gfk: "gfk-Latn-ZZ",
            ggn: "ggn-Deva-NP",
            ghs: "ghs-Latn-ZZ",
            gil: "gil-Latn-KI",
            gim: "gim-Latn-ZZ",
            gjk: "gjk-Arab-PK",
            gjn: "gjn-Latn-ZZ",
            gju: "gju-Arab-PK",
            gkn: "gkn-Latn-ZZ",
            gkp: "gkp-Latn-ZZ",
            gl: "gl-Latn-ES",
            glk: "glk-Arab-IR",
            gmm: "gmm-Latn-ZZ",
            gmv: "gmv-Ethi-ZZ",
            gn: "gn-Latn-PY",
            gnd: "gnd-Latn-ZZ",
            gng: "gng-Latn-ZZ",
            god: "god-Latn-ZZ",
            gof: "gof-Ethi-ZZ",
            goi: "goi-Latn-ZZ",
            gom: "gom-Deva-IN",
            gon: "gon-Telu-IN",
            gor: "gor-Latn-ID",
            gos: "gos-Latn-NL",
            got: "got-Goth-UA",
            grb: "grb-Latn-ZZ",
            grc: "grc-Cprt-CY",
            "grc-Linb": "grc-Linb-GR",
            grt: "grt-Beng-IN",
            grw: "grw-Latn-ZZ",
            gsw: "gsw-Latn-CH",
            gu: "gu-Gujr-IN",
            gub: "gub-Latn-BR",
            guc: "guc-Latn-CO",
            gud: "gud-Latn-ZZ",
            gur: "gur-Latn-GH",
            guw: "guw-Latn-ZZ",
            gux: "gux-Latn-ZZ",
            guz: "guz-Latn-KE",
            gv: "gv-Latn-IM",
            gvf: "gvf-Latn-ZZ",
            gvr: "gvr-Deva-NP",
            gvs: "gvs-Latn-ZZ",
            gwc: "gwc-Arab-ZZ",
            gwi: "gwi-Latn-CA",
            gwt: "gwt-Arab-ZZ",
            gyi: "gyi-Latn-ZZ",
            ha: "ha-Latn-NG",
            "ha-CM": "ha-Arab-CM",
            "ha-SD": "ha-Arab-SD",
            hag: "hag-Latn-ZZ",
            hak: "hak-Hans-CN",
            ham: "ham-Latn-ZZ",
            haw: "haw-Latn-US",
            haz: "haz-Arab-AF",
            hbb: "hbb-Latn-ZZ",
            hdy: "hdy-Ethi-ZZ",
            he: "he-Hebr-IL",
            hhy: "hhy-Latn-ZZ",
            hi: "hi-Deva-IN",
            hia: "hia-Latn-ZZ",
            hif: "hif-Latn-FJ",
            hig: "hig-Latn-ZZ",
            hih: "hih-Latn-ZZ",
            hil: "hil-Latn-PH",
            hla: "hla-Latn-ZZ",
            hlu: "hlu-Hluw-TR",
            hmd: "hmd-Plrd-CN",
            hmt: "hmt-Latn-ZZ",
            hnd: "hnd-Arab-PK",
            hne: "hne-Deva-IN",
            hnj: "hnj-Hmng-LA",
            hnn: "hnn-Latn-PH",
            hno: "hno-Arab-PK",
            ho: "ho-Latn-PG",
            hoc: "hoc-Deva-IN",
            hoj: "hoj-Deva-IN",
            hot: "hot-Latn-ZZ",
            hr: "hr-Latn-HR",
            hsb: "hsb-Latn-DE",
            hsn: "hsn-Hans-CN",
            ht: "ht-Latn-HT",
            hu: "hu-Latn-HU",
            hui: "hui-Latn-ZZ",
            hy: "hy-Armn-AM",
            hz: "hz-Latn-NA",
            ia: "ia-Latn-001",
            ian: "ian-Latn-ZZ",
            iar: "iar-Latn-ZZ",
            iba: "iba-Latn-MY",
            ibb: "ibb-Latn-NG",
            iby: "iby-Latn-ZZ",
            ica: "ica-Latn-ZZ",
            ich: "ich-Latn-ZZ",
            id: "id-Latn-ID",
            idd: "idd-Latn-ZZ",
            idi: "idi-Latn-ZZ",
            idu: "idu-Latn-ZZ",
            ife: "ife-Latn-TG",
            ig: "ig-Latn-NG",
            igb: "igb-Latn-ZZ",
            ige: "ige-Latn-ZZ",
            ii: "ii-Yiii-CN",
            ijj: "ijj-Latn-ZZ",
            ik: "ik-Latn-US",
            ikk: "ikk-Latn-ZZ",
            ikt: "ikt-Latn-CA",
            ikw: "ikw-Latn-ZZ",
            ikx: "ikx-Latn-ZZ",
            ilo: "ilo-Latn-PH",
            imo: "imo-Latn-ZZ",
            in: "in-Latn-ID",
            inh: "inh-Cyrl-RU",
            io: "io-Latn-001",
            iou: "iou-Latn-ZZ",
            iri: "iri-Latn-ZZ",
            is: "is-Latn-IS",
            it: "it-Latn-IT",
            iu: "iu-Cans-CA",
            iw: "iw-Hebr-IL",
            iwm: "iwm-Latn-ZZ",
            iws: "iws-Latn-ZZ",
            izh: "izh-Latn-RU",
            izi: "izi-Latn-ZZ",
            ja: "ja-Jpan-JP",
            jab: "jab-Latn-ZZ",
            jam: "jam-Latn-JM",
            jar: "jar-Latn-ZZ",
            jbo: "jbo-Latn-001",
            jbu: "jbu-Latn-ZZ",
            jen: "jen-Latn-ZZ",
            jgk: "jgk-Latn-ZZ",
            jgo: "jgo-Latn-CM",
            ji: "ji-Hebr-UA",
            jib: "jib-Latn-ZZ",
            jmc: "jmc-Latn-TZ",
            jml: "jml-Deva-NP",
            jra: "jra-Latn-ZZ",
            jut: "jut-Latn-DK",
            jv: "jv-Latn-ID",
            jw: "jw-Latn-ID",
            ka: "ka-Geor-GE",
            kaa: "kaa-Cyrl-UZ",
            kab: "kab-Latn-DZ",
            kac: "kac-Latn-MM",
            kad: "kad-Latn-ZZ",
            kai: "kai-Latn-ZZ",
            kaj: "kaj-Latn-NG",
            kam: "kam-Latn-KE",
            kao: "kao-Latn-ML",
            kbd: "kbd-Cyrl-RU",
            kbm: "kbm-Latn-ZZ",
            kbp: "kbp-Latn-ZZ",
            kbq: "kbq-Latn-ZZ",
            kbx: "kbx-Latn-ZZ",
            kby: "kby-Arab-NE",
            kcg: "kcg-Latn-NG",
            kck: "kck-Latn-ZW",
            kcl: "kcl-Latn-ZZ",
            kct: "kct-Latn-ZZ",
            kde: "kde-Latn-TZ",
            kdh: "kdh-Arab-TG",
            kdl: "kdl-Latn-ZZ",
            kdt: "kdt-Thai-TH",
            kea: "kea-Latn-CV",
            ken: "ken-Latn-CM",
            kez: "kez-Latn-ZZ",
            kfo: "kfo-Latn-CI",
            kfr: "kfr-Deva-IN",
            kfy: "kfy-Deva-IN",
            kg: "kg-Latn-CD",
            kge: "kge-Latn-ID",
            kgf: "kgf-Latn-ZZ",
            kgp: "kgp-Latn-BR",
            kha: "kha-Latn-IN",
            khb: "khb-Talu-CN",
            khn: "khn-Deva-IN",
            khq: "khq-Latn-ML",
            khs: "khs-Latn-ZZ",
            kht: "kht-Mymr-IN",
            khw: "khw-Arab-PK",
            khz: "khz-Latn-ZZ",
            ki: "ki-Latn-KE",
            kij: "kij-Latn-ZZ",
            kiu: "kiu-Latn-TR",
            kiw: "kiw-Latn-ZZ",
            kj: "kj-Latn-NA",
            kjd: "kjd-Latn-ZZ",
            kjg: "kjg-Laoo-LA",
            kjs: "kjs-Latn-ZZ",
            kjy: "kjy-Latn-ZZ",
            kk: "kk-Cyrl-KZ",
            "kk-AF": "kk-Arab-AF",
            "kk-Arab": "kk-Arab-CN",
            "kk-CN": "kk-Arab-CN",
            "kk-IR": "kk-Arab-IR",
            "kk-MN": "kk-Arab-MN",
            kkc: "kkc-Latn-ZZ",
            kkj: "kkj-Latn-CM",
            kl: "kl-Latn-GL",
            kln: "kln-Latn-KE",
            klq: "klq-Latn-ZZ",
            klt: "klt-Latn-ZZ",
            klx: "klx-Latn-ZZ",
            km: "km-Khmr-KH",
            kmb: "kmb-Latn-AO",
            kmh: "kmh-Latn-ZZ",
            kmo: "kmo-Latn-ZZ",
            kms: "kms-Latn-ZZ",
            kmu: "kmu-Latn-ZZ",
            kmw: "kmw-Latn-ZZ",
            kn: "kn-Knda-IN",
            knf: "knf-Latn-GW",
            knp: "knp-Latn-ZZ",
            ko: "ko-Kore-KR",
            koi: "koi-Cyrl-RU",
            kok: "kok-Deva-IN",
            kol: "kol-Latn-ZZ",
            kos: "kos-Latn-FM",
            koz: "koz-Latn-ZZ",
            kpe: "kpe-Latn-LR",
            kpf: "kpf-Latn-ZZ",
            kpo: "kpo-Latn-ZZ",
            kpr: "kpr-Latn-ZZ",
            kpx: "kpx-Latn-ZZ",
            kqb: "kqb-Latn-ZZ",
            kqf: "kqf-Latn-ZZ",
            kqs: "kqs-Latn-ZZ",
            kqy: "kqy-Ethi-ZZ",
            kr: "kr-Latn-ZZ",
            krc: "krc-Cyrl-RU",
            kri: "kri-Latn-SL",
            krj: "krj-Latn-PH",
            krl: "krl-Latn-RU",
            krs: "krs-Latn-ZZ",
            kru: "kru-Deva-IN",
            ks: "ks-Arab-IN",
            ksb: "ksb-Latn-TZ",
            ksd: "ksd-Latn-ZZ",
            ksf: "ksf-Latn-CM",
            ksh: "ksh-Latn-DE",
            ksj: "ksj-Latn-ZZ",
            ksr: "ksr-Latn-ZZ",
            ktb: "ktb-Ethi-ZZ",
            ktm: "ktm-Latn-ZZ",
            kto: "kto-Latn-ZZ",
            ktr: "ktr-Latn-MY",
            ku: "ku-Latn-TR",
            "ku-Arab": "ku-Arab-IQ",
            "ku-LB": "ku-Arab-LB",
            "ku-Yezi": "ku-Yezi-GE",
            kub: "kub-Latn-ZZ",
            kud: "kud-Latn-ZZ",
            kue: "kue-Latn-ZZ",
            kuj: "kuj-Latn-ZZ",
            kum: "kum-Cyrl-RU",
            kun: "kun-Latn-ZZ",
            kup: "kup-Latn-ZZ",
            kus: "kus-Latn-ZZ",
            kv: "kv-Cyrl-RU",
            kvg: "kvg-Latn-ZZ",
            kvr: "kvr-Latn-ID",
            kvx: "kvx-Arab-PK",
            kw: "kw-Latn-GB",
            kwj: "kwj-Latn-ZZ",
            kwo: "kwo-Latn-ZZ",
            kwq: "kwq-Latn-ZZ",
            kxa: "kxa-Latn-ZZ",
            kxc: "kxc-Ethi-ZZ",
            kxe: "kxe-Latn-ZZ",
            kxl: "kxl-Deva-IN",
            kxm: "kxm-Thai-TH",
            kxp: "kxp-Arab-PK",
            kxw: "kxw-Latn-ZZ",
            kxz: "kxz-Latn-ZZ",
            ky: "ky-Cyrl-KG",
            "ky-Arab": "ky-Arab-CN",
            "ky-CN": "ky-Arab-CN",
            "ky-Latn": "ky-Latn-TR",
            "ky-TR": "ky-Latn-TR",
            kye: "kye-Latn-ZZ",
            kyx: "kyx-Latn-ZZ",
            kzh: "kzh-Arab-ZZ",
            kzj: "kzj-Latn-MY",
            kzr: "kzr-Latn-ZZ",
            kzt: "kzt-Latn-MY",
            la: "la-Latn-VA",
            lab: "lab-Lina-GR",
            lad: "lad-Hebr-IL",
            lag: "lag-Latn-TZ",
            lah: "lah-Arab-PK",
            laj: "laj-Latn-UG",
            las: "las-Latn-ZZ",
            lb: "lb-Latn-LU",
            lbe: "lbe-Cyrl-RU",
            lbu: "lbu-Latn-ZZ",
            lbw: "lbw-Latn-ID",
            lcm: "lcm-Latn-ZZ",
            lcp: "lcp-Thai-CN",
            ldb: "ldb-Latn-ZZ",
            led: "led-Latn-ZZ",
            lee: "lee-Latn-ZZ",
            lem: "lem-Latn-ZZ",
            lep: "lep-Lepc-IN",
            leq: "leq-Latn-ZZ",
            leu: "leu-Latn-ZZ",
            lez: "lez-Cyrl-RU",
            lg: "lg-Latn-UG",
            lgg: "lgg-Latn-ZZ",
            li: "li-Latn-NL",
            lia: "lia-Latn-ZZ",
            lid: "lid-Latn-ZZ",
            lif: "lif-Deva-NP",
            "lif-Limb": "lif-Limb-IN",
            lig: "lig-Latn-ZZ",
            lih: "lih-Latn-ZZ",
            lij: "lij-Latn-IT",
            lis: "lis-Lisu-CN",
            ljp: "ljp-Latn-ID",
            lki: "lki-Arab-IR",
            lkt: "lkt-Latn-US",
            lle: "lle-Latn-ZZ",
            lln: "lln-Latn-ZZ",
            lmn: "lmn-Telu-IN",
            lmo: "lmo-Latn-IT",
            lmp: "lmp-Latn-ZZ",
            ln: "ln-Latn-CD",
            lns: "lns-Latn-ZZ",
            lnu: "lnu-Latn-ZZ",
            lo: "lo-Laoo-LA",
            loj: "loj-Latn-ZZ",
            lok: "lok-Latn-ZZ",
            lol: "lol-Latn-CD",
            lor: "lor-Latn-ZZ",
            los: "los-Latn-ZZ",
            loz: "loz-Latn-ZM",
            lrc: "lrc-Arab-IR",
            lt: "lt-Latn-LT",
            ltg: "ltg-Latn-LV",
            lu: "lu-Latn-CD",
            lua: "lua-Latn-CD",
            luo: "luo-Latn-KE",
            luy: "luy-Latn-KE",
            luz: "luz-Arab-IR",
            lv: "lv-Latn-LV",
            lwl: "lwl-Thai-TH",
            lzh: "lzh-Hans-CN",
            lzz: "lzz-Latn-TR",
            mad: "mad-Latn-ID",
            maf: "maf-Latn-CM",
            mag: "mag-Deva-IN",
            mai: "mai-Deva-IN",
            mak: "mak-Latn-ID",
            man: "man-Latn-GM",
            "man-GN": "man-Nkoo-GN",
            "man-Nkoo": "man-Nkoo-GN",
            mas: "mas-Latn-KE",
            maw: "maw-Latn-ZZ",
            maz: "maz-Latn-MX",
            mbh: "mbh-Latn-ZZ",
            mbo: "mbo-Latn-ZZ",
            mbq: "mbq-Latn-ZZ",
            mbu: "mbu-Latn-ZZ",
            mbw: "mbw-Latn-ZZ",
            mci: "mci-Latn-ZZ",
            mcp: "mcp-Latn-ZZ",
            mcq: "mcq-Latn-ZZ",
            mcr: "mcr-Latn-ZZ",
            mcu: "mcu-Latn-ZZ",
            mda: "mda-Latn-ZZ",
            mde: "mde-Arab-ZZ",
            mdf: "mdf-Cyrl-RU",
            mdh: "mdh-Latn-PH",
            mdj: "mdj-Latn-ZZ",
            mdr: "mdr-Latn-ID",
            mdx: "mdx-Ethi-ZZ",
            med: "med-Latn-ZZ",
            mee: "mee-Latn-ZZ",
            mek: "mek-Latn-ZZ",
            men: "men-Latn-SL",
            mer: "mer-Latn-KE",
            met: "met-Latn-ZZ",
            meu: "meu-Latn-ZZ",
            mfa: "mfa-Arab-TH",
            mfe: "mfe-Latn-MU",
            mfn: "mfn-Latn-ZZ",
            mfo: "mfo-Latn-ZZ",
            mfq: "mfq-Latn-ZZ",
            mg: "mg-Latn-MG",
            mgh: "mgh-Latn-MZ",
            mgl: "mgl-Latn-ZZ",
            mgo: "mgo-Latn-CM",
            mgp: "mgp-Deva-NP",
            mgy: "mgy-Latn-TZ",
            mh: "mh-Latn-MH",
            mhi: "mhi-Latn-ZZ",
            mhl: "mhl-Latn-ZZ",
            mi: "mi-Latn-NZ",
            mif: "mif-Latn-ZZ",
            min: "min-Latn-ID",
            miw: "miw-Latn-ZZ",
            mk: "mk-Cyrl-MK",
            mki: "mki-Arab-ZZ",
            mkl: "mkl-Latn-ZZ",
            mkp: "mkp-Latn-ZZ",
            mkw: "mkw-Latn-ZZ",
            ml: "ml-Mlym-IN",
            mle: "mle-Latn-ZZ",
            mlp: "mlp-Latn-ZZ",
            mls: "mls-Latn-SD",
            mmo: "mmo-Latn-ZZ",
            mmu: "mmu-Latn-ZZ",
            mmx: "mmx-Latn-ZZ",
            mn: "mn-Cyrl-MN",
            "mn-CN": "mn-Mong-CN",
            "mn-Mong": "mn-Mong-CN",
            mna: "mna-Latn-ZZ",
            mnf: "mnf-Latn-ZZ",
            mni: "mni-Beng-IN",
            mnw: "mnw-Mymr-MM",
            mo: "mo-Latn-RO",
            moa: "moa-Latn-ZZ",
            moe: "moe-Latn-CA",
            moh: "moh-Latn-CA",
            mos: "mos-Latn-BF",
            mox: "mox-Latn-ZZ",
            mpp: "mpp-Latn-ZZ",
            mps: "mps-Latn-ZZ",
            mpt: "mpt-Latn-ZZ",
            mpx: "mpx-Latn-ZZ",
            mql: "mql-Latn-ZZ",
            mr: "mr-Deva-IN",
            mrd: "mrd-Deva-NP",
            mrj: "mrj-Cyrl-RU",
            mro: "mro-Mroo-BD",
            ms: "ms-Latn-MY",
            "ms-CC": "ms-Arab-CC",
            mt: "mt-Latn-MT",
            mtc: "mtc-Latn-ZZ",
            mtf: "mtf-Latn-ZZ",
            mti: "mti-Latn-ZZ",
            mtr: "mtr-Deva-IN",
            mua: "mua-Latn-CM",
            mur: "mur-Latn-ZZ",
            mus: "mus-Latn-US",
            mva: "mva-Latn-ZZ",
            mvn: "mvn-Latn-ZZ",
            mvy: "mvy-Arab-PK",
            mwk: "mwk-Latn-ML",
            mwr: "mwr-Deva-IN",
            mwv: "mwv-Latn-ID",
            mww: "mww-Hmnp-US",
            mxc: "mxc-Latn-ZW",
            mxm: "mxm-Latn-ZZ",
            my: "my-Mymr-MM",
            myk: "myk-Latn-ZZ",
            mym: "mym-Ethi-ZZ",
            myv: "myv-Cyrl-RU",
            myw: "myw-Latn-ZZ",
            myx: "myx-Latn-UG",
            myz: "myz-Mand-IR",
            mzk: "mzk-Latn-ZZ",
            mzm: "mzm-Latn-ZZ",
            mzn: "mzn-Arab-IR",
            mzp: "mzp-Latn-ZZ",
            mzw: "mzw-Latn-ZZ",
            mzz: "mzz-Latn-ZZ",
            na: "na-Latn-NR",
            nac: "nac-Latn-ZZ",
            naf: "naf-Latn-ZZ",
            nak: "nak-Latn-ZZ",
            nan: "nan-Hans-CN",
            nap: "nap-Latn-IT",
            naq: "naq-Latn-NA",
            nas: "nas-Latn-ZZ",
            nb: "nb-Latn-NO",
            nca: "nca-Latn-ZZ",
            nce: "nce-Latn-ZZ",
            ncf: "ncf-Latn-ZZ",
            nch: "nch-Latn-MX",
            nco: "nco-Latn-ZZ",
            ncu: "ncu-Latn-ZZ",
            nd: "nd-Latn-ZW",
            ndc: "ndc-Latn-MZ",
            nds: "nds-Latn-DE",
            ne: "ne-Deva-NP",
            neb: "neb-Latn-ZZ",
            new: "new-Deva-NP",
            nex: "nex-Latn-ZZ",
            nfr: "nfr-Latn-ZZ",
            ng: "ng-Latn-NA",
            nga: "nga-Latn-ZZ",
            ngb: "ngb-Latn-ZZ",
            ngl: "ngl-Latn-MZ",
            nhb: "nhb-Latn-ZZ",
            nhe: "nhe-Latn-MX",
            nhw: "nhw-Latn-MX",
            nif: "nif-Latn-ZZ",
            nii: "nii-Latn-ZZ",
            nij: "nij-Latn-ID",
            nin: "nin-Latn-ZZ",
            niu: "niu-Latn-NU",
            niy: "niy-Latn-ZZ",
            niz: "niz-Latn-ZZ",
            njo: "njo-Latn-IN",
            nkg: "nkg-Latn-ZZ",
            nko: "nko-Latn-ZZ",
            nl: "nl-Latn-NL",
            nmg: "nmg-Latn-CM",
            nmz: "nmz-Latn-ZZ",
            nn: "nn-Latn-NO",
            nnf: "nnf-Latn-ZZ",
            nnh: "nnh-Latn-CM",
            nnk: "nnk-Latn-ZZ",
            nnm: "nnm-Latn-ZZ",
            nnp: "nnp-Wcho-IN",
            no: "no-Latn-NO",
            nod: "nod-Lana-TH",
            noe: "noe-Deva-IN",
            non: "non-Runr-SE",
            nop: "nop-Latn-ZZ",
            nou: "nou-Latn-ZZ",
            nqo: "nqo-Nkoo-GN",
            nr: "nr-Latn-ZA",
            nrb: "nrb-Latn-ZZ",
            nsk: "nsk-Cans-CA",
            nsn: "nsn-Latn-ZZ",
            nso: "nso-Latn-ZA",
            nss: "nss-Latn-ZZ",
            ntm: "ntm-Latn-ZZ",
            ntr: "ntr-Latn-ZZ",
            nui: "nui-Latn-ZZ",
            nup: "nup-Latn-ZZ",
            nus: "nus-Latn-SS",
            nuv: "nuv-Latn-ZZ",
            nux: "nux-Latn-ZZ",
            nv: "nv-Latn-US",
            nwb: "nwb-Latn-ZZ",
            nxq: "nxq-Latn-CN",
            nxr: "nxr-Latn-ZZ",
            ny: "ny-Latn-MW",
            nym: "nym-Latn-TZ",
            nyn: "nyn-Latn-UG",
            nzi: "nzi-Latn-GH",
            oc: "oc-Latn-FR",
            ogc: "ogc-Latn-ZZ",
            okr: "okr-Latn-ZZ",
            okv: "okv-Latn-ZZ",
            om: "om-Latn-ET",
            ong: "ong-Latn-ZZ",
            onn: "onn-Latn-ZZ",
            ons: "ons-Latn-ZZ",
            opm: "opm-Latn-ZZ",
            or: "or-Orya-IN",
            oro: "oro-Latn-ZZ",
            oru: "oru-Arab-ZZ",
            os: "os-Cyrl-GE",
            osa: "osa-Osge-US",
            ota: "ota-Arab-ZZ",
            otk: "otk-Orkh-MN",
            ozm: "ozm-Latn-ZZ",
            pa: "pa-Guru-IN",
            "pa-Arab": "pa-Arab-PK",
            "pa-PK": "pa-Arab-PK",
            pag: "pag-Latn-PH",
            pal: "pal-Phli-IR",
            "pal-Phlp": "pal-Phlp-CN",
            pam: "pam-Latn-PH",
            pap: "pap-Latn-AW",
            pau: "pau-Latn-PW",
            pbi: "pbi-Latn-ZZ",
            pcd: "pcd-Latn-FR",
            pcm: "pcm-Latn-NG",
            pdc: "pdc-Latn-US",
            pdt: "pdt-Latn-CA",
            ped: "ped-Latn-ZZ",
            peo: "peo-Xpeo-IR",
            pex: "pex-Latn-ZZ",
            pfl: "pfl-Latn-DE",
            phl: "phl-Arab-ZZ",
            phn: "phn-Phnx-LB",
            pil: "pil-Latn-ZZ",
            pip: "pip-Latn-ZZ",
            pka: "pka-Brah-IN",
            pko: "pko-Latn-KE",
            pl: "pl-Latn-PL",
            pla: "pla-Latn-ZZ",
            pms: "pms-Latn-IT",
            png: "png-Latn-ZZ",
            pnn: "pnn-Latn-ZZ",
            pnt: "pnt-Grek-GR",
            pon: "pon-Latn-FM",
            ppa: "ppa-Deva-IN",
            ppo: "ppo-Latn-ZZ",
            pra: "pra-Khar-PK",
            prd: "prd-Arab-IR",
            prg: "prg-Latn-001",
            ps: "ps-Arab-AF",
            pss: "pss-Latn-ZZ",
            pt: "pt-Latn-BR",
            ptp: "ptp-Latn-ZZ",
            puu: "puu-Latn-GA",
            pwa: "pwa-Latn-ZZ",
            qu: "qu-Latn-PE",
            quc: "quc-Latn-GT",
            qug: "qug-Latn-EC",
            rai: "rai-Latn-ZZ",
            raj: "raj-Deva-IN",
            rao: "rao-Latn-ZZ",
            rcf: "rcf-Latn-RE",
            rej: "rej-Latn-ID",
            rel: "rel-Latn-ZZ",
            res: "res-Latn-ZZ",
            rgn: "rgn-Latn-IT",
            rhg: "rhg-Arab-MM",
            ria: "ria-Latn-IN",
            rif: "rif-Tfng-MA",
            "rif-NL": "rif-Latn-NL",
            rjs: "rjs-Deva-NP",
            rkt: "rkt-Beng-BD",
            rm: "rm-Latn-CH",
            rmf: "rmf-Latn-FI",
            rmo: "rmo-Latn-CH",
            rmt: "rmt-Arab-IR",
            rmu: "rmu-Latn-SE",
            rn: "rn-Latn-BI",
            rna: "rna-Latn-ZZ",
            rng: "rng-Latn-MZ",
            ro: "ro-Latn-RO",
            rob: "rob-Latn-ID",
            rof: "rof-Latn-TZ",
            roo: "roo-Latn-ZZ",
            rro: "rro-Latn-ZZ",
            rtm: "rtm-Latn-FJ",
            ru: "ru-Cyrl-RU",
            rue: "rue-Cyrl-UA",
            rug: "rug-Latn-SB",
            rw: "rw-Latn-RW",
            rwk: "rwk-Latn-TZ",
            rwo: "rwo-Latn-ZZ",
            ryu: "ryu-Kana-JP",
            sa: "sa-Deva-IN",
            saf: "saf-Latn-GH",
            sah: "sah-Cyrl-RU",
            saq: "saq-Latn-KE",
            sas: "sas-Latn-ID",
            sat: "sat-Olck-IN",
            sav: "sav-Latn-SN",
            saz: "saz-Saur-IN",
            sba: "sba-Latn-ZZ",
            sbe: "sbe-Latn-ZZ",
            sbp: "sbp-Latn-TZ",
            sc: "sc-Latn-IT",
            sck: "sck-Deva-IN",
            scl: "scl-Arab-ZZ",
            scn: "scn-Latn-IT",
            sco: "sco-Latn-GB",
            scs: "scs-Latn-CA",
            sd: "sd-Arab-PK",
            "sd-Deva": "sd-Deva-IN",
            "sd-Khoj": "sd-Khoj-IN",
            "sd-Sind": "sd-Sind-IN",
            sdc: "sdc-Latn-IT",
            sdh: "sdh-Arab-IR",
            se: "se-Latn-NO",
            sef: "sef-Latn-CI",
            seh: "seh-Latn-MZ",
            sei: "sei-Latn-MX",
            ses: "ses-Latn-ML",
            sg: "sg-Latn-CF",
            sga: "sga-Ogam-IE",
            sgs: "sgs-Latn-LT",
            sgw: "sgw-Ethi-ZZ",
            sgz: "sgz-Latn-ZZ",
            shi: "shi-Tfng-MA",
            shk: "shk-Latn-ZZ",
            shn: "shn-Mymr-MM",
            shu: "shu-Arab-ZZ",
            si: "si-Sinh-LK",
            sid: "sid-Latn-ET",
            sig: "sig-Latn-ZZ",
            sil: "sil-Latn-ZZ",
            sim: "sim-Latn-ZZ",
            sjr: "sjr-Latn-ZZ",
            sk: "sk-Latn-SK",
            skc: "skc-Latn-ZZ",
            skr: "skr-Arab-PK",
            sks: "sks-Latn-ZZ",
            sl: "sl-Latn-SI",
            sld: "sld-Latn-ZZ",
            sli: "sli-Latn-PL",
            sll: "sll-Latn-ZZ",
            sly: "sly-Latn-ID",
            sm: "sm-Latn-WS",
            sma: "sma-Latn-SE",
            smj: "smj-Latn-SE",
            smn: "smn-Latn-FI",
            smp: "smp-Samr-IL",
            smq: "smq-Latn-ZZ",
            sms: "sms-Latn-FI",
            sn: "sn-Latn-ZW",
            snc: "snc-Latn-ZZ",
            snk: "snk-Latn-ML",
            snp: "snp-Latn-ZZ",
            snx: "snx-Latn-ZZ",
            sny: "sny-Latn-ZZ",
            so: "so-Latn-SO",
            sog: "sog-Sogd-UZ",
            sok: "sok-Latn-ZZ",
            soq: "soq-Latn-ZZ",
            sou: "sou-Thai-TH",
            soy: "soy-Latn-ZZ",
            spd: "spd-Latn-ZZ",
            spl: "spl-Latn-ZZ",
            sps: "sps-Latn-ZZ",
            sq: "sq-Latn-AL",
            sr: "sr-Cyrl-RS",
            "sr-ME": "sr-Latn-ME",
            "sr-RO": "sr-Latn-RO",
            "sr-RU": "sr-Latn-RU",
            "sr-TR": "sr-Latn-TR",
            srb: "srb-Sora-IN",
            srn: "srn-Latn-SR",
            srr: "srr-Latn-SN",
            srx: "srx-Deva-IN",
            ss: "ss-Latn-ZA",
            ssd: "ssd-Latn-ZZ",
            ssg: "ssg-Latn-ZZ",
            ssy: "ssy-Latn-ER",
            st: "st-Latn-ZA",
            stk: "stk-Latn-ZZ",
            stq: "stq-Latn-DE",
            su: "su-Latn-ID",
            sua: "sua-Latn-ZZ",
            sue: "sue-Latn-ZZ",
            suk: "suk-Latn-TZ",
            sur: "sur-Latn-ZZ",
            sus: "sus-Latn-GN",
            sv: "sv-Latn-SE",
            sw: "sw-Latn-TZ",
            swb: "swb-Arab-YT",
            swc: "swc-Latn-CD",
            swg: "swg-Latn-DE",
            swp: "swp-Latn-ZZ",
            swv: "swv-Deva-IN",
            sxn: "sxn-Latn-ID",
            sxw: "sxw-Latn-ZZ",
            syl: "syl-Beng-BD",
            syr: "syr-Syrc-IQ",
            szl: "szl-Latn-PL",
            ta: "ta-Taml-IN",
            taj: "taj-Deva-NP",
            tal: "tal-Latn-ZZ",
            tan: "tan-Latn-ZZ",
            taq: "taq-Latn-ZZ",
            tbc: "tbc-Latn-ZZ",
            tbd: "tbd-Latn-ZZ",
            tbf: "tbf-Latn-ZZ",
            tbg: "tbg-Latn-ZZ",
            tbo: "tbo-Latn-ZZ",
            tbw: "tbw-Latn-PH",
            tbz: "tbz-Latn-ZZ",
            tci: "tci-Latn-ZZ",
            tcy: "tcy-Knda-IN",
            tdd: "tdd-Tale-CN",
            tdg: "tdg-Deva-NP",
            tdh: "tdh-Deva-NP",
            tdu: "tdu-Latn-MY",
            te: "te-Telu-IN",
            ted: "ted-Latn-ZZ",
            tem: "tem-Latn-SL",
            teo: "teo-Latn-UG",
            tet: "tet-Latn-TL",
            tfi: "tfi-Latn-ZZ",
            tg: "tg-Cyrl-TJ",
            "tg-Arab": "tg-Arab-PK",
            "tg-PK": "tg-Arab-PK",
            tgc: "tgc-Latn-ZZ",
            tgo: "tgo-Latn-ZZ",
            tgu: "tgu-Latn-ZZ",
            th: "th-Thai-TH",
            thl: "thl-Deva-NP",
            thq: "thq-Deva-NP",
            thr: "thr-Deva-NP",
            ti: "ti-Ethi-ET",
            tif: "tif-Latn-ZZ",
            tig: "tig-Ethi-ER",
            tik: "tik-Latn-ZZ",
            tim: "tim-Latn-ZZ",
            tio: "tio-Latn-ZZ",
            tiv: "tiv-Latn-NG",
            tk: "tk-Latn-TM",
            tkl: "tkl-Latn-TK",
            tkr: "tkr-Latn-AZ",
            tkt: "tkt-Deva-NP",
            tl: "tl-Latn-PH",
            tlf: "tlf-Latn-ZZ",
            tlx: "tlx-Latn-ZZ",
            tly: "tly-Latn-AZ",
            tmh: "tmh-Latn-NE",
            tmy: "tmy-Latn-ZZ",
            tn: "tn-Latn-ZA",
            tnh: "tnh-Latn-ZZ",
            to: "to-Latn-TO",
            tof: "tof-Latn-ZZ",
            tog: "tog-Latn-MW",
            toq: "toq-Latn-ZZ",
            tpi: "tpi-Latn-PG",
            tpm: "tpm-Latn-ZZ",
            tpz: "tpz-Latn-ZZ",
            tqo: "tqo-Latn-ZZ",
            tr: "tr-Latn-TR",
            tru: "tru-Latn-TR",
            trv: "trv-Latn-TW",
            trw: "trw-Arab-PK",
            ts: "ts-Latn-ZA",
            tsd: "tsd-Grek-GR",
            tsf: "tsf-Deva-NP",
            tsg: "tsg-Latn-PH",
            tsj: "tsj-Tibt-BT",
            tsw: "tsw-Latn-ZZ",
            tt: "tt-Cyrl-RU",
            ttd: "ttd-Latn-ZZ",
            tte: "tte-Latn-ZZ",
            ttj: "ttj-Latn-UG",
            ttr: "ttr-Latn-ZZ",
            tts: "tts-Thai-TH",
            ttt: "ttt-Latn-AZ",
            tuh: "tuh-Latn-ZZ",
            tul: "tul-Latn-ZZ",
            tum: "tum-Latn-MW",
            tuq: "tuq-Latn-ZZ",
            tvd: "tvd-Latn-ZZ",
            tvl: "tvl-Latn-TV",
            tvu: "tvu-Latn-ZZ",
            twh: "twh-Latn-ZZ",
            twq: "twq-Latn-NE",
            txg: "txg-Tang-CN",
            ty: "ty-Latn-PF",
            tya: "tya-Latn-ZZ",
            tyv: "tyv-Cyrl-RU",
            tzm: "tzm-Latn-MA",
            ubu: "ubu-Latn-ZZ",
            udi: "udi-Aghb-RU",
            udm: "udm-Cyrl-RU",
            ug: "ug-Arab-CN",
            "ug-Cyrl": "ug-Cyrl-KZ",
            "ug-KZ": "ug-Cyrl-KZ",
            "ug-MN": "ug-Cyrl-MN",
            uga: "uga-Ugar-SY",
            uk: "uk-Cyrl-UA",
            uli: "uli-Latn-FM",
            umb: "umb-Latn-AO",
            und: "en-Latn-US",
            "und-002": "en-Latn-NG",
            "und-003": "en-Latn-US",
            "und-005": "pt-Latn-BR",
            "und-009": "en-Latn-AU",
            "und-011": "en-Latn-NG",
            "und-013": "es-Latn-MX",
            "und-014": "sw-Latn-TZ",
            "und-015": "ar-Arab-EG",
            "und-017": "sw-Latn-CD",
            "und-018": "en-Latn-ZA",
            "und-019": "en-Latn-US",
            "und-021": "en-Latn-US",
            "und-029": "es-Latn-CU",
            "und-030": "zh-Hans-CN",
            "und-034": "hi-Deva-IN",
            "und-035": "id-Latn-ID",
            "und-039": "it-Latn-IT",
            "und-053": "en-Latn-AU",
            "und-054": "en-Latn-PG",
            "und-057": "en-Latn-GU",
            "und-061": "sm-Latn-WS",
            "und-142": "zh-Hans-CN",
            "und-143": "uz-Latn-UZ",
            "und-145": "ar-Arab-SA",
            "und-150": "ru-Cyrl-RU",
            "und-151": "ru-Cyrl-RU",
            "und-154": "en-Latn-GB",
            "und-155": "de-Latn-DE",
            "und-202": "en-Latn-NG",
            "und-419": "es-Latn-419",
            "und-AD": "ca-Latn-AD",
            "und-Adlm": "ff-Adlm-GN",
            "und-AE": "ar-Arab-AE",
            "und-AF": "fa-Arab-AF",
            "und-Aghb": "udi-Aghb-RU",
            "und-Ahom": "aho-Ahom-IN",
            "und-AL": "sq-Latn-AL",
            "und-AM": "hy-Armn-AM",
            "und-AO": "pt-Latn-AO",
            "und-AQ": "und-Latn-AQ",
            "und-AR": "es-Latn-AR",
            "und-Arab": "ar-Arab-EG",
            "und-Arab-CC": "ms-Arab-CC",
            "und-Arab-CN": "ug-Arab-CN",
            "und-Arab-GB": "ks-Arab-GB",
            "und-Arab-ID": "ms-Arab-ID",
            "und-Arab-IN": "ur-Arab-IN",
            "und-Arab-KH": "cja-Arab-KH",
            "und-Arab-MM": "rhg-Arab-MM",
            "und-Arab-MN": "kk-Arab-MN",
            "und-Arab-MU": "ur-Arab-MU",
            "und-Arab-NG": "ha-Arab-NG",
            "und-Arab-PK": "ur-Arab-PK",
            "und-Arab-TG": "apd-Arab-TG",
            "und-Arab-TH": "mfa-Arab-TH",
            "und-Arab-TJ": "fa-Arab-TJ",
            "und-Arab-TR": "az-Arab-TR",
            "und-Arab-YT": "swb-Arab-YT",
            "und-Armi": "arc-Armi-IR",
            "und-Armn": "hy-Armn-AM",
            "und-AS": "sm-Latn-AS",
            "und-AT": "de-Latn-AT",
            "und-Avst": "ae-Avst-IR",
            "und-AW": "nl-Latn-AW",
            "und-AX": "sv-Latn-AX",
            "und-AZ": "az-Latn-AZ",
            "und-BA": "bs-Latn-BA",
            "und-Bali": "ban-Bali-ID",
            "und-Bamu": "bax-Bamu-CM",
            "und-Bass": "bsq-Bass-LR",
            "und-Batk": "bbc-Batk-ID",
            "und-BD": "bn-Beng-BD",
            "und-BE": "nl-Latn-BE",
            "und-Beng": "bn-Beng-BD",
            "und-BF": "fr-Latn-BF",
            "und-BG": "bg-Cyrl-BG",
            "und-BH": "ar-Arab-BH",
            "und-Bhks": "sa-Bhks-IN",
            "und-BI": "rn-Latn-BI",
            "und-BJ": "fr-Latn-BJ",
            "und-BL": "fr-Latn-BL",
            "und-BN": "ms-Latn-BN",
            "und-BO": "es-Latn-BO",
            "und-Bopo": "zh-Bopo-TW",
            "und-BQ": "pap-Latn-BQ",
            "und-BR": "pt-Latn-BR",
            "und-Brah": "pka-Brah-IN",
            "und-Brai": "fr-Brai-FR",
            "und-BT": "dz-Tibt-BT",
            "und-Bugi": "bug-Bugi-ID",
            "und-Buhd": "bku-Buhd-PH",
            "und-BV": "und-Latn-BV",
            "und-BY": "be-Cyrl-BY",
            "und-Cakm": "ccp-Cakm-BD",
            "und-Cans": "cr-Cans-CA",
            "und-Cari": "xcr-Cari-TR",
            "und-CD": "sw-Latn-CD",
            "und-CF": "fr-Latn-CF",
            "und-CG": "fr-Latn-CG",
            "und-CH": "de-Latn-CH",
            "und-Cham": "cjm-Cham-VN",
            "und-Cher": "chr-Cher-US",
            "und-Chrs": "xco-Chrs-UZ",
            "und-CI": "fr-Latn-CI",
            "und-CL": "es-Latn-CL",
            "und-CM": "fr-Latn-CM",
            "und-CN": "zh-Hans-CN",
            "und-CO": "es-Latn-CO",
            "und-Copt": "cop-Copt-EG",
            "und-CP": "und-Latn-CP",
            "und-Cprt": "grc-Cprt-CY",
            "und-CR": "es-Latn-CR",
            "und-CU": "es-Latn-CU",
            "und-CV": "pt-Latn-CV",
            "und-CW": "pap-Latn-CW",
            "und-CY": "el-Grek-CY",
            "und-Cyrl": "ru-Cyrl-RU",
            "und-Cyrl-AL": "mk-Cyrl-AL",
            "und-Cyrl-BA": "sr-Cyrl-BA",
            "und-Cyrl-GE": "os-Cyrl-GE",
            "und-Cyrl-GR": "mk-Cyrl-GR",
            "und-Cyrl-MD": "uk-Cyrl-MD",
            "und-Cyrl-RO": "bg-Cyrl-RO",
            "und-Cyrl-SK": "uk-Cyrl-SK",
            "und-Cyrl-TR": "kbd-Cyrl-TR",
            "und-Cyrl-XK": "sr-Cyrl-XK",
            "und-CZ": "cs-Latn-CZ",
            "und-DE": "de-Latn-DE",
            "und-Deva": "hi-Deva-IN",
            "und-Deva-BT": "ne-Deva-BT",
            "und-Deva-FJ": "hif-Deva-FJ",
            "und-Deva-MU": "bho-Deva-MU",
            "und-Deva-PK": "btv-Deva-PK",
            "und-Diak": "dv-Diak-MV",
            "und-DJ": "aa-Latn-DJ",
            "und-DK": "da-Latn-DK",
            "und-DO": "es-Latn-DO",
            "und-Dogr": "doi-Dogr-IN",
            "und-Dupl": "fr-Dupl-FR",
            "und-DZ": "ar-Arab-DZ",
            "und-EA": "es-Latn-EA",
            "und-EC": "es-Latn-EC",
            "und-EE": "et-Latn-EE",
            "und-EG": "ar-Arab-EG",
            "und-Egyp": "egy-Egyp-EG",
            "und-EH": "ar-Arab-EH",
            "und-Elba": "sq-Elba-AL",
            "und-Elym": "arc-Elym-IR",
            "und-ER": "ti-Ethi-ER",
            "und-ES": "es-Latn-ES",
            "und-ET": "am-Ethi-ET",
            "und-Ethi": "am-Ethi-ET",
            "und-EU": "en-Latn-IE",
            "und-EZ": "de-Latn-EZ",
            "und-FI": "fi-Latn-FI",
            "und-FO": "fo-Latn-FO",
            "und-FR": "fr-Latn-FR",
            "und-GA": "fr-Latn-GA",
            "und-GE": "ka-Geor-GE",
            "und-Geor": "ka-Geor-GE",
            "und-GF": "fr-Latn-GF",
            "und-GH": "ak-Latn-GH",
            "und-GL": "kl-Latn-GL",
            "und-Glag": "cu-Glag-BG",
            "und-GN": "fr-Latn-GN",
            "und-Gong": "wsg-Gong-IN",
            "und-Gonm": "esg-Gonm-IN",
            "und-Goth": "got-Goth-UA",
            "und-GP": "fr-Latn-GP",
            "und-GQ": "es-Latn-GQ",
            "und-GR": "el-Grek-GR",
            "und-Gran": "sa-Gran-IN",
            "und-Grek": "el-Grek-GR",
            "und-Grek-TR": "bgx-Grek-TR",
            "und-GS": "und-Latn-GS",
            "und-GT": "es-Latn-GT",
            "und-Gujr": "gu-Gujr-IN",
            "und-Guru": "pa-Guru-IN",
            "und-GW": "pt-Latn-GW",
            "und-Hanb": "zh-Hanb-TW",
            "und-Hang": "ko-Hang-KR",
            "und-Hani": "zh-Hani-CN",
            "und-Hano": "hnn-Hano-PH",
            "und-Hans": "zh-Hans-CN",
            "und-Hant": "zh-Hant-TW",
            "und-Hebr": "he-Hebr-IL",
            "und-Hebr-CA": "yi-Hebr-CA",
            "und-Hebr-GB": "yi-Hebr-GB",
            "und-Hebr-SE": "yi-Hebr-SE",
            "und-Hebr-UA": "yi-Hebr-UA",
            "und-Hebr-US": "yi-Hebr-US",
            "und-Hira": "ja-Hira-JP",
            "und-HK": "zh-Hant-HK",
            "und-Hluw": "hlu-Hluw-TR",
            "und-HM": "und-Latn-HM",
            "und-Hmng": "hnj-Hmng-LA",
            "und-Hmnp": "mww-Hmnp-US",
            "und-HN": "es-Latn-HN",
            "und-HR": "hr-Latn-HR",
            "und-HT": "ht-Latn-HT",
            "und-HU": "hu-Latn-HU",
            "und-Hung": "hu-Hung-HU",
            "und-IC": "es-Latn-IC",
            "und-ID": "id-Latn-ID",
            "und-IL": "he-Hebr-IL",
            "und-IN": "hi-Deva-IN",
            "und-IQ": "ar-Arab-IQ",
            "und-IR": "fa-Arab-IR",
            "und-IS": "is-Latn-IS",
            "und-IT": "it-Latn-IT",
            "und-Ital": "ett-Ital-IT",
            "und-Jamo": "ko-Jamo-KR",
            "und-Java": "jv-Java-ID",
            "und-JO": "ar-Arab-JO",
            "und-JP": "ja-Jpan-JP",
            "und-Jpan": "ja-Jpan-JP",
            "und-Kali": "eky-Kali-MM",
            "und-Kana": "ja-Kana-JP",
            "und-KE": "sw-Latn-KE",
            "und-KG": "ky-Cyrl-KG",
            "und-KH": "km-Khmr-KH",
            "und-Khar": "pra-Khar-PK",
            "und-Khmr": "km-Khmr-KH",
            "und-Khoj": "sd-Khoj-IN",
            "und-Kits": "zkt-Kits-CN",
            "und-KM": "ar-Arab-KM",
            "und-Knda": "kn-Knda-IN",
            "und-Kore": "ko-Kore-KR",
            "und-KP": "ko-Kore-KP",
            "und-KR": "ko-Kore-KR",
            "und-Kthi": "bho-Kthi-IN",
            "und-KW": "ar-Arab-KW",
            "und-KZ": "ru-Cyrl-KZ",
            "und-LA": "lo-Laoo-LA",
            "und-Lana": "nod-Lana-TH",
            "und-Laoo": "lo-Laoo-LA",
            "und-Latn-AF": "tk-Latn-AF",
            "und-Latn-AM": "ku-Latn-AM",
            "und-Latn-CN": "za-Latn-CN",
            "und-Latn-CY": "tr-Latn-CY",
            "und-Latn-DZ": "fr-Latn-DZ",
            "und-Latn-ET": "en-Latn-ET",
            "und-Latn-GE": "ku-Latn-GE",
            "und-Latn-IR": "tk-Latn-IR",
            "und-Latn-KM": "fr-Latn-KM",
            "und-Latn-MA": "fr-Latn-MA",
            "und-Latn-MK": "sq-Latn-MK",
            "und-Latn-MM": "kac-Latn-MM",
            "und-Latn-MO": "pt-Latn-MO",
            "und-Latn-MR": "fr-Latn-MR",
            "und-Latn-RU": "krl-Latn-RU",
            "und-Latn-SY": "fr-Latn-SY",
            "und-Latn-TN": "fr-Latn-TN",
            "und-Latn-TW": "trv-Latn-TW",
            "und-Latn-UA": "pl-Latn-UA",
            "und-LB": "ar-Arab-LB",
            "und-Lepc": "lep-Lepc-IN",
            "und-LI": "de-Latn-LI",
            "und-Limb": "lif-Limb-IN",
            "und-Lina": "lab-Lina-GR",
            "und-Linb": "grc-Linb-GR",
            "und-Lisu": "lis-Lisu-CN",
            "und-LK": "si-Sinh-LK",
            "und-LS": "st-Latn-LS",
            "und-LT": "lt-Latn-LT",
            "und-LU": "fr-Latn-LU",
            "und-LV": "lv-Latn-LV",
            "und-LY": "ar-Arab-LY",
            "und-Lyci": "xlc-Lyci-TR",
            "und-Lydi": "xld-Lydi-TR",
            "und-MA": "ar-Arab-MA",
            "und-Mahj": "hi-Mahj-IN",
            "und-Maka": "mak-Maka-ID",
            "und-Mand": "myz-Mand-IR",
            "und-Mani": "xmn-Mani-CN",
            "und-Marc": "bo-Marc-CN",
            "und-MC": "fr-Latn-MC",
            "und-MD": "ro-Latn-MD",
            "und-ME": "sr-Latn-ME",
            "und-Medf": "dmf-Medf-NG",
            "und-Mend": "men-Mend-SL",
            "und-Merc": "xmr-Merc-SD",
            "und-Mero": "xmr-Mero-SD",
            "und-MF": "fr-Latn-MF",
            "und-MG": "mg-Latn-MG",
            "und-MK": "mk-Cyrl-MK",
            "und-ML": "bm-Latn-ML",
            "und-Mlym": "ml-Mlym-IN",
            "und-MM": "my-Mymr-MM",
            "und-MN": "mn-Cyrl-MN",
            "und-MO": "zh-Hant-MO",
            "und-Modi": "mr-Modi-IN",
            "und-Mong": "mn-Mong-CN",
            "und-MQ": "fr-Latn-MQ",
            "und-MR": "ar-Arab-MR",
            "und-Mroo": "mro-Mroo-BD",
            "und-MT": "mt-Latn-MT",
            "und-Mtei": "mni-Mtei-IN",
            "und-MU": "mfe-Latn-MU",
            "und-Mult": "skr-Mult-PK",
            "und-MV": "dv-Thaa-MV",
            "und-MX": "es-Latn-MX",
            "und-MY": "ms-Latn-MY",
            "und-Mymr": "my-Mymr-MM",
            "und-Mymr-IN": "kht-Mymr-IN",
            "und-Mymr-TH": "mnw-Mymr-TH",
            "und-MZ": "pt-Latn-MZ",
            "und-NA": "af-Latn-NA",
            "und-Nand": "sa-Nand-IN",
            "und-Narb": "xna-Narb-SA",
            "und-Nbat": "arc-Nbat-JO",
            "und-NC": "fr-Latn-NC",
            "und-NE": "ha-Latn-NE",
            "und-Newa": "new-Newa-NP",
            "und-NI": "es-Latn-NI",
            "und-Nkoo": "man-Nkoo-GN",
            "und-NL": "nl-Latn-NL",
            "und-NO": "nb-Latn-NO",
            "und-NP": "ne-Deva-NP",
            "und-Nshu": "zhx-Nshu-CN",
            "und-Ogam": "sga-Ogam-IE",
            "und-Olck": "sat-Olck-IN",
            "und-OM": "ar-Arab-OM",
            "und-Orkh": "otk-Orkh-MN",
            "und-Orya": "or-Orya-IN",
            "und-Osge": "osa-Osge-US",
            "und-Osma": "so-Osma-SO",
            "und-PA": "es-Latn-PA",
            "und-Palm": "arc-Palm-SY",
            "und-Pauc": "ctd-Pauc-MM",
            "und-PE": "es-Latn-PE",
            "und-Perm": "kv-Perm-RU",
            "und-PF": "fr-Latn-PF",
            "und-PG": "tpi-Latn-PG",
            "und-PH": "fil-Latn-PH",
            "und-Phag": "lzh-Phag-CN",
            "und-Phli": "pal-Phli-IR",
            "und-Phlp": "pal-Phlp-CN",
            "und-Phnx": "phn-Phnx-LB",
            "und-PK": "ur-Arab-PK",
            "und-PL": "pl-Latn-PL",
            "und-Plrd": "hmd-Plrd-CN",
            "und-PM": "fr-Latn-PM",
            "und-PR": "es-Latn-PR",
            "und-Prti": "xpr-Prti-IR",
            "und-PS": "ar-Arab-PS",
            "und-PT": "pt-Latn-PT",
            "und-PW": "pau-Latn-PW",
            "und-PY": "gn-Latn-PY",
            "und-QA": "ar-Arab-QA",
            "und-QO": "en-Latn-DG",
            "und-RE": "fr-Latn-RE",
            "und-Rjng": "rej-Rjng-ID",
            "und-RO": "ro-Latn-RO",
            "und-Rohg": "rhg-Rohg-MM",
            "und-RS": "sr-Cyrl-RS",
            "und-RU": "ru-Cyrl-RU",
            "und-Runr": "non-Runr-SE",
            "und-RW": "rw-Latn-RW",
            "und-SA": "ar-Arab-SA",
            "und-Samr": "smp-Samr-IL",
            "und-Sarb": "xsa-Sarb-YE",
            "und-Saur": "saz-Saur-IN",
            "und-SC": "fr-Latn-SC",
            "und-SD": "ar-Arab-SD",
            "und-SE": "sv-Latn-SE",
            "und-Sgnw": "ase-Sgnw-US",
            "und-Shaw": "en-Shaw-GB",
            "und-Shrd": "sa-Shrd-IN",
            "und-SI": "sl-Latn-SI",
            "und-Sidd": "sa-Sidd-IN",
            "und-Sind": "sd-Sind-IN",
            "und-Sinh": "si-Sinh-LK",
            "und-SJ": "nb-Latn-SJ",
            "und-SK": "sk-Latn-SK",
            "und-SM": "it-Latn-SM",
            "und-SN": "fr-Latn-SN",
            "und-SO": "so-Latn-SO",
            "und-Sogd": "sog-Sogd-UZ",
            "und-Sogo": "sog-Sogo-UZ",
            "und-Sora": "srb-Sora-IN",
            "und-Soyo": "cmg-Soyo-MN",
            "und-SR": "nl-Latn-SR",
            "und-ST": "pt-Latn-ST",
            "und-Sund": "su-Sund-ID",
            "und-SV": "es-Latn-SV",
            "und-SY": "ar-Arab-SY",
            "und-Sylo": "syl-Sylo-BD",
            "und-Syrc": "syr-Syrc-IQ",
            "und-Tagb": "tbw-Tagb-PH",
            "und-Takr": "doi-Takr-IN",
            "und-Tale": "tdd-Tale-CN",
            "und-Talu": "khb-Talu-CN",
            "und-Taml": "ta-Taml-IN",
            "und-Tang": "txg-Tang-CN",
            "und-Tavt": "blt-Tavt-VN",
            "und-TD": "fr-Latn-TD",
            "und-Telu": "te-Telu-IN",
            "und-TF": "fr-Latn-TF",
            "und-Tfng": "zgh-Tfng-MA",
            "und-TG": "fr-Latn-TG",
            "und-Tglg": "fil-Tglg-PH",
            "und-TH": "th-Thai-TH",
            "und-Thaa": "dv-Thaa-MV",
            "und-Thai": "th-Thai-TH",
            "und-Thai-CN": "lcp-Thai-CN",
            "und-Thai-KH": "kdt-Thai-KH",
            "und-Thai-LA": "kdt-Thai-LA",
            "und-Tibt": "bo-Tibt-CN",
            "und-Tirh": "mai-Tirh-IN",
            "und-TJ": "tg-Cyrl-TJ",
            "und-TK": "tkl-Latn-TK",
            "und-TL": "pt-Latn-TL",
            "und-TM": "tk-Latn-TM",
            "und-TN": "ar-Arab-TN",
            "und-TO": "to-Latn-TO",
            "und-TR": "tr-Latn-TR",
            "und-TV": "tvl-Latn-TV",
            "und-TW": "zh-Hant-TW",
            "und-TZ": "sw-Latn-TZ",
            "und-UA": "uk-Cyrl-UA",
            "und-UG": "sw-Latn-UG",
            "und-Ugar": "uga-Ugar-SY",
            "und-UY": "es-Latn-UY",
            "und-UZ": "uz-Latn-UZ",
            "und-VA": "it-Latn-VA",
            "und-Vaii": "vai-Vaii-LR",
            "und-VE": "es-Latn-VE",
            "und-VN": "vi-Latn-VN",
            "und-VU": "bi-Latn-VU",
            "und-Wara": "hoc-Wara-IN",
            "und-Wcho": "nnp-Wcho-IN",
            "und-WF": "fr-Latn-WF",
            "und-WS": "sm-Latn-WS",
            "und-XK": "sq-Latn-XK",
            "und-Xpeo": "peo-Xpeo-IR",
            "und-Xsux": "akk-Xsux-IQ",
            "und-YE": "ar-Arab-YE",
            "und-Yezi": "ku-Yezi-GE",
            "und-Yiii": "ii-Yiii-CN",
            "und-YT": "fr-Latn-YT",
            "und-Zanb": "cmg-Zanb-MN",
            "und-ZW": "sn-Latn-ZW",
            unr: "unr-Beng-IN",
            "unr-Deva": "unr-Deva-NP",
            "unr-NP": "unr-Deva-NP",
            unx: "unx-Beng-IN",
            uok: "uok-Latn-ZZ",
            ur: "ur-Arab-PK",
            uri: "uri-Latn-ZZ",
            urt: "urt-Latn-ZZ",
            urw: "urw-Latn-ZZ",
            usa: "usa-Latn-ZZ",
            uth: "uth-Latn-ZZ",
            utr: "utr-Latn-ZZ",
            uvh: "uvh-Latn-ZZ",
            uvl: "uvl-Latn-ZZ",
            uz: "uz-Latn-UZ",
            "uz-AF": "uz-Arab-AF",
            "uz-Arab": "uz-Arab-AF",
            "uz-CN": "uz-Cyrl-CN",
            vag: "vag-Latn-ZZ",
            vai: "vai-Vaii-LR",
            van: "van-Latn-ZZ",
            ve: "ve-Latn-ZA",
            vec: "vec-Latn-IT",
            vep: "vep-Latn-RU",
            vi: "vi-Latn-VN",
            vic: "vic-Latn-SX",
            viv: "viv-Latn-ZZ",
            vls: "vls-Latn-BE",
            vmf: "vmf-Latn-DE",
            vmw: "vmw-Latn-MZ",
            vo: "vo-Latn-001",
            vot: "vot-Latn-RU",
            vro: "vro-Latn-EE",
            vun: "vun-Latn-TZ",
            vut: "vut-Latn-ZZ",
            wa: "wa-Latn-BE",
            wae: "wae-Latn-CH",
            waj: "waj-Latn-ZZ",
            wal: "wal-Ethi-ET",
            wan: "wan-Latn-ZZ",
            war: "war-Latn-PH",
            wbp: "wbp-Latn-AU",
            wbq: "wbq-Telu-IN",
            wbr: "wbr-Deva-IN",
            wci: "wci-Latn-ZZ",
            wer: "wer-Latn-ZZ",
            wgi: "wgi-Latn-ZZ",
            whg: "whg-Latn-ZZ",
            wib: "wib-Latn-ZZ",
            wiu: "wiu-Latn-ZZ",
            wiv: "wiv-Latn-ZZ",
            wja: "wja-Latn-ZZ",
            wji: "wji-Latn-ZZ",
            wls: "wls-Latn-WF",
            wmo: "wmo-Latn-ZZ",
            wnc: "wnc-Latn-ZZ",
            wni: "wni-Arab-KM",
            wnu: "wnu-Latn-ZZ",
            wo: "wo-Latn-SN",
            wob: "wob-Latn-ZZ",
            wos: "wos-Latn-ZZ",
            wrs: "wrs-Latn-ZZ",
            wsg: "wsg-Gong-IN",
            wsk: "wsk-Latn-ZZ",
            wtm: "wtm-Deva-IN",
            wuu: "wuu-Hans-CN",
            wuv: "wuv-Latn-ZZ",
            wwa: "wwa-Latn-ZZ",
            xav: "xav-Latn-BR",
            xbi: "xbi-Latn-ZZ",
            xco: "xco-Chrs-UZ",
            xcr: "xcr-Cari-TR",
            xes: "xes-Latn-ZZ",
            xh: "xh-Latn-ZA",
            xla: "xla-Latn-ZZ",
            xlc: "xlc-Lyci-TR",
            xld: "xld-Lydi-TR",
            xmf: "xmf-Geor-GE",
            xmn: "xmn-Mani-CN",
            xmr: "xmr-Merc-SD",
            xna: "xna-Narb-SA",
            xnr: "xnr-Deva-IN",
            xog: "xog-Latn-UG",
            xon: "xon-Latn-ZZ",
            xpr: "xpr-Prti-IR",
            xrb: "xrb-Latn-ZZ",
            xsa: "xsa-Sarb-YE",
            xsi: "xsi-Latn-ZZ",
            xsm: "xsm-Latn-ZZ",
            xsr: "xsr-Deva-NP",
            xwe: "xwe-Latn-ZZ",
            yam: "yam-Latn-ZZ",
            yao: "yao-Latn-MZ",
            yap: "yap-Latn-FM",
            yas: "yas-Latn-ZZ",
            yat: "yat-Latn-ZZ",
            yav: "yav-Latn-CM",
            yay: "yay-Latn-ZZ",
            yaz: "yaz-Latn-ZZ",
            yba: "yba-Latn-ZZ",
            ybb: "ybb-Latn-CM",
            yby: "yby-Latn-ZZ",
            yer: "yer-Latn-ZZ",
            ygr: "ygr-Latn-ZZ",
            ygw: "ygw-Latn-ZZ",
            yi: "yi-Hebr-001",
            yko: "yko-Latn-ZZ",
            yle: "yle-Latn-ZZ",
            ylg: "ylg-Latn-ZZ",
            yll: "yll-Latn-ZZ",
            yml: "yml-Latn-ZZ",
            yo: "yo-Latn-NG",
            yon: "yon-Latn-ZZ",
            yrb: "yrb-Latn-ZZ",
            yre: "yre-Latn-ZZ",
            yrl: "yrl-Latn-BR",
            yss: "yss-Latn-ZZ",
            yua: "yua-Latn-MX",
            yue: "yue-Hant-HK",
            "yue-CN": "yue-Hans-CN",
            "yue-Hans": "yue-Hans-CN",
            yuj: "yuj-Latn-ZZ",
            yut: "yut-Latn-ZZ",
            yuw: "yuw-Latn-ZZ",
            za: "za-Latn-CN",
            zag: "zag-Latn-SD",
            zdj: "zdj-Arab-KM",
            zea: "zea-Latn-NL",
            zgh: "zgh-Tfng-MA",
            zh: "zh-Hans-CN",
            "zh-AU": "zh-Hant-AU",
            "zh-BN": "zh-Hant-BN",
            "zh-Bopo": "zh-Bopo-TW",
            "zh-GB": "zh-Hant-GB",
            "zh-GF": "zh-Hant-GF",
            "zh-Hanb": "zh-Hanb-TW",
            "zh-Hant": "zh-Hant-TW",
            "zh-HK": "zh-Hant-HK",
            "zh-ID": "zh-Hant-ID",
            "zh-MO": "zh-Hant-MO",
            "zh-PA": "zh-Hant-PA",
            "zh-PF": "zh-Hant-PF",
            "zh-PH": "zh-Hant-PH",
            "zh-SR": "zh-Hant-SR",
            "zh-TH": "zh-Hant-TH",
            "zh-TW": "zh-Hant-TW",
            "zh-US": "zh-Hant-US",
            "zh-VN": "zh-Hant-VN",
            zhx: "zhx-Nshu-CN",
            zia: "zia-Latn-ZZ",
            zkt: "zkt-Kits-CN",
            zlm: "zlm-Latn-TG",
            zmi: "zmi-Latn-MY",
            zne: "zne-Latn-ZZ",
            zu: "zu-Latn-ZA",
            zza: "zza-Latn-TR"
          }
        }
      };
    }
  });

  // bazel-out/darwin-fastbuild/bin/packages/intl-getcanonicallocales/src/canonicalizer.js
  var require_canonicalizer = __commonJS({
    "bazel-out/darwin-fastbuild/bin/packages/intl-getcanonicallocales/src/canonicalizer.js": function(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {value: true});
      exports.canonicalizeUnicodeLocaleId = exports.canonicalizeUnicodeLanguageId = void 0;
      var tslib_1 = require_tslib();
      var aliases_1 = require_aliases();
      var parser_1 = require_parser();
      var likelySubtags2 = tslib_1.__importStar(require_likelySubtags());
      var emitter_1 = require_emitter();
      function canonicalizeAttrs(strs) {
        return Object.keys(strs.reduce(function(all, str) {
          all[str.toLowerCase()] = 1;
          return all;
        }, {})).sort();
      }
      function canonicalizeKVs(arr) {
        var all = {};
        var result = [];
        for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
          var kv = arr_1[_i];
          if (kv[0] in all) {
            continue;
          }
          all[kv[0]] = 1;
          if (!kv[1] || kv[1] === "true") {
            result.push([kv[0].toLowerCase()]);
          } else {
            result.push([kv[0].toLowerCase(), kv[1].toLowerCase()]);
          }
        }
        return result.sort(compareKV);
      }
      function compareKV(t1, t2) {
        return t1[0] < t2[0] ? -1 : t1[0] > t2[0] ? 1 : 0;
      }
      function compareExtension(e1, e2) {
        return e1.type < e2.type ? -1 : e1.type > e2.type ? 1 : 0;
      }
      function mergeVariants(v1, v2) {
        var result = tslib_1.__spreadArray([], v1);
        for (var _i = 0, v2_1 = v2; _i < v2_1.length; _i++) {
          var v = v2_1[_i];
          if (v1.indexOf(v) < 0) {
            result.push(v);
          }
        }
        return result;
      }
      function canonicalizeUnicodeLanguageId(unicodeLanguageId) {
        var finalLangAst = unicodeLanguageId;
        if (unicodeLanguageId.variants.length) {
          var replacedLang_1 = "";
          for (var _i = 0, _a = unicodeLanguageId.variants; _i < _a.length; _i++) {
            var variant = _a[_i];
            if (replacedLang_1 = aliases_1.languageAlias[emitter_1.emitUnicodeLanguageId({
              lang: unicodeLanguageId.lang,
              variants: [variant]
            })]) {
              var replacedLangAst = parser_1.parseUnicodeLanguageId(replacedLang_1.split(parser_1.SEPARATOR));
              finalLangAst = {
                lang: replacedLangAst.lang,
                script: finalLangAst.script || replacedLangAst.script,
                region: finalLangAst.region || replacedLangAst.region,
                variants: mergeVariants(finalLangAst.variants, replacedLangAst.variants)
              };
              break;
            }
          }
        }
        if (finalLangAst.script && finalLangAst.region) {
          var replacedLang_2 = aliases_1.languageAlias[emitter_1.emitUnicodeLanguageId({
            lang: finalLangAst.lang,
            script: finalLangAst.script,
            region: finalLangAst.region,
            variants: []
          })];
          if (replacedLang_2) {
            var replacedLangAst = parser_1.parseUnicodeLanguageId(replacedLang_2.split(parser_1.SEPARATOR));
            finalLangAst = {
              lang: replacedLangAst.lang,
              script: replacedLangAst.script,
              region: replacedLangAst.region,
              variants: finalLangAst.variants
            };
          }
        }
        if (finalLangAst.region) {
          var replacedLang_3 = aliases_1.languageAlias[emitter_1.emitUnicodeLanguageId({
            lang: finalLangAst.lang,
            region: finalLangAst.region,
            variants: []
          })];
          if (replacedLang_3) {
            var replacedLangAst = parser_1.parseUnicodeLanguageId(replacedLang_3.split(parser_1.SEPARATOR));
            finalLangAst = {
              lang: replacedLangAst.lang,
              script: finalLangAst.script || replacedLangAst.script,
              region: replacedLangAst.region,
              variants: finalLangAst.variants
            };
          }
        }
        var replacedLang = aliases_1.languageAlias[emitter_1.emitUnicodeLanguageId({
          lang: finalLangAst.lang,
          variants: []
        })];
        if (replacedLang) {
          var replacedLangAst = parser_1.parseUnicodeLanguageId(replacedLang.split(parser_1.SEPARATOR));
          finalLangAst = {
            lang: replacedLangAst.lang,
            script: finalLangAst.script || replacedLangAst.script,
            region: finalLangAst.region || replacedLangAst.region,
            variants: finalLangAst.variants
          };
        }
        if (finalLangAst.region) {
          var region = finalLangAst.region.toUpperCase();
          var regionAlias = aliases_1.territoryAlias[region];
          var replacedRegion = void 0;
          if (regionAlias) {
            var regions = regionAlias.split(" ");
            replacedRegion = regions[0];
            var likelySubtag = likelySubtags2.supplemental.likelySubtags[emitter_1.emitUnicodeLanguageId({
              lang: finalLangAst.lang,
              script: finalLangAst.script,
              variants: []
            })];
            if (likelySubtag) {
              var likelyRegion = parser_1.parseUnicodeLanguageId(likelySubtag.split(parser_1.SEPARATOR)).region;
              if (likelyRegion && regions.indexOf(likelyRegion) > -1) {
                replacedRegion = likelyRegion;
              }
            }
          }
          if (replacedRegion) {
            finalLangAst.region = replacedRegion;
          }
          finalLangAst.region = finalLangAst.region.toUpperCase();
        }
        if (finalLangAst.script) {
          finalLangAst.script = finalLangAst.script[0].toUpperCase() + finalLangAst.script.slice(1).toLowerCase();
          if (aliases_1.scriptAlias[finalLangAst.script]) {
            finalLangAst.script = aliases_1.scriptAlias[finalLangAst.script];
          }
        }
        if (finalLangAst.variants.length) {
          for (var i = 0; i < finalLangAst.variants.length; i++) {
            var variant = finalLangAst.variants[i].toLowerCase();
            if (aliases_1.variantAlias[variant]) {
              var alias = aliases_1.variantAlias[variant];
              if (parser_1.isUnicodeVariantSubtag(alias)) {
                finalLangAst.variants[i] = alias;
              } else if (parser_1.isUnicodeLanguageSubtag(alias)) {
                finalLangAst.lang = alias;
              }
            }
          }
          finalLangAst.variants.sort();
        }
        return finalLangAst;
      }
      exports.canonicalizeUnicodeLanguageId = canonicalizeUnicodeLanguageId;
      function canonicalizeUnicodeLocaleId(locale) {
        locale.lang = canonicalizeUnicodeLanguageId(locale.lang);
        if (locale.extensions) {
          for (var _i = 0, _a = locale.extensions; _i < _a.length; _i++) {
            var extension = _a[_i];
            switch (extension.type) {
              case "u":
                extension.keywords = canonicalizeKVs(extension.keywords);
                if (extension.attributes) {
                  extension.attributes = canonicalizeAttrs(extension.attributes);
                }
                break;
              case "t":
                if (extension.lang) {
                  extension.lang = canonicalizeUnicodeLanguageId(extension.lang);
                }
                extension.fields = canonicalizeKVs(extension.fields);
                break;
              default:
                extension.value = extension.value.toLowerCase();
                break;
            }
          }
          locale.extensions.sort(compareExtension);
        }
        return locale;
      }
      exports.canonicalizeUnicodeLocaleId = canonicalizeUnicodeLocaleId;
    }
  });

  // bazel-out/darwin-fastbuild/bin/packages/intl-getcanonicallocales/src/types.js
  var require_types = __commonJS({
    "bazel-out/darwin-fastbuild/bin/packages/intl-getcanonicallocales/src/types.js": function(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {value: true});
    }
  });

  // bazel-out/darwin-fastbuild/bin/packages/intl-getcanonicallocales/index.js
  var require_intl_getcanonicallocales = __commonJS({
    "bazel-out/darwin-fastbuild/bin/packages/intl-getcanonicallocales/index.js": function(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {value: true});
      exports.isUnicodeLanguageSubtag = exports.isUnicodeScriptSubtag = exports.isUnicodeRegionSubtag = exports.isStructurallyValidLanguageTag = exports.parseUnicodeLanguageId = exports.parseUnicodeLocaleId = exports.getCanonicalLocales = void 0;
      var tslib_1 = require_tslib();
      var parser_1 = require_parser();
      var emitter_1 = require_emitter();
      var canonicalizer_1 = require_canonicalizer();
      function CanonicalizeLocaleList2(locales) {
        if (locales === void 0) {
          return [];
        }
        var seen = [];
        if (typeof locales === "string") {
          locales = [locales];
        }
        for (var _i = 0, locales_1 = locales; _i < locales_1.length; _i++) {
          var locale = locales_1[_i];
          var canonicalizedTag = emitter_1.emitUnicodeLocaleId(canonicalizer_1.canonicalizeUnicodeLocaleId(parser_1.parseUnicodeLocaleId(locale)));
          if (seen.indexOf(canonicalizedTag) < 0) {
            seen.push(canonicalizedTag);
          }
        }
        return seen;
      }
      function getCanonicalLocales(locales) {
        return CanonicalizeLocaleList2(locales);
      }
      exports.getCanonicalLocales = getCanonicalLocales;
      var parser_2 = require_parser();
      Object.defineProperty(exports, "parseUnicodeLocaleId", {enumerable: true, get: function() {
        return parser_2.parseUnicodeLocaleId;
      }});
      Object.defineProperty(exports, "parseUnicodeLanguageId", {enumerable: true, get: function() {
        return parser_2.parseUnicodeLanguageId;
      }});
      Object.defineProperty(exports, "isStructurallyValidLanguageTag", {enumerable: true, get: function() {
        return parser_2.isStructurallyValidLanguageTag;
      }});
      Object.defineProperty(exports, "isUnicodeRegionSubtag", {enumerable: true, get: function() {
        return parser_2.isUnicodeRegionSubtag;
      }});
      Object.defineProperty(exports, "isUnicodeScriptSubtag", {enumerable: true, get: function() {
        return parser_2.isUnicodeScriptSubtag;
      }});
      Object.defineProperty(exports, "isUnicodeLanguageSubtag", {enumerable: true, get: function() {
        return parser_2.isUnicodeLanguageSubtag;
      }});
      tslib_1.__exportStar(require_types(), exports);
      tslib_1.__exportStar(require_emitter(), exports);
    }
  });

  // bazel-out/darwin-fastbuild/bin/packages/intl-locale/lib/index.js
  var import_tslib5 = __toModule(require_tslib());

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/DateTimeFormat/BestFitFormatMatcher.js
  var import_tslib2 = __toModule(require_tslib());

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/utils.js
  function invariant(condition, message, Err) {
    if (Err === void 0) {
      Err = Error;
    }
    if (!condition) {
      throw new Err(message);
    }
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/DateTimeFormat/skeleton.js
  var import_tslib = __toModule(require_tslib());

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/types/date-time.js
  var RangePatternType;
  (function(RangePatternType2) {
    RangePatternType2["startRange"] = "startRange";
    RangePatternType2["shared"] = "shared";
    RangePatternType2["endRange"] = "endRange";
  })(RangePatternType || (RangePatternType = {}));

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/262.js
  function ToString(o) {
    if (typeof o === "symbol") {
      throw TypeError("Cannot convert a Symbol value to a string");
    }
    return String(o);
  }
  function ToObject(arg) {
    if (arg == null) {
      throw new TypeError("undefined/null cannot be converted to object");
    }
    return Object(arg);
  }
  function SameValue(x, y) {
    if (Object.is) {
      return Object.is(x, y);
    }
    if (x === y) {
      return x !== 0 || 1 / x === 1 / y;
    }
    return x !== x && y !== y;
  }
  var MINUTES_PER_HOUR = 60;
  var SECONDS_PER_MINUTE = 60;
  var MS_PER_SECOND = 1e3;
  var MS_PER_MINUTE = MS_PER_SECOND * SECONDS_PER_MINUTE;
  var MS_PER_HOUR = MS_PER_MINUTE * MINUTES_PER_HOUR;

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/CoerceOptionsToObject.js
  function CoerceOptionsToObject(options) {
    if (typeof options === "undefined") {
      return Object.create(null);
    }
    return ToObject(options);
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/DateTimeFormat/BasicFormatMatcher.js
  var import_tslib3 = __toModule(require_tslib());

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/GetOption.js
  function GetOption(opts, prop, type, values, fallback) {
    if (typeof opts !== "object") {
      throw new TypeError("Options must be an object");
    }
    var value = opts[prop];
    if (value !== void 0) {
      if (type !== "boolean" && type !== "string") {
        throw new TypeError("invalid type");
      }
      if (type === "boolean") {
        value = Boolean(value);
      }
      if (type === "string") {
        value = ToString(value);
      }
      if (values !== void 0 && !values.filter(function(val) {
        return val == value;
      }).length) {
        throw new RangeError(value + " is not within " + values.join(", "));
      }
      return value;
    }
    return fallback;
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/IsSanctionedSimpleUnitIdentifier.js
  var SANCTIONED_UNITS = [
    "angle-degree",
    "area-acre",
    "area-hectare",
    "concentr-percent",
    "digital-bit",
    "digital-byte",
    "digital-gigabit",
    "digital-gigabyte",
    "digital-kilobit",
    "digital-kilobyte",
    "digital-megabit",
    "digital-megabyte",
    "digital-petabyte",
    "digital-terabit",
    "digital-terabyte",
    "duration-day",
    "duration-hour",
    "duration-millisecond",
    "duration-minute",
    "duration-month",
    "duration-second",
    "duration-week",
    "duration-year",
    "length-centimeter",
    "length-foot",
    "length-inch",
    "length-kilometer",
    "length-meter",
    "length-mile-scandinavian",
    "length-mile",
    "length-millimeter",
    "length-yard",
    "mass-gram",
    "mass-kilogram",
    "mass-ounce",
    "mass-pound",
    "mass-stone",
    "temperature-celsius",
    "temperature-fahrenheit",
    "volume-fluid-ounce",
    "volume-gallon",
    "volume-liter",
    "volume-milliliter"
  ];
  function removeUnitNamespace(unit) {
    return unit.slice(unit.indexOf("-") + 1);
  }
  var SIMPLE_UNITS = SANCTIONED_UNITS.map(removeUnitNamespace);

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/regex.generated.js
  var S_UNICODE_REGEX = /[\$\+<->\^`\|~\xA2-\xA6\xA8\xA9\xAC\xAE-\xB1\xB4\xB8\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0384\u0385\u03F6\u0482\u058D-\u058F\u0606-\u0608\u060B\u060E\u060F\u06DE\u06E9\u06FD\u06FE\u07F6\u07FE\u07FF\u09F2\u09F3\u09FA\u09FB\u0AF1\u0B70\u0BF3-\u0BFA\u0C7F\u0D4F\u0D79\u0E3F\u0F01-\u0F03\u0F13\u0F15-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE\u0FCF\u0FD5-\u0FD8\u109E\u109F\u1390-\u1399\u166D\u17DB\u1940\u19DE-\u19FF\u1B61-\u1B6A\u1B74-\u1B7C\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2044\u2052\u207A-\u207C\u208A-\u208C\u20A0-\u20BF\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2307\u230C-\u2328\u232B-\u2426\u2440-\u244A\u249C-\u24E9\u2500-\u2767\u2794-\u27C4\u27C7-\u27E5\u27F0-\u2982\u2999-\u29D7\u29DC-\u29FB\u29FE-\u2B73\u2B76-\u2B95\u2B97-\u2BFF\u2CE5-\u2CEA\u2E50\u2E51\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFB\u3004\u3012\u3013\u3020\u3036\u3037\u303E\u303F\u309B\u309C\u3190\u3191\u3196-\u319F\u31C0-\u31E3\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uAA77-\uAA79\uAB5B\uAB6A\uAB6B\uFB29\uFBB2-\uFBC1\uFDFC\uFDFD\uFE62\uFE64-\uFE66\uFE69\uFF04\uFF0B\uFF1C-\uFF1E\uFF3E\uFF40\uFF5C\uFF5E\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD]|\uD800[\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9C\uDDA0\uDDD0-\uDDFC]|\uD802[\uDC77\uDC78\uDEC8]|\uD805\uDF3F|\uD807[\uDFD5-\uDFF1]|\uD81A[\uDF3C-\uDF3F\uDF45]|\uD82F\uDC9C|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDE8\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85\uDE86]|\uD838[\uDD4F\uDEFF]|\uD83B[\uDCAC\uDCB0\uDD2E\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD0D-\uDDAD\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED7\uDEE0-\uDEEC\uDEF0-\uDEFC\uDF00-\uDF73\uDF80-\uDFD8\uDFE0-\uDFEB]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDCB0\uDCB1\uDD00-\uDD78\uDD7A-\uDDCB\uDDCD-\uDE53\uDE60-\uDE6D\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6\uDF00-\uDF92\uDF94-\uDFCA]/;

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/NumberFormat/format_to_parts.js
  var CARET_S_UNICODE_REGEX = new RegExp("^" + S_UNICODE_REGEX.source);
  var S_DOLLAR_UNICODE_REGEX = new RegExp(S_UNICODE_REGEX.source + "$");

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/data.js
  var import_tslib4 = __toModule(require_tslib());
  var MissingLocaleDataError = function(_super) {
    (0, import_tslib4.__extends)(MissingLocaleDataError2, _super);
    function MissingLocaleDataError2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.type = "MISSING_LOCALE_DATA";
      return _this;
    }
    return MissingLocaleDataError2;
  }(Error);

  // bazel-out/darwin-fastbuild/bin/packages/intl-locale/lib/index.js
  var import_intl_getcanonicallocales = __toModule(require_intl_getcanonicallocales());
  var likelySubtagsData = __toModule(require_likelySubtags());

  // bazel-out/darwin-fastbuild/bin/packages/intl-locale/lib/get_internal_slots.js
  var internalSlotMap = new WeakMap();
  function getInternalSlots(x) {
    var internalSlots = internalSlotMap.get(x);
    if (!internalSlots) {
      internalSlots = Object.create(null);
      internalSlotMap.set(x, internalSlots);
    }
    return internalSlots;
  }

  // bazel-out/darwin-fastbuild/bin/packages/intl-locale/lib/index.js
  var likelySubtags = likelySubtagsData.supplemental.likelySubtags;
  var RELEVANT_EXTENSION_KEYS = ["ca", "co", "hc", "kf", "kn", "nu"];
  var UNICODE_TYPE_REGEX = /^[a-z0-9]{3,8}(-[a-z0-9]{3,8})*$/i;
  function applyOptionsToTag(tag, options) {
    invariant(typeof tag === "string", "language tag must be a string");
    invariant((0, import_intl_getcanonicallocales.isStructurallyValidLanguageTag)(tag), "malformed language tag", RangeError);
    var language = GetOption(options, "language", "string", void 0, void 0);
    if (language !== void 0) {
      invariant((0, import_intl_getcanonicallocales.isUnicodeLanguageSubtag)(language), "Malformed unicode_language_subtag", RangeError);
    }
    var script = GetOption(options, "script", "string", void 0, void 0);
    if (script !== void 0) {
      invariant((0, import_intl_getcanonicallocales.isUnicodeScriptSubtag)(script), "Malformed unicode_script_subtag", RangeError);
    }
    var region = GetOption(options, "region", "string", void 0, void 0);
    if (region !== void 0) {
      invariant((0, import_intl_getcanonicallocales.isUnicodeRegionSubtag)(region), "Malformed unicode_region_subtag", RangeError);
    }
    var languageId = (0, import_intl_getcanonicallocales.parseUnicodeLanguageId)(tag);
    if (language !== void 0) {
      languageId.lang = language;
    }
    if (script !== void 0) {
      languageId.script = script;
    }
    if (region !== void 0) {
      languageId.region = region;
    }
    return Intl.getCanonicalLocales((0, import_intl_getcanonicallocales.emitUnicodeLocaleId)((0, import_tslib5.__assign)((0, import_tslib5.__assign)({}, (0, import_intl_getcanonicallocales.parseUnicodeLocaleId)(tag)), {lang: languageId})))[0];
  }
  function applyUnicodeExtensionToTag(tag, options, relevantExtensionKeys) {
    var unicodeExtension;
    var keywords = [];
    var ast = (0, import_intl_getcanonicallocales.parseUnicodeLocaleId)(tag);
    for (var _i = 0, _a = ast.extensions; _i < _a.length; _i++) {
      var ext = _a[_i];
      if (ext.type === "u") {
        unicodeExtension = ext;
        if (Array.isArray(ext.keywords))
          keywords = ext.keywords;
      }
    }
    var result = Object.create(null);
    for (var _b = 0, relevantExtensionKeys_1 = relevantExtensionKeys; _b < relevantExtensionKeys_1.length; _b++) {
      var key = relevantExtensionKeys_1[_b];
      var value = void 0, entry = void 0;
      for (var _c = 0, keywords_1 = keywords; _c < keywords_1.length; _c++) {
        var keyword = keywords_1[_c];
        if (keyword[0] === key) {
          entry = keyword;
          value = entry[1];
        }
      }
      invariant(key in options, key + " must be in options");
      var optionsValue = options[key];
      if (optionsValue !== void 0) {
        invariant(typeof optionsValue === "string", "Value for " + key + " must be a string");
        value = optionsValue;
        if (entry) {
          entry[1] = value;
        } else {
          keywords.push([key, value]);
        }
      }
      result[key] = value;
    }
    if (!unicodeExtension) {
      if (keywords.length) {
        ast.extensions.push({
          type: "u",
          keywords: keywords,
          attributes: []
        });
      }
    } else {
      unicodeExtension.keywords = keywords;
    }
    result.locale = Intl.getCanonicalLocales((0, import_intl_getcanonicallocales.emitUnicodeLocaleId)(ast))[0];
    return result;
  }
  function mergeUnicodeLanguageId(lang, script, region, variants, replacement) {
    if (variants === void 0) {
      variants = [];
    }
    if (!replacement) {
      return {
        lang: lang || "und",
        script: script,
        region: region,
        variants: variants
      };
    }
    return {
      lang: !lang || lang === "und" ? replacement.lang : lang,
      script: script || replacement.script,
      region: region || replacement.region,
      variants: (0, import_tslib5.__spreadArray)((0, import_tslib5.__spreadArray)([], variants), replacement.variants)
    };
  }
  function addLikelySubtags(tag) {
    var ast = (0, import_intl_getcanonicallocales.parseUnicodeLocaleId)(tag);
    var unicodeLangId = ast.lang;
    var lang = unicodeLangId.lang, script = unicodeLangId.script, region = unicodeLangId.region, variants = unicodeLangId.variants;
    if (script && region) {
      var match_1 = likelySubtags[(0, import_intl_getcanonicallocales.emitUnicodeLanguageId)({lang: lang, script: script, region: region, variants: []})];
      if (match_1) {
        var parts_1 = (0, import_intl_getcanonicallocales.parseUnicodeLanguageId)(match_1);
        ast.lang = mergeUnicodeLanguageId(void 0, void 0, void 0, variants, parts_1);
        return (0, import_intl_getcanonicallocales.emitUnicodeLocaleId)(ast);
      }
    }
    if (script) {
      var match_2 = likelySubtags[(0, import_intl_getcanonicallocales.emitUnicodeLanguageId)({lang: lang, script: script, variants: []})];
      if (match_2) {
        var parts_2 = (0, import_intl_getcanonicallocales.parseUnicodeLanguageId)(match_2);
        ast.lang = mergeUnicodeLanguageId(void 0, void 0, region, variants, parts_2);
        return (0, import_intl_getcanonicallocales.emitUnicodeLocaleId)(ast);
      }
    }
    if (region) {
      var match_3 = likelySubtags[(0, import_intl_getcanonicallocales.emitUnicodeLanguageId)({lang: lang, region: region, variants: []})];
      if (match_3) {
        var parts_3 = (0, import_intl_getcanonicallocales.parseUnicodeLanguageId)(match_3);
        ast.lang = mergeUnicodeLanguageId(void 0, script, void 0, variants, parts_3);
        return (0, import_intl_getcanonicallocales.emitUnicodeLocaleId)(ast);
      }
    }
    var match = likelySubtags[lang] || likelySubtags[(0, import_intl_getcanonicallocales.emitUnicodeLanguageId)({lang: "und", script: script, variants: []})];
    if (!match) {
      throw new Error("No match for addLikelySubtags");
    }
    var parts = (0, import_intl_getcanonicallocales.parseUnicodeLanguageId)(match);
    ast.lang = mergeUnicodeLanguageId(void 0, script, region, variants, parts);
    return (0, import_intl_getcanonicallocales.emitUnicodeLocaleId)(ast);
  }
  function removeLikelySubtags(tag) {
    var maxLocale = addLikelySubtags(tag);
    if (!maxLocale) {
      return tag;
    }
    maxLocale = (0, import_intl_getcanonicallocales.emitUnicodeLanguageId)((0, import_tslib5.__assign)((0, import_tslib5.__assign)({}, (0, import_intl_getcanonicallocales.parseUnicodeLanguageId)(maxLocale)), {variants: []}));
    var ast = (0, import_intl_getcanonicallocales.parseUnicodeLocaleId)(tag);
    var _a = ast.lang, lang = _a.lang, script = _a.script, region = _a.region, variants = _a.variants;
    var trial = addLikelySubtags((0, import_intl_getcanonicallocales.emitUnicodeLanguageId)({lang: lang, variants: []}));
    if (trial === maxLocale) {
      return (0, import_intl_getcanonicallocales.emitUnicodeLocaleId)((0, import_tslib5.__assign)((0, import_tslib5.__assign)({}, ast), {lang: mergeUnicodeLanguageId(lang, void 0, void 0, variants)}));
    }
    if (region) {
      var trial_1 = addLikelySubtags((0, import_intl_getcanonicallocales.emitUnicodeLanguageId)({lang: lang, region: region, variants: []}));
      if (trial_1 === maxLocale) {
        return (0, import_intl_getcanonicallocales.emitUnicodeLocaleId)((0, import_tslib5.__assign)((0, import_tslib5.__assign)({}, ast), {lang: mergeUnicodeLanguageId(lang, void 0, region, variants)}));
      }
    }
    if (script) {
      var trial_2 = addLikelySubtags((0, import_intl_getcanonicallocales.emitUnicodeLanguageId)({lang: lang, script: script, variants: []}));
      if (trial_2 === maxLocale) {
        return (0, import_intl_getcanonicallocales.emitUnicodeLocaleId)((0, import_tslib5.__assign)((0, import_tslib5.__assign)({}, ast), {lang: mergeUnicodeLanguageId(lang, script, void 0, variants)}));
      }
    }
    return tag;
  }
  var Locale = function() {
    function Locale2(tag, opts) {
      var newTarget = this && this instanceof Locale2 ? this.constructor : void 0;
      if (!newTarget) {
        throw new TypeError("Intl.Locale must be called with 'new'");
      }
      var relevantExtensionKeys = Locale2.relevantExtensionKeys;
      var internalSlotsList = [
        "initializedLocale",
        "locale",
        "calendar",
        "collation",
        "hourCycle",
        "numberingSystem"
      ];
      if (relevantExtensionKeys.indexOf("kf") > -1) {
        internalSlotsList.push("caseFirst");
      }
      if (relevantExtensionKeys.indexOf("kn") > -1) {
        internalSlotsList.push("numeric");
      }
      if (tag === void 0) {
        throw new TypeError("First argument to Intl.Locale constructor can't be empty or missing");
      }
      if (typeof tag !== "string" && typeof tag !== "object") {
        throw new TypeError("tag must be a string or object");
      }
      var internalSlots;
      if (typeof tag === "object" && (internalSlots = getInternalSlots(tag)) && internalSlots.initializedLocale) {
        tag = internalSlots.locale;
      } else {
        tag = tag.toString();
      }
      internalSlots = getInternalSlots(this);
      var options = CoerceOptionsToObject(opts);
      tag = applyOptionsToTag(tag, options);
      var opt = Object.create(null);
      var calendar = GetOption(options, "calendar", "string", void 0, void 0);
      if (calendar !== void 0) {
        if (!UNICODE_TYPE_REGEX.test(calendar)) {
          throw new RangeError("invalid calendar");
        }
      }
      opt.ca = calendar;
      var collation = GetOption(options, "collation", "string", void 0, void 0);
      if (collation !== void 0) {
        if (!UNICODE_TYPE_REGEX.test(collation)) {
          throw new RangeError("invalid collation");
        }
      }
      opt.co = collation;
      var hc = GetOption(options, "hourCycle", "string", ["h11", "h12", "h23", "h24"], void 0);
      opt.hc = hc;
      var kf = GetOption(options, "caseFirst", "string", ["upper", "lower", "false"], void 0);
      opt.kf = kf;
      var _kn = GetOption(options, "numeric", "boolean", void 0, void 0);
      var kn;
      if (_kn !== void 0) {
        kn = String(_kn);
      }
      opt.kn = kn;
      var numberingSystem = GetOption(options, "numberingSystem", "string", void 0, void 0);
      if (numberingSystem !== void 0) {
        if (!UNICODE_TYPE_REGEX.test(numberingSystem)) {
          throw new RangeError("Invalid numberingSystem");
        }
      }
      opt.nu = numberingSystem;
      var r = applyUnicodeExtensionToTag(tag, opt, relevantExtensionKeys);
      internalSlots.locale = r.locale;
      internalSlots.calendar = r.ca;
      internalSlots.collation = r.co;
      internalSlots.hourCycle = r.hc;
      if (relevantExtensionKeys.indexOf("kf") > -1) {
        internalSlots.caseFirst = r.kf;
      }
      if (relevantExtensionKeys.indexOf("kn") > -1) {
        internalSlots.numeric = SameValue(r.kn, "true");
      }
      internalSlots.numberingSystem = r.nu;
    }
    Locale2.prototype.maximize = function() {
      var locale = getInternalSlots(this).locale;
      try {
        var maximizedLocale = addLikelySubtags(locale);
        return new Locale2(maximizedLocale);
      } catch (e) {
        return new Locale2(locale);
      }
    };
    Locale2.prototype.minimize = function() {
      var locale = getInternalSlots(this).locale;
      try {
        var minimizedLocale = removeLikelySubtags(locale);
        return new Locale2(minimizedLocale);
      } catch (e) {
        return new Locale2(locale);
      }
    };
    Locale2.prototype.toString = function() {
      return getInternalSlots(this).locale;
    };
    Object.defineProperty(Locale2.prototype, "baseName", {
      get: function() {
        var locale = getInternalSlots(this).locale;
        return (0, import_intl_getcanonicallocales.emitUnicodeLanguageId)((0, import_intl_getcanonicallocales.parseUnicodeLanguageId)(locale));
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Locale2.prototype, "calendar", {
      get: function() {
        return getInternalSlots(this).calendar;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Locale2.prototype, "collation", {
      get: function() {
        return getInternalSlots(this).collation;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Locale2.prototype, "hourCycle", {
      get: function() {
        return getInternalSlots(this).hourCycle;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Locale2.prototype, "caseFirst", {
      get: function() {
        return getInternalSlots(this).caseFirst;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Locale2.prototype, "numeric", {
      get: function() {
        return getInternalSlots(this).numeric;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Locale2.prototype, "numberingSystem", {
      get: function() {
        return getInternalSlots(this).numberingSystem;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Locale2.prototype, "language", {
      get: function() {
        var locale = getInternalSlots(this).locale;
        return (0, import_intl_getcanonicallocales.parseUnicodeLanguageId)(locale).lang;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Locale2.prototype, "script", {
      get: function() {
        var locale = getInternalSlots(this).locale;
        return (0, import_intl_getcanonicallocales.parseUnicodeLanguageId)(locale).script;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Locale2.prototype, "region", {
      get: function() {
        var locale = getInternalSlots(this).locale;
        return (0, import_intl_getcanonicallocales.parseUnicodeLanguageId)(locale).region;
      },
      enumerable: false,
      configurable: true
    });
    Locale2.relevantExtensionKeys = RELEVANT_EXTENSION_KEYS;
    return Locale2;
  }();
  try {
    if (typeof Symbol !== "undefined") {
      Object.defineProperty(Locale.prototype, Symbol.toStringTag, {
        value: "Intl.Locale",
        writable: false,
        enumerable: false,
        configurable: true
      });
    }
    Object.defineProperty(Locale.prototype.constructor, "length", {
      value: 1,
      writable: false,
      enumerable: false,
      configurable: true
    });
  } catch (e) {
  }

  // bazel-out/darwin-fastbuild/bin/packages/intl-locale/lib/should-polyfill.js
  function hasIntlGetCanonicalLocalesBug() {
    try {
      return new Intl.Locale("und-x-private").toString() === "x-private";
    } catch (e) {
      return true;
    }
  }
  function shouldPolyfill() {
    return typeof Intl === "undefined" || !("Locale" in Intl) || hasIntlGetCanonicalLocalesBug();
  }

  // bazel-out/darwin-fastbuild/bin/packages/intl-locale/lib/polyfill.js
  if (shouldPolyfill()) {
    Object.defineProperty(Intl, "Locale", {
      value: Locale,
      writable: true,
      enumerable: false,
      configurable: true
    });
  }
})();
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */


// Intl.PluralRules
(function() {
  // node_modules/tslib/tslib.es6.js
  var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf || {__proto__: []} instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2)
        if (Object.prototype.hasOwnProperty.call(b2, p))
          d2[p] = b2[p];
    };
    return extendStatics(d, b);
  };
  function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }
  function __spreadArray(to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
      to[j] = from[i];
    return to;
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/utils.js
  function getMagnitude(x) {
    return Math.floor(Math.log(x) * Math.LOG10E);
  }
  function repeat(s, times) {
    if (typeof s.repeat === "function") {
      return s.repeat(times);
    }
    var arr = new Array(times);
    for (var i = 0; i < arr.length; i++) {
      arr[i] = s;
    }
    return arr.join("");
  }
  var UNICODE_EXTENSION_SEQUENCE_REGEX = /-u(?:-[0-9a-z]{2,8})+/gi;
  function invariant(condition, message, Err) {
    if (Err === void 0) {
      Err = Error;
    }
    if (!condition) {
      throw new Err(message);
    }
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/types/date-time.js
  var RangePatternType;
  (function(RangePatternType2) {
    RangePatternType2["startRange"] = "startRange";
    RangePatternType2["shared"] = "shared";
    RangePatternType2["endRange"] = "endRange";
  })(RangePatternType || (RangePatternType = {}));

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/CanonicalizeLocaleList.js
  function CanonicalizeLocaleList(locales) {
    return Intl.getCanonicalLocales(locales);
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/262.js
  function ToString(o) {
    if (typeof o === "symbol") {
      throw TypeError("Cannot convert a Symbol value to a string");
    }
    return String(o);
  }
  function ToNumber(val) {
    if (val === void 0) {
      return NaN;
    }
    if (val === null) {
      return 0;
    }
    if (typeof val === "boolean") {
      return val ? 1 : 0;
    }
    if (typeof val === "number") {
      return val;
    }
    if (typeof val === "symbol" || typeof val === "bigint") {
      throw new TypeError("Cannot convert symbol/bigint to number");
    }
    return Number(val);
  }
  function ToObject(arg) {
    if (arg == null) {
      throw new TypeError("undefined/null cannot be converted to object");
    }
    return Object(arg);
  }
  function SameValue(x, y) {
    if (Object.is) {
      return Object.is(x, y);
    }
    if (x === y) {
      return x !== 0 || 1 / x === 1 / y;
    }
    return x !== x && y !== y;
  }
  function Type(x) {
    if (x === null) {
      return "Null";
    }
    if (typeof x === "undefined") {
      return "Undefined";
    }
    if (typeof x === "function" || typeof x === "object") {
      return "Object";
    }
    if (typeof x === "number") {
      return "Number";
    }
    if (typeof x === "boolean") {
      return "Boolean";
    }
    if (typeof x === "string") {
      return "String";
    }
    if (typeof x === "symbol") {
      return "Symbol";
    }
    if (typeof x === "bigint") {
      return "BigInt";
    }
  }
  var MINUTES_PER_HOUR = 60;
  var SECONDS_PER_MINUTE = 60;
  var MS_PER_SECOND = 1e3;
  var MS_PER_MINUTE = MS_PER_SECOND * SECONDS_PER_MINUTE;
  var MS_PER_HOUR = MS_PER_MINUTE * MINUTES_PER_HOUR;

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/CoerceOptionsToObject.js
  function CoerceOptionsToObject(options) {
    if (typeof options === "undefined") {
      return Object.create(null);
    }
    return ToObject(options);
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/GetOption.js
  function GetOption(opts, prop, type, values, fallback) {
    if (typeof opts !== "object") {
      throw new TypeError("Options must be an object");
    }
    var value = opts[prop];
    if (value !== void 0) {
      if (type !== "boolean" && type !== "string") {
        throw new TypeError("invalid type");
      }
      if (type === "boolean") {
        value = Boolean(value);
      }
      if (type === "string") {
        value = ToString(value);
      }
      if (values !== void 0 && !values.filter(function(val) {
        return val == value;
      }).length) {
        throw new RangeError(value + " is not within " + values.join(", "));
      }
      return value;
    }
    return fallback;
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/BestAvailableLocale.js
  function BestAvailableLocale(availableLocales, locale) {
    var candidate = locale;
    while (true) {
      if (availableLocales.has(candidate)) {
        return candidate;
      }
      var pos = candidate.lastIndexOf("-");
      if (!~pos) {
        return void 0;
      }
      if (pos >= 2 && candidate[pos - 2] === "-") {
        pos -= 2;
      }
      candidate = candidate.slice(0, pos);
    }
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/LookupMatcher.js
  function LookupMatcher(availableLocales, requestedLocales, getDefaultLocale) {
    var result = {locale: ""};
    for (var _i = 0, requestedLocales_1 = requestedLocales; _i < requestedLocales_1.length; _i++) {
      var locale = requestedLocales_1[_i];
      var noExtensionLocale = locale.replace(UNICODE_EXTENSION_SEQUENCE_REGEX, "");
      var availableLocale = BestAvailableLocale(availableLocales, noExtensionLocale);
      if (availableLocale) {
        result.locale = availableLocale;
        if (locale !== noExtensionLocale) {
          result.extension = locale.slice(noExtensionLocale.length + 1, locale.length);
        }
        return result;
      }
    }
    result.locale = getDefaultLocale();
    return result;
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/BestFitMatcher.js
  function BestFitMatcher(availableLocales, requestedLocales, getDefaultLocale) {
    var minimizedAvailableLocaleMap = {};
    var minimizedAvailableLocales = new Set();
    availableLocales.forEach(function(locale2) {
      var minimizedLocale = new Intl.Locale(locale2).minimize().toString();
      minimizedAvailableLocaleMap[minimizedLocale] = locale2;
      minimizedAvailableLocales.add(minimizedLocale);
    });
    var foundLocale;
    for (var _i = 0, requestedLocales_1 = requestedLocales; _i < requestedLocales_1.length; _i++) {
      var l = requestedLocales_1[_i];
      if (foundLocale) {
        break;
      }
      var noExtensionLocale = l.replace(UNICODE_EXTENSION_SEQUENCE_REGEX, "");
      if (availableLocales.has(noExtensionLocale)) {
        foundLocale = noExtensionLocale;
        break;
      }
      if (minimizedAvailableLocales.has(noExtensionLocale)) {
        foundLocale = minimizedAvailableLocaleMap[noExtensionLocale];
        break;
      }
      var locale = new Intl.Locale(noExtensionLocale);
      var maximizedRequestedLocale = locale.maximize().toString();
      var minimizedRequestedLocale = locale.minimize().toString();
      if (minimizedAvailableLocales.has(minimizedRequestedLocale)) {
        foundLocale = minimizedAvailableLocaleMap[minimizedRequestedLocale];
        break;
      }
      foundLocale = BestAvailableLocale(minimizedAvailableLocales, maximizedRequestedLocale);
    }
    return {
      locale: foundLocale || getDefaultLocale()
    };
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/UnicodeExtensionValue.js
  function UnicodeExtensionValue(extension, key) {
    invariant(key.length === 2, "key must have 2 elements");
    var size = extension.length;
    var searchValue = "-" + key + "-";
    var pos = extension.indexOf(searchValue);
    if (pos !== -1) {
      var start = pos + 4;
      var end = start;
      var k = start;
      var done = false;
      while (!done) {
        var e = extension.indexOf("-", k);
        var len = void 0;
        if (e === -1) {
          len = size - k;
        } else {
          len = e - k;
        }
        if (len === 2) {
          done = true;
        } else if (e === -1) {
          end = size;
          done = true;
        } else {
          end = e;
          k = e + 1;
        }
      }
      return extension.slice(start, end);
    }
    searchValue = "-" + key;
    pos = extension.indexOf(searchValue);
    if (pos !== -1 && pos + 3 === size) {
      return "";
    }
    return void 0;
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/ResolveLocale.js
  function ResolveLocale(availableLocales, requestedLocales, options, relevantExtensionKeys, localeData, getDefaultLocale) {
    var matcher = options.localeMatcher;
    var r;
    if (matcher === "lookup") {
      r = LookupMatcher(availableLocales, requestedLocales, getDefaultLocale);
    } else {
      r = BestFitMatcher(availableLocales, requestedLocales, getDefaultLocale);
    }
    var foundLocale = r.locale;
    var result = {locale: "", dataLocale: foundLocale};
    var supportedExtension = "-u";
    for (var _i = 0, relevantExtensionKeys_1 = relevantExtensionKeys; _i < relevantExtensionKeys_1.length; _i++) {
      var key = relevantExtensionKeys_1[_i];
      invariant(foundLocale in localeData, "Missing locale data for " + foundLocale);
      var foundLocaleData = localeData[foundLocale];
      invariant(typeof foundLocaleData === "object" && foundLocaleData !== null, "locale data " + key + " must be an object");
      var keyLocaleData = foundLocaleData[key];
      invariant(Array.isArray(keyLocaleData), "keyLocaleData for " + key + " must be an array");
      var value = keyLocaleData[0];
      invariant(typeof value === "string" || value === null, "value must be string or null but got " + typeof value + " in key " + key);
      var supportedExtensionAddition = "";
      if (r.extension) {
        var requestedValue = UnicodeExtensionValue(r.extension, key);
        if (requestedValue !== void 0) {
          if (requestedValue !== "") {
            if (~keyLocaleData.indexOf(requestedValue)) {
              value = requestedValue;
              supportedExtensionAddition = "-" + key + "-" + value;
            }
          } else if (~requestedValue.indexOf("true")) {
            value = "true";
            supportedExtensionAddition = "-" + key;
          }
        }
      }
      if (key in options) {
        var optionsValue = options[key];
        invariant(typeof optionsValue === "string" || typeof optionsValue === "undefined" || optionsValue === null, "optionsValue must be String, Undefined or Null");
        if (~keyLocaleData.indexOf(optionsValue)) {
          if (optionsValue !== value) {
            value = optionsValue;
            supportedExtensionAddition = "";
          }
        }
      }
      result[key] = value;
      supportedExtension += supportedExtensionAddition;
    }
    if (supportedExtension.length > 2) {
      var privateIndex = foundLocale.indexOf("-x-");
      if (privateIndex === -1) {
        foundLocale = foundLocale + supportedExtension;
      } else {
        var preExtension = foundLocale.slice(0, privateIndex);
        var postExtension = foundLocale.slice(privateIndex, foundLocale.length);
        foundLocale = preExtension + supportedExtension + postExtension;
      }
      foundLocale = Intl.getCanonicalLocales(foundLocale)[0];
    }
    result.locale = foundLocale;
    return result;
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/DefaultNumberOption.js
  function DefaultNumberOption(val, min, max, fallback) {
    if (val !== void 0) {
      val = Number(val);
      if (isNaN(val) || val < min || val > max) {
        throw new RangeError(val + " is outside of range [" + min + ", " + max + "]");
      }
      return Math.floor(val);
    }
    return fallback;
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/GetNumberOption.js
  function GetNumberOption(options, property, minimum, maximum, fallback) {
    var val = options[property];
    return DefaultNumberOption(val, minimum, maximum, fallback);
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/IsSanctionedSimpleUnitIdentifier.js
  var SANCTIONED_UNITS = [
    "angle-degree",
    "area-acre",
    "area-hectare",
    "concentr-percent",
    "digital-bit",
    "digital-byte",
    "digital-gigabit",
    "digital-gigabyte",
    "digital-kilobit",
    "digital-kilobyte",
    "digital-megabit",
    "digital-megabyte",
    "digital-petabyte",
    "digital-terabit",
    "digital-terabyte",
    "duration-day",
    "duration-hour",
    "duration-millisecond",
    "duration-minute",
    "duration-month",
    "duration-second",
    "duration-week",
    "duration-year",
    "length-centimeter",
    "length-foot",
    "length-inch",
    "length-kilometer",
    "length-meter",
    "length-mile-scandinavian",
    "length-mile",
    "length-millimeter",
    "length-yard",
    "mass-gram",
    "mass-kilogram",
    "mass-ounce",
    "mass-pound",
    "mass-stone",
    "temperature-celsius",
    "temperature-fahrenheit",
    "volume-fluid-ounce",
    "volume-gallon",
    "volume-liter",
    "volume-milliliter"
  ];
  function removeUnitNamespace(unit) {
    return unit.slice(unit.indexOf("-") + 1);
  }
  var SIMPLE_UNITS = SANCTIONED_UNITS.map(removeUnitNamespace);

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/NumberFormat/ToRawPrecision.js
  function ToRawPrecision(x, minPrecision, maxPrecision) {
    var p = maxPrecision;
    var m;
    var e;
    var xFinal;
    if (x === 0) {
      m = repeat("0", p);
      e = 0;
      xFinal = 0;
    } else {
      var xToString = x.toString();
      var xToStringExponentIndex = xToString.indexOf("e");
      var _a = xToString.split("e"), xToStringMantissa = _a[0], xToStringExponent = _a[1];
      var xToStringMantissaWithoutDecimalPoint = xToStringMantissa.replace(".", "");
      if (xToStringExponentIndex >= 0 && xToStringMantissaWithoutDecimalPoint.length <= p) {
        e = +xToStringExponent;
        m = xToStringMantissaWithoutDecimalPoint + repeat("0", p - xToStringMantissaWithoutDecimalPoint.length);
        xFinal = x;
      } else {
        e = getMagnitude(x);
        var decimalPlaceOffset = e - p + 1;
        var n = Math.round(adjustDecimalPlace(x, decimalPlaceOffset));
        if (adjustDecimalPlace(n, p - 1) >= 10) {
          e = e + 1;
          n = Math.floor(n / 10);
        }
        m = n.toString();
        xFinal = adjustDecimalPlace(n, p - 1 - e);
      }
    }
    var int;
    if (e >= p - 1) {
      m = m + repeat("0", e - p + 1);
      int = e + 1;
    } else if (e >= 0) {
      m = m.slice(0, e + 1) + "." + m.slice(e + 1);
      int = e + 1;
    } else {
      m = "0." + repeat("0", -e - 1) + m;
      int = 1;
    }
    if (m.indexOf(".") >= 0 && maxPrecision > minPrecision) {
      var cut = maxPrecision - minPrecision;
      while (cut > 0 && m[m.length - 1] === "0") {
        m = m.slice(0, -1);
        cut--;
      }
      if (m[m.length - 1] === ".") {
        m = m.slice(0, -1);
      }
    }
    return {formattedString: m, roundedNumber: xFinal, integerDigitsCount: int};
    function adjustDecimalPlace(x2, magnitude) {
      return magnitude < 0 ? x2 * Math.pow(10, -magnitude) : x2 / Math.pow(10, magnitude);
    }
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/NumberFormat/ToRawFixed.js
  function ToRawFixed(x, minFraction, maxFraction) {
    var f = maxFraction;
    var n = Math.round(x * Math.pow(10, f));
    var xFinal = n / Math.pow(10, f);
    var m;
    if (n < 1e21) {
      m = n.toString();
    } else {
      m = n.toString();
      var _a = m.split("e"), mantissa = _a[0], exponent = _a[1];
      m = mantissa.replace(".", "");
      m = m + repeat("0", Math.max(+exponent - m.length + 1, 0));
    }
    var int;
    if (f !== 0) {
      var k = m.length;
      if (k <= f) {
        var z = repeat("0", f + 1 - k);
        m = z + m;
        k = f + 1;
      }
      var a = m.slice(0, k - f);
      var b = m.slice(k - f);
      m = a + "." + b;
      int = a.length;
    } else {
      int = m.length;
    }
    var cut = maxFraction - minFraction;
    while (cut > 0 && m[m.length - 1] === "0") {
      m = m.slice(0, -1);
      cut--;
    }
    if (m[m.length - 1] === ".") {
      m = m.slice(0, -1);
    }
    return {formattedString: m, roundedNumber: xFinal, integerDigitsCount: int};
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/NumberFormat/FormatNumericToString.js
  function FormatNumericToString(intlObject, x) {
    var isNegative = x < 0 || SameValue(x, -0);
    if (isNegative) {
      x = -x;
    }
    var result;
    var rourndingType = intlObject.roundingType;
    switch (rourndingType) {
      case "significantDigits":
        result = ToRawPrecision(x, intlObject.minimumSignificantDigits, intlObject.maximumSignificantDigits);
        break;
      case "fractionDigits":
        result = ToRawFixed(x, intlObject.minimumFractionDigits, intlObject.maximumFractionDigits);
        break;
      default:
        result = ToRawPrecision(x, 1, 2);
        if (result.integerDigitsCount > 1) {
          result = ToRawFixed(x, 0, 0);
        }
        break;
    }
    x = result.roundedNumber;
    var string = result.formattedString;
    var int = result.integerDigitsCount;
    var minInteger = intlObject.minimumIntegerDigits;
    if (int < minInteger) {
      var forwardZeros = repeat("0", minInteger - int);
      string = forwardZeros + string;
    }
    if (isNegative) {
      x = -x;
    }
    return {roundedNumber: x, formattedString: string};
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/regex.generated.js
  var S_UNICODE_REGEX = /[\$\+<->\^`\|~\xA2-\xA6\xA8\xA9\xAC\xAE-\xB1\xB4\xB8\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0384\u0385\u03F6\u0482\u058D-\u058F\u0606-\u0608\u060B\u060E\u060F\u06DE\u06E9\u06FD\u06FE\u07F6\u07FE\u07FF\u09F2\u09F3\u09FA\u09FB\u0AF1\u0B70\u0BF3-\u0BFA\u0C7F\u0D4F\u0D79\u0E3F\u0F01-\u0F03\u0F13\u0F15-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE\u0FCF\u0FD5-\u0FD8\u109E\u109F\u1390-\u1399\u166D\u17DB\u1940\u19DE-\u19FF\u1B61-\u1B6A\u1B74-\u1B7C\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2044\u2052\u207A-\u207C\u208A-\u208C\u20A0-\u20BF\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2307\u230C-\u2328\u232B-\u2426\u2440-\u244A\u249C-\u24E9\u2500-\u2767\u2794-\u27C4\u27C7-\u27E5\u27F0-\u2982\u2999-\u29D7\u29DC-\u29FB\u29FE-\u2B73\u2B76-\u2B95\u2B97-\u2BFF\u2CE5-\u2CEA\u2E50\u2E51\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFB\u3004\u3012\u3013\u3020\u3036\u3037\u303E\u303F\u309B\u309C\u3190\u3191\u3196-\u319F\u31C0-\u31E3\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uAA77-\uAA79\uAB5B\uAB6A\uAB6B\uFB29\uFBB2-\uFBC1\uFDFC\uFDFD\uFE62\uFE64-\uFE66\uFE69\uFF04\uFF0B\uFF1C-\uFF1E\uFF3E\uFF40\uFF5C\uFF5E\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD]|\uD800[\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9C\uDDA0\uDDD0-\uDDFC]|\uD802[\uDC77\uDC78\uDEC8]|\uD805\uDF3F|\uD807[\uDFD5-\uDFF1]|\uD81A[\uDF3C-\uDF3F\uDF45]|\uD82F\uDC9C|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDE8\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85\uDE86]|\uD838[\uDD4F\uDEFF]|\uD83B[\uDCAC\uDCB0\uDD2E\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD0D-\uDDAD\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED7\uDEE0-\uDEEC\uDEF0-\uDEFC\uDF00-\uDF73\uDF80-\uDFD8\uDFE0-\uDFEB]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDCB0\uDCB1\uDD00-\uDD78\uDD7A-\uDDCB\uDDCD-\uDE53\uDE60-\uDE6D\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6\uDF00-\uDF92\uDF94-\uDFCA]/;

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/NumberFormat/format_to_parts.js
  var CARET_S_UNICODE_REGEX = new RegExp("^" + S_UNICODE_REGEX.source);
  var S_DOLLAR_UNICODE_REGEX = new RegExp(S_UNICODE_REGEX.source + "$");

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/NumberFormat/SetNumberFormatDigitOptions.js
  function SetNumberFormatDigitOptions(internalSlots, opts, mnfdDefault, mxfdDefault, notation) {
    var mnid = GetNumberOption(opts, "minimumIntegerDigits", 1, 21, 1);
    var mnfd = opts.minimumFractionDigits;
    var mxfd = opts.maximumFractionDigits;
    var mnsd = opts.minimumSignificantDigits;
    var mxsd = opts.maximumSignificantDigits;
    internalSlots.minimumIntegerDigits = mnid;
    if (mnsd !== void 0 || mxsd !== void 0) {
      internalSlots.roundingType = "significantDigits";
      mnsd = DefaultNumberOption(mnsd, 1, 21, 1);
      mxsd = DefaultNumberOption(mxsd, mnsd, 21, 21);
      internalSlots.minimumSignificantDigits = mnsd;
      internalSlots.maximumSignificantDigits = mxsd;
    } else if (mnfd !== void 0 || mxfd !== void 0) {
      internalSlots.roundingType = "fractionDigits";
      mnfd = DefaultNumberOption(mnfd, 0, 20, mnfdDefault);
      var mxfdActualDefault = Math.max(mnfd, mxfdDefault);
      mxfd = DefaultNumberOption(mxfd, mnfd, 20, mxfdActualDefault);
      internalSlots.minimumFractionDigits = mnfd;
      internalSlots.maximumFractionDigits = mxfd;
    } else if (notation === "compact") {
      internalSlots.roundingType = "compactRounding";
    } else {
      internalSlots.roundingType = "fractionDigits";
      internalSlots.minimumFractionDigits = mnfdDefault;
      internalSlots.maximumFractionDigits = mxfdDefault;
    }
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/PluralRules/GetOperands.js
  function GetOperands(s) {
    invariant(typeof s === "string", "GetOperands should have been called with a string");
    var n = ToNumber(s);
    invariant(isFinite(n), "n should be finite");
    var dp = s.indexOf(".");
    var iv;
    var f;
    var v;
    var fv = "";
    if (dp === -1) {
      iv = n;
      f = 0;
      v = 0;
    } else {
      iv = s.slice(0, dp);
      fv = s.slice(dp, s.length);
      f = ToNumber(fv);
      v = fv.length;
    }
    var i = Math.abs(ToNumber(iv));
    var w;
    var t;
    if (f !== 0) {
      var ft = fv.replace(/0+$/, "");
      w = ft.length;
      t = ToNumber(ft);
    } else {
      w = 0;
      t = 0;
    }
    return {
      Number: n,
      IntegerDigits: i,
      NumberOfFractionDigits: v,
      NumberOfFractionDigitsWithoutTrailing: w,
      FractionDigits: f,
      FractionDigitsWithoutTrailing: t
    };
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/PluralRules/InitializePluralRules.js
  function InitializePluralRules(pl, locales, options, _a) {
    var availableLocales = _a.availableLocales, relevantExtensionKeys = _a.relevantExtensionKeys, localeData = _a.localeData, getDefaultLocale = _a.getDefaultLocale, getInternalSlots2 = _a.getInternalSlots;
    var requestedLocales = CanonicalizeLocaleList(locales);
    var opt = Object.create(null);
    var opts = CoerceOptionsToObject(options);
    var internalSlots = getInternalSlots2(pl);
    internalSlots.initializedPluralRules = true;
    var matcher = GetOption(opts, "localeMatcher", "string", ["best fit", "lookup"], "best fit");
    opt.localeMatcher = matcher;
    internalSlots.type = GetOption(opts, "type", "string", ["cardinal", "ordinal"], "cardinal");
    SetNumberFormatDigitOptions(internalSlots, opts, 0, 3, "standard");
    var r = ResolveLocale(availableLocales, requestedLocales, opt, relevantExtensionKeys, localeData, getDefaultLocale);
    internalSlots.locale = r.locale;
    return pl;
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/PluralRules/ResolvePlural.js
  function ResolvePlural(pl, n, _a) {
    var getInternalSlots2 = _a.getInternalSlots, PluralRuleSelect2 = _a.PluralRuleSelect;
    var internalSlots = getInternalSlots2(pl);
    invariant(Type(internalSlots) === "Object", "pl has to be an object");
    invariant("initializedPluralRules" in internalSlots, "pluralrules must be initialized");
    invariant(Type(n) === "Number", "n must be a number");
    if (!isFinite(n)) {
      return "other";
    }
    var locale = internalSlots.locale, type = internalSlots.type;
    var res = FormatNumericToString(internalSlots, n);
    var s = res.formattedString;
    var operands = GetOperands(s);
    return PluralRuleSelect2(locale, type, n, operands);
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/LookupSupportedLocales.js
  function LookupSupportedLocales(availableLocales, requestedLocales) {
    var subset = [];
    for (var _i = 0, requestedLocales_1 = requestedLocales; _i < requestedLocales_1.length; _i++) {
      var locale = requestedLocales_1[_i];
      var noExtensionLocale = locale.replace(UNICODE_EXTENSION_SEQUENCE_REGEX, "");
      var availableLocale = BestAvailableLocale(availableLocales, noExtensionLocale);
      if (availableLocale) {
        subset.push(availableLocale);
      }
    }
    return subset;
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/SupportedLocales.js
  function SupportedLocales(availableLocales, requestedLocales, options) {
    var matcher = "best fit";
    if (options !== void 0) {
      options = ToObject(options);
      matcher = GetOption(options, "localeMatcher", "string", ["lookup", "best fit"], "best fit");
    }
    if (matcher === "best fit") {
      return LookupSupportedLocales(availableLocales, requestedLocales);
    }
    return LookupSupportedLocales(availableLocales, requestedLocales);
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/data.js
  var MissingLocaleDataError = function(_super) {
    __extends(MissingLocaleDataError2, _super);
    function MissingLocaleDataError2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.type = "MISSING_LOCALE_DATA";
      return _this;
    }
    return MissingLocaleDataError2;
  }(Error);

  // bazel-out/darwin-fastbuild/bin/packages/intl-pluralrules/lib/get_internal_slots.js
  var internalSlotMap = new WeakMap();
  function getInternalSlots(x) {
    var internalSlots = internalSlotMap.get(x);
    if (!internalSlots) {
      internalSlots = Object.create(null);
      internalSlotMap.set(x, internalSlots);
    }
    return internalSlots;
  }

  // bazel-out/darwin-fastbuild/bin/packages/intl-pluralrules/lib/index.js
  function validateInstance(instance, method) {
    if (!(instance instanceof PluralRules)) {
      throw new TypeError("Method Intl.PluralRules.prototype." + method + " called on incompatible receiver " + String(instance));
    }
  }
  function PluralRuleSelect(locale, type, _n, _a) {
    var IntegerDigits = _a.IntegerDigits, NumberOfFractionDigits = _a.NumberOfFractionDigits, FractionDigits = _a.FractionDigits;
    return PluralRules.localeData[locale].fn(NumberOfFractionDigits ? IntegerDigits + "." + FractionDigits : IntegerDigits, type === "ordinal");
  }
  var PluralRules = function() {
    function PluralRules2(locales, options) {
      var newTarget = this && this instanceof PluralRules2 ? this.constructor : void 0;
      if (!newTarget) {
        throw new TypeError("Intl.PluralRules must be called with 'new'");
      }
      return InitializePluralRules(this, locales, options, {
        availableLocales: PluralRules2.availableLocales,
        relevantExtensionKeys: PluralRules2.relevantExtensionKeys,
        localeData: PluralRules2.localeData,
        getDefaultLocale: PluralRules2.getDefaultLocale,
        getInternalSlots: getInternalSlots
      });
    }
    PluralRules2.prototype.resolvedOptions = function() {
      validateInstance(this, "resolvedOptions");
      var opts = Object.create(null);
      var internalSlots = getInternalSlots(this);
      opts.locale = internalSlots.locale;
      opts.type = internalSlots.type;
      [
        "minimumIntegerDigits",
        "minimumFractionDigits",
        "maximumFractionDigits",
        "minimumSignificantDigits",
        "maximumSignificantDigits"
      ].forEach(function(field) {
        var val = internalSlots[field];
        if (val !== void 0) {
          opts[field] = val;
        }
      });
      opts.pluralCategories = __spreadArray([], PluralRules2.localeData[opts.locale].categories[opts.type]);
      return opts;
    };
    PluralRules2.prototype.select = function(val) {
      var pr = this;
      validateInstance(pr, "select");
      var n = ToNumber(val);
      return ResolvePlural(pr, n, {getInternalSlots: getInternalSlots, PluralRuleSelect: PluralRuleSelect});
    };
    PluralRules2.prototype.toString = function() {
      return "[object Intl.PluralRules]";
    };
    PluralRules2.supportedLocalesOf = function(locales, options) {
      return SupportedLocales(PluralRules2.availableLocales, CanonicalizeLocaleList(locales), options);
    };
    PluralRules2.__addLocaleData = function() {
      var data = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        data[_i] = arguments[_i];
      }
      for (var _a = 0, data_1 = data; _a < data_1.length; _a++) {
        var _b = data_1[_a], d = _b.data, locale = _b.locale;
        PluralRules2.localeData[locale] = d;
        PluralRules2.availableLocales.add(locale);
        if (!PluralRules2.__defaultLocale) {
          PluralRules2.__defaultLocale = locale;
        }
      }
    };
    PluralRules2.getDefaultLocale = function() {
      return PluralRules2.__defaultLocale;
    };
    PluralRules2.localeData = {};
    PluralRules2.availableLocales = new Set();
    PluralRules2.__defaultLocale = "";
    PluralRules2.relevantExtensionKeys = [];
    PluralRules2.polyfilled = true;
    return PluralRules2;
  }();
  try {
    if (typeof Symbol !== "undefined") {
      Object.defineProperty(PluralRules.prototype, Symbol.toStringTag, {
        value: "Intl.PluralRules",
        writable: false,
        enumerable: false,
        configurable: true
      });
    }
    try {
      Object.defineProperty(PluralRules, "length", {
        value: 0,
        writable: false,
        enumerable: false,
        configurable: true
      });
    } catch (error) {
    }
    Object.defineProperty(PluralRules.prototype.constructor, "length", {
      value: 0,
      writable: false,
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(PluralRules.supportedLocalesOf, "length", {
      value: 1,
      writable: false,
      enumerable: false,
      configurable: true
    });
  } catch (ex) {
  }

  // bazel-out/darwin-fastbuild/bin/packages/intl-pluralrules/lib/should-polyfill.js
  function shouldPolyfill() {
    return typeof Intl === "undefined" || !("PluralRules" in Intl) || new Intl.PluralRules("en", {minimumFractionDigits: 2}).select(1) === "one";
  }

  // bazel-out/darwin-fastbuild/bin/packages/intl-pluralrules/lib/polyfill.js
  if (shouldPolyfill()) {
    Object.defineProperty(Intl, "PluralRules", {
      value: PluralRules,
      writable: true,
      enumerable: false,
      configurable: true
    });
  }
})();
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */


// Intl.NumberFormat
(function() {
  var __defProp = Object.defineProperty;
  var __export = function(target, all) {
    for (var name in all)
      __defProp(target, name, {get: all[name], enumerable: true});
  };

  // node_modules/tslib/tslib.es6.js
  var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf || {__proto__: []} instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2)
        if (Object.prototype.hasOwnProperty.call(b2, p))
          d2[p] = b2[p];
    };
    return extendStatics(d, b);
  };
  function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/utils.js
  function getMagnitude(x) {
    return Math.floor(Math.log(x) * Math.LOG10E);
  }
  function repeat(s, times) {
    if (typeof s.repeat === "function") {
      return s.repeat(times);
    }
    var arr = new Array(times);
    for (var i = 0; i < arr.length; i++) {
      arr[i] = s;
    }
    return arr.join("");
  }
  function defineProperty(target, name, _a) {
    var value = _a.value;
    Object.defineProperty(target, name, {
      configurable: true,
      enumerable: false,
      writable: true,
      value: value
    });
  }
  var UNICODE_EXTENSION_SEQUENCE_REGEX = /-u(?:-[0-9a-z]{2,8})+/gi;
  function invariant(condition, message, Err) {
    if (Err === void 0) {
      Err = Error;
    }
    if (!condition) {
      throw new Err(message);
    }
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/types/date-time.js
  var RangePatternType;
  (function(RangePatternType2) {
    RangePatternType2["startRange"] = "startRange";
    RangePatternType2["shared"] = "shared";
    RangePatternType2["endRange"] = "endRange";
  })(RangePatternType || (RangePatternType = {}));

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/CanonicalizeLocaleList.js
  function CanonicalizeLocaleList(locales) {
    return Intl.getCanonicalLocales(locales);
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/262.js
  function ToString(o) {
    if (typeof o === "symbol") {
      throw TypeError("Cannot convert a Symbol value to a string");
    }
    return String(o);
  }
  function ToNumber(val) {
    if (val === void 0) {
      return NaN;
    }
    if (val === null) {
      return 0;
    }
    if (typeof val === "boolean") {
      return val ? 1 : 0;
    }
    if (typeof val === "number") {
      return val;
    }
    if (typeof val === "symbol" || typeof val === "bigint") {
      throw new TypeError("Cannot convert symbol/bigint to number");
    }
    return Number(val);
  }
  function ToObject(arg) {
    if (arg == null) {
      throw new TypeError("undefined/null cannot be converted to object");
    }
    return Object(arg);
  }
  function SameValue(x, y) {
    if (Object.is) {
      return Object.is(x, y);
    }
    if (x === y) {
      return x !== 0 || 1 / x === 1 / y;
    }
    return x !== x && y !== y;
  }
  function ArrayCreate(len) {
    return new Array(len);
  }
  function HasOwnProperty(o, prop) {
    return Object.prototype.hasOwnProperty.call(o, prop);
  }
  var MINUTES_PER_HOUR = 60;
  var SECONDS_PER_MINUTE = 60;
  var MS_PER_SECOND = 1e3;
  var MS_PER_MINUTE = MS_PER_SECOND * SECONDS_PER_MINUTE;
  var MS_PER_HOUR = MS_PER_MINUTE * MINUTES_PER_HOUR;
  function IsCallable(fn) {
    return typeof fn === "function";
  }
  function OrdinaryHasInstance(C, O, internalSlots) {
    if (!IsCallable(C)) {
      return false;
    }
    if (internalSlots === null || internalSlots === void 0 ? void 0 : internalSlots.boundTargetFunction) {
      var BC = internalSlots === null || internalSlots === void 0 ? void 0 : internalSlots.boundTargetFunction;
      return O instanceof BC;
    }
    if (typeof O !== "object") {
      return false;
    }
    var P = C.prototype;
    if (typeof P !== "object") {
      throw new TypeError("OrdinaryHasInstance called on an object with an invalid prototype property.");
    }
    return Object.prototype.isPrototypeOf.call(P, O);
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/CoerceOptionsToObject.js
  function CoerceOptionsToObject(options) {
    if (typeof options === "undefined") {
      return Object.create(null);
    }
    return ToObject(options);
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/GetOption.js
  function GetOption(opts, prop, type, values, fallback) {
    if (typeof opts !== "object") {
      throw new TypeError("Options must be an object");
    }
    var value = opts[prop];
    if (value !== void 0) {
      if (type !== "boolean" && type !== "string") {
        throw new TypeError("invalid type");
      }
      if (type === "boolean") {
        value = Boolean(value);
      }
      if (type === "string") {
        value = ToString(value);
      }
      if (values !== void 0 && !values.filter(function(val) {
        return val == value;
      }).length) {
        throw new RangeError(value + " is not within " + values.join(", "));
      }
      return value;
    }
    return fallback;
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/BestAvailableLocale.js
  function BestAvailableLocale(availableLocales, locale) {
    var candidate = locale;
    while (true) {
      if (availableLocales.has(candidate)) {
        return candidate;
      }
      var pos = candidate.lastIndexOf("-");
      if (!~pos) {
        return void 0;
      }
      if (pos >= 2 && candidate[pos - 2] === "-") {
        pos -= 2;
      }
      candidate = candidate.slice(0, pos);
    }
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/LookupMatcher.js
  function LookupMatcher(availableLocales, requestedLocales, getDefaultLocale) {
    var result = {locale: ""};
    for (var _i = 0, requestedLocales_1 = requestedLocales; _i < requestedLocales_1.length; _i++) {
      var locale = requestedLocales_1[_i];
      var noExtensionLocale = locale.replace(UNICODE_EXTENSION_SEQUENCE_REGEX, "");
      var availableLocale = BestAvailableLocale(availableLocales, noExtensionLocale);
      if (availableLocale) {
        result.locale = availableLocale;
        if (locale !== noExtensionLocale) {
          result.extension = locale.slice(noExtensionLocale.length + 1, locale.length);
        }
        return result;
      }
    }
    result.locale = getDefaultLocale();
    return result;
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/BestFitMatcher.js
  function BestFitMatcher(availableLocales, requestedLocales, getDefaultLocale) {
    var minimizedAvailableLocaleMap = {};
    var minimizedAvailableLocales = new Set();
    availableLocales.forEach(function(locale2) {
      var minimizedLocale = new Intl.Locale(locale2).minimize().toString();
      minimizedAvailableLocaleMap[minimizedLocale] = locale2;
      minimizedAvailableLocales.add(minimizedLocale);
    });
    var foundLocale;
    for (var _i = 0, requestedLocales_1 = requestedLocales; _i < requestedLocales_1.length; _i++) {
      var l = requestedLocales_1[_i];
      if (foundLocale) {
        break;
      }
      var noExtensionLocale = l.replace(UNICODE_EXTENSION_SEQUENCE_REGEX, "");
      if (availableLocales.has(noExtensionLocale)) {
        foundLocale = noExtensionLocale;
        break;
      }
      if (minimizedAvailableLocales.has(noExtensionLocale)) {
        foundLocale = minimizedAvailableLocaleMap[noExtensionLocale];
        break;
      }
      var locale = new Intl.Locale(noExtensionLocale);
      var maximizedRequestedLocale = locale.maximize().toString();
      var minimizedRequestedLocale = locale.minimize().toString();
      if (minimizedAvailableLocales.has(minimizedRequestedLocale)) {
        foundLocale = minimizedAvailableLocaleMap[minimizedRequestedLocale];
        break;
      }
      foundLocale = BestAvailableLocale(minimizedAvailableLocales, maximizedRequestedLocale);
    }
    return {
      locale: foundLocale || getDefaultLocale()
    };
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/UnicodeExtensionValue.js
  function UnicodeExtensionValue(extension, key) {
    invariant(key.length === 2, "key must have 2 elements");
    var size = extension.length;
    var searchValue = "-" + key + "-";
    var pos = extension.indexOf(searchValue);
    if (pos !== -1) {
      var start = pos + 4;
      var end = start;
      var k = start;
      var done = false;
      while (!done) {
        var e = extension.indexOf("-", k);
        var len = void 0;
        if (e === -1) {
          len = size - k;
        } else {
          len = e - k;
        }
        if (len === 2) {
          done = true;
        } else if (e === -1) {
          end = size;
          done = true;
        } else {
          end = e;
          k = e + 1;
        }
      }
      return extension.slice(start, end);
    }
    searchValue = "-" + key;
    pos = extension.indexOf(searchValue);
    if (pos !== -1 && pos + 3 === size) {
      return "";
    }
    return void 0;
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/ResolveLocale.js
  function ResolveLocale(availableLocales, requestedLocales, options, relevantExtensionKeys, localeData, getDefaultLocale) {
    var matcher = options.localeMatcher;
    var r;
    if (matcher === "lookup") {
      r = LookupMatcher(availableLocales, requestedLocales, getDefaultLocale);
    } else {
      r = BestFitMatcher(availableLocales, requestedLocales, getDefaultLocale);
    }
    var foundLocale = r.locale;
    var result = {locale: "", dataLocale: foundLocale};
    var supportedExtension = "-u";
    for (var _i = 0, relevantExtensionKeys_1 = relevantExtensionKeys; _i < relevantExtensionKeys_1.length; _i++) {
      var key = relevantExtensionKeys_1[_i];
      invariant(foundLocale in localeData, "Missing locale data for " + foundLocale);
      var foundLocaleData = localeData[foundLocale];
      invariant(typeof foundLocaleData === "object" && foundLocaleData !== null, "locale data " + key + " must be an object");
      var keyLocaleData = foundLocaleData[key];
      invariant(Array.isArray(keyLocaleData), "keyLocaleData for " + key + " must be an array");
      var value = keyLocaleData[0];
      invariant(typeof value === "string" || value === null, "value must be string or null but got " + typeof value + " in key " + key);
      var supportedExtensionAddition = "";
      if (r.extension) {
        var requestedValue = UnicodeExtensionValue(r.extension, key);
        if (requestedValue !== void 0) {
          if (requestedValue !== "") {
            if (~keyLocaleData.indexOf(requestedValue)) {
              value = requestedValue;
              supportedExtensionAddition = "-" + key + "-" + value;
            }
          } else if (~requestedValue.indexOf("true")) {
            value = "true";
            supportedExtensionAddition = "-" + key;
          }
        }
      }
      if (key in options) {
        var optionsValue = options[key];
        invariant(typeof optionsValue === "string" || typeof optionsValue === "undefined" || optionsValue === null, "optionsValue must be String, Undefined or Null");
        if (~keyLocaleData.indexOf(optionsValue)) {
          if (optionsValue !== value) {
            value = optionsValue;
            supportedExtensionAddition = "";
          }
        }
      }
      result[key] = value;
      supportedExtension += supportedExtensionAddition;
    }
    if (supportedExtension.length > 2) {
      var privateIndex = foundLocale.indexOf("-x-");
      if (privateIndex === -1) {
        foundLocale = foundLocale + supportedExtension;
      } else {
        var preExtension = foundLocale.slice(0, privateIndex);
        var postExtension = foundLocale.slice(privateIndex, foundLocale.length);
        foundLocale = preExtension + supportedExtension + postExtension;
      }
      foundLocale = Intl.getCanonicalLocales(foundLocale)[0];
    }
    result.locale = foundLocale;
    return result;
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/DefaultNumberOption.js
  function DefaultNumberOption(val, min, max, fallback) {
    if (val !== void 0) {
      val = Number(val);
      if (isNaN(val) || val < min || val > max) {
        throw new RangeError(val + " is outside of range [" + min + ", " + max + "]");
      }
      return Math.floor(val);
    }
    return fallback;
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/GetNumberOption.js
  function GetNumberOption(options, property, minimum, maximum, fallback) {
    var val = options[property];
    return DefaultNumberOption(val, minimum, maximum, fallback);
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/IsWellFormedCurrencyCode.js
  function toUpperCase(str) {
    return str.replace(/([a-z])/g, function(_, c) {
      return c.toUpperCase();
    });
  }
  var NOT_A_Z_REGEX = /[^A-Z]/;
  function IsWellFormedCurrencyCode(currency) {
    currency = toUpperCase(currency);
    if (currency.length !== 3) {
      return false;
    }
    if (NOT_A_Z_REGEX.test(currency)) {
      return false;
    }
    return true;
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/IsSanctionedSimpleUnitIdentifier.js
  var SANCTIONED_UNITS = [
    "angle-degree",
    "area-acre",
    "area-hectare",
    "concentr-percent",
    "digital-bit",
    "digital-byte",
    "digital-gigabit",
    "digital-gigabyte",
    "digital-kilobit",
    "digital-kilobyte",
    "digital-megabit",
    "digital-megabyte",
    "digital-petabyte",
    "digital-terabit",
    "digital-terabyte",
    "duration-day",
    "duration-hour",
    "duration-millisecond",
    "duration-minute",
    "duration-month",
    "duration-second",
    "duration-week",
    "duration-year",
    "length-centimeter",
    "length-foot",
    "length-inch",
    "length-kilometer",
    "length-meter",
    "length-mile-scandinavian",
    "length-mile",
    "length-millimeter",
    "length-yard",
    "mass-gram",
    "mass-kilogram",
    "mass-ounce",
    "mass-pound",
    "mass-stone",
    "temperature-celsius",
    "temperature-fahrenheit",
    "volume-fluid-ounce",
    "volume-gallon",
    "volume-liter",
    "volume-milliliter"
  ];
  function removeUnitNamespace(unit) {
    return unit.slice(unit.indexOf("-") + 1);
  }
  var SIMPLE_UNITS = SANCTIONED_UNITS.map(removeUnitNamespace);
  function IsSanctionedSimpleUnitIdentifier(unitIdentifier) {
    return SIMPLE_UNITS.indexOf(unitIdentifier) > -1;
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/IsWellFormedUnitIdentifier.js
  function toLowerCase(str) {
    return str.replace(/([A-Z])/g, function(_, c) {
      return c.toLowerCase();
    });
  }
  function IsWellFormedUnitIdentifier(unit) {
    unit = toLowerCase(unit);
    if (IsSanctionedSimpleUnitIdentifier(unit)) {
      return true;
    }
    var units = unit.split("-per-");
    if (units.length !== 2) {
      return false;
    }
    var numerator = units[0], denominator = units[1];
    if (!IsSanctionedSimpleUnitIdentifier(numerator) || !IsSanctionedSimpleUnitIdentifier(denominator)) {
      return false;
    }
    return true;
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/NumberFormat/ComputeExponentForMagnitude.js
  function ComputeExponentForMagnitude(numberFormat, magnitude, _a) {
    var getInternalSlots2 = _a.getInternalSlots;
    var internalSlots = getInternalSlots2(numberFormat);
    var notation = internalSlots.notation, dataLocaleData = internalSlots.dataLocaleData, numberingSystem = internalSlots.numberingSystem;
    switch (notation) {
      case "standard":
        return 0;
      case "scientific":
        return magnitude;
      case "engineering":
        return Math.floor(magnitude / 3) * 3;
      default: {
        var compactDisplay = internalSlots.compactDisplay, style = internalSlots.style, currencyDisplay = internalSlots.currencyDisplay;
        var thresholdMap = void 0;
        if (style === "currency" && currencyDisplay !== "name") {
          var currency = dataLocaleData.numbers.currency[numberingSystem] || dataLocaleData.numbers.currency[dataLocaleData.numbers.nu[0]];
          thresholdMap = currency.short;
        } else {
          var decimal = dataLocaleData.numbers.decimal[numberingSystem] || dataLocaleData.numbers.decimal[dataLocaleData.numbers.nu[0]];
          thresholdMap = compactDisplay === "long" ? decimal.long : decimal.short;
        }
        if (!thresholdMap) {
          return 0;
        }
        var num = String(Math.pow(10, magnitude));
        var thresholds = Object.keys(thresholdMap);
        if (num < thresholds[0]) {
          return 0;
        }
        if (num > thresholds[thresholds.length - 1]) {
          return thresholds[thresholds.length - 1].length - 1;
        }
        var i = thresholds.indexOf(num);
        if (i === -1) {
          return 0;
        }
        var magnitudeKey = thresholds[i];
        var compactPattern = thresholdMap[magnitudeKey].other;
        if (compactPattern === "0") {
          return 0;
        }
        return magnitudeKey.length - thresholdMap[magnitudeKey].other.match(/0+/)[0].length;
      }
    }
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/NumberFormat/ToRawPrecision.js
  function ToRawPrecision(x, minPrecision, maxPrecision) {
    var p = maxPrecision;
    var m;
    var e;
    var xFinal;
    if (x === 0) {
      m = repeat("0", p);
      e = 0;
      xFinal = 0;
    } else {
      var xToString = x.toString();
      var xToStringExponentIndex = xToString.indexOf("e");
      var _a = xToString.split("e"), xToStringMantissa = _a[0], xToStringExponent = _a[1];
      var xToStringMantissaWithoutDecimalPoint = xToStringMantissa.replace(".", "");
      if (xToStringExponentIndex >= 0 && xToStringMantissaWithoutDecimalPoint.length <= p) {
        e = +xToStringExponent;
        m = xToStringMantissaWithoutDecimalPoint + repeat("0", p - xToStringMantissaWithoutDecimalPoint.length);
        xFinal = x;
      } else {
        e = getMagnitude(x);
        var decimalPlaceOffset = e - p + 1;
        var n = Math.round(adjustDecimalPlace(x, decimalPlaceOffset));
        if (adjustDecimalPlace(n, p - 1) >= 10) {
          e = e + 1;
          n = Math.floor(n / 10);
        }
        m = n.toString();
        xFinal = adjustDecimalPlace(n, p - 1 - e);
      }
    }
    var int;
    if (e >= p - 1) {
      m = m + repeat("0", e - p + 1);
      int = e + 1;
    } else if (e >= 0) {
      m = m.slice(0, e + 1) + "." + m.slice(e + 1);
      int = e + 1;
    } else {
      m = "0." + repeat("0", -e - 1) + m;
      int = 1;
    }
    if (m.indexOf(".") >= 0 && maxPrecision > minPrecision) {
      var cut = maxPrecision - minPrecision;
      while (cut > 0 && m[m.length - 1] === "0") {
        m = m.slice(0, -1);
        cut--;
      }
      if (m[m.length - 1] === ".") {
        m = m.slice(0, -1);
      }
    }
    return {formattedString: m, roundedNumber: xFinal, integerDigitsCount: int};
    function adjustDecimalPlace(x2, magnitude) {
      return magnitude < 0 ? x2 * Math.pow(10, -magnitude) : x2 / Math.pow(10, magnitude);
    }
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/NumberFormat/ToRawFixed.js
  function ToRawFixed(x, minFraction, maxFraction) {
    var f = maxFraction;
    var n = Math.round(x * Math.pow(10, f));
    var xFinal = n / Math.pow(10, f);
    var m;
    if (n < 1e21) {
      m = n.toString();
    } else {
      m = n.toString();
      var _a = m.split("e"), mantissa = _a[0], exponent = _a[1];
      m = mantissa.replace(".", "");
      m = m + repeat("0", Math.max(+exponent - m.length + 1, 0));
    }
    var int;
    if (f !== 0) {
      var k = m.length;
      if (k <= f) {
        var z = repeat("0", f + 1 - k);
        m = z + m;
        k = f + 1;
      }
      var a = m.slice(0, k - f);
      var b = m.slice(k - f);
      m = a + "." + b;
      int = a.length;
    } else {
      int = m.length;
    }
    var cut = maxFraction - minFraction;
    while (cut > 0 && m[m.length - 1] === "0") {
      m = m.slice(0, -1);
      cut--;
    }
    if (m[m.length - 1] === ".") {
      m = m.slice(0, -1);
    }
    return {formattedString: m, roundedNumber: xFinal, integerDigitsCount: int};
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/NumberFormat/FormatNumericToString.js
  function FormatNumericToString(intlObject, x) {
    var isNegative = x < 0 || SameValue(x, -0);
    if (isNegative) {
      x = -x;
    }
    var result;
    var rourndingType = intlObject.roundingType;
    switch (rourndingType) {
      case "significantDigits":
        result = ToRawPrecision(x, intlObject.minimumSignificantDigits, intlObject.maximumSignificantDigits);
        break;
      case "fractionDigits":
        result = ToRawFixed(x, intlObject.minimumFractionDigits, intlObject.maximumFractionDigits);
        break;
      default:
        result = ToRawPrecision(x, 1, 2);
        if (result.integerDigitsCount > 1) {
          result = ToRawFixed(x, 0, 0);
        }
        break;
    }
    x = result.roundedNumber;
    var string = result.formattedString;
    var int = result.integerDigitsCount;
    var minInteger = intlObject.minimumIntegerDigits;
    if (int < minInteger) {
      var forwardZeros = repeat("0", minInteger - int);
      string = forwardZeros + string;
    }
    if (isNegative) {
      x = -x;
    }
    return {roundedNumber: x, formattedString: string};
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/NumberFormat/ComputeExponent.js
  function ComputeExponent(numberFormat, x, _a) {
    var getInternalSlots2 = _a.getInternalSlots;
    if (x === 0) {
      return [0, 0];
    }
    if (x < 0) {
      x = -x;
    }
    var magnitude = getMagnitude(x);
    var exponent = ComputeExponentForMagnitude(numberFormat, magnitude, {
      getInternalSlots: getInternalSlots2
    });
    x = exponent < 0 ? x * Math.pow(10, -exponent) : x / Math.pow(10, exponent);
    var formatNumberResult = FormatNumericToString(getInternalSlots2(numberFormat), x);
    if (formatNumberResult.roundedNumber === 0) {
      return [exponent, magnitude];
    }
    var newMagnitude = getMagnitude(formatNumberResult.roundedNumber);
    if (newMagnitude === magnitude - exponent) {
      return [exponent, magnitude];
    }
    return [
      ComputeExponentForMagnitude(numberFormat, magnitude + 1, {
        getInternalSlots: getInternalSlots2
      }),
      magnitude + 1
    ];
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/NumberFormat/CurrencyDigits.js
  function CurrencyDigits(c, _a) {
    var currencyDigitsData = _a.currencyDigitsData;
    return HasOwnProperty(currencyDigitsData, c) ? currencyDigitsData[c] : 2;
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/NumberFormat/digit-mapping.json
  var digit_mapping_exports = {};
  __export(digit_mapping_exports, {
    adlm: function() {
      return adlm;
    },
    ahom: function() {
      return ahom;
    },
    arab: function() {
      return arab;
    },
    arabext: function() {
      return arabext;
    },
    bali: function() {
      return bali;
    },
    beng: function() {
      return beng;
    },
    bhks: function() {
      return bhks;
    },
    brah: function() {
      return brah;
    },
    cakm: function() {
      return cakm;
    },
    cham: function() {
      return cham;
    },
    default: function() {
      return digit_mapping_default;
    },
    deva: function() {
      return deva;
    },
    diak: function() {
      return diak;
    },
    fullwide: function() {
      return fullwide;
    },
    gong: function() {
      return gong;
    },
    gonm: function() {
      return gonm;
    },
    gujr: function() {
      return gujr;
    },
    guru: function() {
      return guru;
    },
    hanidec: function() {
      return hanidec;
    },
    hmng: function() {
      return hmng;
    },
    hmnp: function() {
      return hmnp;
    },
    java: function() {
      return java;
    },
    kali: function() {
      return kali;
    },
    khmr: function() {
      return khmr;
    },
    knda: function() {
      return knda;
    },
    lana: function() {
      return lana;
    },
    lanatham: function() {
      return lanatham;
    },
    laoo: function() {
      return laoo;
    },
    lepc: function() {
      return lepc;
    },
    limb: function() {
      return limb;
    },
    mathbold: function() {
      return mathbold;
    },
    mathdbl: function() {
      return mathdbl;
    },
    mathmono: function() {
      return mathmono;
    },
    mathsanb: function() {
      return mathsanb;
    },
    mathsans: function() {
      return mathsans;
    },
    mlym: function() {
      return mlym;
    },
    modi: function() {
      return modi;
    },
    mong: function() {
      return mong;
    },
    mroo: function() {
      return mroo;
    },
    mtei: function() {
      return mtei;
    },
    mymr: function() {
      return mymr;
    },
    mymrshan: function() {
      return mymrshan;
    },
    mymrtlng: function() {
      return mymrtlng;
    },
    newa: function() {
      return newa;
    },
    nkoo: function() {
      return nkoo;
    },
    olck: function() {
      return olck;
    },
    orya: function() {
      return orya;
    },
    osma: function() {
      return osma;
    },
    rohg: function() {
      return rohg;
    },
    saur: function() {
      return saur;
    },
    segment: function() {
      return segment;
    },
    shrd: function() {
      return shrd;
    },
    sind: function() {
      return sind;
    },
    sinh: function() {
      return sinh;
    },
    sora: function() {
      return sora;
    },
    sund: function() {
      return sund;
    },
    takr: function() {
      return takr;
    },
    talu: function() {
      return talu;
    },
    tamldec: function() {
      return tamldec;
    },
    telu: function() {
      return telu;
    },
    thai: function() {
      return thai;
    },
    tibt: function() {
      return tibt;
    },
    tirh: function() {
      return tirh;
    },
    vaii: function() {
      return vaii;
    },
    wara: function() {
      return wara;
    },
    wcho: function() {
      return wcho;
    }
  });
  var adlm = ["\uD83A\uDD50", "\uD83A\uDD51", "\uD83A\uDD52", "\uD83A\uDD53", "\uD83A\uDD54", "\uD83A\uDD55", "\uD83A\uDD56", "\uD83A\uDD57", "\uD83A\uDD58", "\uD83A\uDD59"];
  var ahom = ["\uD805\uDF30", "\uD805\uDF31", "\uD805\uDF32", "\uD805\uDF33", "\uD805\uDF34", "\uD805\uDF35", "\uD805\uDF36", "\uD805\uDF37", "\uD805\uDF38", "\uD805\uDF39"];
  var arab = ["\u0660", "\u0661", "\u0662", "\u0663", "\u0664", "\u0665", "\u0666", "\u0667", "\u0668", "\u0669"];
  var arabext = ["\u06F0", "\u06F1", "\u06F2", "\u06F3", "\u06F4", "\u06F5", "\u06F6", "\u06F7", "\u06F8", "\u06F9"];
  var bali = ["\u1B50", "\u1B51", "\u1B52", "\u1B53", "\u1B54", "\u1B55", "\u1B56", "\u1B57", "\u1B58", "\u1B59"];
  var beng = ["\u09E6", "\u09E7", "\u09E8", "\u09E9", "\u09EA", "\u09EB", "\u09EC", "\u09ED", "\u09EE", "\u09EF"];
  var bhks = ["\uD807\uDC50", "\uD807\uDC51", "\uD807\uDC52", "\uD807\uDC53", "\uD807\uDC54", "\uD807\uDC55", "\uD807\uDC56", "\uD807\uDC57", "\uD807\uDC58", "\uD807\uDC59"];
  var brah = ["\uD804\uDC66", "\uD804\uDC67", "\uD804\uDC68", "\uD804\uDC69", "\uD804\uDC6A", "\uD804\uDC6B", "\uD804\uDC6C", "\uD804\uDC6D", "\uD804\uDC6E", "\uD804\uDC6F"];
  var cakm = ["\uD804\uDD36", "\uD804\uDD37", "\uD804\uDD38", "\uD804\uDD39", "\uD804\uDD3A", "\uD804\uDD3B", "\uD804\uDD3C", "\uD804\uDD3D", "\uD804\uDD3E", "\uD804\uDD3F"];
  var cham = ["\uAA50", "\uAA51", "\uAA52", "\uAA53", "\uAA54", "\uAA55", "\uAA56", "\uAA57", "\uAA58", "\uAA59"];
  var deva = ["\u0966", "\u0967", "\u0968", "\u0969", "\u096A", "\u096B", "\u096C", "\u096D", "\u096E", "\u096F"];
  var diak = ["\uD806\uDD50", "\uD806\uDD51", "\uD806\uDD52", "\uD806\uDD53", "\uD806\uDD54", "\uD806\uDD55", "\uD806\uDD56", "\uD806\uDD57", "\uD806\uDD58", "\uD806\uDD59"];
  var fullwide = ["\uFF10", "\uFF11", "\uFF12", "\uFF13", "\uFF14", "\uFF15", "\uFF16", "\uFF17", "\uFF18", "\uFF19"];
  var gong = ["\uD807\uDDA0", "\uD807\uDDA1", "\uD807\uDDA2", "\uD807\uDDA3", "\uD807\uDDA4", "\uD807\uDDA5", "\uD807\uDDA6", "\uD807\uDDA7", "\uD807\uDDA8", "\uD807\uDDA9"];
  var gonm = ["\uD807\uDD50", "\uD807\uDD51", "\uD807\uDD52", "\uD807\uDD53", "\uD807\uDD54", "\uD807\uDD55", "\uD807\uDD56", "\uD807\uDD57", "\uD807\uDD58", "\uD807\uDD59"];
  var gujr = ["\u0AE6", "\u0AE7", "\u0AE8", "\u0AE9", "\u0AEA", "\u0AEB", "\u0AEC", "\u0AED", "\u0AEE", "\u0AEF"];
  var guru = ["\u0A66", "\u0A67", "\u0A68", "\u0A69", "\u0A6A", "\u0A6B", "\u0A6C", "\u0A6D", "\u0A6E", "\u0A6F"];
  var hanidec = ["\u3007", "\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D", "\u4E03", "\u516B", "\u4E5D"];
  var hmng = ["\uD81A\uDF50", "\uD81A\uDF51", "\uD81A\uDF52", "\uD81A\uDF53", "\uD81A\uDF54", "\uD81A\uDF55", "\uD81A\uDF56", "\uD81A\uDF57", "\uD81A\uDF58", "\uD81A\uDF59"];
  var hmnp = ["\uD838\uDD40", "\uD838\uDD41", "\uD838\uDD42", "\uD838\uDD43", "\uD838\uDD44", "\uD838\uDD45", "\uD838\uDD46", "\uD838\uDD47", "\uD838\uDD48", "\uD838\uDD49"];
  var java = ["\uA9D0", "\uA9D1", "\uA9D2", "\uA9D3", "\uA9D4", "\uA9D5", "\uA9D6", "\uA9D7", "\uA9D8", "\uA9D9"];
  var kali = ["\uA900", "\uA901", "\uA902", "\uA903", "\uA904", "\uA905", "\uA906", "\uA907", "\uA908", "\uA909"];
  var khmr = ["\u17E0", "\u17E1", "\u17E2", "\u17E3", "\u17E4", "\u17E5", "\u17E6", "\u17E7", "\u17E8", "\u17E9"];
  var knda = ["\u0CE6", "\u0CE7", "\u0CE8", "\u0CE9", "\u0CEA", "\u0CEB", "\u0CEC", "\u0CED", "\u0CEE", "\u0CEF"];
  var lana = ["\u1A80", "\u1A81", "\u1A82", "\u1A83", "\u1A84", "\u1A85", "\u1A86", "\u1A87", "\u1A88", "\u1A89"];
  var lanatham = ["\u1A90", "\u1A91", "\u1A92", "\u1A93", "\u1A94", "\u1A95", "\u1A96", "\u1A97", "\u1A98", "\u1A99"];
  var laoo = ["\u0ED0", "\u0ED1", "\u0ED2", "\u0ED3", "\u0ED4", "\u0ED5", "\u0ED6", "\u0ED7", "\u0ED8", "\u0ED9"];
  var lepc = ["\u1A90", "\u1A91", "\u1A92", "\u1A93", "\u1A94", "\u1A95", "\u1A96", "\u1A97", "\u1A98", "\u1A99"];
  var limb = ["\u1946", "\u1947", "\u1948", "\u1949", "\u194A", "\u194B", "\u194C", "\u194D", "\u194E", "\u194F"];
  var mathbold = ["\uD835\uDFCE", "\uD835\uDFCF", "\uD835\uDFD0", "\uD835\uDFD1", "\uD835\uDFD2", "\uD835\uDFD3", "\uD835\uDFD4", "\uD835\uDFD5", "\uD835\uDFD6", "\uD835\uDFD7"];
  var mathdbl = ["\uD835\uDFD8", "\uD835\uDFD9", "\uD835\uDFDA", "\uD835\uDFDB", "\uD835\uDFDC", "\uD835\uDFDD", "\uD835\uDFDE", "\uD835\uDFDF", "\uD835\uDFE0", "\uD835\uDFE1"];
  var mathmono = ["\uD835\uDFF6", "\uD835\uDFF7", "\uD835\uDFF8", "\uD835\uDFF9", "\uD835\uDFFA", "\uD835\uDFFB", "\uD835\uDFFC", "\uD835\uDFFD", "\uD835\uDFFE", "\uD835\uDFFF"];
  var mathsanb = ["\uD835\uDFEC", "\uD835\uDFED", "\uD835\uDFEE", "\uD835\uDFEF", "\uD835\uDFF0", "\uD835\uDFF1", "\uD835\uDFF2", "\uD835\uDFF3", "\uD835\uDFF4", "\uD835\uDFF5"];
  var mathsans = ["\uD835\uDFE2", "\uD835\uDFE3", "\uD835\uDFE4", "\uD835\uDFE5", "\uD835\uDFE6", "\uD835\uDFE7", "\uD835\uDFE8", "\uD835\uDFE9", "\uD835\uDFEA", "\uD835\uDFEB"];
  var mlym = ["\u0D66", "\u0D67", "\u0D68", "\u0D69", "\u0D6A", "\u0D6B", "\u0D6C", "\u0D6D", "\u0D6E", "\u0D6F"];
  var modi = ["\uD805\uDE50", "\uD805\uDE51", "\uD805\uDE52", "\uD805\uDE53", "\uD805\uDE54", "\uD805\uDE55", "\uD805\uDE56", "\uD805\uDE57", "\uD805\uDE58", "\uD805\uDE59"];
  var mong = ["\u1810", "\u1811", "\u1812", "\u1813", "\u1814", "\u1815", "\u1816", "\u1817", "\u1818", "\u1819"];
  var mroo = ["\uD81A\uDE60", "\uD81A\uDE61", "\uD81A\uDE62", "\uD81A\uDE63", "\uD81A\uDE64", "\uD81A\uDE65", "\uD81A\uDE66", "\uD81A\uDE67", "\uD81A\uDE68", "\uD81A\uDE69"];
  var mtei = ["\uABF0", "\uABF1", "\uABF2", "\uABF3", "\uABF4", "\uABF5", "\uABF6", "\uABF7", "\uABF8", "\uABF9"];
  var mymr = ["\u1040", "\u1041", "\u1042", "\u1043", "\u1044", "\u1045", "\u1046", "\u1047", "\u1048", "\u1049"];
  var mymrshan = ["\u1090", "\u1091", "\u1092", "\u1093", "\u1094", "\u1095", "\u1096", "\u1097", "\u1098", "\u1099"];
  var mymrtlng = ["\uA9F0", "\uA9F1", "\uA9F2", "\uA9F3", "\uA9F4", "\uA9F5", "\uA9F6", "\uA9F7", "\uA9F8", "\uA9F9"];
  var newa = ["\uD805\uDC50", "\uD805\uDC51", "\uD805\uDC52", "\uD805\uDC53", "\uD805\uDC54", "\uD805\uDC55", "\uD805\uDC56", "\uD805\uDC57", "\uD805\uDC58", "\uD805\uDC59"];
  var nkoo = ["\u07C0", "\u07C1", "\u07C2", "\u07C3", "\u07C4", "\u07C5", "\u07C6", "\u07C7", "\u07C8", "\u07C9"];
  var olck = ["\u1C50", "\u1C51", "\u1C52", "\u1C53", "\u1C54", "\u1C55", "\u1C56", "\u1C57", "\u1C58", "\u1C59"];
  var orya = ["\u0B66", "\u0B67", "\u0B68", "\u0B69", "\u0B6A", "\u0B6B", "\u0B6C", "\u0B6D", "\u0B6E", "\u0B6F"];
  var osma = ["\uD801\uDCA0", "\uD801\uDCA1", "\uD801\uDCA2", "\uD801\uDCA3", "\uD801\uDCA4", "\uD801\uDCA5", "\uD801\uDCA6", "\uD801\uDCA7", "\uD801\uDCA8", "\uD801\uDCA9"];
  var rohg = ["\uD803\uDD30", "\uD803\uDD31", "\uD803\uDD32", "\uD803\uDD33", "\uD803\uDD34", "\uD803\uDD35", "\uD803\uDD36", "\uD803\uDD37", "\uD803\uDD38", "\uD803\uDD39"];
  var saur = ["\uA8D0", "\uA8D1", "\uA8D2", "\uA8D3", "\uA8D4", "\uA8D5", "\uA8D6", "\uA8D7", "\uA8D8", "\uA8D9"];
  var segment = ["\uD83E\uDFF0", "\uD83E\uDFF1", "\uD83E\uDFF2", "\uD83E\uDFF3", "\uD83E\uDFF4", "\uD83E\uDFF5", "\uD83E\uDFF6", "\uD83E\uDFF7", "\uD83E\uDFF8", "\uD83E\uDFF9"];
  var shrd = ["\uD804\uDDD0", "\uD804\uDDD1", "\uD804\uDDD2", "\uD804\uDDD3", "\uD804\uDDD4", "\uD804\uDDD5", "\uD804\uDDD6", "\uD804\uDDD7", "\uD804\uDDD8", "\uD804\uDDD9"];
  var sind = ["\uD804\uDEF0", "\uD804\uDEF1", "\uD804\uDEF2", "\uD804\uDEF3", "\uD804\uDEF4", "\uD804\uDEF5", "\uD804\uDEF6", "\uD804\uDEF7", "\uD804\uDEF8", "\uD804\uDEF9"];
  var sinh = ["\u0DE6", "\u0DE7", "\u0DE8", "\u0DE9", "\u0DEA", "\u0DEB", "\u0DEC", "\u0DED", "\u0DEE", "\u0DEF"];
  var sora = ["\uD804\uDCF0", "\uD804\uDCF1", "\uD804\uDCF2", "\uD804\uDCF3", "\uD804\uDCF4", "\uD804\uDCF5", "\uD804\uDCF6", "\uD804\uDCF7", "\uD804\uDCF8", "\uD804\uDCF9"];
  var sund = ["\u1BB0", "\u1BB1", "\u1BB2", "\u1BB3", "\u1BB4", "\u1BB5", "\u1BB6", "\u1BB7", "\u1BB8", "\u1BB9"];
  var takr = ["\uD805\uDEC0", "\uD805\uDEC1", "\uD805\uDEC2", "\uD805\uDEC3", "\uD805\uDEC4", "\uD805\uDEC5", "\uD805\uDEC6", "\uD805\uDEC7", "\uD805\uDEC8", "\uD805\uDEC9"];
  var talu = ["\u19D0", "\u19D1", "\u19D2", "\u19D3", "\u19D4", "\u19D5", "\u19D6", "\u19D7", "\u19D8", "\u19D9"];
  var tamldec = ["\u0BE6", "\u0BE7", "\u0BE8", "\u0BE9", "\u0BEA", "\u0BEB", "\u0BEC", "\u0BED", "\u0BEE", "\u0BEF"];
  var telu = ["\u0C66", "\u0C67", "\u0C68", "\u0C69", "\u0C6A", "\u0C6B", "\u0C6C", "\u0C6D", "\u0C6E", "\u0C6F"];
  var thai = ["\u0E50", "\u0E51", "\u0E52", "\u0E53", "\u0E54", "\u0E55", "\u0E56", "\u0E57", "\u0E58", "\u0E59"];
  var tibt = ["\u0F20", "\u0F21", "\u0F22", "\u0F23", "\u0F24", "\u0F25", "\u0F26", "\u0F27", "\u0F28", "\u0F29"];
  var tirh = ["\uD805\uDCD0", "\uD805\uDCD1", "\uD805\uDCD2", "\uD805\uDCD3", "\uD805\uDCD4", "\uD805\uDCD5", "\uD805\uDCD6", "\uD805\uDCD7", "\uD805\uDCD8", "\uD805\uDCD9"];
  var vaii = ["\u1620", "\u1621", "\u1622", "\u1623", "\u1624", "\u1625", "\u1626", "\u1627", "\u1628", "\u1629"];
  var wara = ["\uD806\uDCE0", "\uD806\uDCE1", "\uD806\uDCE2", "\uD806\uDCE3", "\uD806\uDCE4", "\uD806\uDCE5", "\uD806\uDCE6", "\uD806\uDCE7", "\uD806\uDCE8", "\uD806\uDCE9"];
  var wcho = ["\uD838\uDEF0", "\uD838\uDEF1", "\uD838\uDEF2", "\uD838\uDEF3", "\uD838\uDEF4", "\uD838\uDEF5", "\uD838\uDEF6", "\uD838\uDEF7", "\uD838\uDEF8", "\uD838\uDEF9"];
  var digit_mapping_default = {adlm: adlm, ahom: ahom, arab: arab, arabext: arabext, bali: bali, beng: beng, bhks: bhks, brah: brah, cakm: cakm, cham: cham, deva: deva, diak: diak, fullwide: fullwide, gong: gong, gonm: gonm, gujr: gujr, guru: guru, hanidec: hanidec, hmng: hmng, hmnp: hmnp, java: java, kali: kali, khmr: khmr, knda: knda, lana: lana, lanatham: lanatham, laoo: laoo, lepc: lepc, limb: limb, mathbold: mathbold, mathdbl: mathdbl, mathmono: mathmono, mathsanb: mathsanb, mathsans: mathsans, mlym: mlym, modi: modi, mong: mong, mroo: mroo, mtei: mtei, mymr: mymr, mymrshan: mymrshan, mymrtlng: mymrtlng, newa: newa, nkoo: nkoo, olck: olck, orya: orya, osma: osma, rohg: rohg, saur: saur, segment: segment, shrd: shrd, sind: sind, sinh: sinh, sora: sora, sund: sund, takr: takr, talu: talu, tamldec: tamldec, telu: telu, thai: thai, tibt: tibt, tirh: tirh, vaii: vaii, wara: wara, wcho: wcho};

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/regex.generated.js
  var S_UNICODE_REGEX = /[\$\+<->\^`\|~\xA2-\xA6\xA8\xA9\xAC\xAE-\xB1\xB4\xB8\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0384\u0385\u03F6\u0482\u058D-\u058F\u0606-\u0608\u060B\u060E\u060F\u06DE\u06E9\u06FD\u06FE\u07F6\u07FE\u07FF\u09F2\u09F3\u09FA\u09FB\u0AF1\u0B70\u0BF3-\u0BFA\u0C7F\u0D4F\u0D79\u0E3F\u0F01-\u0F03\u0F13\u0F15-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE\u0FCF\u0FD5-\u0FD8\u109E\u109F\u1390-\u1399\u166D\u17DB\u1940\u19DE-\u19FF\u1B61-\u1B6A\u1B74-\u1B7C\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2044\u2052\u207A-\u207C\u208A-\u208C\u20A0-\u20BF\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2307\u230C-\u2328\u232B-\u2426\u2440-\u244A\u249C-\u24E9\u2500-\u2767\u2794-\u27C4\u27C7-\u27E5\u27F0-\u2982\u2999-\u29D7\u29DC-\u29FB\u29FE-\u2B73\u2B76-\u2B95\u2B97-\u2BFF\u2CE5-\u2CEA\u2E50\u2E51\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFB\u3004\u3012\u3013\u3020\u3036\u3037\u303E\u303F\u309B\u309C\u3190\u3191\u3196-\u319F\u31C0-\u31E3\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uAA77-\uAA79\uAB5B\uAB6A\uAB6B\uFB29\uFBB2-\uFBC1\uFDFC\uFDFD\uFE62\uFE64-\uFE66\uFE69\uFF04\uFF0B\uFF1C-\uFF1E\uFF3E\uFF40\uFF5C\uFF5E\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD]|\uD800[\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9C\uDDA0\uDDD0-\uDDFC]|\uD802[\uDC77\uDC78\uDEC8]|\uD805\uDF3F|\uD807[\uDFD5-\uDFF1]|\uD81A[\uDF3C-\uDF3F\uDF45]|\uD82F\uDC9C|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDE8\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85\uDE86]|\uD838[\uDD4F\uDEFF]|\uD83B[\uDCAC\uDCB0\uDD2E\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD0D-\uDDAD\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED7\uDEE0-\uDEEC\uDEF0-\uDEFC\uDF00-\uDF73\uDF80-\uDFD8\uDFE0-\uDFEB]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDCB0\uDCB1\uDD00-\uDD78\uDD7A-\uDDCB\uDDCD-\uDE53\uDE60-\uDE6D\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6\uDF00-\uDF92\uDF94-\uDFCA]/;

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/NumberFormat/format_to_parts.js
  var CARET_S_UNICODE_REGEX = new RegExp("^" + S_UNICODE_REGEX.source);
  var S_DOLLAR_UNICODE_REGEX = new RegExp(S_UNICODE_REGEX.source + "$");
  var CLDR_NUMBER_PATTERN = /[#0](?:[\.,][#0]+)*/g;
  function formatToParts(numberResult, data, pl, options) {
    var sign = numberResult.sign, exponent = numberResult.exponent, magnitude = numberResult.magnitude;
    var notation = options.notation, style = options.style, numberingSystem = options.numberingSystem;
    var defaultNumberingSystem = data.numbers.nu[0];
    var compactNumberPattern = null;
    if (notation === "compact" && magnitude) {
      compactNumberPattern = getCompactDisplayPattern(numberResult, pl, data, style, options.compactDisplay, options.currencyDisplay, numberingSystem);
    }
    var nonNameCurrencyPart;
    if (style === "currency" && options.currencyDisplay !== "name") {
      var byCurrencyDisplay = data.currencies[options.currency];
      if (byCurrencyDisplay) {
        switch (options.currencyDisplay) {
          case "code":
            nonNameCurrencyPart = options.currency;
            break;
          case "symbol":
            nonNameCurrencyPart = byCurrencyDisplay.symbol;
            break;
          default:
            nonNameCurrencyPart = byCurrencyDisplay.narrow;
            break;
        }
      } else {
        nonNameCurrencyPart = options.currency;
      }
    }
    var numberPattern;
    if (!compactNumberPattern) {
      if (style === "decimal" || style === "unit" || style === "currency" && options.currencyDisplay === "name") {
        var decimalData = data.numbers.decimal[numberingSystem] || data.numbers.decimal[defaultNumberingSystem];
        numberPattern = getPatternForSign(decimalData.standard, sign);
      } else if (style === "currency") {
        var currencyData = data.numbers.currency[numberingSystem] || data.numbers.currency[defaultNumberingSystem];
        numberPattern = getPatternForSign(currencyData[options.currencySign], sign);
      } else {
        var percentPattern = data.numbers.percent[numberingSystem] || data.numbers.percent[defaultNumberingSystem];
        numberPattern = getPatternForSign(percentPattern, sign);
      }
    } else {
      numberPattern = compactNumberPattern;
    }
    var decimalNumberPattern = CLDR_NUMBER_PATTERN.exec(numberPattern)[0];
    numberPattern = numberPattern.replace(CLDR_NUMBER_PATTERN, "{0}").replace(/'(.)'/g, "$1");
    if (style === "currency" && options.currencyDisplay !== "name") {
      var currencyData = data.numbers.currency[numberingSystem] || data.numbers.currency[defaultNumberingSystem];
      var afterCurrency = currencyData.currencySpacing.afterInsertBetween;
      if (afterCurrency && !S_DOLLAR_UNICODE_REGEX.test(nonNameCurrencyPart)) {
        numberPattern = numberPattern.replace("\xA4{0}", "\xA4" + afterCurrency + "{0}");
      }
      var beforeCurrency = currencyData.currencySpacing.beforeInsertBetween;
      if (beforeCurrency && !CARET_S_UNICODE_REGEX.test(nonNameCurrencyPart)) {
        numberPattern = numberPattern.replace("{0}\xA4", "{0}" + beforeCurrency + "\xA4");
      }
    }
    var numberPatternParts = numberPattern.split(/({c:[^}]+}|\{0\}|[¤%\-\+])/g);
    var numberParts = [];
    var symbols = data.numbers.symbols[numberingSystem] || data.numbers.symbols[defaultNumberingSystem];
    for (var _i = 0, numberPatternParts_1 = numberPatternParts; _i < numberPatternParts_1.length; _i++) {
      var part = numberPatternParts_1[_i];
      if (!part) {
        continue;
      }
      switch (part) {
        case "{0}": {
          numberParts.push.apply(numberParts, paritionNumberIntoParts(symbols, numberResult, notation, exponent, numberingSystem, !compactNumberPattern && options.useGrouping, decimalNumberPattern));
          break;
        }
        case "-":
          numberParts.push({type: "minusSign", value: symbols.minusSign});
          break;
        case "+":
          numberParts.push({type: "plusSign", value: symbols.plusSign});
          break;
        case "%":
          numberParts.push({type: "percentSign", value: symbols.percentSign});
          break;
        case "\xA4":
          numberParts.push({type: "currency", value: nonNameCurrencyPart});
          break;
        default:
          if (/^\{c:/.test(part)) {
            numberParts.push({
              type: "compact",
              value: part.substring(3, part.length - 1)
            });
          } else {
            numberParts.push({type: "literal", value: part});
          }
          break;
      }
    }
    switch (style) {
      case "currency": {
        if (options.currencyDisplay === "name") {
          var unitPattern = (data.numbers.currency[numberingSystem] || data.numbers.currency[defaultNumberingSystem]).unitPattern;
          var unitName = void 0;
          var currencyNameData = data.currencies[options.currency];
          if (currencyNameData) {
            unitName = selectPlural(pl, numberResult.roundedNumber * Math.pow(10, exponent), currencyNameData.displayName);
          } else {
            unitName = options.currency;
          }
          var unitPatternParts = unitPattern.split(/(\{[01]\})/g);
          var result = [];
          for (var _a = 0, unitPatternParts_1 = unitPatternParts; _a < unitPatternParts_1.length; _a++) {
            var part = unitPatternParts_1[_a];
            switch (part) {
              case "{0}":
                result.push.apply(result, numberParts);
                break;
              case "{1}":
                result.push({type: "currency", value: unitName});
                break;
              default:
                if (part) {
                  result.push({type: "literal", value: part});
                }
                break;
            }
          }
          return result;
        } else {
          return numberParts;
        }
      }
      case "unit": {
        var unit = options.unit, unitDisplay = options.unitDisplay;
        var unitData = data.units.simple[unit];
        var unitPattern = void 0;
        if (unitData) {
          unitPattern = selectPlural(pl, numberResult.roundedNumber * Math.pow(10, exponent), data.units.simple[unit][unitDisplay]);
        } else {
          var _b = unit.split("-per-"), numeratorUnit = _b[0], denominatorUnit = _b[1];
          unitData = data.units.simple[numeratorUnit];
          var numeratorUnitPattern = selectPlural(pl, numberResult.roundedNumber * Math.pow(10, exponent), data.units.simple[numeratorUnit][unitDisplay]);
          var perUnitPattern = data.units.simple[denominatorUnit].perUnit[unitDisplay];
          if (perUnitPattern) {
            unitPattern = perUnitPattern.replace("{0}", numeratorUnitPattern);
          } else {
            var perPattern = data.units.compound.per[unitDisplay];
            var denominatorPattern = selectPlural(pl, 1, data.units.simple[denominatorUnit][unitDisplay]);
            unitPattern = unitPattern = perPattern.replace("{0}", numeratorUnitPattern).replace("{1}", denominatorPattern.replace("{0}", ""));
          }
        }
        var result = [];
        for (var _c = 0, _d = unitPattern.split(/(\s*\{0\}\s*)/); _c < _d.length; _c++) {
          var part = _d[_c];
          var interpolateMatch = /^(\s*)\{0\}(\s*)$/.exec(part);
          if (interpolateMatch) {
            if (interpolateMatch[1]) {
              result.push({type: "literal", value: interpolateMatch[1]});
            }
            result.push.apply(result, numberParts);
            if (interpolateMatch[2]) {
              result.push({type: "literal", value: interpolateMatch[2]});
            }
          } else if (part) {
            result.push({type: "unit", value: part});
          }
        }
        return result;
      }
      default:
        return numberParts;
    }
  }
  function paritionNumberIntoParts(symbols, numberResult, notation, exponent, numberingSystem, useGrouping, decimalNumberPattern) {
    var result = [];
    var n = numberResult.formattedString, x = numberResult.roundedNumber;
    if (isNaN(x)) {
      return [{type: "nan", value: n}];
    } else if (!isFinite(x)) {
      return [{type: "infinity", value: n}];
    }
    var digitReplacementTable = digit_mapping_exports[numberingSystem];
    if (digitReplacementTable) {
      n = n.replace(/\d/g, function(digit) {
        return digitReplacementTable[+digit] || digit;
      });
    }
    var decimalSepIndex = n.indexOf(".");
    var integer;
    var fraction;
    if (decimalSepIndex > 0) {
      integer = n.slice(0, decimalSepIndex);
      fraction = n.slice(decimalSepIndex + 1);
    } else {
      integer = n;
    }
    if (useGrouping && (notation !== "compact" || x >= 1e4)) {
      var groupSepSymbol = symbols.group;
      var groups = [];
      var integerNumberPattern = decimalNumberPattern.split(".")[0];
      var patternGroups = integerNumberPattern.split(",");
      var primaryGroupingSize = 3;
      var secondaryGroupingSize = 3;
      if (patternGroups.length > 1) {
        primaryGroupingSize = patternGroups[patternGroups.length - 1].length;
      }
      if (patternGroups.length > 2) {
        secondaryGroupingSize = patternGroups[patternGroups.length - 2].length;
      }
      var i = integer.length - primaryGroupingSize;
      if (i > 0) {
        groups.push(integer.slice(i, i + primaryGroupingSize));
        for (i -= secondaryGroupingSize; i > 0; i -= secondaryGroupingSize) {
          groups.push(integer.slice(i, i + secondaryGroupingSize));
        }
        groups.push(integer.slice(0, i + secondaryGroupingSize));
      } else {
        groups.push(integer);
      }
      while (groups.length > 0) {
        var integerGroup = groups.pop();
        result.push({type: "integer", value: integerGroup});
        if (groups.length > 0) {
          result.push({type: "group", value: groupSepSymbol});
        }
      }
    } else {
      result.push({type: "integer", value: integer});
    }
    if (fraction !== void 0) {
      result.push({type: "decimal", value: symbols.decimal}, {type: "fraction", value: fraction});
    }
    if ((notation === "scientific" || notation === "engineering") && isFinite(x)) {
      result.push({type: "exponentSeparator", value: symbols.exponential});
      if (exponent < 0) {
        result.push({type: "exponentMinusSign", value: symbols.minusSign});
        exponent = -exponent;
      }
      var exponentResult = ToRawFixed(exponent, 0, 0);
      result.push({
        type: "exponentInteger",
        value: exponentResult.formattedString
      });
    }
    return result;
  }
  function getPatternForSign(pattern, sign) {
    if (pattern.indexOf(";") < 0) {
      pattern = pattern + ";-" + pattern;
    }
    var _a = pattern.split(";"), zeroPattern = _a[0], negativePattern = _a[1];
    switch (sign) {
      case 0:
        return zeroPattern;
      case -1:
        return negativePattern;
      default:
        return negativePattern.indexOf("-") >= 0 ? negativePattern.replace(/-/g, "+") : "+" + zeroPattern;
    }
  }
  function getCompactDisplayPattern(numberResult, pl, data, style, compactDisplay, currencyDisplay, numberingSystem) {
    var _a;
    var roundedNumber = numberResult.roundedNumber, sign = numberResult.sign, magnitude = numberResult.magnitude;
    var magnitudeKey = String(Math.pow(10, magnitude));
    var defaultNumberingSystem = data.numbers.nu[0];
    var pattern;
    if (style === "currency" && currencyDisplay !== "name") {
      var byNumberingSystem = data.numbers.currency;
      var currencyData = byNumberingSystem[numberingSystem] || byNumberingSystem[defaultNumberingSystem];
      var compactPluralRules = (_a = currencyData.short) === null || _a === void 0 ? void 0 : _a[magnitudeKey];
      if (!compactPluralRules) {
        return null;
      }
      pattern = selectPlural(pl, roundedNumber, compactPluralRules);
    } else {
      var byNumberingSystem = data.numbers.decimal;
      var byCompactDisplay = byNumberingSystem[numberingSystem] || byNumberingSystem[defaultNumberingSystem];
      var compactPlaralRule = byCompactDisplay[compactDisplay][magnitudeKey];
      if (!compactPlaralRule) {
        return null;
      }
      pattern = selectPlural(pl, roundedNumber, compactPlaralRule);
    }
    if (pattern === "0") {
      return null;
    }
    pattern = getPatternForSign(pattern, sign).replace(/([^\s;\-\+\d¤]+)/g, "{c:$1}").replace(/0+/, "0");
    return pattern;
  }
  function selectPlural(pl, x, rules) {
    return rules[pl.select(x)] || rules.other;
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/NumberFormat/PartitionNumberPattern.js
  function PartitionNumberPattern(numberFormat, x, _a) {
    var _b;
    var getInternalSlots2 = _a.getInternalSlots;
    var internalSlots = getInternalSlots2(numberFormat);
    var pl = internalSlots.pl, dataLocaleData = internalSlots.dataLocaleData, numberingSystem = internalSlots.numberingSystem;
    var symbols = dataLocaleData.numbers.symbols[numberingSystem] || dataLocaleData.numbers.symbols[dataLocaleData.numbers.nu[0]];
    var magnitude = 0;
    var exponent = 0;
    var n;
    if (isNaN(x)) {
      n = symbols.nan;
    } else if (!isFinite(x)) {
      n = symbols.infinity;
    } else {
      if (internalSlots.style === "percent") {
        x *= 100;
      }
      ;
      _b = ComputeExponent(numberFormat, x, {
        getInternalSlots: getInternalSlots2
      }), exponent = _b[0], magnitude = _b[1];
      x = exponent < 0 ? x * Math.pow(10, -exponent) : x / Math.pow(10, exponent);
      var formatNumberResult = FormatNumericToString(internalSlots, x);
      n = formatNumberResult.formattedString;
      x = formatNumberResult.roundedNumber;
    }
    var sign;
    var signDisplay = internalSlots.signDisplay;
    switch (signDisplay) {
      case "never":
        sign = 0;
        break;
      case "auto":
        if (SameValue(x, 0) || x > 0 || isNaN(x)) {
          sign = 0;
        } else {
          sign = -1;
        }
        break;
      case "always":
        if (SameValue(x, 0) || x > 0 || isNaN(x)) {
          sign = 1;
        } else {
          sign = -1;
        }
        break;
      default:
        if (x === 0 || isNaN(x)) {
          sign = 0;
        } else if (x > 0) {
          sign = 1;
        } else {
          sign = -1;
        }
    }
    return formatToParts({roundedNumber: x, formattedString: n, exponent: exponent, magnitude: magnitude, sign: sign}, internalSlots.dataLocaleData, pl, internalSlots);
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/NumberFormat/FormatNumericToParts.js
  function FormatNumericToParts(nf, x, implDetails) {
    var parts = PartitionNumberPattern(nf, x, implDetails);
    var result = ArrayCreate(0);
    for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
      var part = parts_1[_i];
      result.push({
        type: part.type,
        value: part.value
      });
    }
    return result;
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/NumberFormat/SetNumberFormatUnitOptions.js
  function SetNumberFormatUnitOptions(nf, options, _a) {
    if (options === void 0) {
      options = Object.create(null);
    }
    var getInternalSlots2 = _a.getInternalSlots;
    var internalSlots = getInternalSlots2(nf);
    var style = GetOption(options, "style", "string", ["decimal", "percent", "currency", "unit"], "decimal");
    internalSlots.style = style;
    var currency = GetOption(options, "currency", "string", void 0, void 0);
    if (currency !== void 0 && !IsWellFormedCurrencyCode(currency)) {
      throw RangeError("Malformed currency code");
    }
    if (style === "currency" && currency === void 0) {
      throw TypeError("currency cannot be undefined");
    }
    var currencyDisplay = GetOption(options, "currencyDisplay", "string", ["code", "symbol", "narrowSymbol", "name"], "symbol");
    var currencySign = GetOption(options, "currencySign", "string", ["standard", "accounting"], "standard");
    var unit = GetOption(options, "unit", "string", void 0, void 0);
    if (unit !== void 0 && !IsWellFormedUnitIdentifier(unit)) {
      throw RangeError("Invalid unit argument for Intl.NumberFormat()");
    }
    if (style === "unit" && unit === void 0) {
      throw TypeError("unit cannot be undefined");
    }
    var unitDisplay = GetOption(options, "unitDisplay", "string", ["short", "narrow", "long"], "short");
    if (style === "currency") {
      internalSlots.currency = currency.toUpperCase();
      internalSlots.currencyDisplay = currencyDisplay;
      internalSlots.currencySign = currencySign;
    }
    if (style === "unit") {
      internalSlots.unit = unit;
      internalSlots.unitDisplay = unitDisplay;
    }
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/NumberFormat/SetNumberFormatDigitOptions.js
  function SetNumberFormatDigitOptions(internalSlots, opts, mnfdDefault, mxfdDefault, notation) {
    var mnid = GetNumberOption(opts, "minimumIntegerDigits", 1, 21, 1);
    var mnfd = opts.minimumFractionDigits;
    var mxfd = opts.maximumFractionDigits;
    var mnsd = opts.minimumSignificantDigits;
    var mxsd = opts.maximumSignificantDigits;
    internalSlots.minimumIntegerDigits = mnid;
    if (mnsd !== void 0 || mxsd !== void 0) {
      internalSlots.roundingType = "significantDigits";
      mnsd = DefaultNumberOption(mnsd, 1, 21, 1);
      mxsd = DefaultNumberOption(mxsd, mnsd, 21, 21);
      internalSlots.minimumSignificantDigits = mnsd;
      internalSlots.maximumSignificantDigits = mxsd;
    } else if (mnfd !== void 0 || mxfd !== void 0) {
      internalSlots.roundingType = "fractionDigits";
      mnfd = DefaultNumberOption(mnfd, 0, 20, mnfdDefault);
      var mxfdActualDefault = Math.max(mnfd, mxfdDefault);
      mxfd = DefaultNumberOption(mxfd, mnfd, 20, mxfdActualDefault);
      internalSlots.minimumFractionDigits = mnfd;
      internalSlots.maximumFractionDigits = mxfd;
    } else if (notation === "compact") {
      internalSlots.roundingType = "compactRounding";
    } else {
      internalSlots.roundingType = "fractionDigits";
      internalSlots.minimumFractionDigits = mnfdDefault;
      internalSlots.maximumFractionDigits = mxfdDefault;
    }
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/NumberFormat/InitializeNumberFormat.js
  function InitializeNumberFormat(nf, locales, opts, _a) {
    var getInternalSlots2 = _a.getInternalSlots, localeData = _a.localeData, availableLocales = _a.availableLocales, numberingSystemNames2 = _a.numberingSystemNames, getDefaultLocale = _a.getDefaultLocale, currencyDigitsData = _a.currencyDigitsData;
    var requestedLocales = CanonicalizeLocaleList(locales);
    var options = CoerceOptionsToObject(opts);
    var opt = Object.create(null);
    var matcher = GetOption(options, "localeMatcher", "string", ["lookup", "best fit"], "best fit");
    opt.localeMatcher = matcher;
    var numberingSystem = GetOption(options, "numberingSystem", "string", void 0, void 0);
    if (numberingSystem !== void 0 && numberingSystemNames2.indexOf(numberingSystem) < 0) {
      throw RangeError("Invalid numberingSystems: " + numberingSystem);
    }
    opt.nu = numberingSystem;
    var r = ResolveLocale(availableLocales, requestedLocales, opt, ["nu"], localeData, getDefaultLocale);
    var dataLocaleData = localeData[r.dataLocale];
    invariant(!!dataLocaleData, "Missing locale data for " + r.dataLocale);
    var internalSlots = getInternalSlots2(nf);
    internalSlots.locale = r.locale;
    internalSlots.dataLocale = r.dataLocale;
    internalSlots.numberingSystem = r.nu;
    internalSlots.dataLocaleData = dataLocaleData;
    SetNumberFormatUnitOptions(nf, options, {getInternalSlots: getInternalSlots2});
    var style = internalSlots.style;
    var mnfdDefault;
    var mxfdDefault;
    if (style === "currency") {
      var currency = internalSlots.currency;
      var cDigits = CurrencyDigits(currency, {currencyDigitsData: currencyDigitsData});
      mnfdDefault = cDigits;
      mxfdDefault = cDigits;
    } else {
      mnfdDefault = 0;
      mxfdDefault = style === "percent" ? 0 : 3;
    }
    var notation = GetOption(options, "notation", "string", ["standard", "scientific", "engineering", "compact"], "standard");
    internalSlots.notation = notation;
    SetNumberFormatDigitOptions(internalSlots, options, mnfdDefault, mxfdDefault, notation);
    var compactDisplay = GetOption(options, "compactDisplay", "string", ["short", "long"], "short");
    if (notation === "compact") {
      internalSlots.compactDisplay = compactDisplay;
    }
    var useGrouping = GetOption(options, "useGrouping", "boolean", void 0, true);
    internalSlots.useGrouping = useGrouping;
    var signDisplay = GetOption(options, "signDisplay", "string", ["auto", "never", "always", "exceptZero"], "auto");
    internalSlots.signDisplay = signDisplay;
    return nf;
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/LookupSupportedLocales.js
  function LookupSupportedLocales(availableLocales, requestedLocales) {
    var subset = [];
    for (var _i = 0, requestedLocales_1 = requestedLocales; _i < requestedLocales_1.length; _i++) {
      var locale = requestedLocales_1[_i];
      var noExtensionLocale = locale.replace(UNICODE_EXTENSION_SEQUENCE_REGEX, "");
      var availableLocale = BestAvailableLocale(availableLocales, noExtensionLocale);
      if (availableLocale) {
        subset.push(availableLocale);
      }
    }
    return subset;
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/SupportedLocales.js
  function SupportedLocales(availableLocales, requestedLocales, options) {
    var matcher = "best fit";
    if (options !== void 0) {
      options = ToObject(options);
      matcher = GetOption(options, "localeMatcher", "string", ["lookup", "best fit"], "best fit");
    }
    if (matcher === "best fit") {
      return LookupSupportedLocales(availableLocales, requestedLocales);
    }
    return LookupSupportedLocales(availableLocales, requestedLocales);
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/data.js
  var MissingLocaleDataError = function(_super) {
    __extends(MissingLocaleDataError2, _super);
    function MissingLocaleDataError2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.type = "MISSING_LOCALE_DATA";
      return _this;
    }
    return MissingLocaleDataError2;
  }(Error);

  // bazel-out/darwin-fastbuild/bin/packages/intl-numberformat/lib/src/data/currency-digits.json
  var currency_digits_exports = {};
  __export(currency_digits_exports, {
    ADP: function() {
      return ADP;
    },
    AFN: function() {
      return AFN;
    },
    ALL: function() {
      return ALL;
    },
    AMD: function() {
      return AMD;
    },
    BHD: function() {
      return BHD;
    },
    BIF: function() {
      return BIF;
    },
    BYN: function() {
      return BYN;
    },
    BYR: function() {
      return BYR;
    },
    CAD: function() {
      return CAD;
    },
    CHF: function() {
      return CHF;
    },
    CLF: function() {
      return CLF;
    },
    CLP: function() {
      return CLP;
    },
    COP: function() {
      return COP;
    },
    CRC: function() {
      return CRC;
    },
    CZK: function() {
      return CZK;
    },
    DEFAULT: function() {
      return DEFAULT;
    },
    DJF: function() {
      return DJF;
    },
    DKK: function() {
      return DKK;
    },
    ESP: function() {
      return ESP;
    },
    GNF: function() {
      return GNF;
    },
    GYD: function() {
      return GYD;
    },
    HUF: function() {
      return HUF;
    },
    IDR: function() {
      return IDR;
    },
    IQD: function() {
      return IQD;
    },
    IRR: function() {
      return IRR;
    },
    ISK: function() {
      return ISK;
    },
    ITL: function() {
      return ITL;
    },
    JOD: function() {
      return JOD;
    },
    JPY: function() {
      return JPY;
    },
    KMF: function() {
      return KMF;
    },
    KPW: function() {
      return KPW;
    },
    KRW: function() {
      return KRW;
    },
    KWD: function() {
      return KWD;
    },
    LAK: function() {
      return LAK;
    },
    LBP: function() {
      return LBP;
    },
    LUF: function() {
      return LUF;
    },
    LYD: function() {
      return LYD;
    },
    MGA: function() {
      return MGA;
    },
    MGF: function() {
      return MGF;
    },
    MMK: function() {
      return MMK;
    },
    MNT: function() {
      return MNT;
    },
    MRO: function() {
      return MRO;
    },
    MUR: function() {
      return MUR;
    },
    NOK: function() {
      return NOK;
    },
    OMR: function() {
      return OMR;
    },
    PKR: function() {
      return PKR;
    },
    PYG: function() {
      return PYG;
    },
    RSD: function() {
      return RSD;
    },
    RWF: function() {
      return RWF;
    },
    SEK: function() {
      return SEK;
    },
    SLL: function() {
      return SLL;
    },
    SOS: function() {
      return SOS;
    },
    STD: function() {
      return STD;
    },
    SYP: function() {
      return SYP;
    },
    TMM: function() {
      return TMM;
    },
    TND: function() {
      return TND;
    },
    TRL: function() {
      return TRL;
    },
    TWD: function() {
      return TWD;
    },
    TZS: function() {
      return TZS;
    },
    UGX: function() {
      return UGX;
    },
    UYI: function() {
      return UYI;
    },
    UYW: function() {
      return UYW;
    },
    UZS: function() {
      return UZS;
    },
    VEF: function() {
      return VEF;
    },
    VND: function() {
      return VND;
    },
    VUV: function() {
      return VUV;
    },
    XAF: function() {
      return XAF;
    },
    XOF: function() {
      return XOF;
    },
    XPF: function() {
      return XPF;
    },
    YER: function() {
      return YER;
    },
    ZMK: function() {
      return ZMK;
    },
    ZWD: function() {
      return ZWD;
    },
    default: function() {
      return currency_digits_default;
    }
  });
  var ADP = 0;
  var AFN = 0;
  var ALL = 0;
  var AMD = 2;
  var BHD = 3;
  var BIF = 0;
  var BYN = 2;
  var BYR = 0;
  var CAD = 2;
  var CHF = 2;
  var CLF = 4;
  var CLP = 0;
  var COP = 2;
  var CRC = 2;
  var CZK = 2;
  var DEFAULT = 2;
  var DJF = 0;
  var DKK = 2;
  var ESP = 0;
  var GNF = 0;
  var GYD = 2;
  var HUF = 2;
  var IDR = 2;
  var IQD = 0;
  var IRR = 0;
  var ISK = 0;
  var ITL = 0;
  var JOD = 3;
  var JPY = 0;
  var KMF = 0;
  var KPW = 0;
  var KRW = 0;
  var KWD = 3;
  var LAK = 0;
  var LBP = 0;
  var LUF = 0;
  var LYD = 3;
  var MGA = 0;
  var MGF = 0;
  var MMK = 0;
  var MNT = 2;
  var MRO = 0;
  var MUR = 2;
  var NOK = 2;
  var OMR = 3;
  var PKR = 2;
  var PYG = 0;
  var RSD = 0;
  var RWF = 0;
  var SEK = 2;
  var SLL = 0;
  var SOS = 0;
  var STD = 0;
  var SYP = 0;
  var TMM = 0;
  var TND = 3;
  var TRL = 0;
  var TWD = 2;
  var TZS = 2;
  var UGX = 0;
  var UYI = 0;
  var UYW = 4;
  var UZS = 2;
  var VEF = 2;
  var VND = 0;
  var VUV = 0;
  var XAF = 0;
  var XOF = 0;
  var XPF = 0;
  var YER = 0;
  var ZMK = 0;
  var ZWD = 0;
  var currency_digits_default = {ADP: ADP, AFN: AFN, ALL: ALL, AMD: AMD, BHD: BHD, BIF: BIF, BYN: BYN, BYR: BYR, CAD: CAD, CHF: CHF, CLF: CLF, CLP: CLP, COP: COP, CRC: CRC, CZK: CZK, DEFAULT: DEFAULT, DJF: DJF, DKK: DKK, ESP: ESP, GNF: GNF, GYD: GYD, HUF: HUF, IDR: IDR, IQD: IQD, IRR: IRR, ISK: ISK, ITL: ITL, JOD: JOD, JPY: JPY, KMF: KMF, KPW: KPW, KRW: KRW, KWD: KWD, LAK: LAK, LBP: LBP, LUF: LUF, LYD: LYD, MGA: MGA, MGF: MGF, MMK: MMK, MNT: MNT, MRO: MRO, MUR: MUR, NOK: NOK, OMR: OMR, PKR: PKR, PYG: PYG, RSD: RSD, RWF: RWF, SEK: SEK, SLL: SLL, SOS: SOS, STD: STD, SYP: SYP, TMM: TMM, TND: TND, TRL: TRL, TWD: TWD, TZS: TZS, UGX: UGX, UYI: UYI, UYW: UYW, UZS: UZS, VEF: VEF, VND: VND, VUV: VUV, XAF: XAF, XOF: XOF, XPF: XPF, YER: YER, ZMK: ZMK, ZWD: ZWD};

  // bazel-out/darwin-fastbuild/bin/packages/intl-numberformat/lib/src/data/numbering-systems.json
  var names = ["adlm", "ahom", "arab", "arabext", "armn", "armnlow", "bali", "beng", "bhks", "brah", "cakm", "cham", "cyrl", "deva", "diak", "ethi", "fullwide", "geor", "gong", "gonm", "grek", "greklow", "gujr", "guru", "hanidays", "hanidec", "hans", "hansfin", "hant", "hantfin", "hebr", "hmng", "hmnp", "java", "jpan", "jpanfin", "jpanyear", "kali", "khmr", "knda", "lana", "lanatham", "laoo", "latn", "lepc", "limb", "mathbold", "mathdbl", "mathmono", "mathsanb", "mathsans", "mlym", "modi", "mong", "mroo", "mtei", "mymr", "mymrshan", "mymrtlng", "newa", "nkoo", "olck", "orya", "osma", "rohg", "roman", "romanlow", "saur", "segment", "shrd", "sind", "sinh", "sora", "sund", "takr", "talu", "taml", "tamldec", "telu", "thai", "tibt", "tirh", "vaii", "wara", "wcho"];

  // bazel-out/darwin-fastbuild/bin/packages/intl-numberformat/lib/src/get_internal_slots.js
  var internalSlotMap = new WeakMap();
  function getInternalSlots(x) {
    var internalSlots = internalSlotMap.get(x);
    if (!internalSlots) {
      internalSlots = Object.create(null);
      internalSlotMap.set(x, internalSlots);
    }
    return internalSlots;
  }

  // bazel-out/darwin-fastbuild/bin/packages/intl-numberformat/lib/src/core.js
  var numberingSystemNames = names;
  var RESOLVED_OPTIONS_KEYS = [
    "locale",
    "numberingSystem",
    "style",
    "currency",
    "currencyDisplay",
    "currencySign",
    "unit",
    "unitDisplay",
    "minimumIntegerDigits",
    "minimumFractionDigits",
    "maximumFractionDigits",
    "minimumSignificantDigits",
    "maximumSignificantDigits",
    "useGrouping",
    "notation",
    "compactDisplay",
    "signDisplay"
  ];
  var NumberFormat = function(locales, options) {
    if (!this || !OrdinaryHasInstance(NumberFormat, this)) {
      return new NumberFormat(locales, options);
    }
    InitializeNumberFormat(this, locales, options, {
      getInternalSlots: getInternalSlots,
      localeData: NumberFormat.localeData,
      availableLocales: NumberFormat.availableLocales,
      getDefaultLocale: NumberFormat.getDefaultLocale,
      currencyDigitsData: currency_digits_exports,
      numberingSystemNames: numberingSystemNames
    });
    var internalSlots = getInternalSlots(this);
    var dataLocale = internalSlots.dataLocale;
    var dataLocaleData = NumberFormat.localeData[dataLocale];
    invariant(dataLocaleData !== void 0, "Cannot load locale-dependent data for " + dataLocale + ".");
    internalSlots.pl = new Intl.PluralRules(dataLocale, {
      minimumFractionDigits: internalSlots.minimumFractionDigits,
      maximumFractionDigits: internalSlots.maximumFractionDigits,
      minimumIntegerDigits: internalSlots.minimumIntegerDigits,
      minimumSignificantDigits: internalSlots.minimumSignificantDigits,
      maximumSignificantDigits: internalSlots.maximumSignificantDigits
    });
    return this;
  };
  function formatToParts2(x) {
    return FormatNumericToParts(this, toNumeric(x), {
      getInternalSlots: getInternalSlots
    });
  }
  try {
    Object.defineProperty(formatToParts2, "name", {
      value: "formatToParts",
      enumerable: false,
      writable: false,
      configurable: true
    });
  } catch (e) {
  }
  defineProperty(NumberFormat.prototype, "formatToParts", {
    value: formatToParts2
  });
  defineProperty(NumberFormat.prototype, "resolvedOptions", {
    value: function resolvedOptions() {
      if (typeof this !== "object" || !OrdinaryHasInstance(NumberFormat, this)) {
        throw TypeError("Method Intl.NumberFormat.prototype.resolvedOptions called on incompatible receiver");
      }
      var internalSlots = getInternalSlots(this);
      var ro = {};
      for (var _i = 0, RESOLVED_OPTIONS_KEYS_1 = RESOLVED_OPTIONS_KEYS; _i < RESOLVED_OPTIONS_KEYS_1.length; _i++) {
        var key = RESOLVED_OPTIONS_KEYS_1[_i];
        var value = internalSlots[key];
        if (value !== void 0) {
          ro[key] = value;
        }
      }
      return ro;
    }
  });
  var formatDescriptor = {
    enumerable: false,
    configurable: true,
    get: function() {
      if (typeof this !== "object" || !OrdinaryHasInstance(NumberFormat, this)) {
        throw TypeError("Intl.NumberFormat format property accessor called on incompatible receiver");
      }
      var internalSlots = getInternalSlots(this);
      var numberFormat = this;
      var boundFormat = internalSlots.boundFormat;
      if (boundFormat === void 0) {
        boundFormat = function(value) {
          var x = toNumeric(value);
          return numberFormat.formatToParts(x).map(function(x2) {
            return x2.value;
          }).join("");
        };
        try {
          Object.defineProperty(boundFormat, "name", {
            configurable: true,
            enumerable: false,
            writable: false,
            value: ""
          });
        } catch (e) {
        }
        internalSlots.boundFormat = boundFormat;
      }
      return boundFormat;
    }
  };
  try {
    Object.defineProperty(formatDescriptor.get, "name", {
      configurable: true,
      enumerable: false,
      writable: false,
      value: "get format"
    });
  } catch (e) {
  }
  Object.defineProperty(NumberFormat.prototype, "format", formatDescriptor);
  defineProperty(NumberFormat, "supportedLocalesOf", {
    value: function supportedLocalesOf(locales, options) {
      return SupportedLocales(NumberFormat.availableLocales, CanonicalizeLocaleList(locales), options);
    }
  });
  NumberFormat.__addLocaleData = function __addLocaleData() {
    var data = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      data[_i] = arguments[_i];
    }
    for (var _a = 0, data_1 = data; _a < data_1.length; _a++) {
      var _b = data_1[_a], d = _b.data, locale = _b.locale;
      var minimizedLocale = new Intl.Locale(locale).minimize().toString();
      NumberFormat.localeData[locale] = NumberFormat.localeData[minimizedLocale] = d;
      NumberFormat.availableLocales.add(minimizedLocale);
      NumberFormat.availableLocales.add(locale);
      if (!NumberFormat.__defaultLocale) {
        NumberFormat.__defaultLocale = minimizedLocale;
      }
    }
  };
  NumberFormat.__addUnitData = function __addUnitData(locale, unitsData) {
    var _a = NumberFormat.localeData, _b = locale, existingData = _a[_b];
    if (!existingData) {
      throw new Error('Locale data for "' + locale + '" has not been loaded in NumberFormat. \nPlease __addLocaleData before adding additional unit data');
    }
    for (var unit in unitsData.simple) {
      existingData.units.simple[unit] = unitsData.simple[unit];
    }
    for (var unit in unitsData.compound) {
      existingData.units.compound[unit] = unitsData.compound[unit];
    }
  };
  NumberFormat.__defaultLocale = "";
  NumberFormat.localeData = {};
  NumberFormat.availableLocales = new Set();
  NumberFormat.getDefaultLocale = function() {
    return NumberFormat.__defaultLocale;
  };
  NumberFormat.polyfilled = true;
  function toNumeric(val) {
    if (typeof val === "bigint") {
      return val;
    }
    return ToNumber(val);
  }
  try {
    if (typeof Symbol !== "undefined") {
      Object.defineProperty(NumberFormat.prototype, Symbol.toStringTag, {
        configurable: true,
        enumerable: false,
        writable: false,
        value: "Intl.NumberFormat"
      });
    }
    Object.defineProperty(NumberFormat.prototype.constructor, "length", {
      configurable: true,
      enumerable: false,
      writable: false,
      value: 0
    });
    Object.defineProperty(NumberFormat.supportedLocalesOf, "length", {
      configurable: true,
      enumerable: false,
      writable: false,
      value: 1
    });
    Object.defineProperty(NumberFormat, "prototype", {
      configurable: false,
      enumerable: false,
      writable: false,
      value: NumberFormat.prototype
    });
  } catch (e) {
  }

  // bazel-out/darwin-fastbuild/bin/packages/intl-numberformat/lib/src/to_locale_string.js
  function toLocaleString(x, locales, options) {
    var numberFormat = new NumberFormat(locales, options);
    return numberFormat.format(x);
  }

  // bazel-out/darwin-fastbuild/bin/packages/intl-numberformat/lib/should-polyfill.js
  function onlySupportsEn() {
    return !Intl.NumberFormat.polyfilled && !Intl.NumberFormat.supportedLocalesOf(["es"]).length;
  }
  function supportsES2020() {
    try {
      var s = new Intl.NumberFormat("en", {
        style: "unit",
        unit: "bit",
        unitDisplay: "long",
        notation: "scientific"
      }).format(1e4);
      if (s !== "1E4 bits") {
        return false;
      }
    } catch (e) {
      return false;
    }
    return true;
  }
  function shouldPolyfill() {
    return typeof Intl === "undefined" || !("NumberFormat" in Intl) || !supportsES2020() || onlySupportsEn();
  }

  // bazel-out/darwin-fastbuild/bin/packages/intl-numberformat/lib/polyfill.js
  if (shouldPolyfill()) {
    defineProperty(Intl, "NumberFormat", {value: NumberFormat});
    defineProperty(Number.prototype, "toLocaleString", {
      value: function toLocaleString2(locales, options) {
        return toLocaleString(this, locales, options);
      }
    });
  }
})();
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */


// Intl.DateTimeFormat
(function() {
  // node_modules/tslib/tslib.es6.js
  var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf || {__proto__: []} instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2)
        if (Object.prototype.hasOwnProperty.call(b2, p))
          d2[p] = b2[p];
    };
    return extendStatics(d, b);
  };
  function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }
  var __assign = function() {
    __assign = Object.assign || function __assign2(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
      }
      return t;
    };
    return __assign.apply(this, arguments);
  };
  function __rest(s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
          t[p[i]] = s[p[i]];
      }
    return t;
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/utils.js
  function defineProperty(target, name, _a) {
    var value = _a.value;
    Object.defineProperty(target, name, {
      configurable: true,
      enumerable: false,
      writable: true,
      value: value
    });
  }
  var UNICODE_EXTENSION_SEQUENCE_REGEX = /-u(?:-[0-9a-z]{2,8})+/gi;
  function invariant(condition, message, Err) {
    if (Err === void 0) {
      Err = Error;
    }
    if (!condition) {
      throw new Err(message);
    }
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/DateTimeFormat/utils.js
  var DATE_TIME_PROPS = [
    "weekday",
    "era",
    "year",
    "month",
    "day",
    "hour",
    "minute",
    "second",
    "timeZoneName"
  ];
  var removalPenalty = 120;
  var additionPenalty = 20;
  var differentNumericTypePenalty = 15;
  var longLessPenalty = 8;
  var longMorePenalty = 6;
  var shortLessPenalty = 6;
  var shortMorePenalty = 3;

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/types/date-time.js
  var RangePatternType;
  (function(RangePatternType2) {
    RangePatternType2["startRange"] = "startRange";
    RangePatternType2["shared"] = "shared";
    RangePatternType2["endRange"] = "endRange";
  })(RangePatternType || (RangePatternType = {}));

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/DateTimeFormat/skeleton.js
  var DATE_TIME_REGEX = /(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;
  var expPatternTrimmer = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
  function matchSkeletonPattern(match, result) {
    var len = match.length;
    switch (match[0]) {
      case "G":
        result.era = len === 4 ? "long" : len === 5 ? "narrow" : "short";
        return "{era}";
      case "y":
      case "Y":
      case "u":
      case "U":
      case "r":
        result.year = len === 2 ? "2-digit" : "numeric";
        return "{year}";
      case "q":
      case "Q":
        throw new RangeError("`w/Q` (quarter) patterns are not supported");
      case "M":
      case "L":
        result.month = ["numeric", "2-digit", "short", "long", "narrow"][len - 1];
        return "{month}";
      case "w":
      case "W":
        throw new RangeError("`w/W` (week of year) patterns are not supported");
      case "d":
        result.day = ["numeric", "2-digit"][len - 1];
        return "{day}";
      case "D":
      case "F":
      case "g":
        result.day = "numeric";
        return "{day}";
      case "E":
        result.weekday = len === 4 ? "long" : len === 5 ? "narrow" : "short";
        return "{weekday}";
      case "e":
        result.weekday = [
          void 0,
          void 0,
          "short",
          "long",
          "narrow",
          "short"
        ][len - 1];
        return "{weekday}";
      case "c":
        result.weekday = [
          void 0,
          void 0,
          "short",
          "long",
          "narrow",
          "short"
        ][len - 1];
        return "{weekday}";
      case "a":
      case "b":
      case "B":
        result.hour12 = true;
        return "{ampm}";
      case "h":
        result.hour = ["numeric", "2-digit"][len - 1];
        result.hour12 = true;
        return "{hour}";
      case "H":
        result.hour = ["numeric", "2-digit"][len - 1];
        return "{hour}";
      case "K":
        result.hour = ["numeric", "2-digit"][len - 1];
        result.hour12 = true;
        return "{hour}";
      case "k":
        result.hour = ["numeric", "2-digit"][len - 1];
        return "{hour}";
      case "j":
      case "J":
      case "C":
        throw new RangeError("`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead");
      case "m":
        result.minute = ["numeric", "2-digit"][len - 1];
        return "{minute}";
      case "s":
        result.second = ["numeric", "2-digit"][len - 1];
        return "{second}";
      case "S":
      case "A":
        result.second = "numeric";
        return "{second}";
      case "z":
      case "Z":
      case "O":
      case "v":
      case "V":
      case "X":
      case "x":
        result.timeZoneName = len < 4 ? "short" : "long";
        return "{timeZoneName}";
    }
    return "";
  }
  function skeletonTokenToTable2(c) {
    switch (c) {
      case "G":
        return "era";
      case "y":
      case "Y":
      case "u":
      case "U":
      case "r":
        return "year";
      case "M":
      case "L":
        return "month";
      case "d":
      case "D":
      case "F":
      case "g":
        return "day";
      case "a":
      case "b":
      case "B":
        return "ampm";
      case "h":
      case "H":
      case "K":
      case "k":
        return "hour";
      case "m":
        return "minute";
      case "s":
      case "S":
      case "A":
        return "second";
      default:
        throw new RangeError("Invalid range pattern token");
    }
  }
  function processDateTimePattern(pattern, result) {
    var literals = [];
    var pattern12 = pattern.replace(/'{2}/g, "{apostrophe}").replace(/'(.*?)'/g, function(_, literal) {
      literals.push(literal);
      return "$$" + (literals.length - 1) + "$$";
    }).replace(DATE_TIME_REGEX, function(m) {
      return matchSkeletonPattern(m, result || {});
    });
    if (literals.length) {
      pattern12 = pattern12.replace(/\$\$(\d+)\$\$/g, function(_, i) {
        return literals[+i];
      }).replace(/\{apostrophe\}/g, "'");
    }
    return [
      pattern12.replace(/([\s\uFEFF\xA0])\{ampm\}([\s\uFEFF\xA0])/, "$1").replace("{ampm}", "").replace(expPatternTrimmer, ""),
      pattern12
    ];
  }
  function parseDateTimeSkeleton(skeleton, rawPattern, rangePatterns, intervalFormatFallback) {
    if (rawPattern === void 0) {
      rawPattern = skeleton;
    }
    var result = {
      pattern: "",
      pattern12: "",
      skeleton: skeleton,
      rawPattern: rawPattern,
      rangePatterns: {},
      rangePatterns12: {}
    };
    if (rangePatterns) {
      for (var k in rangePatterns) {
        var key = skeletonTokenToTable2(k);
        var rawPattern_1 = rangePatterns[k];
        var intervalResult = {
          patternParts: []
        };
        var _a = processDateTimePattern(rawPattern_1, intervalResult), pattern_1 = _a[0], pattern12_1 = _a[1];
        result.rangePatterns[key] = __assign(__assign({}, intervalResult), {patternParts: splitRangePattern(pattern_1)});
        result.rangePatterns12[key] = __assign(__assign({}, intervalResult), {patternParts: splitRangePattern(pattern12_1)});
      }
    } else if (intervalFormatFallback) {
      var patternParts = splitFallbackRangePattern(intervalFormatFallback);
      result.rangePatterns.default = {
        patternParts: patternParts
      };
      result.rangePatterns12.default = {
        patternParts: patternParts
      };
    }
    skeleton.replace(DATE_TIME_REGEX, function(m) {
      return matchSkeletonPattern(m, result);
    });
    var _b = processDateTimePattern(rawPattern), pattern = _b[0], pattern12 = _b[1];
    result.pattern = pattern;
    result.pattern12 = pattern12;
    return result;
  }
  function splitFallbackRangePattern(pattern) {
    var parts = pattern.split(/(\{[0|1]\})/g).filter(Boolean);
    return parts.map(function(pattern2) {
      switch (pattern2) {
        case "{0}":
          return {
            source: RangePatternType.startRange,
            pattern: pattern2
          };
        case "{1}":
          return {
            source: RangePatternType.endRange,
            pattern: pattern2
          };
        default:
          return {
            source: RangePatternType.shared,
            pattern: pattern2
          };
      }
    });
  }
  function splitRangePattern(pattern) {
    var PART_REGEX = /\{(.*?)\}/g;
    var parts = {};
    var match;
    var splitIndex = 0;
    while (match = PART_REGEX.exec(pattern)) {
      if (!(match[0] in parts)) {
        parts[match[0]] = match.index;
      } else {
        splitIndex = match.index;
        break;
      }
    }
    if (!splitIndex) {
      return [
        {
          source: RangePatternType.startRange,
          pattern: pattern
        }
      ];
    }
    return [
      {
        source: RangePatternType.startRange,
        pattern: pattern.slice(0, splitIndex)
      },
      {
        source: RangePatternType.endRange,
        pattern: pattern.slice(splitIndex)
      }
    ];
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/DateTimeFormat/BestFitFormatMatcher.js
  function isNumericType(t) {
    return t === "numeric" || t === "2-digit";
  }
  function bestFitFormatMatcherScore(options, format) {
    var score = 0;
    if (options.hour12 && !format.hour12) {
      score -= removalPenalty;
    } else if (!options.hour12 && format.hour12) {
      score -= additionPenalty;
    }
    for (var _i = 0, DATE_TIME_PROPS_1 = DATE_TIME_PROPS; _i < DATE_TIME_PROPS_1.length; _i++) {
      var prop = DATE_TIME_PROPS_1[_i];
      var optionsProp = options[prop];
      var formatProp = format[prop];
      if (optionsProp === void 0 && formatProp !== void 0) {
        score -= additionPenalty;
      } else if (optionsProp !== void 0 && formatProp === void 0) {
        score -= removalPenalty;
      } else if (optionsProp !== formatProp) {
        if (isNumericType(optionsProp) !== isNumericType(formatProp)) {
          score -= differentNumericTypePenalty;
        } else {
          var values = ["2-digit", "numeric", "narrow", "short", "long"];
          var optionsPropIndex = values.indexOf(optionsProp);
          var formatPropIndex = values.indexOf(formatProp);
          var delta = Math.max(-2, Math.min(formatPropIndex - optionsPropIndex, 2));
          if (delta === 2) {
            score -= longMorePenalty;
          } else if (delta === 1) {
            score -= shortMorePenalty;
          } else if (delta === -1) {
            score -= shortLessPenalty;
          } else if (delta === -2) {
            score -= longLessPenalty;
          }
        }
      }
    }
    return score;
  }
  function BestFitFormatMatcher(options, formats) {
    var bestScore = -Infinity;
    var bestFormat = formats[0];
    invariant(Array.isArray(formats), "formats should be a list of things");
    for (var _i = 0, formats_1 = formats; _i < formats_1.length; _i++) {
      var format = formats_1[_i];
      var score = bestFitFormatMatcherScore(options, format);
      if (score > bestScore) {
        bestScore = score;
        bestFormat = format;
      }
    }
    var skeletonFormat = __assign({}, bestFormat);
    var patternFormat = {rawPattern: bestFormat.rawPattern};
    processDateTimePattern(bestFormat.rawPattern, patternFormat);
    for (var prop in skeletonFormat) {
      var skeletonValue = skeletonFormat[prop];
      var patternValue = patternFormat[prop];
      var requestedValue = options[prop];
      if (prop === "minute" || prop === "second") {
        continue;
      }
      if (!requestedValue) {
        continue;
      }
      if (isNumericType(patternValue) && !isNumericType(requestedValue)) {
        continue;
      }
      if (skeletonValue === requestedValue) {
        continue;
      }
      patternFormat[prop] = requestedValue;
    }
    patternFormat.pattern = skeletonFormat.pattern;
    patternFormat.pattern12 = skeletonFormat.pattern12;
    patternFormat.skeleton = skeletonFormat.skeleton;
    patternFormat.rangePatterns = skeletonFormat.rangePatterns;
    patternFormat.rangePatterns12 = skeletonFormat.rangePatterns12;
    return patternFormat;
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/CanonicalizeLocaleList.js
  function CanonicalizeLocaleList(locales) {
    return Intl.getCanonicalLocales(locales);
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/CanonicalizeTimeZoneName.js
  function CanonicalizeTimeZoneName(tz, _a) {
    var tzData = _a.tzData, uppercaseLinks = _a.uppercaseLinks;
    var uppercasedTz = tz.toUpperCase();
    var uppercasedZones = Object.keys(tzData).reduce(function(all, z) {
      all[z.toUpperCase()] = z;
      return all;
    }, {});
    var ianaTimeZone = uppercaseLinks[uppercasedTz] || uppercasedZones[uppercasedTz];
    if (ianaTimeZone === "Etc/UTC" || ianaTimeZone === "Etc/GMT") {
      return "UTC";
    }
    return ianaTimeZone;
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/262.js
  function ToString(o) {
    if (typeof o === "symbol") {
      throw TypeError("Cannot convert a Symbol value to a string");
    }
    return String(o);
  }
  function ToNumber(val) {
    if (val === void 0) {
      return NaN;
    }
    if (val === null) {
      return 0;
    }
    if (typeof val === "boolean") {
      return val ? 1 : 0;
    }
    if (typeof val === "number") {
      return val;
    }
    if (typeof val === "symbol" || typeof val === "bigint") {
      throw new TypeError("Cannot convert symbol/bigint to number");
    }
    return Number(val);
  }
  function ToInteger(n) {
    var number = ToNumber(n);
    if (isNaN(number) || SameValue(number, -0)) {
      return 0;
    }
    if (isFinite(number)) {
      return number;
    }
    var integer = Math.floor(Math.abs(number));
    if (number < 0) {
      integer = -integer;
    }
    if (SameValue(integer, -0)) {
      return 0;
    }
    return integer;
  }
  function TimeClip(time) {
    if (!isFinite(time)) {
      return NaN;
    }
    if (Math.abs(time) > 8.64 * 1e15) {
      return NaN;
    }
    return ToInteger(time);
  }
  function ToObject(arg) {
    if (arg == null) {
      throw new TypeError("undefined/null cannot be converted to object");
    }
    return Object(arg);
  }
  function SameValue(x, y) {
    if (Object.is) {
      return Object.is(x, y);
    }
    if (x === y) {
      return x !== 0 || 1 / x === 1 / y;
    }
    return x !== x && y !== y;
  }
  function ArrayCreate(len) {
    return new Array(len);
  }
  function Type(x) {
    if (x === null) {
      return "Null";
    }
    if (typeof x === "undefined") {
      return "Undefined";
    }
    if (typeof x === "function" || typeof x === "object") {
      return "Object";
    }
    if (typeof x === "number") {
      return "Number";
    }
    if (typeof x === "boolean") {
      return "Boolean";
    }
    if (typeof x === "string") {
      return "String";
    }
    if (typeof x === "symbol") {
      return "Symbol";
    }
    if (typeof x === "bigint") {
      return "BigInt";
    }
  }
  var MS_PER_DAY = 864e5;
  function mod(x, y) {
    return x - Math.floor(x / y) * y;
  }
  function Day(t) {
    return Math.floor(t / MS_PER_DAY);
  }
  function WeekDay(t) {
    return mod(Day(t) + 4, 7);
  }
  function DayFromYear(y) {
    return Date.UTC(y, 0) / MS_PER_DAY;
  }
  function YearFromTime(t) {
    return new Date(t).getUTCFullYear();
  }
  function DaysInYear(y) {
    if (y % 4 !== 0) {
      return 365;
    }
    if (y % 100 !== 0) {
      return 366;
    }
    if (y % 400 !== 0) {
      return 365;
    }
    return 366;
  }
  function DayWithinYear(t) {
    return Day(t) - DayFromYear(YearFromTime(t));
  }
  function InLeapYear(t) {
    return DaysInYear(YearFromTime(t)) === 365 ? 0 : 1;
  }
  function MonthFromTime(t) {
    var dwy = DayWithinYear(t);
    var leap = InLeapYear(t);
    if (dwy >= 0 && dwy < 31) {
      return 0;
    }
    if (dwy < 59 + leap) {
      return 1;
    }
    if (dwy < 90 + leap) {
      return 2;
    }
    if (dwy < 120 + leap) {
      return 3;
    }
    if (dwy < 151 + leap) {
      return 4;
    }
    if (dwy < 181 + leap) {
      return 5;
    }
    if (dwy < 212 + leap) {
      return 6;
    }
    if (dwy < 243 + leap) {
      return 7;
    }
    if (dwy < 273 + leap) {
      return 8;
    }
    if (dwy < 304 + leap) {
      return 9;
    }
    if (dwy < 334 + leap) {
      return 10;
    }
    if (dwy < 365 + leap) {
      return 11;
    }
    throw new Error("Invalid time");
  }
  function DateFromTime(t) {
    var dwy = DayWithinYear(t);
    var mft = MonthFromTime(t);
    var leap = InLeapYear(t);
    if (mft === 0) {
      return dwy + 1;
    }
    if (mft === 1) {
      return dwy - 30;
    }
    if (mft === 2) {
      return dwy - 58 - leap;
    }
    if (mft === 3) {
      return dwy - 89 - leap;
    }
    if (mft === 4) {
      return dwy - 119 - leap;
    }
    if (mft === 5) {
      return dwy - 150 - leap;
    }
    if (mft === 6) {
      return dwy - 180 - leap;
    }
    if (mft === 7) {
      return dwy - 211 - leap;
    }
    if (mft === 8) {
      return dwy - 242 - leap;
    }
    if (mft === 9) {
      return dwy - 272 - leap;
    }
    if (mft === 10) {
      return dwy - 303 - leap;
    }
    if (mft === 11) {
      return dwy - 333 - leap;
    }
    throw new Error("Invalid time");
  }
  var HOURS_PER_DAY = 24;
  var MINUTES_PER_HOUR = 60;
  var SECONDS_PER_MINUTE = 60;
  var MS_PER_SECOND = 1e3;
  var MS_PER_MINUTE = MS_PER_SECOND * SECONDS_PER_MINUTE;
  var MS_PER_HOUR = MS_PER_MINUTE * MINUTES_PER_HOUR;
  function HourFromTime(t) {
    return mod(Math.floor(t / MS_PER_HOUR), HOURS_PER_DAY);
  }
  function MinFromTime(t) {
    return mod(Math.floor(t / MS_PER_MINUTE), MINUTES_PER_HOUR);
  }
  function SecFromTime(t) {
    return mod(Math.floor(t / MS_PER_SECOND), SECONDS_PER_MINUTE);
  }
  function IsCallable(fn) {
    return typeof fn === "function";
  }
  function OrdinaryHasInstance(C, O, internalSlots) {
    if (!IsCallable(C)) {
      return false;
    }
    if (internalSlots === null || internalSlots === void 0 ? void 0 : internalSlots.boundTargetFunction) {
      var BC = internalSlots === null || internalSlots === void 0 ? void 0 : internalSlots.boundTargetFunction;
      return O instanceof BC;
    }
    if (typeof O !== "object") {
      return false;
    }
    var P = C.prototype;
    if (typeof P !== "object") {
      throw new TypeError("OrdinaryHasInstance called on an object with an invalid prototype property.");
    }
    return Object.prototype.isPrototypeOf.call(P, O);
  }
  function msFromTime(t) {
    return mod(t, MS_PER_SECOND);
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/DateTimeFormat/BasicFormatMatcher.js
  function BasicFormatMatcher(options, formats) {
    var bestScore = -Infinity;
    var bestFormat = formats[0];
    invariant(Array.isArray(formats), "formats should be a list of things");
    for (var _i = 0, formats_1 = formats; _i < formats_1.length; _i++) {
      var format = formats_1[_i];
      var score = 0;
      for (var _a = 0, DATE_TIME_PROPS_1 = DATE_TIME_PROPS; _a < DATE_TIME_PROPS_1.length; _a++) {
        var prop = DATE_TIME_PROPS_1[_a];
        var optionsProp = options[prop];
        var formatProp = format[prop];
        if (optionsProp === void 0 && formatProp !== void 0) {
          score -= additionPenalty;
        } else if (optionsProp !== void 0 && formatProp === void 0) {
          score -= removalPenalty;
        } else if (optionsProp !== formatProp) {
          var values = void 0;
          if (prop === "fractionalSecondDigits") {
            values = [1, 2, 3];
          } else {
            values = ["2-digit", "numeric", "narrow", "short", "long"];
          }
          var optionsPropIndex = values.indexOf(optionsProp);
          var formatPropIndex = values.indexOf(formatProp);
          var delta = Math.max(-2, Math.min(formatPropIndex - optionsPropIndex, 2));
          if (delta === 2) {
            score -= longMorePenalty;
          } else if (delta === 1) {
            score -= shortMorePenalty;
          } else if (delta === -1) {
            score -= shortLessPenalty;
          } else if (delta === -2) {
            score -= longLessPenalty;
          }
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestFormat = format;
      }
    }
    return __assign({}, bestFormat);
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/DateTimeFormat/DateTimeStyleFormat.js
  function DateTimeStyleFormat(dateStyle, timeStyle, dataLocaleData) {
    var dateFormat, timeFormat;
    if (timeStyle !== void 0) {
      invariant(timeStyle === "full" || timeStyle === "long" || timeStyle === "medium" || timeStyle === "short", "invalid timeStyle");
      timeFormat = dataLocaleData.timeFormat[timeStyle];
    }
    if (dateStyle !== void 0) {
      invariant(dateStyle === "full" || dateStyle === "long" || dateStyle === "medium" || dateStyle === "short", "invalid dateStyle");
      dateFormat = dataLocaleData.dateFormat[dateStyle];
    }
    if (dateStyle !== void 0 && timeStyle !== void 0) {
      var format = {};
      for (var field in dateFormat) {
        if (field !== "pattern") {
          format[field] = dateFormat[field];
        }
      }
      for (var field in timeFormat) {
        if (field !== "pattern" && field !== "pattern12") {
          format[field] = timeFormat[field];
        }
      }
      var connector = dataLocaleData.dateTimeFormat[dateStyle];
      var pattern = connector.replace("{0}", timeFormat.pattern).replace("{1}", dateFormat.pattern);
      format.pattern = pattern;
      if ("pattern12" in timeFormat) {
        var pattern12 = connector.replace("{0}", timeFormat.pattern12).replace("{1}", dateFormat.pattern);
        format.pattern12 = pattern12;
      }
      return format;
    }
    if (timeStyle !== void 0) {
      return timeFormat;
    }
    invariant(dateStyle !== void 0, "dateStyle should not be undefined");
    return dateFormat;
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/DateTimeFormat/ToLocalTime.js
  function getApplicableZoneData(t, timeZone, tzData) {
    var _a;
    var zoneData = tzData[timeZone];
    if (!zoneData) {
      return [0, false];
    }
    var i = 0;
    var offset = 0;
    var dst = false;
    for (; i <= zoneData.length; i++) {
      if (i === zoneData.length || zoneData[i][0] * 1e3 > t) {
        ;
        _a = zoneData[i - 1], offset = _a[2], dst = _a[3];
        break;
      }
    }
    return [offset * 1e3, dst];
  }
  function ToLocalTime(t, calendar, timeZone, _a) {
    var tzData = _a.tzData;
    invariant(Type(t) === "Number", "invalid time");
    invariant(calendar === "gregory", "We only support Gregory calendar right now");
    var _b = getApplicableZoneData(t, timeZone, tzData), timeZoneOffset = _b[0], inDST = _b[1];
    var tz = t + timeZoneOffset;
    var year = YearFromTime(tz);
    return {
      weekday: WeekDay(tz),
      era: year < 0 ? "BC" : "AD",
      year: year,
      relatedYear: void 0,
      yearName: void 0,
      month: MonthFromTime(tz),
      day: DateFromTime(tz),
      hour: HourFromTime(tz),
      minute: MinFromTime(tz),
      second: SecFromTime(tz),
      millisecond: msFromTime(tz),
      inDST: inDST,
      timeZoneOffset: timeZoneOffset
    };
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/DateTimeFormat/FormatDateTimePattern.js
  function pad(n) {
    if (n < 10) {
      return "0" + n;
    }
    return String(n);
  }
  function offsetToGmtString(gmtFormat, hourFormat, offsetInMs, style) {
    var offsetInMinutes = Math.floor(offsetInMs / 6e4);
    var mins = Math.abs(offsetInMinutes) % 60;
    var hours = Math.floor(Math.abs(offsetInMinutes) / 60);
    var _a = hourFormat.split(";"), positivePattern = _a[0], negativePattern = _a[1];
    var offsetStr = "";
    var pattern = offsetInMs < 0 ? negativePattern : positivePattern;
    if (style === "long") {
      offsetStr = pattern.replace("HH", pad(hours)).replace("H", String(hours)).replace("mm", pad(mins)).replace("m", String(mins));
    } else if (mins || hours) {
      if (!mins) {
        pattern = pattern.replace(/:?m+/, "");
      }
      offsetStr = pattern.replace(/H+/, String(hours)).replace(/m+/, String(mins));
    }
    return gmtFormat.replace("{0}", offsetStr);
  }
  function FormatDateTimePattern(dtf, patternParts, x, _a) {
    var getInternalSlots2 = _a.getInternalSlots, localeData = _a.localeData, getDefaultTimeZone = _a.getDefaultTimeZone, tzData = _a.tzData;
    x = TimeClip(x);
    var internalSlots = getInternalSlots2(dtf);
    var dataLocale = internalSlots.dataLocale;
    var dataLocaleData = localeData[dataLocale];
    var locale = internalSlots.locale;
    var nfOptions = Object.create(null);
    nfOptions.useGrouping = false;
    var nf = new Intl.NumberFormat(locale, nfOptions);
    var nf2Options = Object.create(null);
    nf2Options.minimumIntegerDigits = 2;
    nf2Options.useGrouping = false;
    var nf2 = new Intl.NumberFormat(locale, nf2Options);
    var fractionalSecondDigits = internalSlots.fractionalSecondDigits;
    var nf3;
    if (fractionalSecondDigits !== void 0) {
      var nf3Options = Object.create(null);
      nf3Options.minimumIntegerDigits = fractionalSecondDigits;
      nf3Options.useGrouping = false;
      nf3 = new Intl.NumberFormat(locale, nf3Options);
    }
    var tm = ToLocalTime(x, internalSlots.calendar, internalSlots.timeZone, {tzData: tzData});
    var result = [];
    for (var _i = 0, patternParts_1 = patternParts; _i < patternParts_1.length; _i++) {
      var patternPart = patternParts_1[_i];
      var p = patternPart.type;
      if (p === "literal") {
        result.push({
          type: "literal",
          value: patternPart.value
        });
      } else if (p === "fractionalSecondDigits") {
        var v = Math.floor(tm.millisecond * Math.pow(10, (fractionalSecondDigits || 0) - 3));
        result.push({
          type: "fractionalSecond",
          value: nf3.format(v)
        });
      } else if (DATE_TIME_PROPS.indexOf(p) > -1) {
        var fv = "";
        var f = internalSlots[p];
        var v = tm[p];
        if (p === "year" && v <= 0) {
          v = 1 - v;
        }
        if (p === "month") {
          v++;
        }
        var hourCycle = internalSlots.hourCycle;
        if (p === "hour" && (hourCycle === "h11" || hourCycle === "h12")) {
          v = v % 12;
          if (v === 0 && hourCycle === "h12") {
            v = 12;
          }
        }
        if (p === "hour" && hourCycle === "h24") {
          if (v === 0) {
            v = 24;
          }
        }
        if (f === "numeric") {
          fv = nf.format(v);
        } else if (f === "2-digit") {
          fv = nf2.format(v);
          if (fv.length > 2) {
            fv = fv.slice(fv.length - 2, fv.length);
          }
        } else if (f === "narrow" || f === "short" || f === "long") {
          if (p === "era") {
            fv = dataLocaleData[p][f][v];
          } else if (p === "timeZoneName") {
            var timeZoneName = dataLocaleData.timeZoneName, gmtFormat = dataLocaleData.gmtFormat, hourFormat = dataLocaleData.hourFormat;
            var timeZone = internalSlots.timeZone || getDefaultTimeZone();
            var timeZoneData = timeZoneName[timeZone];
            if (timeZoneData && timeZoneData[f]) {
              fv = timeZoneData[f][+tm.inDST];
            } else {
              fv = offsetToGmtString(gmtFormat, hourFormat, tm.timeZoneOffset, f);
            }
          } else if (p === "month") {
            fv = dataLocaleData.month[f][v - 1];
          } else {
            fv = dataLocaleData[p][f][v];
          }
        }
        result.push({
          type: p,
          value: fv
        });
      } else if (p === "ampm") {
        var v = tm.hour;
        var fv = void 0;
        if (v > 11) {
          fv = dataLocaleData.pm;
        } else {
          fv = dataLocaleData.am;
        }
        result.push({
          type: "dayPeriod",
          value: fv
        });
      } else if (p === "relatedYear") {
        var v = tm.relatedYear;
        var fv = nf.format(v);
        result.push({
          type: "relatedYear",
          value: fv
        });
      } else if (p === "yearName") {
        var v = tm.yearName;
        var fv = nf.format(v);
        result.push({
          type: "yearName",
          value: fv
        });
      }
    }
    return result;
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/PartitionPattern.js
  function PartitionPattern(pattern) {
    var result = [];
    var beginIndex = pattern.indexOf("{");
    var endIndex = 0;
    var nextIndex = 0;
    var length = pattern.length;
    while (beginIndex < pattern.length && beginIndex > -1) {
      endIndex = pattern.indexOf("}", beginIndex);
      invariant(endIndex > beginIndex, "Invalid pattern " + pattern);
      if (beginIndex > nextIndex) {
        result.push({
          type: "literal",
          value: pattern.substring(nextIndex, beginIndex)
        });
      }
      result.push({
        type: pattern.substring(beginIndex + 1, endIndex),
        value: void 0
      });
      nextIndex = endIndex + 1;
      beginIndex = pattern.indexOf("{", nextIndex);
    }
    if (nextIndex < length) {
      result.push({
        type: "literal",
        value: pattern.substring(nextIndex, length)
      });
    }
    return result;
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/DateTimeFormat/PartitionDateTimePattern.js
  function PartitionDateTimePattern(dtf, x, implDetails) {
    x = TimeClip(x);
    if (isNaN(x)) {
      throw new RangeError("invalid time");
    }
    var getInternalSlots2 = implDetails.getInternalSlots;
    var internalSlots = getInternalSlots2(dtf);
    var pattern = internalSlots.pattern;
    return FormatDateTimePattern(dtf, PartitionPattern(pattern), x, implDetails);
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/DateTimeFormat/FormatDateTime.js
  function FormatDateTime(dtf, x, implDetails) {
    var parts = PartitionDateTimePattern(dtf, x, implDetails);
    var result = "";
    for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
      var part = parts_1[_i];
      result += part.value;
    }
    return result;
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/DateTimeFormat/PartitionDateTimeRangePattern.js
  var TABLE_2_FIELDS = [
    "era",
    "year",
    "month",
    "day",
    "ampm",
    "hour",
    "minute",
    "second",
    "fractionalSecondDigits"
  ];
  function PartitionDateTimeRangePattern(dtf, x, y, implDetails) {
    x = TimeClip(x);
    if (isNaN(x)) {
      throw new RangeError("Invalid start time");
    }
    y = TimeClip(y);
    if (isNaN(y)) {
      throw new RangeError("Invalid end time");
    }
    var getInternalSlots2 = implDetails.getInternalSlots, tzData = implDetails.tzData;
    var internalSlots = getInternalSlots2(dtf);
    var tm1 = ToLocalTime(x, internalSlots.calendar, internalSlots.timeZone, {tzData: tzData});
    var tm2 = ToLocalTime(y, internalSlots.calendar, internalSlots.timeZone, {tzData: tzData});
    var pattern = internalSlots.pattern, rangePatterns = internalSlots.rangePatterns;
    var rangePattern;
    var dateFieldsPracticallyEqual = true;
    var patternContainsLargerDateField = false;
    for (var _i = 0, TABLE_2_FIELDS_1 = TABLE_2_FIELDS; _i < TABLE_2_FIELDS_1.length; _i++) {
      var fieldName = TABLE_2_FIELDS_1[_i];
      if (dateFieldsPracticallyEqual && !patternContainsLargerDateField) {
        if (fieldName === "ampm") {
          var rp = rangePatterns.ampm;
          if (rangePattern !== void 0 && rp === void 0) {
            patternContainsLargerDateField = true;
          } else {
            var v1 = tm1.hour;
            var v2 = tm2.hour;
            if (v1 > 11 && v2 < 11 || v1 < 11 && v2 > 11) {
              dateFieldsPracticallyEqual = false;
            }
            rangePattern = rp;
          }
        } else if (fieldName === "fractionalSecondDigits") {
          var fractionalSecondDigits = internalSlots.fractionalSecondDigits;
          if (fractionalSecondDigits === void 0) {
            fractionalSecondDigits = 3;
          }
          var v1 = Math.floor(tm1.millisecond * Math.pow(10, fractionalSecondDigits - 3));
          var v2 = Math.floor(tm2.millisecond * Math.pow(10, fractionalSecondDigits - 3));
          if (v1 !== v2) {
            dateFieldsPracticallyEqual = false;
          }
        } else {
          var rp = rangePatterns[fieldName];
          if (rangePattern !== void 0 && rp === void 0) {
            patternContainsLargerDateField = true;
          } else {
            var v1 = tm1[fieldName];
            var v2 = tm2[fieldName];
            if (!SameValue(v1, v2)) {
              dateFieldsPracticallyEqual = false;
            }
            rangePattern = rp;
          }
        }
      }
    }
    if (dateFieldsPracticallyEqual) {
      var result_2 = FormatDateTimePattern(dtf, PartitionPattern(pattern), x, implDetails);
      for (var _a = 0, result_1 = result_2; _a < result_1.length; _a++) {
        var r = result_1[_a];
        r.source = RangePatternType.shared;
      }
      return result_2;
    }
    var result = [];
    if (rangePattern === void 0) {
      rangePattern = rangePatterns.default;
      for (var _b = 0, _c = rangePattern.patternParts; _b < _c.length; _b++) {
        var patternPart = _c[_b];
        if (patternPart.pattern === "{0}" || patternPart.pattern === "{1}") {
          patternPart.pattern = pattern;
        }
      }
    }
    for (var _d = 0, _e = rangePattern.patternParts; _d < _e.length; _d++) {
      var rangePatternPart = _e[_d];
      var source = rangePatternPart.source, pattern_1 = rangePatternPart.pattern;
      var z = void 0;
      if (source === RangePatternType.startRange || source === RangePatternType.shared) {
        z = x;
      } else {
        z = y;
      }
      var patternParts = PartitionPattern(pattern_1);
      var partResult = FormatDateTimePattern(dtf, patternParts, z, implDetails);
      for (var _f = 0, partResult_1 = partResult; _f < partResult_1.length; _f++) {
        var r = partResult_1[_f];
        r.source = source;
      }
      result = result.concat(partResult);
    }
    return result;
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/DateTimeFormat/FormatDateTimeRange.js
  function FormatDateTimeRange(dtf, x, y, implDetails) {
    var parts = PartitionDateTimeRangePattern(dtf, x, y, implDetails);
    var result = "";
    for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
      var part = parts_1[_i];
      result += part.value;
    }
    return result;
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/DateTimeFormat/FormatDateTimeRangeToParts.js
  function FormatDateTimeRangeToParts(dtf, x, y, implDetails) {
    var parts = PartitionDateTimeRangePattern(dtf, x, y, implDetails);
    var result = new Array(0);
    for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
      var part = parts_1[_i];
      result.push({
        type: part.type,
        value: part.value,
        source: part.source
      });
    }
    return result;
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/DateTimeFormat/FormatDateTimeToParts.js
  function FormatDateTimeToParts(dtf, x, implDetails) {
    var parts = PartitionDateTimePattern(dtf, x, implDetails);
    var result = ArrayCreate(0);
    for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
      var part = parts_1[_i];
      result.push({
        type: part.type,
        value: part.value
      });
    }
    return result;
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/DateTimeFormat/ToDateTimeOptions.js
  function ToDateTimeOptions(options, required, defaults) {
    if (options === void 0) {
      options = null;
    } else {
      options = ToObject(options);
    }
    options = Object.create(options);
    var needDefaults = true;
    if (required === "date" || required === "any") {
      for (var _i = 0, _a = ["weekday", "year", "month", "day"]; _i < _a.length; _i++) {
        var prop = _a[_i];
        var value = options[prop];
        if (value !== void 0) {
          needDefaults = false;
        }
      }
    }
    if (required === "time" || required === "any") {
      for (var _b = 0, _c = [
        "dayPeriod",
        "hour",
        "minute",
        "second",
        "fractionalSecondDigits"
      ]; _b < _c.length; _b++) {
        var prop = _c[_b];
        var value = options[prop];
        if (value !== void 0) {
          needDefaults = false;
        }
      }
    }
    if (options.dateStyle !== void 0 || options.timeStyle !== void 0) {
      needDefaults = false;
    }
    if (required === "date" && options.timeStyle) {
      throw new TypeError("Intl.DateTimeFormat date was required but timeStyle was included");
    }
    if (required === "time" && options.dateStyle) {
      throw new TypeError("Intl.DateTimeFormat time was required but dateStyle was included");
    }
    if (needDefaults && (defaults === "date" || defaults === "all")) {
      for (var _d = 0, _e = ["year", "month", "day"]; _d < _e.length; _d++) {
        var prop = _e[_d];
        options[prop] = "numeric";
      }
    }
    if (needDefaults && (defaults === "time" || defaults === "all")) {
      for (var _f = 0, _g = ["hour", "minute", "second"]; _f < _g.length; _f++) {
        var prop = _g[_f];
        options[prop] = "numeric";
      }
    }
    return options;
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/GetOption.js
  function GetOption(opts, prop, type, values, fallback) {
    if (typeof opts !== "object") {
      throw new TypeError("Options must be an object");
    }
    var value = opts[prop];
    if (value !== void 0) {
      if (type !== "boolean" && type !== "string") {
        throw new TypeError("invalid type");
      }
      if (type === "boolean") {
        value = Boolean(value);
      }
      if (type === "string") {
        value = ToString(value);
      }
      if (values !== void 0 && !values.filter(function(val) {
        return val == value;
      }).length) {
        throw new RangeError(value + " is not within " + values.join(", "));
      }
      return value;
    }
    return fallback;
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/BestAvailableLocale.js
  function BestAvailableLocale(availableLocales, locale) {
    var candidate = locale;
    while (true) {
      if (availableLocales.has(candidate)) {
        return candidate;
      }
      var pos = candidate.lastIndexOf("-");
      if (!~pos) {
        return void 0;
      }
      if (pos >= 2 && candidate[pos - 2] === "-") {
        pos -= 2;
      }
      candidate = candidate.slice(0, pos);
    }
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/LookupMatcher.js
  function LookupMatcher(availableLocales, requestedLocales, getDefaultLocale) {
    var result = {locale: ""};
    for (var _i = 0, requestedLocales_1 = requestedLocales; _i < requestedLocales_1.length; _i++) {
      var locale = requestedLocales_1[_i];
      var noExtensionLocale = locale.replace(UNICODE_EXTENSION_SEQUENCE_REGEX, "");
      var availableLocale = BestAvailableLocale(availableLocales, noExtensionLocale);
      if (availableLocale) {
        result.locale = availableLocale;
        if (locale !== noExtensionLocale) {
          result.extension = locale.slice(noExtensionLocale.length + 1, locale.length);
        }
        return result;
      }
    }
    result.locale = getDefaultLocale();
    return result;
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/BestFitMatcher.js
  function BestFitMatcher(availableLocales, requestedLocales, getDefaultLocale) {
    var minimizedAvailableLocaleMap = {};
    var minimizedAvailableLocales = new Set();
    availableLocales.forEach(function(locale2) {
      var minimizedLocale = new Intl.Locale(locale2).minimize().toString();
      minimizedAvailableLocaleMap[minimizedLocale] = locale2;
      minimizedAvailableLocales.add(minimizedLocale);
    });
    var foundLocale;
    for (var _i = 0, requestedLocales_1 = requestedLocales; _i < requestedLocales_1.length; _i++) {
      var l = requestedLocales_1[_i];
      if (foundLocale) {
        break;
      }
      var noExtensionLocale = l.replace(UNICODE_EXTENSION_SEQUENCE_REGEX, "");
      if (availableLocales.has(noExtensionLocale)) {
        foundLocale = noExtensionLocale;
        break;
      }
      if (minimizedAvailableLocales.has(noExtensionLocale)) {
        foundLocale = minimizedAvailableLocaleMap[noExtensionLocale];
        break;
      }
      var locale = new Intl.Locale(noExtensionLocale);
      var maximizedRequestedLocale = locale.maximize().toString();
      var minimizedRequestedLocale = locale.minimize().toString();
      if (minimizedAvailableLocales.has(minimizedRequestedLocale)) {
        foundLocale = minimizedAvailableLocaleMap[minimizedRequestedLocale];
        break;
      }
      foundLocale = BestAvailableLocale(minimizedAvailableLocales, maximizedRequestedLocale);
    }
    return {
      locale: foundLocale || getDefaultLocale()
    };
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/UnicodeExtensionValue.js
  function UnicodeExtensionValue(extension, key) {
    invariant(key.length === 2, "key must have 2 elements");
    var size = extension.length;
    var searchValue = "-" + key + "-";
    var pos = extension.indexOf(searchValue);
    if (pos !== -1) {
      var start = pos + 4;
      var end = start;
      var k = start;
      var done = false;
      while (!done) {
        var e = extension.indexOf("-", k);
        var len = void 0;
        if (e === -1) {
          len = size - k;
        } else {
          len = e - k;
        }
        if (len === 2) {
          done = true;
        } else if (e === -1) {
          end = size;
          done = true;
        } else {
          end = e;
          k = e + 1;
        }
      }
      return extension.slice(start, end);
    }
    searchValue = "-" + key;
    pos = extension.indexOf(searchValue);
    if (pos !== -1 && pos + 3 === size) {
      return "";
    }
    return void 0;
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/ResolveLocale.js
  function ResolveLocale(availableLocales, requestedLocales, options, relevantExtensionKeys, localeData, getDefaultLocale) {
    var matcher = options.localeMatcher;
    var r;
    if (matcher === "lookup") {
      r = LookupMatcher(availableLocales, requestedLocales, getDefaultLocale);
    } else {
      r = BestFitMatcher(availableLocales, requestedLocales, getDefaultLocale);
    }
    var foundLocale = r.locale;
    var result = {locale: "", dataLocale: foundLocale};
    var supportedExtension = "-u";
    for (var _i = 0, relevantExtensionKeys_1 = relevantExtensionKeys; _i < relevantExtensionKeys_1.length; _i++) {
      var key = relevantExtensionKeys_1[_i];
      invariant(foundLocale in localeData, "Missing locale data for " + foundLocale);
      var foundLocaleData = localeData[foundLocale];
      invariant(typeof foundLocaleData === "object" && foundLocaleData !== null, "locale data " + key + " must be an object");
      var keyLocaleData = foundLocaleData[key];
      invariant(Array.isArray(keyLocaleData), "keyLocaleData for " + key + " must be an array");
      var value = keyLocaleData[0];
      invariant(typeof value === "string" || value === null, "value must be string or null but got " + typeof value + " in key " + key);
      var supportedExtensionAddition = "";
      if (r.extension) {
        var requestedValue = UnicodeExtensionValue(r.extension, key);
        if (requestedValue !== void 0) {
          if (requestedValue !== "") {
            if (~keyLocaleData.indexOf(requestedValue)) {
              value = requestedValue;
              supportedExtensionAddition = "-" + key + "-" + value;
            }
          } else if (~requestedValue.indexOf("true")) {
            value = "true";
            supportedExtensionAddition = "-" + key;
          }
        }
      }
      if (key in options) {
        var optionsValue = options[key];
        invariant(typeof optionsValue === "string" || typeof optionsValue === "undefined" || optionsValue === null, "optionsValue must be String, Undefined or Null");
        if (~keyLocaleData.indexOf(optionsValue)) {
          if (optionsValue !== value) {
            value = optionsValue;
            supportedExtensionAddition = "";
          }
        }
      }
      result[key] = value;
      supportedExtension += supportedExtensionAddition;
    }
    if (supportedExtension.length > 2) {
      var privateIndex = foundLocale.indexOf("-x-");
      if (privateIndex === -1) {
        foundLocale = foundLocale + supportedExtension;
      } else {
        var preExtension = foundLocale.slice(0, privateIndex);
        var postExtension = foundLocale.slice(privateIndex, foundLocale.length);
        foundLocale = preExtension + supportedExtension + postExtension;
      }
      foundLocale = Intl.getCanonicalLocales(foundLocale)[0];
    }
    result.locale = foundLocale;
    return result;
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/IsValidTimeZoneName.js
  function IsValidTimeZoneName(tz, _a) {
    var tzData = _a.tzData, uppercaseLinks = _a.uppercaseLinks;
    var uppercasedTz = tz.toUpperCase();
    var zoneNames = new Set();
    Object.keys(tzData).map(function(z) {
      return z.toUpperCase();
    }).forEach(function(z) {
      return zoneNames.add(z);
    });
    return zoneNames.has(uppercasedTz) || uppercasedTz in uppercaseLinks;
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/DefaultNumberOption.js
  function DefaultNumberOption(val, min, max, fallback) {
    if (val !== void 0) {
      val = Number(val);
      if (isNaN(val) || val < min || val > max) {
        throw new RangeError(val + " is outside of range [" + min + ", " + max + "]");
      }
      return Math.floor(val);
    }
    return fallback;
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/GetNumberOption.js
  function GetNumberOption(options, property, minimum, maximum, fallback) {
    var val = options[property];
    return DefaultNumberOption(val, minimum, maximum, fallback);
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/DateTimeFormat/InitializeDateTimeFormat.js
  function isTimeRelated(opt) {
    for (var _i = 0, _a = ["hour", "minute", "second"]; _i < _a.length; _i++) {
      var prop = _a[_i];
      var value = opt[prop];
      if (value !== void 0) {
        return true;
      }
    }
    return false;
  }
  function resolveHourCycle(hc, hcDefault, hour12) {
    if (hc == null) {
      hc = hcDefault;
    }
    if (hour12 !== void 0) {
      if (hour12) {
        if (hcDefault === "h11" || hcDefault === "h23") {
          hc = "h11";
        } else {
          hc = "h12";
        }
      } else {
        invariant(!hour12, "hour12 must not be set");
        if (hcDefault === "h11" || hcDefault === "h23") {
          hc = "h23";
        } else {
          hc = "h24";
        }
      }
    }
    return hc;
  }
  var TYPE_REGEX = /^[a-z0-9]{3,8}$/i;
  function InitializeDateTimeFormat(dtf, locales, opts, _a) {
    var getInternalSlots2 = _a.getInternalSlots, availableLocales = _a.availableLocales, localeData = _a.localeData, getDefaultLocale = _a.getDefaultLocale, getDefaultTimeZone = _a.getDefaultTimeZone, relevantExtensionKeys = _a.relevantExtensionKeys, tzData = _a.tzData, uppercaseLinks = _a.uppercaseLinks;
    var requestedLocales = CanonicalizeLocaleList(locales);
    var options = ToDateTimeOptions(opts, "any", "date");
    var opt = Object.create(null);
    var matcher = GetOption(options, "localeMatcher", "string", ["lookup", "best fit"], "best fit");
    opt.localeMatcher = matcher;
    var calendar = GetOption(options, "calendar", "string", void 0, void 0);
    if (calendar !== void 0 && !TYPE_REGEX.test(calendar)) {
      throw new RangeError("Malformed calendar");
    }
    var internalSlots = getInternalSlots2(dtf);
    opt.ca = calendar;
    var numberingSystem = GetOption(options, "numberingSystem", "string", void 0, void 0);
    if (numberingSystem !== void 0 && !TYPE_REGEX.test(numberingSystem)) {
      throw new RangeError("Malformed numbering system");
    }
    opt.nu = numberingSystem;
    var hour12 = GetOption(options, "hour12", "boolean", void 0, void 0);
    var hourCycle = GetOption(options, "hourCycle", "string", ["h11", "h12", "h23", "h24"], void 0);
    if (hour12 !== void 0) {
      hourCycle = null;
    }
    opt.hc = hourCycle;
    var r = ResolveLocale(availableLocales, requestedLocales, opt, relevantExtensionKeys, localeData, getDefaultLocale);
    internalSlots.locale = r.locale;
    calendar = r.ca;
    internalSlots.calendar = calendar;
    internalSlots.hourCycle = r.hc;
    internalSlots.numberingSystem = r.nu;
    var dataLocale = r.dataLocale;
    internalSlots.dataLocale = dataLocale;
    var timeZone = options.timeZone;
    if (timeZone !== void 0) {
      timeZone = String(timeZone);
      if (!IsValidTimeZoneName(timeZone, {tzData: tzData, uppercaseLinks: uppercaseLinks})) {
        throw new RangeError("Invalid timeZoneName");
      }
      timeZone = CanonicalizeTimeZoneName(timeZone, {tzData: tzData, uppercaseLinks: uppercaseLinks});
    } else {
      timeZone = getDefaultTimeZone();
    }
    internalSlots.timeZone = timeZone;
    opt = Object.create(null);
    opt.weekday = GetOption(options, "weekday", "string", ["narrow", "short", "long"], void 0);
    opt.era = GetOption(options, "era", "string", ["narrow", "short", "long"], void 0);
    opt.year = GetOption(options, "year", "string", ["2-digit", "numeric"], void 0);
    opt.month = GetOption(options, "month", "string", ["2-digit", "numeric", "narrow", "short", "long"], void 0);
    opt.day = GetOption(options, "day", "string", ["2-digit", "numeric"], void 0);
    opt.hour = GetOption(options, "hour", "string", ["2-digit", "numeric"], void 0);
    opt.minute = GetOption(options, "minute", "string", ["2-digit", "numeric"], void 0);
    opt.second = GetOption(options, "second", "string", ["2-digit", "numeric"], void 0);
    opt.timeZoneName = GetOption(options, "timeZoneName", "string", ["short", "long"], void 0);
    opt.fractionalSecondDigits = GetNumberOption(options, "fractionalSecondDigits", 1, 3, void 0);
    var dataLocaleData = localeData[dataLocale];
    invariant(!!dataLocaleData, "Missing locale data for " + dataLocale);
    var formats = dataLocaleData.formats[calendar];
    if (!formats) {
      throw new RangeError('Calendar "' + calendar + '" is not supported. Try setting "calendar" to 1 of the following: ' + Object.keys(dataLocaleData.formats).join(", "));
    }
    var formatMatcher = GetOption(options, "formatMatcher", "string", ["basic", "best fit"], "best fit");
    var dateStyle = GetOption(options, "dateStyle", "string", ["full", "long", "medium", "short"], void 0);
    internalSlots.dateStyle = dateStyle;
    var timeStyle = GetOption(options, "timeStyle", "string", ["full", "long", "medium", "short"], void 0);
    internalSlots.timeStyle = timeStyle;
    var bestFormat;
    if (dateStyle === void 0 && timeStyle === void 0) {
      if (formatMatcher === "basic") {
        bestFormat = BasicFormatMatcher(opt, formats);
      } else {
        if (isTimeRelated(opt)) {
          var hc = resolveHourCycle(internalSlots.hourCycle, dataLocaleData.hourCycle, hour12);
          opt.hour12 = hc === "h11" || hc === "h12";
        }
        bestFormat = BestFitFormatMatcher(opt, formats);
      }
    } else {
      for (var _i = 0, DATE_TIME_PROPS_1 = DATE_TIME_PROPS; _i < DATE_TIME_PROPS_1.length; _i++) {
        var prop = DATE_TIME_PROPS_1[_i];
        var p = opt[prop];
        if (p !== void 0) {
          throw new TypeError("Intl.DateTimeFormat can't set option " + prop + " when " + (dateStyle ? "dateStyle" : "timeStyle") + " is used");
        }
      }
      bestFormat = DateTimeStyleFormat(dateStyle, timeStyle, dataLocaleData);
    }
    internalSlots.format = bestFormat;
    for (var prop in opt) {
      var p = bestFormat[prop];
      if (p !== void 0) {
        internalSlots[prop] = p;
      }
    }
    var pattern;
    var rangePatterns;
    if (internalSlots.hour !== void 0) {
      var hc = resolveHourCycle(internalSlots.hourCycle, dataLocaleData.hourCycle, hour12);
      internalSlots.hourCycle = hc;
      if (hc === "h11" || hc === "h12") {
        pattern = bestFormat.pattern12;
        rangePatterns = bestFormat.rangePatterns12;
      } else {
        pattern = bestFormat.pattern;
        rangePatterns = bestFormat.rangePatterns;
      }
    } else {
      internalSlots.hourCycle = void 0;
      pattern = bestFormat.pattern;
      rangePatterns = bestFormat.rangePatterns;
    }
    internalSlots.pattern = pattern;
    internalSlots.rangePatterns = rangePatterns;
    return dtf;
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/IsSanctionedSimpleUnitIdentifier.js
  var SANCTIONED_UNITS = [
    "angle-degree",
    "area-acre",
    "area-hectare",
    "concentr-percent",
    "digital-bit",
    "digital-byte",
    "digital-gigabit",
    "digital-gigabyte",
    "digital-kilobit",
    "digital-kilobyte",
    "digital-megabit",
    "digital-megabyte",
    "digital-petabyte",
    "digital-terabit",
    "digital-terabyte",
    "duration-day",
    "duration-hour",
    "duration-millisecond",
    "duration-minute",
    "duration-month",
    "duration-second",
    "duration-week",
    "duration-year",
    "length-centimeter",
    "length-foot",
    "length-inch",
    "length-kilometer",
    "length-meter",
    "length-mile-scandinavian",
    "length-mile",
    "length-millimeter",
    "length-yard",
    "mass-gram",
    "mass-kilogram",
    "mass-ounce",
    "mass-pound",
    "mass-stone",
    "temperature-celsius",
    "temperature-fahrenheit",
    "volume-fluid-ounce",
    "volume-gallon",
    "volume-liter",
    "volume-milliliter"
  ];
  function removeUnitNamespace(unit) {
    return unit.slice(unit.indexOf("-") + 1);
  }
  var SIMPLE_UNITS = SANCTIONED_UNITS.map(removeUnitNamespace);

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/regex.generated.js
  var S_UNICODE_REGEX = /[\$\+<->\^`\|~\xA2-\xA6\xA8\xA9\xAC\xAE-\xB1\xB4\xB8\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0384\u0385\u03F6\u0482\u058D-\u058F\u0606-\u0608\u060B\u060E\u060F\u06DE\u06E9\u06FD\u06FE\u07F6\u07FE\u07FF\u09F2\u09F3\u09FA\u09FB\u0AF1\u0B70\u0BF3-\u0BFA\u0C7F\u0D4F\u0D79\u0E3F\u0F01-\u0F03\u0F13\u0F15-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE\u0FCF\u0FD5-\u0FD8\u109E\u109F\u1390-\u1399\u166D\u17DB\u1940\u19DE-\u19FF\u1B61-\u1B6A\u1B74-\u1B7C\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2044\u2052\u207A-\u207C\u208A-\u208C\u20A0-\u20BF\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2307\u230C-\u2328\u232B-\u2426\u2440-\u244A\u249C-\u24E9\u2500-\u2767\u2794-\u27C4\u27C7-\u27E5\u27F0-\u2982\u2999-\u29D7\u29DC-\u29FB\u29FE-\u2B73\u2B76-\u2B95\u2B97-\u2BFF\u2CE5-\u2CEA\u2E50\u2E51\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFB\u3004\u3012\u3013\u3020\u3036\u3037\u303E\u303F\u309B\u309C\u3190\u3191\u3196-\u319F\u31C0-\u31E3\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uAA77-\uAA79\uAB5B\uAB6A\uAB6B\uFB29\uFBB2-\uFBC1\uFDFC\uFDFD\uFE62\uFE64-\uFE66\uFE69\uFF04\uFF0B\uFF1C-\uFF1E\uFF3E\uFF40\uFF5C\uFF5E\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD]|\uD800[\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9C\uDDA0\uDDD0-\uDDFC]|\uD802[\uDC77\uDC78\uDEC8]|\uD805\uDF3F|\uD807[\uDFD5-\uDFF1]|\uD81A[\uDF3C-\uDF3F\uDF45]|\uD82F\uDC9C|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDE8\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85\uDE86]|\uD838[\uDD4F\uDEFF]|\uD83B[\uDCAC\uDCB0\uDD2E\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD0D-\uDDAD\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED7\uDEE0-\uDEEC\uDEF0-\uDEFC\uDF00-\uDF73\uDF80-\uDFD8\uDFE0-\uDFEB]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDCB0\uDCB1\uDD00-\uDD78\uDD7A-\uDDCB\uDDCD-\uDE53\uDE60-\uDE6D\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6\uDF00-\uDF92\uDF94-\uDFCA]/;

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/NumberFormat/format_to_parts.js
  var CARET_S_UNICODE_REGEX = new RegExp("^" + S_UNICODE_REGEX.source);
  var S_DOLLAR_UNICODE_REGEX = new RegExp(S_UNICODE_REGEX.source + "$");

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/LookupSupportedLocales.js
  function LookupSupportedLocales(availableLocales, requestedLocales) {
    var subset = [];
    for (var _i = 0, requestedLocales_1 = requestedLocales; _i < requestedLocales_1.length; _i++) {
      var locale = requestedLocales_1[_i];
      var noExtensionLocale = locale.replace(UNICODE_EXTENSION_SEQUENCE_REGEX, "");
      var availableLocale = BestAvailableLocale(availableLocales, noExtensionLocale);
      if (availableLocale) {
        subset.push(availableLocale);
      }
    }
    return subset;
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/SupportedLocales.js
  function SupportedLocales(availableLocales, requestedLocales, options) {
    var matcher = "best fit";
    if (options !== void 0) {
      options = ToObject(options);
      matcher = GetOption(options, "localeMatcher", "string", ["lookup", "best fit"], "best fit");
    }
    if (matcher === "best fit") {
      return LookupSupportedLocales(availableLocales, requestedLocales);
    }
    return LookupSupportedLocales(availableLocales, requestedLocales);
  }

  // bazel-out/darwin-fastbuild/bin/packages/ecma402-abstract/lib/data.js
  var MissingLocaleDataError = function(_super) {
    __extends(MissingLocaleDataError2, _super);
    function MissingLocaleDataError2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.type = "MISSING_LOCALE_DATA";
      return _this;
    }
    return MissingLocaleDataError2;
  }(Error);

  // bazel-out/darwin-fastbuild/bin/packages/intl-datetimeformat/lib/src/get_internal_slots.js
  var internalSlotMap = new WeakMap();
  function getInternalSlots(x) {
    var internalSlots = internalSlotMap.get(x);
    if (!internalSlots) {
      internalSlots = Object.create(null);
      internalSlotMap.set(x, internalSlots);
    }
    return internalSlots;
  }

  // bazel-out/darwin-fastbuild/bin/packages/intl-datetimeformat/lib/src/data/links.js
  var links_default = {
    "Africa/Asmera": "Africa/Nairobi",
    "Africa/Timbuktu": "Africa/Abidjan",
    "America/Argentina/ComodRivadavia": "America/Argentina/Catamarca",
    "America/Atka": "America/Adak",
    "America/Buenos_Aires": "America/Argentina/Buenos_Aires",
    "America/Catamarca": "America/Argentina/Catamarca",
    "America/Coral_Harbour": "America/Atikokan",
    "America/Cordoba": "America/Argentina/Cordoba",
    "America/Ensenada": "America/Tijuana",
    "America/Fort_Wayne": "America/Indiana/Indianapolis",
    "America/Godthab": "America/Nuuk",
    "America/Indianapolis": "America/Indiana/Indianapolis",
    "America/Jujuy": "America/Argentina/Jujuy",
    "America/Knox_IN": "America/Indiana/Knox",
    "America/Louisville": "America/Kentucky/Louisville",
    "America/Mendoza": "America/Argentina/Mendoza",
    "America/Montreal": "America/Toronto",
    "America/Porto_Acre": "America/Rio_Branco",
    "America/Rosario": "America/Argentina/Cordoba",
    "America/Santa_Isabel": "America/Tijuana",
    "America/Shiprock": "America/Denver",
    "America/Virgin": "America/Port_of_Spain",
    "Antarctica/South_Pole": "Pacific/Auckland",
    "Asia/Ashkhabad": "Asia/Ashgabat",
    "Asia/Calcutta": "Asia/Kolkata",
    "Asia/Chongqing": "Asia/Shanghai",
    "Asia/Chungking": "Asia/Shanghai",
    "Asia/Dacca": "Asia/Dhaka",
    "Asia/Harbin": "Asia/Shanghai",
    "Asia/Kashgar": "Asia/Urumqi",
    "Asia/Katmandu": "Asia/Kathmandu",
    "Asia/Macao": "Asia/Macau",
    "Asia/Rangoon": "Asia/Yangon",
    "Asia/Saigon": "Asia/Ho_Chi_Minh",
    "Asia/Tel_Aviv": "Asia/Jerusalem",
    "Asia/Thimbu": "Asia/Thimphu",
    "Asia/Ujung_Pandang": "Asia/Makassar",
    "Asia/Ulan_Bator": "Asia/Ulaanbaatar",
    "Atlantic/Faeroe": "Atlantic/Faroe",
    "Atlantic/Jan_Mayen": "Europe/Oslo",
    "Australia/ACT": "Australia/Sydney",
    "Australia/Canberra": "Australia/Sydney",
    "Australia/Currie": "Australia/Hobart",
    "Australia/LHI": "Australia/Lord_Howe",
    "Australia/NSW": "Australia/Sydney",
    "Australia/North": "Australia/Darwin",
    "Australia/Queensland": "Australia/Brisbane",
    "Australia/South": "Australia/Adelaide",
    "Australia/Tasmania": "Australia/Hobart",
    "Australia/Victoria": "Australia/Melbourne",
    "Australia/West": "Australia/Perth",
    "Australia/Yancowinna": "Australia/Broken_Hill",
    "Brazil/Acre": "America/Rio_Branco",
    "Brazil/DeNoronha": "America/Noronha",
    "Brazil/East": "America/Sao_Paulo",
    "Brazil/West": "America/Manaus",
    "Canada/Atlantic": "America/Halifax",
    "Canada/Central": "America/Winnipeg",
    "Canada/Eastern": "America/Toronto",
    "Canada/Mountain": "America/Edmonton",
    "Canada/Newfoundland": "America/St_Johns",
    "Canada/Pacific": "America/Vancouver",
    "Canada/Saskatchewan": "America/Regina",
    "Canada/Yukon": "America/Whitehorse",
    "Chile/Continental": "America/Santiago",
    "Chile/EasterIsland": "Pacific/Easter",
    "Cuba": "America/Havana",
    "Egypt": "Africa/Cairo",
    "Eire": "Europe/Dublin",
    "Etc/UCT": "Etc/UTC",
    "Europe/Belfast": "Europe/London",
    "Europe/Tiraspol": "Europe/Chisinau",
    "GB": "Europe/London",
    "GB-Eire": "Europe/London",
    "GMT+0": "Etc/GMT",
    "GMT-0": "Etc/GMT",
    "GMT0": "Etc/GMT",
    "Greenwich": "Etc/GMT",
    "Hongkong": "Asia/Hong_Kong",
    "Iceland": "Atlantic/Reykjavik",
    "Iran": "Asia/Tehran",
    "Israel": "Asia/Jerusalem",
    "Jamaica": "America/Jamaica",
    "Japan": "Asia/Tokyo",
    "Kwajalein": "Pacific/Kwajalein",
    "Libya": "Africa/Tripoli",
    "Mexico/BajaNorte": "America/Tijuana",
    "Mexico/BajaSur": "America/Mazatlan",
    "Mexico/General": "America/Mexico_City",
    "NZ": "Pacific/Auckland",
    "NZ-CHAT": "Pacific/Chatham",
    "Navajo": "America/Denver",
    "PRC": "Asia/Shanghai",
    "Pacific/Johnston": "Pacific/Honolulu",
    "Pacific/Ponape": "Pacific/Pohnpei",
    "Pacific/Samoa": "Pacific/Pago_Pago",
    "Pacific/Truk": "Pacific/Chuuk",
    "Pacific/Yap": "Pacific/Chuuk",
    "Poland": "Europe/Warsaw",
    "Portugal": "Europe/Lisbon",
    "ROC": "Asia/Taipei",
    "ROK": "Asia/Seoul",
    "Singapore": "Asia/Singapore",
    "Turkey": "Europe/Istanbul",
    "UCT": "Etc/UTC",
    "US/Alaska": "America/Anchorage",
    "US/Aleutian": "America/Adak",
    "US/Arizona": "America/Phoenix",
    "US/Central": "America/Chicago",
    "US/East-Indiana": "America/Indiana/Indianapolis",
    "US/Eastern": "America/New_York",
    "US/Hawaii": "Pacific/Honolulu",
    "US/Indiana-Starke": "America/Indiana/Knox",
    "US/Michigan": "America/Detroit",
    "US/Mountain": "America/Denver",
    "US/Pacific": "America/Los_Angeles",
    "US/Samoa": "Pacific/Pago_Pago",
    "UTC": "Etc/UTC",
    "Universal": "Etc/UTC",
    "W-SU": "Europe/Moscow",
    "Zulu": "Etc/UTC"
  };

  // bazel-out/darwin-fastbuild/bin/packages/intl-datetimeformat/lib/src/packer.js
  function unpack(data) {
    var abbrvs = data.abbrvs.split("|");
    var offsets = data.offsets.split("|").map(function(n) {
      return parseInt(n, 36);
    });
    var packedZones = data.zones;
    var zones = {};
    for (var _i = 0, packedZones_1 = packedZones; _i < packedZones_1.length; _i++) {
      var d = packedZones_1[_i];
      var _a = d.split("|"), zone = _a[0], zoneData = _a.slice(1);
      zones[zone] = zoneData.map(function(z) {
        return z.split(",");
      }).map(function(_a2) {
        var ts = _a2[0], abbrvIndex = _a2[1], offsetIndex = _a2[2], dst = _a2[3];
        return [
          ts === "" ? -Infinity : parseInt(ts, 36),
          abbrvs[+abbrvIndex],
          offsets[+offsetIndex],
          dst === "1"
        ];
      });
    }
    return zones;
  }

  // bazel-out/darwin-fastbuild/bin/packages/intl-datetimeformat/lib/src/core.js
  var UPPERCASED_LINKS = Object.keys(links_default).reduce(function(all, l) {
    all[l.toUpperCase()] = links_default[l];
    return all;
  }, {});
  var RESOLVED_OPTIONS_KEYS = [
    "locale",
    "calendar",
    "numberingSystem",
    "dateStyle",
    "timeStyle",
    "timeZone",
    "hourCycle",
    "weekday",
    "era",
    "year",
    "month",
    "day",
    "hour",
    "minute",
    "second",
    "timeZoneName"
  ];
  var formatDescriptor = {
    enumerable: false,
    configurable: true,
    get: function() {
      if (typeof this !== "object" || !OrdinaryHasInstance(DateTimeFormat, this)) {
        throw TypeError("Intl.DateTimeFormat format property accessor called on incompatible receiver");
      }
      var internalSlots = getInternalSlots(this);
      var dtf = this;
      var boundFormat = internalSlots.boundFormat;
      if (boundFormat === void 0) {
        boundFormat = function(date) {
          var x;
          if (date === void 0) {
            x = Date.now();
          } else {
            x = Number(date);
          }
          return FormatDateTime(dtf, x, {
            getInternalSlots: getInternalSlots,
            localeData: DateTimeFormat.localeData,
            tzData: DateTimeFormat.tzData,
            getDefaultTimeZone: DateTimeFormat.getDefaultTimeZone
          });
        };
        try {
          Object.defineProperty(boundFormat, "name", {
            configurable: true,
            enumerable: false,
            writable: false,
            value: ""
          });
        } catch (e) {
        }
        internalSlots.boundFormat = boundFormat;
      }
      return boundFormat;
    }
  };
  try {
    Object.defineProperty(formatDescriptor.get, "name", {
      configurable: true,
      enumerable: false,
      writable: false,
      value: "get format"
    });
  } catch (e) {
  }
  var DateTimeFormat = function(locales, options) {
    if (!this || !OrdinaryHasInstance(DateTimeFormat, this)) {
      return new DateTimeFormat(locales, options);
    }
    InitializeDateTimeFormat(this, locales, options, {
      tzData: DateTimeFormat.tzData,
      uppercaseLinks: UPPERCASED_LINKS,
      availableLocales: DateTimeFormat.availableLocales,
      relevantExtensionKeys: DateTimeFormat.relevantExtensionKeys,
      getDefaultLocale: DateTimeFormat.getDefaultLocale,
      getDefaultTimeZone: DateTimeFormat.getDefaultTimeZone,
      getInternalSlots: getInternalSlots,
      localeData: DateTimeFormat.localeData
    });
    var internalSlots = getInternalSlots(this);
    var dataLocale = internalSlots.dataLocale;
    var dataLocaleData = DateTimeFormat.localeData[dataLocale];
    invariant(dataLocaleData !== void 0, "Cannot load locale-dependent data for " + dataLocale + ".");
  };
  defineProperty(DateTimeFormat, "supportedLocalesOf", {
    value: function supportedLocalesOf(locales, options) {
      return SupportedLocales(DateTimeFormat.availableLocales, CanonicalizeLocaleList(locales), options);
    }
  });
  defineProperty(DateTimeFormat.prototype, "resolvedOptions", {
    value: function resolvedOptions() {
      if (typeof this !== "object" || !OrdinaryHasInstance(DateTimeFormat, this)) {
        throw TypeError("Method Intl.DateTimeFormat.prototype.resolvedOptions called on incompatible receiver");
      }
      var internalSlots = getInternalSlots(this);
      var ro = {};
      for (var _i = 0, RESOLVED_OPTIONS_KEYS_1 = RESOLVED_OPTIONS_KEYS; _i < RESOLVED_OPTIONS_KEYS_1.length; _i++) {
        var key = RESOLVED_OPTIONS_KEYS_1[_i];
        var value = internalSlots[key];
        if (key === "hourCycle") {
          var hour12 = value === "h11" || value === "h12" ? true : value === "h23" || value === "h24" ? false : void 0;
          if (hour12 !== void 0) {
            ro.hour12 = hour12;
          }
        }
        if (DATE_TIME_PROPS.indexOf(key) > -1) {
          if (internalSlots.dateStyle !== void 0 || internalSlots.timeStyle !== void 0) {
            value = void 0;
          }
        }
        if (value !== void 0) {
          ro[key] = value;
        }
      }
      return ro;
    }
  });
  defineProperty(DateTimeFormat.prototype, "formatToParts", {
    value: function formatToParts2(date) {
      if (date === void 0) {
        date = Date.now();
      } else {
        date = ToNumber(date);
      }
      return FormatDateTimeToParts(this, date, {
        getInternalSlots: getInternalSlots,
        localeData: DateTimeFormat.localeData,
        tzData: DateTimeFormat.tzData,
        getDefaultTimeZone: DateTimeFormat.getDefaultTimeZone
      });
    }
  });
  defineProperty(DateTimeFormat.prototype, "formatRangeToParts", {
    value: function formatRangeToParts(startDate, endDate) {
      var dtf = this;
      if (typeof dtf !== "object") {
        throw new TypeError();
      }
      if (startDate === void 0 || endDate === void 0) {
        throw new TypeError("startDate/endDate cannot be undefined");
      }
      var x = ToNumber(startDate);
      var y = ToNumber(endDate);
      return FormatDateTimeRangeToParts(dtf, x, y, {
        getInternalSlots: getInternalSlots,
        localeData: DateTimeFormat.localeData,
        tzData: DateTimeFormat.tzData,
        getDefaultTimeZone: DateTimeFormat.getDefaultTimeZone
      });
    }
  });
  defineProperty(DateTimeFormat.prototype, "formatRange", {
    value: function formatRange(startDate, endDate) {
      var dtf = this;
      if (typeof dtf !== "object") {
        throw new TypeError();
      }
      if (startDate === void 0 || endDate === void 0) {
        throw new TypeError("startDate/endDate cannot be undefined");
      }
      var x = ToNumber(startDate);
      var y = ToNumber(endDate);
      return FormatDateTimeRange(dtf, x, y, {
        getInternalSlots: getInternalSlots,
        localeData: DateTimeFormat.localeData,
        tzData: DateTimeFormat.tzData,
        getDefaultTimeZone: DateTimeFormat.getDefaultTimeZone
      });
    }
  });
  var DEFAULT_TIMEZONE = "UTC";
  DateTimeFormat.__setDefaultTimeZone = function(timeZone) {
    if (timeZone !== void 0) {
      timeZone = String(timeZone);
      if (!IsValidTimeZoneName(timeZone, {
        tzData: DateTimeFormat.tzData,
        uppercaseLinks: UPPERCASED_LINKS
      })) {
        throw new RangeError("Invalid timeZoneName");
      }
      timeZone = CanonicalizeTimeZoneName(timeZone, {
        tzData: DateTimeFormat.tzData,
        uppercaseLinks: UPPERCASED_LINKS
      });
    } else {
      timeZone = DEFAULT_TIMEZONE;
    }
    DateTimeFormat.__defaultTimeZone = timeZone;
  };
  DateTimeFormat.relevantExtensionKeys = ["nu", "ca", "hc"];
  DateTimeFormat.__defaultTimeZone = DEFAULT_TIMEZONE;
  DateTimeFormat.getDefaultTimeZone = function() {
    return DateTimeFormat.__defaultTimeZone;
  };
  DateTimeFormat.__addLocaleData = function __addLocaleData() {
    var data = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      data[_i] = arguments[_i];
    }
    var _loop_1 = function(d2, locale2) {
      var dateFormat = d2.dateFormat, timeFormat = d2.timeFormat, dateTimeFormat = d2.dateTimeFormat, formats = d2.formats, intervalFormats = d2.intervalFormats, rawData = __rest(d2, ["dateFormat", "timeFormat", "dateTimeFormat", "formats", "intervalFormats"]);
      var processedData = __assign(__assign({}, rawData), {dateFormat: {
        full: parseDateTimeSkeleton(dateFormat.full),
        long: parseDateTimeSkeleton(dateFormat.long),
        medium: parseDateTimeSkeleton(dateFormat.medium),
        short: parseDateTimeSkeleton(dateFormat.short)
      }, timeFormat: {
        full: parseDateTimeSkeleton(timeFormat.full),
        long: parseDateTimeSkeleton(timeFormat.long),
        medium: parseDateTimeSkeleton(timeFormat.medium),
        short: parseDateTimeSkeleton(timeFormat.short)
      }, dateTimeFormat: {
        full: parseDateTimeSkeleton(dateTimeFormat.full).pattern,
        long: parseDateTimeSkeleton(dateTimeFormat.long).pattern,
        medium: parseDateTimeSkeleton(dateTimeFormat.medium).pattern,
        short: parseDateTimeSkeleton(dateTimeFormat.short).pattern
      }, formats: {}});
      var _loop_2 = function(calendar2) {
        processedData.formats[calendar2] = Object.keys(formats[calendar2]).map(function(skeleton) {
          return parseDateTimeSkeleton(skeleton, formats[calendar2][skeleton], intervalFormats[skeleton], intervalFormats.intervalFormatFallback);
        });
      };
      for (var calendar in formats) {
        _loop_2(calendar);
      }
      var minimizedLocale = new Intl.Locale(locale2).minimize().toString();
      DateTimeFormat.localeData[locale2] = DateTimeFormat.localeData[minimizedLocale] = processedData;
      DateTimeFormat.availableLocales.add(locale2);
      DateTimeFormat.availableLocales.add(minimizedLocale);
      if (!DateTimeFormat.__defaultLocale) {
        DateTimeFormat.__defaultLocale = minimizedLocale;
      }
    };
    for (var _a = 0, data_1 = data; _a < data_1.length; _a++) {
      var _b = data_1[_a], d = _b.data, locale = _b.locale;
      _loop_1(d, locale);
    }
  };
  Object.defineProperty(DateTimeFormat.prototype, "format", formatDescriptor);
  DateTimeFormat.__defaultLocale = "";
  DateTimeFormat.localeData = {};
  DateTimeFormat.availableLocales = new Set();
  DateTimeFormat.getDefaultLocale = function() {
    return DateTimeFormat.__defaultLocale;
  };
  DateTimeFormat.polyfilled = true;
  DateTimeFormat.tzData = {};
  DateTimeFormat.__addTZData = function(d) {
    DateTimeFormat.tzData = unpack(d);
  };
  try {
    if (typeof Symbol !== "undefined") {
      Object.defineProperty(DateTimeFormat.prototype, Symbol.toStringTag, {
        value: "Intl.DateTimeFormat",
        writable: false,
        enumerable: false,
        configurable: true
      });
    }
    Object.defineProperty(DateTimeFormat.prototype.constructor, "length", {
      value: 1,
      writable: false,
      enumerable: false,
      configurable: true
    });
  } catch (e) {
  }

  // bazel-out/darwin-fastbuild/bin/packages/intl-datetimeformat/lib/should-polyfill.js
  function supportsDateStyle() {
    try {
      return !!new Intl.DateTimeFormat(void 0, {
        dateStyle: "short"
      }).resolvedOptions().dateStyle;
    } catch (e) {
      return false;
    }
  }
  function hasChromeLt71Bug() {
    try {
      return new Intl.DateTimeFormat("en", {
        hourCycle: "h11",
        hour: "numeric"
      }).formatToParts(0)[2].type !== "dayPeriod";
    } catch (e) {
      return false;
    }
  }
  function hasUnthrownDateTimeStyleBug() {
    try {
      return !!new Intl.DateTimeFormat("en", {
        dateStyle: "short",
        hour: "numeric"
      }).format(new Date(0));
    } catch (e) {
      return false;
    }
  }
  function shouldPolyfill() {
    return !("DateTimeFormat" in Intl) || !("formatToParts" in Intl.DateTimeFormat.prototype) || !("formatRange" in Intl.DateTimeFormat.prototype) || hasChromeLt71Bug() || hasUnthrownDateTimeStyleBug() || !supportsDateStyle();
  }

  // bazel-out/darwin-fastbuild/bin/packages/intl-datetimeformat/lib/src/to_locale_string.js
  function toLocaleString(x, locales, options) {
    var dtf = new DateTimeFormat(locales, options);
    return dtf.format(x);
  }
  function toLocaleDateString(x, locales, options) {
    var dtf = new DateTimeFormat(locales, ToDateTimeOptions(options, "date", "date"));
    return dtf.format(x);
  }
  function toLocaleTimeString(x, locales, options) {
    var dtf = new DateTimeFormat(locales, ToDateTimeOptions(options, "time", "time"));
    return dtf.format(x);
  }

  // bazel-out/darwin-fastbuild/bin/packages/intl-datetimeformat/lib/polyfill.js
  if (shouldPolyfill()) {
    defineProperty(Intl, "DateTimeFormat", {value: DateTimeFormat});
    defineProperty(Date.prototype, "toLocaleString", {
      value: function toLocaleString2(locales, options) {
        return toLocaleString(this, locales, options);
      }
    });
    defineProperty(Date.prototype, "toLocaleDateString", {
      value: function toLocaleDateString2(locales, options) {
        return toLocaleDateString(this, locales, options);
      }
    });
    defineProperty(Date.prototype, "toLocaleTimeString", {
      value: function toLocaleTimeString2(locales, options) {
        return toLocaleTimeString(this, locales, options);
      }
    });
  }
})();
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */


// Intl.DateTimeFormat.~locale.en
/* @generated */

  // prettier-ignore
  if (Intl.DateTimeFormat && typeof Intl.DateTimeFormat.__addLocaleData === 'function') {
    Intl.DateTimeFormat.__addLocaleData({"data":{"am":"AM","pm":"PM","weekday":{"narrow":["S","M","T","W","T","F","S"],"short":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],"long":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},"era":{"narrow":{"BC":"B","AD":"A"},"short":{"BC":"BC","AD":"AD"},"long":{"BC":"Before Christ","AD":"Anno Domini"}},"month":{"narrow":["J","F","M","A","M","J","J","A","S","O","N","D"],"short":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],"long":["January","February","March","April","May","June","July","August","September","October","November","December"]},"timeZoneName":{"America/Rio_Branco":{"long":["Acre Standard Time","Acre Summer Time"]},"Asia/Kabul":{"long":["Afghanistan Time","Afghanistan Time"]},"Africa/Maputo":{"long":["Central Africa Time","Central Africa Time"]},"Africa/Bujumbura":{"long":["Central Africa Time","Central Africa Time"]},"Africa/Gaborone":{"long":["Central Africa Time","Central Africa Time"]},"Africa/Lubumbashi":{"long":["Central Africa Time","Central Africa Time"]},"Africa/Blantyre":{"long":["Central Africa Time","Central Africa Time"]},"Africa/Kigali":{"long":["Central Africa Time","Central Africa Time"]},"Africa/Lusaka":{"long":["Central Africa Time","Central Africa Time"]},"Africa/Harare":{"long":["Central Africa Time","Central Africa Time"]},"Africa/Nairobi":{"long":["East Africa Time","East Africa Time"]},"Africa/Djibouti":{"long":["East Africa Time","East Africa Time"]},"Africa/Asmera":{"long":["East Africa Time","East Africa Time"]},"Africa/Addis_Ababa":{"long":["East Africa Time","East Africa Time"]},"Indian/Comoro":{"long":["East Africa Time","East Africa Time"]},"Indian/Antananarivo":{"long":["East Africa Time","East Africa Time"]},"Africa/Mogadishu":{"long":["East Africa Time","East Africa Time"]},"Africa/Dar_es_Salaam":{"long":["East Africa Time","East Africa Time"]},"Africa/Kampala":{"long":["East Africa Time","East Africa Time"]},"Indian/Mayotte":{"long":["East Africa Time","East Africa Time"]},"Africa/Johannesburg":{"long":["South Africa Standard Time","South Africa Standard Time"]},"Africa/Maseru":{"long":["South Africa Standard Time","South Africa Standard Time"]},"Africa/Mbabane":{"long":["South Africa Standard Time","South Africa Standard Time"]},"Africa/Lagos":{"long":["West Africa Standard Time","West Africa Summer Time"]},"Africa/Luanda":{"long":["West Africa Standard Time","West Africa Summer Time"]},"Africa/Porto-Novo":{"long":["West Africa Standard Time","West Africa Summer Time"]},"Africa/Kinshasa":{"long":["West Africa Standard Time","West Africa Summer Time"]},"Africa/Bangui":{"long":["West Africa Standard Time","West Africa Summer Time"]},"Africa/Brazzaville":{"long":["West Africa Standard Time","West Africa Summer Time"]},"Africa/Douala":{"long":["West Africa Standard Time","West Africa Summer Time"]},"Africa/Libreville":{"long":["West Africa Standard Time","West Africa Summer Time"]},"Africa/Malabo":{"long":["West Africa Standard Time","West Africa Summer Time"]},"Africa/Niamey":{"long":["West Africa Standard Time","West Africa Summer Time"]},"Africa/Ndjamena":{"long":["West Africa Standard Time","West Africa Summer Time"]},"Asia/Aqtobe":{"long":["West Kazakhstan Time","West Kazakhstan Time"]},"America/Juneau":{"long":["Alaska Standard Time","Alaska Daylight Time"],"short":["AKST","AKDT"]},"Asia/Almaty":{"long":["East Kazakhstan Time","East Kazakhstan Time"]},"America/Manaus":{"long":["Amazon Standard Time","Amazon Summer Time"]},"America/Chicago":{"long":["Central Standard Time","Central Daylight Time"],"short":["CST","CDT"]},"America/Belize":{"long":["Central Standard Time","Central Daylight Time"],"short":["CST","CDT"]},"America/Winnipeg":{"long":["Central Standard Time","Central Daylight Time"],"short":["CST","CDT"]},"America/Costa_Rica":{"long":["Central Standard Time","Central Daylight Time"],"short":["CST","CDT"]},"America/Guatemala":{"long":["Central Standard Time","Central Daylight Time"],"short":["CST","CDT"]},"America/Tegucigalpa":{"long":["Central Standard Time","Central Daylight Time"],"short":["CST","CDT"]},"America/Mexico_City":{"long":["Central Standard Time","Central Daylight Time"],"short":["CST","CDT"]},"America/El_Salvador":{"long":["Central Standard Time","Central Daylight Time"],"short":["CST","CDT"]},"America/New_York":{"long":["Eastern Standard Time","Eastern Daylight Time"],"short":["EST","EDT"]},"America/Nassau":{"long":["Eastern Standard Time","Eastern Daylight Time"],"short":["EST","EDT"]},"America/Toronto":{"long":["Eastern Standard Time","Eastern Daylight Time"],"short":["EST","EDT"]},"America/Port-au-Prince":{"long":["Eastern Standard Time","Eastern Daylight Time"],"short":["EST","EDT"]},"America/Jamaica":{"long":["Eastern Standard Time","Eastern Daylight Time"],"short":["EST","EDT"]},"America/Cayman":{"long":["Eastern Standard Time","Eastern Daylight Time"],"short":["EST","EDT"]},"America/Panama":{"long":["Eastern Standard Time","Eastern Daylight Time"],"short":["EST","EDT"]},"America/Denver":{"long":["Mountain Standard Time","Mountain Daylight Time"],"short":["MST","MDT"]},"America/Edmonton":{"long":["Mountain Standard Time","Mountain Daylight Time"],"short":["MST","MDT"]},"America/Hermosillo":{"long":["Mountain Standard Time","Mountain Daylight Time"],"short":["MST","MDT"]},"America/Los_Angeles":{"long":["Pacific Standard Time","Pacific Daylight Time"],"short":["PST","PDT"]},"America/Vancouver":{"long":["Pacific Standard Time","Pacific Daylight Time"],"short":["PST","PDT"]},"America/Tijuana":{"long":["Pacific Standard Time","Pacific Daylight Time"],"short":["PST","PDT"]},"Asia/Anadyr":{"long":["Anadyr Standard Time","Anadyr Summer Time"]},"Pacific/Apia":{"long":["Apia Standard Time","Apia Daylight Time"]},"Asia/Riyadh":{"long":["Arabian Standard Time","Arabian Daylight Time"]},"Asia/Bahrain":{"long":["Arabian Standard Time","Arabian Daylight Time"]},"Asia/Baghdad":{"long":["Arabian Standard Time","Arabian Daylight Time"]},"Asia/Kuwait":{"long":["Arabian Standard Time","Arabian Daylight Time"]},"Asia/Qatar":{"long":["Arabian Standard Time","Arabian Daylight Time"]},"Asia/Aden":{"long":["Arabian Standard Time","Arabian Daylight Time"]},"America/Buenos_Aires":{"long":["Argentina Standard Time","Argentina Summer Time"]},"America/Argentina/San_Luis":{"long":["Western Argentina Standard Time","Western Argentina Summer Time"]},"Asia/Ashgabat":{"long":["Turkmenistan Standard Time","Turkmenistan Summer Time"]},"America/Halifax":{"long":["Atlantic Standard Time","Atlantic Daylight Time"],"short":["AST","ADT"]},"America/Antigua":{"long":["Atlantic Standard Time","Atlantic Daylight Time"],"short":["AST","ADT"]},"America/Anguilla":{"long":["Atlantic Standard Time","Atlantic Daylight Time"],"short":["AST","ADT"]},"America/Aruba":{"long":["Atlantic Standard Time","Atlantic Daylight Time"],"short":["AST","ADT"]},"America/Barbados":{"long":["Atlantic Standard Time","Atlantic Daylight Time"],"short":["AST","ADT"]},"Atlantic/Bermuda":{"long":["Atlantic Standard Time","Atlantic Daylight Time"],"short":["AST","ADT"]},"America/Kralendijk":{"long":["Atlantic Standard Time","Atlantic Daylight Time"],"short":["AST","ADT"]},"America/Curacao":{"long":["Atlantic Standard Time","Atlantic Daylight Time"],"short":["AST","ADT"]},"America/Dominica":{"long":["Atlantic Standard Time","Atlantic Daylight Time"],"short":["AST","ADT"]},"America/Grenada":{"long":["Atlantic Standard Time","Atlantic Daylight Time"],"short":["AST","ADT"]},"America/Thule":{"long":["Atlantic Standard Time","Atlantic Daylight Time"],"short":["AST","ADT"]},"America/Guadeloupe":{"long":["Atlantic Standard Time","Atlantic Daylight Time"],"short":["AST","ADT"]},"America/St_Kitts":{"long":["Atlantic Standard Time","Atlantic Daylight Time"],"short":["AST","ADT"]},"America/St_Lucia":{"long":["Atlantic Standard Time","Atlantic Daylight Time"],"short":["AST","ADT"]},"America/Marigot":{"long":["Atlantic Standard Time","Atlantic Daylight Time"],"short":["AST","ADT"]},"America/Martinique":{"long":["Atlantic Standard Time","Atlantic Daylight Time"],"short":["AST","ADT"]},"America/Montserrat":{"long":["Atlantic Standard Time","Atlantic Daylight Time"],"short":["AST","ADT"]},"America/Puerto_Rico":{"long":["Atlantic Standard Time","Atlantic Daylight Time"],"short":["AST","ADT"]},"America/Lower_Princes":{"long":["Atlantic Standard Time","Atlantic Daylight Time"],"short":["AST","ADT"]},"America/Port_of_Spain":{"long":["Atlantic Standard Time","Atlantic Daylight Time"],"short":["AST","ADT"]},"America/St_Vincent":{"long":["Atlantic Standard Time","Atlantic Daylight Time"],"short":["AST","ADT"]},"America/Tortola":{"long":["Atlantic Standard Time","Atlantic Daylight Time"],"short":["AST","ADT"]},"America/St_Thomas":{"long":["Atlantic Standard Time","Atlantic Daylight Time"],"short":["AST","ADT"]},"Australia/Adelaide":{"long":["Australian Central Standard Time","Australian Central Daylight Time"]},"Australia/Eucla":{"long":["Australian Central Western Standard Time","Australian Central Western Daylight Time"]},"Australia/Sydney":{"long":["Australian Eastern Standard Time","Australian Eastern Daylight Time"]},"Australia/Perth":{"long":["Australian Western Standard Time","Australian Western Daylight Time"]},"Atlantic/Azores":{"long":["Azores Standard Time","Azores Summer Time"]},"Asia/Thimphu":{"long":["Bhutan Time","Bhutan Time"]},"America/La_Paz":{"long":["Bolivia Time","Bolivia Time"]},"Asia/Kuching":{"long":["Malaysia Time","Malaysia Time"]},"America/Sao_Paulo":{"long":["Brasilia Standard Time","Brasilia Summer Time"]},"Europe/London":{"long":["Greenwich Mean Time","Greenwich Mean Time"],"short":["GMT","GMT"]},"Asia/Brunei":{"long":["Brunei Darussalam Time","Brunei Darussalam Time"]},"Atlantic/Cape_Verde":{"long":["Cape Verde Standard Time","Cape Verde Summer Time"]},"Antarctica/Casey":{"long":["Casey Time","Casey Time"]},"Pacific/Saipan":{"long":["North Mariana Islands Time","North Mariana Islands Time"]},"Pacific/Guam":{"long":["Guam Standard Time","Guam Standard Time"]},"Pacific/Chatham":{"long":["Chatham Standard Time","Chatham Daylight Time"]},"America/Santiago":{"long":["Chile Standard Time","Chile Summer Time"]},"Asia/Shanghai":{"long":["China Standard Time","China Daylight Time"]},"Asia/Choibalsan":{"long":["Choibalsan Standard Time","Choibalsan Summer Time"]},"Indian/Christmas":{"long":["Christmas Island Time","Christmas Island Time"]},"Indian/Cocos":{"long":["Cocos Islands Time","Cocos Islands Time"]},"America/Bogota":{"long":["Colombia Standard Time","Colombia Summer Time"]},"Pacific/Rarotonga":{"long":["Cook Islands Standard Time","Cook Islands Half Summer Time"]},"America/Havana":{"long":["Cuba Standard Time","Cuba Daylight Time"]},"Antarctica/Davis":{"long":["Davis Time","Davis Time"]},"Antarctica/DumontDUrville":{"long":["Dumont-d’Urville Time","Dumont-d’Urville Time"]},"Asia/Dushanbe":{"long":["Tajikistan Time","Tajikistan Time"]},"America/Paramaribo":{"long":["Suriname Time","Suriname Time"]},"Asia/Dili":{"long":["East Timor Time","East Timor Time"]},"Pacific/Easter":{"long":["Easter Island Standard Time","Easter Island Summer Time"]},"America/Guayaquil":{"long":["Ecuador Time","Ecuador Time"]},"Europe/Paris":{"long":["Central European Standard Time","Central European Summer Time"]},"Europe/Andorra":{"long":["Central European Standard Time","Central European Summer Time"]},"Europe/Tirane":{"long":["Central European Standard Time","Central European Summer Time"]},"Europe/Vienna":{"long":["Central European Standard Time","Central European Summer Time"]},"Europe/Sarajevo":{"long":["Central European Standard Time","Central European Summer Time"]},"Europe/Brussels":{"long":["Central European Standard Time","Central European Summer Time"]},"Europe/Zurich":{"long":["Central European Standard Time","Central European Summer Time"]},"Europe/Prague":{"long":["Central European Standard Time","Central European Summer Time"]},"Europe/Berlin":{"long":["Central European Standard Time","Central European Summer Time"]},"Europe/Copenhagen":{"long":["Central European Standard Time","Central European Summer Time"]},"Europe/Madrid":{"long":["Central European Standard Time","Central European Summer Time"]},"Europe/Gibraltar":{"long":["Central European Standard Time","Central European Summer Time"]},"Europe/Zagreb":{"long":["Central European Standard Time","Central European Summer Time"]},"Europe/Budapest":{"long":["Central European Standard Time","Central European Summer Time"]},"Europe/Rome":{"long":["Central European Standard Time","Central European Summer Time"]},"Europe/Vaduz":{"long":["Central European Standard Time","Central European Summer Time"]},"Europe/Luxembourg":{"long":["Central European Standard Time","Central European Summer Time"]},"Europe/Monaco":{"long":["Central European Standard Time","Central European Summer Time"]},"Europe/Podgorica":{"long":["Central European Standard Time","Central European Summer Time"]},"Europe/Skopje":{"long":["Central European Standard Time","Central European Summer Time"]},"Europe/Malta":{"long":["Central European Standard Time","Central European Summer Time"]},"Europe/Amsterdam":{"long":["Central European Standard Time","Central European Summer Time"]},"Europe/Oslo":{"long":["Central European Standard Time","Central European Summer Time"]},"Europe/Warsaw":{"long":["Central European Standard Time","Central European Summer Time"]},"Europe/Belgrade":{"long":["Central European Standard Time","Central European Summer Time"]},"Europe/Stockholm":{"long":["Central European Standard Time","Central European Summer Time"]},"Europe/Ljubljana":{"long":["Central European Standard Time","Central European Summer Time"]},"Arctic/Longyearbyen":{"long":["Central European Standard Time","Central European Summer Time"]},"Europe/Bratislava":{"long":["Central European Standard Time","Central European Summer Time"]},"Europe/San_Marino":{"long":["Central European Standard Time","Central European Summer Time"]},"Africa/Tunis":{"long":["Central European Standard Time","Central European Summer Time"]},"Europe/Vatican":{"long":["Central European Standard Time","Central European Summer Time"]},"Europe/Bucharest":{"long":["Eastern European Standard Time","Eastern European Summer Time"]},"Europe/Mariehamn":{"long":["Eastern European Standard Time","Eastern European Summer Time"]},"Europe/Sofia":{"long":["Eastern European Standard Time","Eastern European Summer Time"]},"Asia/Nicosia":{"long":["Eastern European Standard Time","Eastern European Summer Time"]},"Africa/Cairo":{"long":["Eastern European Standard Time","Eastern European Summer Time"]},"Europe/Helsinki":{"long":["Eastern European Standard Time","Eastern European Summer Time"]},"Europe/Athens":{"long":["Eastern European Standard Time","Eastern European Summer Time"]},"Asia/Amman":{"long":["Eastern European Standard Time","Eastern European Summer Time"]},"Asia/Beirut":{"long":["Eastern European Standard Time","Eastern European Summer Time"]},"Asia/Damascus":{"long":["Eastern European Standard Time","Eastern European Summer Time"]},"Europe/Minsk":{"long":["Further-eastern European Time","Further-eastern European Time"]},"Europe/Kaliningrad":{"long":["Further-eastern European Time","Further-eastern European Time"]},"Atlantic/Canary":{"long":["Western European Standard Time","Western European Summer Time"]},"Atlantic/Faeroe":{"long":["Western European Standard Time","Western European Summer Time"]},"Atlantic/Stanley":{"long":["Falkland Islands Standard Time","Falkland Islands Summer Time"]},"Pacific/Fiji":{"long":["Fiji Standard Time","Fiji Summer Time"]},"America/Cayenne":{"long":["French Guiana Time","French Guiana Time"]},"Indian/Kerguelen":{"long":["French Southern & Antarctic Time","French Southern & Antarctic Time"]},"Asia/Bishkek":{"long":["Kyrgyzstan Time","Kyrgyzstan Time"]},"Pacific/Galapagos":{"long":["Galapagos Time","Galapagos Time"]},"Pacific/Gambier":{"long":["Gambier Time","Gambier Time"]},"Pacific/Tarawa":{"long":["Gilbert Islands Time","Gilbert Islands Time"]},"Atlantic/Reykjavik":{"long":["Greenwich Mean Time","Greenwich Mean Time"],"short":["GMT","GMT"]},"Africa/Ouagadougou":{"long":["Greenwich Mean Time","Greenwich Mean Time"],"short":["GMT","GMT"]},"Africa/Abidjan":{"long":["Greenwich Mean Time","Greenwich Mean Time"],"short":["GMT","GMT"]},"Africa/Accra":{"long":["Greenwich Mean Time","Greenwich Mean Time"],"short":["GMT","GMT"]},"Africa/Banjul":{"long":["Greenwich Mean Time","Greenwich Mean Time"],"short":["GMT","GMT"]},"Africa/Conakry":{"long":["Greenwich Mean Time","Greenwich Mean Time"],"short":["GMT","GMT"]},"Africa/Bamako":{"long":["Greenwich Mean Time","Greenwich Mean Time"],"short":["GMT","GMT"]},"Africa/Nouakchott":{"long":["Greenwich Mean Time","Greenwich Mean Time"],"short":["GMT","GMT"]},"Atlantic/St_Helena":{"long":["Greenwich Mean Time","Greenwich Mean Time"],"short":["GMT","GMT"]},"Africa/Freetown":{"long":["Greenwich Mean Time","Greenwich Mean Time"],"short":["GMT","GMT"]},"Africa/Dakar":{"long":["Greenwich Mean Time","Greenwich Mean Time"],"short":["GMT","GMT"]},"Africa/Lome":{"long":["Greenwich Mean Time","Greenwich Mean Time"],"short":["GMT","GMT"]},"America/Scoresbysund":{"long":["East Greenland Standard Time","East Greenland Summer Time"]},"America/Godthab":{"long":["West Greenland Standard Time","West Greenland Summer Time"]},"Asia/Dubai":{"long":["Gulf Standard Time","Gulf Standard Time"]},"Asia/Muscat":{"long":["Gulf Standard Time","Gulf Standard Time"]},"America/Guyana":{"long":["Guyana Time","Guyana Time"]},"Pacific/Honolulu":{"long":["Hawaii-Aleutian Standard Time","Hawaii-Aleutian Daylight Time"],"short":["HAST","HADT"]},"Asia/Hong_Kong":{"long":["Hong Kong Standard Time","Hong Kong Summer Time"]},"Asia/Hovd":{"long":["Hovd Standard Time","Hovd Summer Time"]},"Asia/Calcutta":{"long":["India Standard Time","India Standard Time"]},"Asia/Colombo":{"long":["Lanka Time","Lanka Time"]},"Indian/Chagos":{"long":["Indian Ocean Time","Indian Ocean Time"]},"Asia/Bangkok":{"long":["Indochina Time","Indochina Time"]},"Asia/Phnom_Penh":{"long":["Indochina Time","Indochina Time"]},"Asia/Vientiane":{"long":["Indochina Time","Indochina Time"]},"Asia/Makassar":{"long":["Central Indonesia Time","Central Indonesia Time"]},"Asia/Jayapura":{"long":["Eastern Indonesia Time","Eastern Indonesia Time"]},"Asia/Jakarta":{"long":["Western Indonesia Time","Western Indonesia Time"]},"Asia/Tehran":{"long":["Iran Standard Time","Iran Daylight Time"]},"Asia/Irkutsk":{"long":["Irkutsk Standard Time","Irkutsk Summer Time"]},"Asia/Jerusalem":{"long":["Israel Standard Time","Israel Daylight Time"]},"Asia/Tokyo":{"long":["Japan Standard Time","Japan Daylight Time"]},"Asia/Kamchatka":{"long":["Petropavlovsk-Kamchatski Standard Time","Petropavlovsk-Kamchatski Summer Time"]},"Asia/Karachi":{"long":["Pakistan Standard Time","Pakistan Summer Time"]},"Asia/Qyzylorda":{"long":["Qyzylorda Standard Time","Qyzylorda Summer Time"]},"Asia/Seoul":{"long":["Korean Standard Time","Korean Daylight Time"]},"Pacific/Kosrae":{"long":["Kosrae Time","Kosrae Time"]},"Asia/Krasnoyarsk":{"long":["Krasnoyarsk Standard Time","Krasnoyarsk Summer Time"]},"Europe/Samara":{"long":["Samara Standard Time","Samara Summer Time"]},"Pacific/Kiritimati":{"long":["Line Islands Time","Line Islands Time"]},"Australia/Lord_Howe":{"long":["Lord Howe Standard Time","Lord Howe Daylight Time"]},"Asia/Macau":{"long":["Macao Standard Time","Macao Summer Time"]},"Antarctica/Macquarie":{"long":["Macquarie Island Time","Macquarie Island Time"]},"Asia/Magadan":{"long":["Magadan Standard Time","Magadan Summer Time"]},"Indian/Maldives":{"long":["Maldives Time","Maldives Time"]},"Pacific/Marquesas":{"long":["Marquesas Time","Marquesas Time"]},"Pacific/Majuro":{"long":["Marshall Islands Time","Marshall Islands Time"]},"Indian/Mauritius":{"long":["Mauritius Standard Time","Mauritius Summer Time"]},"Antarctica/Mawson":{"long":["Mawson Time","Mawson Time"]},"America/Santa_Isabel":{"long":["Northwest Mexico Standard Time","Northwest Mexico Daylight Time"]},"America/Mazatlan":{"long":["Mexican Pacific Standard Time","Mexican Pacific Daylight Time"]},"Asia/Ulaanbaatar":{"long":["Ulaanbaatar Standard Time","Ulaanbaatar Summer Time"]},"Europe/Moscow":{"long":["Moscow Standard Time","Moscow Summer Time"]},"Asia/Rangoon":{"long":["Myanmar Time","Myanmar Time"]},"Pacific/Nauru":{"long":["Nauru Time","Nauru Time"]},"Asia/Katmandu":{"long":["Nepal Time","Nepal Time"]},"Pacific/Noumea":{"long":["New Caledonia Standard Time","New Caledonia Summer Time"]},"Pacific/Auckland":{"long":["New Zealand Standard Time","New Zealand Daylight Time"]},"Antarctica/McMurdo":{"long":["New Zealand Standard Time","New Zealand Daylight Time"]},"America/St_Johns":{"long":["Newfoundland Standard Time","Newfoundland Daylight Time"]},"Pacific/Niue":{"long":["Niue Time","Niue Time"]},"Pacific/Norfolk":{"long":["Norfolk Island Standard Time","Norfolk Island Daylight Time"]},"America/Noronha":{"long":["Fernando de Noronha Standard Time","Fernando de Noronha Summer Time"]},"Asia/Novosibirsk":{"long":["Novosibirsk Standard Time","Novosibirsk Summer Time"]},"Asia/Omsk":{"long":["Omsk Standard Time","Omsk Summer Time"]},"Pacific/Palau":{"long":["Palau Time","Palau Time"]},"Pacific/Port_Moresby":{"long":["Papua New Guinea Time","Papua New Guinea Time"]},"America/Asuncion":{"long":["Paraguay Standard Time","Paraguay Summer Time"]},"America/Lima":{"long":["Peru Standard Time","Peru Summer Time"]},"Asia/Manila":{"long":["Philippine Standard Time","Philippine Summer Time"]},"Pacific/Enderbury":{"long":["Phoenix Islands Time","Phoenix Islands Time"]},"America/Miquelon":{"long":["St. Pierre & Miquelon Standard Time","St. Pierre & Miquelon Daylight Time"]},"Pacific/Pitcairn":{"long":["Pitcairn Time","Pitcairn Time"]},"Pacific/Ponape":{"long":["Ponape Time","Ponape Time"]},"Asia/Pyongyang":{"long":["Pyongyang Time","Pyongyang Time"]},"Indian/Reunion":{"long":["Réunion Time","Réunion Time"]},"Antarctica/Rothera":{"long":["Rothera Time","Rothera Time"]},"Asia/Sakhalin":{"long":["Sakhalin Standard Time","Sakhalin Summer Time"]},"Pacific/Pago_Pago":{"long":["Samoa Standard Time","Samoa Daylight Time"]},"Indian/Mahe":{"long":["Seychelles Time","Seychelles Time"]},"Asia/Singapore":{"long":["Singapore Standard Time","Singapore Standard Time"]},"Pacific/Guadalcanal":{"long":["Solomon Islands Time","Solomon Islands Time"]},"Atlantic/South_Georgia":{"long":["South Georgia Time","South Georgia Time"]},"Asia/Yekaterinburg":{"long":["Yekaterinburg Standard Time","Yekaterinburg Summer Time"]},"Antarctica/Syowa":{"long":["Syowa Time","Syowa Time"]},"Pacific/Tahiti":{"long":["Tahiti Time","Tahiti Time"]},"Asia/Taipei":{"long":["Taipei Standard Time","Taipei Daylight Time"]},"Asia/Tashkent":{"long":["Uzbekistan Standard Time","Uzbekistan Summer Time"]},"Pacific/Fakaofo":{"long":["Tokelau Time","Tokelau Time"]},"Pacific/Tongatapu":{"long":["Tonga Standard Time","Tonga Summer Time"]},"Pacific/Truk":{"long":["Chuuk Time","Chuuk Time"]},"Pacific/Funafuti":{"long":["Tuvalu Time","Tuvalu Time"]},"America/Montevideo":{"long":["Uruguay Standard Time","Uruguay Summer Time"]},"Pacific/Efate":{"long":["Vanuatu Standard Time","Vanuatu Summer Time"]},"America/Caracas":{"long":["Venezuela Time","Venezuela Time"]},"Asia/Vladivostok":{"long":["Vladivostok Standard Time","Vladivostok Summer Time"]},"Europe/Volgograd":{"long":["Volgograd Standard Time","Volgograd Summer Time"]},"Antarctica/Vostok":{"long":["Vostok Time","Vostok Time"]},"Pacific/Wake":{"long":["Wake Island Time","Wake Island Time"]},"Pacific/Wallis":{"long":["Wallis & Futuna Time","Wallis & Futuna Time"]},"Asia/Yakutsk":{"long":["Yakutsk Standard Time","Yakutsk Summer Time"]},"UTC":{"long":["Coordinated Universal Time","Coordinated Universal Time"],"short":["UTC","UTC"]}},"gmtFormat":"GMT{0}","hourFormat":"+HH:mm;-HH:mm","dateFormat":{"full":"EEEE, MMMM d, y","long":"MMMM d, y","medium":"MMM d, y","short":"M/d/yy"},"timeFormat":{"full":"h:mm:ss a zzzz","long":"h:mm:ss a z","medium":"h:mm:ss a","short":"h:mm a"},"dateTimeFormat":{"full":"{1} 'at' {0}","long":"{1} 'at' {0}","medium":"{1}, {0}","short":"{1}, {0}"},"formats":{"gregory":{"Bh":"h B","Bhm":"h:mm B","Bhms":"h:mm:ss B","d":"d","E":"ccc","EBhm":"E h:mm B","EBhms":"E h:mm:ss B","Ed":"d E","Ehm":"E h:mm a","EHm":"E HH:mm","Ehms":"E h:mm:ss a","EHms":"E HH:mm:ss","Gy":"y G","GyMMM":"MMM y G","GyMMMd":"MMM d, y G","GyMMMEd":"E, MMM d, y G","h":"h a","H":"HH","hm":"h:mm a","Hm":"HH:mm","hms":"h:mm:ss a","Hms":"HH:mm:ss","hmsv":"h:mm:ss a v","Hmsv":"HH:mm:ss v","hmv":"h:mm a v","Hmv":"HH:mm v","M":"L","Md":"M/d","MEd":"E, M/d","MMM":"LLL","MMMd":"MMM d","MMMEd":"E, MMM d","MMMMd":"MMMM d","ms":"mm:ss","y":"y","yM":"M/y","yMd":"M/d/y","yMEd":"E, M/d/y","yMMM":"MMM y","yMMMd":"MMM d, y","yMMMEd":"E, MMM d, y","yMMMM":"MMMM y","EEEE, MMMM d, y":"EEEE, MMMM d, y","MMMM d, y":"MMMM d, y","MMM d, y":"MMM d, y","M/d/yy":"M/d/yy","h:mm:ss a zzzz":"h:mm:ss a zzzz","h:mm:ss a z":"h:mm:ss a z","h:mm:ss a":"h:mm:ss a","h:mm a":"h:mm a","EEEE, MMMM d, y 'at' h:mm:ss a zzzz":"EEEE, MMMM d, y 'at' h:mm:ss a zzzz","MMMM d, y 'at' h:mm:ss a zzzz":"MMMM d, y 'at' h:mm:ss a zzzz","MMM d, y, h:mm:ss a zzzz":"MMM d, y, h:mm:ss a zzzz","M/d/yy, h:mm:ss a zzzz":"M/d/yy, h:mm:ss a zzzz","d, h:mm:ss a zzzz":"d, h:mm:ss a zzzz","E, h:mm:ss a zzzz":"ccc, h:mm:ss a zzzz","Ed, h:mm:ss a zzzz":"d E, h:mm:ss a zzzz","Gy, h:mm:ss a zzzz":"y G, h:mm:ss a zzzz","GyMMM, h:mm:ss a zzzz":"MMM y G, h:mm:ss a zzzz","GyMMMd, h:mm:ss a zzzz":"MMM d, y G, h:mm:ss a zzzz","GyMMMEd, h:mm:ss a zzzz":"E, MMM d, y G, h:mm:ss a zzzz","M, h:mm:ss a zzzz":"L, h:mm:ss a zzzz","Md, h:mm:ss a zzzz":"M/d, h:mm:ss a zzzz","MEd, h:mm:ss a zzzz":"E, M/d, h:mm:ss a zzzz","MMM, h:mm:ss a zzzz":"LLL, h:mm:ss a zzzz","MMMd, h:mm:ss a zzzz":"MMM d, h:mm:ss a zzzz","MMMEd, h:mm:ss a zzzz":"E, MMM d, h:mm:ss a zzzz","MMMMd 'at' h:mm:ss a zzzz":"MMMM d 'at' h:mm:ss a zzzz","y, h:mm:ss a zzzz":"y, h:mm:ss a zzzz","yM, h:mm:ss a zzzz":"M/y, h:mm:ss a zzzz","yMd, h:mm:ss a zzzz":"M/d/y, h:mm:ss a zzzz","yMEd, h:mm:ss a zzzz":"E, M/d/y, h:mm:ss a zzzz","yMMM, h:mm:ss a zzzz":"MMM y, h:mm:ss a zzzz","yMMMd, h:mm:ss a zzzz":"MMM d, y, h:mm:ss a zzzz","yMMMEd, h:mm:ss a zzzz":"E, MMM d, y, h:mm:ss a zzzz","yMMMM 'at' h:mm:ss a zzzz":"MMMM y 'at' h:mm:ss a zzzz","EEEE, MMMM d, y 'at' h:mm:ss a z":"EEEE, MMMM d, y 'at' h:mm:ss a z","MMMM d, y 'at' h:mm:ss a z":"MMMM d, y 'at' h:mm:ss a z","MMM d, y, h:mm:ss a z":"MMM d, y, h:mm:ss a z","M/d/yy, h:mm:ss a z":"M/d/yy, h:mm:ss a z","d, h:mm:ss a z":"d, h:mm:ss a z","E, h:mm:ss a z":"ccc, h:mm:ss a z","Ed, h:mm:ss a z":"d E, h:mm:ss a z","Gy, h:mm:ss a z":"y G, h:mm:ss a z","GyMMM, h:mm:ss a z":"MMM y G, h:mm:ss a z","GyMMMd, h:mm:ss a z":"MMM d, y G, h:mm:ss a z","GyMMMEd, h:mm:ss a z":"E, MMM d, y G, h:mm:ss a z","M, h:mm:ss a z":"L, h:mm:ss a z","Md, h:mm:ss a z":"M/d, h:mm:ss a z","MEd, h:mm:ss a z":"E, M/d, h:mm:ss a z","MMM, h:mm:ss a z":"LLL, h:mm:ss a z","MMMd, h:mm:ss a z":"MMM d, h:mm:ss a z","MMMEd, h:mm:ss a z":"E, MMM d, h:mm:ss a z","MMMMd 'at' h:mm:ss a z":"MMMM d 'at' h:mm:ss a z","y, h:mm:ss a z":"y, h:mm:ss a z","yM, h:mm:ss a z":"M/y, h:mm:ss a z","yMd, h:mm:ss a z":"M/d/y, h:mm:ss a z","yMEd, h:mm:ss a z":"E, M/d/y, h:mm:ss a z","yMMM, h:mm:ss a z":"MMM y, h:mm:ss a z","yMMMd, h:mm:ss a z":"MMM d, y, h:mm:ss a z","yMMMEd, h:mm:ss a z":"E, MMM d, y, h:mm:ss a z","yMMMM 'at' h:mm:ss a z":"MMMM y 'at' h:mm:ss a z","EEEE, MMMM d, y 'at' h:mm:ss a":"EEEE, MMMM d, y 'at' h:mm:ss a","MMMM d, y 'at' h:mm:ss a":"MMMM d, y 'at' h:mm:ss a","MMM d, y, h:mm:ss a":"MMM d, y, h:mm:ss a","M/d/yy, h:mm:ss a":"M/d/yy, h:mm:ss a","d, h:mm:ss a":"d, h:mm:ss a","E, h:mm:ss a":"ccc, h:mm:ss a","Ed, h:mm:ss a":"d E, h:mm:ss a","Gy, h:mm:ss a":"y G, h:mm:ss a","GyMMM, h:mm:ss a":"MMM y G, h:mm:ss a","GyMMMd, h:mm:ss a":"MMM d, y G, h:mm:ss a","GyMMMEd, h:mm:ss a":"E, MMM d, y G, h:mm:ss a","M, h:mm:ss a":"L, h:mm:ss a","Md, h:mm:ss a":"M/d, h:mm:ss a","MEd, h:mm:ss a":"E, M/d, h:mm:ss a","MMM, h:mm:ss a":"LLL, h:mm:ss a","MMMd, h:mm:ss a":"MMM d, h:mm:ss a","MMMEd, h:mm:ss a":"E, MMM d, h:mm:ss a","MMMMd 'at' h:mm:ss a":"MMMM d 'at' h:mm:ss a","y, h:mm:ss a":"y, h:mm:ss a","yM, h:mm:ss a":"M/y, h:mm:ss a","yMd, h:mm:ss a":"M/d/y, h:mm:ss a","yMEd, h:mm:ss a":"E, M/d/y, h:mm:ss a","yMMM, h:mm:ss a":"MMM y, h:mm:ss a","yMMMd, h:mm:ss a":"MMM d, y, h:mm:ss a","yMMMEd, h:mm:ss a":"E, MMM d, y, h:mm:ss a","yMMMM 'at' h:mm:ss a":"MMMM y 'at' h:mm:ss a","EEEE, MMMM d, y 'at' h:mm a":"EEEE, MMMM d, y 'at' h:mm a","MMMM d, y 'at' h:mm a":"MMMM d, y 'at' h:mm a","MMM d, y, h:mm a":"MMM d, y, h:mm a","M/d/yy, h:mm a":"M/d/yy, h:mm a","d, h:mm a":"d, h:mm a","E, h:mm a":"ccc, h:mm a","Ed, h:mm a":"d E, h:mm a","Gy, h:mm a":"y G, h:mm a","GyMMM, h:mm a":"MMM y G, h:mm a","GyMMMd, h:mm a":"MMM d, y G, h:mm a","GyMMMEd, h:mm a":"E, MMM d, y G, h:mm a","M, h:mm a":"L, h:mm a","Md, h:mm a":"M/d, h:mm a","MEd, h:mm a":"E, M/d, h:mm a","MMM, h:mm a":"LLL, h:mm a","MMMd, h:mm a":"MMM d, h:mm a","MMMEd, h:mm a":"E, MMM d, h:mm a","MMMMd 'at' h:mm a":"MMMM d 'at' h:mm a","y, h:mm a":"y, h:mm a","yM, h:mm a":"M/y, h:mm a","yMd, h:mm a":"M/d/y, h:mm a","yMEd, h:mm a":"E, M/d/y, h:mm a","yMMM, h:mm a":"MMM y, h:mm a","yMMMd, h:mm a":"MMM d, y, h:mm a","yMMMEd, h:mm a":"E, MMM d, y, h:mm a","yMMMM 'at' h:mm a":"MMMM y 'at' h:mm a","EEEE, MMMM d, y 'at' Bh":"EEEE, MMMM d, y 'at' h B","MMMM d, y 'at' Bh":"MMMM d, y 'at' h B","MMM d, y, Bh":"MMM d, y, h B","M/d/yy, Bh":"M/d/yy, h B","d, Bh":"d, h B","E, Bh":"ccc, h B","Ed, Bh":"d E, h B","Gy, Bh":"y G, h B","GyMMM, Bh":"MMM y G, h B","GyMMMd, Bh":"MMM d, y G, h B","GyMMMEd, Bh":"E, MMM d, y G, h B","M, Bh":"L, h B","Md, Bh":"M/d, h B","MEd, Bh":"E, M/d, h B","MMM, Bh":"LLL, h B","MMMd, Bh":"MMM d, h B","MMMEd, Bh":"E, MMM d, h B","MMMMd 'at' Bh":"MMMM d 'at' h B","y, Bh":"y, h B","yM, Bh":"M/y, h B","yMd, Bh":"M/d/y, h B","yMEd, Bh":"E, M/d/y, h B","yMMM, Bh":"MMM y, h B","yMMMd, Bh":"MMM d, y, h B","yMMMEd, Bh":"E, MMM d, y, h B","yMMMM 'at' Bh":"MMMM y 'at' h B","EEEE, MMMM d, y 'at' Bhm":"EEEE, MMMM d, y 'at' h:mm B","MMMM d, y 'at' Bhm":"MMMM d, y 'at' h:mm B","MMM d, y, Bhm":"MMM d, y, h:mm B","M/d/yy, Bhm":"M/d/yy, h:mm B","d, Bhm":"d, h:mm B","E, Bhm":"ccc, h:mm B","Ed, Bhm":"d E, h:mm B","Gy, Bhm":"y G, h:mm B","GyMMM, Bhm":"MMM y G, h:mm B","GyMMMd, Bhm":"MMM d, y G, h:mm B","GyMMMEd, Bhm":"E, MMM d, y G, h:mm B","M, Bhm":"L, h:mm B","Md, Bhm":"M/d, h:mm B","MEd, Bhm":"E, M/d, h:mm B","MMM, Bhm":"LLL, h:mm B","MMMd, Bhm":"MMM d, h:mm B","MMMEd, Bhm":"E, MMM d, h:mm B","MMMMd 'at' Bhm":"MMMM d 'at' h:mm B","y, Bhm":"y, h:mm B","yM, Bhm":"M/y, h:mm B","yMd, Bhm":"M/d/y, h:mm B","yMEd, Bhm":"E, M/d/y, h:mm B","yMMM, Bhm":"MMM y, h:mm B","yMMMd, Bhm":"MMM d, y, h:mm B","yMMMEd, Bhm":"E, MMM d, y, h:mm B","yMMMM 'at' Bhm":"MMMM y 'at' h:mm B","EEEE, MMMM d, y 'at' Bhms":"EEEE, MMMM d, y 'at' h:mm:ss B","MMMM d, y 'at' Bhms":"MMMM d, y 'at' h:mm:ss B","MMM d, y, Bhms":"MMM d, y, h:mm:ss B","M/d/yy, Bhms":"M/d/yy, h:mm:ss B","d, Bhms":"d, h:mm:ss B","E, Bhms":"ccc, h:mm:ss B","Ed, Bhms":"d E, h:mm:ss B","Gy, Bhms":"y G, h:mm:ss B","GyMMM, Bhms":"MMM y G, h:mm:ss B","GyMMMd, Bhms":"MMM d, y G, h:mm:ss B","GyMMMEd, Bhms":"E, MMM d, y G, h:mm:ss B","M, Bhms":"L, h:mm:ss B","Md, Bhms":"M/d, h:mm:ss B","MEd, Bhms":"E, M/d, h:mm:ss B","MMM, Bhms":"LLL, h:mm:ss B","MMMd, Bhms":"MMM d, h:mm:ss B","MMMEd, Bhms":"E, MMM d, h:mm:ss B","MMMMd 'at' Bhms":"MMMM d 'at' h:mm:ss B","y, Bhms":"y, h:mm:ss B","yM, Bhms":"M/y, h:mm:ss B","yMd, Bhms":"M/d/y, h:mm:ss B","yMEd, Bhms":"E, M/d/y, h:mm:ss B","yMMM, Bhms":"MMM y, h:mm:ss B","yMMMd, Bhms":"MMM d, y, h:mm:ss B","yMMMEd, Bhms":"E, MMM d, y, h:mm:ss B","yMMMM 'at' Bhms":"MMMM y 'at' h:mm:ss B","EEEE, MMMM d, y 'at' h":"EEEE, MMMM d, y 'at' h a","MMMM d, y 'at' h":"MMMM d, y 'at' h a","MMM d, y, h":"MMM d, y, h a","M/d/yy, h":"M/d/yy, h a","d, h":"d, h a","E, h":"ccc, h a","Ed, h":"d E, h a","Gy, h":"y G, h a","GyMMM, h":"MMM y G, h a","GyMMMd, h":"MMM d, y G, h a","GyMMMEd, h":"E, MMM d, y G, h a","M, h":"L, h a","Md, h":"M/d, h a","MEd, h":"E, M/d, h a","MMM, h":"LLL, h a","MMMd, h":"MMM d, h a","MMMEd, h":"E, MMM d, h a","MMMMd 'at' h":"MMMM d 'at' h a","y, h":"y, h a","yM, h":"M/y, h a","yMd, h":"M/d/y, h a","yMEd, h":"E, M/d/y, h a","yMMM, h":"MMM y, h a","yMMMd, h":"MMM d, y, h a","yMMMEd, h":"E, MMM d, y, h a","yMMMM 'at' h":"MMMM y 'at' h a","EEEE, MMMM d, y 'at' H":"EEEE, MMMM d, y 'at' HH","MMMM d, y 'at' H":"MMMM d, y 'at' HH","MMM d, y, H":"MMM d, y, HH","M/d/yy, H":"M/d/yy, HH","d, H":"d, HH","E, H":"ccc, HH","Ed, H":"d E, HH","Gy, H":"y G, HH","GyMMM, H":"MMM y G, HH","GyMMMd, H":"MMM d, y G, HH","GyMMMEd, H":"E, MMM d, y G, HH","M, H":"L, HH","Md, H":"M/d, HH","MEd, H":"E, M/d, HH","MMM, H":"LLL, HH","MMMd, H":"MMM d, HH","MMMEd, H":"E, MMM d, HH","MMMMd 'at' H":"MMMM d 'at' HH","y, H":"y, HH","yM, H":"M/y, HH","yMd, H":"M/d/y, HH","yMEd, H":"E, M/d/y, HH","yMMM, H":"MMM y, HH","yMMMd, H":"MMM d, y, HH","yMMMEd, H":"E, MMM d, y, HH","yMMMM 'at' H":"MMMM y 'at' HH","EEEE, MMMM d, y 'at' hm":"EEEE, MMMM d, y 'at' h:mm a","MMMM d, y 'at' hm":"MMMM d, y 'at' h:mm a","MMM d, y, hm":"MMM d, y, h:mm a","M/d/yy, hm":"M/d/yy, h:mm a","d, hm":"d, h:mm a","E, hm":"ccc, h:mm a","Ed, hm":"d E, h:mm a","Gy, hm":"y G, h:mm a","GyMMM, hm":"MMM y G, h:mm a","GyMMMd, hm":"MMM d, y G, h:mm a","GyMMMEd, hm":"E, MMM d, y G, h:mm a","M, hm":"L, h:mm a","Md, hm":"M/d, h:mm a","MEd, hm":"E, M/d, h:mm a","MMM, hm":"LLL, h:mm a","MMMd, hm":"MMM d, h:mm a","MMMEd, hm":"E, MMM d, h:mm a","MMMMd 'at' hm":"MMMM d 'at' h:mm a","y, hm":"y, h:mm a","yM, hm":"M/y, h:mm a","yMd, hm":"M/d/y, h:mm a","yMEd, hm":"E, M/d/y, h:mm a","yMMM, hm":"MMM y, h:mm a","yMMMd, hm":"MMM d, y, h:mm a","yMMMEd, hm":"E, MMM d, y, h:mm a","yMMMM 'at' hm":"MMMM y 'at' h:mm a","EEEE, MMMM d, y 'at' Hm":"EEEE, MMMM d, y 'at' HH:mm","MMMM d, y 'at' Hm":"MMMM d, y 'at' HH:mm","MMM d, y, Hm":"MMM d, y, HH:mm","M/d/yy, Hm":"M/d/yy, HH:mm","d, Hm":"d, HH:mm","E, Hm":"ccc, HH:mm","Ed, Hm":"d E, HH:mm","Gy, Hm":"y G, HH:mm","GyMMM, Hm":"MMM y G, HH:mm","GyMMMd, Hm":"MMM d, y G, HH:mm","GyMMMEd, Hm":"E, MMM d, y G, HH:mm","M, Hm":"L, HH:mm","Md, Hm":"M/d, HH:mm","MEd, Hm":"E, M/d, HH:mm","MMM, Hm":"LLL, HH:mm","MMMd, Hm":"MMM d, HH:mm","MMMEd, Hm":"E, MMM d, HH:mm","MMMMd 'at' Hm":"MMMM d 'at' HH:mm","y, Hm":"y, HH:mm","yM, Hm":"M/y, HH:mm","yMd, Hm":"M/d/y, HH:mm","yMEd, Hm":"E, M/d/y, HH:mm","yMMM, Hm":"MMM y, HH:mm","yMMMd, Hm":"MMM d, y, HH:mm","yMMMEd, Hm":"E, MMM d, y, HH:mm","yMMMM 'at' Hm":"MMMM y 'at' HH:mm","EEEE, MMMM d, y 'at' hms":"EEEE, MMMM d, y 'at' h:mm:ss a","MMMM d, y 'at' hms":"MMMM d, y 'at' h:mm:ss a","MMM d, y, hms":"MMM d, y, h:mm:ss a","M/d/yy, hms":"M/d/yy, h:mm:ss a","d, hms":"d, h:mm:ss a","E, hms":"ccc, h:mm:ss a","Ed, hms":"d E, h:mm:ss a","Gy, hms":"y G, h:mm:ss a","GyMMM, hms":"MMM y G, h:mm:ss a","GyMMMd, hms":"MMM d, y G, h:mm:ss a","GyMMMEd, hms":"E, MMM d, y G, h:mm:ss a","M, hms":"L, h:mm:ss a","Md, hms":"M/d, h:mm:ss a","MEd, hms":"E, M/d, h:mm:ss a","MMM, hms":"LLL, h:mm:ss a","MMMd, hms":"MMM d, h:mm:ss a","MMMEd, hms":"E, MMM d, h:mm:ss a","MMMMd 'at' hms":"MMMM d 'at' h:mm:ss a","y, hms":"y, h:mm:ss a","yM, hms":"M/y, h:mm:ss a","yMd, hms":"M/d/y, h:mm:ss a","yMEd, hms":"E, M/d/y, h:mm:ss a","yMMM, hms":"MMM y, h:mm:ss a","yMMMd, hms":"MMM d, y, h:mm:ss a","yMMMEd, hms":"E, MMM d, y, h:mm:ss a","yMMMM 'at' hms":"MMMM y 'at' h:mm:ss a","EEEE, MMMM d, y 'at' Hms":"EEEE, MMMM d, y 'at' HH:mm:ss","MMMM d, y 'at' Hms":"MMMM d, y 'at' HH:mm:ss","MMM d, y, Hms":"MMM d, y, HH:mm:ss","M/d/yy, Hms":"M/d/yy, HH:mm:ss","d, Hms":"d, HH:mm:ss","E, Hms":"ccc, HH:mm:ss","Ed, Hms":"d E, HH:mm:ss","Gy, Hms":"y G, HH:mm:ss","GyMMM, Hms":"MMM y G, HH:mm:ss","GyMMMd, Hms":"MMM d, y G, HH:mm:ss","GyMMMEd, Hms":"E, MMM d, y G, HH:mm:ss","M, Hms":"L, HH:mm:ss","Md, Hms":"M/d, HH:mm:ss","MEd, Hms":"E, M/d, HH:mm:ss","MMM, Hms":"LLL, HH:mm:ss","MMMd, Hms":"MMM d, HH:mm:ss","MMMEd, Hms":"E, MMM d, HH:mm:ss","MMMMd 'at' Hms":"MMMM d 'at' HH:mm:ss","y, Hms":"y, HH:mm:ss","yM, Hms":"M/y, HH:mm:ss","yMd, Hms":"M/d/y, HH:mm:ss","yMEd, Hms":"E, M/d/y, HH:mm:ss","yMMM, Hms":"MMM y, HH:mm:ss","yMMMd, Hms":"MMM d, y, HH:mm:ss","yMMMEd, Hms":"E, MMM d, y, HH:mm:ss","yMMMM 'at' Hms":"MMMM y 'at' HH:mm:ss","EEEE, MMMM d, y 'at' hmsv":"EEEE, MMMM d, y 'at' h:mm:ss a v","MMMM d, y 'at' hmsv":"MMMM d, y 'at' h:mm:ss a v","MMM d, y, hmsv":"MMM d, y, h:mm:ss a v","M/d/yy, hmsv":"M/d/yy, h:mm:ss a v","d, hmsv":"d, h:mm:ss a v","E, hmsv":"ccc, h:mm:ss a v","Ed, hmsv":"d E, h:mm:ss a v","Gy, hmsv":"y G, h:mm:ss a v","GyMMM, hmsv":"MMM y G, h:mm:ss a v","GyMMMd, hmsv":"MMM d, y G, h:mm:ss a v","GyMMMEd, hmsv":"E, MMM d, y G, h:mm:ss a v","M, hmsv":"L, h:mm:ss a v","Md, hmsv":"M/d, h:mm:ss a v","MEd, hmsv":"E, M/d, h:mm:ss a v","MMM, hmsv":"LLL, h:mm:ss a v","MMMd, hmsv":"MMM d, h:mm:ss a v","MMMEd, hmsv":"E, MMM d, h:mm:ss a v","MMMMd 'at' hmsv":"MMMM d 'at' h:mm:ss a v","y, hmsv":"y, h:mm:ss a v","yM, hmsv":"M/y, h:mm:ss a v","yMd, hmsv":"M/d/y, h:mm:ss a v","yMEd, hmsv":"E, M/d/y, h:mm:ss a v","yMMM, hmsv":"MMM y, h:mm:ss a v","yMMMd, hmsv":"MMM d, y, h:mm:ss a v","yMMMEd, hmsv":"E, MMM d, y, h:mm:ss a v","yMMMM 'at' hmsv":"MMMM y 'at' h:mm:ss a v","EEEE, MMMM d, y 'at' Hmsv":"EEEE, MMMM d, y 'at' HH:mm:ss v","MMMM d, y 'at' Hmsv":"MMMM d, y 'at' HH:mm:ss v","MMM d, y, Hmsv":"MMM d, y, HH:mm:ss v","M/d/yy, Hmsv":"M/d/yy, HH:mm:ss v","d, Hmsv":"d, HH:mm:ss v","E, Hmsv":"ccc, HH:mm:ss v","Ed, Hmsv":"d E, HH:mm:ss v","Gy, Hmsv":"y G, HH:mm:ss v","GyMMM, Hmsv":"MMM y G, HH:mm:ss v","GyMMMd, Hmsv":"MMM d, y G, HH:mm:ss v","GyMMMEd, Hmsv":"E, MMM d, y G, HH:mm:ss v","M, Hmsv":"L, HH:mm:ss v","Md, Hmsv":"M/d, HH:mm:ss v","MEd, Hmsv":"E, M/d, HH:mm:ss v","MMM, Hmsv":"LLL, HH:mm:ss v","MMMd, Hmsv":"MMM d, HH:mm:ss v","MMMEd, Hmsv":"E, MMM d, HH:mm:ss v","MMMMd 'at' Hmsv":"MMMM d 'at' HH:mm:ss v","y, Hmsv":"y, HH:mm:ss v","yM, Hmsv":"M/y, HH:mm:ss v","yMd, Hmsv":"M/d/y, HH:mm:ss v","yMEd, Hmsv":"E, M/d/y, HH:mm:ss v","yMMM, Hmsv":"MMM y, HH:mm:ss v","yMMMd, Hmsv":"MMM d, y, HH:mm:ss v","yMMMEd, Hmsv":"E, MMM d, y, HH:mm:ss v","yMMMM 'at' Hmsv":"MMMM y 'at' HH:mm:ss v","EEEE, MMMM d, y 'at' hmv":"EEEE, MMMM d, y 'at' h:mm a v","MMMM d, y 'at' hmv":"MMMM d, y 'at' h:mm a v","MMM d, y, hmv":"MMM d, y, h:mm a v","M/d/yy, hmv":"M/d/yy, h:mm a v","d, hmv":"d, h:mm a v","E, hmv":"ccc, h:mm a v","Ed, hmv":"d E, h:mm a v","Gy, hmv":"y G, h:mm a v","GyMMM, hmv":"MMM y G, h:mm a v","GyMMMd, hmv":"MMM d, y G, h:mm a v","GyMMMEd, hmv":"E, MMM d, y G, h:mm a v","M, hmv":"L, h:mm a v","Md, hmv":"M/d, h:mm a v","MEd, hmv":"E, M/d, h:mm a v","MMM, hmv":"LLL, h:mm a v","MMMd, hmv":"MMM d, h:mm a v","MMMEd, hmv":"E, MMM d, h:mm a v","MMMMd 'at' hmv":"MMMM d 'at' h:mm a v","y, hmv":"y, h:mm a v","yM, hmv":"M/y, h:mm a v","yMd, hmv":"M/d/y, h:mm a v","yMEd, hmv":"E, M/d/y, h:mm a v","yMMM, hmv":"MMM y, h:mm a v","yMMMd, hmv":"MMM d, y, h:mm a v","yMMMEd, hmv":"E, MMM d, y, h:mm a v","yMMMM 'at' hmv":"MMMM y 'at' h:mm a v","EEEE, MMMM d, y 'at' Hmv":"EEEE, MMMM d, y 'at' HH:mm v","MMMM d, y 'at' Hmv":"MMMM d, y 'at' HH:mm v","MMM d, y, Hmv":"MMM d, y, HH:mm v","M/d/yy, Hmv":"M/d/yy, HH:mm v","d, Hmv":"d, HH:mm v","E, Hmv":"ccc, HH:mm v","Ed, Hmv":"d E, HH:mm v","Gy, Hmv":"y G, HH:mm v","GyMMM, Hmv":"MMM y G, HH:mm v","GyMMMd, Hmv":"MMM d, y G, HH:mm v","GyMMMEd, Hmv":"E, MMM d, y G, HH:mm v","M, Hmv":"L, HH:mm v","Md, Hmv":"M/d, HH:mm v","MEd, Hmv":"E, M/d, HH:mm v","MMM, Hmv":"LLL, HH:mm v","MMMd, Hmv":"MMM d, HH:mm v","MMMEd, Hmv":"E, MMM d, HH:mm v","MMMMd 'at' Hmv":"MMMM d 'at' HH:mm v","y, Hmv":"y, HH:mm v","yM, Hmv":"M/y, HH:mm v","yMd, Hmv":"M/d/y, HH:mm v","yMEd, Hmv":"E, M/d/y, HH:mm v","yMMM, Hmv":"MMM y, HH:mm v","yMMMd, Hmv":"MMM d, y, HH:mm v","yMMMEd, Hmv":"E, MMM d, y, HH:mm v","yMMMM 'at' Hmv":"MMMM y 'at' HH:mm v","EEEE, MMMM d, y 'at' ms":"EEEE, MMMM d, y 'at' mm:ss","MMMM d, y 'at' ms":"MMMM d, y 'at' mm:ss","MMM d, y, ms":"MMM d, y, mm:ss","M/d/yy, ms":"M/d/yy, mm:ss","d, ms":"d, mm:ss","E, ms":"ccc, mm:ss","Ed, ms":"d E, mm:ss","Gy, ms":"y G, mm:ss","GyMMM, ms":"MMM y G, mm:ss","GyMMMd, ms":"MMM d, y G, mm:ss","GyMMMEd, ms":"E, MMM d, y G, mm:ss","M, ms":"L, mm:ss","Md, ms":"M/d, mm:ss","MEd, ms":"E, M/d, mm:ss","MMM, ms":"LLL, mm:ss","MMMd, ms":"MMM d, mm:ss","MMMEd, ms":"E, MMM d, mm:ss","MMMMd 'at' ms":"MMMM d 'at' mm:ss","y, ms":"y, mm:ss","yM, ms":"M/y, mm:ss","yMd, ms":"M/d/y, mm:ss","yMEd, ms":"E, M/d/y, mm:ss","yMMM, ms":"MMM y, mm:ss","yMMMd, ms":"MMM d, y, mm:ss","yMMMEd, ms":"E, MMM d, y, mm:ss","yMMMM 'at' ms":"MMMM y 'at' mm:ss"}},"intervalFormats":{"intervalFormatFallback":"{0} – {1}","Bh":{"B":"h B – h B","h":"h – h B"},"Bhm":{"B":"h:mm B – h:mm B","h":"h:mm – h:mm B","m":"h:mm – h:mm B"},"d":{"d":"d – d"},"Gy":{"G":"y G – y G","y":"y – y G"},"GyM":{"G":"M/y GGGGG – M/y GGGGG","M":"M/y – M/y GGGGG","y":"M/y – M/y GGGGG"},"GyMd":{"d":"M/d/y – M/d/y GGGGG","G":"M/d/y GGGGG – M/d/y GGGGG","M":"M/d/y – M/d/y GGGGG","y":"M/d/y – M/d/y GGGGG"},"GyMEd":{"d":"E, M/d/y – E, M/d/y GGGGG","G":"E, M/d/y GGGGG – E, M/d/y GGGGG","M":"E, M/d/y – E, M/d/y GGGGG","y":"E, M/d/y – E, M/d/y GGGGG"},"GyMMM":{"G":"MMM y G – MMM y G","M":"MMM – MMM y G","y":"MMM y – MMM y G"},"GyMMMd":{"d":"MMM d – d, y G","G":"MMM d, y G – MMM d, y G","M":"MMM d – MMM d, y G","y":"MMM d, y – MMM d, y G"},"GyMMMEd":{"d":"E, MMM d – E, MMM d, y G","G":"E, MMM d, y G – E, MMM d, y G","M":"E, MMM d – E, MMM d, y G","y":"E, MMM d, y – E, MMM d, y G"},"h":{"a":"h a – h a","h":"h – h a"},"H":{"H":"HH – HH"},"hm":{"a":"h:mm a – h:mm a","h":"h:mm – h:mm a","m":"h:mm – h:mm a"},"Hm":{"H":"HH:mm – HH:mm","m":"HH:mm – HH:mm"},"hmv":{"a":"h:mm a – h:mm a v","h":"h:mm – h:mm a v","m":"h:mm – h:mm a v"},"Hmv":{"H":"HH:mm – HH:mm v","m":"HH:mm – HH:mm v"},"hv":{"a":"h a – h a v","h":"h – h a v"},"Hv":{"H":"HH – HH v"},"M":{"M":"M – M"},"Md":{"d":"M/d – M/d","M":"M/d – M/d"},"MEd":{"d":"E, M/d – E, M/d","M":"E, M/d – E, M/d"},"MMM":{"M":"MMM – MMM"},"MMMd":{"d":"MMM d – d","M":"MMM d – MMM d"},"MMMEd":{"d":"E, MMM d – E, MMM d","M":"E, MMM d – E, MMM d"},"y":{"y":"y – y"},"yM":{"M":"M/y – M/y","y":"M/y – M/y"},"yMd":{"d":"M/d/y – M/d/y","M":"M/d/y – M/d/y","y":"M/d/y – M/d/y"},"yMEd":{"d":"E, M/d/y – E, M/d/y","M":"E, M/d/y – E, M/d/y","y":"E, M/d/y – E, M/d/y"},"yMMM":{"M":"MMM – MMM y","y":"MMM y – MMM y"},"yMMMd":{"d":"MMM d – d, y","M":"MMM d – MMM d, y","y":"MMM d, y – MMM d, y"},"yMMMEd":{"d":"E, MMM d – E, MMM d, y","M":"E, MMM d – E, MMM d, y","y":"E, MMM d, y – E, MMM d, y"},"yMMMM":{"M":"MMMM – MMMM y","y":"MMMM y – MMMM y"}},"hourCycle":"h12","nu":["latn"],"ca":["gregory"],"hc":["h12","","h23",""]},"locale":"en"}
)
  }


// Intl.NumberFormat.~locale.en
/* @generated */
// prettier-ignore
if (Intl.NumberFormat && typeof Intl.NumberFormat.__addLocaleData === 'function') {
  Intl.NumberFormat.__addLocaleData({"data":{"units":{"simple":{"degree":{"long":{"other":"{0} degrees","one":"{0} degree"},"short":{"other":"{0} deg"},"narrow":{"other":"{0}°"},"perUnit":{}},"hectare":{"long":{"other":"{0} hectares","one":"{0} hectare"},"short":{"other":"{0} ha"},"narrow":{"other":"{0}ha"},"perUnit":{}},"acre":{"long":{"other":"{0} acres","one":"{0} acre"},"short":{"other":"{0} ac"},"narrow":{"other":"{0}ac"},"perUnit":{}},"percent":{"long":{"other":"{0} percent"},"short":{"other":"{0}%"},"narrow":{"other":"{0}%"},"perUnit":{}},"liter-per-kilometer":{"long":{"other":"{0} liters per kilometer","one":"{0} liter per kilometer"},"short":{"other":"{0} L/km"},"narrow":{"other":"{0}L/km"},"perUnit":{}},"mile-per-gallon":{"long":{"other":"{0} miles per gallon","one":"{0} mile per gallon"},"short":{"other":"{0} mpg"},"narrow":{"other":"{0}mpg"},"perUnit":{}},"petabyte":{"long":{"other":"{0} petabytes","one":"{0} petabyte"},"short":{"other":"{0} PB"},"narrow":{"other":"{0}PB"},"perUnit":{}},"terabyte":{"long":{"other":"{0} terabytes","one":"{0} terabyte"},"short":{"other":"{0} TB"},"narrow":{"other":"{0}TB"},"perUnit":{}},"terabit":{"long":{"other":"{0} terabits","one":"{0} terabit"},"short":{"other":"{0} Tb"},"narrow":{"other":"{0}Tb"},"perUnit":{}},"gigabyte":{"long":{"other":"{0} gigabytes","one":"{0} gigabyte"},"short":{"other":"{0} GB"},"narrow":{"other":"{0}GB"},"perUnit":{}},"gigabit":{"long":{"other":"{0} gigabits","one":"{0} gigabit"},"short":{"other":"{0} Gb"},"narrow":{"other":"{0}Gb"},"perUnit":{}},"megabyte":{"long":{"other":"{0} megabytes","one":"{0} megabyte"},"short":{"other":"{0} MB"},"narrow":{"other":"{0}MB"},"perUnit":{}},"megabit":{"long":{"other":"{0} megabits","one":"{0} megabit"},"short":{"other":"{0} Mb"},"narrow":{"other":"{0}Mb"},"perUnit":{}},"kilobyte":{"long":{"other":"{0} kilobytes","one":"{0} kilobyte"},"short":{"other":"{0} kB"},"narrow":{"other":"{0}kB"},"perUnit":{}},"kilobit":{"long":{"other":"{0} kilobits","one":"{0} kilobit"},"short":{"other":"{0} kb"},"narrow":{"other":"{0}kb"},"perUnit":{}},"byte":{"long":{"other":"{0} bytes","one":"{0} byte"},"short":{"other":"{0} byte"},"narrow":{"other":"{0}B"},"perUnit":{}},"bit":{"long":{"other":"{0} bits","one":"{0} bit"},"short":{"other":"{0} bit"},"narrow":{"other":"{0}bit"},"perUnit":{}},"year":{"long":{"other":"{0} years","one":"{0} year"},"short":{"other":"{0} yrs","one":"{0} yr"},"narrow":{"other":"{0}y"},"perUnit":{"long":"{0} per year","short":"{0}/y","narrow":"{0}/y"}},"month":{"long":{"other":"{0} months","one":"{0} month"},"short":{"other":"{0} mths","one":"{0} mth"},"narrow":{"other":"{0}m"},"perUnit":{"long":"{0} per month","short":"{0}/m","narrow":"{0}/m"}},"week":{"long":{"other":"{0} weeks","one":"{0} week"},"short":{"other":"{0} wks","one":"{0} wk"},"narrow":{"other":"{0}w"},"perUnit":{"long":"{0} per week","short":"{0}/w","narrow":"{0}/w"}},"day":{"long":{"other":"{0} days","one":"{0} day"},"short":{"other":"{0} days","one":"{0} day"},"narrow":{"other":"{0}d"},"perUnit":{"long":"{0} per day","short":"{0}/d","narrow":"{0}/d"}},"hour":{"long":{"other":"{0} hours","one":"{0} hour"},"short":{"other":"{0} hr"},"narrow":{"other":"{0}h"},"perUnit":{"long":"{0} per hour","short":"{0}/h","narrow":"{0}/h"}},"minute":{"long":{"other":"{0} minutes","one":"{0} minute"},"short":{"other":"{0} min"},"narrow":{"other":"{0}m"},"perUnit":{"long":"{0} per minute","short":"{0}/min","narrow":"{0}/min"}},"second":{"long":{"other":"{0} seconds","one":"{0} second"},"short":{"other":"{0} sec"},"narrow":{"other":"{0}s"},"perUnit":{"long":"{0} per second","short":"{0}/s","narrow":"{0}/s"}},"millisecond":{"long":{"other":"{0} milliseconds","one":"{0} millisecond"},"short":{"other":"{0} ms"},"narrow":{"other":"{0}ms"},"perUnit":{}},"kilometer":{"long":{"other":"{0} kilometers","one":"{0} kilometer"},"short":{"other":"{0} km"},"narrow":{"other":"{0}km"},"perUnit":{"long":"{0} per kilometer","short":"{0}/km","narrow":"{0}/km"}},"meter":{"long":{"other":"{0} meters","one":"{0} meter"},"short":{"other":"{0} m"},"narrow":{"other":"{0}m"},"perUnit":{"long":"{0} per meter","short":"{0}/m","narrow":"{0}/m"}},"centimeter":{"long":{"other":"{0} centimeters","one":"{0} centimeter"},"short":{"other":"{0} cm"},"narrow":{"other":"{0}cm"},"perUnit":{"long":"{0} per centimeter","short":"{0}/cm","narrow":"{0}/cm"}},"millimeter":{"long":{"other":"{0} millimeters","one":"{0} millimeter"},"short":{"other":"{0} mm"},"narrow":{"other":"{0}mm"},"perUnit":{}},"mile":{"long":{"other":"{0} miles","one":"{0} mile"},"short":{"other":"{0} mi"},"narrow":{"other":"{0}mi"},"perUnit":{}},"yard":{"long":{"other":"{0} yards","one":"{0} yard"},"short":{"other":"{0} yd"},"narrow":{"other":"{0}yd"},"perUnit":{}},"foot":{"long":{"other":"{0} feet","one":"{0} foot"},"short":{"other":"{0} ft"},"narrow":{"other":"{0}′"},"perUnit":{"long":"{0} per foot","short":"{0}/ft","narrow":"{0}/ft"}},"inch":{"long":{"other":"{0} inches","one":"{0} inch"},"short":{"other":"{0} in"},"narrow":{"other":"{0}″"},"perUnit":{"long":"{0} per inch","short":"{0}/in","narrow":"{0}/in"}},"mile-scandinavian":{"long":{"other":"{0} miles-scandinavian","one":"{0} mile-scandinavian"},"short":{"other":"{0} smi"},"narrow":{"other":"{0}smi"},"perUnit":{}},"kilogram":{"long":{"other":"{0} kilograms","one":"{0} kilogram"},"short":{"other":"{0} kg"},"narrow":{"other":"{0}kg"},"perUnit":{"long":"{0} per kilogram","short":"{0}/kg","narrow":"{0}/kg"}},"gram":{"long":{"other":"{0} grams","one":"{0} gram"},"short":{"other":"{0} g"},"narrow":{"other":"{0}g"},"perUnit":{"long":"{0} per gram","short":"{0}/g","narrow":"{0}/g"}},"stone":{"long":{"other":"{0} stones","one":"{0} stone"},"short":{"other":"{0} st"},"narrow":{"other":"{0}st"},"perUnit":{}},"pound":{"long":{"other":"{0} pounds","one":"{0} pound"},"short":{"other":"{0} lb"},"narrow":{"other":"{0}#"},"perUnit":{"long":"{0} per pound","short":"{0}/lb","narrow":"{0}/lb"}},"ounce":{"long":{"other":"{0} ounces","one":"{0} ounce"},"short":{"other":"{0} oz"},"narrow":{"other":"{0}oz"},"perUnit":{"long":"{0} per ounce","short":"{0}/oz","narrow":"{0}/oz"}},"kilometer-per-hour":{"long":{"other":"{0} kilometers per hour","one":"{0} kilometer per hour"},"short":{"other":"{0} km/h"},"narrow":{"other":"{0}km/h"},"perUnit":{}},"meter-per-second":{"long":{"other":"{0} meters per second","one":"{0} meter per second"},"short":{"other":"{0} m/s"},"narrow":{"other":"{0}m/s"},"perUnit":{}},"mile-per-hour":{"long":{"other":"{0} miles per hour","one":"{0} mile per hour"},"short":{"other":"{0} mph"},"narrow":{"other":"{0}mph"},"perUnit":{}},"celsius":{"long":{"other":"{0} degrees Celsius","one":"{0} degree Celsius"},"short":{"other":"{0}°C"},"narrow":{"other":"{0}°C"},"perUnit":{}},"fahrenheit":{"long":{"other":"{0} degrees Fahrenheit","one":"{0} degree Fahrenheit"},"short":{"other":"{0}°F"},"narrow":{"other":"{0}°"},"perUnit":{}},"liter":{"long":{"other":"{0} liters","one":"{0} liter"},"short":{"other":"{0} L"},"narrow":{"other":"{0}L"},"perUnit":{"long":"{0} per liter","short":"{0}/L","narrow":"{0}/L"}},"milliliter":{"long":{"other":"{0} milliliters","one":"{0} milliliter"},"short":{"other":"{0} mL"},"narrow":{"other":"{0}mL"},"perUnit":{}},"gallon":{"long":{"other":"{0} gallons","one":"{0} gallon"},"short":{"other":"{0} gal"},"narrow":{"other":"{0}gal"},"perUnit":{"long":"{0} per gallon","short":"{0}/gal US","narrow":"{0}/gal"}},"fluid-ounce":{"long":{"other":"{0} fluid ounces","one":"{0} fluid ounce"},"short":{"other":"{0} fl oz"},"narrow":{"other":"{0}fl oz"},"perUnit":{}}},"compound":{"per":{"long":"{0} per {1}","short":"{0}/{1}","narrow":"{0}/{1}"}}},"currencies":{"ADP":{"displayName":{"other":"Andorran pesetas","one":"Andorran peseta"},"symbol":"ADP","narrow":"ADP"},"AED":{"displayName":{"other":"UAE dirhams","one":"UAE dirham"},"symbol":"AED","narrow":"AED"},"AFA":{"displayName":{"other":"Afghan afghanis (1927–2002)","one":"Afghan afghani (1927–2002)"},"symbol":"AFA","narrow":"AFA"},"AFN":{"displayName":{"other":"Afghan Afghanis","one":"Afghan Afghani"},"symbol":"AFN","narrow":"؋"},"ALK":{"displayName":{"other":"Albanian lekë (1946–1965)","one":"Albanian lek (1946–1965)"},"symbol":"ALK","narrow":"ALK"},"ALL":{"displayName":{"other":"Albanian lekë","one":"Albanian lek"},"symbol":"ALL","narrow":"ALL"},"AMD":{"displayName":{"other":"Armenian drams","one":"Armenian dram"},"symbol":"AMD","narrow":"֏"},"ANG":{"displayName":{"other":"Netherlands Antillean guilders","one":"Netherlands Antillean guilder"},"symbol":"ANG","narrow":"ANG"},"AOA":{"displayName":{"other":"Angolan kwanzas","one":"Angolan kwanza"},"symbol":"AOA","narrow":"Kz"},"AOK":{"displayName":{"other":"Angolan kwanzas (1977–1991)","one":"Angolan kwanza (1977–1991)"},"symbol":"AOK","narrow":"AOK"},"AON":{"displayName":{"other":"Angolan new kwanzas (1990–2000)","one":"Angolan new kwanza (1990–2000)"},"symbol":"AON","narrow":"AON"},"AOR":{"displayName":{"other":"Angolan readjusted kwanzas (1995–1999)","one":"Angolan readjusted kwanza (1995–1999)"},"symbol":"AOR","narrow":"AOR"},"ARA":{"displayName":{"other":"Argentine australs","one":"Argentine austral"},"symbol":"ARA","narrow":"ARA"},"ARL":{"displayName":{"other":"Argentine pesos ley (1970–1983)","one":"Argentine peso ley (1970–1983)"},"symbol":"ARL","narrow":"ARL"},"ARM":{"displayName":{"other":"Argentine pesos (1881–1970)","one":"Argentine peso (1881–1970)"},"symbol":"ARM","narrow":"ARM"},"ARP":{"displayName":{"other":"Argentine pesos (1983–1985)","one":"Argentine peso (1983–1985)"},"symbol":"ARP","narrow":"ARP"},"ARS":{"displayName":{"other":"Argentine pesos","one":"Argentine peso"},"symbol":"ARS","narrow":"$"},"ATS":{"displayName":{"other":"Austrian schillings","one":"Austrian schilling"},"symbol":"ATS","narrow":"ATS"},"AUD":{"displayName":{"other":"Australian dollars","one":"Australian dollar"},"symbol":"A$","narrow":"$"},"AWG":{"displayName":{"other":"Aruban florin"},"symbol":"AWG","narrow":"AWG"},"AZM":{"displayName":{"other":"Azerbaijani manats (1993–2006)","one":"Azerbaijani manat (1993–2006)"},"symbol":"AZM","narrow":"AZM"},"AZN":{"displayName":{"other":"Azerbaijani manats","one":"Azerbaijani manat"},"symbol":"AZN","narrow":"₼"},"BAD":{"displayName":{"other":"Bosnia-Herzegovina dinars (1992–1994)","one":"Bosnia-Herzegovina dinar (1992–1994)"},"symbol":"BAD","narrow":"BAD"},"BAM":{"displayName":{"other":"Bosnia-Herzegovina convertible marks","one":"Bosnia-Herzegovina convertible mark"},"symbol":"BAM","narrow":"KM"},"BAN":{"displayName":{"other":"Bosnia-Herzegovina new dinars (1994–1997)","one":"Bosnia-Herzegovina new dinar (1994–1997)"},"symbol":"BAN","narrow":"BAN"},"BBD":{"displayName":{"other":"Barbadian dollars","one":"Barbadian dollar"},"symbol":"BBD","narrow":"$"},"BDT":{"displayName":{"other":"Bangladeshi takas","one":"Bangladeshi taka"},"symbol":"BDT","narrow":"৳"},"BEC":{"displayName":{"other":"Belgian francs (convertible)","one":"Belgian franc (convertible)"},"symbol":"BEC","narrow":"BEC"},"BEF":{"displayName":{"other":"Belgian francs","one":"Belgian franc"},"symbol":"BEF","narrow":"BEF"},"BEL":{"displayName":{"other":"Belgian francs (financial)","one":"Belgian franc (financial)"},"symbol":"BEL","narrow":"BEL"},"BGL":{"displayName":{"other":"Bulgarian hard leva","one":"Bulgarian hard lev"},"symbol":"BGL","narrow":"BGL"},"BGM":{"displayName":{"other":"Bulgarian socialist leva","one":"Bulgarian socialist lev"},"symbol":"BGM","narrow":"BGM"},"BGN":{"displayName":{"other":"Bulgarian leva","one":"Bulgarian lev"},"symbol":"BGN","narrow":"BGN"},"BGO":{"displayName":{"other":"Bulgarian leva (1879–1952)","one":"Bulgarian lev (1879–1952)"},"symbol":"BGO","narrow":"BGO"},"BHD":{"displayName":{"other":"Bahraini dinars","one":"Bahraini dinar"},"symbol":"BHD","narrow":"BHD"},"BIF":{"displayName":{"other":"Burundian francs","one":"Burundian franc"},"symbol":"BIF","narrow":"BIF"},"BMD":{"displayName":{"other":"Bermudan dollars","one":"Bermudan dollar"},"symbol":"BMD","narrow":"$"},"BND":{"displayName":{"other":"Brunei dollars","one":"Brunei dollar"},"symbol":"BND","narrow":"$"},"BOB":{"displayName":{"other":"Bolivian bolivianos","one":"Bolivian boliviano"},"symbol":"BOB","narrow":"Bs"},"BOL":{"displayName":{"other":"Bolivian bolivianos (1863–1963)","one":"Bolivian boliviano (1863–1963)"},"symbol":"BOL","narrow":"BOL"},"BOP":{"displayName":{"other":"Bolivian pesos","one":"Bolivian peso"},"symbol":"BOP","narrow":"BOP"},"BOV":{"displayName":{"other":"Bolivian mvdols","one":"Bolivian mvdol"},"symbol":"BOV","narrow":"BOV"},"BRB":{"displayName":{"other":"Brazilian new cruzeiros (1967–1986)","one":"Brazilian new cruzeiro (1967–1986)"},"symbol":"BRB","narrow":"BRB"},"BRC":{"displayName":{"other":"Brazilian cruzados (1986–1989)","one":"Brazilian cruzado (1986–1989)"},"symbol":"BRC","narrow":"BRC"},"BRE":{"displayName":{"other":"Brazilian cruzeiros (1990–1993)","one":"Brazilian cruzeiro (1990–1993)"},"symbol":"BRE","narrow":"BRE"},"BRL":{"displayName":{"other":"Brazilian reals","one":"Brazilian real"},"symbol":"R$","narrow":"R$"},"BRN":{"displayName":{"other":"Brazilian new cruzados (1989–1990)","one":"Brazilian new cruzado (1989–1990)"},"symbol":"BRN","narrow":"BRN"},"BRR":{"displayName":{"other":"Brazilian cruzeiros (1993–1994)","one":"Brazilian cruzeiro (1993–1994)"},"symbol":"BRR","narrow":"BRR"},"BRZ":{"displayName":{"other":"Brazilian cruzeiros (1942–1967)","one":"Brazilian cruzeiro (1942–1967)"},"symbol":"BRZ","narrow":"BRZ"},"BSD":{"displayName":{"other":"Bahamian dollars","one":"Bahamian dollar"},"symbol":"BSD","narrow":"$"},"BTN":{"displayName":{"other":"Bhutanese ngultrums","one":"Bhutanese ngultrum"},"symbol":"BTN","narrow":"BTN"},"BUK":{"displayName":{"other":"Burmese kyats","one":"Burmese kyat"},"symbol":"BUK","narrow":"BUK"},"BWP":{"displayName":{"other":"Botswanan pulas","one":"Botswanan pula"},"symbol":"BWP","narrow":"P"},"BYB":{"displayName":{"other":"Belarusian rubles (1994–1999)","one":"Belarusian ruble (1994–1999)"},"symbol":"BYB","narrow":"BYB"},"BYN":{"displayName":{"other":"Belarusian rubles","one":"Belarusian ruble"},"symbol":"BYN","narrow":"р."},"BYR":{"displayName":{"other":"Belarusian rubles (2000–2016)","one":"Belarusian ruble (2000–2016)"},"symbol":"BYR","narrow":"BYR"},"BZD":{"displayName":{"other":"Belize dollars","one":"Belize dollar"},"symbol":"BZD","narrow":"$"},"CAD":{"displayName":{"other":"Canadian dollars","one":"Canadian dollar"},"symbol":"CA$","narrow":"$"},"CDF":{"displayName":{"other":"Congolese francs","one":"Congolese franc"},"symbol":"CDF","narrow":"CDF"},"CHE":{"displayName":{"other":"WIR euros","one":"WIR euro"},"symbol":"CHE","narrow":"CHE"},"CHF":{"displayName":{"other":"Swiss francs","one":"Swiss franc"},"symbol":"CHF","narrow":"CHF"},"CHW":{"displayName":{"other":"WIR francs","one":"WIR franc"},"symbol":"CHW","narrow":"CHW"},"CLE":{"displayName":{"other":"Chilean escudos","one":"Chilean escudo"},"symbol":"CLE","narrow":"CLE"},"CLF":{"displayName":{"other":"Chilean units of account (UF)","one":"Chilean unit of account (UF)"},"symbol":"CLF","narrow":"CLF"},"CLP":{"displayName":{"other":"Chilean pesos","one":"Chilean peso"},"symbol":"CLP","narrow":"$"},"CNH":{"displayName":{"other":"Chinese yuan (offshore)"},"symbol":"CNH","narrow":"CNH"},"CNX":{"displayName":{"other":"Chinese People’s Bank dollars","one":"Chinese People’s Bank dollar"},"symbol":"CNX","narrow":"CNX"},"CNY":{"displayName":{"other":"Chinese yuan"},"symbol":"CN¥","narrow":"¥"},"COP":{"displayName":{"other":"Colombian pesos","one":"Colombian peso"},"symbol":"COP","narrow":"$"},"COU":{"displayName":{"other":"Colombian real value units","one":"Colombian real value unit"},"symbol":"COU","narrow":"COU"},"CRC":{"displayName":{"other":"Costa Rican colóns","one":"Costa Rican colón"},"symbol":"CRC","narrow":"₡"},"CSD":{"displayName":{"other":"Serbian dinars (2002–2006)","one":"Serbian dinar (2002–2006)"},"symbol":"CSD","narrow":"CSD"},"CSK":{"displayName":{"other":"Czechoslovak hard korunas","one":"Czechoslovak hard koruna"},"symbol":"CSK","narrow":"CSK"},"CUC":{"displayName":{"other":"Cuban convertible pesos","one":"Cuban convertible peso"},"symbol":"CUC","narrow":"$"},"CUP":{"displayName":{"other":"Cuban pesos","one":"Cuban peso"},"symbol":"CUP","narrow":"$"},"CVE":{"displayName":{"other":"Cape Verdean escudos","one":"Cape Verdean escudo"},"symbol":"CVE","narrow":"CVE"},"CYP":{"displayName":{"other":"Cypriot pounds","one":"Cypriot pound"},"symbol":"CYP","narrow":"CYP"},"CZK":{"displayName":{"other":"Czech korunas","one":"Czech koruna"},"symbol":"CZK","narrow":"Kč"},"DDM":{"displayName":{"other":"East German marks","one":"East German mark"},"symbol":"DDM","narrow":"DDM"},"DEM":{"displayName":{"other":"German marks","one":"German mark"},"symbol":"DEM","narrow":"DEM"},"DJF":{"displayName":{"other":"Djiboutian francs","one":"Djiboutian franc"},"symbol":"DJF","narrow":"DJF"},"DKK":{"displayName":{"other":"Danish kroner","one":"Danish krone"},"symbol":"DKK","narrow":"kr"},"DOP":{"displayName":{"other":"Dominican pesos","one":"Dominican peso"},"symbol":"DOP","narrow":"$"},"DZD":{"displayName":{"other":"Algerian dinars","one":"Algerian dinar"},"symbol":"DZD","narrow":"DZD"},"ECS":{"displayName":{"other":"Ecuadorian sucres","one":"Ecuadorian sucre"},"symbol":"ECS","narrow":"ECS"},"ECV":{"displayName":{"other":"Ecuadorian units of constant value","one":"Ecuadorian unit of constant value"},"symbol":"ECV","narrow":"ECV"},"EEK":{"displayName":{"other":"Estonian kroons","one":"Estonian kroon"},"symbol":"EEK","narrow":"EEK"},"EGP":{"displayName":{"other":"Egyptian pounds","one":"Egyptian pound"},"symbol":"EGP","narrow":"E£"},"ERN":{"displayName":{"other":"Eritrean nakfas","one":"Eritrean nakfa"},"symbol":"ERN","narrow":"ERN"},"ESA":{"displayName":{"other":"Spanish pesetas (A account)","one":"Spanish peseta (A account)"},"symbol":"ESA","narrow":"ESA"},"ESB":{"displayName":{"other":"Spanish pesetas (convertible account)","one":"Spanish peseta (convertible account)"},"symbol":"ESB","narrow":"ESB"},"ESP":{"displayName":{"other":"Spanish pesetas","one":"Spanish peseta"},"symbol":"ESP","narrow":"₧"},"ETB":{"displayName":{"other":"Ethiopian birrs","one":"Ethiopian birr"},"symbol":"ETB","narrow":"ETB"},"EUR":{"displayName":{"other":"euros","one":"euro"},"symbol":"€","narrow":"€"},"FIM":{"displayName":{"other":"Finnish markkas","one":"Finnish markka"},"symbol":"FIM","narrow":"FIM"},"FJD":{"displayName":{"other":"Fijian dollars","one":"Fijian dollar"},"symbol":"FJD","narrow":"$"},"FKP":{"displayName":{"other":"Falkland Islands pounds","one":"Falkland Islands pound"},"symbol":"FKP","narrow":"£"},"FRF":{"displayName":{"other":"French francs","one":"French franc"},"symbol":"FRF","narrow":"FRF"},"GBP":{"displayName":{"other":"British pounds","one":"British pound"},"symbol":"£","narrow":"£"},"GEK":{"displayName":{"other":"Georgian kupon larits","one":"Georgian kupon larit"},"symbol":"GEK","narrow":"GEK"},"GEL":{"displayName":{"other":"Georgian laris","one":"Georgian lari"},"symbol":"GEL","narrow":"₾"},"GHC":{"displayName":{"other":"Ghanaian cedis (1979–2007)","one":"Ghanaian cedi (1979–2007)"},"symbol":"GHC","narrow":"GHC"},"GHS":{"displayName":{"other":"Ghanaian cedis","one":"Ghanaian cedi"},"symbol":"GHS","narrow":"GH₵"},"GIP":{"displayName":{"other":"Gibraltar pounds","one":"Gibraltar pound"},"symbol":"GIP","narrow":"£"},"GMD":{"displayName":{"other":"Gambian dalasis","one":"Gambian dalasi"},"symbol":"GMD","narrow":"GMD"},"GNF":{"displayName":{"other":"Guinean francs","one":"Guinean franc"},"symbol":"GNF","narrow":"FG"},"GNS":{"displayName":{"other":"Guinean sylis","one":"Guinean syli"},"symbol":"GNS","narrow":"GNS"},"GQE":{"displayName":{"other":"Equatorial Guinean ekwele"},"symbol":"GQE","narrow":"GQE"},"GRD":{"displayName":{"other":"Greek drachmas","one":"Greek drachma"},"symbol":"GRD","narrow":"GRD"},"GTQ":{"displayName":{"other":"Guatemalan quetzals","one":"Guatemalan quetzal"},"symbol":"GTQ","narrow":"Q"},"GWE":{"displayName":{"other":"Portuguese Guinea escudos","one":"Portuguese Guinea escudo"},"symbol":"GWE","narrow":"GWE"},"GWP":{"displayName":{"other":"Guinea-Bissau pesos","one":"Guinea-Bissau peso"},"symbol":"GWP","narrow":"GWP"},"GYD":{"displayName":{"other":"Guyanaese dollars","one":"Guyanaese dollar"},"symbol":"GYD","narrow":"$"},"HKD":{"displayName":{"other":"Hong Kong dollars","one":"Hong Kong dollar"},"symbol":"HK$","narrow":"$"},"HNL":{"displayName":{"other":"Honduran lempiras","one":"Honduran lempira"},"symbol":"HNL","narrow":"L"},"HRD":{"displayName":{"other":"Croatian dinars","one":"Croatian dinar"},"symbol":"HRD","narrow":"HRD"},"HRK":{"displayName":{"other":"Croatian kunas","one":"Croatian kuna"},"symbol":"HRK","narrow":"kn"},"HTG":{"displayName":{"other":"Haitian gourdes","one":"Haitian gourde"},"symbol":"HTG","narrow":"HTG"},"HUF":{"displayName":{"other":"Hungarian forints","one":"Hungarian forint"},"symbol":"HUF","narrow":"Ft"},"IDR":{"displayName":{"other":"Indonesian rupiahs","one":"Indonesian rupiah"},"symbol":"IDR","narrow":"Rp"},"IEP":{"displayName":{"other":"Irish pounds","one":"Irish pound"},"symbol":"IEP","narrow":"IEP"},"ILP":{"displayName":{"other":"Israeli pounds","one":"Israeli pound"},"symbol":"ILP","narrow":"ILP"},"ILR":{"displayName":{"other":"Israeli shekels (1980–1985)","one":"Israeli shekel (1980–1985)"},"symbol":"ILR","narrow":"ILR"},"ILS":{"displayName":{"other":"Israeli new shekels","one":"Israeli new shekel"},"symbol":"₪","narrow":"₪"},"INR":{"displayName":{"other":"Indian rupees","one":"Indian rupee"},"symbol":"₹","narrow":"₹"},"IQD":{"displayName":{"other":"Iraqi dinars","one":"Iraqi dinar"},"symbol":"IQD","narrow":"IQD"},"IRR":{"displayName":{"other":"Iranian rials","one":"Iranian rial"},"symbol":"IRR","narrow":"IRR"},"ISJ":{"displayName":{"other":"Icelandic krónur (1918–1981)","one":"Icelandic króna (1918–1981)"},"symbol":"ISJ","narrow":"ISJ"},"ISK":{"displayName":{"other":"Icelandic krónur","one":"Icelandic króna"},"symbol":"ISK","narrow":"kr"},"ITL":{"displayName":{"other":"Italian liras","one":"Italian lira"},"symbol":"ITL","narrow":"ITL"},"JMD":{"displayName":{"other":"Jamaican dollars","one":"Jamaican dollar"},"symbol":"JMD","narrow":"$"},"JOD":{"displayName":{"other":"Jordanian dinars","one":"Jordanian dinar"},"symbol":"JOD","narrow":"JOD"},"JPY":{"displayName":{"other":"Japanese yen"},"symbol":"¥","narrow":"¥"},"KES":{"displayName":{"other":"Kenyan shillings","one":"Kenyan shilling"},"symbol":"KES","narrow":"KES"},"KGS":{"displayName":{"other":"Kyrgystani soms","one":"Kyrgystani som"},"symbol":"KGS","narrow":"KGS"},"KHR":{"displayName":{"other":"Cambodian riels","one":"Cambodian riel"},"symbol":"KHR","narrow":"៛"},"KMF":{"displayName":{"other":"Comorian francs","one":"Comorian franc"},"symbol":"KMF","narrow":"CF"},"KPW":{"displayName":{"other":"North Korean won"},"symbol":"KPW","narrow":"₩"},"KRH":{"displayName":{"other":"South Korean hwan (1953–1962)"},"symbol":"KRH","narrow":"KRH"},"KRO":{"displayName":{"other":"South Korean won (1945–1953)"},"symbol":"KRO","narrow":"KRO"},"KRW":{"displayName":{"other":"South Korean won"},"symbol":"₩","narrow":"₩"},"KWD":{"displayName":{"other":"Kuwaiti dinars","one":"Kuwaiti dinar"},"symbol":"KWD","narrow":"KWD"},"KYD":{"displayName":{"other":"Cayman Islands dollars","one":"Cayman Islands dollar"},"symbol":"KYD","narrow":"$"},"KZT":{"displayName":{"other":"Kazakhstani tenges","one":"Kazakhstani tenge"},"symbol":"KZT","narrow":"₸"},"LAK":{"displayName":{"other":"Laotian kips","one":"Laotian kip"},"symbol":"LAK","narrow":"₭"},"LBP":{"displayName":{"other":"Lebanese pounds","one":"Lebanese pound"},"symbol":"LBP","narrow":"L£"},"LKR":{"displayName":{"other":"Sri Lankan rupees","one":"Sri Lankan rupee"},"symbol":"LKR","narrow":"Rs"},"LRD":{"displayName":{"other":"Liberian dollars","one":"Liberian dollar"},"symbol":"LRD","narrow":"$"},"LSL":{"displayName":{"other":"Lesotho lotis","one":"Lesotho loti"},"symbol":"LSL","narrow":"LSL"},"LTL":{"displayName":{"other":"Lithuanian litai","one":"Lithuanian litas"},"symbol":"LTL","narrow":"Lt"},"LTT":{"displayName":{"other":"Lithuanian talonases","one":"Lithuanian talonas"},"symbol":"LTT","narrow":"LTT"},"LUC":{"displayName":{"other":"Luxembourgian convertible francs","one":"Luxembourgian convertible franc"},"symbol":"LUC","narrow":"LUC"},"LUF":{"displayName":{"other":"Luxembourgian francs","one":"Luxembourgian franc"},"symbol":"LUF","narrow":"LUF"},"LUL":{"displayName":{"other":"Luxembourg financial francs","one":"Luxembourg financial franc"},"symbol":"LUL","narrow":"LUL"},"LVL":{"displayName":{"other":"Latvian lati","one":"Latvian lats"},"symbol":"LVL","narrow":"Ls"},"LVR":{"displayName":{"other":"Latvian rubles","one":"Latvian ruble"},"symbol":"LVR","narrow":"LVR"},"LYD":{"displayName":{"other":"Libyan dinars","one":"Libyan dinar"},"symbol":"LYD","narrow":"LYD"},"MAD":{"displayName":{"other":"Moroccan dirhams","one":"Moroccan dirham"},"symbol":"MAD","narrow":"MAD"},"MAF":{"displayName":{"other":"Moroccan francs","one":"Moroccan franc"},"symbol":"MAF","narrow":"MAF"},"MCF":{"displayName":{"other":"Monegasque francs","one":"Monegasque franc"},"symbol":"MCF","narrow":"MCF"},"MDC":{"displayName":{"other":"Moldovan cupon"},"symbol":"MDC","narrow":"MDC"},"MDL":{"displayName":{"other":"Moldovan lei","one":"Moldovan leu"},"symbol":"MDL","narrow":"MDL"},"MGA":{"displayName":{"other":"Malagasy ariaries","one":"Malagasy ariary"},"symbol":"MGA","narrow":"Ar"},"MGF":{"displayName":{"other":"Malagasy francs","one":"Malagasy franc"},"symbol":"MGF","narrow":"MGF"},"MKD":{"displayName":{"other":"Macedonian denari","one":"Macedonian denar"},"symbol":"MKD","narrow":"MKD"},"MKN":{"displayName":{"other":"Macedonian denari (1992–1993)","one":"Macedonian denar (1992–1993)"},"symbol":"MKN","narrow":"MKN"},"MLF":{"displayName":{"other":"Malian francs","one":"Malian franc"},"symbol":"MLF","narrow":"MLF"},"MMK":{"displayName":{"other":"Myanmar kyats","one":"Myanmar kyat"},"symbol":"MMK","narrow":"K"},"MNT":{"displayName":{"other":"Mongolian tugriks","one":"Mongolian tugrik"},"symbol":"MNT","narrow":"₮"},"MOP":{"displayName":{"other":"Macanese patacas","one":"Macanese pataca"},"symbol":"MOP","narrow":"MOP"},"MRO":{"displayName":{"other":"Mauritanian ouguiyas (1973–2017)","one":"Mauritanian ouguiya (1973–2017)"},"symbol":"MRO","narrow":"MRO"},"MRU":{"displayName":{"other":"Mauritanian ouguiyas","one":"Mauritanian ouguiya"},"symbol":"MRU","narrow":"MRU"},"MTL":{"displayName":{"other":"Maltese lira"},"symbol":"MTL","narrow":"MTL"},"MTP":{"displayName":{"other":"Maltese pounds","one":"Maltese pound"},"symbol":"MTP","narrow":"MTP"},"MUR":{"displayName":{"other":"Mauritian rupees","one":"Mauritian rupee"},"symbol":"MUR","narrow":"Rs"},"MVP":{"displayName":{"other":"Maldivian rupees (1947–1981)","one":"Maldivian rupee (1947–1981)"},"symbol":"MVP","narrow":"MVP"},"MVR":{"displayName":{"other":"Maldivian rufiyaas","one":"Maldivian rufiyaa"},"symbol":"MVR","narrow":"MVR"},"MWK":{"displayName":{"other":"Malawian kwachas","one":"Malawian kwacha"},"symbol":"MWK","narrow":"MWK"},"MXN":{"displayName":{"other":"Mexican pesos","one":"Mexican peso"},"symbol":"MX$","narrow":"$"},"MXP":{"displayName":{"other":"Mexican silver pesos (1861–1992)","one":"Mexican silver peso (1861–1992)"},"symbol":"MXP","narrow":"MXP"},"MXV":{"displayName":{"other":"Mexican investment units","one":"Mexican investment unit"},"symbol":"MXV","narrow":"MXV"},"MYR":{"displayName":{"other":"Malaysian ringgits","one":"Malaysian ringgit"},"symbol":"MYR","narrow":"RM"},"MZE":{"displayName":{"other":"Mozambican escudos","one":"Mozambican escudo"},"symbol":"MZE","narrow":"MZE"},"MZM":{"displayName":{"other":"Mozambican meticals (1980–2006)","one":"Mozambican metical (1980–2006)"},"symbol":"MZM","narrow":"MZM"},"MZN":{"displayName":{"other":"Mozambican meticals","one":"Mozambican metical"},"symbol":"MZN","narrow":"MZN"},"NAD":{"displayName":{"other":"Namibian dollars","one":"Namibian dollar"},"symbol":"NAD","narrow":"$"},"NGN":{"displayName":{"other":"Nigerian nairas","one":"Nigerian naira"},"symbol":"NGN","narrow":"₦"},"NIC":{"displayName":{"other":"Nicaraguan córdobas (1988–1991)","one":"Nicaraguan córdoba (1988–1991)"},"symbol":"NIC","narrow":"NIC"},"NIO":{"displayName":{"other":"Nicaraguan córdobas","one":"Nicaraguan córdoba"},"symbol":"NIO","narrow":"C$"},"NLG":{"displayName":{"other":"Dutch guilders","one":"Dutch guilder"},"symbol":"NLG","narrow":"NLG"},"NOK":{"displayName":{"other":"Norwegian kroner","one":"Norwegian krone"},"symbol":"NOK","narrow":"kr"},"NPR":{"displayName":{"other":"Nepalese rupees","one":"Nepalese rupee"},"symbol":"NPR","narrow":"Rs"},"NZD":{"displayName":{"other":"New Zealand dollars","one":"New Zealand dollar"},"symbol":"NZ$","narrow":"$"},"OMR":{"displayName":{"other":"Omani rials","one":"Omani rial"},"symbol":"OMR","narrow":"OMR"},"PAB":{"displayName":{"other":"Panamanian balboas","one":"Panamanian balboa"},"symbol":"PAB","narrow":"PAB"},"PEI":{"displayName":{"other":"Peruvian intis","one":"Peruvian inti"},"symbol":"PEI","narrow":"PEI"},"PEN":{"displayName":{"other":"Peruvian soles","one":"Peruvian sol"},"symbol":"PEN","narrow":"PEN"},"PES":{"displayName":{"other":"Peruvian soles (1863–1965)","one":"Peruvian sol (1863–1965)"},"symbol":"PES","narrow":"PES"},"PGK":{"displayName":{"other":"Papua New Guinean kina"},"symbol":"PGK","narrow":"PGK"},"PHP":{"displayName":{"other":"Philippine pisos","one":"Philippine piso"},"symbol":"₱","narrow":"₱"},"PKR":{"displayName":{"other":"Pakistani rupees","one":"Pakistani rupee"},"symbol":"PKR","narrow":"Rs"},"PLN":{"displayName":{"other":"Polish zlotys","one":"Polish zloty"},"symbol":"PLN","narrow":"zł"},"PLZ":{"displayName":{"other":"Polish zlotys (PLZ)","one":"Polish zloty (PLZ)"},"symbol":"PLZ","narrow":"PLZ"},"PTE":{"displayName":{"other":"Portuguese escudos","one":"Portuguese escudo"},"symbol":"PTE","narrow":"PTE"},"PYG":{"displayName":{"other":"Paraguayan guaranis","one":"Paraguayan guarani"},"symbol":"PYG","narrow":"₲"},"QAR":{"displayName":{"other":"Qatari rials","one":"Qatari rial"},"symbol":"QAR","narrow":"QAR"},"RHD":{"displayName":{"other":"Rhodesian dollars","one":"Rhodesian dollar"},"symbol":"RHD","narrow":"RHD"},"ROL":{"displayName":{"other":"Romanian Lei (1952–2006)","one":"Romanian leu (1952–2006)"},"symbol":"ROL","narrow":"ROL"},"RON":{"displayName":{"other":"Romanian lei","one":"Romanian leu"},"symbol":"RON","narrow":"lei"},"RSD":{"displayName":{"other":"Serbian dinars","one":"Serbian dinar"},"symbol":"RSD","narrow":"RSD"},"RUB":{"displayName":{"other":"Russian rubles","one":"Russian ruble"},"symbol":"RUB","narrow":"₽"},"RUR":{"displayName":{"other":"Russian rubles (1991–1998)","one":"Russian ruble (1991–1998)"},"symbol":"RUR","narrow":"р."},"RWF":{"displayName":{"other":"Rwandan francs","one":"Rwandan franc"},"symbol":"RWF","narrow":"RF"},"SAR":{"displayName":{"other":"Saudi riyals","one":"Saudi riyal"},"symbol":"SAR","narrow":"SAR"},"SBD":{"displayName":{"other":"Solomon Islands dollars","one":"Solomon Islands dollar"},"symbol":"SBD","narrow":"$"},"SCR":{"displayName":{"other":"Seychellois rupees","one":"Seychellois rupee"},"symbol":"SCR","narrow":"SCR"},"SDD":{"displayName":{"other":"Sudanese dinars (1992–2007)","one":"Sudanese dinar (1992–2007)"},"symbol":"SDD","narrow":"SDD"},"SDG":{"displayName":{"other":"Sudanese pounds","one":"Sudanese pound"},"symbol":"SDG","narrow":"SDG"},"SDP":{"displayName":{"other":"Sudanese pounds (1957–1998)","one":"Sudanese pound (1957–1998)"},"symbol":"SDP","narrow":"SDP"},"SEK":{"displayName":{"other":"Swedish kronor","one":"Swedish krona"},"symbol":"SEK","narrow":"kr"},"SGD":{"displayName":{"other":"Singapore dollars","one":"Singapore dollar"},"symbol":"SGD","narrow":"$"},"SHP":{"displayName":{"other":"St. Helena pounds","one":"St. Helena pound"},"symbol":"SHP","narrow":"£"},"SIT":{"displayName":{"other":"Slovenian tolars","one":"Slovenian tolar"},"symbol":"SIT","narrow":"SIT"},"SKK":{"displayName":{"other":"Slovak korunas","one":"Slovak koruna"},"symbol":"SKK","narrow":"SKK"},"SLL":{"displayName":{"other":"Sierra Leonean leones","one":"Sierra Leonean leone"},"symbol":"SLL","narrow":"SLL"},"SOS":{"displayName":{"other":"Somali shillings","one":"Somali shilling"},"symbol":"SOS","narrow":"SOS"},"SRD":{"displayName":{"other":"Surinamese dollars","one":"Surinamese dollar"},"symbol":"SRD","narrow":"$"},"SRG":{"displayName":{"other":"Surinamese guilders","one":"Surinamese guilder"},"symbol":"SRG","narrow":"SRG"},"SSP":{"displayName":{"other":"South Sudanese pounds","one":"South Sudanese pound"},"symbol":"SSP","narrow":"£"},"STD":{"displayName":{"other":"São Tomé & Príncipe dobras (1977–2017)","one":"São Tomé & Príncipe dobra (1977–2017)"},"symbol":"STD","narrow":"STD"},"STN":{"displayName":{"other":"São Tomé & Príncipe dobras","one":"São Tomé & Príncipe dobra"},"symbol":"STN","narrow":"Db"},"SUR":{"displayName":{"other":"Soviet roubles","one":"Soviet rouble"},"symbol":"SUR","narrow":"SUR"},"SVC":{"displayName":{"other":"Salvadoran colones","one":"Salvadoran colón"},"symbol":"SVC","narrow":"SVC"},"SYP":{"displayName":{"other":"Syrian pounds","one":"Syrian pound"},"symbol":"SYP","narrow":"£"},"SZL":{"displayName":{"other":"Swazi emalangeni","one":"Swazi lilangeni"},"symbol":"SZL","narrow":"SZL"},"THB":{"displayName":{"other":"Thai baht"},"symbol":"THB","narrow":"฿"},"TJR":{"displayName":{"other":"Tajikistani rubles","one":"Tajikistani ruble"},"symbol":"TJR","narrow":"TJR"},"TJS":{"displayName":{"other":"Tajikistani somonis","one":"Tajikistani somoni"},"symbol":"TJS","narrow":"TJS"},"TMM":{"displayName":{"other":"Turkmenistani manat (1993–2009)"},"symbol":"TMM","narrow":"TMM"},"TMT":{"displayName":{"other":"Turkmenistani manat"},"symbol":"TMT","narrow":"TMT"},"TND":{"displayName":{"other":"Tunisian dinars","one":"Tunisian dinar"},"symbol":"TND","narrow":"TND"},"TOP":{"displayName":{"other":"Tongan paʻanga"},"symbol":"TOP","narrow":"T$"},"TPE":{"displayName":{"other":"Timorese escudos","one":"Timorese escudo"},"symbol":"TPE","narrow":"TPE"},"TRL":{"displayName":{"other":"Turkish Lira (1922–2005)","one":"Turkish lira (1922–2005)"},"symbol":"TRL","narrow":"TRL"},"TRY":{"displayName":{"other":"Turkish Lira","one":"Turkish lira"},"symbol":"TRY","narrow":"₺"},"TTD":{"displayName":{"other":"Trinidad & Tobago dollars","one":"Trinidad & Tobago dollar"},"symbol":"TTD","narrow":"$"},"TWD":{"displayName":{"other":"New Taiwan dollars","one":"New Taiwan dollar"},"symbol":"NT$","narrow":"$"},"TZS":{"displayName":{"other":"Tanzanian shillings","one":"Tanzanian shilling"},"symbol":"TZS","narrow":"TZS"},"UAH":{"displayName":{"other":"Ukrainian hryvnias","one":"Ukrainian hryvnia"},"symbol":"UAH","narrow":"₴"},"UAK":{"displayName":{"other":"Ukrainian karbovantsiv","one":"Ukrainian karbovanets"},"symbol":"UAK","narrow":"UAK"},"UGS":{"displayName":{"other":"Ugandan shillings (1966–1987)","one":"Ugandan shilling (1966–1987)"},"symbol":"UGS","narrow":"UGS"},"UGX":{"displayName":{"other":"Ugandan shillings","one":"Ugandan shilling"},"symbol":"UGX","narrow":"UGX"},"USD":{"displayName":{"other":"US dollars","one":"US dollar"},"symbol":"$","narrow":"$"},"USN":{"displayName":{"other":"US dollars (next day)","one":"US dollar (next day)"},"symbol":"USN","narrow":"USN"},"USS":{"displayName":{"other":"US dollars (same day)","one":"US dollar (same day)"},"symbol":"USS","narrow":"USS"},"UYI":{"displayName":{"other":"Uruguayan pesos (indexed units)","one":"Uruguayan peso (indexed units)"},"symbol":"UYI","narrow":"UYI"},"UYP":{"displayName":{"other":"Uruguayan pesos (1975–1993)","one":"Uruguayan peso (1975–1993)"},"symbol":"UYP","narrow":"UYP"},"UYU":{"displayName":{"other":"Uruguayan pesos","one":"Uruguayan peso"},"symbol":"UYU","narrow":"$"},"UYW":{"displayName":{"other":"Uruguayan nominal wage index units","one":"Uruguayan nominal wage index unit"},"symbol":"UYW","narrow":"UYW"},"UZS":{"displayName":{"other":"Uzbekistani som"},"symbol":"UZS","narrow":"UZS"},"VEB":{"displayName":{"other":"Venezuelan bolívars (1871–2008)","one":"Venezuelan bolívar (1871–2008)"},"symbol":"VEB","narrow":"VEB"},"VEF":{"displayName":{"other":"Venezuelan bolívars (2008–2018)","one":"Venezuelan bolívar (2008–2018)"},"symbol":"VEF","narrow":"Bs"},"VES":{"displayName":{"other":"Venezuelan bolívars","one":"Venezuelan bolívar"},"symbol":"VES","narrow":"VES"},"VND":{"displayName":{"other":"Vietnamese dong"},"symbol":"₫","narrow":"₫"},"VNN":{"displayName":{"other":"Vietnamese dong (1978–1985)"},"symbol":"VNN","narrow":"VNN"},"VUV":{"displayName":{"other":"Vanuatu vatus","one":"Vanuatu vatu"},"symbol":"VUV","narrow":"VUV"},"WST":{"displayName":{"other":"Samoan tala"},"symbol":"WST","narrow":"WST"},"XAF":{"displayName":{"other":"Central African CFA francs","one":"Central African CFA franc"},"symbol":"FCFA","narrow":"FCFA"},"XAG":{"displayName":{"other":"troy ounces of silver","one":"troy ounce of silver"},"symbol":"XAG","narrow":"XAG"},"XAU":{"displayName":{"other":"troy ounces of gold","one":"troy ounce of gold"},"symbol":"XAU","narrow":"XAU"},"XBA":{"displayName":{"other":"European composite units","one":"European composite unit"},"symbol":"XBA","narrow":"XBA"},"XBB":{"displayName":{"other":"European monetary units","one":"European monetary unit"},"symbol":"XBB","narrow":"XBB"},"XBC":{"displayName":{"other":"European units of account (XBC)","one":"European unit of account (XBC)"},"symbol":"XBC","narrow":"XBC"},"XBD":{"displayName":{"other":"European units of account (XBD)","one":"European unit of account (XBD)"},"symbol":"XBD","narrow":"XBD"},"XCD":{"displayName":{"other":"East Caribbean dollars","one":"East Caribbean dollar"},"symbol":"EC$","narrow":"$"},"XDR":{"displayName":{"other":"special drawing rights"},"symbol":"XDR","narrow":"XDR"},"XEU":{"displayName":{"other":"European currency units","one":"European currency unit"},"symbol":"XEU","narrow":"XEU"},"XFO":{"displayName":{"other":"French gold francs","one":"French gold franc"},"symbol":"XFO","narrow":"XFO"},"XFU":{"displayName":{"other":"French UIC-francs","one":"French UIC-franc"},"symbol":"XFU","narrow":"XFU"},"XOF":{"displayName":{"other":"West African CFA francs","one":"West African CFA franc"},"symbol":"F CFA","narrow":"F CFA"},"XPD":{"displayName":{"other":"troy ounces of palladium","one":"troy ounce of palladium"},"symbol":"XPD","narrow":"XPD"},"XPF":{"displayName":{"other":"CFP francs","one":"CFP franc"},"symbol":"CFPF","narrow":"CFPF"},"XPT":{"displayName":{"other":"troy ounces of platinum","one":"troy ounce of platinum"},"symbol":"XPT","narrow":"XPT"},"XRE":{"displayName":{"other":"RINET Funds units","one":"RINET Funds unit"},"symbol":"XRE","narrow":"XRE"},"XSU":{"displayName":{"other":"Sucres","one":"Sucre"},"symbol":"XSU","narrow":"XSU"},"XTS":{"displayName":{"other":"Testing Currency units","one":"Testing Currency unit"},"symbol":"XTS","narrow":"XTS"},"XUA":{"displayName":{"other":"ADB units of account","one":"ADB unit of account"},"symbol":"XUA","narrow":"XUA"},"XXX":{"displayName":{"other":"(unknown currency)","one":"(unknown unit of currency)"},"symbol":"¤","narrow":"¤"},"YDD":{"displayName":{"other":"Yemeni dinars","one":"Yemeni dinar"},"symbol":"YDD","narrow":"YDD"},"YER":{"displayName":{"other":"Yemeni rials","one":"Yemeni rial"},"symbol":"YER","narrow":"YER"},"YUD":{"displayName":{"other":"Yugoslavian hard dinars (1966–1990)","one":"Yugoslavian hard dinar (1966–1990)"},"symbol":"YUD","narrow":"YUD"},"YUM":{"displayName":{"other":"Yugoslavian new dinars (1994–2002)","one":"Yugoslavian new dinar (1994–2002)"},"symbol":"YUM","narrow":"YUM"},"YUN":{"displayName":{"other":"Yugoslavian convertible dinars (1990–1992)","one":"Yugoslavian convertible dinar (1990–1992)"},"symbol":"YUN","narrow":"YUN"},"YUR":{"displayName":{"other":"Yugoslavian reformed dinars (1992–1993)","one":"Yugoslavian reformed dinar (1992–1993)"},"symbol":"YUR","narrow":"YUR"},"ZAL":{"displayName":{"other":"South African rands (financial)","one":"South African rand (financial)"},"symbol":"ZAL","narrow":"ZAL"},"ZAR":{"displayName":{"other":"South African rand"},"symbol":"ZAR","narrow":"R"},"ZMK":{"displayName":{"other":"Zambian kwachas (1968–2012)","one":"Zambian kwacha (1968–2012)"},"symbol":"ZMK","narrow":"ZMK"},"ZMW":{"displayName":{"other":"Zambian kwachas","one":"Zambian kwacha"},"symbol":"ZMW","narrow":"ZK"},"ZRN":{"displayName":{"other":"Zairean new zaires (1993–1998)","one":"Zairean new zaire (1993–1998)"},"symbol":"ZRN","narrow":"ZRN"},"ZRZ":{"displayName":{"other":"Zairean zaires (1971–1993)","one":"Zairean zaire (1971–1993)"},"symbol":"ZRZ","narrow":"ZRZ"},"ZWD":{"displayName":{"other":"Zimbabwean dollars (1980–2008)","one":"Zimbabwean dollar (1980–2008)"},"symbol":"ZWD","narrow":"ZWD"},"ZWL":{"displayName":{"other":"Zimbabwean dollars (2009)","one":"Zimbabwean dollar (2009)"},"symbol":"ZWL","narrow":"ZWL"},"ZWR":{"displayName":{"other":"Zimbabwean dollars (2008)","one":"Zimbabwean dollar (2008)"},"symbol":"ZWR","narrow":"ZWR"}},"numbers":{"nu":["latn"],"symbols":{"latn":{"decimal":".","group":",","list":";","percentSign":"%","plusSign":"+","minusSign":"-","approximatelySign":"~","exponential":"E","superscriptingExponent":"×","perMille":"‰","infinity":"∞","nan":"NaN","timeSeparator":":"}},"percent":{"latn":"#,##0%"},"decimal":{"latn":{"standard":"#,##0.###","long":{"1000":{"other":"0 thousand"},"10000":{"other":"00 thousand"},"100000":{"other":"000 thousand"},"1000000":{"other":"0 million"},"10000000":{"other":"00 million"},"100000000":{"other":"000 million"},"1000000000":{"other":"0 billion"},"10000000000":{"other":"00 billion"},"100000000000":{"other":"000 billion"},"1000000000000":{"other":"0 trillion"},"10000000000000":{"other":"00 trillion"},"100000000000000":{"other":"000 trillion"}},"short":{"1000":{"other":"0K"},"10000":{"other":"00K"},"100000":{"other":"000K"},"1000000":{"other":"0M"},"10000000":{"other":"00M"},"100000000":{"other":"000M"},"1000000000":{"other":"0B"},"10000000000":{"other":"00B"},"100000000000":{"other":"000B"},"1000000000000":{"other":"0T"},"10000000000000":{"other":"00T"},"100000000000000":{"other":"000T"}}}},"currency":{"latn":{"currencySpacing":{"beforeInsertBetween":" ","afterInsertBetween":" "},"standard":"¤#,##0.00","accounting":"¤#,##0.00;(¤#,##0.00)","unitPattern":"{0} {1}","short":{"1000":{"other":"¤0K"},"10000":{"other":"¤00K"},"100000":{"other":"¤000K"},"1000000":{"other":"¤0M"},"10000000":{"other":"¤00M"},"100000000":{"other":"¤000M"},"1000000000":{"other":"¤0B"},"10000000000":{"other":"¤00B"},"100000000000":{"other":"¤000B"},"1000000000000":{"other":"¤0T"},"10000000000000":{"other":"¤00T"},"100000000000000":{"other":"¤000T"}}}}},"nu":["latn"]},"locale":"en"}
)
}
