KAFKA_PATH=/home/devleandrodias/apps/kafka_2.13-3.4.0
KAFKA_BROKER=localhost:9092
KAFKA_TOPIC_NAME=events_input

KEY=fba283ed-9295-5907-848d-59da9d2664a1
VALUE={"ip":"192.98.251.204","timestamp":1684196476484}

echo -e "${KEY}:${VALUE}" | $KAFKA_PATH/bin/kafka-console-producer.sh --broker-list ${BROKER_LIST} --topic ${KAFKA_TOPIC_NAME} --property "parse.key=true" --property "key.separator=:"