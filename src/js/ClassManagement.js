export default class ClassManagement {
    constructor(params = {}) {
        const self = this;
        self.params = params;

        // Events
        self.eventsListeners = {};

        if (self.params && self.params.on) {
            Object.keys(self.params.on).forEach((eventName) => {
                self.on(eventName, self.params.on[eventName]);
            });
        }
    }

    on(events, handler, priority) {
        const self = this;
        if (typeof handler !== 'function') return self;
        const method = priority ? 'unshift' : 'push';
        events.split(' ').forEach((event) => {
            if (!self.eventsListeners[event]) self.eventsListeners[event] = [];
            self.eventsListeners[event][method](handler);
        });
        return self;
    }

    once(events, handler, priority) {
        const self = this;
        if (typeof handler !== 'function') return self;
        function onceHandler(...args) {
            self.off(events, onceHandler);
            if (onceHandler.f7proxy) {
                delete onceHandler.f7proxy;
            }
            handler.apply(self, args);
        }
        onceHandler.f7proxy = handler;
        return self.on(events, onceHandler, priority);
    }

    off(events, handler) {
        const self = this;
        if (!self.eventsListeners) return self;
        events.split(' ').forEach((event) => {
            if (typeof handler === 'undefined') {
                self.eventsListeners[event] = [];
            } else if (self.eventsListeners[event] && self.eventsListeners[event].length) {
                self.eventsListeners[event].forEach((eventHandler, index) => {
                    if (eventHandler === handler || (eventHandler.f7proxy && eventHandler.f7proxy === handler)) {
                        self.eventsListeners[event].splice(index, 1);
                    }
                });
            }
        });
        return self;
    }

    emit(...args) {
        const self = this;
        if (!self.eventsListeners) return self;
        let events;
        let data;
        let context;
        if (typeof args[0] === 'string' || Array.isArray(args[0])) {
            events = args[0];
            data = args.slice(1, args.length);
            context = self;
        } else {
            events = args[0].events;
            data = args[0].data;
            context = args[0].context || self;
        }

        const eventsArray = Array.isArray(events) ? events : events.split(' ');

        eventsArray.forEach((event) => {
            if (self.eventsListeners && self.eventsListeners[event]) {
                self.eventsListeners[event].forEach((eventHandler) => {
                    eventHandler.apply(context, data);
                });
            }
        });
        return self;
    }
}
