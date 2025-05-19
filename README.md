# 📒 Agenda de Contatos — NestJS + React

Um sistema simples e funcional de cadastro de contatos, com suporte a múltiplos telefones, edição, exclusão e busca por nome e número. O backend é construído com NestJS e banco de dados SQLite. O frontend é feito em React com Material UI.

---

## ✨ Funcionalidades

- ✅ Cadastro de contato com nome, idade e múltiplos telefones
- ✅ Máscara automática para telefones (formato: (99) 99999-9999)
- ✅ Edição de contatos diretamente no formulário
- ✅ Exclusão com registro em arquivo de log (`logs/deletados.txt`)
- ✅ Pesquisa por nome e telefone 
- ✅ Interface limpa e responsiva com Material UI

---

## 🛠️ Tecnologias

### Backend (API):
- [NestJS](https://nestjs.com/)
- [TypeORM](https://typeorm.io/)
- [SQLite](https://www.sqlite.org/)
- [Swagger](https://swagger.io/) para documentação
- Node.js + TS

### Frontend:
- [React](https://reactjs.org/)
- [Material UI](https://mui.com/)
- Create React App
- Fetch API

---

## ⚙️ Como rodar localmente

### 🔧 Backend (API NestJS)

```bash
# 1. Clone o repositório e entre na pasta backend
cd backend

# 2. Instale as dependências
npm install

# 3. Rode o projeto
npm run start:dev

# A API estará disponível em: http://localhost:3000
# Acesse a documentação Swagger em: http://localhost:3000/api

🗄️ Acessando o banco de dados (SQLite)
Este projeto utiliza SQLite como banco de dados local. O arquivo do banco é criado automaticamente com o nome db.sqlite dentro da pasta backend/.

📥 Visualizar o banco com interface gráfica
Recomendado: DB Browser for SQLite

Baixe e instale o DB Browser.

Abra o programa e clique em "Open Database".

Selecione o arquivo:

bash
Copiar
Editar
backend/db.sqlite
Vá até a aba "Browse Data" para visualizar os registros.

Você pode explorar e editar os dados diretamente pela interface.

🧪 Acessar via terminal (opcional)
Se preferir usar o terminal (com SQLite instalado):

bash
Copiar
Editar
sqlite3 backend/db.sqlite
Dentro do prompt:

sql
Copiar
Editar
.tables                 
SELECT * FROM contact; 
SELECT * FROM phone;   
.exit                  
