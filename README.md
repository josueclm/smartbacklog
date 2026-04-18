# smartbacklog
Sistema Inteligente para gestão de projectos

# 🚀 Agile Project Management System

Sistema web de gestão ágil de projetos inspirado em ferramentas como Linear e Jira, com suporte a Kanban, Sprints e funcionalidades assistidas por IA.

---

## 📌 Descrição

Esta aplicação permite gerir projetos de forma ágil, organizando tarefas em boards Kanban, associando-as a sprints e acompanhando o progresso da equipa.

Inclui também funcionalidades de Inteligência Artificial para apoiar a criação de user stories, critérios de aceitação e definição de prioridades.

---

## 🎯 Funcionalidades

### 🧱 Core
- Criar, editar e eliminar tarefas
- Definir prioridade das tarefas
- Visualizar lista de tarefas

### 📊 Kanban
- Quadro Kanban (To Do, In Progress, Done)
- Arrastar tarefas entre colunas
- Atualização de estado

### 🏃 Sprints
- Criar sprints
- Adicionar tarefas a sprints
- Acompanhar progresso

### 🔐 Autenticação
- Login de utilizador (MVP simples)
- Gestão básica de sessão

### 📈 Dashboard
- Visão geral do projeto
- Métricas básicas

### 🤖 Inteligência Artificial
- Gerar User Stories automaticamente
- Gerar Critérios de Aceitação
- Sugerir prioridade de tarefas

---

## 🧠 Arquitetura

O sistema segue uma arquitetura de 3 camadas:

### Frontend
- Interface do utilizador
- Comunicação com API

### Backend
- Controllers (endpoints)
- Services (lógica de negócio)

### Base de Dados
- SQLite
- Estrutura relacional

---

## 🗄️ Base de Dados

Principais entidades:
- Users
- Projects
- Sprints
- Tasks
- Task Status
- Comments
- AI Suggestions

---

## ⚙️ Tecnologias

- Frontend: React / HTML / CSS / JS
- Backend: Node.js / Express
- Base de dados: SQLite
- Versionamento: Git

---
## 📊 Estrutura do Projeto

/src/
  /frontend
  /backend
  /database
  /docs
  
## 🚀 Instalação

### 1. Clonar repositório
```bash
git clone git clone https://github.com/josueclm/smartbacklog.git
cd smartbacklog

npm install
npm start
```bash


