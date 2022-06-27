module.exports.PegarData = PegarData;

function PegarData(){

  const hoje = new Date();
  const ontem = hoje - 1;

  const formato = {
    weeday: "long",
    month: "long",
    day: "numeric"
  }
  return hoje.toLocaleDateString("pt-BR", formato)
}

module.exports.PegarDia = PegarDia;

function PegarDia(){
  const hoje = new Date ()
  const ontem = hoje -1;

  const formato ={
    weekday: "long"
  }
  return hoje.toLocaleDateString("pt-BR", formato)
  return ontem.toLocaleDateString("pt-BR", formato)
}
