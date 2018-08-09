# WEBTHING-IOTJS #

* URL: https://github.com/TizenTeam/webthing-node/tree/sandbox/rzr/devel/iotjs/master/docs
* Support: https://github.com/TizenTeam/webthing-node/issues


## DISCLAIMER: ##

Recently I shared this short video about different webthings working along

https://vimeo.com/279677314#web-of-things-agriculture-20180712rzr

This Web of Thing demo "world first smart orchid ever" is not that new, I am sure

This guide will focus only using iotjs to build webthings.

Instead of freezing "quick and dirty" demo code.
I prefered to upstream the most I can
and then provide support on mainline.

Upstreaming can be a slow process,
so I will be also share some developement branches,
but they are expected to move, 
since I am continuously catching up upstream.

I hope those hints will inspire you to create different projects, let me know


## INTRODUCTION: ##

Webthing-iotjs is a fork of webthing-node adapted for IoT.js runtime.

It's functionnal but has some limitations that worth to be known:

* MDNS is not supported yet, so no auto discovery of devices
* Websockets are not implemented yet, while IoT.js rencently introduced ws, it's not used here.
* Actions and Events are also droped as not critical.


## USAGE: ##

* Setup gateway as explained at: https://iot.mozilla.org/gateway/
* Add thing URL adapter
* Deploy iotjs on supported devices
* Run example on device
* Add thing by URL

See notes for details


### PRERIQUISTE: ###

Since Mozilla Gateway 0.5 has been just released,
so it should be easy to install on RaspberryPi.

I have myself managed to make the gateway running ARTIK7 (on fedora 24)
and it should run fine on others ARTIK4 natively or in a Docker container,

https://github.com/TizenTeam/gateway/tree/sandbox/rzr/devel/artik/master

I can share more hints later, just ask tell me more on your setup.

So let's stick with RaspberryPi for today,
just install image and eventually install some adapters as explained before:

https://s-opensource.org/2018/04/25/mozilla-iot-generic-sensors/


https://s-opensource.org/wp-content/uploads/2018/04/virtual-things-1024x795.png


### USING IOTJS ON GNU/LINUX: ###

Only snapshot version if currently supported, 
if using GNU/Linux rebuild it from scratch or install snapshot debian packages:

* https://s-opensource.org/2018/03/13/using-iotjs-raspberrypi0/


#### ON DOCKER ####


https://hub.docker.com/_/debian/


#### ON ARTIK710: ####

Several OS are supported on this device, 
but for now we'll use Debian in a docker container mounted on external USB disk (4GB) and an other for swap

```
sudo dnf install docker screen
screen # Press "Ctrl+a c" : to open a new terminal
sudo systemctl stop docker
part="/dev/sda1" # TODO: updated if needed
mnt="/var/lib/docker"
sudo mkfs.ext4 -L mozilla-iot $part # TODO: verify $part variable
sudo mkdir -p "$mnt"
sudo mount "$part" "$mnt"
swap=/dev/sdb1
sudo mkswap $swap
sudo swapon $swap
free
sudo systemctl restart docker
```
Then build container and start service:

```
url=https://github.com/tizenteam/webthing-node
branch=sandbox/rzr/devel/iotjs/master
git clone --recursive --depth 1 -b $branch $url
grep '^FROM ' Dockerfile # Should be arm32v7/debian not debian:latest change it 
sudo docker-compose build
sudo docker-compose up
```

Expected log:
```
Recreating webthingnode_web_1
Attaching to webthingnode_web_1
web_1  | log: Loading platform: artik710
web_1  | Usage:
web_1  | /usr/bin/iotjs example/platform/index.js [port]
web_1  | Try:
web_1  | curl -H "Accept: application/json" http://localhost:8888
web_1  |
web_1  | log: SW404 ready:null
web_1  | log: SW403 ready:null
web_1  | log: gpio: RedLed: ready? (null expected): null
web_1  | log: gpio: BlueLed: ready? (null expected): null
web_1  | log: gpio: SW404: update: true
(...)
web_1  | log: gpio: BlueLed: writing: true
(...)
(... user hit Ctrl+C ...)
Gracefully stopping... (press Ctrl+C again to force)
Stopping webthingnode_web_1 ...
Stopping webthingnode_web_1 ... done
```

Test in an other shell:

```
curl http://localhost:8888
{"name":"ARTIK710","href":"/","type":"SDB","properties":{"BlueLed":{"@type":"OnOffProperty","label":"On/Off: BlueLed","type":"boolean","description":"Blue LED on ARTIK710 interposer board (on GPIO38)","href":"/properties/BlueLed"},"RedLed":{"@type":"OnOffProperty","label":"On/Off: RedLed","type":"boolean","description":"Red LED on ARTIK710 interposer board (on GPIO28)","href":"/properties/RedLed"},"SW403":{"@type":"BooleanProperty","label":"On/Off: SW403","type":"boolean","description":"Up Button: Nearest board edge, next to red LED (on GPIO30)","href":"/properties/SW403"},"SW404":{"@type":"BooleanProperty","label":"On/Off: SW404","type":"boolean","description":"Down Button: Next to blue LED (on GPIO32)","href":"/properties/SW404"}},"links":[{"rel":"properties","href":"/properties"}],"description":"A web connected ARTIK05x"}b
```


### USING TIZENRT: ###

IoT.js is part of Tizen:RT, but current release is oudated, 
so it needs to be updated:

* https://github.com/Samsung/TizenRT/pull/2018

#### ON ARTIK05X: ###

I made some script helpers to rebuild it all with a single make command,
this work is still in progress.

```
url=https://github.com/tizenteam/tizenrt
branch=sandbox/rzr/devel/webthing/master
git clone --recursive --depth 1 -b $branch $url
make demo

```

### USING NODEJS: ###

For debuging purposes, code is also compatible with nodejs but with stubbed IO function,
in longer term I plan to align iotjs API for IO modules for node.

TODO: upstream into webthing-node (reusable part)


### USING SENSORS: ###

TODO: This part is not ready, as some changes are not merged upstream

https://github.com/rzr/mozilla-iot-generic-sensors-adapter/

Check supported sensors in this high level wrapper to drivers:

https://github.com/rzr/generic-sensors-lite

For now I recommend to use either BH1650 or BMP082 modules,
community implemented drivers, 
which are suported by NPM community, 
since my fixes were upstreamed.


### EXTRA: Compare to ARDUINO ###

Developing webthing on ardunino or compatible platforms
such as Espressif ESP8266 or ESP32

Once your have setup build tool, 
Developing is pretty straight forward, and it has been covered earlier:

https://s-opensource.org/2018/06/21/webthing-iotjs/

https://github.com/mozilla-iot/webthing-arduino

The RGB Lamp code is upstreamed at:
https://github.com/mozilla-iot/webthing-arduino/tree/master/examples/RGBLamp

Since I shared a slightly more adavanced example that handle ADC port,
it was used to monitor the moisture of the ground of a plant.

Hardware side, I used an Arduino mega with Ethernet Shield 
(<a href='https://www.slideshare.net/SamsungOSG/iotivity-tutorial-prototyping-iot-devices-on-gnulinux/41'>same one in this IoTivity 1.2 "arduino switch" demo</a>) 
A moisture sensor is just plugged on analog pin (and +5v GND, the digital pin was not used here, but it can be used for other boards without analog like RaspberryPi and use potentientiomer as "hardware threshold").

Check code and instructions upsteam:

https://github.com/mozilla-iot/webthing-arduino/tree/master/examples/LevelSensor



## REFERENCES: ##

* https://s-opensource.org/2018/06/21/webthing-iotjs/
* https://s-opensource.org/2018/03/13/using-iotjs-raspberrypi0/
