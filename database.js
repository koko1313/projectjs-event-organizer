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

    getEventById: function(id) {
        for(var i=0; i<this.eventsCollection.length; i++) {
            var currentEvent = this.eventsCollection[i];
            if(currentEvent.id == id) {
                return currentEvent;
            }
        }
    },

    getClientById: function(id) {
        for(var i=0; i<this.clientsCollection.length; i++) {
            var currentClient = this.clientsCollection[i];
            if(currentClient.id == id) {
                return currentClient;
            }
        }
    }
};