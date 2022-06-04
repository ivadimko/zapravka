import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { StationsModule } from './stations/stations.module';
import { ScheduleModule } from '@nestjs/schedule';
import * as path from 'path';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: process.env.NODE_ENV !== 'production',
      autoSchemaFile: path.join(process.cwd(), 'src/schema.gql'),
    }),
    ScheduleModule.forRoot(),
    StationsModule,
  ],
})
export class AppModule {}
