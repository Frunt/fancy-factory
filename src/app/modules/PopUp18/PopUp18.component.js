import './PopUp18.style';
import BrowserDatabase from "Util/BrowserDatabase";
import {useState} from "react";

const HAS_18 = 'HAS_18';

const rejectContent = () => {
    return (
        <>
            <h2 block="PopUp18" elem="TitleReject">{__('Oops')}</h2>
            <div block="PopUp18" elem="TextReject">
                {__('Sorry, the site contains content')}, <strong>{__('that is prohibited')}</strong> {__('for viewing by persons')} <strong>{__('under 18 years of age')}</strong>
            </div>
        </>
    )
}


export const PopUp18Component = () => {

    const [reject,showReject] = useState(BrowserDatabase.getItem(HAS_18) === 'no');

    const [hided,hide] = useState(BrowserDatabase.getItem(HAS_18) === 'yes');
    if(hided) return null;

    const success = () => {
        BrowserDatabase.setItem('yes', HAS_18);
        hide(true)
    };

    const error = () => {
        BrowserDatabase.setItem('no', HAS_18);
        showReject(true)
    };

    return (
        <div block="PopUp18">
            <div block="PopUp18" elem="Window">
                <div block="PopUp18" elem="Content">
                    {reject ? rejectContent() : (<>
                        <h2 block="PopUp18" elem="Title">18+</h2>
                        <p block="PopUp18" elem="Text">{__('Are you 18 years old?')}</p>
                        <div block="PopUp18" elem="Buttons">
                            <button
                                block="Button"
                                onClick={success}
                            >
                                {__('Yes')}
                            </button>
                            <button
                                block="Button"
                                onClick={() => error()}
                            >
                                {__('No')}
                            </button>
                        </div></>)}
                </div>
            </div>
        </div>
    )
}