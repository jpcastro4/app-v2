var model = {
	
    pesquisasDown: function(){

        api.cAlert('Recolhendo pesquisas','info',5000)

        $.get('http://app.censuspesquisas.com.br/api/coletor/pesquisas/'+localStorage.getItem('deviceID'), function(pesquisas){

            bd.insertUpdatePesquisa(pesquisas)
            model.baseLocais()

            // setTimeout( function(){

            //     controller.todasPesquisas()
            // },2000)

        },'json')
        .fail(function(data){            
            alert("Erro em pesquisasDown")
            console.log(data.responseText)
        })
    },
    baseLocais: function(){
        
        bd.limparBaseLocais()
        bd.iniciarBaseLocais()

        $.get('http://app.censuspesquisas.com.br/api/coletor/locais/'+localStorage.getItem('deviceID'), function(data){

            $.each(data, function(table_name,items){
                    
                bd.insertBaseLocais(table_name,items) 
            })

            api.cAlert('Sincronizando locais','success',1500)

        } )
        .fail(function(data){
            
            alert("Erro em baseLocais")
            console.log(data.responseText)
        })

    },
	todasPesquisas: function(){
        
        $('body').find('#load-pesquisas').html('')

        db = window.openDatabase('Coletor','1.0','Coletor BD', 2 * 1024 * 1024 )
        
        db.transaction( function(tx){

                tx.executeSql("SELECT * FROM pesquisas", [], function(tx, rs){

                    view.todasPesquisas(rs)
                  
                }, function(error){
                    
                    console.log('Erro View todasPesquisas : ' + error.message)
                     
                })

        },function(error) {
            console.log('Erro : ' + error.message)

        }, function() {
            
        })
    },

    pesquisaLocais: function(){

        var pesquisaID = localStorage.getItem('pesquisaID')

        $('body').find('#load-locais').html('')

        db = window.openDatabase('Coletor','1.0','Coletor BD', 2 * 1024 * 1024 )
        
        db.transaction( function(tx){

                tx.executeSql(
                    "SELECT * FROM pesquisas_locais WHERE pesquisaID=?",
                    [pesquisaID], 
                    function(tx, rs){

                        view.pesquisaLocais(rs)
                  
                    },
                    function(tx,error){

                        console.log('Erro aqui : ' + error.message)

                    }
                )

        },function(error) {
            console.log('Erro ali: ' + error.message)

        }, function() {

            init.openPage('locais')
            
            
        })
        
    },

    addLocalExtra: function(rs){

        if(rs.buttonIndex == 1){ 

                var novoBairro = rs.input1,
                    pesquisaID = localStorage.getItem('pesquisaID')


                db = window.openDatabase('Coletor','1.0','Coletor BD', 2 * 1024 * 1024 )
            
                db.transaction( function(tx){

                    tx.executeSql (
                        "INSERT INTO locais_extras VALUES (?,?)",
                        [ pesquisaID,novoBairro], 

                        function(tx,rs){

                            if( rs.rows.rowsAffected == 1 ){

                                 api.cAlert(novoBairro+' inserido na pesquisa','success',3000)
                            }
                        },
                        function(text,error){

                            console.log('Erro executeSql addLocalExtra : ' + error.message)

                        }

                    )

                },function(error) {
                
                console.log('Erro transaction addLocalExtra : ' + error.message)

                }, function(){ 

                    controller.pesquisaLocais( localStorage.getItem('pesquisaID') )
                    
                })

            }
    },

    pesquisaLocaisExtra: function(){

        var pesquisaID = localStorage.getItem('pesquisaID')

        $('body').find('#load-locais-extras').html('')

        db = window.openDatabase('Coletor','1.0','Coletor BD', 2 * 1024 * 1024 )
        
        db.transaction( function(tx){

                tx.executeSql(
                    "SELECT * FROM locais_extras WHERE pesquisaID=?",
                    [pesquisaID], 
                    function(tx, rs){

                        view.pesquisaLocaisExtra(rs)
                  
                    },
                    function(tx,error){

                        console.log('Erro aqui : ' + error.message)

                    }
                )

        },function(error) {
            console.log('Erro ali: ' + error.message)

        }, function() {

        })
    },



    pesquisaLocal: function(){

        var idPesquisa = localStorage.getItem('pesquisaID'),
            idBairro = localStorage.getItem('bairroComuID'),
            coletorLocalID = localStorage.getItem('coletorLocalID')


        db = window.openDatabase('Coletor','1.0','Coletor BD', 2 * 1024 * 1024 )
        
        db.transaction( function(tx){

                tx.executeSql(
                    "SELECT * FROM coletas WHERE pesquisaID=? AND bairroComuID=?",
                    [idPesquisa,idBairro], 
                    function(tx, rs){

                        var rows =  rs.rows;
                        var len = rows.length;

                        $('#local .numcoletas').text(len)

                    },
                    function(tx,error){

                        console.log('Erro executeSql getLoadLocal : ' + error.message)
                    }
                )

        },function(error) {
            api.cAlert('Erro','error',5000)
            console.log('Erro transaction getLoadLocal : ' + error.message)

        }, function() {
            
            init.openPage('local')
            
        })

    },

    pesquisaLocalExtra: function(){

        var idPesquisa = localStorage.getItem('pesquisaID'),
            bairro = localStorage.getItem('bairroComuID')

        db = window.openDatabase('Coletor','1.0','Coletor BD', 2 * 1024 * 1024 )
        
        db.transaction( function(tx){

                tx.executeSql(
                    "SELECT * FROM coletas_extras WHERE pesquisaID=? AND localBairroComu=?",
                    [idPesquisa,bairro], 
                    function(tx, rs){

                        var rows =  rs.rows;
                        var len = rows.length;

                        $('#local .numcoletas').text(len)

                    },
                    function(tx,error){

                        console.log('Erro executeSql getLoadLocal : ' + error.message)
                    }
                )

        },function(error) {
            api.cAlert('Erro','error',5000)
            console.log('Erro transaction getLoadLocal : ' + error.message)

        }, function() {
            api.cAlert('Coleta realizada','success',2000)
            init.openPage('local')
            
        })



    },

    locaisUp: function(){

        var idPesquisa = localStorage.getItem('pesquisaID'),
            bairro = localStorage.getItem('bairroComuID'),
            idColetorLocal =  localStorage.getItem('coletorLocalID')

        db = window.openDatabase('Coletor','1.0','Coletor BD', 2 * 1024 * 1024 )
        
        // db.transaction( function(tx){
                // tx.executeSql(
                //     "SELECT * FROM coletas WHERE pesquisaID=?",
                //     [idPesquisa], 
                //     function(tx, rs){

                //         var rows =  rs.rows;
                //         var len = rows.length;

                //         if( len > 0 ){

                //             localStorage.setItem('pesquisas', JSON.stringify( rows ) ) 
                //         }   

                //         //
                //     },
                //     function(tx,error){

                //         console.log('Erro executeSql getLoadLocal : ' + error.message)
                //     }
                // )
                
        // },function(error) {

        //     api.cAlert('Erro','error',5000)
        //     console.log('Erro transaction localUp : ' + error.message)

        // }, function() {


        // })
 

        db.transaction( function(tx){
            tx.executeSql(
                    "SELECT * FROM coletas WHERE pesquisaID=?",
                    [idPesquisa], 
                    function(tx, rs){

                        var rows =  rs.rows;
                        var len = rows.length;

                        if( len > 0 ){
                        	
                            localStorage.setItem('pesquisas', JSON.stringify( rows ) ) 

                        	// var arrayRows = Array.from(rows)

                        	// $.each(rows, function(index,item){



                        	// 	var novo = JSON.parse(rows[index].coletaRespostas) 

                        	// 	var row = Array.from(rows[index])

                        	// 	row.push({coletaRespostas:novo})

                        	// 	arrayRows.push( Array.from(rows[index]) )

                        		 
                        	// })

                        	// console.log(arrayRows)

                            //localStorage.setItem('pesquisas', JSON.stringify( rows ) ) 
                        }   

                        //
                    },
                    function(tx,error){

                        console.log('Erro executeSql getLoadLocal : ' + error.message)
                    }
                )

            tx.executeSql(
                    "SELECT * FROM coletas_extras WHERE pesquisaID=?",
                    [idPesquisa], 
                    function(tx, rs){

                        var rows =  rs.rows;
                        var len = rows.length;

                        if( len > 0 ){

                            localStorage.setItem('pesquisasExtra', JSON.stringify( rows ) ) 
                        }
                    },
                    function(tx,error){

                        console.log('Erro executeSql getLoadLocal : ' + error.message)
                    }
                )

            

        },function(error) {
            api.cAlert('Erro','error',5000)
            console.log('Erro transaction localUp Extra : ' + error.message)

        }, function() {
            
            model.executaLocaisUp()
        })


        
 
        
    },

    executaLocaisUp: function(){

        var idPesquisa = localStorage.getItem('pesquisaID')

        var dados = localStorage.getItem('pesquisas')
        var extra = localStorage.getItem('pesquisasExtra')

        var campos  = {deviceID:deviceID,pesquisaID:idPesquisa,dados:dados,extra:extra}
 

            $.post('http://app.censuspesquisas.com.br/api/coletor/syncup/'+deviceID, campos , function(data){

                if(data.status == false ){

                    api.cAlert('Erro '+data.message ,'error',5000)
                }

                if(data.status == true ){

                    api.cAlert( data.message ,'success',5000)
                    
                }

                console.log(data)

            })
            .fail(function(data){            
                api.cAlert('Erro em localUp -> up','error',5000)
                console.log(data.responseText)
            })
    },

}

var bd = {

    iniciarBanco: function(){
        
        
        this.iniciarBaseColetas()
        this.iniciarBaseLocais()

        controller.todasPesquisas()
        api.cAlert('Banco iniciado','success', 3000)
    },

    iniciarBaseLocais: function(){

        db.transaction(

        function(tx){

            tx.executeSql('CREATE TABLE IF NOT EXISTS locais_estados (estadoID integer, estadoNome text) ')
            tx.executeSql('CREATE TABLE IF NOT EXISTS locais_cidades (cidadeID integer, cidadeNome text) ')
            tx.executeSql('CREATE TABLE IF NOT EXISTS locais_bairros_comunidades (bairroComuID integer, bairroComuNome text, bairroComuZona integer)')

        },function(error){
            alert('Erro: ' + error.message)
            return false

        }, function() {


        })
    },

    iniciarBaseColetas: function(){

        db.transaction(

        function(tx){

            tx.executeSql('CREATE TABLE IF NOT EXISTS pesquisas(pesquisaID integer, pesquisaNome text, dados longtext ) ') 
            tx.executeSql('CREATE TABLE IF NOT EXISTS pesquisas_locais(pesquisaID integer, estadoID integer, cidadeID integer, bairroComuID text, coletorLocalID integer , numMinColetas integer  ) ')
            tx.executeSql('CREATE TABLE IF NOT EXISTS coletas(pesquisaID integer, coletorLocalID integer, bairroComuID integer,  coletaRespostas text) ')

            tx.executeSql('CREATE TABLE IF NOT EXISTS locais_extras(pesquisaID integer, localBairroComu text ) ')
            tx.executeSql('CREATE TABLE IF NOT EXISTS coletas_extras(pesquisaID integer, localBairroComu text, coletaRespostas text) ')
            
        },function(error) {
            alert('Erro: ' + error.message)

        }, function() {

        })

    },

    limparBaseLocais: function(){

        db.transaction(
        //faz o drop nas tabela ja existente pra salvar a nova
        function(tx){

            tx.executeSql ("DROP TABLE IF EXISTS locais_estados", [],
                    function(tx, result) {
                         
                    },
                    function(error){
                        alert('Error occurred while droping the table.')
                    }
                
                ) 

                tx.executeSql ("DROP TABLE IF EXISTS locais_cidades", [],
                    function(tx, result) {
                         
                    },
                    function(error){
                        alert('Error occurred while droping the table.')
                    }
                
                ) 

                tx.executeSql ("DROP TABLE IF EXISTS locais_bairros_comunidades", [],
                    function(tx, result) {
                         
                    },
                    function(error){
                        alert('Error occurred while droping the table.')
                    }
                
                )
        },function(error) {
            console.log('Erro Database: ' + error.message)

        }, function() {

        })
    },
    insertBaseLocais: function(table,fields){
        db = window.openDatabase('Coletor','1.0','Coletor BD', 2 * 1024 * 1024 )

        db.transaction(
        //faz o drop nas tabela ja existente pra salvar a nova
        function(tx){

            if( table == 'locais_estados'){

                for (var i=0; i < fields.length; i++) {

                    tx.executeSql ("INSERT INTO locais_estados VALUES (?,?)", [fields[i].estadoID,fields[i].estadoNome] );
                }

            }

             if( table == 'locais_cidades'){

                for (var i=0; i < fields.length; i++) {

                    tx.executeSql ("INSERT INTO locais_cidades VALUES (?,?)", [fields[i].cidadeID,fields[i].cidadeNome] );
                }

            }

             if( table == 'locais_bairros_comunidades'){

                for (var i=0; i < fields.length; i++) {

                    tx.executeSql ("INSERT INTO locais_bairros_comunidades VALUES (?,?,?)", [fields[i].bairroComuID,fields[i].bairroComuNome,fields[i].bairroComuZona] );
                }

            }        
           
           
        },function(error) {
            console.log('Erro Database: ' + error.message)

        }, function() {

        })
    },

    insertPesquisa: function(pesquisa){
        
        var dados = JSON.stringify(pesquisa)

        db.transaction( function(tx){

            tx.executeSql (
                "INSERT INTO pesquisas VALUES (?,?,?)",
                [pesquisa.pesquisaID, pesquisa.pesquisaNome, dados],

                function(tx, res){

                    pesquisa.locais.forEach(function(local){
                        tx.executeSql (
                            "INSERT INTO pesquisas_locais VALUES (?,?,?,?,?,?)",
                            [pesquisa.pesquisaID,local.estadoID,local.cidadeID,local.bairroComuID,local.coletorLocalID,local.numMinColetas] 
                        )
                    })

                },
                function(tx,error){
                    console.log('Erro na sql '+ error.message )
                }
            ) 

        }, function(error){
            console.log('Erro init insertPesquisa '+ error.message )

        },function(){
            controller.todasPesquisas()
        })
    },
    
    insertUpdatePesquisa: function(pesquisas){
        
        db = window.openDatabase('Coletor','1.0','Coletor BD', 2 * 1024 * 1024 )

        db.transaction( function(tx){

            pesquisas.forEach(function(pesquisa){ //Faz o laço nas pesquisas que vem com status EM CAMPO
                var dados = JSON.stringify(pesquisa) 

                tx.executeSql(
                    "UPDATE pesquisas SET pesquisaNome=?, dados=? WHERE pesquisaID =?",
                    [pesquisa.pesquisaNome, dados, pesquisa.pesquisaID ],

                    function(tx, res) {
 
                         if(res.rowsAffected == 0 ){
                            
                            bd.insertPesquisa(pesquisa)

                        }else{

                            tx.executeSql ("DELETE FROM pesquisas_locais WHERE pesquisaID=?", [pesquisa.pesquisaID] )
                            pesquisa.locais.forEach(function(local){
 
                                tx.executeSql (
                                    "INSERT INTO pesquisas_locais VALUES (?,?,?,?,?,?)",
                                    [pesquisa.pesquisaID,local.estadoID,local.cidadeID,local.bairroComuID,local.coletorLocalID,local.numMinColetas] 
                                )
                            })
                        }
                    },

                    function(tx, error) {
                        console.log('UPDATE error: ' + error.message);
                    }
                )

            })
           
        },function(error) {

            console.log('insertUpdatePesquisa(): Erro ao inserir pesquisa - Database: ' + error.message)

        },function() {
            controller.todasPesquisas()
            navigator.vibrate(300)
        })
    }

};