const express = require('express');
const router = express.Router();

// Rota de Início de Partida (Matchmaking)
router.post('/start_match', (req, res) => {
  const { session_key, mode_id } = req.body;
  console.log('Iniciando partida para sessão:', session_key);

  res.json({
    error: 0,
    match_id: "match_" + Date.now(),
    server_ip: "159.203.161.22", // IP fictício do servidor de jogo
    server_port: 20001,
    ticket: "tk_" + Math.random().toString(36).substr(2, 12),
    encryption_key: "key_legacy_2019"
  });
});

// Rota de Status da Partida
router.get('/match_status/:match_id', (req, res) => {
  res.json({
    error: 0,
    status: "In Progress",
    players_alive: 50,
    time_elapsed: 300
  });
});

module.exports = router;
