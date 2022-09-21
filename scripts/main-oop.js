const pratos = [
  {
    nome: "Estrombelete de Frango",
    imagem: "img/frango_yin_yang.png",
    descricao: "Um pouco de batata, um pouco de salada",
    preco: 14.9,
  },
  {
    nome: "Asa de Boi",
    imagem: "img/frango_yin_yang.png",
    descricao: "Com molho shoyu",
    preco: 14.9,
  },
  {
    nome: "Carne de Monstro",
    imagem: "img/frango_yin_yang.png",
    descricao: "Com batata assada e farofa",
    preco: 14.9,
  },
];

const bebidas = [
  {
    nome: "Coquinha gelada",
    imagem: "img/coquinha_gelada.png",
    descricao: "Lata 350ml",
    preco: 4.9,
  },
  {
    nome: "Caldo de Cana",
    imagem: "img/coquinha_gelada.png",
    descricao: "Copo 600ml",
    preco: 4.9,
  },
  {
    nome: "Corote Gelado",
    imagem: "img/coquinha_gelada.png",
    descricao: "Garrafa 400ml",
    preco: 4.9,
  },
];

const sobremesas = [
  {
    nome: "Pudim",
    imagem: "img/pudim.png",
    descricao: "Gosto de doce de leite",
    preco: 7.9,
  },
  {
    nome: "Flam",
    imagem: "img/pudim.png",
    descricao: "Gosto de chocolate",
    preco: 7.9,
  },
  {
    nome: "Brigadeiro",
    imagem: "img/pudim.png",
    descricao: "3 unidades",
    preco: 7.9,
  },
];

class Item {
  constructor(nome, imagem, descricao, preco, type, selectFunction) {
    this.nome = nome;
    this.imagem = imagem;
    this.descricao = descricao;
    this.preco = preco;
    this.type = type;
    this.element = this.getItemView("click", selectFunction);
  }

  getItemView(event, selectFunction) {
    const view = document.createElement("div");
    view.classList.add("opcao");
    view.addEventListener(event, () => {
      selectFunction(view, this.nome, this.preco, this.type);
    });
    view.innerHTML = `
            <img src="${this.imagem}" />
            <div class="titulo">${this.nome}</div>
            <div class="descricao">${this.descricao}</div>
            <div class="fundo">
                <div class="preco">R$ ${this.preco.toFixed(2)}</div>
                <div class="check">
                    <ion-icon name="checkmark-circle"></ion-icon>
                </div>
            </div>
        `;

    return view;
  }
}

class Pedido {
  constructor(btnPedir, btnConfirmar, btnCancelar, telefone) {
    this.prato = null;
    this.bebida = null;
    this.sobremesa = null;
    this.telefone = telefone;
    this.btnPedir = btnPedir;
    this.btnConfirmar = btnConfirmar;
    this.btnCancelar = btnCancelar;

    this.inicialize();
  }

  inicialize() {
    this.btnConfirmar.addEventListener("click", () => {
      this.enviarZap();
    });

    this.btnCancelar.addEventListener("click", () => {
      this.cancelarPedido();
    });

    btnPedir.addEventListener("click", () => {
      this.confirmarPedido();
    });
  }

  selectItem = (elemento, nome, preco, type) => {
    const selecionado = document.querySelector(`.${type} .selecionado`);
    if (selecionado !== null) {
      selecionado.classList.remove("selecionado");
    }
    elemento.classList.add("selecionado");

    this[type] = { nome, preco };
    this.verificarPedido();
  };

  verificarPedido() {
    if (this.prato && this.bebida && this.sobremesa) {
      this.btnPedir.classList.add("ativo");
      this.btnPedir.disabled = false;
      this.btnPedir.innerHTML = "Fazer pedido";
    }
  }

  getPrecoTotal() {
    return this.prato.preco + this.bebida.preco + this.sobremesa.preco;
  }

  confirmarPedido() {
    const modal = document.querySelector(".overlay");
    modal.classList.remove("escondido");

    document.querySelector(".confirmar-pedido .prato .nome").innerHTML =
      this.prato.nome;
    document.querySelector(".confirmar-pedido .prato .preco").innerHTML =
      this.prato.preco.toFixed(2);

    document.querySelector(".confirmar-pedido .bebida .nome").innerHTML =
      this.bebida.nome;
    document.querySelector(".confirmar-pedido .bebida .preco").innerHTML =
      this.bebida.preco.toFixed(2);

    document.querySelector(".confirmar-pedido .sobremesa .nome").innerHTML =
      this.sobremesa.nome;
    document.querySelector(".confirmar-pedido .sobremesa .preco").innerHTML =
      this.sobremesa.preco.toFixed(2);

    document.querySelector(".confirmar-pedido .total .preco").innerHTML =
      this.getPrecoTotal().toFixed(2);
  }

  cancelarPedido() {
    const modal = document.querySelector(".overlay");
    modal.classList.add("escondido");
  }

  enviarZap() {
    const encodedText = encodeURIComponent(
      `Olá, gostaria de fazer o pedido: \n- Prato: ${
        this.prato.nome
      } \n- Bebida: ${this.bebida.nome} \n- Sobremesa: ${
        this.sobremesa.nome
      } \nTotal: R$ ${this.getPrecoTotal().toFixed(2)}`
    );

    const urlWhatsapp = `https://wa.me/${this.telefone}?text=${encodedText}`;
    window.open(urlWhatsapp);
  }
}

const btnConfirmar = document.querySelector(".confirmar");
const btnCancelar = document.querySelector(".cancelar");
const btnPedir = document.querySelector(".fazer-pedido");
const telefoneRestaurante = 553299999999;

const pedidos = new Pedido(
  btnPedir,
  btnConfirmar,
  btnCancelar,
  telefoneRestaurante
);

const pratosContainer = document.querySelector(".opcoes.prato");
pratos.forEach((prato) => {
  const { nome, imagem, descricao, preco } = prato;
  const pratoItem = new Item(
    nome,
    imagem,
    descricao,
    preco,
    "prato",
    pedidos.selectItem
  );
  pratosContainer.appendChild(pratoItem.element);
});
const bebidasContainer = document.querySelector(".opcoes.bebida");
bebidas.forEach((bebida) => {
  const { nome, imagem, descricao, preco } = bebida;
  const bebidaItem = new Item(
    nome,
    imagem,
    descricao,
    preco,
    "bebida",
    pedidos.selectItem
  );
  bebidasContainer.appendChild(bebidaItem.element);
});
const sobremesasContainer = document.querySelector(
  ".opcoes.sobremesa",
  pedidos.selectItem
);
sobremesas.forEach((sobremesa) => {
  const { nome, imagem, descricao, preco } = sobremesa;
  const sobremesaItem = new Item(
    nome,
    imagem,
    descricao,
    preco,
    "sobremesa",
    pedidos.selectItem
  );
  sobremesasContainer.appendChild(sobremesaItem.element);
});
