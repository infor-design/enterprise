FROM node:14-buster

WORKDIR /usr/src

RUN apt-get update \
    && apt-get install -y \
    software-properties-common \
    build-essential

RUN apt-get -y update \
    && apt-get -y install \
    git

COPY ./run.sh run.sh
COPY ./utils.sh utils.sh
RUN chmod +x utils.sh
RUN chmod +x run.sh

ENTRYPOINT ["/bin/bash", "run.sh"]
