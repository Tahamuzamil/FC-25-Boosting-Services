# 🎮 Boosting Haven — Discord Community & Automated Ticketing System

This document outlines the full architecture, channel blueprint, role permissions, and bot deployment guide for the **Boosting Haven** Discord community.

---

## 1. Automated Discord Bot Capabilities (`DiscordBotService.cs`)

The C# backend (`server/FCBoosting.Api/Services/DiscordBotService.cs`) is pre-wired with the `Discord.Net` gateway:

1. **Interactive Ticket Panel (`/panel`)**: Deploys an embed with an **"🎫 Open Boost Ticket"** button into your `#order-tickets` channel.
2. **Dynamic 1-on-1 Private Channel Creation**: When a customer clicks **"Open Boost Ticket"** or orders via the website, the bot automatically:
   - Prompts a modal for **GamerTag**, **Platform**, and **Service**.
   - Creates a private channel: `ticket-fc-ord-xxxxx` under the `🎫 │ SUPPORT TICKETS` category.
   - Denies `@everyone` access while granting read/write/attach permissions exclusively to the customer, assigned pro booster, and admins.
   - Posts a rich ticket embed with action buttons:
     - 🎮 **Claim as Pro Booster**
     - 🔒 **Close Ticket**
3. **Pro Booster Claiming from Discord**: Pro boosters can click **"Claim as Pro Booster"** directly inside the ticket channel to lock the order in SQL Server and update the status to `InProgress`.
4. **Automated Status Notifications (DMs)**: When an admin or booster updates an order status on the website dashboard (e.g. `InProgress` $\rightarrow$ `UnderReview` $\rightarrow$ `Completed`), the bot automatically sends a Discord DM to the customer with live notes.
5. **Slash Commands**:
   - `/order reference:[code]`: Looks up order details and generates a private ticket.
   - `/status order_number:[code]`: Displays real-time match progress, current score, and VPN route.
   - `/panel`: Deploys the interactive ticket panel into the current channel (Admin only).

---

## 2. Server Category & Channel Blueprint

Set up your Discord server following this recommended structure:

```
📁 📢 │ INFORMATION
├── 📜 #welcome-and-rules     (Read-only, server guidelines & ban-free guarantee)
├── 📢 #announcements          (Weekend League updates, promo codes, flash sales)
├── 💰 #pricing-and-catalog   (Official pricing sheet & link to website)
└── ⭐ #vouches-and-proof     (Screenshots of 15-0 Rank 1 rewards & reviews)

📁 🎫 │ SUPPORT & TICKETS
├── 🎫 #order-tickets         (Host the /panel button here for 1-click tickets)
└── ❓ #ask-support           (General pre-purchase questions)

📁 🔒 │ ACTIVE 1-ON-1 BOOSTS (Managed Automatically by Bot)
├── 🔒 #ticket-fc-ord-12345   (Customer + Pro Booster + Admin only)
├── 🔒 #ticket-fc-ord-67890   (Customer + Pro Booster + Admin only)
└── ...

📁 🏆 │ PRO BOOSTER LOUNGE (Restricted to @Pro Booster & @Admin)
├── 📌 #orders-feed           (Live webhook notifications of new web orders)
├── 💬 #booster-chat          (Internal booster discussion)
└── 🛡️ #vpn-guidelines        (Residential VPN IP pool & subnet rules)
```

---

## 3. Server Roles & Permissions Matrix

| Role | Color | Key Permissions | Access |
| :--- | :--- | :--- | :--- |
| **👑 Admin / Owner** | Red (`#FF3B30`) | Administrator, Manage Channels, Manage Messages | All channels |
| **🎮 Verified Pro Booster** | Neon Green (`#00F59B`) | View Channels, Send Messages, Attach Files | Ticket channels, Booster Lounge |
| **⭐ VIP Customer** | Gold (`#FFB800`) | Standard member permissions, priority role | Public channels, Tickets |
| **👤 Customer / Member** | Gray / Default | View Public Channels, Open Tickets | Public channels only |
| **🤖 FC Boost Bot** | Blue (`#00D6FF`) | Manage Channels, Manage Roles, Send Messages, Embed Links, Attach Files | All channels |

---

## 4. How to Connect Your Discord Bot (3 Easy Steps)

### Step 1: Create Your Bot on Discord Developer Portal
1. Go to [https://discord.com/developers/applications](https://discord.com/developers/applications).
2. Click **New Application**, name it **`FC BOOST PRO`**, and upload an avatar logo.
3. In the left menu, click **Bot**:
   - Click **Reset Token** and copy your **Bot Token**.
   - Under **Privileged Gateway Intents**, enable:
     - ✅ **Server Members Intent**
     - ✅ **Message Content Intent**
4. In the left menu, click **OAuth2** $\rightarrow$ **URL Generator**:
   - Scopes: Select `bot` and `applications.commands`.
   - Bot Permissions: Select `Administrator` (or `Manage Channels`, `Manage Roles`, `Send Messages`, `Embed Links`, `Attach Files`, `Read Message History`).
   - Copy the generated URL and paste it in your browser to invite the bot to your Discord server.

### Step 2: Configure `appsettings.json`
Open [`server/FCBoosting.Api/appsettings.json`](file:///z:/FC-25%20Boosting%20Services/server/FCBoosting.Api/appsettings.json) and paste your credentials:

```json
"Discord": {
  "BotToken": "YOUR_COPIED_DISCORD_BOT_TOKEN_HERE",
  "GuildId": "YOUR_DISCORD_SERVER_ID_HERE",
  "OrderChannelId": "YOUR_ORDER_TICKETS_CHANNEL_ID_HERE"
}
```

> **Tip to get Server ID & Channel ID**: In Discord, go to **User Settings** $\rightarrow$ **Advanced** $\rightarrow$ Turn on **Developer Mode**. Then right-click your Server icon to **Copy Server ID**, and right-click your `#order-tickets` channel to **Copy Channel ID**.

### Step 3: Launch and Deploy the Ticket Panel
1. Start the API (`dotnet run --project server/FCBoosting.Api/FCBoosting.Api.csproj`).
2. Go to your Discord server's `#order-tickets` channel.
3. Type:
   ```text
   /panel
   ```
4. Press Enter. The bot will instantly deploy the official interactive **"🎫 Open Boost Ticket"** panel!
