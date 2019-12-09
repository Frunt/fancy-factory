import React from 'react';
import {connect} from 'react-redux';
import {StoreDataDispatcher} from 'Store/StoreData';
import TextPlaceholder from 'Component/TextPlaceholder';
import './StoreSwitcher.style.scss';
import BrowserDatabase from "Util/BrowserDatabase";

const StoreSwitcherClass = ({storesData: {items}}) => {
    const StoreDefault = BrowserDatabase.getItem('current_store');
    const applyStore = (value) => {
        if (value) {
            BrowserDatabase.setItem(value, 'current_store');
            window.location.reload()
        }
    };
    if (!StoreDefault && items.length > 0) applyStore(items[0]);
    const currentClass = (name) => (StoreDefault && StoreDefault.name === name) ? 'active' : '';

    return (
        items.length ?
            <div className="LanguageChanger">
                {items.map(item =>
                    <span key={item.name} onClick={() => applyStore(item)}
                          className={currentClass(item.name)}>{item.name}</span>)}
            </div>
            : <TextPlaceholder length="medium"/>
    );
};

const mapStateToProps = state => ({
    storesData: state.StoreDataReducer.storesData
});

const mapDispatchToProps = dispatch => {
    (StoreDataDispatcher.getStoreData(dispatch));
    return {dispatch};
};

const StoreSwitcher = connect(mapStateToProps, mapDispatchToProps)(StoreSwitcherClass);
export {StoreSwitcherClass, StoreSwitcher};
