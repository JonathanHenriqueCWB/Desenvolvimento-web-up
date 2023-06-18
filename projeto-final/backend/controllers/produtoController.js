const {Produto: ProdutoModel} = require("../models/Produto")
var fs = require('fs');
var path = require('path')
const {Categoria : CategoriaModel} = require('../models/Categoria')


const produtoController = {
    update: async(req, res) => {
        try {
            const response = await ProdutoModel.findById(req.body._id).then(p => {        
                p.codigo = req.body.codigo
                p.nome = req.body.nome
                p.foto = req.body.foto
                p.descricao = req.body.descricao
                p.preco = req.body.preco
                p.animal = req.body.animal
                p.categoria = req.body.categoria
                p.save().then(() => {
                    res.status(200).json({response, msg: "Produto alterado com sucesso"})
                })
            }).catch(err => {
                res.json({msg: 'Erro ao alterar produto' + err})
            })            
        } catch (error) {
            console.log(error)
        }
    },

   delete: async(req, res) => {
       try {
           const response = await ProdutoModel.findById(req.params.id)
           if(!response){
               res.status(404).json({msg: "Produto não encontrado"})
               return
           }

           const deleteResponse = await ProdutoModel.findByIdAndDelete({_id: req.params.id})
           res.status(200).json({deleteResponse, msg: "Produto excluido com sucesso"})
       } catch (error) {
           console.log(error)
       }
   },

   read: async(req, res) => {
       try {
           const response = await ProdutoModel.find({codigo: req.params.codigo})
           if(!response){
               res.status(404).json({msg: "Produto não encontrado"})
               return
           }
           res.json(response)
       } catch (error) {
           console.log(error)
       }
   },

   readAll: async(req, res) => {
       try {
           const response = await ProdutoModel.find()
           res.status(200).json(response)
       } catch(error){
           console.log(error)
       }
   },

   create: async(req, res) => {
       try {
            const categoria = await CategoriaModel.find({codigo: req.body.codigoCategoria})

            const produto = {
                codigo: req.body.codigo,
                nome: req.body.nome,
                descricao: req.body.descricao,
                preco: req.body.preco,
                categoria: categoria,
                animal: req.body.animal,
                foto: {
                    data: fs.readFileSync(path.join(__dirname + './../uploads/' + req.file.filename)),
                    contentType: 'image/png'
                }
            }
            
            // Arrumar
            /*
            if(!produto.categoria){
                res.status(201).json({ msg: "Categoria inexistente"})
                return
            }else {
                res.status(404).json({produto, msg: "Produto salvo com sucesso"})
                return
            }
            */

           const response = await ProdutoModel.create(produto)
           res.status(201).json({response, msg: "Produto cadastrado com sucesso"})

       } catch (error) {
           console.log(error)
       }
   }
}

module.exports = produtoController