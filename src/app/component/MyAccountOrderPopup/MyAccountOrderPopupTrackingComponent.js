import Loader from "Component/Loader";

const MyAccountOrderPopupTrackingComponent = ({isLoading, order: {shipping_info, base_order_info: {increment_id}}}) => {
    const {
        tracking_history,
        delivery_date,
        shipping_status,
        shipping_address,
        tracking_numbers
    } = shipping_info;

    const renderTable = () => {
        if (!tracking_history || tracking_history.length === 0) return <span>{__('No tracking info')}</span>;
        return (
            <div block="MyAccountOrderPopupTracking" elem="Table">
                <div block="MyAccountOrderPopupTracking" elem="OrderNumber">{__('Order number')} #{increment_id}</div>
                <table>
                    <thead>
                    <tr>
                        <td>{__('Date')}</td>
                        <td>{__('Order status')}</td>
                        <td>{__('Activity')}</td>
                    </tr>
                    </thead>
                    <tbody>
                    {tracking_history.map((item, index) => (
                        <tr key={index} className={item.status}>
                            <td>
                                {new Date(item.date).toLocaleDateString()}
                            </td>
                            <td>
                                {item.status}
                            </td>
                            <td>
                                {item.location}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        )
    };

    const renderTrackingInfo = () => {
        return (

            <div block="MyAccountOrderPopupTracking" elem="Info">
                <div className="row-table">
                    <h5 className="subtitle-light">{__('Order number')}:</h5>
                    <span>{increment_id}</span>
                </div>
                {delivery_date &&
                <div className="row-table">
                    <h5 className="subtitle-light">{__('Will be delivered')}:</h5>
                    <span>{delivery_date}</span>
                </div>
                }
                {shipping_address &&
                <div className="row-table">
                    <h5 className="subtitle-light">{__('Delivery address:')}</h5>
                    <span>{`${shipping_address.city}, ${shipping_address.street}`}</span>
                </div>
                }
                {shipping_status &&
                <div className="row-table">
                    <h5 className="subtitle-light">{__('Status')}:</h5>
                    <span>{shipping_status}</span>
                </div>
                }
            </div>
        )
    };

    const renderContent = () => {
        return (<>
                {renderTrackingInfo()}
                {renderTable()}
            </>
        )
    };

    return (
        <div block="MyAccountOrderPopupTracking">
            <Loader isLoading={isLoading}/>
            {renderContent()}
        </div>
    );
};
export {MyAccountOrderPopupTrackingComponent}