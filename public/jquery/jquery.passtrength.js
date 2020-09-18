/*
 *  passtrength - v1.0.0
 *  passtrength
 *  passtrength
 *
 *  Made by @adrisorribas
 *  Under MIT License
 */
;(function($, window, document, undefined) {

  var pluginName = "passtrength",
      defaults = {
        minChars: 8,
        passwordToggle: true,
        tooltip: true,
        textVeryWeak: "Muito Fraca",
        textWeak: "Fraca",
        textMedium: "Média",
        textStrong: "Forte",
        textVeryStrong: "Muito forte",
        eyeImgOpen : '<i class="fas fa-eye"></i>',
        eyeImgClose : '<i class="fas fa-eye-slash"></i>'
      };

  function Plugin(element, options){
    this.element = element;
    this.$elem = $(this.element);
    this.options = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    _this      = this;
    this.init();
  }

  Plugin.prototype = {
    init: function(){
      var _this    = this,
          meter    = jQuery("<div/>", {class: "passtrengthMeter"}),
          tooltip = jQuery("<div/>", {class: "tooltip", text: "Mínimo " + this.options.minChars + " caracter"});

      meter.insertAfter(this.element);
      $(this.element).appendTo(meter);

      if(this.options.tooltip){
        tooltip.appendTo(meter);
        var tooltipWidth = tooltip.outerWidth() / 2;
        tooltip.css("margin-left", -tooltipWidth);
      }

      this.$elem.bind("keyup keydown", function() {
          value = $(this).val();
          _this.check(value);
      });

      if(this.options.passwordToggle){
        _this.togglePassword();
      }

    },

    check: function(value){
      var secureTotal       = 0,
          chars             = 0,
          capital_letter    = 0,
          lowercase_letter  = 0,
          numbers           = 0,
          special           = 0;
          lowerCase    = new RegExp("[a-z]"),
          upperCase    = new RegExp("[A-Z]"),
          numbers      = new RegExp("[0-9]"),
          specialchars = new RegExp("([!,%,&,@,#,$,^,*,?,_,~])");

      if(value.length >= this.options.minChars){
        chars = 1;
      }else{
        chars = -1;
      }
      if(value.match(upperCase)){
        capital_letter = 1;
      }else{
        capital_letter = 0;
      }
      if(value.match(lowerCase)){
        lowercase_letter = 1;
      }else{
        lowercase_letter = 0;
      }
      if(value.match(numbers)){
        numbers = 1;
      }else{
        numbers = 0;
      }
      if(value.match(specialchars)){
        special = 1;
      }else{
        special = 0;
      }

      secureTotal = chars + capital_letter + lowercase_letter + numbers + special;
      securePercentage = (secureTotal / 5) * 100;

      this.addStatus(securePercentage);

    },

    addStatus: function(percentage){
      var status = "",
          text = "Mínimo " + this.options.minChars + " caracter",
          meter = $(this.element).closest(".passtrengthMeter"),
          tooltip = meter.find(".tooltip");

      meter.attr("class", "passtrengthMeter");

      if(percentage >= 0){
        meter.attr("class", "passtrengthMeter");
        status = "very-weak";
        text = this.options.textVeryWeak;
        console.log('Porcentagem: '+percentage);
      }
      if(percentage >= 25){
        meter.attr("class", "passtrengthMeter");
        status = "weak";
        text = this.options.textWeak;
        console.log('Porcentagem: '+percentage);
      }
      if(percentage >= 35){
        meter.attr("class", "passtrengthMeter");
        status = "medium";
        text = this.options.textMedium;
        console.log('Porcentagem: '+percentage);
      }
      if(percentage >= 65){
        meter.attr("class", "passtrengthMeter");
        status = "strong";
        text = this.options.textStrong;
        console.log('Porcentagem: '+percentage);
      }
      if(percentage >= 95){
        meter.attr("class", "passtrengthMeter");
        status = "very-strong";
        text = this.options.textVeryStrong;
        console.log('Porcentagem: '+percentage);
      }
      meter.addClass(status);
      if(this.options.tooltip){
        tooltip.text(text);
      }
    },

    togglePassword: function(){
      var buttonShow = jQuery("<span/>", {class: "showPassword", html: ""+ this.options.eyeImgOpen +""}),
          input      =  jQuery("<input/>", {type: "text"}),
          passwordInput      = this;

      buttonShow.appendTo($(this.element).closest(".passtrengthMeter"));
      input.appendTo($(this.element).closest(".passtrengthMeter")).hide();

      $(this.element).bind("keyup keydown", function() {
          input.val($(passwordInput.element).val());
      });

      input.bind("keyup keydown", function() {
          $(passwordInput.element).val(input.val());
          value = $(this).val();
          _this.check(value);
      });

      $(document).on("click", ".showPassword", function() {
        buttonShow.toggleClass("active");
        input.toggle();
        $(passwordInput.element).toggle();
      });
    }
  };

  $.fn[pluginName] = function(options) {
      return this.each(function() {
          if (!$.data(this, "plugin_" + pluginName)) {
              $.data(this, "plugin_" + pluginName, new Plugin(this, options));
          }
      });
  };

})(jQuery, window, document);
