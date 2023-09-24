# Documentação do Microserviço Notifier

## Introdução

O microserviço **Notifier** possibilita uma automatização eficaz no envio de notificações através do WhatsApp Web. Ele enfileira mensagens no RabbitMQ e, após a instanciação do WhatsApp Web, processa a fila enviando as mensagens de maneira autônoma. Uma vantagem primordial é a capacidade de instanciar e gerenciar múltiplos números de WhatsApp.

## Requisitos

Antes de executar o Notifier, certifique-se de:

1. [Docker](https://www.docker.com/) está instalado.
2. [Docker Compose](https://docs.docker.com/compose/) também está instalado.
3. [Node.js](https://nodejs.org/) está instalado.
4. As dependências do projeto foram instaladas utilizando `yarn install` ou `npm install`.

## Tecnologias Utilizadas

Este microserviço utiliza a biblioteca [venom bot](https://github.com/orkestral/venom) para instanciar e gerenciar os números de WhatsApp, facilitando a integração e automatização das mensagens.

## Configuração

Passos para configurar o microserviço Notifier:

1. Clone o repositório:

   ```bash
   git clone https://github.com/lucasgabrielba/ms-notifier.git
   ```

2. Navegue até o diretório do projeto:

   ```bash
   cd ms-notifier
   ```

3. Instale as dependências:

   ```bash
   yarn install ou npm install
   ```

4. Defina as variáveis de ambiente. Use o .env.example como referência para criar o arquivo .env.

5. Inicie os serviços utilizando Docker Compose:

   ```bash
   yarn services:up ou npm services:up
   ```

   Assim que inicializado, o RabbitMQ estará pronto para uso.

## Uso da API

Funcionalidades disponíveis:

1. Pegar o QRCode e instanciar WhatsApp Web:

   ```bash
   GET /qrcode/:intanceID
   ```

2. Enviar Mensagens:

   Envie mensagens para serem enfileiradas no RabbitMQ. Elas serão processadas quando uma instância correspondente for ativa.

   ```bash
   POST /send-to-queue/
   ```

   Body da Requisição:

   ```json
   {
     "intanceId": "UUID da instância",
     "message": "texto da mensagem",
     "phone": "telefone com ddd",
     "type": "text ou pdf"
   }
   ```

3. Verificar Status:

   Confira o status da instância do WhatsApp Web:

   ```bash
   GET /status/:instanceID
   ```

4. Desconectar Instância:

   Desconecte a instância do WhatsApp Web:

   ```bash
   GET /disconnect/:instanceID
   ```

## Execução Local

O microserviço Notifier foi projetado para rodar em ambiente local, em conjunto com o RabbitMQ, através do Docker e Docker Compose.

Após ter o RabbitMQ ativo, configurar as variáveis de ambiente e instalar as dependências:

Para iniciar o projeto, execute:

```bash
yarn start ou npm start
```

Isso colocará o microserviço Notifier em execução e começará a processar as mensagens enfileiradas.

## Contribuições

Todas as contribuições são apreciadas! Se tiver sugestões ou correções, abra issues, envie pull requests ou fale conosco diretamente.

## Licença

Este projeto está sob a Licença MIT. Consulte o arquivo LICENSE para detalhes completos.

## Contato

Para suporte ou dúvidas adicionais, entre em contato através do lucasgabrielba@gmail.com.
