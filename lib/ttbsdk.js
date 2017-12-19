
/**
 * Copyright © 2017 Benutech Inc. All rights reserved.
 * http://www.benutech.com - help@benutech.com
 * version: 0.1.0
 * */

(function () {
  'use strict';

  var defaults;

  defaults = {
    partnerKey: '1-234-567-890',
    sponsor: 'direct',
    baseURLPattern: 'https://{{sponsor}}.api.titletoolbox.com/',
    debug: false,
    sdkPrefix: 'ttb-sdk',
    autoFillAttr: 'data-ttb-field',
    modalTemplate: [
      '<div id={{modalId}} class="ttb-sdk-modal modal" role="dialog">',
      ' <div class="modal-dialog">',
      '  <div class="modal-content">',
      '   <div class="modal-header">',
      '    <button type="button" class="close" data-dismiss="modal" title="Close">&times;</button>',
      '    <h4 class="modal-title">{{title}}</h4>',
      '   </div>',
      '   <div class="modal-body">',
      '    {{bodyContent}}',
      '   </div>',
      '  </div>',
      ' </div>',
      '</div>'
    ].join('')
  };

  /**
   * The main class for consuming TTB web services.
   * @class
   * @alias TTB
   *
   * @classdesc <p class="main-desc">JavaScript SDK for consuming webservices and widgets by TitleToolBox from third-party websites.</p>
   *
   * <p><strong>Dependencies:</strong></p>
   * <p>
   * <strong>JQuery</strong> - version <code>1.x</code> or <code>2.x</code> any would work. We recommend the latest version <code>3.x</code> <br/>
   * <code> &lt;script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js">&lt;/script> </code>
   * </p>
   *
   * <p>
   * <strong>Bootstrap</strong> - For modals, and rendering widgets, SDK uses bootstrap UI and script. <br/>
   * <code> &lt;link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"> </code> <br/>
   * <code> &lt;script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js">&lt;/script> </code>
   * </p>
   *
   * <p>
   * <strong>TitleToolBox SDK </strong> script file itself, it should be pulled via our private repo
   * as <code>bower</code> component or can directly be injected whatever suits you best. <br/>
   * <code> &lt;script src="bower_components/ttbsdk/dist/ttbsdk.js">&lt;/script> </code>
   * </p>
   *
   * @param {Object} config - The configuration info required
   *
   * @param {String} config.partnerKey - The Partner-Key is a unique ID assigned to you by Company, that to be sent on
   * every request from your site.
   *
   * @param {String} [config.baseURL="https://direct.api.titletoolbox.com/"] - The Base URL to be used for APIs calls. (note - we can alternatively use <code>sponsor</code>
   * and/or <code>baseURLPattern</code> to keep switching to custom <code>baseURL</code> on the fly.)
   *
   * @param {String} [config.sponsor="direct"] - The Title Company Sponsor name to be used in generating baseURL.
   * (note - It will be ignored if baseURL is already passed.)
   *
   * @param {String} [config.baseURLPattern="https://{{sponsor}}.api.titletoolbox.com/"] - The URL pattern to be used
   * to generate the baseURL which includes the <code>sponsor</code> provided. Must contain {{sponsor}} at least once.
   * (note - It will be ignored if <code>baseURL</code> is already passed.)
   *
   * @param {String} [config.autoFillAttr="data-ttb-field"] - The attribute to be used for auto-fill input fields when
   * <code>options.autoFillContext</code> specified in methods which support auto-fill.
   * (Note: the attribute value on those inputs would be used to evaluate to <code>res.response.data</code>
   * - For example: &lt;input type="text" <code>data-ttb-field="GeneralInfo.Bedrooms"</code> />
   * or &lt;input type="text" <code>data-ttb-field="GeneralInfo['Year Built']"</code> />
   *
   * @param {String} [config.debug=true] - SDK debug mode flag useful for logs, etc.
   *
   * @return {Object} ttb - The instance associated with the provided configuration.
   *
   *  @example
   *  // With basic and minimum requirement.
   *  var ttb = new TTB({
   *    partnerKey: '{your partner key}',
   *  });
   *
   *  @example
   *  // With advanced configuration for custom baseURL, and logs for debug mode.
   *  var ttb = new TTB({
   *    partnerKey: '{your partner key}',
   *    baseURL: 'https://direct.api.titletoolbox.com/',
   *    debug: true
   *  });
   *
   *  @example
   *  // With advanced configuration for custom <code>baseURLPattern</code> and <code>sponsor</code>, and custom auto-fill attributes.
   *  var ttb = new TTB({
   *    partnerKey: '{your partner key}',
   *    baseURLPattern: 'https://customdomain.com/api/{{sponsor}}',
   *    sponsor: 'abc' // switchable later via ttb.setSponsor(),
   *    autoFillAttr: 'data-model'
   *  });
   * */
  window.TTB = function (config) {

    /**
     * @type {Object}
     * @desc The configuration passed while instantiating main SDK class.
     * */
    this.config = config;

    // setup default baseURL
    this.baseURLPattern = config.baseURLPattern || defaults.baseURLPattern;
    this.sponsor = config.sponsor || defaults.sponsor;
    this.baseURL = config.baseURL || this.setSponsor(this.sponsor);
    this.autoFillAttr = config.autoFillAttr || defaults.autoFillAttr;
    this.debug = config.debug || defaults.debug;

    this._log([defaults.sdkPrefix + ' :', 'TTB SDK instantiated.']);
  };


  /**
   * @memberof TTB
   * @alias _modal
   * @static
   *
   * Shows a modal with given dynamic content.
   * @private
   *
   * @param {Object} options - configuration options for the modal.
   * @param {Object} options.title - The Title of the modal to be shown inside the modal header - can be plain text or HTML markup.
   * @param {Object} options.bodyContent - The body content - can be plain text or HTML markup.
   * @param {Object} [options.id="Dynamically generated number e.g. ttb-sdk-1234567890"] - A unique id to be assigned to the modal
   * @param {Function} [options.onLoad] - A callback function to be invoked when modal has been loaded into DOM. it uses <code>loaded.bs.modal</code> bootstrap modal event.
   * @param {Function} [options.onShown] - A callback function to be invoked when modal has been triggered and shown to user. it uses <code>shown.bs.modal</code> bootstrap modal event.
   * @param {Function} [options.onClose] - A callback function to be invoked when modal has been closed by the user. it uses <code>hidden.bs.modal</code> bootstrap modal event.
   * @param {Function} [options.onBeforeClose] - A callback function to be invoked when modal is about to be close. it uses <code>hide.bs.modal</code> bootstrap modal event.
   *
   * @return {String} $modal - A JQuery reference to the modal DOMNode Element.
   *
   * */
  window.TTB._modal = function (options) {
    var $modal, modalTemplate, modalId;

    modalId = options.id || (Date.now() + '');

    // generate the modal template against given info
    modalTemplate = defaults.modalTemplate
      .replace('{{modalId}}', modalId)
      .replace('{{title}}', options.title)
      .replace('{{bodyContent}}', options.bodyContent);

    // inject the modal inside the DOM
    //return $(document.body).append(modalTemplate);
    $modal = $(modalTemplate).appendTo(document.body);

    options.onLoad && $modal.on('loaded.bs.modal', options.onLoad);
    options.onShown && $modal.on('shown.bs.modal', options.onShown);
    options.onBeforeClose && $modal.on('hide.bs.modal', options.onBeforeClose);
    options.onClose && $modal.on('hidden.bs.modal', options.onClose);

    return $modal;
  };


  /**
   * @memberof TTB
   * @alias getSponsorsList
   * @static
   *
   * This static method provides the list of all available sponsors based on given info.
   *
   * @param {Object} payload - The payload object containing required info against the logged-in user, so that we could suggest the sponsor(s) for it.
   * @param {String} [payload.email] - The email address of the logged-in user, if they have signed-up previously for any sponsor(s), we include them.
   * @param {String} [payload.zipCode] - The Zip Code of the logged-in user, if user is newly signed-up in TTB system, we list the available sponsors in that region.
   *
   * @example
   * // No ttb instance needed.
   * // var ttb = new TTB({ ... });
   *
   * var payload = {
   *   email: 'agent47@domain.com',
   *   zipCode: '12345'
   * };
   *
   * TTB.getSponsorsList(payload)
   * .done(function(res) {
   *   if (res.response.status === 'OK') {
   *     // your success code here to consume res.response.data
   *     console.log(res.response.data);
   *   } else {
   *     // your failure code here to consume res.response.data
   *     console.log(res.response.data);
   *   }
   * })
   * .fail(function(err) {
   *   // your failure code here
   * })
   * .always(function() {
   *  // your on-complete code here as common for both success and failure
   * });
   *
   * @return {Object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
   *
   * */
  window.TTB.getSponsorsList = function (payload) {

    // for static, no existing ttb instance, create new one on the fly
    var ttb = new TTB({
      partnerKey: defaults.partnerKey
    });

    var request = {
      method: 'POST',
      data: JSON.stringify(payload)
    };

    return ttb._ajax(request, 'webservices/get_sponsors_list.json');
  };


  /**
   * @memberof TTB
   * @alias showSelectSponsor
   * @static
   *
   * This static method provides the list of all available sponsors based on given info.
   *
   * @param {Object} payload - To be used for <code>getSponsorsList()</code>. Please see payload information [over there]{@link TTB#getSponsorsList}.

   * @param {Object} options - The callbacks options to retrieve success and failure info.
   * @param {Function} [options.onSelect] - The callback to be invoked with <code>selectedSponsor</code> when user selects it.
   * @param {Function} [options.onError] - The callback to be invoked with <code>error</code>.
   *
   * @example
   * // No ttb instance needed.
   * // var ttb = new TTB({ ... });
   *
   * var payload = {
   *   email: 'agent47@domain.com',
   *   zipCode: '12345'
   * };
   *
   * TTB.showSponsorSelector(payload, {
   *   onSelect: function(selectedSponsor) {
   *    // your success code here to consume "selectedSponsor"
   *
   *    // you can instantiate the TTB sdk against the selected sponsor.
   *    // var ttb = new TTB({
   *    //  ...
   *    //  sponsor: selectedSponsor
   *    //  ...
   *    // });
   *
   *    // OR you can update the sponsor of already instantiated TTB sdk
   *    // ttb.setSponsor(selectedSponsor);
   *   },
   *   onError: function(error) {
   *    // your failure code here
   *   }
   * });
   *
   * @return {Object} $modal - JQuery reference to the rendered modal DOMNode.
   *
   * */
  window.TTB.showSelectSponsor = function (payload, options) {
    var modalId, $modal;

    modalId = 'ttb-sdk-sponsor-selector';

    // remove any previous attempt modal
    if ($(modalId).length) {
      $(modalId).remove();
    }

    // render the sponsors selector content via modal
    $modal = $(modalId).length ? $(modalId) : this._modal({
      id: modalId,
      title: 'Select Sponsor',
      bodyContent: 'Retrieving list of all available sponsors...'
    });

    // retrieve the available sponsors
    TTB.getSponsorsList(payload)
      //.fail(function (res) {
      .done(function (res) {
        var bodyContent, sponsors, sponsorsList;

        //if (res) {
        if (res.response.status === 'OK') {

          //sponsors = [
          //  { name: 'Offical TTB', vertical_name: 'demo', county: 'Orange'},
          //  { name: 'Chicao Title', vertical_name: 'chicagotitle', county: 'Foo'}
          //];
          sponsors = res.response.data;
          sponsorsList = [];

          // iterate over the list and generate the available options
          for (var i = 0; i < sponsors.length; i++) {
            sponsorsList.push([
              '<tr>',
                '<td>{{name}}</td>',
                '<td>{{county}}</td>',
                '<td><button class="btn btn-primary pull-right" data-vertical="{{vertical}}">Select</button></td>',
              '</tr>'].join('')
              .replace('{{name}}', sponsors[i].name)
              .replace('{{county}}', sponsors[i].county)
              .replace('{{vertical}}', sponsors[i].vertical_name)

            );
          }

          bodyContent = [
            '<p>Please select sponsor from the following list.</p>',
            '<div class="table-responsive">',
              '<table class="table table-striped">',
                '<thead>',
                  '<tr>',
                    '<th>Name</th>',
                    '<th>County</th>',
                    '<th></th>',
                  '</tr>',
                '<thead>',
                '<tbody>{{sponsorsList}}</tbody>',
              '<table>',
            '</div>'
          ].join('');

          // append the sponsors choices and add the final markup to DOM.
          bodyContent = bodyContent.replace('{{sponsorsList}}', sponsorsList.join(''));
          $modal.find('.modal-body').html(bodyContent);

          // register the click handler for sponsor selection
          $('#' + modalId + ' tbody').on('click', 'button', function (e) {
            var selectedSponsor = $(this).attr('data-vertical');

            // pass the selectedSponsor to on-select callback if provided.
            options.onSelect && options.onSelect(selectedSponsor);

            // auto close/hide the modal
            $modal.modal('hide');
          });

        } else {
          // pass the error response to error callback if provided.
          options.onError && options.onError(res);
        }
      })
      .fail(function (err) {
        $modal.find('.modal-body').html('Failed in retrieving list.');
        // pass the error to error callback if provided.
        options.onError && options.onError(err);
      });

    // triggering .modal() of bootstrap
    return $modal.modal({
      //backdrop: 'static'
    });
  };

  /** @lends TTB.prototype */
  window.TTB.prototype = {

    /**
     * Logs the arguments based on debug flag.
     * @private
     * */
    _log: function (args) {
      this.config.debug && console.log.apply(console, args);
    },

    /**
     * This method auto fill the form fields having data-ttb-field="", against the given data.
     *@private
     *
     * @param {String} selector - A query selector of context (form/parent element)
     * @param {Object} data - A data object retrieved from the response of certain of API, against which auto-fill needs to be processed.
     *
     * */
    _fillFields: function (selector, data) {
      var _self, $fields, model, modelValue;

      _self = this;
      $fields = $(selector).find('input[' + _self.autoFillAttr + ']');

      $fields.each(function () {
        model = $(this).attr(_self.autoFillAttr);

        try {
          modelValue = eval('data.' + model);
          $(this).val(modelValue);
        } catch (e) {
          _self._log([defaults.sdkPrefix, ' : autoFill : skipping : invalid model - ', model]);
        }
      });
    },

    /**
     * This method looks for the input field against the given fieldName as value of its data-ttb-field="" attribute,
     * to auto-fill it with the passed fieldValue.
     *@private
     *
     * @param {String} selector - A query selector of context (form/parent element)
     * @param {String} fieldName - the name specified via data-ttb-field="" attribute of input element.
     * @param {String | Number } fieldValue - the value to be filled with given input
     *
     * */
    _fillField: function (selector, fieldName, fieldValue) {
      var $field;

      $field = $(selector).find('input[' + this.autoFillAttr + '="' + fieldName  +'"]');

      if ($field.length) {
        $field.val(fieldValue);
      } else {
        this._log([defaults.sdkPrefix, ' : autoFill : skipping : field not found - ', fieldName]);
      }
    },


    /**
     * Triggers the request with all required headers, cookies, etc.
     * @param options {Object} - The configuration to pass to $.ajax
     * @param [endpoint] {Object} - The endpoint of the webservices
     * @private
     *
     * */
    _ajax: function (options, endpoint) {
      var _self, request;

      _self = this;

      // take the full URL or build it up using baseURL and the given endpoint
      options.url = options.url || this.baseURL + endpoint;

      // extend given AJAX options with required Headers, and CORS flag
      request = $.extend(options, {

        // TTB Sandbox required headers
        headers: {
          'Partner-Key': this.config.partnerKey,
          'Third-Party': true
        },

        // allow CORS
        xhrFields: {
          withCredentials: true
        }
      });

      return $.ajax(request)
        .done(function (res) {

          if (typeof res === 'string' || res instanceof Array || res.response.status === 'OK') {
            _self._log([defaults.sdkPrefix + ' :', endpoint, ': success :', res]);
          } else {
            _self._log([defaults.sdkPrefix + ' :', endpoint, ': error :', res]);
          }

          return res;
        })
        .fail(function (err) {
          _self._log([defaults.sdkPrefix + ' :', endpoint, ': fail :', err]);
          return err;
        });
        //.always(function(arg) {
        //  _self._log([defaults.sdkPrefix + ' :', endpoint, ': always :', arg]);
        //  return arg;
        //});
    },


    /**
     * This method is use to switch to a different sponsor (Title Company) and so generates a new <code>baseURL</code>
     * based on passed <code/>vertical</code> with existing <code>baseURLPattern</code>.
     *
     * @param {String} vertical - The Title Company Sponsor name to be used in generating baseURL. - can retrieve
     * from <code>TTB.getSponsorsList()</code>
     *
     * @return {String} baseURL - The newly generated <code>baseURL</code>.
     *
     * @example
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * ttb.setVertical('xyz');
     *
     * */
    setSponsor: function (vertical) {
      return this.baseURL = this.baseURLPattern.replace('{{sponsor}}', vertical);
    },


    /**
     * This method is used to log the user in from 3rd-party site, and maintain a session for the user throughout the App.
     *
     * @param {Object} payload - The payload object containing required info
     * @param {String} payload.stk - The session token from existing login at 3rd-party app.
     *
     * @example
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * var payload = {
     *   stk: "unique-token123"
     * };
     *
     * ttb.remoteLogin(payload)
     * .done(function(res) {
     *   if (res.response.status === 'OK') {
     *     // user is successfully logged-in !!
     *     // your success code here to consume res.response.data for logged-in user info
     *     console.log(res.response.data);
     *   } else {
     *     // your failure code here to consume res.response.data for validation errors info
     *     console.log(res.response.data);
     *   }
     * })
     * .fail(function(err) {
     *   // your failure code here
     * })
     * .always(function() {
     *  // your on-complete code here as common for both success and failure
     * });
     *
     * @return {Object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
     * */
    loginRemote: function (payload) {
      var request = {
        method: 'POST',
        data: JSON.stringify(payload)
      };

      return this._ajax(request, 'webservices/remote_login.json');
    },


    /**
     * This method is used to log the user in and maintain a session for the user throughout the App.
     *
     * @param {Object} payload - The payload object containing required info
     * @param {String} payload.username - the email/username used while signing up
     * @param {String} payload.password - the secret password of the account
     *
     * @example
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * var payload = {
     *   TbUser: {
     *     username: "awesomeuser99@domain.com",
     *     password: "secret_Password0"
     *   }
     * };
     *
     * ttb.login(payload)
     * .done(function(res) {
     *   if (res.response.status === 'OK') {
     *     // user is successfully logged-in !!
     *     // your success code here to consume res.response.data for logged-in user info
     *     console.log(res.response.data);
     *   } else {
     *     // your failure code here to consume res.response.data for validation errors info
     *     console.log(res.response.data);
     *   }
     * })
     * .fail(function(err) {
     *   // your failure code here
     * })
     * .always(function() {
     *  // your on-complete code here as common for both success and failure
     * });
     *
     * @return {Object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
     * */
    login: function (payload) {
      var request = {
        method: 'POST',
        data: JSON.stringify(payload)
      };

      return this._ajax(request, 'webservices/login.json');
    },


    /**
     * Logs out from the TTB webservices server
     *
     * @example
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * ttb.logout()
     * .done(function(res) {
     *   if (res.response.status === 'OK') {
     *    // user is successfully logged-out!!
     *    // your success code here to clear any cached info etc from the web page
     *    console.log(res.response.data);
     *
     *   } else {
     *     // your failure code here to consume res.response.data
     *     console.log(res.response.data);
     *   }
     * })
     * .fail(function(err) {
     *   // your failure code here
     * })
     * .always(function() {
     *  // your on-complete code here as common for both success and failure
     * });
     *
     * @return {Object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
     * */
    logout: function () {
      var request = {
        method: 'GET'
      };

      return this._ajax(request, 'webservices/logout.json');
    },


    /**
     * Search a property by APN.
     *
     * @param {Object} payload - The payload object containing required info
     * @param {String} payload.parcel_number - The Parcel Number against the property
     * @param {String} payload.state_county_fips - The State County FIPS against the property
     *
     * @example
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * var payload = {
     *   parcel_number: "46327216",
     *   state_county_fips: "06059"
     * };
     *
     * ttb.searchByParcelNumber(payload)
     * .done(function(res) {
     *   if (res.response.status === 'OK') {
     *     // your success code here to consume res.response.data
     *     console.log(res.response.data);
     *   } else {
     *     // your failure code here to consume res.response.data
     *     console.log(res.response.data);
     *   }
     * })
     * .fail(function(err) {
     *   // your failure code here
     * })
     * .always(function() {
     *  // your on-complete code here as common for both success and failure
     * });
     *
     * @return {Object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
     * */
    searchByParcelNumber: function (payload) {
      var request = {
        method: 'POST',
        data: JSON.stringify(payload)
      };

      return this._ajax(request, 'webservices/search_parcel_number.json');
    },


    /**
     * Search a property by site address.
     *
     * @param {Object} payload - The payload object containing required info - (At least any of the following is required)
     * @param {string} [payload.site_address] - Property House# or Street# with the route e.g. "317 2nd St".
     * @param {string} [payload.site_unit] - Unit# of the property (If has any).
     * @param {string} [payload.site_city] - Property City e.g. "Huntington Beach"
     * @param {string} [payload.site_state] - Property State e.g. "CA"
     * @param {string} [payload.site_street_number] - Property Street# e.g. "317"
     * @param {string} [payload.site_route] - Property Route - "2nd St".
     *
     * @example
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * var payload = {
     *   site_address: "317 2nd St",
     *   site_unit: "",
     *   site_city: "Huntington Beach",
     *   site_state: "CA",
     *   site_zip: "92648",
     *   site_street_number: "317",
     *   site_route: "2nd St"
     * };
     *
     * ttb.searchBySiteAddress(payload)
     * .done(function(res) {
     *   if (res.response.status === 'OK') {
     *     // your success code here to consume res.response.data
     *     console.log(res.response.data);
     *   } else {
     *     // your failure code here to consume res.response.data
     *     console.log(res.response.data);
     *   }
     * })
     * .fail(function(err) {
     *   // your failure code here
     * })
     * .always(function() {
     *  // your on-complete code here as common for both success and failure
     * });
     *
     * @return {Object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
     * */
    searchBySiteAddress: function (payload) {
      var request = {
        method: 'POST',
        data: JSON.stringify(payload)
      };

      return this._ajax(request, 'webservices/search_property/ttb.json');
    },


    /**
     * Search a property by owners name.
     *
     * @param {Object} payload - The payload object containing required info - (At least any of the following is required)
     * @param {String} [payload.first_name] - Owner's First Name
     * @param {String} [payload.last_name] - Owner's Last Name
     * @param {String} [payload.state_county_fips] - State County FIPS of the property
     *
     * @example
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * var payload = {
     *   first_name: "Fariba",
     *   last_name: "Siddiqi",
     *   state_county_fips: "06059"
     * };
     *
     * ttb.searchByOwnerName(payload)
     * .done(function(res) {
     *   if (res.response.status === 'OK') {
     *     // your success code here to consume res.response.data
     *     console.log(res.response.data);
     *   } else {
     *     // your failure code here to consume res.response.data
     *     console.log(res.response.data);
     *   }
     * })
     * .fail(function(err) {
     *   // your failure code here
     * })
     * .always(function() {
     *  // your on-complete code here as common for both success and failure
     * });
     *
     * @return {Object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
     * */
    searchByOwnerName: function (payload) {
      var request = {
        method: 'POST',
        data: JSON.stringify(payload)
      };

      return this._ajax(request, 'webservices/search_owner_name/ttb.json');
    },


    /**
     * This will allow you to order a report from the service. The available reports will depend on your account set up.
     *
     * @param {Object} payload - The payload object containing required info.
     * @param {String} payload.sa_property_id - Unique ID of the property
     * @param {String} payload.state_county_fips - State FIPS of the property
     * @param {String} [payload.output="link"] - Format of output, supported types are "link", and "html".
     * @param {String} [payload.report_type="property_profile"] - The report type, supported types are "single_page_profile", "avm"(*), "prep"(*), "tax_bill" and "property_profile".
     *
     * @example
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * var payload = {
     *   sa_property_id: "0039025849",
     *   state_county_fips: "06059",
     *   report_type: "property_profile",
     *   output: "link",
     * };
     *
     * ttb.orderReport(payload)
     * .done(function(res) {
     *   if (res.response.status === 'OK') {
     *     // your success code here to consume res.response.data
     *     console.log(res.response.data);
     *   } else {
     *     // your failure code here to consume res.response.data
     *     console.log(res.response.data);
     *   }
     * })
     * .fail(function(err) {
     *   // your failure code here
     * })
     * .always(function() {
     *  // your on-complete code here as common for both success and failure
     * });
     *
     * @return {Object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
     * */
    orderReport: function (payload) {

      // setup the defaults
      payload.output = payload.output || 'link';
      payload.report_type = payload.report_type || 'property_profile';

      var request = {
        method: 'POST',
        data: JSON.stringify(payload)
      };

      return this._ajax(request, 'webservices/order_report.json');
    },


    /**
     * This method is used to return a list of sales around a subject property PLUS offer a series of statistics based on the response results.
     *
     * @param {Object} payload - The payload object containing required info.
     * @param {String} payload.sa_property_id - Unique ID of the property
     * @param {String} payload.mm_fips_state_code - State FIPS of the property
     * @param {Number} [payload.date_transfer(+/-)] - Sold
     * @param {Number} [payload.distance_in_km] - Distance (in kilometers)
     * @param {Number} [payload.nbr_bath(+/-)] - Baths
     * @param {Number} [payload.nbr_bedrms(+/-)] - Beds
     * @param {Number} [payload.sqft(+/-)] - SQFT
     * @param {Number} [payload.yr_blt(+/-)] - Year built
     *
     * @example
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * var payload = {
     *   "sa_property_id": "0039025849",
     *   "mm_fips_state_code": "06",
     *   "date_transfer(+/-)": 12,
     *   "distance_in_km": 1.6,
     *   "nbr_bath(+/-)": 1,
     *   "nbr_bedrms(+/-)": 1,
     *   "sqft(+/-)": 0.2,
     *   "yr_blt(+/-)": 20
     * };
     *
     * ttb.propertyComps(payload)
     * .done(function(res) {
     *   if (res.response.status === 'OK') {
     *     // your success code here to consume res.response.data
     *     console.log(res.response.data);
     *   } else {
     *     // your failure code here to consume res.response.data
     *     console.log(res.response.data);
     *   }
     * })
     * .fail(function(err) {
     *   // your failure code here
     * })
     * .always(function() {
     *  // your on-complete code here as common for both success and failure
     * });
     *
     * @return {Object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
     * */
    propertyComps: function (payload) {
      var request = {
        method: 'POST',
        data: JSON.stringify(payload)
      };

      return this._ajax(request, 'webservices/property_comps.json');
    },


    /**
     * This method is used to pull details of a property specified by property_id
     *
     * @param {Object} payload - The payload object containing required info.
     * @param {Number} payload.property_id - Unique ID of the property
     * @param {Number} payload.state_fips - State FIPS of the property
     *
     * @param {Object} [options] - The options object
     * @param {String} [options.autoFillContext] - A query selector of an element(s) inside which to look for inputs elements
     * having <code>data-ttb-field</code>attribute.
     *
     * @example
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * var payload = {
     *   property_id: 0091683346
     *   state_fips: 25,
     * };
     *
     * var options = {
     *   autoFillContext: '#propertyDetails__form'
     * };
     *
     * ttb.propertyDetails(payload, options)
     * .done(function(res) {
     *   if (res.response.status === 'OK') {
     *     // your success code here to consume res.response.data for any extra effort other than the auto-fill
     *     console.log(res.response.data);
     *   } else {
     *     // your failure code here to consume res.response.data
     *     console.log(res.response.data);
     *   }
     * })
     * .fail(function(err) {
     *   // your failure code here
     * })
     * .always(function() {
     *  // your on-complete code here as common for both success and failure
     * });
     *
     * @return {Object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
     * */
    propertyDetails: function (payload, options) {
      var _self;

      _self = this;
      options = options || {autoFillContext: null};

      var request = {
        method: 'POST',
        data: JSON.stringify(payload)
      };

      return this._ajax(request, 'webservices/property_details.json')
      .then(function (res) {
        options.autoFillContext && _self._fillFields(options.autoFillContext, res.response.data);
        return res;
      })
    },

    /**
     * This method is used to search all properties matching a set of criteria.<br>
     * There is a vast number of criteria available, see the Available Search Fields and Search Criteria section.
     *
     * @param {Object} payload - The payload object containing required info.
     * @param {String} payload.mm_fips_state_code - State FIPS of the property
     * @param {Object | String} [payload.FIELD_NAME] - Other search fields to be sent.

     * @param {Object} [payload.customFilters] - Filters fields are to be sent via this wrapper - See the available search fields for more.
     * @param {Object} [payload.customFilters.is_site_number_even_search] - A custom filter
     * @param {Object} [payload.customFilters.FIELD_NAME] - Other filter type search fields to be sent.

     * @param {Object} [payload.searchOptions] - Additional options to take control on records.
     * @param {String} [payload.searchOptions.max_limit] - Limit the matched records.
     * @param {String} [payload.searchOptions.omit_saved_records=false] - Suppress/Omit records already saved.
     *
     * @param {Object} [params] - The query string params limit and page on URL are used to control pagination of the result.
     * @param {String} [params.limit] - Determines how many recs to include in one page.
     * @param {String} [params.page] - Specifies the page number in the full result set.
     *
     * @example
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * var params = { limit: 1000, page: 2 };
     * var payload = {
     *  "mm_fips_state_code": "06", // State FIPS
     *  "mm_fips_muni_code": "059", // County FIPS
     *  "sa_site_city": [ // Cities
     *    "ANAHEIM"
     *  ],
     *  "sa_site_zip": [ // Zip Codes
     *    "92801",
     *    "92805"
     *  ],
     *  "sa_site_mail_same": "Y",
     *  "sa_owner_1_type": "0",
     *  "sa_nbr_bedrms": { // Beds
     *    "match": "<=",
     *    "value": 3
     *  },
     *  "sa_nbr_bath": { // Baths
     *    "match": "<=",
     *    "value": 2
     * },
     *  "use_code_std": [
     *    "RSFR",
     *    "RCON"
     * ],
     *  "sa_yr_blt": { // Year built
     *    "match": "From-To",
     *    "value": {
     *      "from": 1950,
     *      "to": 2002
     *    }
     * },
     *  "sa_assr_year": {
     *    "match": ">",
     *    "value": 2000
     * },
     *  "searchOptions": { // Additional Search Options
     *    "omit_saved_records": false
     * },
     *  "customFilters": { // Filters
     *    "is_site_number_even_search": "Y"
     *  }
     * };
     *
     * ttb.globalSearch(payload, params)
     * .done(function(res) {
     *   if (res.response.status === 'OK') {
     *     // your success code here to consume res.response.data
     *     console.log(res.response.data);
     *   } else {
     *     // your failure code here to consume res.response.data
     *     console.log(res.response.data);
     *   }
     * })
     * .fail(function(err) {
     *   // your failure code here
     * })
     * .always(function() {
     *  // your on-complete code here as common for both success and failure
     * });
     *
     * @return {Object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
     * */
    globalSearch: function (payload, params) {
      var request = {
        method: 'POST',
        data: JSON.stringify(payload)
      };

      var endpoint = 'webservices/global_search.json' + (params && $.param(params));

      return this._ajax(request, endpoint);
    },


    /**
     * This method is to only get the count (as opposed to full set of records) against a certain set of search criteria.<br>
     * Note - It accepts the same search criteria input as for [global_search]{@link TTB#globalSearch} API.
     *
     * @param {Object} payload - The payload object containing required info.
     *
     * @example
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * var payload = {
     *  "mm_fips_state_code": "06", // State FIPS
     *  "mm_fips_muni_code": "059", // County FIPS
     *  "sa_site_city": [ // Cities
     *    "ANAHEIM"
     *  ],
     *  "sa_site_zip": [ // Zip Codes
     *    "92801",
     *    "92805"
     *  ],
     *  "sa_nbr_bedrms": { // Beds
     *    "match": "<=",
     *    "value": 3
     *  },
     *  "searchOptions": { // Additional Search Options
     *    "omit_saved_records": false
     * },
     *  "customFilters": { // Filters
     *    "is_site_number_even_search": "Y"
     *  }
     * };
     *
     * ttb.globalSearchCount(payload, params)
     * .done(function(res) {
     *   if (res.response.status === 'OK') {
     *     // your success code here to consume res.response.data
     *     console.log(res.response.data);
     *   } else {
     *     // your failure code here to consume res.response.data
     *     console.log(res.response.data);
     *   }
     * })
     * .fail(function(err) {
     *   // your failure code here
     * })
     * .always(function() {
     *  // your on-complete code here as common for both success and failure
     * });
     *
     * @return {Object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
     *
     * */
    globalSearchCount: function (payload) {
      var request = {
        method: 'POST',
        data: JSON.stringify(payload)
      };

      return this._ajax(request, 'webservices/get_search_count.json');
    },


    /**
     * This method will allow you to verify what reports are available to your user profile.
     *
     * @example
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * ttb.getTypesReport()
     * .done(function(res) {
     *   if (res.response.status === 'OK') {
     *     // your success code here to consume res.response.data
     *     console.log(res.response.data);
     *   } else {
     *     // your failure code here to consume res.response.data
     *     console.log(res.response.data);
     *   }
     * })
     * .fail(function(err) {
     *   // your failure code here
     * })
     * .always(function() {
     *  // your on-complete code here as common for both success and failure
     * });
     *
     *
     * @return {Object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
     *
     * */
    getTypesReport: function () {
      var request = {
        method: 'GET'
      };

      return this._ajax(request, 'webservices/types_report.json');
    },


    /**
     * This method provides the complete list of all fields that can be used to construct search terms for
     * [global_search]{@link TTB#globalSearch} and [global_search_count]{@link TTB#globalSearchCount} APIs. <br><br>
     *
     * To view the complete list of all available search fields and their possible values. <br>
     * Please follow this [JSON presentation]{@link http://jsoneditoronline.org/?id=ba6b41ee73822c653dae0e2cc8cf6351} -
     * The key info you should look for is the <code>field_name</code>, <code>search_type</code> and <code>choices</code>.
     *
     * @example
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * ttb.getSearchFields()
     * .done(function(res) {
     *   if (res instanceof Array) {
     *     // your success code here to consume res as fields list. see example [< JSON here >]{@link http://jsoneditoronline.org/?id=ba6b41ee73822c653dae0e2cc8cf6351}
     *     console.log(res);
     *   } else {
     *     // your failure code here to consume res
     *     console.log(res);
     *   }
     * })
     * .fail(function(err) {
     *   // your failure code here
     * })
     * .always(function() {
     *  // your on-complete code here as common for both success and failure
     * });
     *
     * @return {Object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
     *
     * */
    getSearchFields: function () {
      var request = {
        method: 'GET'
      };

      return this._ajax(request, 'webservices/get_search_fields.json');
    },


    /**
     * This method builds the address payload using the google  <code>autocomplete</code> instance once it's
     * <code>"place_changed"</code> event fires.
     * The returned payload can be utilized to consume <code>searchBySiteAddress()</code> API or you can fill form fields using SDK's autoFill API.
     *
     * @param {object} autocomplete - The google autocomplete instance used on your site, consuming it's <code>"place_changed"</code> event.
     *
     * @param {Object} [options]- The options object
     * @param {String} [options.autoFillContext] - A query selector of an element(s) inside which to look for inputs elements
     * having <code>data-ttb-field</code> attribute.
     * - For example: &lt;input type="text" <code>data-ttb-field="site_address"</code> />
     *
     * @example
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * // render your autocomplete component instance on your desired location
     * var autocompleteElement = document.getElementById('googleBuildAddress__autocomplete');
     * var autocomplete = new google.maps.places.Autocomplete(autocompleteElement, {types: ['geocode']});
     *
     * // when the user selects an address from the drop-down, populate the address fields in the form.
     * autocomplete.addListener('place_changed', function () {
     *
     *   // approach # 01 - auto-fill only - build up the address by auto-filling the form fields and leaves the submission logic.
     *   // <i>(Note: before submission, make sure you build <code>site_address</code> using <code>site_street_number</code> + ' ' + <code>site_route</code>)</> </i>
     *
     *   var options = {
     *     autoFillContext: '#searchBySiteAddress__form'
     *   };
     *   ttb.googleBuildAddress(autocomplete, options);
     *
     *   //--- approach # 01 - auto-fill only - ends ---
     *
     *   // -- OR --
     *
     *   // approach # 02 - direct submission - build up the address by getting the payload and proceed with <code>searchBySiteAddress()</code> to retrieve the result.
     *   var payload = ttb.googleBuildAddress(autocomplete);
     *   ttb.searchBySiteAddress(payload)
     *   .done(function(res) {
     *     if (res.response.status === 'OK') {
     *       // your success code here to consume res.response.data for any extra effort other than the auto-fill
     *       console.log(res.response.data);
     *     } else {
     *       // your failure code here to consume res.response.data
     *       console.log(res.response.data);
     *     }
     *   })
     *   .fail(function(err) {
     *     // your failure code here
     *   })
     *   .always(function() {
     *    // your on-complete code here as common for both success and failure
     *   });
     *   // --- approach # 02 - direct submission - ends ---
     *
     * });
     *
     *
     * @return {Object} address   built address payload object using google place components, having following fields against mentioned mapping.
     *
     * @return {Object} address.site_street_number Component Type: <code>"street_number"</code> | Name Type: <code>"short_name"</code>.
     * @return {Object} address.site_route         Component Type: <code>"route"</code> | Name Type: <code>"short_name"</code>.
     * @return {Object} address.site_address       *Built using <code>site_street_number</code> + ' ' + <code>site_route</code>.
     * @return {Object} address.site_city          Component Type: <code>"locality"</code> | Name Type: <code>"long_name"</code>.
     * @return {Object} address.site_state         Component Type: <code>"administrative_area_level_1"</code> | Name Type: <code>"short_name"</code>.
     * @return {Object} address.site_zip           Component Type: <code>"postal_code"</code> | Name Type: <code>"short_name"</code>.
     * @return {Object} address.county             Component Type: <code>"administrative_area_level_2"</code> | Name Type: <code>"short_name"</code>.
     * @return {Object} address.country            Component Type: <code>"country"</code> | Name Type: <code>"long_name"</code>.
     *
     * */
    googleBuildAddress: function (autocomplete, options) {
      var place, addressInfo, addressComp, addressType, addressValue;

      // our details object can be used for payload
      addressInfo = {};

      // place-components vs form-fields mapping
      var componentForm = {
        street_number: {field_name: 'site_street_number', name_type: 'short_name'},
        route: {field_name: 'site_route', name_type: 'short_name'},
        locality: {field_name: 'site_city', name_type: 'long_name'},
        administrative_area_level_1: {field_name: 'site_state', name_type: 'short_name'},
        administrative_area_level_2: {field_name: 'county', name_type: 'short_name'},
        postal_code: {field_name: 'site_zip', name_type: 'short_name'},
        country: {field_name: 'country', name_type: 'long_name'}
      };

      // get the current place info from google autocomplete instance
      place = autocomplete.getPlace();

      // iterate over each component available in selected place
      for (var i = 0, len = place.address_components.length; i < len; i++) {
        addressComp = place.address_components[i];
        addressType = addressComp.types[0];

        // check if the component is of our use e.g. "administrative_area_level_1"
        if (componentForm[addressType]) {
          addressValue = addressComp[componentForm[addressType].name_type];

          // fill the address info object
          addressInfo[componentForm[addressType].field_name] = addressValue;

          // check to auto-fill field if auto-fill-context option was provided.
          options.autoFillContext && this._fillField(options.autoFillContext, componentForm[addressType].field_name, addressValue);
        }
      }

      // Special field handling for "site_address"
      addressInfo.site_address = addressInfo.site_street_number + ' ' + addressInfo.site_route;
    }

  };

})();
