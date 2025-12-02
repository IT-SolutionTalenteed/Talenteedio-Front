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
        phoneNumber: '',
        email: 'site@mail.com',
        address: {
            id: '',
            line: '',
            postalCode: '',
            city: '',
            country: '',
            state: ''
        }
    },
    terms: '',
    confidentiality: '',
    didYouKnow: '',
    gateway: '',
    voice: '',
    initiative: '',
    homeImage1: { id: '', fileUrl: '', fileType: '', fileName: '' },
    homeImage2: { id: '', fileUrl: '', fileType: '', fileName: '' },
    homeImage3: { id: '', fileUrl: '', fileType: '', fileName: '' }
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
        phoneNumber: '',
        email: 'site@mail.com',
        address: {
            id: '',
            line: '',
            postalCode: '',
            city: '',
            country: '',
            state: ''
        }
    },
    terms: '',
    confidentiality: '',
    didYouKnow: '',
    gateway: '',
    voice: '',
    initiative: '',
    homeImage1: { id: '', fileUrl: '', fileType: '', fileName: '' },
    homeImage2: { id: '', fileUrl: '', fileType: '', fileName: '' },
    homeImage3: { id: '', fileUrl: '', fileType: '', fileName: '' }
};

export const SETTING_API_ROUTE = 'setting';

export const SETTING_FORM_ROUTE_REGEX = /\/\w+\-+\w+\/setting/;
