import { IDataSource } from "../IDataSource";
import { loggerInfo } from "../../../utils/logger";
import { DataSourceInput } from "../types/DataSourceInput";

export class KafkaTopicDatasource implements IDataSource {
  async read(): Promise<DataSourceInput[]> {
    loggerInfo({
      type: "info",
      log: "[READER: Kafka]: Reading data",
    });

    return [];
  }
}

// !Temporary files
{
  // const { ip, clientId } = eventInput;
  // const location = await this.trackingIpRepository.getLocationByCache(ip);
  // if (location) {
  //   loggerInfo({
  //     type: "info",
  //     log: `[IP: ${ip}] - Found in cache`,
  //   });
  //   await this.trackingIpRepository.producerLocationOutput(clientId, location);
  // }
  // if (!location) {
  //   loggerInfo({
  //     type: "info",
  //     log: `[IP: ${ip}] - NOT found in cache, getting location informations from API`,
  //   });
  //   const output = await this.trackingIpRepository.getLocationByApi(eventInput);
  //   await this.trackingIpRepository.saveLocationOutputOnCache(clientId, output);
  //   await this.trackingIpRepository.producerLocationOutput(clientId, output);
  // }
}

// !Temporary files
{
  // const trackingIpService = new TrackingIpService();
  // await new EventInputConsumer().consume(async ({ message, topic }) => {
  //   loggerInfo({ type: "info", log: `Receiving message: TOPIC: [${topic}]` });
  //   const eventInput = parseStringToObj<DataSourceInput>(
  //     message.value?.toString() || ""
  //   );
  //   await trackingIpService.track(eventInput);
  // });
}
