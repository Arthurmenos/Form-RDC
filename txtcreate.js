const fs = require('fs');
const path = require('path');

function transformarDados(dados) {
    try {
        const jsonData = JSON.parse(dados);

        const time_nome = jsonData['time-nome'];
        const time_divisao = jsonData['time-divisao'].toLowerCase() === "primeira" ? "DIVISÃO 1" : "DIVISÃO 2";
        const capitao = jsonData.capitao;
        const jogadores = jsonData.jogadores;

        return {
            "time_nome": time_nome,
            "time_divisao": time_divisao,
            "capitao": capitao,
            "jogadores": jogadores
        };
    } catch (error) {
        console.error('Erro ao transformar os dados:', error);
        return null;
    }
}

const diretorio = './timesjson';

fs.readdir(diretorio, (err, arquivos) => {
    if (err) {
        console.error("Erro ao ler o diretório:", err);
        return;
    }

    arquivos.forEach((arquivo) => {
        if (path.extname(arquivo) === '.json') {
            const caminhoArquivo = path.join(diretorio, arquivo);

            fs.readFile(caminhoArquivo, 'utf8', (err, data) => {
                if (err) {
                    console.error("Erro ao ler o arquivo:", err);
                    return;
                }

                const dadosTransformados = transformarDados(data);

                if (dadosTransformados) {
                    const pastaDestino = dadosTransformados.time_divisao === "DIVISÃO 1" ? "div1" : "div2";
                    const diretorioDestino = path.join(__dirname, pastaDestino);
                    
                    if (!fs.existsSync(diretorioDestino)) {
                        fs.mkdirSync(diretorioDestino);
                    }

                    const nomeArquivoTxt = `${dadosTransformados.time_nome}.txt`;
                    const caminhoArquivoTxt = path.join(diretorioDestino, nomeArquivoTxt);

                    // Verificar se o arquivo já existe
                    if (!fs.existsSync(caminhoArquivoTxt)) {
                        let conteudo = `Nome do Time: ${dadosTransformados.time_nome} (${dadosTransformados.time_divisao})\n`;
                        conteudo += `Jogador 1: ${dadosTransformados.capitao.discord} (Capitão)\n`;
                        conteudo += `- ID: ${dadosTransformados.capitao.id}\n`;
                        conteudo += `- Discord: ${dadosTransformados.capitao.discord}\n`;
                        conteudo += `- Whatsapp: ${dadosTransformados.capitao.whatsapp}\n`;
                        conteudo += `- Ranking: ${dadosTransformados.capitao.rank}\n\n`;

                        dadosTransformados.jogadores.forEach((jogador, index) => {
                            conteudo += `Jogador ${index + 2}: ${jogador.discord}\n`;
                            conteudo += `- ID: ${jogador.id}\n`;
                            conteudo += `- Discord: ${jogador.discord}\n`;
                            conteudo += `- Whatsapp: ${jogador.whatsapp}\n`;
                            conteudo += `- Ranking: ${jogador.rank}\n\n`;
                        });

                        fs.writeFile(caminhoArquivoTxt, conteudo, 'utf8', (err) => {
                            if (err) {
                                console.error("Erro ao escrever o arquivo:", err);
                                return;
                            }
                            console.log(`Arquivo "${nomeArquivoTxt}" criado com sucesso em "${pastaDestino}"!`);
                        });
                    } else {
                        console.log(`O arquivo "${nomeArquivoTxt}" já existe em "${pastaDestino}". Nenhuma alteração feita.`);
                    }
                }
            });
        }
    });
});
