
(function () {
  'use strict';

  /**
   * The main class for consuming TTB web services.
   * @class
   * @alias TTB
   *
   * @param {Object} config - The configuration info required
   * @param {string} config.partnerKey - The Partner-Key is a unique ID assigned to your account to be sent on every request.
   * @param {string} [config.baseURL="https://direct.api.titletoolbox.com/"] - The Base URL to be used for APIs calls
   *
   * @return {Object} ttb - The instance associated with the provide vertical info
   *
   *  @example
   * var ttb = new TTB({
   *   baseURL: 'https://direct.api.titletoolbox.com/',
   *   partnerKey: '{your partner key}',
   * });
   * */
  window.TTB = function (config) {
    var defaults;

    defaults = {
      baseURL: 'https://direct.api.titletoolbox.com/'
    };

    /** @type {Object} The configuration passed while instantiating main SDK class. */
    this.config = config;

    this.config.baseURL = this.config.baseURL || defaults.baseURL;

    console.log('TTB SDK initiated.');
  };

  /** @lends TTB.prototype */
  window.TTB.prototype = {

    /**
     * Triggers the request with all required headers, cookies, etc.
     * @private
     *
     * */
    _request: function (options) {

    },

    /**
     * Retrieves the `property_id` against given input address
     *
     * @param {string} address - The complete address for the property
     *
     * @return {Object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
     * */
    propertySearch: function (address) {
      console.log('propertySearch');
    },

    /**
     * Retrieves the PDF profile link against the given `property_id`
     *
     * @param {string} propertyId - The unique id returned for the address via `propertySearch()`
     *
     * @return {Object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
     * */
    getPropertyProfile: function (propertyId) {
      console.log('getPropertyProfile');
    }

  };

})();
