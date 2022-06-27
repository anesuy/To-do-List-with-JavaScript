const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const date = require(__dirname + "/date.js");

const app = express();
const hoje = date.PegarData();


mongoose.connect("mongodb+srv://anesuy:hsmsuyanej1234@cluster0.owvqj.mongodb.net/todolistDB", {useNewUrlParser:true});

const itensSchema = {
  name: String
};

//Creating a model: give the SINGULAR name, don't forget.

const Item = mongoose.model("Item", itensSchema );


const listaSchema = {
  name: String,
  items: [itensSchema]
};
const Lista = mongoose.model("Lista", listaSchema);

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static('public'));

app.get("/", function(request, response){

const hoje = date.PegarData();

  Item.find({}, function(err, ItensLista){
    if (!err){
      response.render("list", {tituloLista: hoje, novosItens: ItensLista});
    } else{
      console.log("There's an error findind your itens :/");
    }
});

});

app.post("/", function(request, response){

const itemName = request.body.novoItem;
const listName = request.body.list;

 const item = new Item({
   name: itemName
 });

if (listName === hoje)   {
   item.save();
   console.log(listName);
      console.log(hoje);
      response.redirect("/");

 } else {
   Lista.findOne({name: listName}, function(err, mostrarItens){
    mostrarItens.itens.push(item);
    mostrarItens.save();
    response.redirect("/" + listName);});
 }
});

app.post("/delete", function(request, response){
  const checkedItemId = request.body.delete_button;
  const listName = request.body.listName;

  if (listName === (hoje)) {
    Item.findByIdAndRemove(checkedItemId, function(err){
        if (!err) {
          console.log("Successfully deleted checked item.");
          response.redirect("/");
        }
      });
    } else {
      console.log("not today");
      console.log(listName);
      console.log(hoje);
      Lista.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, ItensLista){
        if (!err){
          response.redirect("/" + listName);
        }
      });
    }

});

app.get("/:nome_route", function(req, res){
  const nome_route_const = (req.params.nome_route);

  Lista.findOne({name: nome_route_const}, function(err, ItensLista){
    if (!err){
      if (!ItensLista){
        //Create a new list
        const list = new Lista({
          name: nome_route_const,
          items: []
        });
        list.save();
        res.redirect("/" + nome_route_const);
      } else {
        //Show an existing list

        res.render("list", {tituloLista: ItensLista.name, novosItens: ItensLista.items});
      }
    }
});
});

let port = process.env.PORT;
if (port == null || port == ""){
  port = 3000;
}

app.listen(port, function(){
  console.log("Server has started");
});
