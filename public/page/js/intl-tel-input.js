      $('document').ready(function() {
    //
    //---------------------------------------------------------------------------------------------------------------------------------------------------//
    //
      $("#numero").intlTelInput({
      // allowDropdown: false,
      // autoHideDialCode: false,
      // autoPlaceholder: "off",
      // dropdownContainer: document.body,
      // excludeCountries: ["us"],
      // formatOnDisplay: false,
      // geoIpLookup: function(callback) {
      //   $.get("http://ipinfo.io", function() {}, "jsonp").always(function(resp) {
      //     var countryCode = (resp && resp.country) ? resp.country : "";
      //     callback(countryCode);
      //   });
      // },
      // hiddenInput: "full_number",
      // initialCountry: "auto",
      // localizedCountries: { 'de': 'Deutschland' },
      // nationalMode: false,
      // onlyCountries: ['us', 'gb', 'ch', 'ca', 'do'],
      //placeholderNumberType: "MOBILE",
      preferredCountries: ['br'],
      //separateDialCode: true,
        });
        // update the hidden input on submit
       $("#numero").on( "keyup", function() {
          $("#phonefull").val('+' + $("#numero").intlTelInput("getSelectedCountryData").dialCode + $("#numero").val());
        });
    //
    //---------------------------------------------------------------------------------------------------------------------------------------------------//
    //
      $("#numeroimg").intlTelInput({
      // allowDropdown: false,
      // autoHideDialCode: false,
      // autoPlaceholder: "off",
      // dropdownContainer: document.body,
      // excludeCountries: ["us"],
      // formatOnDisplay: false,
      // geoIpLookup: function(callback) {
      //   $.get("http://ipinfo.io", function() {}, "jsonp").always(function(resp) {
      //     var countryCode = (resp && resp.country) ? resp.country : "";
      //     callback(countryCode);
      //   });
      // },
      // hiddenInput: "full_number",
      // initialCountry: "auto",
      // localizedCountries: { 'de': 'Deutschland' },
      // nationalMode: false,
      // onlyCountries: ['us', 'gb', 'ch', 'ca', 'do'],
      //placeholderNumberType: "MOBILE",
      preferredCountries: ['br'],
      //separateDialCode: true,
        });
        // update the hidden input on submit
       $("#numeroimg").on( "keyup", function() {
          $("#phonefullimg").val('+' + $("#numero").intlTelInput("getSelectedCountryData").dialCode + $("#numeroimg").val());
        });
    //
    //---------------------------------------------------------------------------------------------------------------------------------------------------//
    //
      });