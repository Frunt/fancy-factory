import {connect} from "react-redux";
import Html from "Component/Html";
import {withRouter} from "react-router";
import './_module.css'
import './Mageplaza_BetterPopup.styles.scss';
import BrowserDatabase from "Util/BrowserDatabase";
import React, {useState, useEffect} from "react";
import {fetchMutation} from "Util/Request";
import {MyAccountQuery} from "Query";
import {showNotification} from "Store/Notification";

const popupId = 'mageplaza-betterpopup-block';
const canShowPopup = ({will_show_again}) => {
    const current = BrowserDatabase.getItem('popup');
    const time = new Date().valueOf();
    if (will_show_again === 0) {
        return true
    }
    if (current) {
        if (time <= (current.time + (will_show_again * 86400000))) {
            return false
        }
    }
    const data = {
        time
    };
    BrowserDatabase.setItem(data, 'popup');
    return true
};
let Mageplaza_BetterPopupComponent = props => {
    if(!props.PopupData) return null;
    const {PopupData: {is_enable, what_to_show, when_to_show, where_to_show}, location} = props;
    if (!is_enable) return null;
    const [{is_subscribed}, setMessage] = useState({is_subscribed: false});
    const formSubmit = () => {
        const form = document.getElementById('mp-newsletter-validate-detail');
        form.addEventListener('submit', formListener)
    };

    let formListener = (e) => {
        e.preventDefault();
        const subscribe = e.target.querySelectorAll('input');
        const data = {};
        subscribe.forEach(e2 => {
            data[e2.name] = e2.value || e2.checked
        });
        if(!Object.values(data).every(a =>a )){
            const errorInput = Object.keys(data).filter(key => !data[key])[0];
            props.dispatch(showNotification('error', `${errorInput} not valid`))
            return null
        }
        fetchMutation(MyAccountQuery.subscribeCustomerMutation(data.email)).then(
            data => {
                setMessage(data.subscribeCustomer)
            },
            error => setMessage(error[0].message)
        )
    };

    const showPopup = () => {
        const el = document.getElementById(popupId);
        if (el.className.indexOf('active') === -1) {
            el.className += ' active';
            formSubmit()
        }
    };

    const hidePopup = () => {
        const el = document.getElementById(popupId);
        if (el.className.indexOf('active') !== -1) {
            el.className = el.className.replace('active', '');
            const form = document.getElementById('mp-newsletter-validate-detail');
            form && form.removeEventListener('submit', formListener)
        }
    };

    const whatToShow = (what_to_show) => {
        const {is_responsive, background_color, popup_content, text_color} = what_to_show;
        const styles = {
            backgroundColor: background_color,
            color: text_color
        };
        if (is_responsive.is_enable) {
            styles.height = is_responsive.height;
            styles.width = is_responsive.width;
        }

        const successMessage = () => {
            return <Html content={popup_content.success_content}/>
        };
        return <div id={'bio_ep'} style={styles}>
            <div className={'mageplaza-betterpopup-content'}>
                <div id={'bio_ep_close'} onClick={() => hidePopup()}>
                </div>
                <div id={'bio_ep_content'} className={'better-popup-content'}>
                    {is_subscribed ?
                        successMessage() :
                        <Html content={popup_content.popup_content}/>}
                </div>
            </div>
        </div>

    };

    const whereToShow = (where_to_show, location) => {
        const {which_page_to_show, include_page_urls, exclude_page_urls} = where_to_show;
        const {pathname} = location;
        switch (which_page_to_show) {
            case 'All Pages':
                return !exclude_page_urls.some(s => pathname.includes(s));
            case 'Specific pages':
                return include_page_urls.some(s => pathname.includes(s)) && !exclude_page_urls.some(s => pathname.includes(s));
            case '2':
                return include_page_urls.indexOf(pathname) !== -1 && exclude_page_urls.indexOf(pathname) === -1;
            default:
                return false
        }
    };

    const whenToShow = (when_to_show) => {
        const {popup_appears, scroll_x} = when_to_show;

        switch (popup_appears) {
            case 'After scrolling down X% of page':
                const scrollListener = (e) => {
                    if (window.pageYOffset >= (window.innerHeight / (scroll_x / 100))) {
                        showPopup();
                        document.removeEventListener('scroll', scrollListener)
                    }
                };
                document.addEventListener('scroll', scrollListener);
                break;
            case 'After X seconds':
                setTimeout(() => showPopup(),
                    (when_to_show.time_x_seconds * 1000));
                break;
            case 'After page loaded':
                showPopup();
                break;
            default:
                showPopup();
                return true
        }
    };

    if (!whereToShow(where_to_show, location)) return null;
    if (!canShowPopup(when_to_show)) return null;
    whenToShow(when_to_show);
    return <>
        <div className={'mageplaza-betterpopup-block Better-Popup-Wrapper'}
             onClick={(e) => e.target.id === popupId ? hidePopup() : null}
             id={popupId}>
            {whatToShow(what_to_show)}
        </div>
        <div className="mp-better-popup-click-trigger" style={{[when_to_show.floating_button]: '10px'}}>
            <button className="click-trigger primary"
                    onClick={() => showPopup()}>{when_to_show.button_label}</button>
        </div>
    </>
};

const mapStateToProps = state => ({
    PopupData: state.ConfigReducer.PopupData
});

Mageplaza_BetterPopupComponent = withRouter(connect(mapStateToProps)(Mageplaza_BetterPopupComponent));
export default Mageplaza_BetterPopupComponent
