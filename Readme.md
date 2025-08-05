# What is it?
SimTelemtry is a React.JS based web application that captures Data Out from various sim racing platforms and produce real-time telemetry on devices of your choice.

![Demo animation](docs/demo.gif)

# Supported games
- Forza Motorsport 2023 (tested)
- Forza Horizon 4/5 (tested)
- EA F1 2024 (data capture tested, telemetry config created)
- EA F1 2025 (data capture written but not tested, because I don't own this game)

# Supported scenarios

# How to run
## 1. Start server:
docker run -d -p 8080:8080 -p 20127:20127/udp ghcr.io/yuan-thomas/simtelemetry

This will start the server application and expose two services:
- Web application at: http://server_ip_address:8080
- Data Out listener at: server_ip_address:20127

## 2. Game config:
### 2.1 Forza series (including Motorsport 2023, Horizon 4/5) and EA F1 2024/2025:
Go to game setting and set the data out destination to: server_ip_address and port 20127

#### 2.1.1 Special instruction for Forza Horizon 4 on Windows
Because Forza Horizon 4 is a UWP, you will need to run as Administrator this command to set up loopback exemption:
CheckNetIsolation LoopbackExempt -a -n="Microsoft.SunriseBaseGame_8wekyb3d8bbwe"

### 2.2 Assetto Corsa series (including AC, ACC, AC Evo)
Assetto Corsa does not actively send data out. Instead, its telemetry data can be accessed via Shared Memory Files. Therefore we need a script to read these files and send to our server.

Steps:
1. Open the content of AssettoCorsaReader.ps1 at https://github.com/yuan-thomas/SimTelemetry/blob/main/AssettoCorsaReader.ps1
2. Copy its full raw content and paste it to text editor (Notepad)
3. Change the third line address to: ws://server_ip_address:8080/telemetry
4. Open Windows Powershell
5. Copy & paste modified raw content into Powershell and run

## 3. Start telemetry app
Grab your device (that has a screen and browser), open the browser and visit: http://server_ip_address:8080
You should see the app launched

Expand its setting and choose the game.

Start the race and you should see the telemetry starts moving.

Tips: you can attach multiple devices/screens, each showing different charts.