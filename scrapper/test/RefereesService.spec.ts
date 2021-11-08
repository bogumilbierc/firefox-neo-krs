import { Court } from '../src/model/court.model';
import path from 'path';
import fs from 'fs';
import { RefereesService } from '../src/RefereesService';
import nock from 'nock';
import { Referee } from '../src/model/referee.model';

describe('RefereesService', () => {

  const service: RefereesService = new RefereesService();

  it('should return empty list if there are no referees', async () => {
    //given
    const court: Court = {
      name: 'Naczelny Sąd Administracyjny',
      url: 'https://ruchkod.pl/neokrs/?sad=Naczelny%20S%C4%85d%20Administracyjny'
    }
    nock('https://ruchkod.pl')
    .get('/neokrs/?sad=Naczelny%20S%C4%85d%20Administracyjny')
    .reply(200, getFileContent('referees-nsa-no-data.html'))

    //when
    const referees = await service.getReferees(court)

    //then
    expect(referees).toEqual([]);
  });

  it('should return all valid referees', async () => {
    //given
    const court: Court = {
      name: 'Sąd Rejonowy dla Warszawy-Śródmieścia w Warszawie',
      url: 'https://ruchkod.pl/neokrs/?sad=S%C4%85d%20Rejonowy%20dla%20Warszawy-%C5%9Ar%C3%B3dmie%C5%9Bcia%20w%20Warszawie'
    }
    nock('https://ruchkod.pl')
    .get('/neokrs/?sad=S%C4%85d%20Rejonowy%20dla%20Warszawy-%C5%9Ar%C3%B3dmie%C5%9Bcia%20w%20Warszawie')
    .reply(200, getFileContent('referees-rejonowy-warszawa-srodmiescie.html'))

    //when
    const referees = await service.getReferees(court)

    //then
    const expected: Referee[] = [
      {
        name: 'Kamila Daria',
        position: 'asesor',
        surname: 'ADASZKIEWICZ'
      },
      {
        name: 'Bartłomiej',
        position: 'asesor',
        surname: 'BALCEREK'
      },
      {
        name: 'Ewelina',
        position: 'sędzia',
        surname: 'CHABUDA'
      }
    ]
    expect(referees).toEqual(expected);

  });

  function getFileContent(filename: string): Buffer {
    return fs.readFileSync(getFilePath(filename));
  }

  function getFilePath(fileName: string): string {
    return path.join(__dirname, 'fixtures', fileName);
  }

});
