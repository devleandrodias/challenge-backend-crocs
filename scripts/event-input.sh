KAFKA_PATH=/home/devleandrodias/apps/kafka_2.13-3.4.0

sh $KAFKA_PATH/bin/kafka-console-producer.sh --broker-list localhost:9092 --topic events_input