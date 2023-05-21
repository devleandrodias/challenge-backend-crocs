# Creating folders
mkdir downloads
mkdir apps

# Downloading Files
wget -P downloads https://downloads.apache.org/kafka/3.4.0/kafka_2.13-3.4.0.tgz 
wget -P downloads https://github.com/redis/redis/archive/7.0.11.tar.gz

# Unzipfiles
tar -xzf downloads/7.0.11.tar.gz -C apps
tar -xzf downloads/kafka_2.13-3.4.0.tgz -C apps

