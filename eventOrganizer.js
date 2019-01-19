var EventOrganizer = {

    /**
     * 
     * Получава колекция от вида
     * 
     * var collection = {
     *   name: "Парти",
     *   isForAdults: true,
     *   price: 24.44,
     *   date: "2019-01-26", 
     * }
     * 
     * само name е задължително
     */
    createEvent: function(eventInfo) {
        if(EventOrganizerConfig.SYSTEM_CLOSED) {
            console.log("Не може да добавите събитие. Системата е затворена.");
            return;
        }
        
        if(eventInfo.isForAdults == undefined) {
            eventInfo.isForAdults = false;
        }

        if(eventInfo.price == undefined) {
            eventInfo.price = 0;
        }

        var event = {
            name: eventInfo.name,
            isForAdults: eventInfo.isForAdults,
            price: eventInfo.price,
            date: new Date(eventInfo.date),
            isArchived: false,
            totalIncome: 0,
            totalRating: 0,
            clientsCollection: [],
        }

        EventOrganizerDB.insertEvent(event);
    },

    showAllEvents: function(filter) {
        if(EventOrganizerDB.eventsCollection.length == 0) {
            console.log("Няма събития.");
            return;
        }

        for(var i=0; i<EventOrganizerDB.eventsCollection.length; i++) {
            var currentEvent = EventOrganizerDB.eventsCollection[i];

            var eventInfoString = "";

            switch(filter) {
                case "upcoming" :
                    if(currentEvent.isArchived) {
                        continue;
                    }
                    break;
                case "archived" : 
                    if(!currentEvent.isArchived) {
                        continue;
                    }
                    break;
                case "grouped" :
                    if(currentEvent.isForAdults) {
                        eventInfoString += "*";
                    } else {
                        eventInfoString += "#";
                    }
                    break;
                case "forAdults" :
                    if(!currentEvent.isForAdults) {
                        continue;
                    }
                    break;
                case "forAll" :
                    if(currentEvent.isForAdults) {
                        continue;
                    }
                    break;

            }
                
            eventInfoString += this.printEventInfo(currentEvent.id);
            console.log(eventInfoString);
        }
    },

    deleteEvent: function(eventId) {
        for(var i=0; i<EventOrganizerDB.eventsCollection.length; i++) {
            var event = EventOrganizerDB.eventsCollection[i];

            if(event.id == eventId) {
                if(event.isArchived) {
                    console.log("Събитието '" + event.name + "' не може да бъде изтрито, защото е архивирано.");
                    return;
                }

                console.log("Събитието '" + event.name + "' беше изтрито.");
                EventOrganizerDB.eventsCollection.splice(i, 1);
                return;
            }
        }
    },

    /**
     * 
     * Получава колекция от вида
     * 
     * var collection = {
     *   name: "Име Фамилия",
     *   gender: m/f,
     *   age: 12,
     *   moeny: 100.30, 
     * }
     */
    createClient: function(clientInfo) {
        if(EventOrganizerConfig.SYSTEM_CLOSED) {
            console.log("Не може да добавите клиент. Системата е затворена.");
            return;
        }

        var client = {
            name: clientInfo.name,
            gender: clientInfo.gender,
            age: clientInfo.age,
            money: clientInfo.money,
            visitedEvents: 0,
            vip: false,
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

        if(event.isArchived) {
            console.log("Не може да добавяте клиенти към събитието '" + event.name + "', защото е архивирано.");
            return;
        }

        if(event != undefined && client != undefined) {
            if(event.isForAdults) {
                if(client.age < 18) {
                    console.log("Събитието " + event.name + " е само за пълнолетни." + client.name + " е на " + client.age + " години.");
                    return;
                }
            }

            // проверяваме колко събития е посетил клиента (за да го направим VIP)
            client.visitedEvents++;
            if(client.visitedEvents > 5) {
                client.isVip = true;
            }
            

            // ако събитието е платено
            if(event.price > 0) {
                if(client.money > event.price) {
                    if(client.isVip) {
                        client.money -= event.price;
                    }
                    event.totalIncome += event.price;
                } else {
                    console.log("Клиента " + client.name + " няма достатъчно пари за да посети събитието '" + event.name + "'. Не и достигат " + (event.price-client.money) + "лв.");
                    return;
                }
            }

            // нулираме посещенията ако са повече от 5
            if(client.visitedEvents > 5) {
                client.visitedEvents = 0;
                client.isVip = false;
            }

            event.clientsCollection.push(client);
        }
    },

    removeClientFromEvent: function(eventId, clientId) {
        event = EventOrganizerDB.selectEventById(eventId);

        if(event.isArchived) {
            console.log("Не може да премахвате клиенти от събитието '" + event.name + "', защото е архивирано.");
            return;
        }

        for(var i=0; i<event.clientsCollection.length; i++) {
            if(event.clientsCollection[i].id == clientId) {
                event.clientsCollection.splice(i, 1);

                // връщаме парите на клиента
                var client = EventOrganizerDB.selectClientById(clientId);
                client.money += event.price;
                client.visitedEvents--;

                // махаме сумата на клиента от общия приход на събитието
                event.totalIncome -= event.price;
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

        var identifier;

        if(event.isArchived) {
            identifier = "~";
        } else
        if(event.price > 0) {
            identifier = "$";
        } else 
        if(event.price == 0) {
            identifier = "!";
        }

        var rating;

        if(event.isArchived) {
            // смятаме рейтинга и го преобразуваме от min(0)-max(10) към min(0)-max(6)
            var rating = (event.totalRating/event.clientsCollection.length) * 6/10;
        } else {
            rating = "Предстои актуализация за рейтинга";
        }

        var eventInfo = event.id + ". " + identifier +  event.name + ": " + isForAdultsString + ". " + event.price + "лв. " + "Общ приход: " + event.totalIncome + "лв. Рейтинг: " + rating + ". " + date;
        return eventInfo;
    },

    printClientInfo: function(clientId) {
        var client = EventOrganizerDB.selectClientById(clientId);

        var isVip = "";
        if(client.isVip) {
            isVip = "VIP";
        }

        var clientInfo = client.id + ". " + client.name + ", " + client.gender + ", " + client.age + ", " + client.money + "лв. " + client.visitedEvents + "/5 посетени събития. " + isVip;
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

        if(event.isArchived) {
            console.log("Не може да сменяте името на събитието '" + event.name + "', защото е архивирано.");
            return;
        }

        if(event == undefined || nameParam == undefined) return;

        console.log("Името на събитието '" + event.name + "' беше сменено на '" + nameParam + "'.");
        event.name = nameParam;
    },

    changeEventAgeGroup: function(eventId, isForAdultsParam) {
        var event = EventOrganizerDB.selectEventById(eventId);

        if(event.isArchived) {
            console.log("Не може да променяте възрастовата група на събитието '" + event.name + "', защото е архивирано.");
            return;
        }

        if(event == undefined || isForAdultsParam == undefined) return;

        console.log("Възрастовата група на събитието '" + event.name + "' беше сменена. Възрастовата група на клиентите беше променена и всички неподходящи клиенти бяха премахнати.");
        event.isForAdults = isForAdultsParam;
        if(isForAdultsParam) {
            this.removeAllChildsFromEvent(event);
        }
    },

    changeEventDate: function(eventId, dateParam) {
        var event = EventOrganizerDB.selectEventById(eventId);

        if(event.isArchived) {
            console.log("Не може да променяте датата на събитието '" + event.name + "', защото е архивирано.");
            return;
        }

        if(event == undefined || dateParam == undefined) return;

        console.log("Датата на събитието '" + event.name + "' беше променена.");
        event.date = new Date(dateParam);
    },

    changeEventPrice: function(eventId, priceParam) {
        var event = EventOrganizerDB.selectEventById(eventId);

        if(event.isArchived) {
            console.log("Не може да променяте цената на събитието '" + event.name + "', защото е архивирано.");
            return;
        }

        console.log("Цената на събитието '" + event.name + "' беше променена.");
        event.price = priceParam;
    },

    removeAllChildsFromEvent: function(event) {
        for(var i = 0; i<event.clientsCollection.length; i++) {
            var currentClient = event.clientsCollection[i];
            if(currentClient.age < 18) {
                this.removeClientFromEvent(event.id, currentClient.id);
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

    archiveEvent: function(eventId) {
        var event = EventOrganizerDB.selectEventById(eventId);

        if(event == undefined) {
            return;
        }

        event.isArchived = true;
    },

    rateEvent: function(eventId, clientId, rating) {
        var event = EventOrganizerDB.selectEventById(eventId);
        var client = EventOrganizerDB.selectClientById(clientId);

        if(!event.isArchived) {
            return;
        }

        if(rating<0 || rating >10) {
            return;
        }

        var wasClient = false; // дали клиента е бил посетител на събитието
        for(var i=0; i<event.clientsCollection.length; i++) {
            var currentClient = event.clientsCollection[i];
            if(currentClient == client) {
                wasClient = true;
                break;
            }
        }

        if(wasClient) {
            event.totalRating += rating;
        }
    }

};