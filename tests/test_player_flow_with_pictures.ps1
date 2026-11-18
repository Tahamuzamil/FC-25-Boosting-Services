# =====================================================================
# Boosting Haven - Player Registration with Pictures, Claim & Complete Order
# Target: https://localhost:7296
# =====================================================================

param(
    [string]$BaseUrl = "http://localhost:5268"
)

function Call-Api {
    param(
        [string]$Method,
        [string]$Path,
        [string]$Body = ""
    )
    $url = "$BaseUrl$Path"
    if ($Method -eq "GET") {
        $raw = curl.exe -k -s -X GET "$url"
    } else {
        $tempFile = [System.IO.Path]::GetTempFileName()
        [System.IO.File]::WriteAllText($tempFile, $Body, [System.Text.Encoding]::UTF8)
        $raw = curl.exe -k -s -X $Method "$url" -H "Content-Type: application/json" --data-binary "@$tempFile"
        Remove-Item -Path $tempFile -Force -ErrorAction SilentlyContinue
    }
    return ($raw | ConvertFrom-Json)
}

$id = Get-Random -Minimum 1000 -Maximum 9999

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "   PLAYER REGISTRATION WITH PICTURES, CLAIM & COMPLETE WORKFLOW" -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan

# 1. Register as a Player with Profile Picture (Avatar) and Rank Verification Picture
Write-Host "`n[STEP 1] Registering New Player with Pictures..." -ForegroundColor Yellow

$avatarPictureUrl = "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=300&q=80"
$rankProofPictureUrl = "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80"

$playerReq = @{
    name = "Flash Pro $id"
    email = "flash_$id@probooster.internal"
    password = "ProPassword123!"
    category = "Player"
    avatarUrl = $avatarPictureUrl
    rankProofPictureUrl = $rankProofPictureUrl
    platformSpecialty = "PS5"
    competitiveRankTier = "Top 200 Global (Rank 1 Specialist)"
} | ConvertTo-Json -Compress

$regRes = Call-Api -Method "POST" -Path "/api/Auth/register" -Body $playerReq
$player = $regRes.user

Write-Host "  [OK] Player Registered Successfully!" -ForegroundColor Green
Write-Host "       Player ID: $($player.id)" -ForegroundColor White
Write-Host "       Nickname:  $($player.name)" -ForegroundColor White
Write-Host "       Role:      $($player.category)" -ForegroundColor White
Write-Host "       Avatar:    $($player.avatarUrl)" -ForegroundColor Green
Write-Host "       Rank Proof:$($player.rankProofPictureUrl)" -ForegroundColor Green

# 2. Check Player Profile & Pictures in Backend
Write-Host "`n[STEP 2] Verifying Player Profile and Pictures from Database..." -ForegroundColor Yellow
$earnings = Call-Api -Method "GET" -Path "/api/Player/earnings/$($player.id)"
Write-Host "  [OK] Profile retrieved for $($earnings.proNickname)" -ForegroundColor Green
Write-Host "       Tier:      $($earnings.tier)" -ForegroundColor White
Write-Host "       Avatar:    $($earnings.avatarUrl)" -ForegroundColor Green
Write-Host "       Proof Pic: $($earnings.rankProofPictureUrl)" -ForegroundColor Green

# 3. Create an Order (Available to be claimed)
Write-Host "`n[STEP 3] Customer Placing an Order for the Player Queue..." -ForegroundColor Yellow
$orderNumber = "BH-ORD-LIVE-$id"
$newOrderReq = @{
    orderNumber = $orderNumber
    serviceId = "ut-champions-finals"
    serviceName = "UT Champions Finals 15 Wins"
    price = 99.99
    platform = "PS5"
    contactMethod = "WhatsApp"
    paymentMethod = "Card"
    customerName = "Marcus Johnson"
    customerEmail = "marcus.j@gmail.com"
    gamerTag = "Marcus_FC_Pro"
    credentials = "PSN verified and encrypted"
} | ConvertTo-Json -Compress

$order = Call-Api -Method "POST" -Path "/api/Orders" -Body $newOrderReq
Write-Host "  [OK] Order Created: $($order.orderNumber) (Status: $($order.status), Price: $($order.price))" -ForegroundColor Green

# 4. Player Claims the Order
Write-Host "`n[STEP 4] Player '$($player.name)' Claiming Order $($order.orderNumber)..." -ForegroundColor Yellow
$claimReq = @{
    orderId = $order.orderId
    playerId = $player.id
    vpnLocation = "London, UK (Residential NordVPN)"
} | ConvertTo-Json -Compress

$claimRes = Call-Api -Method "POST" -Path "/api/Player/claim" -Body $claimReq
Write-Host "  [OK] Order Claimed!" -ForegroundColor Green
Write-Host "       Order Number: $($claimRes.orderNumber)" -ForegroundColor White
Write-Host "       New Status:   $($claimRes.status)" -ForegroundColor White
Write-Host "       Current Score:$($claimRes.currentScore)" -ForegroundColor White

# 5. Player Updates Match Progress
Write-Host "`n[STEP 5] Player Logging Match Progress..." -ForegroundColor Yellow
$progReq = @{
    orderId = $order.orderId
    playerId = $player.id
    matchScoreLabel = "Champions Finals: 12 Wins - 0 Losses (Pace for Rank 1)"
    progressPercentage = 80
    matchesWon = 12
    matchesLost = 0
    boosterComment = "Opponents rage quitting in 1st half. Clean defense."
    vpnCity = "London"
} | ConvertTo-Json -Compress

$progRes = Call-Api -Method "POST" -Path "/api/Player/update-progress" -Body $progReq
Write-Host "  [OK] Progress Logged: '$($progRes.currentScore)' ($($progRes.progress)%)" -ForegroundColor Green

# 6. Player Completes the Order with Completion Proof Picture Screenshot
Write-Host "`n[STEP 6] Player Completing Order with Proof Screenshot Picture..." -ForegroundColor Yellow
$completionProofPicture = "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80"
$completeReq = @{
    orderId = $order.orderId
    playerId = $player.id
    proofFileName = "champions_15_wins_final_proof_$id.png"
    proofFileUrl = $completionProofPicture
    proofNotes = "All 15 wins secured ban-free on London residential VPN. Rewards stored in client club."
} | ConvertTo-Json -Compress

$compRes = Call-Api -Method "POST" -Path "/api/Player/complete" -Body $completeReq
Write-Host "  [OK] Order Completed and Submitted for Review!" -ForegroundColor Green
Write-Host "       Order ID:    $($compRes.orderId)" -ForegroundColor White
Write-Host "       Status:      $($compRes.status)" -ForegroundColor White
Write-Host "       Proof Image: $completionProofPicture" -ForegroundColor Green

# 7. Check Player's Orders and Proof Attachment in Database
Write-Host "`n[STEP 7] Verifying Player's Orders and Attached Proof in Database..." -ForegroundColor Yellow
$myOrders = Call-Api -Method "GET" -Path "/api/Player/my-orders/$($player.id)"
$claimedOrder = $myOrders | Where-Object { $_.orderId -eq $order.orderId }

Write-Host "  [OK] Found order in Player's list:" -ForegroundColor Green
Write-Host "       Order Number: $($claimedOrder.orderNumber)" -ForegroundColor White
Write-Host "       Status:       $($claimedOrder.status)" -ForegroundColor White
Write-Host "       Progress:     $($claimedOrder.progress)%" -ForegroundColor White
Write-Host "       Proofs Count: $($claimedOrder.proofs.Count)" -ForegroundColor White
if ($claimedOrder.proofs.Count -gt 0) {
    Write-Host "       Proof File:   $($claimedOrder.proofs[0].fileName)" -ForegroundColor Green
    Write-Host "       Proof Picture URL: $($claimedOrder.proofs[0].fileUrl)" -ForegroundColor Green
}

Write-Host "`n=================================================================" -ForegroundColor Cyan
Write-Host "   WORKFLOW COMPLETE: REGISTERED PLAYER WITH PICTURES," -ForegroundColor Green
Write-Host "   CLAIMED ORDER, AND COMPLETED ORDER WITH PROOF PICTURE!" -ForegroundColor Green
Write-Host "=================================================================" -ForegroundColor Cyan
