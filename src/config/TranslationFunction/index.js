const ru_Ru = require("../translate/ru_RU");
const ua_Ua = require("../translate/ua_UA");
const mockTranslations = (format, ...args) => {
    let i = 0;
    const current_store = localStorage.getItem('current_store');
    let lang = false;
    if (current_store && JSON.parse(current_store).data) {
        lang = JSON.parse(current_store).data.name;
    }
    if (lang) {
        if (lang === "RU" && ru_Ru.dictionary[format]) {
            return ru_Ru.dictionary[format].replace(/%s/g, () => args[i++]);
        } else if (lang === "UA" && ua_Ua.dictionary[format]) {
            return ua_Ua.dictionary[format].replace(/%s/g, () => args[i++]);
        }
        // console.log(format);
    }
    return format.replace(/%s/g, () => args[i++]);
};

module.exports = mockTranslations;
