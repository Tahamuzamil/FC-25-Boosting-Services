-- ==============================================================
-- FC BOOST PRO - Complete Production SQL Database Architecture
-- Comprehensive Tables, Stored Procedures, Views & Sample Seed Data
-- Database: FCBoostingDb (SQL Server 2019/2022/LocalDB)
-- ==============================================================

USE [FCBoostingDb];
GO

-- 1. Ensure columns exist on dbo.Users
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('dbo.Users') AND name = 'Role')
BEGIN
    ALTER TABLE dbo.Users ADD Role NVARCHAR(50) NOT NULL DEFAULT 'Customer';
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('dbo.Users') AND name = 'Phone')
BEGIN
    ALTER TABLE dbo.Users ADD Phone NVARCHAR(50) NULL;
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('dbo.Users') AND name = 'PasswordHash')
BEGIN
    ALTER TABLE dbo.Users ADD PasswordHash NVARCHAR(MAX) NULL;
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('dbo.Users') AND name = 'Status')
BEGIN
    ALTER TABLE dbo.Users ADD Status NVARCHAR(50) NOT NULL DEFAULT 'Active';
END
GO

-- 2. Alter dbo.Orders to add player assignment, live match progress, and security fields
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('dbo.Orders') AND name = 'AssignedPlayerId')
BEGIN
    ALTER TABLE dbo.Orders ADD AssignedPlayerId NVARCHAR(450) NULL;
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('dbo.Orders') AND name = 'AssignedAt')
BEGIN
    ALTER TABLE dbo.Orders ADD AssignedAt DATETIME2 NULL;
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('dbo.Orders') AND name = 'StartedAt')
BEGIN
    ALTER TABLE dbo.Orders ADD StartedAt DATETIME2 NULL;
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('dbo.Orders') AND name = 'CurrentScore')
BEGIN
    ALTER TABLE dbo.Orders ADD CurrentScore NVARCHAR(200) NULL DEFAULT 'Awaiting Booster Assignment';
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('dbo.Orders') AND name = 'ProgressPercentage')
BEGIN
    ALTER TABLE dbo.Orders ADD ProgressPercentage INT NOT NULL DEFAULT 0;
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('dbo.Orders') AND name = 'BoosterVpnLocation')
BEGIN
    ALTER TABLE dbo.Orders ADD BoosterVpnLocation NVARCHAR(150) NULL;
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('dbo.Orders') AND name = 'CustomerCredentialsEncrypted')
BEGIN
    ALTER TABLE dbo.Orders ADD CustomerCredentialsEncrypted NVARCHAR(MAX) NULL;
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('dbo.Orders') AND name = 'AdminRemarks')
BEGIN
    ALTER TABLE dbo.Orders ADD AdminRemarks NVARCHAR(MAX) NULL;
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('dbo.Orders') AND name = 'PaymentMethod')
BEGIN
    ALTER TABLE dbo.Orders ADD PaymentMethod NVARCHAR(50) NULL DEFAULT 'WhatsApp / Card';
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('dbo.Orders') AND name = 'PaymentStatus')
BEGIN
    ALTER TABLE dbo.Orders ADD PaymentStatus NVARCHAR(50) NOT NULL DEFAULT 'Paid';
END
GO

-- Add Foreign Key to AssignedPlayerId if not present
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Orders_AssignedPlayer')
BEGIN
    ALTER TABLE dbo.Orders ADD CONSTRAINT FK_Orders_AssignedPlayer 
    FOREIGN KEY (AssignedPlayerId) REFERENCES dbo.Users(UserId);
END
GO

-- 3. Create dbo.PlayerProfiles (Pro Boosters & Coaches Profile)
IF OBJECT_ID('dbo.PlayerProfiles', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.PlayerProfiles (
        ProfileId INT IDENTITY(1,1) PRIMARY KEY,
        UserId NVARCHAR(450) NOT NULL UNIQUE FOREIGN KEY REFERENCES dbo.Users(UserId) ON DELETE CASCADE,
        ProNickname NVARCHAR(100) NOT NULL,
        PlatformSpecialty NVARCHAR(50) NOT NULL DEFAULT 'PS5', -- 'PS5', 'Xbox', 'PC', 'Cross-Platform'
        CompetitiveRankTier NVARCHAR(100) NOT NULL DEFAULT 'Top 200 Global',
        WeekendLeagueAverageWins INT NOT NULL DEFAULT 15,
        WinRatePercentage DECIMAL(5,2) NOT NULL DEFAULT 98.50,
        TotalCompletedOrders INT NOT NULL DEFAULT 0,
        ActiveOrdersCount INT NOT NULL DEFAULT 0,
        MaxConcurrentOrders INT NOT NULL DEFAULT 2,
        IsAvailable BIT NOT NULL DEFAULT 1,
        CommissionRate DECIMAL(5,2) NOT NULL DEFAULT 70.00, -- 70% to player, 30% platform
        TotalEarned DECIMAL(18,2) NOT NULL DEFAULT 0.00,
        VpnResidentialCountry NVARCHAR(100) NOT NULL DEFAULT 'United Kingdom',
        DiscordHandle NVARCHAR(100) NULL,
        ApplicationStatus NVARCHAR(50) NOT NULL DEFAULT 'Approved', -- 'Pending', 'Approved', 'Suspended'
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
    );

    CREATE NONCLUSTERED INDEX IX_PlayerProfiles_UserId ON dbo.PlayerProfiles(UserId);
    CREATE NONCLUSTERED INDEX IX_PlayerProfiles_IsAvailable ON dbo.PlayerProfiles(IsAvailable);
END
GO

-- 4. Create dbo.PlayerEarnings (Financial Commission Ledger)
IF OBJECT_ID('dbo.PlayerEarnings', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.PlayerEarnings (
        EarningId INT IDENTITY(1,1) PRIMARY KEY,
        PlayerId NVARCHAR(450) NOT NULL FOREIGN KEY REFERENCES dbo.Users(UserId),
        OrderId NVARCHAR(450) NOT NULL FOREIGN KEY REFERENCES dbo.Orders(OrderId),
        OrderPriceSnapshot DECIMAL(18,2) NOT NULL,
        CommissionRate DECIMAL(5,2) NOT NULL,
        PlayerPayoutAmount DECIMAL(18,2) NOT NULL,
        PlatformFeeAmount DECIMAL(18,2) NOT NULL,
        PayoutStatus NVARCHAR(50) NOT NULL DEFAULT 'Pending', -- 'Pending', 'Approved', 'Paid'
        PayoutMethod NVARCHAR(50) NULL, -- 'PayPal', 'Crypto USDT', 'Bank Transfer'
        PaidAt DATETIME2 NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
    );

    CREATE NONCLUSTERED INDEX IX_PlayerEarnings_PlayerId ON dbo.PlayerEarnings(PlayerId);
    CREATE NONCLUSTERED INDEX IX_PlayerEarnings_OrderId ON dbo.PlayerEarnings(OrderId);
END
GO

-- 5. Create dbo.OrderMatchLogs (Live Score Progression by Booster)
IF OBJECT_ID('dbo.OrderMatchLogs', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.OrderMatchLogs (
        LogId INT IDENTITY(1,1) PRIMARY KEY,
        OrderId NVARCHAR(450) NOT NULL FOREIGN KEY REFERENCES dbo.Orders(OrderId) ON DELETE CASCADE,
        PlayerId NVARCHAR(450) NOT NULL FOREIGN KEY REFERENCES dbo.Users(UserId),
        MatchNumber INT NOT NULL,
        Result NVARCHAR(20) NOT NULL, -- 'Win', 'Loss'
        MatchScoreLabel NVARCHAR(100) NOT NULL, -- e.g. "4-1 Win (Rage Quit)"
        CurrentTotalWins INT NOT NULL,
        CurrentTotalLosses INT NOT NULL,
        ProgressPercentage INT NOT NULL,
        BoosterComment NVARCHAR(500) NULL,
        VpnIpAddress NVARCHAR(50) NULL,
        VpnCity NVARCHAR(100) NULL,
        LoggedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
    );

    CREATE NONCLUSTERED INDEX IX_OrderMatchLogs_OrderId ON dbo.OrderMatchLogs(OrderId);
END
GO

-- 6. Create dbo.OrderProofs (Screenshots, VOD links for Admin Verification)
IF OBJECT_ID('dbo.OrderProofs', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.OrderProofs (
        ProofId INT IDENTITY(1,1) PRIMARY KEY,
        OrderId NVARCHAR(450) NOT NULL FOREIGN KEY REFERENCES dbo.Orders(OrderId) ON DELETE CASCADE,
        UploadedByUserId NVARCHAR(450) NOT NULL FOREIGN KEY REFERENCES dbo.Users(UserId),
        ProofType NVARCHAR(50) NOT NULL DEFAULT 'Screenshot', -- 'Screenshot', 'VOD_Link', 'Scoreboard'
        FileName NVARCHAR(255) NOT NULL,
        FileUrl NVARCHAR(1000) NOT NULL,
        Notes NVARCHAR(500) NULL,
        AdminApproved BIT NOT NULL DEFAULT 0,
        AdminApprovedBy NVARCHAR(450) NULL,
        AdminApprovedAt DATETIME2 NULL,
        UploadedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
    );

    CREATE NONCLUSTERED INDEX IX_OrderProofs_OrderId ON dbo.OrderProofs(OrderId);
END
GO

-- 7. Create dbo.OrderAuditLogs (Admin-Only Security & Action Trail)
IF OBJECT_ID('dbo.OrderAuditLogs', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.OrderAuditLogs (
        AuditId INT IDENTITY(1,1) PRIMARY KEY,
        OrderId NVARCHAR(450) NOT NULL FOREIGN KEY REFERENCES dbo.Orders(OrderId) ON DELETE CASCADE,
        ActorUserId NVARCHAR(450) NULL,
        ActorRole NVARCHAR(50) NOT NULL, -- 'Admin', 'Player', 'Customer', 'System'
        ActionType NVARCHAR(100) NOT NULL, -- 'Created', 'Claimed', 'StatusChanged', 'ProgressUpdated', 'ProofUploaded', 'Approved'
        OldStatus NVARCHAR(50) NULL,
        NewStatus NVARCHAR(50) NULL,
        Description NVARCHAR(MAX) NOT NULL,
        IpAddress NVARCHAR(50) NULL,
        Timestamp DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
    );

    CREATE NONCLUSTERED INDEX IX_OrderAuditLogs_OrderId ON dbo.OrderAuditLogs(OrderId);
    CREATE NONCLUSTERED INDEX IX_OrderAuditLogs_Timestamp ON dbo.OrderAuditLogs(Timestamp DESC);
END
GO

-- 8. Create dbo.OrderMessages (Customer - Booster - Admin Secure Chat)
IF OBJECT_ID('dbo.OrderMessages', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.OrderMessages (
        MessageId INT IDENTITY(1,1) PRIMARY KEY,
        OrderId NVARCHAR(450) NOT NULL FOREIGN KEY REFERENCES dbo.Orders(OrderId) ON DELETE CASCADE,
        SenderUserId NVARCHAR(450) NOT NULL FOREIGN KEY REFERENCES dbo.Users(UserId),
        SenderRole NVARCHAR(50) NOT NULL, -- 'Customer', 'Player', 'Admin'
        MessageText NVARCHAR(MAX) NOT NULL,
        IsAdminOnlyNote BIT NOT NULL DEFAULT 0, -- If 1, only visible to Admins
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
    );

    CREATE NONCLUSTERED INDEX IX_OrderMessages_OrderId ON dbo.OrderMessages(OrderId);
END
GO


-- ==============================================================
-- STORED PROCEDURES (SPs) FOR ALL BUTTONS & LIFECYCLE WORKFLOWS
-- ==============================================================

-- SP 1: sp_CreateFullOrder (Invoked on Checkout / Direct Order)
CREATE OR ALTER PROCEDURE dbo.sp_CreateFullOrder
    @OrderNumber NVARCHAR(50),
    @UserId NVARCHAR(450) = NULL,
    @CustomerName NVARCHAR(100),
    @CustomerEmail NVARCHAR(256),
    @GamerTag NVARCHAR(100),
    @ServiceId NVARCHAR(100),
    @ServiceName NVARCHAR(200),
    @Platform NVARCHAR(50) = 'PS5',
    @ContactMethod NVARCHAR(50) = 'WhatsApp',
    @PaymentMethod NVARCHAR(50) = 'Card / WhatsApp',
    @PriceSnapshot DECIMAL(18,2),
    @CustomerCredentialsEncrypted NVARCHAR(MAX) = NULL,
    @WhatsAppReference NVARCHAR(100) = NULL,
    @DiscordUserId NVARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;

    BEGIN TRY
        -- Ensure Customer user exists
        DECLARE @ActualUserId NVARCHAR(450) = @UserId;
        IF @ActualUserId IS NULL OR NOT EXISTS (SELECT 1 FROM dbo.Users WHERE UserId = @ActualUserId)
        BEGIN
            -- Check if user exists by email
            SELECT @ActualUserId = UserId FROM dbo.Users WHERE Email = @CustomerEmail;
            IF @ActualUserId IS NULL
            BEGIN
                SET @ActualUserId = NEWID();
                INSERT INTO dbo.Users (UserId, DisplayName, Email, Role, Status, CreatedAt, UpdatedAt)
                VALUES (@ActualUserId, @CustomerName, @CustomerEmail, 'Customer', 'Active', SYSUTCDATETIME(), SYSUTCDATETIME());
            END
        END

        DECLARE @OrderId NVARCHAR(450) = NEWID();

        -- Insert Order
        INSERT INTO dbo.Orders (
            OrderId, OrderNumber, UserId, ServiceId, ServiceName, ContactMethod, Status, 
            PriceSnapshot, Platform, CustomerName, CustomerEmail, GamerTag, DiscordUserId, 
            WhatsAppReference, CreatedAt, UpdatedAt, CurrentScore, ProgressPercentage,
            CustomerCredentialsEncrypted, PaymentMethod, PaymentStatus
        )
        VALUES (
            @OrderId, @OrderNumber, @ActualUserId, @ServiceId, @ServiceName, @ContactMethod, 'Pending',
            @PriceSnapshot, @Platform, @CustomerName, @CustomerEmail, @GamerTag, @DiscordUserId,
            @WhatsAppReference, SYSUTCDATETIME(), SYSUTCDATETIME(), 'Awaiting Booster Assignment', 0,
            @CustomerCredentialsEncrypted, @PaymentMethod, 'Paid'
        );

        -- Insert Initial Audit Log
        INSERT INTO dbo.OrderAuditLogs (
            OrderId, ActorUserId, ActorRole, ActionType, OldStatus, NewStatus, Description, Timestamp
        )
        VALUES (
            @OrderId, @ActualUserId, 'Customer', 'Created', NULL, 'Pending', 
            CONCAT('Order #', @OrderNumber, ' placed for service: ', @ServiceName, ' ($', @PriceSnapshot, ') on ', @Platform),
            SYSUTCDATETIME()
        );

        -- Insert Initial Status History
        INSERT INTO dbo.OrderStatusHistory (
            HistoryId, OrderId, PreviousStatus, NewStatus, ChangedByUserId, ChangedAt, Notes
        )
        VALUES (
            NEWID(), @OrderId, 'Created', 'Pending', @ActualUserId, SYSUTCDATETIME(), 'Order placed and queued for booster assignment'
        );

        COMMIT TRANSACTION;

        -- Return newly created order
        SELECT * FROM dbo.Orders WHERE OrderId = @OrderId;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO


-- SP 2: sp_PlayerClaimOrder (Invoked when Booster accepts open order)
CREATE OR ALTER PROCEDURE dbo.sp_PlayerClaimOrder
    @OrderId NVARCHAR(450),
    @PlayerId NVARCHAR(450),
    @BoosterVpnLocation NVARCHAR(150) = 'United Kingdom (Residential)'
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;

    BEGIN TRY
        -- Verify order is still unassigned & in Pending status (prevents race condition)
        IF NOT EXISTS (SELECT 1 FROM dbo.Orders WHERE OrderId = @OrderId AND (Status = 'Pending' OR Status = 'Open') AND AssignedPlayerId IS NULL)
        BEGIN
            RAISERROR('Order is no longer available or has already been claimed by another booster.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- Verify Player exists and is approved
        DECLARE @ProNickname NVARCHAR(100);
        SELECT @ProNickname = ProNickname FROM dbo.PlayerProfiles WHERE UserId = @PlayerId AND ApplicationStatus = 'Approved';
        IF @ProNickname IS NULL
        BEGIN
            -- Fallback to User DisplayName
            SELECT @ProNickname = DisplayName FROM dbo.Users WHERE UserId = @PlayerId;
        END

        -- Update Order
        UPDATE dbo.Orders
        SET AssignedPlayerId = @PlayerId,
            Status = 'InProgress',
            AssignedAt = SYSUTCDATETIME(),
            StartedAt = SYSUTCDATETIME(),
            UpdatedAt = SYSUTCDATETIME(),
            BoosterVpnLocation = @BoosterVpnLocation,
            CurrentScore = 'Booster Assigned & VPN Connected. Match 1 Starting.'
        WHERE OrderId = @OrderId;

        -- Increment active orders for player profile
        UPDATE dbo.PlayerProfiles
        SET ActiveOrdersCount = ActiveOrdersCount + 1
        WHERE UserId = @PlayerId;

        -- Log Audit
        INSERT INTO dbo.OrderAuditLogs (
            OrderId, ActorUserId, ActorRole, ActionType, OldStatus, NewStatus, Description, Timestamp
        )
        VALUES (
            @OrderId, @PlayerId, 'Player', 'Claimed', 'Pending', 'InProgress',
            CONCAT('Order claimed by verified pro booster: ', @ProNickname, ' with VPN in ', @BoosterVpnLocation),
            SYSUTCDATETIME()
        );

        -- Add Status History
        INSERT INTO dbo.OrderStatusHistory (
            HistoryId, OrderId, PreviousStatus, NewStatus, ChangedByUserId, ChangedAt, Notes
        )
        VALUES (
            NEWID(), @OrderId, 'Pending', 'InProgress', @PlayerId, SYSUTCDATETIME(),
            CONCAT('Booster ', @ProNickname, ' started order on ', @BoosterVpnLocation)
        );

        COMMIT TRANSACTION;

        SELECT o.*, u.DisplayName AS BoosterName 
        FROM dbo.Orders o 
        LEFT JOIN dbo.Users u ON o.AssignedPlayerId = u.UserId 
        WHERE o.OrderId = @OrderId;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO


-- SP 3: sp_PlayerUpdateProgress (Booster logs live score e.g. 7 wins out of 15)
CREATE OR ALTER PROCEDURE dbo.sp_PlayerUpdateProgress
    @OrderId NVARCHAR(450),
    @PlayerId NVARCHAR(450),
    @MatchScoreLabel NVARCHAR(100),
    @ProgressPercentage INT,
    @MatchesWon INT,
    @MatchesLost INT,
    @BoosterComment NVARCHAR(500) = NULL,
    @VpnCity NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- Verify player is assigned to this order or is admin
    IF NOT EXISTS (SELECT 1 FROM dbo.Orders WHERE OrderId = @OrderId AND (AssignedPlayerId = @PlayerId OR @PlayerId IN (SELECT UserId FROM dbo.Users WHERE Role = 'Admin')))
    BEGIN
        RAISERROR('Unauthorized. You are not assigned to this order.', 16, 1);
        RETURN;
    END

    -- Update Order
    UPDATE dbo.Orders
    SET CurrentScore = @MatchScoreLabel,
        ProgressPercentage = @ProgressPercentage,
        UpdatedAt = SYSUTCDATETIME()
    WHERE OrderId = @OrderId;

    -- Record Match Log
    INSERT INTO dbo.OrderMatchLogs (
        OrderId, PlayerId, MatchNumber, Result, MatchScoreLabel, CurrentTotalWins, 
        CurrentTotalLosses, ProgressPercentage, BoosterComment, VpnCity, LoggedAt
    )
    VALUES (
        @OrderId, @PlayerId, (@MatchesWon + @MatchesLost), 
        CASE WHEN @MatchesWon > 0 THEN 'Win' ELSE 'In-Progress' END,
        @MatchScoreLabel, @MatchesWon, @MatchesLost, @ProgressPercentage, @BoosterComment, @VpnCity, SYSUTCDATETIME()
    );

    -- Audit Log
    INSERT INTO dbo.OrderAuditLogs (
        OrderId, ActorUserId, ActorRole, ActionType, OldStatus, NewStatus, Description, Timestamp
    )
    VALUES (
        @OrderId, @PlayerId, 'Player', 'ProgressUpdated', 'InProgress', 'InProgress',
        CONCAT('Progress updated: ', @MatchScoreLabel, ' (', @ProgressPercentage, '%). Notes: ', ISNULL(@BoosterComment, 'None')),
        SYSUTCDATETIME()
    );

    SELECT * FROM dbo.Orders WHERE OrderId = @OrderId;
END;
GO


-- SP 4: sp_PlayerCompleteOrderWithProof (Booster finishes order and uploads proof)
CREATE OR ALTER PROCEDURE dbo.sp_PlayerCompleteOrderWithProof
    @OrderId NVARCHAR(450),
    @PlayerId NVARCHAR(450),
    @ProofFileName NVARCHAR(255),
    @ProofFileUrl NVARCHAR(1000),
    @ProofNotes NVARCHAR(500) = 'Final match results screenshot'
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;

    BEGIN TRY
        -- Update Order status to UnderReview / Completed
        UPDATE dbo.Orders
        SET Status = 'UnderReview',
            ProgressPercentage = 100,
            CurrentScore = 'Service 100% Completed • Proof Uploaded • Pending Final Verification',
            UpdatedAt = SYSUTCDATETIME()
        WHERE OrderId = @OrderId;

        -- Insert Proof
        INSERT INTO dbo.OrderProofs (
            OrderId, UploadedByUserId, ProofType, FileName, FileUrl, Notes, AdminApproved, UploadedAt
        )
        VALUES (
            @OrderId, @PlayerId, 'Screenshot', @ProofFileName, @ProofFileUrl, @ProofNotes, 0, SYSUTCDATETIME()
        );

        -- Calculate Player Commission
        DECLARE @OrderPrice DECIMAL(18,2);
        SELECT @OrderPrice = PriceSnapshot FROM dbo.Orders WHERE OrderId = @OrderId;

        DECLARE @CommissionRate DECIMAL(5,2) = 70.00;
        SELECT @CommissionRate = CommissionRate FROM dbo.PlayerProfiles WHERE UserId = @PlayerId;
        IF @CommissionRate IS NULL SET @CommissionRate = 70.00;

        DECLARE @PlayerPayout DECIMAL(18,2) = ROUND(@OrderPrice * (@CommissionRate / 100.0), 2);
        DECLARE @PlatformFee DECIMAL(18,2) = @OrderPrice - @PlayerPayout;

        -- Record Earning Entry
        IF NOT EXISTS (SELECT 1 FROM dbo.PlayerEarnings WHERE OrderId = @OrderId)
        BEGIN
            INSERT INTO dbo.PlayerEarnings (
                PlayerId, OrderId, OrderPriceSnapshot, CommissionRate, PlayerPayoutAmount, 
                PlatformFeeAmount, PayoutStatus, CreatedAt
            )
            VALUES (
                @PlayerId, @OrderId, @OrderPrice, @CommissionRate, @PlayerPayout, @PlatformFee, 'Pending', SYSUTCDATETIME()
            );
        END

        -- Audit Log
        INSERT INTO dbo.OrderAuditLogs (
            OrderId, ActorUserId, ActorRole, ActionType, OldStatus, NewStatus, Description, Timestamp
        )
        VALUES (
            @OrderId, @PlayerId, 'Player', 'ProofUploaded', 'InProgress', 'UnderReview',
            CONCAT('Order completed by booster. Proof attached: ', @ProofFileName, '. Payout queued: $', @PlayerPayout),
            SYSUTCDATETIME()
        );

        COMMIT TRANSACTION;

        SELECT * FROM dbo.Orders WHERE OrderId = @OrderId;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO


-- SP 5: sp_AdminApproveAndFinalizeOrder (Admin approves proof & releases payout)
CREATE OR ALTER PROCEDURE dbo.sp_AdminApproveAndFinalizeOrder
    @OrderId NVARCHAR(450),
    @AdminUserId NVARCHAR(450),
    @AdminRemarks NVARCHAR(MAX) = 'Verified Rank 1 match proof. Pack rewards untouched.'
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;

    BEGIN TRY
        -- Verify admin user
        IF NOT EXISTS (SELECT 1 FROM dbo.Users WHERE UserId = @AdminUserId AND Role = 'Admin')
        BEGIN
            RAISERROR('Unauthorized. Admin role required.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- Update Order
        UPDATE dbo.Orders
        SET Status = 'Completed',
            CompletedAt = SYSUTCDATETIME(),
            UpdatedAt = SYSUTCDATETIME(),
            AdminRemarks = @AdminRemarks,
            CurrentScore = 'Completed & Verified • Packs Untouched In Store'
        WHERE OrderId = @OrderId;

        -- Mark Proofs Approved
        UPDATE dbo.OrderProofs
        SET AdminApproved = 1,
            AdminApprovedBy = @AdminUserId,
            AdminApprovedAt = SYSUTCDATETIME()
        WHERE OrderId = @OrderId;

        -- Approve Player Earnings
        UPDATE dbo.PlayerEarnings
        SET PayoutStatus = 'Approved'
        WHERE OrderId = @OrderId;

        -- Update Player Completed Count
        DECLARE @PlayerId NVARCHAR(450);
        SELECT @PlayerId = AssignedPlayerId FROM dbo.Orders WHERE OrderId = @OrderId;

        IF @PlayerId IS NOT NULL
        BEGIN
            UPDATE dbo.PlayerProfiles
            SET TotalCompletedOrders = TotalCompletedOrders + 1,
                ActiveOrdersCount = CASE WHEN ActiveOrdersCount > 0 THEN ActiveOrdersCount - 1 ELSE 0 END,
                TotalEarned = TotalEarned + (SELECT ISNULL(SUM(PlayerPayoutAmount), 0) FROM dbo.PlayerEarnings WHERE OrderId = @OrderId)
            WHERE UserId = @PlayerId;
        END

        -- Audit Log
        INSERT INTO dbo.OrderAuditLogs (
            OrderId, ActorUserId, ActorRole, ActionType, OldStatus, NewStatus, Description, Timestamp
        )
        VALUES (
            @OrderId, @AdminUserId, 'Admin', 'Approved', 'UnderReview', 'Completed',
            CONCAT('Order approved and finalized by admin. Remarks: ', @AdminRemarks),
            SYSUTCDATETIME()
        );

        COMMIT TRANSACTION;

        SELECT * FROM dbo.Orders WHERE OrderId = @OrderId;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO


-- SP 6: sp_GetAdminDashboardAnalytics (Admin-Only Comprehensive Business Intelligence)
CREATE OR ALTER PROCEDURE dbo.sp_GetAdminDashboardAnalytics
AS
BEGIN
    SET NOCOUNT ON;

    -- 1. High level statistics
    SELECT 
        (SELECT COUNT(*) FROM dbo.Orders) AS TotalOrdersCount,
        (SELECT COUNT(*) FROM dbo.Orders WHERE Status = 'Pending') AS PendingOrdersCount,
        (SELECT COUNT(*) FROM dbo.Orders WHERE Status = 'InProgress') AS InProgressOrdersCount,
        (SELECT COUNT(*) FROM dbo.Orders WHERE Status = 'UnderReview') AS UnderReviewOrdersCount,
        (SELECT COUNT(*) FROM dbo.Orders WHERE Status = 'Completed') AS CompletedOrdersCount,
        (SELECT ISNULL(SUM(PriceSnapshot), 0) FROM dbo.Orders WHERE Status = 'Completed') AS TotalRevenue,
        (SELECT COUNT(*) FROM dbo.PlayerProfiles WHERE ApplicationStatus = 'Approved') AS ActiveBoostersCount,
        (SELECT COUNT(*) FROM dbo.Users WHERE Role = 'Customer') AS TotalCustomersCount;

    -- 2. Top performing pro boosters
    SELECT TOP 5
        pp.ProNickname,
        pp.PlatformSpecialty,
        pp.TotalCompletedOrders,
        pp.WinRatePercentage,
        pp.TotalEarned,
        u.Email
    FROM dbo.PlayerProfiles pp
    JOIN dbo.Users u ON pp.UserId = u.UserId
    ORDER BY pp.TotalCompletedOrders DESC;

    -- 3. Recent 10 audit events
    SELECT TOP 10
        al.AuditId,
        al.OrderId,
        o.OrderNumber,
        al.ActorRole,
        al.ActionType,
        al.Description,
        al.Timestamp
    FROM dbo.OrderAuditLogs al
    JOIN dbo.Orders o ON al.OrderId = o.OrderId
    ORDER BY al.Timestamp DESC;
END;
GO


-- SP 7: sp_TrackOrderPublic (Safe Public Tracking for Customers)
CREATE OR ALTER PROCEDURE dbo.sp_TrackOrderPublic
    @Reference NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        o.OrderId,
        o.OrderNumber,
        o.ServiceName,
        o.Platform,
        o.Status,
        o.PriceSnapshot,
        o.ContactMethod,
        o.CurrentScore,
        o.ProgressPercentage,
        o.BoosterVpnLocation,
        ISNULL(p.ProNickname, 'Pro Esports Booster') AS BoosterNickname,
        o.CreatedAt,
        o.CompletedAt,
        CASE WHEN EXISTS (SELECT 1 FROM dbo.OrderProofs WHERE OrderId = o.OrderId AND AdminApproved = 1) THEN 1 ELSE 0 END AS HasVerifiedProof
    FROM dbo.Orders o
    LEFT JOIN dbo.PlayerProfiles p ON o.AssignedPlayerId = p.UserId
    WHERE o.OrderNumber = @Reference OR o.OrderId = @Reference OR o.WhatsAppReference = @Reference;

    -- Return match progress events for this order
    SELECT 
        m.MatchNumber,
        m.Result,
        m.MatchScoreLabel,
        m.BoosterComment,
        m.LoggedAt
    FROM dbo.OrderMatchLogs m
    JOIN dbo.Orders o ON m.OrderId = o.OrderId
    WHERE o.OrderNumber = @Reference OR o.OrderId = @Reference
    ORDER BY m.LoggedAt ASC;
END;
GO


-- ==============================================================
-- SEED SAMPLE BOOSTERS, ADMINS & COMPREHENSIVE INITIAL DATA
-- ==============================================================

-- Admin User
IF NOT EXISTS (SELECT 1 FROM dbo.Users WHERE Email = 'admin@fcboostpro.com')
BEGIN
    INSERT INTO dbo.Users (UserId, DisplayName, Email, Role, Status, CreatedAt, UpdatedAt)
    VALUES ('usr-admin-01', 'EA Sports FC Operations Lead', 'admin@fcboostpro.com', 'Admin', 'Active', SYSUTCDATETIME(), SYSUTCDATETIME());
END
GO

-- Pro Booster 1: Alex Kaiser
IF NOT EXISTS (SELECT 1 FROM dbo.Users WHERE Email = 'kaiser@fcboostpro.com')
BEGIN
    INSERT INTO dbo.Users (UserId, DisplayName, Email, Role, Status, CreatedAt, UpdatedAt)
    VALUES ('usr-booster-kaiser', 'Alex "Kaiser"', 'kaiser@fcboostpro.com', 'Player', 'Active', SYSUTCDATETIME(), SYSUTCDATETIME());

    INSERT INTO dbo.PlayerProfiles (
        UserId, ProNickname, PlatformSpecialty, CompetitiveRankTier, WeekendLeagueAverageWins,
        WinRatePercentage, TotalCompletedOrders, IsAvailable, CommissionRate, VpnResidentialCountry
    )
    VALUES (
        'usr-booster-kaiser', 'Kaiser_EA (Top 64 Global)', 'PS5', 'Rank 1 Specialist (15-0)', 15,
        99.20, 142, 1, 75.00, 'United Kingdom (London)'
    );
END
GO

-- Pro Booster 2: Tariq Flash
IF NOT EXISTS (SELECT 1 FROM dbo.Users WHERE Email = 'flash@fcboostpro.com')
BEGIN
    INSERT INTO dbo.Users (UserId, DisplayName, Email, Role, Status, CreatedAt, UpdatedAt)
    VALUES ('usr-booster-flash', 'Tariq "Flash"', 'flash@fcboostpro.com', 'Player', 'Active', SYSUTCDATETIME(), SYSUTCDATETIME());

    INSERT INTO dbo.PlayerProfiles (
        UserId, ProNickname, PlatformSpecialty, CompetitiveRankTier, WeekendLeagueAverageWins,
        WinRatePercentage, TotalCompletedOrders, IsAvailable, CommissionRate, VpnResidentialCountry
    )
    VALUES (
        'usr-booster-flash', 'Flash_FUT (Elite Div)', 'PC', 'Elite Division Champion', 14,
        98.40, 98, 1, 70.00, 'Germany (Frankfurt)'
    );
END
GO

-- Sample Orders with rich progression
IF NOT EXISTS (SELECT 1 FROM dbo.Orders WHERE OrderNumber = 'FC-ORD-94821')
BEGIN
    EXEC dbo.sp_CreateFullOrder 
        @OrderNumber = 'FC-ORD-94821',
        @UserId = NULL,
        @CustomerName = 'Marcus K.',
        @CustomerEmail = 'marcus.k@sample.com',
        @GamerTag = 'MarcusStriker_99',
        @ServiceId = 'ut-champions',
        @ServiceName = 'UT Champions Finals Boost (Rank 1 - 15 Wins)',
        @Platform = 'PS5',
        @ContactMethod = 'WhatsApp',
        @PaymentMethod = 'Stripe (Visa)',
        @PriceSnapshot = 119.99,
        @CustomerCredentialsEncrypted = 'EncryptedCredentialsPlaceholder[PSN:MarcusStriker_99]',
        @WhatsAppReference = 'FC-ORD-94821';

    -- Claim by Kaiser
    DECLARE @OrdId1 NVARCHAR(450);
    SELECT @OrdId1 = OrderId FROM dbo.Orders WHERE OrderNumber = 'FC-ORD-94821';

    EXEC dbo.sp_PlayerClaimOrder 
        @OrderId = @OrdId1, 
        @PlayerId = 'usr-booster-kaiser', 
        @BoosterVpnLocation = 'London, United Kingdom (Residential)';

    -- Log Progress
    EXEC dbo.sp_PlayerUpdateProgress
        @OrderId = @OrdId1,
        @PlayerId = 'usr-booster-kaiser',
        @MatchScoreLabel = '12 / 15 Wins Done (12-0 Unbeaten Streak)',
        @ProgressPercentage = 80,
        @MatchesWon = 12,
        @MatchesLost = 0,
        @BoosterComment = 'Cruising with 4-3-2-1 formation. Team morale high. Finishing last 3 matches shortly.',
        @VpnCity = 'London';
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Orders WHERE OrderNumber = 'FC-ORD-89312')
BEGIN
    EXEC dbo.sp_CreateFullOrder 
        @OrderNumber = 'FC-ORD-89312',
        @UserId = NULL,
        @CustomerName = 'Liam D.',
        @CustomerEmail = 'liam.d@sample.com',
        @GamerTag = 'VortexLiam',
        @ServiceId = 'division-rivals',
        @ServiceName = 'Division Rivals Weekly 7 Wins',
        @Platform = 'PC',
        @ContactMethod = 'Discord',
        @PaymentMethod = 'PayPal Express',
        @PriceSnapshot = 39.99,
        @WhatsAppReference = 'FC-ORD-89312';

    DECLARE @OrdId2 NVARCHAR(450);
    SELECT @OrdId2 = OrderId FROM dbo.Orders WHERE OrderNumber = 'FC-ORD-89312';

    EXEC dbo.sp_PlayerClaimOrder 
        @OrderId = @OrdId2, 
        @PlayerId = 'usr-booster-flash', 
        @BoosterVpnLocation = 'Frankfurt, Germany';

    EXEC dbo.sp_PlayerCompleteOrderWithProof
        @OrderId = @OrdId2,
        @PlayerId = 'usr-booster-flash',
        @ProofFileName = 'rivals_7wins_verified.png',
        @ProofFileUrl = '/proofs/rivals_7wins_verified.png',
        @ProofNotes = '7 straight wins in Div 1. Packs sealed in store.';

    EXEC dbo.sp_AdminApproveAndFinalizeOrder
        @OrderId = @OrdId2,
        @AdminUserId = 'usr-admin-01',
        @AdminRemarks = 'Confirmed 7 wins. Verified no packs opened.';
END
GO
