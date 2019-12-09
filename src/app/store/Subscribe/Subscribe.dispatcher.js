import {showNotification} from "Store/Notification";
import {subscribeCustomer} from "./Subscribe.action";
import {fetchMutation} from "Util/Request";
import {MyAccountQuery} from "Query";

class SubscribeDispatcher {
    subscribeToNewsLater(dispatch, email) {
        const onSuccess = (subscribe, dispatch) => {
            return dispatch(subscribeCustomer(subscribe));
        };

        const onError = (error, dispatch) => {
            return dispatch(showNotification('error', error[0].message))
        };

        fetchMutation(MyAccountQuery.subscribeCustomerMutation(email)).then(
            data => onSuccess(data, dispatch),
            error => onError(error, dispatch)
        )

    }
}

export default new SubscribeDispatcher();