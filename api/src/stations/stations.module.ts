import { Module } from '@nestjs/common';
import { StationsResolver } from './stations.resolver';
import { StationsService } from './stations.service';
import { OkkoService } from './okko/okko.service';
import { UpgService } from './upg/upg.service';
import { SocarService } from './socar/socar.service';
import { WogService } from './wog/wog.service';
import { AviasService } from './avias/avias.service';

@Module({
  providers: [
    StationsResolver,
    StationsService,
    OkkoService,
    UpgService,
    SocarService,
    WogService,
    AviasService,
  ],
})
export class StationsModule {}
