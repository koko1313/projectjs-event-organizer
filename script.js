var EventOrganizerDB = {
    eventsCollection: [],
    clientsCollection: [],

    // Id-тата на следващото събитие/клиент, което ще добавяме
    nextEventId: 1,
    nextClientId: 1,
    
    insertEvent: function(event) {
        event.id = this.nextEventId;
        this.eventsCollection.push(event);
        this.nextEventId++;
    },

    insertClient: function(client) {
        client.id = this.nextClientId;
        this.clientsCollection.push(client);
        this.nextClientId++;
    },

    selectEventById: function(id) {
        for(var i=0; i<this.eventsCollection.length; i++) {
            var currentEvent = this.eventsCollection[i];
            if(currentEvent.id == id) {
                return currentEvent;
            }
        }
    },

    selectClientById: function(id) {
        for(var i=0; i<this.clientsCollection.length; i++) {
            var currentClient = this.clientsCollection[i];
            if(currentClient.id == id) {
                return currentClient;
            }
        }
    }
}

var EventOrganizer = {

    createEvent: function(eventNameParam, isForAdultsParam) {
        if(isForAdultsParam == undefined) {
            isForAdultsParam = false;
        }

        var event = {
            name: eventNameParam,
            isForAdults: isForAdultsParam,
            clientsCollection: []
        }
        EventOrganizerDB.insertEvent(event);
    },

    showAllEvents: function() {
        if(EventOrganizerDB.eventsCollection.length == 0) {
            console.log("Няма събития.");
            return;
        }

        for(var i=0; i<EventOrganizerDB.eventsCollection.length; i++) {
            var currentEventId = EventOrganizerDB.eventsCollection[i].id;
            this.printEventInfo(currentEventId);
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

        var eventInfo = event.id + ". " + event.name + ": " + isForAdultsString;
        console.log(eventInfo);

        /*
        // Печата списък с клиентите за даденото събитие
        console.log("Клиенти:");
        for(var j=0; j<event.clientsCollection.length; j++) {
            var currentClientId = event.clientsCollection[j].id;
            this.printClientInfo(currentClientId);
        }
        */
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

    removeAllChildsFromEvent: function(event) {
        for(var i = 0; i<event.clientsCollection.length; i++) {
            var currentClient = event.clientsCollection[i];
            if(currentClient.age < 18) {
                event.clientsCollection.splice(i, 1);
            }
        }
    }

};

EventOrganizer.createClient("Калоян Величков", "m", 21);
EventOrganizer.createClient("Иван Иванов", "m", 18);
EventOrganizer.createClient("Ивана Иванова", "f", 14);
EventOrganizer.createClient("Стояна Стоянова", "f", 50);

EventOrganizer.createEvent("Just Party", false);
EventOrganizer.createEvent("Някакво скучно парти");
EventOrganizer.createEvent("Crazy party", true);
EventOrganizer.deleteEvent(3);
EventOrganizer.createEvent("Grand opening of new Club", true);

EventOrganizer.addClientToEvent(1, 2);
EventOrganizer.addClientToEvent(1, 3);
EventOrganizer.addClientToEvent(1, 4);
//EventOrganizer.removeClientFromEvent(1, 2);

EventOrganizer.changeEventName(1, "Just Party For Adults");
EventOrganizer.changeEventAgeGroup(1, true);

EventOrganizer.showAllEvents();

EventOrganizer.showClientListForEvent(1, "f");

// EventOrganizer.showAllClients();
