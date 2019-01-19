var EventOrganizer = {

    createEvent: function(nameParam, isForAdultsParam, dateParam) {
        if(EventOrganizerConfig.SYSTEM_CLOSED) {
            console.log("Не може да добавите събитие. Системата е затворена.");
            return;
        }
        
        if(isForAdultsParam == undefined) {
            isForAdultsParam = false;
        }

        var event = {
            name: nameParam,
            isForAdults: isForAdultsParam,
            date: new Date(dateParam),
            clientsCollection: []
        }
        EventOrganizerDB.insertEvent(event);
    },

    showAllEvents: function(grouped) {
        if(EventOrganizerDB.eventsCollection.length == 0) {
            console.log("Няма събития.");
            return;
        }

        for(var i=0; i<EventOrganizerDB.eventsCollection.length; i++) {
            var currentEvent = EventOrganizerDB.eventsCollection[i];

            var eventInfoString = "";

            if(grouped == true) {
                if(currentEvent.isForAdults) {
                    eventInfoString += "*";
                } else {
                    eventInfoString += "#";
                }
            }

            eventInfoString += this.printEventInfo(currentEvent.id);

            console.log(eventInfoString);
        }
    },

    deleteEvent: function(id) {
        for(var i=0; i<EventOrganizerDB.eventsCollection.length; i++) {
            if(EventOrganizerDB.eventsCollection[i].id == id) {
                console.log("Събитието '" + EventOrganizerDB.eventsCollection[i].name + "' беше изтрито.");
                EventOrganizerDB.eventsCollection.splice(i, 1);
                return;
            }
        }
    },

    createClient: function(nameParam, genderParam, ageParam) {
        if(EventOrganizerConfig.SYSTEM_CLOSED) {
            console.log("Не може да добавите клиент. Системата е затворена.");
            return;
        }

        var client = {
            name: nameParam,
            gender: genderParam,
            age: ageParam
        }
        EventOrganizerDB.insertClient(client);
    },

    showAllClients: function() {
        if(EventOrganizerDB.clientsCollection.length == 0) {
            console.log("Няма клиенти.");
            return;
        }

        for(var i=0; i<EventOrganizerDB.clientsCollection.length; i++) {
            var currentClientId = EventOrganizerDB.clientsCollection[i].id;
            this.printClientInfo(currentClientId);
        }
    },

    addClientToEvent: function(eventId, clientId) {
        event = EventOrganizerDB.selectEventById(eventId);
        client = EventOrganizerDB.selectClientById(clientId);

        if(event != undefined && client != undefined) {
            if(event.isForAdults) {
                if(client.age < 18) {
                    console.log("Събитието " + event.name + " е само за пълнолетни." + client.name + " е на " + client.age + " години.");
                    return;
                }
            }

            event.clientsCollection.push(client);
        }
    },

    removeClientFromEvent: function(eventId, clientId) {
        event = EventOrganizerDB.selectEventById(eventId);
        for(var i=0; i<event.clientsCollection.length; i++) {
            if(event.clientsCollection[i].id == clientId) {
                event.clientsCollection.splice(i, 1);
            }
        }
    },

    printEventInfo: function(eventId) {
        event = EventOrganizerDB.selectEventById(eventId);

        var isForAdultsString = "За всички";
        if(event.isForAdults) {
            isForAdultsString = "За пълнолетни";
        }

        var date = "";
        if(event.date != "Invalid Date") {
            date = event.date.toISOString().substring(0, 10);
        }

        var eventInfo = event.id + ". " + event.name + ": " + isForAdultsString + ". " + date;
        return eventInfo;
    },

    printClientInfo: function(clientId) {
        var client = EventOrganizerDB.selectClientById(clientId);
        var clientInfo = client.name + ", " + client.gender + ", " + client.age;
        console.log(clientInfo);
    },

    showClientListForEvent: function(eventId, gender) {
        var event = EventOrganizerDB.selectEventById(eventId);

        if(event == undefined) return;

        for(var i = 0; i<event.clientsCollection.length; i++) {
            var client = event.clientsCollection[i];
            if(gender == undefined || client.gender == gender) {
                this.printClientInfo(client.id);
            }
        }
    },

    changeEventName: function(eventId, nameParam) {
        var event = EventOrganizerDB.selectEventById(eventId);

        if(event == undefined || nameParam == undefined) return;

        console.log("Името на събитието '" + event.name + "' беше сменено на '" + nameParam + "'.");
        event.name = nameParam;
    },

    changeEventAgeGroup: function(eventId, isForAdultsParam) {
        var event = EventOrganizerDB.selectEventById(eventId);

        if(event == undefined || isForAdultsParam == undefined) return;

        console.log("Възрастовата група на събитието '" + event.name + "' беше сменена. Възрастовата група на клиентите беше променена и всички неподходящи клиенти бяха премахнати.");
        event.isForAdults = isForAdultsParam;
        this.removeAllChildsFromEvent(event);
    },

    changeEventDate: function(eventId, dateParam) {
        var event = EventOrganizerDB.selectEventById(eventId);

        if(event == undefined || dateParam == undefined) return;

        console.log("Датата на събитието '" + event.name + "' беше променена.");
        event.date = new Date(dateParam);
    },

    removeAllChildsFromEvent: function(event) {
        for(var i = 0; i<event.clientsCollection.length; i++) {
            var currentClient = event.clientsCollection[i];
            if(currentClient.age < 18) {
                event.clientsCollection.splice(i, 1);
            }
        }
    },

    showEventWithTheMostClients: function() {
        var theMostClients = 0;
        var eventWithTheMostClients;

        for(var i=0; i < EventOrganizerDB.eventsCollection.length; i++) {
            var currentEvent = EventOrganizerDB.eventsCollection[i];
            if(currentEvent.clientsCollection.length > theMostClients) {
                theMostClients = currentEvent.clientsCollection.length;
                eventWithTheMostClients = currentEvent;
            } else
            // ако има събития с равен брой клиенти
            if(currentEvent.clientsCollection.length == theMostClients) {
                eventWithTheMostClients = undefined;
            }
        }

        if(eventWithTheMostClients == undefined) {
            console.log("Няма събитие, което да има повече клиенти от останалите.");
            return;
        }

        console.log("Събитието '" + eventWithTheMostClients.name + "' има най-много клиенти - " + eventWithTheMostClients.clientsCollection.length)
    },

    showFilteredEvents: function(filter) {
        if(typeof filter == "boolean") {
            for(var i=0; i<EventOrganizerDB.eventsCollection.length; i++) {
                var currentEvent = EventOrganizerDB.eventsCollection[i];
                if(currentEvent.isForAdults == filter) {
                    console.log(this.printEventInfo(currentEvent.id));
                }
            }
        } else 
        if(typeof filter == "string") {
            for(var i=0; i<EventOrganizerDB.eventsCollection.length; i++) {
                var currentEvent = EventOrganizerDB.eventsCollection[i];
                if(currentEvent.name == filter) {
                    console.log(this.printEventInfo(currentEvent.id));
                }
            }
        }
    },

};