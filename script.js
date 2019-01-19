// Добавяне на клиенти
EventOrganizer.createClient("Калоян Величков", "m", 21);
EventOrganizer.createClient("Иван Иванов", "m", 18);
EventOrganizer.createClient("Ивана Иванова", "f", 14);
EventOrganizer.createClient("Стояна Стоянова", "f", 50);

// Добавяне на събития
EventOrganizer.createEvent("Just Party", "2019-01-26"); // формат на датата: yyyy-mm-dd
EventOrganizer.createEvent("Някакво скучно парти"); // за непълнолетни по default
EventOrganizer.createEvent("Crazy party", true); // true - за пълнолетни

// Изтриване на събитие
EventOrganizer.deleteEvent(3);

// Добавяне на събитие
EventOrganizer.createEvent("Grand opening of new Club", true);

// Добавяне на клиенти към събитие
EventOrganizer.addClientToEvent(1, 2);
EventOrganizer.addClientToEvent(1, 3);
EventOrganizer.addClientToEvent(1, 4);

// Премахване на клиенти от събитие
//EventOrganizer.removeClientFromEvent(1, 2);

// Промяна на име на събитие
EventOrganizer.changeEventName(1, "Just Party For Adults");

// Промяна на възрастова група на събитие (true - за възрастни)
EventOrganizer.changeEventAgeGroup(1, true);

// Промяна на дата на събитие
EventOrganizer.changeEventDate(4, "2019-02-18");
EventOrganizer.changeEventDate(1, ""); // премахване на дата на събитие (задаване на дата в невалиден формат също премахва датата)

// Показване на всички събития
EventOrganizer.showAllEvents();
EventOrganizer.showAllEvents(true); // групирани - за пълнолетни(*) и за непълнолетни(#)
//EventOrganizer.showFilteredEvents("Just Party For Adults"); // събитие със зададено име
//EventOrganizer.showFilteredEvents(true); // всички събития за пълнолетни
//EventOrganizer.showFilteredEvents(false); // всички събития за не пълнолетни

// Показване на всички клиенти за дадено събитие
EventOrganizer.showClientListForEvent(1);
//EventOrganizer.showClientListForEvent(1, "f"); // само жените

// Показване на всички клиенти в системата
// EventOrganizer.showAllClients();

// Показване на събитието с най-много клиенти
EventOrganizer.showEventWithTheMostClients();