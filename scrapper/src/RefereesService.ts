'use strict';

import { Court } from './model/court.model';
import { Referee } from './model/referee.model';

export class RefereesService {

  async getReferees(court: Court): Promise<Referee[]> {
    return Promise.resolve([]);
  }

}

