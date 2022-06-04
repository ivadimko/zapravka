import { Injectable } from '@nestjs/common';
import { Station } from '@/stations/models/station.model';

@Injectable()
export class StationsService {
  findAll(): Station[] {
    return [
      { id: 1, name: 'biba' },
      { id: 2, name: 'boba' },
    ];
  }
}
