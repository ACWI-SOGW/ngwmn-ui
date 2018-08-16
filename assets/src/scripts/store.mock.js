import configureStore from 'ngwmn/store';
import MOCK_APP_STATE from 'ngwmn/store.mock.json';


export default function () {
    return configureStore(MOCK_APP_STATE);
}
