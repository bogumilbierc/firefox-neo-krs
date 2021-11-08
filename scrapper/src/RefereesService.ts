'use strict';

import { Court } from './model/court.model';
import { Referee } from './model/referee.model';
import axios from 'axios';
import { HTMLElement, parse } from 'node-html-parser';
import { Globals } from './Globals';

export class RefereesService {

  async getReferees(court: Court): Promise<Referee[]> {
    console.log(`Getting referees for Court: ${JSON.stringify(court)}`);

    const courtRefereesWebsite = await axios.request({
      url: court.url,
      timeout: 5000
    })
    .catch((error) => {
      console.error('Error while trying to get data, retrying', error);
      return axios.request({
        url: court.url,
        timeout: 5000
      })
    });

    const root = parse(courtRefereesWebsite.data)

    const possibleRefereesElements: HTMLElement[] = root.querySelectorAll('tr[title="Zobacz szczegóły nominacji"]');

    const nullableReferees: (Referee | null)[] = possibleRefereesElements.map((possibleReferee: HTMLElement) => {
      const surname = possibleReferee?.childNodes?.[0]?.textContent;
      const name = possibleReferee?.childNodes?.[1]?.textContent;
      const position = possibleReferee?.childNodes?.[2]?.textContent;
      const refereeLocation = possibleReferee.getAttribute('onclick')?.replace('location=\'', '')?.replace('\'', '');

      if (!surname || !name || !position || !refereeLocation) {
        return null;
      }
      const url = `${Globals.KOD_WEBSITE_URL}${refereeLocation}`
      const referee: Referee = {
        surname,
        name,
        position,
        url,
        court
      };
      return referee;
    });

    const validReferees: Referee[] = nullableReferees.filter((referee: Referee | null) => !!referee) as Referee[];

    console.log(`Got ${validReferees.length} referees for ${court.name}`);
    return validReferees;
  }

}

