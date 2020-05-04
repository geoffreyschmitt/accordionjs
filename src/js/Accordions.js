import Utils from './Utils';
import defaultParams from './default';
import Accordion from './Accordion';

class Accordions {
    constructor(...args) {
        let elSelector;
        let params;

        if (args.length === 1 && args[0].constructor && args[0].constructor === Object) {
            params = args[0];
        } else {
            [elSelector, params] = args;
        }
        if (!params) params = {};
        params = Utils.extend({}, params);

        if (elSelector && !params.elSelector) params.elSelector = elSelector;


        const self = this;
        self.params = Utils.extend({}, defaultParams, params);

        // Find el
        //If user have set an element
        const mainElem = typeof self.params.el === 'string' || typeof self.params.el === typeof undefined ? document.querySelectorAll(self.params.elSelector) : [self.params.el];

        //Return if no elements
        if (!mainElem[0]) {
            return;
        }

        //Create hash for style separation
        if (!self.params.hash) {
            self.params.hash = Math.random().toString(36).substring(7);
        }

        //Create accordions list for accordion group
        const accordions = [];

        //If more than 1 elem
        if (mainElem.length > 1) {
            mainElem.forEach((containerEl) => {
                const newAccordionParams = Utils.extend({}, self.params, {el: containerEl});
                accordions.push(new Accordion(newAccordionParams));
            });
        }
        else {
            const newAccordionParams = Utils.extend({}, self.params, {el: mainElem[0]});

            accordions.push(new Accordion(newAccordionParams));
        }

        self.params.accordions = accordions;

        if (self.params.baseDisplay && self.params.baseDisplay.opened && self.params.baseDisplay.opened.length > 0) {
            self.initOpenedAccordion();
        }
        if (self.params.multipleOpen === false) {
            self.initClosingOthersAccordionWhenOneOpen();
        }

        return accordions;
    }

    initOpenedAccordion() {
        const self = this;
        self.params.accordions.forEach(function (accordion, index) {
            if (self.params.baseDisplay.opened.includes(index + 1)) {
                accordion.toogleAccordion(false);
            }
        });
    }

    initClosingOthersAccordionWhenOneOpen() {
        const self = this;
        self.params.accordions.forEach(function (accordion,) {
            accordion.on('accordionWillOpen', function () {
                self.params.accordions.forEach(function (accordionToTest) {
                    if (accordionToTest.params.el !== accordion.params.el && accordionToTest.opened) {
                        accordionToTest.toogleAccordion();
                    }
                });
            });
        });
    }
}
export default Accordions;
