const express = require('express');
const router = express.Router();

// Simulação de banco de dados de usuários
const users = [
  { id: 1, username: 'admin', password: '123', nickname: 'Celestial' }
];

// Rota de Login do Jogo
router.post('/login', (req, res) => {
  const { account, password } = req.body;
  console.log('Tentativa de login:', account);

  // Lógica simples de autenticação
  const user = users.find(u => u.username === account && u.password === password);

  if (user) {
    res.json({
      error: 0,
      message: "Login realizado com sucesso",
      session_key: "sess_" + Math.random().toString(36).substr(2, 9),
      user_info: {
        id: user.id,
        nickname: user.nickname,
        level: 50,
        exp: 10000
      }
    });
  } else {
    res.json({
      error: 1,
      message: "Usuário ou senha incorretos"
    });
  }
});

module.exports = router;
