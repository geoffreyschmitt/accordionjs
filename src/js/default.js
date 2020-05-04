export default {
    init: true,
    withTransition: true,
    baseTranstionDuration: .3,
    multipleOpen: false,
    elSelector: '.js-accordion__container',
    title: {
        elSelector: '.accordion__title',
        hover: {
            classname: '--is-hover',
        },
        active: {
            classname: '--is-active',
        }
    },
    content: {
        elSelector: '.accordion__content',
        active: {
            classname: '--is-active',
        },
        inner: {
            elSelector: '.accordion__content__inner',
        }
    },
    contentPreview: {
        preview: false,
        previewHeight: '100px',
        previewWithOverlay: true,
    }
};
