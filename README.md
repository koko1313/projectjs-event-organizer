# projectjs-event-organizer

Университетски проект по "JavaScript в дълбочина".

## Файлове
- **index.html**
- **config.js** - *Съдържа конфигурацията на приложението*
- **database.js** - *Съдържа "базата данни" на приложението*
- **eventOrganizer.js** - *Съдържа основната логика и всички функции на приложението*
- **script.js** - *Чрез този файл се управлява приложението*

## Функционалности
- **Добавяне на събитие**
```javascript
EventOrganizer.createEvent({
    name: "Име на партито",
    isForAdults: true, // true - за пълнолетни / false - за непълнолетни, не е задължително
    date: "2019-01-26", // формат на датата: yyyy-mm-dd, не е задължително
    price: 10, // не е задължително
});
```

- **Добавяне на клиент**
    ```javascript
    EventOrganizer.createClient({
        name: "Име Фамилия",
        gender: "m", // m/f
        age: 21,
        money: 100.30,
    });
    ```