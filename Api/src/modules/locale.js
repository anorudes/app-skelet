import { getProjectConfig } from '../../config';

const Locale = {
  get: (req, lang) => {
    if (!lang) lang = 'ru';

    const locale = getProjectConfig(req).locale[lang];
    return locale;
  },
  getFull: (req) => {
    return getProjectConfig(req).locale;
  },
};

export default Locale;
