function SetSingIn(event){
    event.preventDefault();
    var params=core.uritojson($('#formRegistro').serialize());
    params.btn='#btnRegistrar';
    params.textb='Intentar nuevamente!';
    params.module='';
    params.method='singin';
    params.methodCB='singinRes';
    core.sendForm(params);
}
function GetLogin(event){
    event.preventDefault();
    var params=core.uritojson($('#formLogIn').serialize());
    params.btn='#btnSaveCliente';
    params.textb='Intentar nuevamente!';
    params.module='';
    params.method='login';
    params.methodCB='loginRes';
    core.sendForm(params);
}
function OpenLogIn(){
    $('.modalLayout').show();
    $('.modalLoading').hide();
    $('#contentFormLogIn').show();
}
function CloseLogIn(){
    $('.modalLayout').hide();
    $('.modalLoading').show();
    $('#contentFormLogIn').hide();
}
function loginRes(res){
    console.warn(res);	
    if(res.code==1){
        window.location.reload();
    } else {
        $('.modalLayout').show();
        $('#resLoginMsj').html(res.msj);
    }	
}
function singinRes(res){
    console.warn(res);	
    if(res.code==1){
        $('#formRegistro').html('<p>Hemos enviado un mensaje a su cuenta de correo, confirme su cuenta en el link que encontrara en el mensaje enviado para continuar, es importante que confirme mediante el link para terminar de activar la cuenta.</p>');
    } else {
        $('#formRegistro').html('<p>'+res.msj+'</p>'+'<p>Se han encontrado problemas para registrar estos datos, por favor contacta con soporte enviando un correo a soporte@nirvaria.com</p>');
    }	
}
function politicasPrivacidad(){
    window.location.reload();
}
core.initialized({
    sesion:'<?= json_encode($_SESSION["login"]); ?>',
    parametros:'<?= json_encode($_parametros); ?>',
    domain:'<?= _domain; ?>',
    titleWeb:'<?= _titleWeb; ?>'
});