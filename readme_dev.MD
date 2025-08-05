docker run --name forza-telemetry-js -it -p 20127:20127/udp -p 8050:5173 -p 8765:8765 -v d:/Projects/ForzaMotorsport/js:/workspace node bash
docker run --name forza-telemetry-js -it -p 8050:5173 -p 8765:8765 -v d:/Projects/ForzaMotorsport/js:/workspace node bash

npm install -D @vitejs/plugin-react

npm install react react-dom plotly.js-dist-min react-plotly.js
npm install -D vite typescript @types/react @types/react-dom @vitejs/plugin-react


npm run dev


Forza Horizon 4 to set up loopback exemption:
CheckNetIsolation LoopbackExempt -a -n="Microsoft.SunriseBaseGame_8wekyb3d8bbwe"

To Run Powershell:
https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-7.5

Set-ExecutionPolicy -ExecutionPolicy RemoteSigned