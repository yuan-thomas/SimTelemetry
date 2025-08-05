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
docker run -d -p 8080:8080 -p 20127:20127/udp ghcr.io/yuan-thomas/simtelemetry

# 