# === Parameters ===
param(
    [string]$Target = "ws://localhost:8080/telemetry",
    [int]$PollIntervalMs = 10
)

# === Config ===
$pollIntervalMs = $PollIntervalMs

# === Dynamic Size Detection Function ===
function Get-MemoryMapSize($memoryMappedFile) {
    try {
        # Get the capacity of the memory mapped file
        $capacity = $memoryMappedFile.SafeMemoryMappedFileHandle.DangerousGetHandle()
        # For Windows memory mapped files, we need to use a different approach
        # Create a view accessor and find the actual size by testing read boundaries
        $testView = $memoryMappedFile.CreateViewAccessor()
        
        # Start with a reasonable upper bound and binary search
        $maxSize = 16 * 1024 * 1024  # 16MB upper bound
        $minSize = 0
        $actualSize = 1024  # Default fallback
        
        # Binary search to find actual size
        while ($minSize -le $maxSize) {
            $midSize = [Math]::Floor(($minSize + $maxSize) / 2)
            try {
                $testByte = 0
                $testView.Read($midSize - 1, [ref]$testByte)
                $minSize = $midSize + 1
                $actualSize = $midSize
            } catch {
                $maxSize = $midSize - 1
            }
        }
        
        $testView.Dispose()
        return $actualSize
    } catch {
        Write-Warning "Could not determine size for memory mapped file: $_"
        return 1024  # Fallback size
    }
}

# === Function to wait for memory maps ===
function Wait-ForMemoryMap($name) {
    while ($true) {
        try {
            return [System.IO.MemoryMappedFiles.MemoryMappedFile]::OpenExisting($name)
        } catch {
            Write-Host "Waiting for memory map '$name'... (is the game running?)"
            Start-Sleep -Seconds 1
        }
    }
}

# === Wait for ACC to be running ===
Add-Type -AssemblyName System.IO.MemoryMappedFiles

$physMMF = Wait-ForMemoryMap "acpmf_physics"
$graphMMF = Wait-ForMemoryMap "acpmf_graphics"
$staticMMF = Wait-ForMemoryMap "acpmf_static"

$physView = $physMMF.CreateViewAccessor()
$graphView = $graphMMF.CreateViewAccessor()
$staticView = $staticMMF.CreateViewAccessor()

# === Get Dynamic Sizes ===
$sizePhysics = Get-MemoryMapSize $physMMF
$sizeGraphic = Get-MemoryMapSize $graphMMF
$sizeStatic = Get-MemoryMapSize $staticMMF

Write-Host "Detected sizes - Physics: $sizePhysics, Graphics: $sizeGraphic, Static: $sizeStatic"

# === WebSocket Client ===
Add-Type -AssemblyName System.Net.WebSockets
Add-Type -AssemblyName System.Threading.Tasks

$webSocket = New-Object System.Net.WebSockets.ClientWebSocket
$cancellationToken = [System.Threading.CancellationToken]::None

try {
    $uri = [System.Uri]::new($Target)
    $connectTask = $webSocket.ConnectAsync($uri, $cancellationToken)
    $connectTask.Wait()
    Write-Host "Connected to WebSocket: $Target"
} catch {
    Write-Error "Failed to connect to WebSocket $Target : $_"
    exit 1
}

# === Packet Type Constants ===
$PACKET_TYPE_PHYSICS = 1
$PACKET_TYPE_GRAPHICS = 2
$PACKET_TYPE_STATIC = 3

# === WebSocket Send Function ===
function Send-WebSocketData($data, $packetType) {
    try {
        # Create new array with packet type byte at the front
        $packetWithType = New-Object byte[] ($data.Length + 1)
        $packetWithType[0] = $packetType
        [Array]::Copy($data, 0, $packetWithType, 1, $data.Length)
        
        $buffer = [System.ArraySegment[byte]]::new($packetWithType)
        $sendTask = $webSocket.SendAsync($buffer, [System.Net.WebSockets.WebSocketMessageType]::Binary, $true, $cancellationToken)
        $null = $sendTask.Wait()
    } catch {
        Write-Warning "Failed to send WebSocket data: $_"
    }
}

# === State Tracking ===
$lastPhysId = -1
$lastGraphId = -1
$lastStaticSession = -1
$staticCheckCounter = 0

# === Helper: Read Int32 from accessor ===
function Read-Int32($accessor, $offset) {
    $value = 0
    $accessor.Read($offset, [ref]$value)
    return $value
}

# === Main Loop ===
try {
while ($true) {
    try {
        $packetIdPhys = Read-Int32 $physView 0
        if ($packetIdPhys -ne $lastPhysId) {
            $physBytes = New-Object byte[] $sizePhysics
            $null = $physView.ReadArray(0, $physBytes, 0, $sizePhysics)
            Send-WebSocketData $physBytes $PACKET_TYPE_PHYSICS
            $lastPhysId = $packetIdPhys
        }

        $packetIdGraph = Read-Int32 $graphView 0

        if ($packetIdGraph -ne $lastGraphId) {
            $graphBytes = New-Object byte[] $sizeGraphic
            $null = $graphView.ReadArray(0, $graphBytes, 0, $sizeGraphic)
            Send-WebSocketData $graphBytes $PACKET_TYPE_GRAPHICS
            $lastGraphId = $packetIdGraph
        }

        if ($staticCheckCounter -ge (1000 / $pollIntervalMs)) {
            $staticSession = Read-Int32 $staticView 0x1C
            if ($staticSession -ne $lastStaticSession) {
                $staticBytes = New-Object byte[] $sizeStatic
                $null = $staticView.ReadArray(0, $staticBytes, 0, $sizeStatic)
                Send-WebSocketData $staticBytes $PACKET_TYPE_STATIC
                $lastStaticSession = $staticSession
            }
            $staticCheckCounter = 0
        } else {
            $staticCheckCounter++
        }

    } catch {
        Write-Warning "Error reading shared memory: $_"
    }

    Start-Sleep -Milliseconds $pollIntervalMs
}
}

# === Cleanup ===
finally {
    if ($webSocket -and $webSocket.State -eq [System.Net.WebSockets.WebSocketState]::Open) {
        try {
            $closeTask = $webSocket.CloseAsync([System.Net.WebSockets.WebSocketCloseStatus]::NormalClosure, "Script ending", $cancellationToken)
            $closeTask.Wait(1000)  # Wait up to 1 second for graceful close
        } catch {
            Write-Warning "Error closing WebSocket: $_"
        }
    }
    
    if ($physView) { $physView.Dispose() }
    if ($graphView) { $graphView.Dispose() }
    if ($staticView) { $staticView.Dispose() }
    if ($physMMF) { $physMMF.Dispose() }
    if ($graphMMF) { $graphMMF.Dispose() }
    if ($staticMMF) { $staticMMF.Dispose() }
    if ($webSocket) { $webSocket.Dispose() }
    
    Write-Host "Cleanup completed"
}
