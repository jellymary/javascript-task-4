'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = false;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    const listener = new Map();

    return {

        // /**
        //  * Подписаться на событие
        //  * @param {String} event
        //  * @param {Object} context
        //  * @param {Function} handler
        //  */
        on: function (event, context, handler) {
            if (listener.has(event)) {
                listener.get(event).push({ context, handler });
            } else {
                listener.set(event, [{ context, handler }]);
            }

            return this;
        },

        // /**
        //  * Отписаться от события
        //  * @param {String} event
        //  * @param {Object} context
        //  */
        off: function (event, context) {
            for (let [key, value] of listener) {
                if (getEventNamespace(key).includes(event)) {
                    const events = value.filter(innerEvent => innerEvent.context !== context);
                    listener.set(key, events);
                }
            }

            return this;
        },

        // /**
        //  * Уведомить о событии
        //  * @param {String} event
        //  */
        emit: function (event) {
            getEventNamespace(event)
                .forEach(innerEvent => (listener.get(innerEvent) || [])
                    .forEach(item => item.handler.call(item.context)));

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         */
        several: function (event, context, handler, times) {
            console.info(event, context, handler, times);
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         */
        through: function (event, context, handler, frequency) {
            console.info(event, context, handler, frequency);
        }
    };
}

function getEventNamespace(event) {
    const eventsCount = (event.match(/\./g) || []).length + 1;
    const eventNamespace = [];
    for (let i = eventsCount; i > 0; i--) {
        eventNamespace.push(event.split('.', i).join('.'));
    }

    return eventNamespace;
}

module.exports = {
    getEmitter,

    isStar
};
