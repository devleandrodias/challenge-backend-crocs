# Challenge Backend Crocs

<p align="center">
    <a href="https://croct.com">
      <img src="https://cdn.croct.io/brand/logo/repo-icon-green.svg" alt="Croct" height="80"/>
    </a>
    <br />
    <strong>Location Detector</strong>
    <br />
    An application that detects the visitor's location based on the IP address.
</p>

![Badge Conluída](http://img.shields.io/static/v1?label=STATUS&message=CONCLUIDO&color=GREEN&style=for-the-badge)

## :dart: Application Summary
This Node.js application is designed to read streaming data from various data sources in the form of IP numbers. It leverages the power of Node.js streams to efficiently process and transform the data. The application then interacts with an external API to perform specific operations with the IP numbers. Finally, the processed data is persisted for further analysis or usage.

### Key Features:

- Utilizes Node.js streams for efficient and scalable data processing.
- Reads streaming data from diverse sources in IP number format.
- Interacts with an external API to perform operations on the IP numbers.
- Implements data persistence to store the processed information.
- This application provides a streamlined and flexible solution for handling streaming IP data, making it easier to process, interact with an external API, and persist the results for further utilization.

### Readers

- [x] CSV Reader
- [x] JSONL Reader

### Translations

- [x] CSV Translator
- [x] SQLite Translator
- [x] External API Translator

### Writers

- [x] JSONL Writer
- [x] Kafka Topic Writer 


## :hammer: Tools Used

- axios
- colors
- csv-parse
- dotenv
- env-var
- kafkajs
- redis
- reflect-metadata
- sqlite3
- tsyringe
- jest
- typescript

## :zap: How execute the project?

If you don't have kafa and redis you can download with next script

> sh scripts/download.sh

Start zookeeper

> sh scripts/start-zookeeper.sh

Start kafka server

> sh scripts/start-kafka.sh

Install redis server

> cd ./apps/redis-7.0.11/
> sudo make install
> cd utils
> sudo ./install_server.sh

Copy .env file

> cp .env.dev .env

Install node using nvm

> nvm install

Install node project dependencies

> npm install

Start CLI application (Dev mode)

> npm run cli:dev

Start CLI application (Production mode)

> npm run build && npm run cli:prod

### Helpers

You can use helper to consume messages from location-output topic

> npm run helper:location-output 

### Tests

You can see coverage test project with next script

> npm run test

## :mailbox_with_mail: Contact

To get in touch, send an email to <me@leandrodbdias.dev> or visit my website <https://leandrodbdias.dev>
