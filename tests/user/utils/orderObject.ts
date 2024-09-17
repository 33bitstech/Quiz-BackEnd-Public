import { createUUID } from "../../../src/utils/ids"
export let orderCreditCard = {
    reference_id: createUUID(),
    customer: {
        name: 'Paulo Ribas',
        email:'ovatsugavlis15@gmail.com',
        tax_id: '13535377498', // minimo 11 e max 14
        phone: {
            coutry: 55,
            area: 11,
            number: 9999999,
        },
    },
    items: [
        {
            name: 'quiz com fotos nas questões',
            quantity: 1,
            unit_amount: 250,
        }
    ],
    notification_urls: [
         "https://meusite.com/notificacoes"
    ]
}

export let orderPix = {
    reference_id: createUUID(),
    customer: {
        name: 'Paulo Ribas',
        email:'ovatsugavlis15@gmail.com',
        tax_id: '13535377498', // minimo 11 e max 14
        phone: {
            coutry: 55,
            area: 11,
            number: 9999999,
        },
    },
    items: [
        {
            name: 'quiz com fotos nas questões',
            quantity: 1,
            unit_amount: 250,
        }
    ],
    qr_codes: [
        { 
            amount: {
                value:250
            },
            expiration: ''
    }, 
    ]
}