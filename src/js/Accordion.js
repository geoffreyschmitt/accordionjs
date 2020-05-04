import Utils from './Utils';
import ClassManagement from './ClassManagement';

const accordionsCSS = [];

class Accordion extends ClassManagement {
    constructor(params) {
        super(params);

        const accordion = this;
        params.el.accordion = accordion;

        // Init
        if (accordion.params.init) {
            accordion.init();
        }

    }

    init() {
        const self = this;

        if (self.initialized) return;

        // Emit
        self.emit('beforeInit');

        self.setElementsParams();

        self.initDynamicCSS();

        self.initCSSClass();

        self.initTitleEvents();

        self.initContentPreview();

        // Init Flag
        self.initialized = true;


        self.params.el.classList.add('--is-init');

        // Emit
        self.emit('init');
    }

    setElementsParams() {
        const self = this;

        self.params.title.el = self.params.el.querySelector(self.params.title.elSelector);

        self.params.content.el = self.params.el.querySelector(self.params.content.elSelector);

        self.params.content.inner.el = self.params.content.el.querySelector(self.params.content.inner.elSelector);
    }

    initDynamicCSS() {
        const self = this;

        self.params.dynamicsCssRulesToInsert = [];

        const styleElement = document.querySelector('.dynamicAccordionStyle');
        let sheet = null;
        if (styleElement === typeof undefined || styleElement === null) {
            sheet = (function () {
                // Create the <style> tag
                var style = document.createElement('style');
                style.setAttribute('class', 'dynamicAccordionStyle');

                // WebKit hack :(
                style.appendChild(document.createTextNode(''));

                // Add the <style> element to the page
                document.head.appendChild(style);

                return style.sheet;
            })();
            self.params.cssSheet = sheet;
        }
        else {
            sheet = styleElement.sheet;
            self.params.cssSheet = sheet;
        }

        if (!accordionsCSS.includes(self.params.hash)) {
            self.initTitleDynamicCss();
        }
    }

    initTitleDynamicCss() {
        const self = this;
        self.params.dynamicsCssRulesToInsert.push(`
            [data-hash="${self.params.hash}"] ${self.params.title.elSelector} { 
                color : ${self.params.title.fontColor};
                background : ${self.params.title.bgColor};
                transition-duration:  ${self.params.title.transitionDuration}s;
                transition-timing-function: ${self.params.title.transitionEasing};
            }`, `
            [data-hash="${self.params.hash}"] ${self.params.title.elSelector}:hover { 
                color: ${self.params.title.hover.fontColor}; 
                background: ${self.params.title.hover.bgColor}; 
            }`, `
            [data-hash="${self.params.hash}"] ${self.params.title.elSelector}.${self.params.title.active.classname} { 
                color: ${self.params.title.active.fontColor}; 
                background: ${self.params.title.active.bgColor}; 
            }
            `, `
            [data-hash="${self.params.hash}"] ${self.params.content.elSelector} { 
                color : ${self.params.content.fontColor};
                background : ${self.params.content.bgColor};
                height : 0;
                overflow : hidden;
                transition-duration:  ${self.params.title.transitionDuration}s;
                transition-timing-function: ${self.params.title.transitionEasing};
            }
        `);
        let cssLength = self.params.cssSheet.cssRules.length;
        self.params.dynamicsCssRulesToInsert.forEach(function (cssRule) {
            self.params.cssSheet.insertRule(cssRule, cssLength);
            cssLength++;
        });
        accordionsCSS.push(self.params.hash);
    }

    initCSSClass() {
        const self = this;
        self.params.el.dataset.hash = self.params.hash;
    }

    initTitleEvents() {
        const self = this;

        if (!Utils.checkIfElementExist(self.params.title.el) || !Utils.checkIfElementExist(self.params.content.el)) {
            return;
        }

        self.params.title.el.addEventListener('focus', self.onTitleHover);
        self.params.title.el.addEventListener('mouseenter', self.onTitleHover);

        self.params.title.el.addEventListener('mouseleave', self.onTitleEndHover);
        self.params.title.el.addEventListener('blur', self.onTitleEndHover);


        self.params.title.el.addEventListener('touchstart', self.onTitleClick);
        self.params.title.el.addEventListener('click', self.onTitleClick);
        self.params.title.el.addEventListener('keydown', self.onTitleClick);
    }

    onTitleHover = (e) => {
        const self = this;
        e.preventDefault();

        // Emit
        self.emit('titleHover');

        if (self.opened) {
            return;
        }


        if (self.params.contentPreview.preview) {
            clearInterval(self.previewInterval);
            clearTimeout(self.previewTimeout);

            self.emit('previewWillOpen');


            const contentPreviewOpenTransitionDuration = self.params.contentPreview.openTransitionDuration || self.params.contentPreview.baseTransitionDuration || self.params.baseTranstionDuration;
            self.params.content.el.style.transitionDuration = contentPreviewOpenTransitionDuration + 's';

            const contentPreviewTransitionEasing = self.params.contentPreview.transitionEasing || null;
            if (contentPreviewTransitionEasing !== null) {
                self.params.content.el.style.transitionTimingFunction = contentPreviewTransitionEasing;
            }

            const innerCurrentHeight = self.params.content.inner.el.offsetHeight;
            let toHeight = self.params.contentPreview.previewHeight;
            if (innerCurrentHeight <= parseInt(self.params.contentPreview.previewHeight)) {
                toHeight = innerCurrentHeight + 'px';
            }
            self.params.content.el.style.height = toHeight;

            self.previewInterval = window.setInterval(function () {
                if (!Utils.checkIfElementIsHover(self.params.title.el) && !Utils.checkIfElementIsFocus(self.params.title.el))
                    return;
                const elemCurrentHeight = window.getComputedStyle(self.params.content.el, null).getPropertyValue('height');
                if (elemCurrentHeight === toHeight) {
                    self.emit('previewIsOpen');
                    self.params.content.el.style.transitionDuration = '';
                    self.params.content.el.style.transitionTimingFunction = '';
                    clearInterval(self.previewInterval);
                    clearTimeout(self.previewTimeout);
                }
            }, 100);

            //SAFE
            self.previewTimeout = setTimeout(function () {
                clearInterval(self.previewInterval);
            }, contentPreviewOpenTransitionDuration * 1000 + 200);
        }
    };
    onTitleEndHover = (e) => {
        e.preventDefault();

        const self = this;

        // Emit
        self.emit('titleEndHover');

        if (!self.opened && self.params.contentPreview.preview) {

            clearInterval(self.previewInterval);
            clearTimeout(self.previewTimeout);

            self.emit('previewWillClose');

            self.params.content.el.style.height = '0px';

            const contentPreviewCloseTransitionDuration = self.params.contentPreview.closeTransitionDuration || self.params.contentPreview.baseTransitionDuration || self.params.baseTranstionDuration;
            self.params.content.el.style.transitionDuration = contentPreviewCloseTransitionDuration + 's';

            const contentPreviewTransitionEasing = self.params.contentPreview.transitionEasing || null;
            if (contentPreviewTransitionEasing !== null) {
                self.params.content.el.style.transitionTimingFunction = contentPreviewTransitionEasing;
            }

            self.previewInterval = window.setInterval(function () {
                const elemCurrentHeight = window.getComputedStyle(self.params.content.el, null).getPropertyValue('height');
                if (elemCurrentHeight === 0 + 'px') {
                    self.emit('previewIsClose');
                    self.params.content.el.style.transitionDuration = '';
                    self.params.content.el.style.transitionTimingFunction = '';
                    clearInterval(self.previewInterval);
                    clearTimeout(self.previewTimeout);
                }
            }, 100);

            //SAFE
            self.previewTimeout = setTimeout(function () {
                clearInterval(self.previewInterval);
            }, contentPreviewCloseTransitionDuration * 1000 + 200);
        }
    };

    onTitleClick = (e) => {
        e.preventDefault();
        const self = this;
        if (e.type === 'keydown' && (e.key !== 'Enter' && e.code !== 'Space')) {
            return;
        }
        // Emit
        self.emit('beforeAccordionChange');

        clearInterval(self.changeInterval);
        clearTimeout(self.changeTimeout);

        self.toogleAccordion();
    };

    toogleAccordion(toogleWithTransition = true) {
        const self = this;

        self.emit('accordionWillChange');


        self.opened ? self.closeAccordion(toogleWithTransition) : self.openAccordion(toogleWithTransition);


        self.params.title.el.classList.toggle(self.params.title.active.classname);
        self.params.content.el.classList.toggle(self.params.content.active.classname);

        if (self.withTransition === false) {
            setTimeout(function () {
                self.params.title.el.style.transitionDuration = '';
                self.params.content.el.style.transitionDuration = '';
            }, 0);
        }

        self.opened = !self.opened;
    }

    openAccordion(toogleWithTransition = false) {
        const self = this;

        self.emit('accordionWillOpen');

        self.params.content.el.style.height = self.params.content.inner.el.offsetHeight + 'px';


        let contentOpenTransitionDuration = self.params.content.openTransitionDuration || self.params.content.baseTransitionDuration || self.params.baseTranstionDuration;

        if ((toogleWithTransition === false || self.params.withTransition === false) && !self.params.contentPreview.preview) {
            contentOpenTransitionDuration = '0';
        }

        self.params.content.el.style.transitionDuration = contentOpenTransitionDuration + 's';

        let toHeight = self.params.content.inner.el.offsetHeight + 'px';

        self.changeInterval = window.setInterval(function () {
            const elemCurrentHeight = window.getComputedStyle(self.params.content.el, null).getPropertyValue('height');

            if (elemCurrentHeight === toHeight) {
                self.emit('accordionIsOpen');
                self.emit('accordionChanged');

                self.params.content.el.style.transitionDuration = '';
                self.params.content.el.style.transitionTimingFunction = '';

                clearInterval(self.changeInterval);
                clearTimeout(self.changeTimeout);
            }
        }, 100);

        //SAFE
        self.changeTimeout = setTimeout(function () {
            clearInterval(self.changeInterval);
        }, contentOpenTransitionDuration * 1000 + 200);
    }

    closeAccordion(toogleWithTransition = false) {
        const self = this;

        self.emit('accordionWillClose');

        self.params.content.el.style.height = '0';

        let contentCloseTransitionDuration = self.params.content.closeTransitionDuration || self.params.content.baseTransitionDuration || self.params.baseTranstionDuration;

        if ((toogleWithTransition === false || self.params.withTransition === false) && !self.params.contentPreview.preview) {
            contentCloseTransitionDuration = '0';
        }

        self.params.content.el.style.transitionDuration = contentCloseTransitionDuration + 's';


        let toHeight = '0';

        self.changeInterval = window.setInterval(function () {
            const elemCurrentHeight = window.getComputedStyle(self.params.content.el, null).getPropertyValue('height');

            if (self.params.contentPreview.preview && (Utils.checkIfElementIsHover(self.params.title.el) || Utils.checkIfElementIsFocus(self.params.title.el))) {
                toHeight = self.params.contentPreview.previewHeight;
                self.params.content.el.style.height = toHeight + 'px';
            }
            else {
                toHeight = '0px';
            }

            if (elemCurrentHeight === toHeight) {
                self.emit('accordionIsClose');
                self.emit('accordionChanged');

                self.params.content.el.style.transitionDuration = '';
                self.params.content.el.style.transitionTimingFunction = '';

                clearInterval(self.changeInterval);
                clearTimeout(self.changeTimeout);
            }
        }, 100);

        //SAFE
        self.changeTimeout = setTimeout(function () {
            clearInterval(self.changeInterval);
        }, contentCloseTransitionDuration * 1000 + 200);
    }

    initContentPreview() {
        const self = this;
        let newOverlay = document.createElement('div');
        newOverlay.className = 'accordion__content-preview__overlay';
        self.params.content.el.appendChild(newOverlay);
    }
}

export default Accordion;
