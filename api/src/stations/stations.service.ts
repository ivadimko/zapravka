import { Injectable } from '@nestjs/common';
import { Station } from '@/stations/models/station.model';
import { OkkoService } from '@/stations/okko/okko.service';

@Injectable()
export class StationsService {
  constructor(private readonly okkoService: OkkoService) {}

  async findAll(): Promise<Station[]> {
    const stations = await Promise.all([this.okkoService.findAll()]);

    return stations.flat();
  }
}
