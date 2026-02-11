try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body (ConvertTo-Json @{email="farmer3@gmail.com";password="password123"}) -Headers @{"Content-Type"="application/json"}
    Write-Host "Login Success"
} catch {
    Write-Host "Login Failed: $($_.Exception.Message)"
    if ($_.Exception.Response) {
       $reader = New-Object System.IO.StreamReader $_.Exception.Response.GetResponseStream()
       Write-Host "Response Body: $($reader.ReadToEnd())"
    } else {
        Write-Host "No response body."
    }
}
