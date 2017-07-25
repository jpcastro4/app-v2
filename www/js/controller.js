var controller = {
	
	todasPesquisas: function(){

		model.todasPesquisas()
	},

	pesquisaLocais: function(pesquisaID){

		localStorage.setItem('pesquisaID', pesquisaID )

		model.pesquisaLocais()
		model.pesquisaLocaisExtra()
	},

	pesquisaLocal: function(bairroComuID,coletorLocalID){

		localStorage.setItem('bairroComuID', bairroComuID )
		localStorage.setItem('coletorLocalID',coletorLocalID)

		model.pesquisaLocal()
	},


	// EXTRA

	addLocalExtra: function(){

        navigator.notification.prompt('Diga o nome bairro ou comunidade que deseja inserir', model.addLocalExtra , 'Novo local', ['Inserir','Cancelar'])

    },

	pesquisaLocalExtra: function(bairroRow){

		var bairro = $('#load-locais-extras div#'+bairroRow).attr('data-bairro')

		localStorage.setItem('bairroComuID', bairro )

		//remove os itens que não vão ser necessarios. Nessa caso o indicador que é uma pesquisa comum.
		localStorage.removeItem('coletorLocalID')

		model.pesquisaLocalExtra()
	},
	
}

var api = {

    cAlert: function(message,status,exitOut=false){

        var rand = 'c-alert-'+Math.floor((Math.random() * 10) + 1)

        $('.rot-c-alert').prepend('<div class="c-alert animated flipInX '+rand+' '+status+' "> '+message+' </div>')

        if(exitOut){
            setTimeout(function(){
                $('body').find('.'+rand ).removeClass('flipInX').addClass('flipOutX')

                    setTimeout(function(){
                        $('body').find('.'+rand ).remove();                
                    },exitOut )

            },exitOut)
        }else{
            setTimeout(function(){
                $('body').find('.'+rand ).removeClass('flipInX').addClass('flipOutX')

                    setTimeout(function(){
                        $('body').find('.'+rand ).remove();
                    },6000)

            },6000)            
        }

        if(status == 'error' ){
            navigator.vibrate(200)
        }

    },
    homologarColetor: function(){

        $.post('http://app.censuspesquisas.com.br/api/coletor/homologacao', {deviceID:device.uuid,registrationID:registrationID,coletorDados:device.platform+' '+device.manufacturer+' '+device.model} ,function(data){

            api.cAlert(data.message,'error',5000)
        })
        .fail(function(data){
            alert('Erro Homologar coletor : '+data.responseText ) 
        })
    },

    syncDownPesquisas: function(){

        var networkState = navigator.connection.type;

        if (networkState != Connection.NONE) {
        	
            model.pesquisasDown()
            
        }else{

            this.cAlert('Não há conexão de internet','error', 3000)

        }
    },

    syncUpLocal: function(){

        var networkState = navigator.connection.type;

        if (networkState != Connection.NONE) {
            
            model.locaisUp()
            
        }else{

            this.cAlert('Não há conexão de rede','error',5000)

        }
    },

}