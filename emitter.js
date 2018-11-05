'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = true;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    const eventListener = new Map();

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object} this
         */
        on: function (event, context, handler) {
            if (!eventListener.has(event)) {
                eventListener.set(event, []);
            }
            eventListener.get(event).push({
                context,
                handler,
                frequency: 1,
                times: Infinity,
                count: 0
            });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object} this
         */
        off: function (event, context) {
            for (let [key, value] of eventListener) {
                if (getEventNamespaces(key).includes(event)) {
                    eventListener.set(
                        key,
                        value.filter(e => e.context !== context)
                    );
                }
            }

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object} this
         */
        emit: function (event) {
            getEventNamespaces(event)
                .forEach(eventNamespace => (eventListener.get(eventNamespace) || [])
                    .forEach(e => {
                        if (e.count < e.times && e.count % e.frequency === 0) {
                            e.handler.call(e.context);
                        }
                        e.count++;
                    }));

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {Object} this
         */
        several: function (event, context, handler, times) {
            if (!eventListener.has(event)) {
                eventListener.set(event, []);
            }
            eventListener.get(event).push({
                context,
                handler,
                frequency: 1,
                times: times > 0 ? times : 1,
                count: 0
            });

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object} this
         */
        through: function (event, context, handler, frequency) {
            if (!eventListener.has(event)) {
                eventListener.set(event, []);
            }
            eventListener.get(event).push({
                context,
                handler,
                frequency: frequency > 0 ? frequency : 1,
                times: Infinity,
                count: 0
            });

            return this;
        }
    };
}

function getEventNamespaces(event) {
    const eventNamespaces = [];
    const count = (event.match(/\./g) || []).length + 1;
    for (let i = count; i > 0; i--) {
        eventNamespaces.push(event.split('.', i).join('.'));
    }

    return eventNamespaces;
}

module.exports = {
    getEmitter,

    isStar
};
