/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import './Footer.style';
import visa from '../../../public/assets/images/icons/visa.svg'
import ipay from '../../../public/assets/images/icons/ipay.svg'
import novaPochta from '../../../public/assets/images/icons/nova_pochta.svg'
import masterCard from '../../../public/assets/images/icons/master_card.svg'
import logoWhite from '../../../public/assets/images/global/logo-white.svg'
import CmsBlock from "Component/CmsBlock/CmsBlock.container";
import StoreSwitcher from "Component/StoreSwitcher";
import Mageplaza_BetterPopup from 'Modules/Mageplaza_BetterPopup';
import PopUp18 from "Modules/PopUp18";

/**
 * Page footer
 * @class Footer
 */
export default class Footer extends PureComponent {
    static propTypes = {
        copyright: PropTypes.string
    };

    static defaultProps = {
        copyright: ''
    };

    renderPaylist() {
        return <div block={"Footer"} elem={"Paylist"}>
            <img src={visa} alt=""/>
            <img src={ipay} alt=""/>
            <img src={novaPochta} alt=""/>
            <img src={masterCard} alt=""/>
        </div>
    }

    render() {
        const {copyright, windowSize} = this.props;

        return (
            <>
                <footer block="Footer" aria-label="Footer">
                    <div block={"Footer"} elem={"Main"}>
                        <div block={'Footer'} elem={"Wrapper"}>
                            <img block={"Footer"}
                                 elem={"Logo"}
                                 src={logoWhite} alt=""/>
                            {(windowSize === 'desktop')
                                ? <CmsBlock identifiers={['footer-bottom']} blocks={['footer-bottom']}/>
                                : this.renderPaylist()
                            }
                        </div>
                    </div>
                    <div block={"Footer"} elem={"Bottom"}>
                        <div block={'Footer'} elem={"Wrapper"}>
                            <span block="Footer" elem="Copyright">{copyright}</span>
                            {(windowSize === 'desktop') && this.renderPaylist()}
                            {(windowSize === 'desktop') && <StoreSwitcher/>}
                        </div>
                    </div>
                </footer>
                <PopUp18/>
                <Mageplaza_BetterPopup/>
            </>
        );
    }
}
