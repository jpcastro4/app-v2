
var db = window.openDatabase('Coletor','1.0','Coletor BD', 2 * 1024 * 1024 )

var init = {

    // APP CONSTRUCTOR
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener("online", this.onlineConnection, false);
    },
    initialize: function() {
        this.bindEvents()
    },
    
    onDeviceReady: function() {
        
        var attachFastClick = Origami.fastclick
        attachFastClick(document.body)

        if(device.platform == 'browser'){

        	localStorage.setItem('deviceID', '711C3126-FF51-4B07-958B-FD30182BA043')
        }else{

        	localStorage.setItem('deviceID', device.uuid)
        }

        bd.iniciarBanco()

        init.getGeoLocation()


    },
    getGeoLocation: function(){
        navigator.geolocation.getCurrentPosition(
            function(position){
                            
            },
            function(error){

                init.gpsON()
            }
        )

    },
    gpsON: function(){

        cordova.plugins.diagnostic.isLocationEnabledSetting(function(enabled){
            if(enabled)
            {
                //alert("Location Setting is enabled");
            }
            else
            {
                cordova.plugins.diagnostic.switchToLocationSettings()
            }
        }, function(error){
            alert("The following error occurred: "+error);
        })
    },
    onlineConnection: function() {

        // var states = {};
        // states[Connection.UNKNOWN]  = 'Unknown connection';
        // states[Connection.ETHERNET] = 'Ethernet connection';
        // states[Connection.WIFI]     = 'WiFi connection';
        // states[Connection.CELL_2G]  = 'Cell 2G connection';
        // states[Connection.CELL_3G]  = 'Cell 3G connection';
        // states[Connection.CELL_4G]  = 'Cell 4G connection';
        // states[Connection.CELL]     = 'Cell generic connection';
        // states[Connection.NONE]     = 'No network connection';

        //return states
    },
 
    openPage: function(page,back=false){

        $('body').find('.page').addClass('hidden')

        $('#'+page).removeClass('hidden')
        
        if(back){
            $('#'+page+' .container-fluid').removeClass('slideInRight').addClass('slideInLeft')

        }else{
            $('#'+page+' .container-fluid').removeClass('slideInLeft').addClass('slideInRight')
        }

    },

    
    prevColeta: function(questaoFocus){

        var current = $('#coleta form fieldset#'+questaoFocus)
        var prev = current.prev()
        current.hide()
        prev.show()
    },

    nextColeta: function(questaoFocus){

        var current = $('#coleta form fieldset#'+questaoFocus)
        var next = current.next()

        var liberado = 0

        if( current.data('required') == true ){

            if( current.data('tipo') == 'radio'){

                current.find('input').each(function(index,rs){

                    var checked = $(this).prop('checked')

                    if( checked ){ 

                        liberado = liberado+1

                    }
                     
                })

            }

            if( current.data('tipo') == 'checkbox'){

                current.find('input').each(function(){

                    var checked = $(this).prop('checked')

                    if( checked ){

                        liberado = liberado+1
                    }

                     
                })

            }

            if( current.data('tipo') == 'espontanea'){

                current.find('textarea').each(function(){

                    var value = $(this).val()

                    if( value != '' ){

                        liberado = liberado+1
                    }
                     
                })

            }

            if( current.data('tipo') == 'mista'){

                current.find('textarea').each(function(){

                    var value = $(this).val()

                    if( value != '' ){

                        liberado = liberado+1

                    }else{

                        current.find('input').each(function(){

                            var checked = $(this).prop('checked')

                            if( checked ){

                                liberado = liberado+1
                            }

                        })
                    }

                })

            }
   
        }else{

            liberado = 1
            
        }


        if( liberado > 0 ){

            current.hide()
            next.show()
             
        }else{

            api.cAlert('Resposta obrigatória','error',5000)

        }

    },



    novaColeta: function(){

        function openColeta(confirm){

            if(confirm == 1){ 

                init.openColeta()
            }
        }

        navigator.notification.confirm('Deseja iniciar uma nova coleta', openColeta , ['Nova coleta'], ['Sim','Cancelar'])

    },

    openColeta: function(){

        $('#coleta #questoes').html('')

        var idPesquisa = localStorage.getItem('pesquisaID'),
            idBairroComu = localStorage.getItem('bairroComuID')


        db = window.openDatabase('Coletor','1.0','Coletor BD', 2 * 1024 * 1024 )
        
        db.transaction( function(tx){

            tx.executeSql("SELECT * FROM pesquisas WHERE pesquisaID=? ",
                [idPesquisa],
                function(tx, rs){

                    var rows =  rs.rows,
                        len = rows.length,
                        row = rows[0]

                        if(len == 0){

                            $('body').find('#load-pesquisas').append('<div class="alert alert-info text-center">Não há pesquisas na base</div>')

                        }else{

                            var dados = JSON.parse(row.dados),
                                total = dados.questoes.length

                            $('#coleta #questoes').append('<form></form>')
                            
                            var form = $('#coleta #questoes form')

                            var num = 1

                            $.each(dados.questoes,function(key,dado){

                                if(dado.questaoObrigatoria == 1 ){

                                    var obrigatoria = 'data-required="true"'
                                }else{
                                    var obrigatoria = 'data-required="false"'
                                }

                                if(dado.tipoResposta == 1){

                                    var tipo = 'radio'
                                }

                                if(dado.tipoResposta == 2){

                                    var tipo = 'checkbox'
                                }

                                if(dado.tipoResposta == 3){

                                    var tipo = 'espontanea'

                                }

                                if( dado.tipoResposta == 4 ){

                                    var tipo = 'mista'
                                }

                                if( key == 0 ){

                                    form.append('<fieldset ' +obrigatoria+ ' data-tipo="'+tipo+'" id="'+dado.questaoID+'" ><div class="p-4"><div class="coleta-questao">'+num+' - '+dado.questaoEnunciado+'</div><div id="respostas"></div> </div> <div class="row fixed-bottom nav-questoes"> <div class="btn-next col-12 spr-btn text-center" onclick="init.nextColeta('+dado.questaoID+')"> Próxima </div></div> </fieldset>')


                                }else{

                                
                                    form.append('<fieldset ' +obrigatoria+ ' data-tipo="'+tipo+'" id="'+dado.questaoID+'" ><div class="p-4"><div class="coleta-questao">'+num+' - '+dado.questaoEnunciado+'</div><div id="respostas"></div> </div> <div class="row fixed-bottom nav-questoes"> <div class="btn-prev col-6 spr-btn text-center" onclick="init.prevColeta('+dado.questaoID+')"> Anterior </div>   <div class="btn-next col-6 spr-btn text-center" onclick="init.nextColeta('+dado.questaoID+')"> Próxima </div></div> </fieldset>')

                                }
                                

                                if( tipo == 'radio' ){
                                    
                                    $.each(dado.alternativas, function(key,alternativa){

                                        $('#coleta #questoes form fieldset#'+dado.questaoID+' #respostas').append('<div class="form-group col-12"><label for="'+alternativa.respostaID+'" ><input type="'+tipo+'" class="option-input '+tipo+' " id="'+alternativa.respostaID+'" name="resposta['+dado.questaoID+']" value="'+alternativa.respostaID+'" />'+alternativa.resposta+'</label></div>')

                                    })
                                }

                                if( tipo == 'checkbox' ){
                                    
                                    $.each(dado.alternativas, function(key,alternativa){

                                        $('#coleta #questoes form fieldset#'+dado.questaoID+' #respostas').append('<div class="form-group col-12"><label for="'+alternativa.respostaID+'" ><input type="'+tipo+'" class="option-input '+tipo+' " id="'+alternativa.respostaID+'" name="resposta['+dado.questaoID+'][]" value="'+alternativa.respostaID+'" />'+alternativa.resposta+'</label></div>')

                                    })
                                }

                                if( tipo == 'espontanea' ){

                                    $('#coleta #questoes form fieldset#'+dado.questaoID+' #respostas').append('<div class="form-group col-12"><div class="label"> Escreva a reposta do entrevistado</div><textarea class="form-group col-12" name="resposta['+dado.questaoID+']"></textarea> </div>')
                                }

                                if( tipo == 'mista' ){

                                    $('#coleta #questoes form fieldset#'+dado.questaoID+' #respostas').append('<div class="form-group col-12"><div class="label"> Escreva a reposta do entrevistado</div><textarea class="form-group col-12" name="resposta['+dado.questaoID+']"></textarea> </div>')
                                    
                                    $.each(dado.alternativas, function(key,alternativa){

                                        $('#coleta #questoes form fieldset#'+dado.questaoID+' #respostas').append('<div class="form-group col-12"><label for="'+alternativa.respostaID+'" ><input type="radio" class="option-input radio " id="'+alternativa.respostaID+'" name="resposta['+dado.questaoID+']" value="'+alternativa.respostaID+'" />'+alternativa.resposta+'</label></div>')

                                    })

                                }

                                num++

                                
                            })
 
                            $('#coleta #questoes form fieldset .btn-next').last().text('Finalizar').attr('onclick','init.finalizarColeta()')

                            //form.append('<input type="hidden" name="pesquisaID" value="'+idPesquisa+'">')

                            // if( localStorage.getItem('coletorLocalID') ){
                            //     form.append('<input type="hidden" name="coletorLocalID" value="'+localStorage.getItem('coletorLocalID')+'">')
                            // }
                            
                            //form.append('<input type="hidden" name="bairroComuID" value="'+idBairroComu+'">')
                            form.append('<input type="hidden" name="timeInicio" value="'+$.now()+'">')

                        }
                  
                }, function(error){

                    api.cAlert('Erro ao coletar ','error',5000)

                    console.log('Erro executeSql openColeta : ' + error.message)
               
                })

        },function(error) {

            console.log('Erro transaction openColeta : ' + error.message)

        }, function() {

            init.openPage('coleta');
        })

    },

    finalizarColeta: function(){     
        
        var form = $('#coleta #questoes form') 
             

        navigator.geolocation.getCurrentPosition(
            function(position){

                lat  = position.coords.latitude
                long = position.coords.longitude

                form.each(function(){
                    $(this).append(' <input type="hidden" name="timeFim" value="'+$.now()+'">')
                    $(this).append(' <input name="rastreamento" value="'+lat+','+long+'">')

                })
                    
                api.cAlert('Coletando localização','error',5000)

                finalizaColeta()

            },
            function(error){

                console.log(error)

                alert('Erro ao solicitar a localizacao: '+ error.code+ '\n'+ 'message: ' + error.message + '\n')
            }
        )

        function finalizaColeta() {
            
            var idPesquisa = localStorage.getItem('pesquisaID'),
                idBairroComu = localStorage.getItem('bairroComuID'),
                idColetorLocal =  localStorage.getItem('coletorLocalID')

            var respostas =  JSON.stringify( form.serializeJSON() ) // classe do plugin serialize json
            
            db = window.openDatabase('Coletor','1.0','Coletor BD', 2 * 1024 * 1024 )

            if( idColetorLocal ){ //se é uma coleta normal
            
                db.transaction(
            
                function(tx){

                    tx.executeSql (
                        "INSERT INTO coletas VALUES (?,?,?,?)",
                        [idPesquisa,idColetorLocal,idBairroComu,respostas]
                    )
                   
                },function(error) {
                    console.log('Erro Inserir Coleta: ' + error.message)

                }, function() {
                    api.cAlert('Coleta realizada','success',2000)
                    model.pesquisaLocal()

                })



            }else{ //se é uma coleta extra

                db.transaction(
            
                function(tx){

                    tx.executeSql (
                        "INSERT INTO coletas_extras VALUES (?,?,?)",
                        [idPesquisa,idBairroComu,respostas]
                    )
                   
                },function(error) {
                    console.log('Erro Inserir Coleta: ' + error.message)

                }, function() {

                    model.pesquisaLocalExtra()

                })

            }
        }
    },
   
};
 

var registrationID = localStorage.getItem('registrationId')
var deviceID = localStorage.getItem('deviceID')



// // setupPush: function() {
//     //     console.log('calling push init');
//     //     var push = PushNotification.init({
//     //         "android": {
//     //             "senderID": "987461923211"
//     //         },
//     //         "browser": {},
//     //         "ios": {
//     //             "sound": true,
//     //             "vibration": true,
//     //             "badge": true
//     //         },
//     //         "windows": {}
//     //     });
//     //     console.log('after init');

//     //     push.on('registration', function(data) {
//     //         console.log('registration event: ' + data.registrationId);

//     //         var oldRegId = localStorage.getItem('registrationId');
//     //         if (oldRegId !== data.registrationId) {
//     //             // Save new registration ID
//     //             localStorage.setItem('registrationId', data.registrationId);
//     //             // Post registrationId to your app server as the value has changed
//     //         }

//     //         var parentElement = document.getElementById('registration');
//     //         var listeningElement = parentElement.querySelector('.waiting');
//     //         var receivedElement = parentElement.querySelector('.received');

//     //         listeningElement.setAttribute('style', 'display:none;');
//     //         receivedElement.setAttribute('style', 'display:block;');
//     //     });

//     //     push.on('error', function(e) {
//     //         console.log("push error = " + e.message);
//     //     });

//     //     push.on('notification', function(data) {
//     //         console.log('notification event');
//     //         navigator.notification.alert(
//     //             data.message,         // message
//     //             null,                 // callback
//     //             data.title,           // title
//     //             'Ok'                  // buttonName
//     //         );
//     //    });
//     // }





