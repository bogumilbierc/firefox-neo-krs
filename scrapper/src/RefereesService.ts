'use strict';

import { Court } from './model/court.model';
import { Referee } from './model/referee.model';
import axios from 'axios';
import { HTMLElement, parse } from 'node-html-parser';

export class RefereesService {

  async getReferees(court: Court): Promise<Referee[]> {

    const courtRefereesWebsite = await axios.get(court.url);

    const root = parse(courtRefereesWebsite.data)

    const possibleRefereesElements: HTMLElement[] = root.querySelectorAll('tr[title="Zobacz szczegóły nominacji"]');

    const nullableReferees: (Referee | null)[] = possibleRefereesElements.map((possibleReferee: HTMLElement) => {
      const surname = possibleReferee?.childNodes?.[0]?.textContent;
      const name = possibleReferee?.childNodes?.[1]?.textContent;
      const position = possibleReferee?.childNodes?.[2]?.textContent;

      if (!surname || !name || !position) {
        return null;
      }
      const referee: Referee = {
        surname,
        name,
        position
      };
      return referee;
    });

    return nullableReferees.filter((referee: Referee | null) => !!referee) as Referee[];
  }

}

