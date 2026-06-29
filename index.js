const express = require('express');
const cors = require('cors');
const config = require('./config.json');
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// FUNÇÃO GERADORA DE TIMESTAMP LEGACY (2019)
// ==========================================
function obterTempoLegacy() {
    const data = new Date();
    data.setFullYear(config.server.force_year);
    return {
        unix: Math.floor(data.getTime() / 1000),
        millis: data.getTime(),
        iso: data.toISOString()
    };
}

// ==========================================
// 1. ROTA DE CHECAGEM DE VERSÃO E PATCH
// ==========================================
// O APK antigo bate aqui para saber se precisa baixar atualização da Google Play
app.get('/api/v1/version_check', (req, res) => {
    const tempo = obterTempoLegacy();
    
    res.json({
        error: 0,
        maintenance: config.game.maintenance,
        version: config.game.client_version,
        resource_version: config.game.resource_version,
        download_url: "", // Vazio para não forçar o APK a baixar nada
        server_time: tempo.unix,
        timestamp: tempo.millis
    });
});

// ==========================================
// 2. ROTA DE SINCRONIZAÇÃO DE HORA (HEARTBEAT)
// ==========================================
// Evita o erro de timeout e desonexão enquanto o jogador está parado no lobby
app.get('/api/v1/time_sync', (req, res) => {
    const tempo = obterTempoLegacy();
    res.json({
        error: 0,
        server_time: tempo.unix,
        server_millis: tempo.millis,
        timezone: "GMT-3"
    });
});

// ==========================================
// 3. ROTA DE CONFIGURAÇÃO INTERNA DO LOBBY
// ==========================================
// Passa os parâmetros de eventos, ativação de mapas (Bermuda/Purgatório) e modos
app.get('/api/v1/game_config', (req, res) => {
    const tempo = obterTempoLegacy();
    
    res.json({
        error: 0,
        server_time: tempo.unix,
        settings: {
            purgatory_enabled: true,
            ranked_enabled: true,
            shop_active: true,
            max_ping_allowed: 200
        },
        events: {
            current_event_id: 101,
            start_time: tempo.unix - 86400, // Começou ontem no tempo simulado
            end_time: tempo.unix + 604800   // Termina em uma semana no tempo simulado
        }
    });
});

// ==========================================
// 4. ROTA DE ANÚNCIOS (NOTICE BOARD)
// ==========================================
// Se o painel de anúncios tentar carregar uma data de 2026, ele buga a tela.
// Forçando 2019, os banners e notícias do seu servidor abrem perfeitamente.
app.get('/api/v1/notices', (req, res) => {
    const tempo = obterTempoLegacy();
    
    res.json({
        error: 0,
        server_time: tempo.unix,
        notices: [
            {
                id: 1,
                title: "Bem-vindo ao Servidor Privado!",
                content: "Aproveite Todos os Bons Tempos.",
                image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-uXsEQKU56JCGlg9_6fiEbWgmK1Jx859Fc9bF3JQ6rA&s=10", 
                popup: true
            }
        ]
    });
});

// ==========================================
// INICIALIZAÇÃO
// ==========================================
const PORT = process.env.PORT || config.server.port || 8080;
app.listen(PORT, () => {
    console.log(`\n🔥 Servidor Backend Legacy Ativo na porta ${PORT}`);
    console.log(`⏱️ Proteção contra erro de hora ativa (Alvo: ${config.server.force_year})\n`);
});
