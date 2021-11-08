# Firefox Neo KRS

## Brief
Dodatek do Firefoxa.

Działa na stronach Portalu Informacyjnego Sądów Powszechnych. Sprawdza czy sędzie w sprawie znajduje się na liście sędziów NeoKRS. Wymaga wejścia w detaile sprawy.


## Building the project
It uses static list of referees web scrapped from KDD website, so it needs some scripts to be run before publishing.

### Prerequisites
- nvm (Node version manager)

### Building
```bash
cd scrapper
nvm use
npm ci
npm run start
```
