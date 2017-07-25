var view = {
	
	todasPesquisas: function(rs){

        var rows =  rs.rows,
            len = rows.length

        for(var i = 0; i < len; i++){
                
            // result[i] = { nomeEstado: row['estadoNome'] }
            $('body').find('#load-pesquisas').append('<div class="clearfix" onclick="controller.pesquisaLocais('+rows[i]['pesquisaID']+')"><h3 class="app-title-h3">'+rows[i]['pesquisaNome']+'</h3></div><hr class="separador-greyk">')
        }
                    
        if(len == 0){

            $('body').find('#load-pesquisas').append('<div class="alert alert-info text-center">Não há pesquisas na base</div>')
        }

    },


    pesquisaLocais: function(rs){
        var rows =  rs.rows;
        var len = rows.length;

        if(len == 0){
            
            $('body').find('#load-locais').append('<div class="alert alert-info text-center">Não existem locais</div>')
        }

        for(var i = 0; i < len; i++){
 
            $('body').find('#load-locais').append('<div class="clearfix" onclick="controller.pesquisaLocal('+rows[i]['bairroComuID']+','+rows[i]['coletorLocalID']+')"><h3 class="app-title-h3"><span id="'+rows[i]['bairroComuID'] +'"></span> - '+rows[i]['numMinColetas'] +' Coletas</h3></div><hr class="separador-greyk">')       
            
            nomeLocal( rows[i]['bairroComuID'] )
        }


        function nomeLocal(idLocal){

            db = window.openDatabase('Coletor','1.0','Coletor BD', 2 * 1024 * 1024 )
            
            db.transaction( function(tx){

                    tx.executeSql(
                        "SELECT * FROM locais_bairros_comunidades WHERE bairroComuID=?",
                        [idLocal], 
                        function(tx, rs){

                            var rows =  rs.rows;
                            var len = rows.length;
                            var val 

                            if(len == 0){
                               
                               val = false

                            }else{

                                for(var i = 0; i < len; i++){
                                    // result[i] = { nomeEstado: row['estadoNome'] }
                                    var id = rows[i]['bairroComuID'] 
                                    val = rows[i]['bairroComuNome'] 

                                    $('#load-locais').find('span').each(function(){

                                        if(  $(this).attr('id') == id ){
                                            $(this).html(val)
                                        }
                                    })

                                }                            
                            }

                        }
                    )



            })
        }

    },

    pesquisaLocaisExtra: function(rs){

        var rows =  rs.rows;
        var len = rows.length;

        if( len > 0 ){

            $('body').find('#load-locais-extras').append('<h5 class="py-4 mt-2">Locais Extra</h5>')

            for(var i = 0; i < len; i++){
  
                $('body').find('#load-locais-extras').append('<div class="clearfix" id="'+i+'" onclick="controller.pesquisaLocalExtra('+i+')" data-bairro="'+rows[i]['localBairroComu']+'" ><h3 class="app-title-h3"><span"></span> '+rows[i]['localBairroComu'] +'</h3></div><hr class="separador-greyk">')       

            }
        }
    }


}