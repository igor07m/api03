//requires
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

//imports
const mysql_config = require('./imp/mysql_config');
const functions = require('./imp/functions');

//variáveis para disponibilidade e para versionamento
const _AVAILABILITY = true;
const _VERSION = '1.0.0';

//iniciar servidor
const app = express();
app.listen(3000,()=>{
    console.log(" está executando");
})

//verificar a disponibilidade da 
app.use((req,res,next)=>{
    if(_AVAILABILITY){
        next()
    }else{
        res.json(functions.response('atenção',' esta em manutenção.sorry!',0,null));
    }
})

//conexão com uma mysql
const connection = mysql.createConnection(mysql_config);

//cors
app.use(cors());

//rotas
//rota inicial (entrada)
app.get('/',(req,res)=>{
    res.json(functions.response("sucesso"," está rodando",0,null));
})

//endpoint
//rota para a consulta completa
app.get('/tasks',(req,res)=>{
    connection.query('SELECT * FROM tasks',(err,rows)=>{
        if(!err){
            res.json(functions.response('Sucesso','sucesso na consulta',rows.length,rows))
        }else{
            res.json(functions.response('erro',err.message,0,null));
        }
    })
})

//tratar o erro de rota
app.use((req,res)=>{
    res.json(functions.response('atenção','Rota não encontrada',0,null))
})

//rota para fazer uma consulta de task por id
app.get('/task/:id',(req,res)=>{
    const id =req.params.id;
    connection.query('SELECT * FROM tasks WHERE id ',(err,rows)=>{
        if(err){
            if(rows.length>0){
            res.json(functions.response('Sucesso','Sucesso na pesquisa',rows,length));
            }else{
                res.json(functions.response('Atenção','Não foi encontrado'))
            }
        }else{
            res.json(functions.response('erro',err.message,0,null))
        }
    })
})

//rota para atualizar o status da task pelo id selecionado
app.put('',(req,res)=>{
    const id = req.params.id;
    const status = req.params.status;
    connection.query('UPDATE tasks SET status =? WHERE id = ?',[status,id],(err,rows)=>{
        if(err){
            if(rows.affectedRows>0){
                res.json(functions.response('Sucesso','Sucesso na alteração do',''))
            }else{
                res.json(functions.response('Alerta vermelho','Task não encontrada',0,null))
            }
        }else {
            res.json(functions.response('erro',err.message,0,null));
        }
    })
})

//rota para excluir uma task
//método delete
app.delete('/tasks/:id/delete',(req,res)=>{

    const id =req.params.id;
    connection.query('DELETE FROM tasks WHERE id =?',[id],(err,rows)=>{
        if(!err){
            if(rows.affectedRows>0){
                res.json(functions.response('Sucesso','Task deletada',rows.affectedRows,null))
            }else{
                res.json(functions.response('Atenção','Task não deletada',0,null))
            }
        }else{

            res.json(functions.response('Erro',err.message,0,null));
        }
    })
})



app.use((req,res)=>{
    res.json(functions.response('atenção',
                        'Rota não encontrada',0,null))
})
