import { Module } from '@nestjs/common';
import { StationsResolver } from './stations.resolver';
import { StationsService } from './stations.service';
import { OkkoService } from './okko/okko.service';
import { UpgService } from './upg/upg.service';
import { SocarService } from './socar/socar.service';
import { WogService } from './wog/wog.service';
import { AviasService } from './avias/avias.service';
import { BrsmService } from './brsm/brsm.service';
import { MottoService } from './motto/motto.service';
import { AmicService } from './amic/amic.service';

@Module({
  providers: [
    StationsResolver,
    StationsService,
    OkkoService,
    UpgService,
    SocarService,
    WogService,
    AviasService,
    BrsmService,
    MottoService,
    AmicService,
  ],
})
export class StationsModule {}
