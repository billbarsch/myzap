/*
https://pt.stackoverflow.com/questions/94956/m%C3%A1scara-para-cpf-e-cnpj-no-mesmo-campo
https://forum.imasters.com.br/topic/564834-jquery-mask-cpf-e-cnpj-no-mesmo-input/
https://jsfiddle.net/eL52cga5/406/
https://jsfiddle.net/chinnonsantos/k7ojrg84/
https://github.com/digitalBush/jquery.maskedinput
*/
$(document).ready(function () {

	$('.mask-hora').mask('99:99:99'); //HORA
	$('.mask-datahora').mask('99/99/9999 99:99'); //DATA E HORA
	$('.mask-agencia').mask('9999-9'); //AGECIA BANCARIA
	$('.mask-conta').mask('99.999-9'); //CONTA BANCARIA
	$('.mask-rg').mask('99.999.999-9'); //RG EX: 25.619.647-3
	$('.mask-cpf').mask('999.999.999-99'); //CPF
	$('.mask-cnpj').mask('99.999.999/9999-99'); //CNPJ
	$('.mask-vencimento').mask('99/99'); //VENCIMENTO
	$('.mask-numero').mask('9999999999999999'); //NUMERO
	$('.mask-estado').mask('AA'); //ESTADO
	$('.mask-cep').mask('99999-999'); //CEP
	$('.mask-data').mask('99/99/9999'); //DATA
	$('.mask-telefone').mask('(99) 9999-9999'); //FIXO
	$('.mask-cel').mask('(99) 9 9999-9999'); //CELULAR
	$('.mask-money').mask('000.000.000.000.000,00', {reverse: true});
    $('.mask-money2').mask("#.##0,00", {reverse: true});
    $('.mask-ip_address').mask('099.099.099.099');
    $('.mask-oab').mask('99.999');
	
	$('.mask-celular').focusout(function () {
		var phone, element;
		element = $(this);
		element.unmask();
		phone = element.val().replace(/\D/g, '');
		if (phone.length > 10) {
			element.mask('(99) 9 9999-9999');
		} else {
			element.mask('(99) 9999-99999');
		}
	}).trigger('focusout');

$(".mask-cpfcnpj").keydown(function(){
    try {
    	$(".mask-cpfcnpj").unmask();
    } catch (e) {}
    
    var tamanho = $(".mask-cpfcnpj").val().length;
	
    if(tamanho < 11){
        $(".mask-cpfcnpj").mask("999.999.999-99");
    } else if(tamanho >= 11){
        $(".mask-cpfcnpj").mask("99.999.999/9999-99");
    }
    
    // ajustando foco
    var elem = this;
    setTimeout(function(){
    	// mudo a posiÃ§Ã£o do seletor
    	elem.selectionStart = elem.selectionEnd = 10000;
    }, 0);
    // reaplico o valor para mudar o foco
    var currentValue = $(this).val();
    $(this).val('');
    $(this).val(currentValue);
});

});