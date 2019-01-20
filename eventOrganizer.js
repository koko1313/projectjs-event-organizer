var EventOrganizer = {

    // Събития ###############################################

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
        console.log("Събитието '" + event.name + "' беше добавено.");
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

        console.log("Събитието не беше намерено.");
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
                default :
                    if(filter != undefined && currentEvent.name != filter) {
                        continue;
                    }
            }
                
            eventInfoString += this.printEventInfo(currentEvent.id);
            console.log(eventInfoString);
        }
    },

    archiveEvent: function(eventId) {
        var event = EventOrganizerDB.getEventById(eventId);

        if(event == undefined) {
            console.log("Събитието не беше намерено.");
            return;
        }

        event.isArchived = true;
        console.log("Събитието '" + event.name + "' беше архивирано.");
    },

    changeEventName: function(eventId, eventName) {
        var event = EventOrganizerDB.getEventById(eventId);

        if(event == undefined) {
            console.log("Събитието не беше намерено.");
            return;
        }

        if(event.isArchived) {
            console.log("Не може да сменяте името на събитието '" + event.name + "', защото е архивирано.");
            return;
        }

        if(event == undefined || eventName == undefined) return;

        event.name = eventName;
        console.log("Името на събитието '" + event.name + "' беше сменено на '" + eventName + "'.");
    },

    changeEventAgeGroup: function(eventId, isForAdults) {
        var event = EventOrganizerDB.getEventById(eventId);

        if(event == undefined) {
            console.log("Събитието не беше намерено.");
            return;
        }

        if(event.isArchived) {
            console.log("Не може да променяте възрастовата група на събитието '" + event.name + "', защото е архивирано.");
            return;
        }

        if(event == undefined || isForAdults == undefined) return;

        event.isForAdults = isForAdults;
        if(isForAdults) {
            this.removeAllChildsFromEvent(event);
        }
        console.log("Възрастовата група на събитието '" + event.name + "' беше сменена. Възрастовата група на клиентите беше променена и всички неподходящи клиенти бяха премахнати.");
    },

    changeEventDate: function(eventId, eventDate) {
        var event = EventOrganizerDB.getEventById(eventId);

        if(event == undefined) {
            console.log("Събитието не беше намерено.");
            return;
        }

        if(event.isArchived) {
            console.log("Не може да променяте датата на събитието '" + event.name + "', защото е архивирано.");
            return;
        }

        if(event == undefined || eventDate == undefined) return;
        
        event.date = new Date(eventDate);
        console.log("Датата на събитието '" + event.name + "' беше променена.");
    },

    changeEventPrice: function(eventId, eventPrice) {
        var event = EventOrganizerDB.getEventById(eventId);

        if(event == undefined) {
            console.log("Събитието не беше намерено.");
            return;
        }

        if(event.isArchived) {
            console.log("Не може да променяте цената на събитието '" + event.name + "', защото е архивирано.");
            return;
        }

        event.price = eventPrice;
        console.log("Цената на събитието '" + event.name + "' беше променена.");
    },

    rateEvent: function(eventId, clientId, rating) {
        var event = EventOrganizerDB.getEventById(eventId);
        var client = EventOrganizerDB.getClientById(clientId);

        if(event == undefined) {
            console.log("Събитието не беше намерено.");
            return;
        }

        if(client == undefined) {
            console.log("Клиента не беше намерен.");
            return;
        }

        if(!event.isArchived) {
            console.log("Събитието '" + event.name + "' не може да бъде оценено, защото не е архивирано.");
            return;
        }

        if(rating<0 || rating >10) {
            console.log("Неуспешно. Рейтинга трябва да бъде между 0 и 10");
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
            console.log("Клиента '" + client.name + "' оцени събитието '" + event.name + "' с рейтинг " + rating);
            return;
        }

        console.log("Клиента не може да оцени събитието, защото не го е посетил.")
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

    printEventInfo: function(eventId) {
        event = EventOrganizerDB.getEventById(eventId);

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

    // #######################################################




    // Клиенти ###############################################

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
        console.log("Клиента '" + client.name + "' беше добавен успешно.");
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

    printClientInfo: function(clientId) {
        var client = EventOrganizerDB.getClientById(clientId);

        var isVip = "";
        if(client.isVip) {
            isVip = "VIP";
        }

        var clientInfo = client.id + ". " + client.name + ", " + client.gender + ", " + client.age + ", " + client.money + "лв. " + client.visitedEvents + "/5 посетени събития. " + isVip;
        console.log(clientInfo);
    },

    // #######################################################

    


    // Общи ##################################################

    addClientToEvent: function(eventId, clientId) {
        event = EventOrganizerDB.getEventById(eventId);
        client = EventOrganizerDB.getClientById(clientId);

        if(event == undefined) {
            console.log("Събитието не беше намерено.");
            return;
        }

        if(client == undefined) {
            console.log("Клиента не беше намерен.");
            return;
        }

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
            if(client.visitedEvents == 5) {
                client.isVip = true;
            }
            

            // ако събитието е платено
            if(event.price > 0) {
                if(client.money > event.price) {
                    if(!client.isVip) {
                        client.money -= event.price;
                        event.totalIncome += event.price;
                    }
                } else {
                    console.log("Клиента " + client.name + " няма достатъчно пари за да посети събитието '" + event.name + "'. Не му достигат " + (event.price-client.money) + "лв.");
                    return;
                }
            }

            client.visitedEvents++;

            // нулираме посещенията ако са повече от 5
            if(client.visitedEvents > 5) {
                client.visitedEvents = 0;
                client.isVip = false;
            }

            event.clientsCollection.push(client);
            console.log("Клиента '" + client.name + "' ще посети събитието '" + event.name + "'");
        }
    },

    removeClientFromEvent: function(eventId, clientId) {
        event = EventOrganizerDB.getEventById(eventId);

        if(event == undefined) {
            console.log("Събитието не беше намерено.");
            return;
        }

        if(event.isArchived) {
            console.log("Не може да премахвате клиенти от събитието '" + event.name + "', защото е архивирано.");
            return;
        }

        for(var i=0; i<event.clientsCollection.length; i++) {
            if(event.clientsCollection[i].id == clientId) {
                event.clientsCollection.splice(i, 1);

                // връщаме парите на клиента
                var client = EventOrganizerDB.getClientById(clientId);
                client.money += event.price;
                client.visitedEvents--;

                // махаме сумата на клиента от общия приход на събитието
                event.totalIncome -= event.price;

                console.log("Клиента '" + client.name + "' беше премахнат от събитието '" + event.name + "'. Беше му върната сумата от " + event.price + " лв")
                return;
            }

            console.log("Клиента не беше намерен в списъка на посетителите на събитието.");
        }
    },

    showClientListForEvent: function(eventId, gender) {
        var event = EventOrganizerDB.getEventById(eventId);

        if(event == undefined) {
            console.log("Събитието не беше намерено.");
            return;
        }

        for(var i = 0; i<event.clientsCollection.length; i++) {
            var client = event.clientsCollection[i];
            if(gender == undefined || client.gender == gender) {
                this.printClientInfo(client.id);
            }
        }
    },

    removeAllChildsFromEvent: function(event) {
        for(var i = 0; i<event.clientsCollection.length; i++) {
            var currentClient = event.clientsCollection[i];
            if(currentClient.age < 18) {
                this.removeClientFromEvent(event.id, currentClient.id);
            }
        }
    },

    // #######################################################

};