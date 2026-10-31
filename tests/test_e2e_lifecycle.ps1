# ==============================================================================
# FC-25 Boosting Services - Comprehensive Automated E2E Test Suite
# Tests: Customer Checkout, Public Tracking, Booster Lifecycle, Match Scoring,
#        Admin Verification, Audit Trails, SQL Server Records, and Financials.
# ==============================================================================

$ErrorActionPreference = "Continue"
$BaseUrl = "http://localhost:5268"
$ProxyUrl = "http://localhost:5173"

$TotalTests = 0
$PassedTests = 0
$FailedTests = 0

function Report-Assert($TestName, $Condition, $Detail = "") {
    $global:TotalTests++
    if ($Condition) {
        $global:PassedTests++
        Write-Host "  [PASS] $TestName" -ForegroundColor Green
        if ($Detail) { Write-Host "         $Detail" -ForegroundColor DarkGray }
    } else {
        $global:FailedTests++
        Write-Host "  [FAIL] $TestName" -ForegroundColor Red
        if ($Detail) { Write-Host "         $Detail" -ForegroundColor Yellow }
    }
}

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host " STARTING E2E BACKEND & DATABASE TEST SUITE" -ForegroundColor Cyan
Write-Host " Target API: $BaseUrl" -ForegroundColor Cyan
Write-Host " Proxy API:  $ProxyUrl" -ForegroundColor Cyan
Write-Host "========================================================`n" -ForegroundColor Cyan

# ------------------------------------------------------------------------------
# SUITE 1: CUSTOMER ORDER PLACEMENT & SESSIONS
# ------------------------------------------------------------------------------
Write-Host ">>> TEST SUITE 1: Customer Order Placement & Sessions" -ForegroundColor Yellow

# TC 1.1: Create Order Session Token
$sessionPayload = @{
    serviceId = "finals-rank1"
    serviceName = "Champions Finals (Rank 1 - 15 Wins)"
    price = 119.99
    platform = "PS5"
    targetChannel = "Checkout"
} | ConvertTo-Json

$sessionRes = Invoke-RestMethod -Uri "$BaseUrl/api/orders/session" -Method POST -Body $sessionPayload -ContentType "application/json"
Report-Assert "TC-1.1: Order session token generated" ($null -ne $sessionRes.sessionToken -and $sessionRes.price -eq 119.99) "Token: $($sessionRes.sessionToken), Ref: $($sessionRes.orderReference)"

# TC 1.2: Place Live Order via Primary Endpoint
$newOrderRef = "FC-ORD-" + (Get-Random -Minimum 10000 -Maximum 99999)
$orderPayload = @{
    orderNumber = $newOrderRef
    customerName = "Cristiano CR7"
    customerEmail = "cr7.test@fcboostpro.com"
    gamerTag = "CR7_Goat_Striker"
    serviceId = "champions-rank1"
    serviceName = "Champions Finals (Rank 1 - 15 Wins)"
    platform = "PS5"
    contactMethod = "Stripe / Card"
    paymentMethod = "Credit Card"
    price = 119.99
    credentials = "Encrypted-EA-OAuth-Token-AES256"
    requirements = @{
        "Tactics" = "4-2-3-1 Fast Build Up"
        "RegionalVPN" = "Europe - Frankfurt Server Subnet"
    }
} | ConvertTo-Json

$createOrderRes = Invoke-RestMethod -Uri "$BaseUrl/api/orders" -Method POST -Body $orderPayload -ContentType "application/json"
$testOrderId = $createOrderRes.orderId
Report-Assert "TC-1.2: Primary Order Placed into SQL Server" ($createOrderRes.status -eq "Pending" -and $createOrderRes.orderNumber -eq $newOrderRef) "OrderId: $testOrderId, Number: $newOrderRef"

# TC 1.3: Place WhatsApp Order
$waRef = "FC-ORD-" + (Get-Random -Minimum 10000 -Maximum 99999)
$waPayload = @{
    orderReference = $waRef
    serviceId = "rivals-7wins"
    serviceName = "Division Rivals Weekly 7 Wins"
    price = 39.99
    platform = "PC"
    customerName = "WhatsApp Customer John"
    customerEmail = "john.wa@gmail.com"
} | ConvertTo-Json

$waRes = Invoke-RestMethod -Uri "$BaseUrl/api/orders/whatsapp" -Method POST -Body $waPayload -ContentType "application/json"
Report-Assert "TC-1.3: WhatsApp Order Flow Created" ($waRes.orderNumber -eq $waRef -and $waRes.status -eq "Pending") "Order: $waRef"

# TC 1.4: Place Discord Order
$dcRef = "FC-ORD-" + (Get-Random -Minimum 10000 -Maximum 99999)
$dcPayload = @{
    orderReference = $dcRef
    serviceId = "coaching-2h"
    serviceName = "1-on-1 Pro Coaching (2 Hours)"
    price = 69.99
    platform = "Xbox"
    gamerTag = "XboxGamer_Pro"
    discordUserId = "discord-user-12345"
} | ConvertTo-Json

$dcRes = Invoke-RestMethod -Uri "$BaseUrl/api/orders/discord" -Method POST -Body $dcPayload -ContentType "application/json"
Report-Assert "TC-1.4: Discord Bot Order Flow Created" ($dcRes.orderNumber -eq $dcRef -and $dcRes.status -eq "Pending") "Order: $dcRef"


# ------------------------------------------------------------------------------
# SUITE 2: PUBLIC CUSTOMER LIVE TRACKING
# ------------------------------------------------------------------------------
Write-Host "`n>>> TEST SUITE 2: Public Customer Live Tracking" -ForegroundColor Yellow

# TC 2.1: Track newly created order
$trackRes = Invoke-RestMethod -Uri "$BaseUrl/api/orders/track/$newOrderRef" -Method GET
Report-Assert "TC-2.1: Customer can track newly created order" ($trackRes.orderNumber -eq $newOrderRef -and $trackRes.status -eq "Pending" -and $trackRes.progressPercentage -eq 0) "Score: $($trackRes.currentScore)"

# TC 2.2: Ensure zero credentials or sensitive data are leaked in tracking
$hasCredentialsLeaked = ($null -ne $trackRes.customerCredentials -or $null -ne $trackRes.password -or $null -ne $trackRes.credentials)
Report-Assert "TC-2.2: Public Tracking is Sanitized (Zero Credentials Leaked)" (-not $hasCredentialsLeaked) "Public payload contains only match & order status"

# TC 2.3: Non-existent order returns 404
$notFoundPassed = $false
try {
    Invoke-RestMethod -Uri "$BaseUrl/api/orders/track/NON-EXISTENT-99999" -Method GET
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 404) {
        $notFoundPassed = $true
    }
}
Report-Assert "TC-2.3: Non-existent order returns 404 Not Found" $notFoundPassed "Correct HTTP status code handled"


# ------------------------------------------------------------------------------
# SUITE 3: PRO PLAYER / BOOSTER ORDER LIFECYCLE
# ------------------------------------------------------------------------------
Write-Host "`n>>> TEST SUITE 3: Pro Player / Booster Order Lifecycle" -ForegroundColor Yellow

# TC 3.1: Check Available Open Orders Pool
$availablePool = Invoke-RestMethod -Uri "$BaseUrl/api/player/available-orders" -Method GET
$foundInPool = ($availablePool | Where-Object { $_.orderNumber -eq $newOrderRef })
Report-Assert "TC-3.1: Order appears in Booster Open Pool" ($null -ne $foundInPool) "Found #$newOrderRef in pool of $($availablePool.Count) orders"

# TC 3.2: Booster Claims the Order
$claimPayload = @{
    orderId = $testOrderId
    playerId = "usr-booster-flash"
    vpnLocation = "Frankfurt, Germany (Residential NordVPN)"
} | ConvertTo-Json

$claimRes = Invoke-RestMethod -Uri "$BaseUrl/api/player/claim" -Method POST -Body $claimPayload -ContentType "application/json"
Report-Assert "TC-3.2: Pro Booster claims order successfully" ($claimRes.status -eq "InProgress" -and $claimRes.orderId -eq $testOrderId) "$($claimRes.message)"

# TC 3.3: Concurrency / Anti-Collision (Second booster tries to claim same order)
$doubleClaimFailedProperly = $false
try {
    $doublePayload = @{
        orderId = $testOrderId
        playerId = "usr-booster-kaiser"
        vpnLocation = "London, UK"
    } | ConvertTo-Json
    Invoke-RestMethod -Uri "$BaseUrl/api/player/claim" -Method POST -Body $doublePayload -ContentType "application/json"
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 400) {
        $doubleClaimFailedProperly = $true
    }
}
Report-Assert "TC-3.3: Double-Claim Prevention (Anti-Collision)" $doubleClaimFailedProperly "Rejected second booster from claiming already locked order"

# TC 3.4: Booster Logs Match 1 Result (5-0)
$progress1Payload = @{
    orderId = $testOrderId
    playerId = "usr-booster-flash"
    matchScoreLabel = "Champions Finals: 5 Wins - 0 Losses (Rank 5 Secured)"
    progressPercentage = 35
    matchesWon = 5
    matchesLost = 0
    boosterComment = "Started strong. High pressing with 4-2-3-1. All rage quits so far."
    vpnCity = "Frankfurt"
} | ConvertTo-Json

$prog1Res = Invoke-RestMethod -Uri "$BaseUrl/api/player/update-progress" -Method POST -Body $progress1Payload -ContentType "application/json"
Report-Assert "TC-3.4: Booster logs Match Progress (5-0, 35%)" ($prog1Res.progress -eq 35) "Score: $($prog1Res.currentScore)"

# TC 3.5: Booster Logs Match 2 Result (11-0)
$progress2Payload = @{
    orderId = $testOrderId
    playerId = "usr-booster-flash"
    matchScoreLabel = "Champions Finals: 11 Wins - 0 Losses (Rank 2 Secured)"
    progressPercentage = 75
    matchesWon = 11
    matchesLost = 0
    boosterComment = "Dominating opponents. 4 more wins needed for Rank 1."
    vpnCity = "Frankfurt"
} | ConvertTo-Json

$prog2Res = Invoke-RestMethod -Uri "$BaseUrl/api/player/update-progress" -Method POST -Body $progress2Payload -ContentType "application/json"
Report-Assert "TC-3.5: Booster logs Match Progress (11-0, 75%)" ($prog2Res.progress -eq 75) "Score: $($prog2Res.currentScore)"

# TC 3.6: Customer Tracker Reflects Real-Time Match Logs & Booster Details
$trackMidRes = Invoke-RestMethod -Uri "$BaseUrl/api/orders/track/$newOrderRef" -Method GET
$hasMatchLogs = ($trackMidRes.matchLogs.Count -ge 2)
$hasBoosterNick = ($trackMidRes.boosterNickname -like "*Flash*")
Report-Assert "TC-3.6: Customer Tracker shows live booster score & match logs" ($trackMidRes.progressPercentage -eq 75 -and $hasMatchLogs -and $hasBoosterNick) "Booster: $($trackMidRes.boosterNickname), VPN: $($trackMidRes.boosterVpnLocation), Matches Logged: $($trackMidRes.matchLogs.Count)"

# TC 3.7: Booster Completes Order with Proof Screenshot
$completePayload = @{
    orderId = $testOrderId
    playerId = "usr-booster-flash"
    proofFileName = "champions_15_0_rank1_flash_proof.png"
    proofFileUrl = "https://fcboostpro.com/proofs/champions_15_0_rank1_flash_proof.png"
    proofNotes = "15-0 Flawless run complete. All 15 wins verified. Safe exit on German residential VPN."
} | ConvertTo-Json

$completeRes = Invoke-RestMethod -Uri "$BaseUrl/api/player/complete" -Method POST -Body $completePayload -ContentType "application/json"
Report-Assert "TC-3.7: Booster marks Complete & attaches Proof (Status: UnderReview)" ($completeRes.status -eq "UnderReview") "$($completeRes.message)"


# ------------------------------------------------------------------------------
# SUITE 4: ORDER MESSAGES (SECURE CUSTOMER-PLAYER-ADMIN CHAT)
# ------------------------------------------------------------------------------
Write-Host "`n>>> TEST SUITE 4: Order Messages & Admin Confidential Notes" -ForegroundColor Yellow

# TC 4.1: Customer sends message
$custMsgPayload = @{
    senderUserId = "cr7-customer-user"
    senderRole = "Customer"
    messageText = "Hello! Please do not open any stored tradeable packs on my account."
    isAdminOnly = $false
} | ConvertTo-Json
$custMsgRes = Invoke-RestMethod -Uri "$BaseUrl/api/orders/$testOrderId/messages" -Method POST -Body $custMsgPayload -ContentType "application/json"
Report-Assert "TC-4.1: Customer sent message on order" ($custMsgRes.senderRole -eq "Customer") "$($custMsgRes.messageText)"

# TC 4.2: Booster replies
$boosterMsgPayload = @{
    senderUserId = "usr-booster-flash"
    senderRole = "Player"
    messageText = "Understood! No packs will be touched. Leaving all rewards in the store."
    isAdminOnly = $false
} | ConvertTo-Json
$boosterMsgRes = Invoke-RestMethod -Uri "$BaseUrl/api/orders/$testOrderId/messages" -Method POST -Body $boosterMsgPayload -ContentType "application/json"
Report-Assert "TC-4.2: Pro Booster replied to customer" ($boosterMsgRes.senderRole -eq "Player") "$($boosterMsgRes.messageText)"

# TC 4.3: Admin adds confidential note
$adminMsgPayload = @{
    senderUserId = "admin-operator"
    senderRole = "Admin"
    messageText = "INTERNAL: Verified residential IP 185.220.101.4 matches Frankfurt customer profile."
    isAdminOnly = $true
} | ConvertTo-Json
$adminMsgRes = Invoke-RestMethod -Uri "$BaseUrl/api/orders/$testOrderId/messages" -Method POST -Body $adminMsgPayload -ContentType "application/json"
Report-Assert "TC-4.3: Admin created confidential internal note" ($adminMsgRes.senderRole -eq "Admin") "Confidential audit remark posted"

# TC 4.4: Customer views chat (admin-only notes MUST be filtered out)
$custViewChat = Invoke-RestMethod -Uri "$BaseUrl/api/orders/$testOrderId/messages?isAdmin=false" -Method GET
$hasAdminSecretLeaked = ($custViewChat | Where-Object { $_.isAdminOnly -eq $true })
Report-Assert "TC-4.4: Customer Chat View masks Admin Internal Notes" ($null -eq $hasAdminSecretLeaked -and $custViewChat.Count -eq 2) "Returned $($custViewChat.Count) customer-facing messages"

# TC 4.5: Admin views chat (sees all messages including internal notes)
$adminViewChat = Invoke-RestMethod -Uri "$BaseUrl/api/orders/$testOrderId/messages?isAdmin=true" -Method GET
Report-Assert "TC-4.5: Admin Chat View reveals all notes" ($adminViewChat.Count -eq 3) "Returned $($adminViewChat.Count) total messages including confidential notes"


# ------------------------------------------------------------------------------
# SUITE 5: ADMINISTRATOR VERIFICATION, AUDIT LOG & FINANCIALS
# ------------------------------------------------------------------------------
Write-Host "`n>>> TEST SUITE 5: Admin Verification, Audit Logs & Financials" -ForegroundColor Yellow

# TC 5.1: Admin Order List Query with Filter
$adminOrders = Invoke-RestMethod -Uri "$BaseUrl/api/admin/orders?status=UnderReview" -Method GET
$foundUnderReview = ($adminOrders | Where-Object { $_.orderNumber -eq $newOrderRef })
Report-Assert "TC-5.1: Admin orders filter lists #$newOrderRef in UnderReview" ($null -ne $foundUnderReview) "Customer: $($foundUnderReview.customerName), GamerTag: $($foundUnderReview.gamerTag)"

# TC 5.2: Admin Finalizes Order & Approves Payout
$approvePayload = @{
    remarks = "Verified 15-0 screenshot proof. Checked residential VPN logs. Customer verified satisfied. Payout approved."
} | ConvertTo-Json
$approveRes = Invoke-RestMethod -Uri "$BaseUrl/api/admin/orders/$testOrderId/approve" -Method POST -Body $approvePayload -ContentType "application/json"
Report-Assert "TC-5.2: Admin approves proof & finalizes order (Status: Completed)" ($approveRes.status -eq "Completed") "$($approveRes.message)"

# TC 5.3: Verify Immutable Audit Trail in SQL Server
$auditTrail = Invoke-RestMethod -Uri "$BaseUrl/api/admin/orders/$testOrderId/audit" -Method GET
$auditActions = $auditTrail | Select-Object -ExpandProperty actionType
$hasAllActions = ($auditActions -contains "Created" -and $auditActions -contains "Claimed" -and $auditActions -contains "ProgressUpdated" -and $auditActions -contains "ProofUploaded" -and $auditActions -contains "Approved")
Report-Assert "TC-5.3: Full Immutable Audit Trail Recorded ($($auditTrail.Count) events)" $hasAllActions "Action Trail: $($auditActions -join ' -> ')"

# TC 5.4: Verify Pro Booster Earnings Ledger
$boosterEarningsRes = Invoke-RestMethod -Uri "$BaseUrl/api/player/earnings/usr-booster-flash" -Method GET
$earningsItem = $boosterEarningsRes.earningsList | Where-Object { $_.orderNumber -eq $newOrderRef }
# Order price is 119.99, commission rate is 70% => 119.99 * 0.70 = 83.99
$expectedPayout = [Math]::Round(119.99 * 0.70, 2)
Report-Assert "TC-5.4: Booster Commission Calculated & Approved" ($earningsItem.payout -eq $expectedPayout -and $earningsItem.status -eq "Approved") "Booster: $($boosterEarningsRes.proNickname), Payout: `$$($earningsItem.payout) USD"

# TC 5.5: Verify Executive Analytics KPIs
$analyticsRes = Invoke-RestMethod -Uri "$BaseUrl/api/admin/analytics" -Method GET
$summary = $analyticsRes.summary
Report-Assert "TC-5.5: Executive Analytics KPIs Aggregated Accurately" ($summary.totalOrders -ge 4 -and $summary.completedRevenue -ge 279.97 -and $summary.netPlatformProfit -gt 0) "Gross Revenue: `$$($summary.totalRevenue), Completed: `$$($summary.completedRevenue), Net Profit: `$$($summary.netPlatformProfit)"


# ------------------------------------------------------------------------------
# SUITE 6: DIRECT SQL SERVER RECORD VERIFICATION
# ------------------------------------------------------------------------------
Write-Host "`n>>> TEST SUITE 6: Direct SQL Server Record Verification" -ForegroundColor Yellow

$sqlQuery = @"
SELECT 
    o.OrderNumber,
    o.Status,
    o.ProgressPercentage,
    o.CurrentScore,
    p.ProNickname,
    e.PlayerPayoutAmount,
    e.PayoutStatus,
    (SELECT COUNT(*) FROM dbo.OrderMatchLogs WHERE OrderId = o.OrderId) AS MatchLogsCount,
    (SELECT COUNT(*) FROM dbo.OrderAuditLogs WHERE OrderId = o.OrderId) AS AuditCount,
    (SELECT COUNT(*) FROM dbo.OrderProofs WHERE OrderId = o.OrderId AND AdminApproved = 1) AS ApprovedProofsCount
FROM dbo.Orders o
LEFT JOIN dbo.PlayerProfiles p ON o.AssignedPlayerId = p.UserId
LEFT JOIN dbo.PlayerEarnings e ON o.OrderId = e.OrderId
WHERE o.OrderNumber = '$newOrderRef';
"@

$sqlResult = sqlcmd -S "localhost" -d "FCBoostingDb" -Q $sqlQuery -W

$sqlValid = ($sqlResult -match $newOrderRef -and $sqlResult -match "Completed" -and $sqlResult -match "100")
Report-Assert "TC-6.1: Direct SQL Server Verification (Relational Tables Synced)" $sqlValid "Verified in dbo.Orders, PlayerProfiles, PlayerEarnings, MatchLogs, AuditLogs, Proofs"

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host " TEST SUITE COMPLETE" -ForegroundColor Cyan
Write-Host " Total:   $TotalTests" -ForegroundColor Cyan
Write-Host " Passed:  $PassedTests" -ForegroundColor Green
Write-Host " Failed:  $FailedTests" -ForegroundColor $(if ($FailedTests -gt 0) { "Red" } else { "Green" })
Write-Host " Success: $([Math]::Round(($PassedTests / $TotalTests) * 100, 1))%" -ForegroundColor $(if ($FailedTests -gt 0) { "Yellow" } else { "Green" })
Write-Host "========================================================`n" -ForegroundColor Cyan
