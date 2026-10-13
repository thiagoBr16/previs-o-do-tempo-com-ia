async function cliqueiNoBotao() {
  const cidade = document.querySelector(".input-cidade").value.trim();
  const caixa = document.querySelector(".caixa-media");
  const chave = "c67b4bcc700e4481e680825430592363";

  if (!cidade) {
    caixa.innerHTML = `<p>Digite o nome da cidade para ver a previsão.</p>`;
    return;
  }

  const endereco = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cidade)}&units=metric&lang=pt_br&appid=${chave}`;

  try {
    const respostaServidor = await fetch(endereco);
    if (!respostaServidor.ok) {
      throw new Error("Cidade não encontrada ou erro na requisição.");
    }

    const dadosjson = await respostaServidor.json();
    console.log(dadosjson);

    const temperatura = Math.round(dadosjson.main.temp);
    const umidade = dadosjson.main.humidity;
    const descricao = dadosjson.weather[0].description;
    const icone = dadosjson.weather[0].icon;
    const iconeUrl = `https://openweathermap.org/img/wn/${icone}@2x.png`;

    caixa.innerHTML = `
      <h2 class="cidade">${dadosjson.name}</h2>
      <p class="temperatura">${temperatura} °C</p>
      <div class="icone-e-umidade">
        <img class="imagem-icone" src="${iconeUrl}" alt="Ícone de ${descricao}" />
        <p class="umidade">Umidade: ${umidade}%</p>
      </div>
      <button type="button" class="botao-ia">Sugestão de Roupas</button>
      <p class="sugestao-roupa"></p>
      <p class="resposta-ia"></p>`;

    const botaoSugestao = caixa.querySelector(".botao-ia");
    const elementoSugestao = caixa.querySelector(".sugestao-roupa");

    botaoSugestao.addEventListener("click", () => {
      elementoSugestao.textContent = gerarSugestaoRoupa(temperatura);
    });
  } catch (erro) {
    caixa.innerHTML = `<p>Erro: ${erro.message}</p>`;
    console.error(erro);
  }
}

function gerarSugestaoRoupa(temperatura) {
  if (temperatura <= 5) {
    return "Frio intenso: casaco pesado, luvas e cachecol.";
  }
  if (temperatura <= 15) {
    return "Frio: jaqueta, suéter e calça comprida.";
  }
  if (temperatura <= 22) {
    return "Agradável: camiseta de manga comprida ou suéter leve.";
  }
  if (temperatura <= 28) {
    return "Quente: camiseta e calça leve ou bermuda.";
  }
  return "Muito quente: regata, shorts e protetor solar.";
}

function detectaVoz() {
  const isSupportedBrowser = /Chrome|Edg/.test(navigator.userAgent) && !/OPR|Brave|CriOS/.test(navigator.userAgent);
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!isSupportedBrowser) {
    alert("Use Google Chrome ou Microsoft Edge para o reconhecimento de voz. Outros navegadores não serão executados.");
    return;
  }

  if (!SpeechRecognition) {
    alert("Seu navegador não suporta reconhecimento de voz. Use Chrome ou Edge em HTTPS ou localhost.");
    return;
  }

  const reconhecimento = new SpeechRecognition();
  reconhecimento.lang = "pt-BR";
  reconhecimento.interimResults = false;
  reconhecimento.maxAlternatives = 1;

  reconhecimento.onresult = function(evento) {
    let texto = evento.results[0][0].transcript.trim();
    texto = texto.replace(/[.?!]$/u, "");
    console.log(evento);
    console.log("Texto reconhecido:", texto);

    const inputCidade = document.querySelector(".input-cidade");
    if (inputCidade) {
      inputCidade.value = texto;
    }

    cliqueiNoBotao();
  };

  reconhecimento.onerror = function(erro) {
    console.error("Erro de reconhecimento:", erro);
    if (erro.error === "audio-capture") {
      alert("Não foi possível acessar o microfone. Verifique as permissões e o microfone.");
    } else {
      alert("Erro no reconhecimento de voz: " + erro.error);
    }
  };

  reconhecimento.start();
}

