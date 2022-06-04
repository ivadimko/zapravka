import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { StationsModule } from './stations/stations.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: process.env.NODE_ENV !== 'production',
      autoSchemaFile: true,
    }),
    ScheduleModule.forRoot(),
    StationsModule,
  ],
})
export class AppModule {}
