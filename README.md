# About endpoints

## Cafe List [page]
```
GET all cafe
example
baseurl/api/bus/shops?skip=0&limit=2
```

```
response = [
    {
        "_id": "621b2ed45671001ac1bc9c82",
        "login": "zaryad_coffee",
        "password": "$2b$05$k9hG9etAkodP1u7pYSAiKeyM5HTPvcTQemvdmDj8XprjbDBr1AZZe",
        "rate": 4,
        "menu": [
            {
                "id": "qRVU",
                "title": "Американо",
                "option": "250ml",
                "price": "130rub"
            },
            {
                "id": "VmVC",
                "title": "Капучино",
                "option": "250ml",
                "price": "130rub"
            },
            {
                "id": "zSnQ",
                "title": "Капучино",
                "option": "350ml",
                "price": "180rub"
            },
            {
                "id": "s14Y",
                "title": "Капучино",
                "option": "450ml",
                "price": "200rub"
            },
            {
                "id": "ufIG",
                "title": "Латте",
                "option": "350ml",
                "price": "150rub"
            }
        ],
        "__v": 9,
        "info": {
            "title": "Заряд",
            "currency": "rub",
            "addr": {
                "country": "Россия",
                "city": "Воронеж",
                "street": "Космонавтов",
                "build": "17б"
            },
            "secretWord": "космос"
        },
        "connectId": "b34640402-4dad-4570-a344-b0c97c8f6da0",
        "tgChatId": 332768026
    },
    {
        "_id": "621e6fbb17678b190f3ca2d8",
        "login": "super_bean",
        "password": "$2b$05$M2slf5h4l4FijqPjjnAYmO9m/6MTKmZxkRzqx5lvxEZ1dGN2E1g36",
        "rate": 0,
        "menu": [],
        "__v": 0,
        "info": {
            "title": "Super Bean",
            "currency": "eur",
            "addr": {
                "country": "Russia",
                "city": "Voronezh",
                "street": "Komissarzhevskoi",
                "build": "8"
            },
            "secretWord": "patrick"
        },
        "connectId": "bc06f7b63-5195-440e-b77f-49c399dd01c5",
        "tgChatId": 332768026
    }
]
```