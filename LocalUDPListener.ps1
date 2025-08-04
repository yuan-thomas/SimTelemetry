# Requires PowerShell 7+

param(
    [int]$udpPort = 9000,
    [string]$webSocketUri = "ws://localhost:8080/telemetry"
)

$udpClient = [System.Net.Sockets.UdpClient]::new($udpPort)
$remoteEndPoint = [ref]([System.Net.IPEndPoint]::new([System.Net.IPAddress]::Any, 0))

$wsClient = [System.Net.WebSockets.ClientWebSocket]::new()
$wsClient.Options.KeepAliveInterval = [TimeSpan]::FromSeconds(30)
$uri = [System.Uri]::new($webSocketUri)

try {
    Write-Host "Connecting to WebSocket server $webSocketUri..."
    $wsClient.ConnectAsync($uri, [Threading.CancellationToken]::None).Wait()
    Write-Host "Connected to WebSocket."

    while ($true) {
        $udpBytes = $udpClient.Receive($remoteEndPoint)
        $byteCount = $udpBytes.Length

	# Write-Host "Received bytes..." $byteCount 

        $segment = [System.ArraySegment[byte]]::new($udpBytes)
        $wsClient.SendAsync(
            $segment,
            [System.Net.WebSockets.WebSocketMessageType]::Binary,
            $true,
            [Threading.CancellationToken]::None
        ).Wait()
    }
}
catch {
    Write-Error "Error: $($_.Exception.Message)"
    if ($_.Exception.InnerException) {
        Write-Error "Inner Exception: $($_.Exception.InnerException.Message)"
    }
}
finally {
    if ($wsClient.State -eq [System.Net.WebSockets.WebSocketState]::Open) {
        $wsClient.CloseAsync(
            [System.Net.WebSockets.WebSocketCloseStatus]::NormalClosure,
            "Closing",
            [Threading.CancellationToken]::None
        ).Wait()
    }
    $udpClient.Close()
    Write-Host "Closed connections."
}
