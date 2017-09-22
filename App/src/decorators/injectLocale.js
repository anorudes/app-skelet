import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
const Counterpart = require('counterpart').Instance;
import { getProjectConfig } from 'config';
const Language = new Counterpart();

const injectLocale = (module) => (DecoratedComponent) =>

  @connect(state => ({ ...state.app }))
  class Component extends React.Component {
    static propTypes = {
      locale: PropTypes.object,
    };

    render() {
      const { locale } = this.props;
      const { projectName } = getProjectConfig();
      const language = global.language || 'ru';
      Language.registerTranslations(language, require(`counterpart/locales/${language}`));
      Language.registerTranslations(language, locale);
      Language.setLocale(language);

      return (
        <DecoratedComponent
          {...this.props}
          translate={(name, ...arg) => {

            // console.log(locale.);

            if (locale && locale[module[0]] && locale[module[0]][module[1]] && locale[module[0]][module[1]][name]) {
              if (locale[module[0]][module[1]][name][projectName]) {
                return Language.translate([...module, name, projectName], ...arg);
              } else {
                if (name === 'readCount') {
                  return Language.translate('Module.PostAuthorBlock.readCount.main', ...arg);
                } else {
                return Language.translate([...module, name, 'main'], ...arg);
                }
              }
            } else return '';
          }}
        />
      );
    }
  };

export default injectLocale;
