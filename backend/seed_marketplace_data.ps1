$headers = @{ "Content-Type" = "application/json" }
$loginBody = @{ email = "farmer@farmx.com"; password = "farmer123" } | ConvertTo-Json

try {
    Write-Host "Logging in as Farmer..."
    $auth = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $loginBody -Headers $headers
    $token = $auth.token
    
    if (-not $token) {
        throw "Login failed: No token received."
    }
    Write-Host "Success! Token received."

    $cropBody = @{
        cropName = "Premium Wheat"
        quantity = 1000
        unit = "KG"
        harvestDate = "2026-02-01"
        availableForSale = $true
        pricePerUnit = 50
        location = "Punjab"
        cropType = "Grain"
        description = "High quality verified harvest."
    } | ConvertTo-Json -Depth 10

    $authHeaders = @{ 
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $token"
    }

    Write-Host "Registering Crop..."
    $crop = Invoke-RestMethod -Uri "http://localhost:8080/api/crops/add" -Method Post -Body $cropBody -Headers $authHeaders
    
    Write-Host "---------------------------------------------------"
    Write-Host "SUCCESS! Seeded Crop: $($crop.cropName)"
    Write-Host "Status: Available for Sale = $($crop.availableForSale)"
    Write-Host "---------------------------------------------------"
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode)"
    }
}
