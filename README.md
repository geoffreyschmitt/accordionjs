Accordion JS
==========

Accordions js - is the free and modern accordion generator for mobile websites.

Accordion js is not compatible with all platforms, it is a modern  accordion generator which is focused only on modern browser to bring simplicity.

# Dist / Build

On production use files (JS and CSS) only from `dist/` folder, there will be the most stable versions

### Production Build

Accordions js uses `gulp` to build a production (dist) versions.

First you need to have `gulp-cli` which you should install globally.

```
$ npm install --global gulp
```

Then install all dependencies, in repo's root:

```
$ npm install
```

### Generate production Build

```
$ npm run build
```

Production version will available in `dist/` folder.


# Basic html structure

    <div class="js-accordion__container">
        <div class="accordion__title" tabindex="0">
                <!-- Title here -->
        </div>
        <div class="accordion__content">
            <div class="accordion__content__inner">
                <!-- Content here -->
            </div>
        </div>
    </div>
        
# getting started

You can init accordions by using in your js file
    
    new accordions();
    
if you want to use a different HTML structure than the basic one, you will have to edit the parameters "elSelector" in order to make it fit to your HTML. You will find all the Editable parameters in the next section.

In order to change parameters, you will have to change the previous exemple like that :
    
    new accordions({
        //params
    });
    

# Editable parameters

    // Parameters that you can change
    init: true, // if set to false, you will have to init manualy
    elSelector: '.js-accordion__container', //selector corresponding to the container
    withTransition: true, //whether to put animations or not / forced animation when preview is true
    baseTranstionDuration: .3, //basic duration of all animations
                                 
    multipleOpen: false, //one or more accordions open at the same time

    //Params for display during initializations
    baseDisplay: {
        opened: [1], //array to define basic open accordions
    },

    title: {
        elSelector: '.accordion__title', //selector corresponding to the title

        baseTransitionDuration: '.3', //basic duration of all titles related animations
        openTransitionDuration: '.3', //basic duration of all opening / hover animations
        closeTransitionDuration: '.3', //basic duration of all closing / end hover events
        transitionEasing: 'ease-out',

        bgColor: 'transparent', // initial background color for title
        fontColor: '#34495e', // initial typo color for title
        hover: {
            classname: '--is-hover', // class added during hover
            bgColor: '#bdc3c7', // background color for the title during the hover
            fontColor: '#3498db', // typo color for the title during the hover
        },
        active: {
            classname: '--is-active', // class added when the accordion is active
            bgColor: '#ecf0f1', // background color when the accordion is active
            fontColor: '#2980b9', // typo color when the accordion is active
        }
    },
    content: {
        elSelector: '.accordion__content',//selector corresponding to the content container


        baseTransitionDuration: '.3', //basic duration of all titles related animations
        openTransitionDuration: '.3', //basic duration of all opening / hover animations
        closeTransitionDuration: '.3', //basic duration of all closing / end hover events
        transitionEasing: 'ease-out',


        bgColor: 'white', // initial background color for content
                            
        fontColor: 'rgba(0,0,0,0.7)', // initial typo color for content
        active: {
            classname: '--is-active', // class added when the accordion is active
        },
        inner: {
            elSelector: '.accordion__content__inner', //selector corresponding to the main container in the content. Used to determine the pitch of the content of the accordion.
        }
    },
    contentPreview: {
        preview: false, // Activate the preview

        // Animation management for the preview
        baseTransitionDuration: '.3',//basic duration of all animations related to the preview
        openTransitionDuration: '.3',//basic duration of all animations of the title hover
        closeTransitionDuration: '.3', //basic duration of all end hover animations on track
        transitionEasing: 'ease-out',

        // Preview management
        previewHeight: '100px',

        // Management of the preview overlay
        previewWithOverlay: true, //activate or not an overlay on the preview
    },
    //EVENTS
    on: {
        beforeInit: function () {
        },
        init: function () {
        },
        titleHover: function () {
        },
        titleEndHover: function () {
        },
        beforeAccordionChange: function () {
        },
        accordionWillChange: function () {
        },
        accordionWillOpen: function () {
        },
        accordionWillClose: function () {
        },
        accordionChanged: function () {
        },
    }


# next update

Adding responsive
