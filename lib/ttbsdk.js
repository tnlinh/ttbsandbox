
(function () {
  'use strict';

  var defaults;

  defaults = {
    baseURL: 'https://direct.api.titletoolbox.com/',
    debug: false
  };

  /**
   * The main class for consuming TTB web services.
   * @class
   * @alias TTB
   *
   * @param {Object} config - The configuration info required
   * @param {String} config.partnerKey - The Partner-Key is a unique ID assigned to your account to be sent on every request.
   * @param {String} [config.baseURL="https://direct.api.titletoolbox.com/"] - The Base URL to be used for APIs calls
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
   *  // With advanced configuration for custom URL, and logs for debug mode.
   *  var ttb = new TTB({
   *    partnerKey: '{your partner key}',
   *    baseURL: 'https://direct.api.titletoolbox.com/',
   *    debug: true
   *  });
   * */
  window.TTB = function (config) {

    /** @type {Object} The configuration passed while instantiating main SDK class. */
    this.config = config;

    // setup default baseURL
    this.config.baseURL = this.config.baseURL || defaults.baseURL;
    this.config.debug = this.config.debug || defaults.debug;

    console.log('TTB SDK instantiated.');
  };

  /** @lends TTB.prototype */
  window.TTB.prototype = {

    /**
     * Logs the arguments based on debug flag.
     * @private
     * */
    _logs: function(args) {
      this.config.debug && console.log.apply(console, args);
    },


    /**
     * Triggers the request with all required headers, cookies, etc.
     * @param options {Object} - The configuration to pass to $.ajax
     * @param endpoint {Object} - The endpoint of the webservices
     * @private
     *
     * */
    _ajax: function (options, endpoint) {
      var request;

      // take the full URL or build it up using baseURL and the given endpoint
      options.url = options.url || this.config.baseURL + endpoint;

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

          if (res.response.status === 'OK') {
            this._log([endpoint, ' : success : ', res]);
          } else {
            this._log([endpoint, ' : fail : ', res]);
          }

          return res;
        })
        .fail(function (err) {
          this._log([endpoint, ' : error : ', err]);
          return err;
        })
    },

    /**
     * This method is used to log the user in and maintain a session for the user throughout the App.
     *
     * @param {Object} payload - The payload object containing required info
     * @param {String} payload.username
     * @param {String} payload.password
     *
     * @return {Object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
     * */
    login: function (payload) {
      var request = {
        method: 'POST',
        data: JSON.stringify({
          TbUser: payload
        })
      };

      return this._ajax(request, 'webservices/login.json');
    },


    /**
     * Logs out from the TTB webservices server
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
     * @param {string} [payload.site_address]
     * @param {string} [payload.site_unit]
     * @param {string} [payload.site_city]
     * @param {string} [payload.site_state]
     * @param {string} [payload.site_street_number]
     * @param {string} [payload.site_route]
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
     * @param {String} [payload.output="link"] - Format of output, supported types are "link", etc.
     * @param {String} [payload.report_type="property_profile"] - The report type, supported types are "property_profile", etc.

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
     * @param {String} [payload.date_transfer(+/-)="{default-value}"]
     * @param {String} [payload.distance_in_km="{default-value}"]
     * @param {String} [payload.nbr_bath(+/-)="{default-value}"]
     * @param {String} [payload.nbr_bedrms(+/-)="{default-value}"]
     * @param {String} [payload.sqft(+/-)="{default-value}"]
     * @param {String} [payload.yr_blt(+/-)="{default-value}"]
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
     * @param {String} payload.property_id - Unique ID of the property
     * @param {String} payload.state_fips - State FIPS of the property
     *
     * @return {Object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
     * */
    propertyDetails: function (payload) {
      var request = {
        method: 'POST',
        data: JSON.stringify(payload)
      };

      return this._ajax(request, 'webservices/property_details.json');
    }

  };

})();
