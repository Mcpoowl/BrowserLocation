define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",

    "mxui/dom",
    "dojo/dom",
    "dojo/dom-prop",
    "dojo/dom-geometry",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/text",
    "dojo/html",
    "dojo/_base/event",


], function (declare, _WidgetBase, dom, dojoDom, dojoProp, dojoGeometry, dojoClass, dojoStyle, dojoConstruct, dojoArray, lang, dojoText, dojoHtml, dojoEvent) {
    "use strict";

    return declare("BrowserLocation.widget.BrowserLocation", [ _WidgetBase ], {


        // Internal variables.
        _handles: null,
        _contextObj: null,
        latitude: "",
        longitude: "",
        mf: "",

        constructor: function () {
            this._handles = [];
        },

        postCreate: function () {
            logger.debug(this.id + ".postCreate");
        },

        update: function (obj, callback) {
            logger.debug(this.id + ".update");

            this._contextObj = obj;
            
            if(navigator.geolocation) {
               navigator.geolocation.getCurrentPosition(lang.hitch(this, this.showPosition), lang.hitch(this.showError));
            } else {
                logger.warn("This browser does not support geolocation");
            }
            this._updateRendering(callback);


        },

        showPosition: function(position) {
            console.log(position);
            logger.debug("Latitude: " + position.coords.latitude);
            logger.debug("Longitude: " + position.coords.longitude);

            this._contextObj.set(this.latitude, position.coords.latitude);
            this._contextObj.set(this.longitude,position.coords.longitude);

            if(this.mf){
                this._execMf(this.mf, this._contextObj.getGuid());
            }

        },

        showError: function(error) {

            switch(error.code) {
                case error.PERMISSION_DENIED:
                logger.error("User denied the request for geolocation");
                break;
                case error.POSITION_UNAVAILABLE:
                logger.warn("Couldn't get a position");
                break;
                case error.TIMEOUT:
                logger.error("The request timed out");
                break;
                case error.UNKNOWN_ERROR:
                logger.error("An unknown error occured");
                break;
            }
        },

        resize: function (box) {
            logger.debug(this.id + ".resize");
        },

        uninitialize: function () {
            logger.debug(this.id + ".uninitialize");
        },

        _updateRendering: function (callback) {
            logger.debug(this.id + "._updateRendering");

            if (this._contextObj !== null) {
                dojoStyle.set(this.domNode, "display", "block");
            } else {
                dojoStyle.set(this.domNode, "display", "none");
            }

            this._executeCallback(callback, "_updateRendering");
        },

        // Shorthand for running a microflow
        _execMf: function (mf, guid, cb) {
            logger.debug(this.id + "._execMf");
            if (mf && guid) {
                mx.ui.action(mf, {
                    params: {
                        applyto: "selection",
                        guids: [guid]
                    },
                    callback: lang.hitch(this, function (objs) {
                        if (cb && typeof cb === "function") {
                            cb(objs);
                        }
                    }),
                    error: function (error) {
                        console.debug(error.description);
                    }
                }, this);
            }
        },

        // Shorthand for executing a callback, adds logging to your inspector
        _executeCallback: function (cb, from) {
            logger.debug(this.id + "._executeCallback" + (from ? " from " + from : ""));
            if (cb && typeof cb === "function") {
                cb();
            }
        }
    });
});

require(["BrowserLocation/widget/BrowserLocation"]);
