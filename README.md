# Aplicativo de Tendências Musicais

Este é um aplicativo web que mostra as tendências musicais do Spotify no Brasil e no mundo, permitindo explorar diferentes categorias e playlists.

## Configuração

1. Primeiro, crie uma conta de desenvolvedor no Spotify:
   - Acesse [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Crie um novo aplicativo
   - Copie o Client ID e Client Secret

2. Configure as variáveis de ambiente:
   - Renomeie o arquivo `.env.example` para `.env`
   - Adicione seu Client ID e Client Secret do Spotify no arquivo `.env`

3. Instale as dependências:
```bash
pip install -r requirements.txt
```

4. Execute o aplicativo:
```bash
python app.py
```

5. Acesse o aplicativo em seu navegador:
   - Abra `http://localhost:5000/static/index.html`

## Funcionalidades

- Visualização de tendências musicais do Brasil
- Visualização de tendências musicais globais
- Exploração por categorias
- Links diretos para as playlists no Spotify

## Tecnologias Utilizadas

- Backend: Python com Flask
- Frontend: HTML, CSS, JavaScript
- APIs: Spotify Web API
- Estilização: Bootstrap 5

## Estrutura do Projeto

```
├── app.py              # Servidor Flask e rotas da API
├── requirements.txt    # Dependências do projeto
├── .env               # Variáveis de ambiente (não versionado)
└── static/
    ├── index.html     # Página principal
    ├── styles.css     # Estilos CSS
    └── app.js         # Lógica do frontend
```
