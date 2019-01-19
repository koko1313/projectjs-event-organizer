// Добавяне на клиенти
EventOrganizer.createClient({
    name: "Калоян Величков",
    gender: "m",
    age: 21,
    money: 100.30, 
});

EventOrganizer.createClient({
    name: "Валентин Йорданов",
    gender: "m",
    age: 23,
    money: 20, 
});

EventOrganizer.createClient({
    name: "Иван Иванов",
    gender: "m",
    age: 18,
    money: 500, 
});

EventOrganizer.createClient({
    name: "Ивана Иванова",
    gender: "f",
    age: 14,
    money: 800.98, 
});

EventOrganizer.createClient({
    name: "Стояна Стоянова",
    gender: "f",
    age: 50,
    money: 2, 
});

// Добавяне на събития
EventOrganizer.createEvent({
    name: "Just Party",
    date: "2019-01-26", // формат на датата: yyyy-mm-dd
    price: 10,
});

EventOrganizer.createEvent({
    name: "Някакво скучно парти",
});

EventOrganizer.createEvent({
    name: "Парти",
    isForAdults: true,
    price: 24.44,
    date: "2019-01-26",
});

EventOrganizer.createEvent({
    name: "Crazy party",
    isForAdults: true,
});

EventOrganizer.createEvent({
    name: "Откриване на новият клуб",
    isForAdults: true,
    price: 24.44,
    date: "2019-01-26",
});

// Изтриване на събитие
EventOrganizer.deleteEvent(3);

// Добавяне на събитие
EventOrganizer.createEvent({
    name: "Grand opening of new Club",
    isForAdults: true,
});

// Добавяне на клиенти към събитие
EventOrganizer.addClientToEvent(1, 2);
EventOrganizer.addClientToEvent(1, 3);
EventOrganizer.addClientToEvent(1, 4);

// Архивиране на събитие
EventOrganizer.archiveEvent(1);

// Премахване на клиенти от събитие
//EventOrganizer.removeClientFromEvent(1, 2);

// Промяна на име на събитие
//EventOrganizer.changeEventName(1, "Just Party For Adults");

// Промяна на възрастова група на събитие (true - за възрастни)
EventOrganizer.changeEventAgeGroup(1, true);

// Промяна на дата на събитие
EventOrganizer.changeEventDate(4, "2019-02-18");
EventOrganizer.changeEventDate(1, ""); // премахване на дата на събитие (задаване на дата в невалиден формат също премахва датата)

// Оценяване на събитие
EventOrganizer.rateEvent(1, 2, 4); // id на събитие, id на клиент, рейтинг
EventOrganizer.rateEvent(1, 3, 5);
EventOrganizer.rateEvent(1, 4, 6);

// Показване на всички събития
EventOrganizer.showAllEvents();
//EventOrganizer.showAllEvents("grouped"); // групирани - за пълнолетни(*) и за непълнолетни(#)
//EventOrganizer.showAllEvents("upcoming"); // предстоящи
//EventOrganizer.showAllEvents("archived"); // архивирани
//EventOrganizer.showAllEvents("Just Party"); // събитие със зададено име
//EventOrganizer.showAllEvents("forAdults"); // всички събития за пълнолетни
//EventOrganizer.showAllEvents("forAll"); // всички събития, подходящи за НЕпълнолетни

// Показване на всички клиенти за дадено събитие
EventOrganizer.showClientListForEvent(1);
//EventOrganizer.showClientListForEvent(1, "f"); // само жените

// Показване на всички клиенти в системата
//EventOrganizer.showAllClients();

// Показване на събитието с най-много клиенти
//EventOrganizer.showEventWithTheMostClients();