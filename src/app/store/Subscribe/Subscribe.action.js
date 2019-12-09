export const SUBSCRIBE_CUSTOMER = 'SUBSCRIBE_CUSTOMER';

const subscribeCustomer = (subscribe) => ({
    type: SUBSCRIBE_CUSTOMER,
    subscribe
});

export {
    subscribeCustomer
}