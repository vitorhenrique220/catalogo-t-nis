const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'gamerverse_chave_secreta_super_segura',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 }
}));


const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao SQLite:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
    }
});


db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            email TEXT UNIQUE NOT NULL,
            senha TEXT NOT NULL
        )
    `);
});



app.post('/api/register', async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ erro: 'E-mail e senha são obrigatórios.' });
    }

    try {
        
        const senhaHash = await bcrypt.hash(senha, 10);

        const sql = `INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)`;
        db.run(sql, [nome || 'Gamer', email, senhaHash], function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ erro: 'Este e-mail já está cadastrado.' });
                }
                return res.status(500).json({ erro: 'Erro ao cadastrar usuário.' });
            }
            res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
        });
    } catch (error) {
        res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
});


app.post('/api/login', (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ erro: 'Informe o e-mail e a senha.' });
    }

    const sql = `SELECT * FROM usuarios WHERE email = ?`;
    db.get(sql, [email], async (err, usuario) => {
        if (err) {
            return res.status(500).json({ erro: 'Erro no servidor.' });
        }

        if (!usuario) {
            return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
        }

       
        req.session.usuario = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
        };

        res.json({ mensagem: 'Login realizado com sucesso!', usuario: req.session.usuario });
    });
});

app.get('/api/me', (req, res) => {
    if (req.session.usuario) {
        res.json({ logado: true, usuario: req.session.usuario });
    } else {
        res.json({ logado: false });
    }
});


app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ mensagem: 'Logout realizado com sucesso.' });
});

app.listen(PORT, () => {
    console.log(`Servidor GamerVerse rodando em http://localhost:${PORT}`);
});
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'seu_email_culture@gmail.com',  
        pass: 'sua_senha_de_app_aqui'            
    }
});


app.post('/api/esqueceu-senha', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ erro: 'Por favor, informe seu e-mail.' });
    }

   
    const sql = `SELECT * FROM usuarios WHERE email = ?`;
    db.get(sql, [email], (err, usuario) => {
        if (err) {
            return res.status(500).json({ erro: 'Erro no banco de dados.' });
        }

        if (!usuario) {
      
            return res.json({ mensagem: 'Se o e-mail estiver cadastrado, as instruções foram enviadas!' });
        }

        const linkRedefinicao = `http://localhost:3000/redefinir-senha.html?email=${encodeURIComponent(email)}`;

     
        const mailOptions = {
            from: '"GamerVerse Support" <seu_email_culture@gmail.com>',
            to: email,
            subject: '🎮 GamerVerse - Instruções para Recuperação de Senha',
            html: `
                <div style="font-family: Arial, sans-serif; background-color: #121214; color: #ffffff; padding: 20px; border-radius: 8px;">
                    <h2 style="color: #ff4757;">Olá, ${usuario.nome}!</h2>
                    <p>Recebemos uma solicitação para redefinir a senha da sua conta no <strong>GamerVerse</strong>.</p>
                    <p>Para criar uma nova senha, clique no botão abaixo:</p>
                    <p style="margin: 25px 0;">
                        <a href="${linkRedefinicao}" style="background-color: #ff4757; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Redefinir Minha Senha</a>
                    </p>
                    <p style="color: #aaa; font-size: 0.85rem;">Se você não solicitou a alteração, ignore esta mensagem. Sua senha continuará a mesma.</p>
                </div>
            `
        };

        
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Erro ao enviar e-mail:', error);
                return res.status(500).json({ erro: 'Ocorreu um erro ao tentar enviar o e-mail.' });
            }

            console.log('E-mail enviado:', info.response);
            res.json({ mensagem: 'Instruções enviadas com sucesso para o e-mail informado!' });
        });
    });
});