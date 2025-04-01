import { Setting } from 'src/app/shared/models/setting.interface';

export const EMPTY_SETTING: Setting = {
    siteTitle: 'Site title',
    siteDescription: 'SIte description',
    favicon: 'favicon',
    language: {
        id: 'fr'
    },
    contact : {
        id: '',
        email: 'site@mail.com',
        address: 'address'
    }
};

export const EMPTY_SETTING_2: Setting = {
    siteTitle: 'Site title 2',
    siteDescription: 'SIte description',
    favicon: 'favicon',
    language: {
        id: 'eng'
    },
    contact : {
        id: '',
        email: 'site@mail.com',
        address: 'address'
    }
};

export const SETTING_API_ROUTE = 'setting';

export const SETTING_FORM_ROUTE_REGEX = /\/\w+\-+\w+\/setting/;
