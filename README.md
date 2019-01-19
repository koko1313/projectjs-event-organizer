# projectjs-event-organizer

Университетски проект по "JavaScript в дълбочина".

## Файлове
- **index.html**
- **config.js** - *Съдържа конфигурацията на приложението*
- **database.js** - *Съдържа "базата данни" на приложението*
- **eventOrganizer.js** - *Съдържа основната логика и всички функции на приложението*
- **script.js** - *Чрез този файл се управлява приложението*

## Функционалности *(с примери)*
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

**Изтриване на събитие**
```javascript
EventOrganizer.deleteEvent(eventId);
```

**Показване на лист с всички събития**
```javascript
EventOrganizer.showAllEvents(); // показва всички
EventOrganizer.showAllEvents("grouped"); // групирани - за пълнолетни(*) и за непълнолетни(#)
EventOrganizer.showAllEvents("upcoming"); // предстоящи
EventOrganizer.showAllEvents("archived"); // архивирани
EventOrganizer.showAllEvents("Just Party For Adults"); // събитие със зададено име
EventOrganizer.showAllEvents("forAdults"); // всички събития за пълнолетни
EventOrganizer.showAllEvents("forAll"); // всички събития, подходящи за НЕпълнолетни
```

**Добавяне на клиент към събитие**
```javascript
EventOrganizer.addClientToEvent(eventId, clientId);
```

**Премахване на клиент от събитие**
```javascript
EventOrganizer.removeClientFromEvent(eventId, clientId);
```

**Архивиране на събитие**
```javascript
EventOrganizer.archiveEvent(eventId);
```

**Промяна на име на събитие**
```javascript
EventOrganizer.changeEventName(eventId, "Ново име");
```

**Промяна на възрастова група на събитие**
```javascript
EventOrganizer.changeEventAgeGroup(eventId, true); // true - за пълнолетни / false - за непълнолетни
```

**Промяна на възрастова група на събитие**
```javascript
EventOrganizer.changeEventDate(eventId, "2019-02-18");
EventOrganizer.changeEventDate(eventId, ""); // премахване на дата на събитие (задаване на дата в невалиден формат също премахва датата)
```

**Оценяване на събитие**
```javascript
EventOrganizer.rateEvent(eventId, clientId, rating);
```