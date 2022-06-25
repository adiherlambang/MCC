var finesse = finesse || {};
finesse.gadget = finesse.gadget || {};
finesse.container = finesse.container || {};
clientLogs = finesse.cslogger.ClientLogger || {};  // for logging

/** @namespace */
finesse.modules = finesse.modules || {};
finesse.modules.SampleGadget = (function ($) {
    var user, states, dialogs, skillTargetID, queueData, clientlogs, currentDialog ,queueNumber, queueName, agentID, callType;
    var callvars = new Array();
    defaultHtml="Gadget for getting AgentID and Skill Group",
    
    render = function () {
        // Examples of getting data from the User object (GET)
        userData = user.getData();
        agentID = userData['loginId'];
        skillTargetID = userData['skillTargetId'];
        clientLogs.log("get agentID from user.loginId()=" + agentID);
        clientLogs.log("get agentID from user.skillTargetId()=" + skillTargetID);
    },

    displayDefaultHtml = function(){
        var html="";
        currentDialog = null;

        $("#dataAgent").html(defaultHtml);
        $("#agentID").html("null");
        $("#skillID").html("null");
        $("#skillTargetID").html("null");
        $('#dataAgent').show();
    },

    _processCall = function (dialog) {
        currentDialog = dialog;
        displayCall(currentDialog);
    },

    handleNewDialog = function(dialog) {
        currentDialog = dialog;
        clientLogs.log("handleNewDialog(): " + dialog.getId());
        callvars = dialog.getMediaProperties();
        // call the displayCall handler
        displayCall(currentDialog);
        // add a dialog change handler in case the callvars didn't arrive yet
        if (callvars["user.value"] == null) {
            dialog.addHandler('change', _processCall);
        }else{
            clientLogs.log("handleNewDialog(): rendering dialog");
            render();
        }
    },

    handleEndDialog = function(dialog) {
        displayDefaultHtml();
    },

    displayCall = function (dialog) {
       finesse.modules.SampleGadget.updateCallVariable("user.value",skillTargetID);
       clientLogs.log("update CallVariable user.value =" + skillTargetID);
        
       queueNumber = dialog.getMediaProperties().queueNumber;
       clientLogs.log("QueueID(): " + dialog.getMediaProperties().queueNumber);
       queueName = dialog.getMediaProperties().queueName;
       clientLogs.log("QueueName(): " + dialog.getMediaProperties().queueName);
       
       finesse.modules.SampleGadget.updateCallVariable("user.skill",queueNumber);
       clientLogs.log("update CallVariable user.skill =" + queueNumber);
    },

    /**
     * Handler for the onLoad of a User object. This occurs when the User object is initially read
     * from the Finesse server. Any once only initialization should be done within this function.
     */
    handleUserLoad = function (userevent) {
        // Get an instance of the dialogs collection and register handlers for dialog additions and
        // removals
        clientLogs.log("handleUserLoad(): " + userevent); 
        dialogs = user.getDialogs( {
            onCollectionAdd : handleNewDialog,
            onCollectionDelete : handleEndDialog
        });

        render();
    },

    /**
    * Handler respon for updateCall Variable using API Finesse 
    */
    handleResponse = function(handlers) {
        return function (response) {
            clientLogs.log("handleResponse(): The response status code is: " + response.rc);
            
            // Send the response to the success handler if the http status
            // code is 200 or 202. Send the response to the error handler
            // otherwise.
            if ((response.rc === 200 || response.rc === 202) && handlers.success) {
                clientLogs.log("handleResponse(): Got a successful response.");
                handlers.success(response);
            } else if (handlers.error) {
                clientLogs.log("handleResponse(): Got a failure response.");
                handlers.error(response);
            } else {
                clientLogs.log("handleResponse(): Missing the success and/or error handler.");
            }
        };
    },

    /**
     * Make Request for update callVariable
     */
    makeRequest = function (url, options, handlers) {
        var params, uuid;
        clientLogs.log("makeRequest()");
        
        // Protect against null dereferencing of options & handlers allowing its (nonexistant) keys to be read as undefined
        params = {};
        options = options || {};
        handlers.success = _util.validateHandler(handlers.success);
        handlers.error = _util.validateHandler(handlers.error);

        // Request Headers
        params[gadgets.io.RequestParameters.HEADERS] = {};

        // HTTP method is a passthrough to gadgets.io.makeRequest
        params[gadgets.io.RequestParameters.METHOD] = options.method;

        if (options.method === "GET") {
            // Disable caching for GETs
            if (url.indexOf("?") > -1) {
                url += "&";
            } else {
                url += "?";
            }
            url += "nocache=" + _util.currentTimeMillis();
        } else {
            // Generate a requestID and add it to the headers
            uuid = _util.generateUUID();
            params[gadgets.io.RequestParameters.HEADERS].requestId = uuid;
            params[gadgets.io.RequestParameters.GET_FULL_HEADERS] = "true";
        }
        
        // Add authorization to the request header if provided
        if(options.authorization) {
            params[gadgets.io.RequestParameters.HEADERS].Authorization = options.authorization;
        }

        // Add content type & body if content body is provided
        if (options.content) {
            // Content Type
            params[gadgets.io.RequestParameters.HEADERS]["Content-Type"] = options.contentType;
            // Content
            params[gadgets.io.RequestParameters.POST_DATA] = options.content;
        }

        // Call the gadgets.io.makereqest function with the encoded url
        clientLogs.log("makeRequest(): Making a REST API request to: " + url);
        gadgets.io.makeRequest(encodeURI(url), handleResponse(handlers), params);
    },
    
    /**
     * Response success for update callVariable
     */
    handleResponseSuccess = function(response) {
        var html = "";
        
        clientLogs.log("handleResponseSuccess():" + response);

        html+="Getting AgentID and Skill Group --- Successfull";
        $("#dataAgent").html(html);
        $("#agentID").html(agentID);
        $("#skillID").html(queueNumber);
        $("#skillTargetID").html(skillTargetID);
        gadget.window.adjustHeight(250);
    },
    /**
     * Response Error for update callVariable
     */
    handleResponseError = function(response) {
        clientLogs.log("handleResponseError():" + response);
    },

    /**
     *  Handler for all User updates
     */
     handleUserChange = function(userevent) {};
    
    /** @scope finesse.modules.SampleGadget */
    return {

        /* update CALl VARIABLE */
        updateCallVariable : function(name, value) {
            if (currentDialog) {
                clientLogs.log("updateCallVariable(): Updating " + name + " to " + value + " for dialog with id: " + currentDialog.getId());
    
                // Call the Dialog — Update Call Variable Data REST API
                var config = finesse.gadget.Config;
                var url = config.scheme + "://" + config.host + ":" + config.hostPort + currentDialog.getRestUrl();
                clientLogs.log("updateCallVariable(): URL is: " + url);
    
                // Build the content body
                var contentBody = {
                                    "Dialog" : {
                                        "requestedAction": finesse.restservices.Dialog.Actions.UPDATE_CALL_DATA,
                                        "mediaProperties": {
                                            "callvariables": {
                                                "CallVariable": {
                                                    "name": name,
                                                    "value": value
                                                }
                                            }
                                        }
                                    }
                                  };
                makeRequest(url, {
                    method: 'PUT',
                    authorization: _util.getAuthHeaderString(finesse.gadget.Config),
                    contentType: 'application/xml',
                    content: _util.json2xml(contentBody),
                }, {
                    success: handleResponseSuccess,
                    error: handleResponseError
                });
            } else {
                clientLogs.log("updateCallVariable(): There are currently no active dialogs");
            }
        },
            
        /**
         * Performs all initialization for this gadget
         */
        init : function () {
            var cfg = finesse.gadget.Config;
            _util = finesse.utilities.Utilities;

            clientLogs = finesse.cslogger.ClientLogger;   // declare clientLogs
             
            gadgets.window.adjustHeight(250);
            
            // Initiate the ClientServices and load the user object.  ClientServices are
            // initialized with a reference to the current configuration.
            finesse.clientservices.ClientServices.init(cfg, false);

             // Initiate the ClientLogs. The gadget id will be logged as a part of the message
            clientLogs.init(gadgets.Hub, "GadgetAgent"); //this gadget id will be logged as a part of the message
            
            user = new finesse.restservices.User({
                id: cfg.id, 
                onLoad : handleUserLoad,
                onChange : handleUserChange
            });

            containerServices = finesse.containerservices.ContainerServices.init();
            containerServices.addHandler(finesse.containerservices.ContainerServices.Topics.ACTIVE_TAB, function() {
                clientLogs.log("Gadget is now visible");  // log to Finesse logger
                // automatically adjust the height of the gadget to show the html
                gadgets.window.adjustHeight();
            });

            displayDefaultHtml();
            states = finesse.restservices.User.States;
            
            clientLogs.log ("GadgetAgent.init(): completed init");
        }
    };
}(jQuery));