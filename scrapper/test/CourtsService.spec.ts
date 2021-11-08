'use strict';

import { CourtsService } from '../src/CourtsService';
import { Court } from '../src/model/court.model';
import { City } from '../src/model/city.model';

const nock = require('nock');
const fs = require('fs')
const path = require('path');

describe('CourtsService', () => {

  const service = new CourtsService();

  it('should extract list of courts for valid city', async () => {

    const city: City = {
      name: 'Warszawa',
      url: 'https://ruchkod.pl/neokrs/?miasto=Warszawa'
    };
    nock('https://ruchkod.pl')
    .get('/neokrs/?miasto=Warszawa')
    .reply(200, fs.readFileSync(getFilePath('courts-warszawa.html')));


    //when
    const courts = await service.getCourtsForCity(city, 'https://ruchkod.pl/neokrs/');

    //then
    const expected: Court[] = [
      {
        'name': 'Naczelny Sąd Administracyjny',
        'url': 'https://ruchkod.pl/neokrs/?sad=Naczelny%20S%C4%85d%20Administracyjny'
      },
      {
        'name': 'Naczelny Sąd Administracyjny Izba Finansowa',
        'url': 'https://ruchkod.pl/neokrs/?sad=Naczelny%20S%C4%85d%20Administracyjny%20Izba%20Finansowa'
      },
      {
        'name': 'Naczelny Sąd Administracyjny Izba Gospodarcza',
        'url': 'https://ruchkod.pl/neokrs/?sad=Naczelny%20S%C4%85d%20Administracyjny%20Izba%20Gospodarcza'
      },
      {
        'name': 'Naczelny Sąd Administracyjny Izba Ogólnoadministracyjna',
        'url': 'https://ruchkod.pl/neokrs/?sad=Naczelny%20S%C4%85d%20Administracyjny%20Izba%20Og%C3%B3lnoadministracyjna'
      },
      {
        'name': 'Sąd Apelacyjny w Warszawie',
        'url': 'https://ruchkod.pl/neokrs/?sad=S%C4%85d%20Apelacyjny%20w%20Warszawie'
      },
      {
        'name': 'Sąd Najwyższy',
        'url': 'https://ruchkod.pl/neokrs/?sad=S%C4%85d%20Najwy%C5%BCszy'
      },
      {
        'name': 'Sąd Najwyższy Izba Cywilna',
        'url': 'https://ruchkod.pl/neokrs/?sad=S%C4%85d%20Najwy%C5%BCszy%20Izba%20Cywilna'
      },
      {
        'name': 'Sąd Najwyższy Izba Dyscyplinarna',
        'url': 'https://ruchkod.pl/neokrs/?sad=S%C4%85d%20Najwy%C5%BCszy%20Izba%20Dyscyplinarna'
      },
      {
        'name': 'Sąd Najwyższy Izba Karna',
        'url': 'https://ruchkod.pl/neokrs/?sad=S%C4%85d%20Najwy%C5%BCszy%20Izba%20Karna'
      },
      {
        'name': 'Sąd Najwyższy Izba Kontroli Nadzwyczajnej i Spraw Publicznych',
        'url': 'https://ruchkod.pl/neokrs/?sad=S%C4%85d%20Najwy%C5%BCszy%20Izba%20Kontroli%20Nadzwyczajnej%20i%20Spraw%20Publicznych'
      },
      {
        'name': 'Sąd Najwyższy Izba Pracy i Ubezpieczeń Społecznych',
        'url': 'https://ruchkod.pl/neokrs/?sad=S%C4%85d%20Najwy%C5%BCszy%20Izba%20Pracy%20i%20Ubezpiecze%C5%84%20Spo%C5%82ecznych'
      },
      {
        'name': 'Sąd Okręgowy Warszawa-Praga w Warszawie',
        'url': 'https://ruchkod.pl/neokrs/?sad=S%C4%85d%20Okr%C4%99gowy%20Warszawa-Praga%20w%20Warszawie'
      },
      {
        'name': 'Sąd Okręgowy w Warszawie',
        'url': 'https://ruchkod.pl/neokrs/?sad=S%C4%85d%20Okr%C4%99gowy%20w%20Warszawie'
      },
      {
        'name': 'Sąd Rejonowy dla Warszawy Pragi-Południe w Warszawie',
        'url': 'https://ruchkod.pl/neokrs/?sad=S%C4%85d%20Rejonowy%20dla%20Warszawy%20Pragi-Po%C5%82udnie%20w%20Warszawie'
      },
      {
        'name': 'Sąd Rejonowy dla Warszawy Pragi-Północ w Warszawie',
        'url': 'https://ruchkod.pl/neokrs/?sad=S%C4%85d%20Rejonowy%20dla%20Warszawy%20Pragi-P%C3%B3%C5%82noc%20w%20Warszawie'
      },
      {
        'name': 'Sąd Rejonowy dla Warszawy-Mokotowa w Warszawie',
        'url': 'https://ruchkod.pl/neokrs/?sad=S%C4%85d%20Rejonowy%20dla%20Warszawy-Mokotowa%20w%20Warszawie'
      },
      {
        'name': 'Sąd Rejonowy dla Warszawy-Śródmieścia w Warszawie',
        'url': 'https://ruchkod.pl/neokrs/?sad=S%C4%85d%20Rejonowy%20dla%20Warszawy-%C5%9Ar%C3%B3dmie%C5%9Bcia%20w%20Warszawie'
      },
      {
        'name': 'Sąd Rejonowy dla Warszawy-Woli w Warszawie',
        'url': 'https://ruchkod.pl/neokrs/?sad=S%C4%85d%20Rejonowy%20dla%20Warszawy-Woli%20w%20Warszawie'
      },
      {
        'name': 'Sąd Rejonowy dla Warszawy-Żoliborza w Warszawie',
        'url': 'https://ruchkod.pl/neokrs/?sad=S%C4%85d%20Rejonowy%20dla%20Warszawy-%C5%BBoliborza%20w%20Warszawie'
      },
      {
        'name': 'Sąd Rejonowy dla miasta stołecznego Warszawy w Warszawie',
        'url': 'https://ruchkod.pl/neokrs/?sad=S%C4%85d%20Rejonowy%20dla%20miasta%20sto%C5%82ecznego%20Warszawy%20w%20Warszawie'
      },
      {
        'name': 'Wojewódzki Sąd Administracyjny w Warszawie',
        'url': 'https://ruchkod.pl/neokrs/?sad=Wojew%C3%B3dzki%20S%C4%85d%20Administracyjny%20w%20Warszawie'
      },
      {
        'name': 'Wojskowy Sąd Okręgowy w Warszawie',
        'url': 'https://ruchkod.pl/neokrs/?sad=Wojskowy%20S%C4%85d%20Okr%C4%99gowy%20w%20Warszawie'
      }
    ]
    expect(courts).toEqual(expected);
  });

  function getFilePath(fileName: string): string {
    return path.join(__dirname, 'fixtures', fileName);
  }

});
